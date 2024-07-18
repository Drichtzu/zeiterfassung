<?php
require_once 'config.php';

header('Content-Type: application/json');

// Aktivieren Sie die Fehlerberichterstattung für Debugging-Zwecke
ini_set('display_errors', 1);
error_reporting(E_ALL);

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
        $result = $stmt->execute([
            $data['number'],
            $data['firstName'],
            $data['lastName'],
            isset($data['existingHours']) ? $data['existingHours'] : 0
        ]);
        
        if ($result) {
            http_response_code(201); // Created
            echo json_encode(['success' => true, 'message' => 'Mitarbeiter erfolgreich hinzugefügt']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Fehler beim Hinzufügen des Mitarbeiters']);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Methode nicht erlaubt']);
}
