<?php
include_once '../config.php';


header("Content-Type: application/json");


// Total Records
$totalRecordsQuery = "SELECT COUNT(*) as total_records FROM records";
$totalRecordsResult = $conn->query($totalRecordsQuery);
$totalRecords = $totalRecordsResult->fetch_assoc()['total_records'];


// Total Parts
$totalPartsQuery = "SELECT SUM(parts_produced) as total_parts FROM records";
$totalPartsResult = $conn->query($totalPartsQuery);
$totalParts = $totalPartsResult->fetch_assoc()['total_parts'] ?? 0;


// Today's Records
$today = date('Y-m-d');
$todaysRecordsQuery = "SELECT COUNT(*) as todays_records FROM records WHERE entry_date = ?";
$stmt = $conn->prepare($todaysRecordsQuery);
$stmt->bind_param("s", $today);
$stmt->execute();
$todaysRecordsResult = $stmt->get_result()->fetch_assoc();
$todaysRecords = $todaysRecordsResult['todays_records'];


// Recent Records (last 5)
$recentRecordsQuery = "SELECT * FROM records ORDER BY entry_date DESC, entry_time DESC LIMIT 5";
$recentRecordsResult = $conn->query($recentRecordsQuery);
$recentRecords = [];
if ($recentRecordsResult->num_rows > 0) {
while ($row = $recentRecordsResult->fetch_assoc()) {
$recentRecords[] = $row;
}
}


$response = [
"total_records" => $totalRecords,
"total_parts" => $totalParts,
"todays_records" => $todaysRecords,
"recent_records" => $recentRecords
];


echo json_encode($response);
?>