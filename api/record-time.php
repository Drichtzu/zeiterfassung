<?php
// Fehlerberichterstattung für Debugging
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Funktion zum Loggen von Nachrichten
function logMessage($message) {
    error_log("[Zeiterfassung] " . $message);
}

try {
    require_once 'config.php';

    header('Content-Type: application/json');

    logMessage("record-time.php wurde aufgerufen");

    $data = json_decode(file_get_contents('php://input'), true);

    logMessage("Empfangene Daten: " . json_encode($data));

    if (!isset($data['employeeNumber']) || !isset($data['startTime']) || !isset($data['endTime']) || !isset($data['breakDuration'])) {
        throw new Exception('Fehlende Pflichtfelder');
    }

    // Validierung der Daten
    $employeeNumber = filter_var($data['employeeNumber'], FILTER_SANITIZE_STRING);
    $startTime = filter_var($data['startTime'], FILTER_SANITIZE_STRING);
    $endTime = filter_var($data['endTime'], FILTER_SANITIZE_STRING);
    $breakDuration = filter_var($data['breakDuration'], FILTER_SANITIZE_NUMBER_INT);

    if (!$employeeNumber || !$startTime || !$endTime) {
        throw new Exception('Ungültige Daten');
    }

    logMessage("Validierte Daten: employeeNumber=$employeeNumber, startTime=$startTime, endTime=$endTime, breakDuration=$breakDuration");

    $stmt = $pdo->prepare("INSERT INTO time_entries (employeeNumber, date, startTime, endTime, breakDuration) VALUES (?, CURDATE(), ?, ?, ?)");
    $result = $stmt->execute([$employeeNumber, $startTime, $endTime, $breakDuration]);

    if ($result) {
        logMessage("Zeit erfolgreich erfasst");
        echo json_encode(['success' => true, 'message' => 'Zeit erfolgreich erfasst']);
    } else {
        throw new Exception('Fehler beim Erfassen der Zeit: ' . json_encode($stmt->errorInfo()));
    }

} catch (Exception $e) {
    logMessage("Fehler: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (PDOException $e) {
    logMessage("Datenbankfehler: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Datenbankfehler']);
}

logMessage("record-time.php Aus
