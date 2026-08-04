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
    var secret = PropertiesService.getScriptProperties().getProperty('TOWNHALL_SECRET');
    if (!secret || !e || !e.parameter || e.parameter.token !== secret) {
      return th_json_({ ok: false, error: 'unauthorized' });
    }
    var body = (e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : {};
    var people = th_extractPeople_(body);
    var results = people.map(th_handleOne_);
    return th_json_({ ok: true, count: results.length, results: results });
  } catch (err) {
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

/** MailerLite webhook may send a single event or a batch under `events`. Only act on the town hall group. */
function th_extractPeople_(body) {
  var evts = Array.isArray(body.events) ? body.events : [body];
  var people = [];
  evts.forEach(function (ev) {
    var data = (ev && ev.data) ? ev.data : ev;
    var groupId = (data && data.group && String(data.group.id)) ||
                  (ev && ev.group && String(ev.group.id)) || '';
    if (groupId && groupId !== TH_CONFIG.GROUP_ID) return;
    var sub = (data && data.subscriber) || data || {};
    var fields = sub.fields || {};
    var email = sub.email || fields.email;
    if (!email) return;
    people.push({ email: email, name: fields.name || sub.name || '' });
  });
  return people;
}

function th_json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to grant the Calendar + send-mail permissions before redeploying. */
function authorizeTownhall_() {
  Calendar.Events.get(TH_CONFIG.CAL_ID, TH_CONFIG.EVENT_ID);
  MailApp.getRemainingDailyQuota();
}
