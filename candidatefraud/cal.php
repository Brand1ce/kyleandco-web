<?php
/**
 * Webinar "Add to calendar" redirector.
 *
 * Email/click-tracking layers (MailerLite, etc.) often mangle or 403 the long
 * Google/Outlook calendar URLs. Linking buttons to short, clean links on our
 * own domain (cal.php?p=google|outlook|ics) avoids that — we hold the full URL
 * here and 302 to it.
 *
 * Single source of truth for the event time. If the webinar moves, update the
 * date/time below AND the WEBINAR config in js/main.js + the hosted .ics.
 */

$title = 'Who owns the seam? A live session on candidate-fraud response';
$join  = 'https://kyleandco.com/live';
$gdate = '20260729T180000Z/20260729T190000Z';        // Wed Jul 29 2026, 2:00 PM ET (18:00 UTC)
$ostart = '2026-07-29T18:00:00Z';
$oend   = '2026-07-29T19:00:00Z';

$targets = [
  'google'  => 'https://calendar.google.com/calendar/render?action=TEMPLATE'
             . '&text=' . rawurlencode($title)
             . '&dates=' . $gdate
             . '&location=' . rawurlencode($join),
  'outlook' => 'https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent'
             . '&subject=' . rawurlencode($title)
             . '&startdt=' . rawurlencode($ostart)
             . '&enddt=' . rawurlencode($oend)
             . '&location=' . rawurlencode($join),
  'ics'     => 'https://kyleandco.com/candidatefraud/downloads/candidate-fraud-webinar.ics',
];

$p   = isset($_GET['p']) ? $_GET['p'] : 'ics';
$url = isset($targets[$p]) ? $targets[$p] : $targets['ics'];

header('Location: ' . $url, true, 302);
exit;
