/**
 * TRL Live (Oct 1 2026) — auto-add registrants to the calendar event (POLLING version).
 *
 * Add as a file in the existing "Marketing KPIs Data" project (reuses its ML_API_KEY).
 * A time trigger runs pollTrl() every few minutes: it reads the TRL Live group from the
 * MailerLite API and adds anyone new to the event's guest list.
 *
 * Why polling, not a webhook: Apps Script always answers a webhook with a 302 redirect,
 * which MailerLite treats as a failed delivery and auto-disables the webhook. Time triggers
 * also run the latest saved code, so there is never a redeploy.
 *
 * The event is already configured as Free (transparency) with the guest list hidden
 * (guestsCanSeeOtherGuests = false). verifyTrlEvent() re-asserts both if anyone changes them.
 *
 * One-time setup:
 *   1. Services (+) -> add Calendar API (already added if the town hall script is in here).
 *   2. Run authorizeTrl once -> approve permissions.
 *   3. Triggers (clock icon) -> Add Trigger -> function pollTrl, event source Time-driven,
 *      Minutes timer, Every 5 minutes.
 */

var TRL_CONFIG = {
  CAL_ID:   'brandice@kyleandco.com',
  EVENT_ID: 's66ajpsri1km4vg22l1vdoa5to',
  GROUP_ID: '199873702380176897',

  /**
   * Who Google emails when a guest is added.
   *   'externalOnly' - no email to Google Calendar users (it just appears on their
   *                    calendar); non-Google guests get the one invite that is the only
   *                    way the event can reach their calendar at all. Recommended.
   *   'none'         - nobody is emailed. Outlook/Apple/Yahoo registrants then get
   *                    nothing and the event never lands on their calendar.
   *   'all'          - everyone gets an invite email.
   */
  SEND_UPDATES: 'externalOnly',
};

var TRL_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Scheduled: add any new members of the TRL group to the event guest list. */
function pollTrl() {
  var props = PropertiesService.getScriptProperties();
  var apiKey = props.getProperty('ML_API_KEY');
  if (!apiKey) { Logger.log('TRL: no ML_API_KEY property'); return; }

  var processed = {};
  JSON.parse(props.getProperty('TRL_PROCESSED') || '[]').forEach(function (e) { processed[e] = 1; });

  var pending = [];
  var url = 'https://connect.mailerlite.com/api/groups/' + TRL_CONFIG.GROUP_ID + '/subscribers?limit=100';

  while (url) {
    var resp = trl_fetchRetry_(url, {
      headers: { Authorization: 'Bearer ' + apiKey, Accept: 'application/json' },
      muteHttpExceptions: true
    });
    if (!resp) { Logger.log('TRL ML fetch unreachable after retries; will retry next run'); return; }
    if (resp.getResponseCode() >= 300) {
      Logger.log('TRL ML fetch ' + resp.getResponseCode() + ': ' + resp.getContentText());
      return; // bail without recording progress, so nobody is skipped
    }
    var data = JSON.parse(resp.getContentText());
    (data.data || []).forEach(function (s) {
      var email = (s.email || '').trim().toLowerCase();
      if (!email || processed[email]) return;
      if (s.status && s.status !== 'active') return;        // skip unconfirmed/unsubscribed
      if (!TRL_EMAIL_RE.test(email)) {                       // one bad address would fail the whole patch
        Logger.log('TRL skipping malformed address: ' + email);
        processed[email] = 1;
        return;
      }
      pending.push(email);
    });
    url = (data.links && data.links.next) || null;
  }

  if (!pending.length) return;

  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    // Re-read the live attendee list inside the lock: patch replaces the whole array, so a
    // stale snapshot would silently drop anyone added since this run started.
    var fresh = Calendar.Events.get(TRL_CONFIG.CAL_ID, TRL_CONFIG.EVENT_ID);
    var attendees = fresh.attendees || [];
    var have = {};
    attendees.forEach(function (a) { have[(a.email || '').toLowerCase()] = 1; });

    var added = [];
    pending.forEach(function (email) {
      if (have[email]) { processed[email] = 1; return; }
      attendees.push({ email: email, responseStatus: 'accepted' });
      have[email] = 1;
      added.push(email);
    });

    if (added.length) {
      Calendar.Events.patch(
        { attendees: attendees },
        TRL_CONFIG.CAL_ID,
        TRL_CONFIG.EVENT_ID,
        { sendUpdates: TRL_CONFIG.SEND_UPDATES }
      );
      added.forEach(function (e) { processed[e] = 1; });
      Logger.log('TRL added ' + added.length + ': ' + JSON.stringify(added));
    }
    // Only record progress once the patch actually succeeded.
    props.setProperty('TRL_PROCESSED', JSON.stringify(Object.keys(processed)));
  } finally {
    lock.releaseLock();
  }
}

/** UrlFetchApp with backoff — Google's fetch layer throws transient "Address unavailable". */
function trl_fetchRetry_(url, opts) {
  for (var i = 0; i < 4; i++) {
    try {
      return UrlFetchApp.fetch(url, opts);
    } catch (err) {
      Logger.log('TRL fetch attempt ' + (i + 1) + ' failed: ' + err);
      if (i < 3) Utilities.sleep(2000 * Math.pow(2, i));
    }
  }
  return null;
}

/** Re-assert Free + hidden guest list, in case the event gets edited in the UI. */
function verifyTrlEvent() {
  Calendar.Events.patch(
    { transparency: 'transparent', guestsCanSeeOtherGuests: false, guestsCanInviteOthers: false },
    TRL_CONFIG.CAL_ID,
    TRL_CONFIG.EVENT_ID,
    { sendUpdates: 'none' }
  );
  var ev = Calendar.Events.get(TRL_CONFIG.CAL_ID, TRL_CONFIG.EVENT_ID);
  Logger.log('TRL event: transparency=' + ev.transparency
    + ' guestsCanSeeOtherGuests=' + ev.guestsCanSeeOtherGuests
    + ' guests=' + ((ev.attendees || []).length));
}

/** How many registrants are on the event right now. */
function trlGuestCount() {
  var ev = Calendar.Events.get(TRL_CONFIG.CAL_ID, TRL_CONFIG.EVENT_ID);
  Logger.log('TRL guests: ' + ((ev.attendees || []).length));
}

/** Run once to grant Calendar + external-request permissions. */
function authorizeTrl() {
  Calendar.Events.get(TRL_CONFIG.CAL_ID, TRL_CONFIG.EVENT_ID);
  var resp = UrlFetchApp.fetch(
    'https://connect.mailerlite.com/api/groups/' + TRL_CONFIG.GROUP_ID + '/subscribers?limit=1',
    {
      headers: {
        Authorization: 'Bearer ' + (PropertiesService.getScriptProperties().getProperty('ML_API_KEY') || ''),
        Accept: 'application/json'
      },
      muteHttpExceptions: true
    }
  );
  Logger.log('TRL authorize: calendar OK, MailerLite HTTP ' + resp.getResponseCode());
}
