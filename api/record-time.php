<?php
require_once 'config.php';

header('Content-Type: application/json');

// Aktivieren Sie die Fehlerberichterstattung für Debugging-Zwecke
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Logfunktion
function logMessage($message) {
    file_put_contents(__DIR__ . '/debug_log.txt', date('[Y-m-d H:i:s] ') . $message . PHP_EOL, FILE_APPEND);
}

logMessage("record-time.php wurde aufgerufen");

// Überprüfen der Datenbankverbindung
logMessage("Datenbankverbindung: " . ($pdo ? "Erfolgreich" : "Fehlgeschlagen"));

$rawData = file_get_contents('php://input');
logMessage("Empfangene Rohdaten: " . $rawData);

$data = json_decode($rawData, true);
logMessage("Dekodierte Daten: " . print_r($data, true));

if (!isset($data['employeeId']) || !isset($data['startTime']) || !isset($data['endTime']) || !isset($data['pauseDuration'])) {
    logMessage("Fehlende Pflichtfelder");
    echo json_encode(['success' => false, 'message' => 'Fehlende Pflichtfelder']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO time_entries (employeeId, date, startTime, endTime, pauseDuration) VALUES (?, CURDATE(), ?, ?, ?)");
    logMessage("SQL vorbereitet");
    $result = $stmt->execute([
        $data['employeeId'],
        $data['startTime'],
        $data['endTime'],
        $data['pauseDuration']
    ]);
    logMessage("SQL ausgeführt. Ergebnis: " . ($result ? "Erfolgreich" : "Fehlgeschlagen"));
    if ($result) {
        logMessage("Zeit erfolgreich erfasst");
        echo json_encode(['success' => true, 'message' => 'Zeit erfolgreich erfasst']);
    } else {
        logMessage("Fehler beim Erfassen der Zeit: " . print_r($stmt->errorInfo(), true));
        echo json_encode(['success' => false, 'message' => 'Fehler beim Erfassen der Zeit']);
    }
} catch (PDOException $e) {
    logMessage("Datenbankfehler: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
}

logMessage("record-time.php Ausführung beendet");
