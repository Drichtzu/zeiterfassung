<?php
require_once 'config.php';

header('Content-Type: application/json');

// Aktivieren Sie die Fehlerberichterstattung für Debugging-Zwecke
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Logging-Funktion
function logMessage($message) {
    error_log("[" . date("Y-m-d H:i:s") . "] " . $message . "\n", 3, __DIR__ . "/debug_log.txt");
}

logMessage("record-time.php wurde aufgerufen");

$data = json_decode(file_get_contents('php://input'), true);

logMessage("Empfangene Daten: " . json_encode($data));

if (!isset($data['employeeNumber']) || !isset($data['startTime']) || !isset($data['endTime']) || !isset($data['breakDuration'])) {
    logMessage("Fehlende Pflichtfelder");
    echo json_encode(['success' => false, 'message' => 'Fehlende Pflichtfelder']);
    exit;
}

// Validierung der Daten
$employeeNumber = filter_var($data['employeeNumber'], FILTER_SANITIZE_STRING);
$startTime = filter_var($data['startTime'], FILTER_SANITIZE_STRING);
$endTime = filter_var($data['endTime'], FILTER_SANITIZE_STRING);
$breakDuration = filter_var($data['breakDuration'], FILTER_SANITIZE_NUMBER_INT);

if (!$employeeNumber || !$startTime || !$endTime) {
    logMessage("Ungültige Daten");
    echo json_encode(['success' => false, 'message' => 'Ungültige Daten']);
    exit;
}

try {
    $stmt = $pdo->prepare("INSERT INTO time_entries (employeeNumber, date, startTime, endTime, breakDuration) VALUES (?, CURDATE(), ?, ?, ?)");
    logMessage("SQL vorbereitet");
    $result = $stmt->execute([$employeeNumber, $startTime, $endTime, $breakDuration]);
    logMessage("SQL ausgeführt. Ergebnis: " . ($result ? "Erfolgreich" : "Fehlgeschlagen"));
    
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
