/**
 * Year Two Town Hall — auto calendar invite for registrants (POLLING version).
 *
 * Add as a file in the existing "Marketing KPIs Data" project (reuses its ML_API_KEY).
 * A time trigger runs pollTownhall() every few minutes: it reads the town hall group from
 * the MailerLite API, and for anyone new, adds them to the event guest list (silently) and
 * emails them a calendar invite (.ics built from the LIVE event, so the join link on the
 * event flows through automatically). No webhook, no redeploys — time triggers run the
 * latest saved code.
 *
 * One-time setup:
 *   1. Services (+) → add Calendar API.
 *   2. Run authorizeTownhall once → approve permissions (also sends you a test email).
 *   3. Triggers (clock icon) → Add Trigger → function pollTownhall, event source
 *      Time-driven, Minutes timer, Every 5 minutes.
 *   (ML_API_KEY is already a Script Property in this project.)
 */

var TH_CONFIG = {
  CAL_ID:   'brandice@kyleandco.com',
  EVENT_ID: '0b98lpeee9fophk2tc6sfseagv',
  GROUP_ID: '194886957105415211',
  FROM_NAME:'The Human-Centric AI Council',
  ADD_TO_GUEST_LIST: true,
};

/** Scheduled: invite any new members of the town hall group. */
function pollTownhall() {
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('ML_API_KEY');
  if (!apiKey) { Logger.log('TH: no ML_API_KEY property'); return; }

  var processed = {};
  JSON.parse(props.getProperty('TH_PROCESSED') || '[]').forEach(function (e) { processed[e] = 1; });

  var ev = Calendar.Events.get(TH_CONFIG.CAL_ID, TH_CONFIG.EVENT_ID);
  var url = 'https://connect.mailerlite.com/api/groups/' + TH_CONFIG.GROUP_ID + '/subscribers?limit=100';
  var added = [];

  while (url) {
    var resp = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + apiKey, Accept: 'application/json' },
      muteHttpExceptions: true
    });
    if (resp.getResponseCode() >= 300) { Logger.log('TH ML fetch ' + resp.getResponseCode() + ': ' + resp.getContentText()); break; }
    var data = JSON.parse(resp.getContentText());
    (data.data || []).forEach(function (s) {
      var email = (s.email || '').toLowerCase();
      if (!email || processed[email]) return;
      if (s.status && s.status !== 'active') return; // skip unconfirmed/unsubscribed
      try {
        th_handleOne_(email, (s.fields && s.fields.name) || '', ev);
        processed[email] = 1;
        added.push(email);
      } catch (err) {
        Logger.log('TH invite failed for ' + email + ': ' + err);
      }
    });
    url = (data.links && data.links.next) || null;
  }

  props.setProperty('TH_PROCESSED', JSON.stringify(Object.keys(processed)));
  if (added.length) Logger.log('TH invited: ' + JSON.stringify(added));
}

function th_handleOne_(email, name, ev) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    if (TH_CONFIG.ADD_TO_GUEST_LIST) {
      var attendees = ev.attendees || [];
      var already = attendees.some(function (a) { return (a.email || '').toLowerCase() === email; });
      if (!already) {
        attendees.push({ email: email });
        Calendar.Events.patch({ attendees: attendees }, TH_CONFIG.CAL_ID, TH_CONFIG.EVENT_ID, { sendUpdates: 'none' });
      }
    }
    th_sendInvite_(email, name, ev);
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

/** Run once to grant Calendar + send-mail + external-request permissions. Sends you a test email. */
function authorizeTownhall() {
  Calendar.Events.get(TH_CONFIG.CAL_ID, TH_CONFIG.EVENT_ID);
  UrlFetchApp.fetch('https://connect.mailerlite.com/api/groups/' + TH_CONFIG.GROUP_ID + '/subscribers?limit=1', {
    headers: { Authorization: 'Bearer ' + (PropertiesService.getScriptProperties().getProperty('ML_API_KEY') || ''), Accept: 'application/json' },
    muteHttpExceptions: true
  });
  MailApp.sendEmail(TH_CONFIG.CAL_ID, 'Town hall script authorized', 'Calendar + mail + MailerLite access all work. You can delete this message.');
}
