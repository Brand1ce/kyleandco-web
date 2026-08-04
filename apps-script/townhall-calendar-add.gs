/**
 * Year Two Town Hall — auto calendar invite on registration.
 *
 * Flow:  registrant submits the AI Council reg modal
 *        -> MailerLite adds them to the "AI Council – Year Two Town Hall" group
 *        -> MailerLite webhook POSTs to this Web App URL (with ?token=SECRET)
 *        -> this script emails the registrant a calendar invite (.ics) built from
 *           the LIVE event (so whatever join link is on the event is used), and
 *           silently logs them onto the event guest list (no blast to other guests).
 *
 * Deploy: see apps-script/SETUP.md
 */

const CONFIG = {
  CAL_ID:   'brandice@kyleandco.com',              // calendar that owns the event
  EVENT_ID: '0b98lpeee9fophk2tc6sfseagv',          // The Human-Centric AI Council Year Two Town Hall (Aug 27)
  GROUP_ID: '194886957105415211',                  // only act on this MailerLite group
  SECRET:   'CHANGE_ME_to_a_long_random_string',   // must match ?token=... in the MailerLite webhook URL
  FROM_NAME:'The Human-Centric AI Council',
  ADD_TO_GUEST_LIST: true,                         // silently log registrants onto the event (sendUpdates: none)
};

function doPost(e) {
  try {
    if (!e || !e.parameter || e.parameter.token !== CONFIG.SECRET) {
      return json_({ ok: false, error: 'unauthorized' });
    }
    const body = (e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : {};
    const people = extractPeople_(body);
    const results = people.map(handleOne_);
    return json_({ ok: true, count: results.length, results: results });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

function handleOne_(p) {
  const email = (p.email || '').trim().toLowerCase();
  if (!email) return { skipped: 'no email' };
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const ev = Calendar.Events.get(CONFIG.CAL_ID, CONFIG.EVENT_ID);
    if (CONFIG.ADD_TO_GUEST_LIST) {
      const attendees = ev.attendees || [];
      const already = attendees.some(function (a) { return (a.email || '').toLowerCase() === email; });
      if (!already) {
        attendees.push({ email: email });
        Calendar.Events.patch({ attendees: attendees }, CONFIG.CAL_ID, CONFIG.EVENT_ID, { sendUpdates: 'none' });
      }
    }
    sendInvite_(email, p.name, ev);
    return { email: email, invited: true };
  } finally {
    lock.releaseLock();
  }
}

function sendInvite_(email, name, ev) {
  const tz = (ev.start && ev.start.timeZone) || 'America/New_York';
  const start = new Date(ev.start.dateTime || ev.start.date);
  const whenStr = Utilities.formatDate(start, tz, "EEEE, MMMM d, yyyy 'at' h:mm a") + ' ET';
  const join = joinLink_(ev);
  const subject = "You're on the calendar — " + ev.summary;
  const lines = [
    (name ? 'Hi ' + name + ',' : 'Hi,'),
    '',
    "You're registered for the " + ev.summary + '.',
    'When: ' + whenStr,
    (join ? 'Join: ' + join
          : 'A join link will appear on your calendar invite before the event.'),
    '',
    "This invite has been added to your calendar — nothing to click. Each pillar champion will walk through their Year Two workstream. See you there.",
    '',
    '— The Human-Centric AI Council'
  ];
  GmailApp.sendEmail(email, subject, lines.join('\n'), {
    name: CONFIG.FROM_NAME,
    attachments: [ Utilities.newBlob(buildIcs_(ev, email), 'text/calendar; method=REQUEST; charset=UTF-8', 'invite.ics') ]
  });
}

function joinLink_(ev) {
  if (ev.hangoutLink) return ev.hangoutLink;
  if (ev.conferenceData && ev.conferenceData.entryPoints) {
    const vid = ev.conferenceData.entryPoints.filter(function (x) { return x.entryPointType === 'video'; })[0];
    if (vid && vid.uri) return vid.uri;
  }
  if (ev.location && /^https?:\/\//.test(ev.location)) return ev.location;
  return '';
}

function buildIcs_(ev, email) {
  const fmt = function (dt) { return Utilities.formatDate(new Date(dt), 'UTC', "yyyyMMdd'T'HHmmss'Z'"); };
  const join = joinLink_(ev);
  const esc = function (s) { return String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n'); };
  const desc = (join ? 'Join: ' + join + '\\n\\n' : '') + 'The Human-Centric AI Council Year Two Town Hall.';
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
    'ORGANIZER;CN=' + esc(CONFIG.FROM_NAME) + ':mailto:' + CONFIG.CAL_ID,
    'ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:' + email,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:Reminder', 'TRIGGER:-PT15M', 'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
}

/**
 * Pull registrants from the MailerLite webhook payload. MailerLite may send a
 * single event or a batch under `events`. Only act on the town hall group.
 */
function extractPeople_(body) {
  const evts = Array.isArray(body.events) ? body.events : [body];
  const people = [];
  evts.forEach(function (ev) {
    const data = (ev && ev.data) ? ev.data : ev;
    // group filter (when the payload identifies a group)
    const groupId = (data && data.group && String(data.group.id)) ||
                    (ev && ev.group && String(ev.group.id)) || '';
    if (groupId && groupId !== CONFIG.GROUP_ID) return;
    const sub = (data && data.subscriber) || data || {};
    const fields = sub.fields || {};
    const email = sub.email || fields.email;
    if (!email) return;
    people.push({ email: email, name: fields.name || sub.name || '' });
  });
  return people;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to grant Calendar + Gmail permissions before deploying. */
function authorize() {
  Calendar.Events.get(CONFIG.CAL_ID, CONFIG.EVENT_ID);
  GmailApp.getAliases();
}
