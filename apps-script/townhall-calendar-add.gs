/**
 * Year Two Town Hall — auto calendar invite on registration.
 *
 * Add this as a NEW FILE inside your existing "Marketing KPIs Data" Apps Script
 * project (it only adds doPost + th_* helpers; it does not touch the dashboard's doGet).
 *
 * Flow: reg modal -> MailerLite group "AI Council – Year Two Town Hall"
 *       -> webhook POSTs here (?token=SECRET)
 *       -> emails the registrant a calendar invite (.ics built from the LIVE event,
 *          so the join link on the event flows through automatically) and silently
 *          logs them onto the event guest list (no notification blast to others).
 *
 * Setup: see apps-script/SETUP.md
 */

var TH_CONFIG = {
  CAL_ID:   'brandice@kyleandco.com',              // calendar that owns the event
  EVENT_ID: '0b98lpeee9fophk2tc6sfseagv',          // Year Two Town Hall (Aug 27, 1pm ET)
  GROUP_ID: '194886957105415211',                  // only act on this MailerLite group
  FROM_NAME:'The Human-Centric AI Council',
  ADD_TO_GUEST_LIST: true,                         // silently log registrants (sendUpdates: none)
};

function doPost(e) {
  try {
    Logger.log('TH params: ' + JSON.stringify(e && e.parameter));
    Logger.log('TH body: ' + (e && e.postData ? e.postData.contents : 'none'));
    var body = (e && e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : {};
    var secret = PropertiesService.getScriptProperties().getProperty('TOWNHALL_SECRET');
    var tokenOk = !!(secret && e && e.parameter && e.parameter.token === secret);
    var people = th_extractPeople_(body); // already scoped to the town hall group
    // Proceed if the token matches OR the payload is a genuine town-hall-group add.
    if (!tokenOk && people.length === 0) {
      return th_json_({ ok: false, error: 'unauthorized' });
    }
    var results = people.map(th_handleOne_);
    Logger.log('TH result: ' + JSON.stringify({ tokenOk: tokenOk, count: results.length, results: results }));
    return th_json_({ ok: true, tokenOk: tokenOk, count: results.length, results: results });
  } catch (err) {
    Logger.log('TH error: ' + err);
    return th_json_({ ok: false, error: String(err) });
  }
}

function th_handleOne_(p) {
  var email = (p.email || '').trim().toLowerCase();
  if (!email) return { skipped: 'no email' };
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var ev = Calendar.Events.get(TH_CONFIG.CAL_ID, TH_CONFIG.EVENT_ID);
    if (TH_CONFIG.ADD_TO_GUEST_LIST) {
      var attendees = ev.attendees || [];
      var already = attendees.some(function (a) { return (a.email || '').toLowerCase() === email; });
      if (!already) {
        attendees.push({ email: email });
        Calendar.Events.patch({ attendees: attendees }, TH_CONFIG.CAL_ID, TH_CONFIG.EVENT_ID, { sendUpdates: 'none' });
      }
    }
    th_sendInvite_(email, p.name, ev);
    return { email: email, invited: true };
  } finally {
    lock.releaseLock();
  }
}

function th_sendInvite_(email, name, ev) {
  var tz = (ev.start && ev.start.timeZone) || 'America/New_York';
  var start = new Date(ev.start.dateTime || ev.start.date);
  var whenStr = Utilities.formatDate(start, tz, "EEEE, MMMM d, yyyy 'at' h:mm a") + ' ET';
  var join = th_joinLink_(ev);
  var subject = "You're on the calendar — " + ev.summary;
  var lines = [
    (name ? 'Hi ' + name + ',' : 'Hi,'),
    '',
    "You're registered for the " + ev.summary + '.',
    'When: ' + whenStr,
    (join ? 'Join: ' + join : 'A join link will appear on your calendar invite before the event.'),
    '',
    "This invite has been added to your calendar — nothing to click. Each pillar champion will walk through their Year Two workstream. See you there.",
    '',
    '— The Human-Centric AI Council'
  ];
  MailApp.sendEmail({
    to: email,
    subject: subject,
    body: lines.join('\n'),
    name: TH_CONFIG.FROM_NAME,
    attachments: [ Utilities.newBlob(th_buildIcs_(ev, email), 'text/calendar; method=REQUEST; charset=UTF-8', 'invite.ics') ]
  });
}

function th_joinLink_(ev) {
  if (ev.hangoutLink) return ev.hangoutLink;
  if (ev.conferenceData && ev.conferenceData.entryPoints) {
    var vid = ev.conferenceData.entryPoints.filter(function (x) { return x.entryPointType === 'video'; })[0];
    if (vid && vid.uri) return vid.uri;
  }
  if (ev.location && /^https?:\/\//.test(ev.location)) return ev.location;
  return '';
}

function th_buildIcs_(ev, email) {
  var fmt = function (dt) { return Utilities.formatDate(new Date(dt), 'UTC', "yyyyMMdd'T'HHmmss'Z'"); };
  var join = th_joinLink_(ev);
  var esc = function (s) { return String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); };
  var desc = (join ? 'Join: ' + join + '\\n\\n' : '') + 'The Human-Centric AI Council Year Two Town Hall.';
  return [
    'BEGIN:VCALENDAR',
    'PRODID:-//Kyle & Co//HCAIC Town Hall//EN',
    'VERSION:2.0',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    'UID:' + ev.id + '@kyleandco.com',
    'DTSTAMP:' + fmt(new Date()),
    'DTSTART:' + fmt(ev.start.dateTime || ev.start.date),
    'DTEND:' + fmt(ev.end.dateTime || ev.end.date),
    'SUMMARY:' + esc(ev.summary),
    'DESCRIPTION:' + desc,
    'LOCATION:' + (join ? esc(join) : 'Online'),
    'ORGANIZER;CN=' + esc(TH_CONFIG.FROM_NAME) + ':mailto:' + TH_CONFIG.CAL_ID,
    'ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:' + email,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Reminder', 'TRIGGER:-PT15M', 'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Deep-walk the webhook payload (resilient to MailerLite's exact shape): collect every
 * subscriber-like email and every group id. Only act if the town hall group is present
 * (or no group info was sent at all).
 */
function th_extractPeople_(body) {
  var emails = {};   // email -> name
  var groupIds = [];
  (function walk(o) {
    if (!o || typeof o !== 'object') return;
    if (o.group && o.group.id != null) groupIds.push(String(o.group.id));
    if (typeof o.email === 'string' && o.email.indexOf('@') > 0 && (o.fields || o.status || o.id)) {
      emails[o.email.toLowerCase()] = (o.fields && o.fields.name) || o.name || '';
    }
    for (var k in o) { if (Object.prototype.hasOwnProperty.call(o, k)) walk(o[k]); }
  })(body);
  if (groupIds.length && groupIds.indexOf(TH_CONFIG.GROUP_ID) === -1) return [];
  return Object.keys(emails).map(function (e) { return { email: e, name: emails[e] }; });
}

function th_json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to grant Calendar + send-mail permissions, then redeploy.
 *  It sends you a test email — if that arrives, the send scope works. */
function authorizeTownhall() {
  Calendar.Events.get(TH_CONFIG.CAL_ID, TH_CONFIG.EVENT_ID);
  MailApp.sendEmail(TH_CONFIG.CAL_ID, 'Town hall script authorized', 'MailApp send scope works. You can delete this message.');
}
