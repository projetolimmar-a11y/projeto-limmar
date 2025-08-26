<?php
require_once __DIR__ . '/session.php';
header('Content-Type: application/json');


if (!empty($_SESSION['user'])) {
echo json_encode(['user' => $_SESSION['user']]);
} else {
http_response_code(401);
echo json_encode(['error' => 'Unauthorized']);
}