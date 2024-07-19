<?php
require_once 'config.php';

header('Content-Type: application/json');

// Aktivieren Sie die Fehlerberichterstattung für Debugging-Zwecke
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Funktion zum Senden einer JSON-Antwort
function sendJsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// GET: Alle Mitarbeiter abrufen
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM employees");
        $employees = $stmt->fetchAll(PDO::FETCH_ASSOC);
        sendJsonResponse($employees);
    } catch (PDOException $e) {
        sendJsonResponse(['error' => 'Datenbankfehler: ' . $e->getMessage()], 500);
    }
}

// POST: Neuen Mitarbeiter hinzufügen
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['number']) || !isset($data['firstName']) || !isset($data['lastName'])) {
        sendJsonResponse(['success' => false, 'message' => 'Fehlende Pflichtfelder'], 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO employees (number, firstName, lastName, existingHours) VALUES (?, ?, ?, ?)");
        $result = $stmt->execute([
            $data['number'],
            $data['firstName'],
            $data['lastName'],
            isset($data['existingHours']) ? floatval($data['existingHours']) : 0
        ]);
        
        if ($result) {
            sendJsonResponse(['success' => true, 'message' => 'Mitarbeiter erfolgreich hinzugefügt'], 201);
        } else {
            sendJsonResponse(['success' => false, 'message' => 'Fehler beim Hinzufügen des Mitarbeiters'], 500);
        }
    } catch (PDOException $e) {
        sendJsonResponse(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()], 500);
    }
}

// PUT: Mitarbeiter aktualisieren
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id']) || !isset($data['number']) || !isset($data['firstName']) || !isset($data['lastName'])) {
        sendJsonResponse(['success' => false, 'message' => 'Fehlende Pflichtfelder'], 400);
    }

    try {
        $stmt = $pdo->prepare("UPDATE employees SET number = ?, firstName = ?, lastName = ?, existingHours = ? WHERE id = ?");
        $result = $stmt->execute([
            $data['number'],
            $data['firstName'],
            $data['lastName'],
            isset($data['existingHours']) ? floatval($data['existingHours']) : 0,
            $data['id']
        ]);
        
        if ($result) {
            sendJsonResponse(['success' => true, 'message' => 'Mitarbeiter erfolgreich aktualisiert']);
        } else {
            sendJsonResponse(['success' => false, 'message' => 'Fehler beim Aktualisieren des Mitarbeiters'], 500);
        }
    } catch (PDOException $e) {
        sendJsonResponse(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()], 500);
    }
}

// DELETE: Mitarbeiter löschen
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['id'])) {
        sendJsonResponse(['success' => false, 'message' => 'Fehlende Mitarbeiter-ID'], 400);
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM employees WHERE id = ?");
        $result = $stmt->execute([$data['id']]);
        
        if ($result) {
            sendJsonResponse(['success' => true, 'message' => 'Mitarbeiter erfolgreich gelöscht']);
        } else {
            sendJsonResponse(['success' => false, 'message' => 'Fehler beim Löschen des Mitarbeiters'], 500);
        }
    } catch (PDOException $e) {
        sendJsonResponse(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()], 500);
    }
}

// Nicht unterstützte HTTP-Methode
else {
    sendJsonResponse(['error' => 'Methode nicht erlaubt'], 405);
}
