<?php
require_once 'config.php';

header('Content-Type: application/json');

// Aktivieren Sie die Fehlerberichterstattung für Debugging-Zwecke
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Logfunktion
function logMessage($message) {
    error_log("[" . date("Y-m-d H:i:s") . "] " . $message . "\n", 3, "api_log.txt");
}

logMessage("record-time.php wurde aufgerufen");

$data = json_decode(file_get_contents('php://input'), true);

logMessage("Empfangene Daten: " . json_encode($data));

if (!isset($data['employeeId']) || !isset($data['startTime']) || !isset($data['endTime']) || !isset($data['pauseDuration'])) {
    logMessage("Fehlende Pflichtfelder");
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
        logMessage("Zeit erfolgreich erfasst");
        echo json_encode(['success' => true, 'message' => 'Zeit erfolgreich erfasst']);
    } else {
        logMessage("Fehler beim Erfassen der Zeit: " . json_encode($stmt->errorInfo()));
        echo json_encode(['success' => false, 'message' => 'Fehler beim Erfassen der Zeit']);
    }
} catch (PDOException $e) {
    logMessage("Datenbankfehler: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
}

logMessage("record-time.php Ausführung beendet");
