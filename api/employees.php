<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT * FROM employees WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            echo json_encode($stmt->fetch());
        } else {
            $stmt = $pdo->query("SELECT * FROM employees");
            echo json_encode($stmt->fetchAll());
        }
        break;
    
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO employees (number, firstName, lastName) VALUES (?, ?, ?)");
        if ($stmt->execute([$data['number'], $data['firstName'], $data['lastName']])) {
            echo json_encode(['success' => true, 'message' => 'Mitarbeiter erfolgreich hinzugefügt']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Hinzufügen des Mitarbeiters']);
        }
        break;
    
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE employees SET number = ?, firstName = ?, lastName = ? WHERE id = ?");
        if ($stmt->execute([$data['number'], $data['firstName'], $data['lastName'], $data['id']])) {
            echo json_encode(['success' => true, 'message' => 'Mitarbeiter erfolgreich aktualisiert']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren des Mitarbeiters']);
        }
        break;
    
    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM employees WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['success' => true, 'message' => 'Mitarbeiter erfolgreich gelöscht']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen des Mitarbeiters']);
        }
        break;
}