<?php
echo json_encode($records);
break;


case 'POST':
// Insert new record
$data = json_decode(file_get_contents("php://input"), true);


if (!$data) {
http_response_code(400);
echo json_encode(["error" => "Invalid input"]);
exit;
}


$stmt = $conn->prepare("INSERT INTO records (tool, machine, parts_produced, entry_date, exit_date, entry_time, exit_time) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssissss", $data['tool'], $data['machine'], $data['parts_produced'], $data['entry_date'], $data['exit_date'], $data['entry_time'], $data['exit_time']);


if ($stmt->execute()) {
echo json_encode(["success" => true, "id" => $stmt->insert_id]);
} else {
http_response_code(500);
echo json_encode(["error" => $stmt->error]);
}
break;


case 'PUT':
// Update record
parse_str(file_get_contents("php://input"), $data);


if (!isset($data['id'])) {
http_response_code(400);
echo json_encode(["error" => "ID is required"]);
exit;
}


$stmt = $conn->prepare("UPDATE records SET tool=?, machine=?, parts_produced=?, entry_date=?, exit_date=?, entry_time=?, exit_time=? WHERE id=?");
$stmt->bind_param("ssissssi", $data['tool'], $data['machine'], $data['parts_produced'], $data['entry_date'], $data['exit_date'], $data['entry_time'], $data['exit_time'], $data['id']);


if ($stmt->execute()) {
echo json_encode(["success" => true]);
} else {
http_response_code(500);
echo json_encode(["error" => $stmt->error]);
}
break;


case 'DELETE':
// Delete record
parse_str(file_get_contents("php://input"), $data);


if (!isset($data['id'])) {
http_response_code(400);
echo json_encode(["error" => "ID is required"]);
exit;
}


$stmt = $conn->prepare("DELETE FROM records WHERE id = ?");
$stmt->bind_param("i", $data['id']);


if ($stmt->execute()) {
echo json_encode(["success" => true]);
} else {
http_response_code(500);
echo json_encode(["error" => $stmt->error]);
}
break;


default:
http_response_code(405);
echo json_encode(["error" => "Method not allowed"]);
break;
}
?>