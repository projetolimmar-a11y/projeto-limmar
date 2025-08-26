<?php
require_once __DIR__ . '/session.php';
require_once __DIR__ . '/db.php';


header('Content-Type: application/json');


$raw = file_get_contents('php://input');
$body = json_decode($raw, true) ?? [];
$cpf = trim($body['cpf'] ?? '');
$password = $body['password'] ?? '';


if ($cpf === '' || $password === '') {
http_response_code(422);
echo json_encode(['error' => 'CPF and password are required']);
exit;
}


try {
$pdo = getPDO();
$stmt = $pdo->prepare('SELECT id, name, cpf, password_hash FROM users WHERE cpf = ?');
$stmt->execute([$cpf]);
$user = $stmt->fetch();


if (!$user || !password_verify($password, $user['password_hash'])) {
http_response_code(401);
echo json_encode(['error' => 'Invalid credentials']);
exit;
}


$_SESSION['user'] = [
'id' => (int)$user['id'],
'name' => $user['name'],
'cpf' => $user['cpf']
];


echo json_encode(['user' => $_SESSION['user']]);
} catch (Throwable $e) {
http_response_code(500);
echo json_encode(['error' => 'Server error']);
}