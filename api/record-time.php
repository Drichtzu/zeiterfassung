<?php
require_once 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['employeeId']) || !isset($data['startTime']) || !isset($data['endTime']) || !isset($data['pauseDuration'])) {
    echo json_encode(['success' => false, 'message' => 'Fehlende Pflichtfelder']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO time_entries (employeeId, date, startTime, endTime, pauseDuration) VALUES (?, CURDATE(), ?, ?, ?)");
    $result = $stmt->execute([
        $data['employeeId'],
        $data['startTime'],
        $data['endTime'],
        $data['pauseDuration']
    ]);

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Zeit erfolgreich erfasst']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Fehler beim Erfassen der Zeit']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
}