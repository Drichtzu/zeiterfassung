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
    try {
        $stmt = $pdo->query("SELECT * FROM employees");
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($employees);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Datenbankfehler: ' . $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['number']) || !isset($data['firstName']) || !isset($data['lastName'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Fehlende Pflichtfelder']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO employees (number, firstName, lastName, existingHours) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([$data['number'], $data['firstName'], $data['lastName'], $data['existingHours'] ?? 0]);
        
        if ($result) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Hinzufügen des Mitarbeiters']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
    }
}
