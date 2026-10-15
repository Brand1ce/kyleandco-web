<?php
/**
 * The State of Interview Intelligence: page access gate.
 *
 *   1. POST {email}                       -> {status:"member"} (already in MailerLite: added to Readers, page opens)
 *                                         -> {status:"new"}    (unknown: ask for name and company)
 *   2. POST {email,name,last_name,company,subscribe:true}
 *                                         -> {status:"subscribed"} (added to Readers + New Leads, page opens)
 *
 * Any MailerLite/API error returns {status:"open"} so nobody is locked out by a backend problem.
 * Token: env MAILERLITE_TOKEN, or api/gate-secret.php here, or the existing candidatefraud/api/gate-secret.php.
 */
header('Content-Type: application/json');
header('Cache-Control: no-store');

$TOKEN = getenv('MAILERLITE_TOKEN');
foreach ([__DIR__ . '/gate-secret.php', __DIR__ . '/../../../candidatefraud/api/gate-secret.php'] as $secret) {
  if (!$TOKEN && is_readable($secret)) { $TOKEN = (string) include $secret; }
}
$GROUPS = [
  'readers'   => '201412390772803456', // "Interview Intelligence Report — Readers" (everyone who opens the page)
  'new_leads' => '201412391366297521', // "Interview Intelligence Report — New Leads" (not on the list before)
];
if (!$TOKEN) { echo json_encode(['status' => 'open']); exit; }

$body = json_decode(file_get_contents('php://input'), true);
if (!is_array($body)) { $body = []; }
$email = isset($body['email']) ? trim($body['email']) : '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'invalid email']);
  exit;
}

function ml($method, $url, $token, $payload = null) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => ["Authorization: Bearer {$token}", 'Accept: application/json', 'Content-Type: application/json'],
    CURLOPT_TIMEOUT        => 8,
  ]);
  if ($payload !== null) { curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload)); }
  $res = curl_exec($ch); $code = curl_getinfo($ch, CURLINFO_HTTP_CODE); $err = curl_errno($ch);
  curl_close($ch);
  return [$code, $res, $err];
}

// Step 2: new contact -> create and add to Readers + New Leads
if (!empty($body['subscribe'])) {
  $fields = [
    'name'      => isset($body['name']) ? trim($body['name']) : '',
    'last_name' => isset($body['last_name']) ? trim($body['last_name']) : '',
    'company'   => isset($body['company']) ? trim($body['company']) : '',
  ];
  list($code, $res, $err) = ml('POST', 'https://connect.mailerlite.com/api/subscribers', $TOKEN,
    ['email' => $email, 'groups' => [$GROUPS['readers'], $GROUPS['new_leads']], 'fields' => array_filter($fields, 'strlen')]);
  if ($err || $code >= 500) { echo json_encode(['status' => 'open']); exit; }
  echo json_encode(['status' => 'subscribed']);
  exit;
}

// Step 1: membership check
list($code, $res, $err) = ml('GET', 'https://connect.mailerlite.com/api/subscribers/' . rawurlencode($email), $TOKEN);
if ($err) { echo json_encode(['status' => 'open']); exit; }
if ($code === 200) {
  ml('POST', 'https://connect.mailerlite.com/api/subscribers', $TOKEN, ['email' => $email, 'groups' => [$GROUPS['readers']]]);
  echo json_encode(['status' => 'member']);
  exit;
}
if ($code === 404) { echo json_encode(['status' => 'new']); exit; }
echo json_encode(['status' => 'open']);
