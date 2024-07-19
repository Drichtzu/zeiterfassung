<?php
require_once 'config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['employeeNumber'])) {
    echo json_encode(['valid' => false, 'message' => 'Mitarbeiternummer fehlt']);
    exit;
}

$employeeNumber = $data['employeeNumber'];

try {
    $stmt = $pdo->prepare("SELECT id, firstName, lastName FROM employees WHERE number = ?");
    $stmt->execute([$employeeNumber]);
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($employee) {
        echo json_encode([
            'valid' => true,
            'id' => $employee['id'],
            'name' => $employee['firstName'] . ' ' . $employee['lastName']
        ]);
    } else {
        echo json_encode(['valid' => false, 'message' => 'Ungültige Mitarbeiternummer']);
    }
} catch (PDOException $e) {
    echo json_encode(['valid' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
}