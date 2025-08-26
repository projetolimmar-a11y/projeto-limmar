<?php
require_once __DIR__ . '/session.php';
require_once __DIR__ . '/db.php';
require_login();
header('Content-Type: application/json');


try {
$pdo = getPDO();
$uid = (int)$_SESSION['user']['id'];


$totalRecords = (int)$pdo->query("SELECT COUNT(*) AS c FROM records WHERE user_id = $uid")->fetch()['c'];
$totalParts = (int)$pdo->query("SELECT COALESCE(SUM(parts_produced),0) AS s FROM records WHERE user_id = $uid")->fetch()['s'];
$today = date('Y-m-d');
$todayRecords = (int)$pdo->query("SELECT COUNT(*) AS c FROM records WHERE user_id = $uid AND DATE(created_at) = '$today'")->fetch()['c'];


$recentStmt = $pdo->prepare('SELECT id, tool, machine, parts_produced, entry_date, exit_date, entry_time, exit_time, created_at FROM records WHERE user_id = ? ORDER BY created_at DESC LIMIT 5');
$recentStmt->execute([$uid]);
$recent = $recentStmt->fetchAll();


echo json_encode([
'totalRecords' => $totalRecords,
'totalParts' => $totalParts,
'todayRecords' => $todayRecords,
'recent' => $recent
]);
} catch (Throwable $e) {
http_response_code(500);
echo json_encode(['error' => 'Server error']);
}