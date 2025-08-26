<?php
require_once __DIR__ . '/session.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/utils.php';


header('Content-Type: application/json');


$data = json_input();
$name = trim($data['name'] ?? '');
$cpf = trim($data['cpf'] ?? '');
$password = $data['password'] ?? '';
$confirm = $data['confirmPassword'] ?? '';


if ($name === '' || $cpf === '' || $password === '' || $confirm === '') {
http_response_code(422);
echo json_encode(['error' => 'All fields are required']);
exit;
}


if (!validate_cpf_format($cpf)) {
http_response_code(422);
echo json_encode(['error' => 'Invalid CPF format']);
exit;
}


if ($password !== $confirm) {
http_response_code(422);
echo json_encode(['error' => 'Passwords do not match']);
exit;
}


try {
$pdo = getPDO();
// Ensure CPF uniqueness
$stmt = $pdo->prepare('SELECT id FROM users WHERE cpf = ?');
$stmt->execute([$cpf]);
if ($stmt->fetch()) {
http_response_code(409);
echo json_encode(['error' => 'CPF already registered']);
exit;
}


$hash = password_hash($password, PASSWORD_DEFAULT);
$ins = $pdo->prepare('INSERT INTO users(name, cpf, password_hash) VALUES(?,?,?)');
$ins->execute([$name, $cpf, $hash]);


echo json_encode(['success' => true]);
} catch (Throwable $e) {
http_response_code(500);
echo json_encode(['error' => 'Server error']);
}