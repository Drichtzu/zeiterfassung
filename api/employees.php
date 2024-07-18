<?php
require_once 'config.php';

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query("SELECT * FROM employees");
    $employees = $stmt->fetchAll();
    echo json_encode($employees);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['number']) || empty($data['number'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Keine Mitarbeiternummer angegeben']);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO employees (number, firstName, lastName) VALUES (?, ?, ?)");
    if ($stmt->execute([$data['number'], $data['firstName'], $data['lastName']])) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Fehler beim Hinzufügen des Mitarbeiters']);
    }
}
