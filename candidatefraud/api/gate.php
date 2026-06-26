<?php
/**
 * Candidate Fraud report — download gate endpoint.
 *
 * Flow (called by candidatefraud/js/main.js):
 *   1. POST {email}                          -> {status:"member"}  (already in DB, let them download)
 *                                            -> {status:"new"}     (unknown, ask for the extra fields)
 *   2. POST {email,name,last_name,company,subscribe:true}
 *                                            -> {status:"subscribed"} (added to MailerLite, let them download)
 *
 * On ANY MailerLite/API error this returns {status:"open"} so the front end
 * fails OPEN — a person is never blocked from the report by a backend problem.
 *
 * SETUP:
 *   - Create a MailerLite API token (Integrations > API) with subscriber access.
 *   - Put it in the environment var MAILERLITE_TOKEN, or paste it into $TOKEN below.
 *   - Never commit a real token to git; prefer the env var.
 */

header('Content-Type: application/json');
header('Cache-Control: no-store');

// Token is loaded from outside version control (this repo is public):
//   1) env var MAILERLITE_TOKEN, or
//   2) an untracked file api/gate-secret.php that does:  <?php return 'TOKEN';
$TOKEN = getenv('MAILERLITE_TOKEN');
if (!$TOKEN) {
  $secret = __DIR__ . '/gate-secret.php';
  if (is_readable($secret)) { $TOKEN = (string) include $secret; }
}
$GROUP_ID = '191362223659026255'; // "Candidate Fraud Report — Downloads"

// Fail open if the token hasn't been configured yet.
if (!$TOKEN) {
  echo json_encode(['status' => 'open']);
  exit;
}

$raw  = file_get_contents('php://input');
$body = json_decode($raw, true);
if (!is_array($body)) { $body = []; }

$email = isset($body['email']) ? trim($body['email']) : '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['status' => 'error', 'message' => 'invalid email']);
  exit;
}

/** Minimal MailerLite (connect API) request helper. */
function ml($method, $url, $token, $payload = null) {
  $ch = curl_init($url);
  $headers = [
    "Authorization: Bearer {$token}",
    'Accept: application/json',
    'Content-Type: application/json',
  ];
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => $method,
    CURLOPT_HTTPHEADER     => $headers,
    CURLOPT_TIMEOUT        => 8,
  ]);
  if ($payload !== null) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
  }
  $res  = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  $err  = curl_errno($ch);
  curl_close($ch);
  return [$code, $res, $err];
}

// --- Step 2: new contact submitting their details -> create + add to group ---
if (!empty($body['subscribe'])) {
  $payload = [
    'email'  => $email,
    'groups' => [$GROUP_ID],
    'fields' => [
      'name'      => isset($body['name']) ? trim($body['name']) : '',
      'last_name' => isset($body['last_name']) ? trim($body['last_name']) : '',
      'company'   => isset($body['company']) ? trim($body['company']) : '',
    ],
  ];
  list($code, $res, $err) = ml('POST', 'https://connect.mailerlite.com/api/subscribers', $TOKEN, $payload);
  if ($err || $code >= 500) { echo json_encode(['status' => 'open']); exit; }
  echo json_encode(['status' => 'subscribed']);
  exit;
}

// --- Step 1: membership check ---
list($code, $res, $err) = ml('GET', 'https://connect.mailerlite.com/api/subscribers/' . rawurlencode($email), $TOKEN);

if ($err) { echo json_encode(['status' => 'open']); exit; }          // network error -> fail open
if ($code === 200) { echo json_encode(['status' => 'member']); exit; } // already in DB
if ($code === 404) { echo json_encode(['status' => 'new']); exit; }    // not found -> ask for details
echo json_encode(['status' => 'open']);                                // anything else -> fail open
