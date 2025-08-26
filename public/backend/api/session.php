<?php
require_once __DIR__ . '/config.php';


// Start a secure session and set CORS headers
if (session_status() === PHP_SESSION_NONE) {
session_set_cookie_params([
'lifetime' => 0,
'path' => '/',
'domain' => '',
'secure' => false, // set true if using HTTPS
'httponly' => true,
'samesite' => 'Lax',
]);
session_start();
}


$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin === ALLOWED_ORIGIN) {
header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
header('Vary: Origin');
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
http_response_code(204);
exit;
}


function require_login() {
if (empty($_SESSION['user'])) {
http_response_code(401);
header('Content-Type: application/json');
echo json_encode(['error' => 'Unauthorized']);
exit;
}
}