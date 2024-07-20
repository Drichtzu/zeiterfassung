<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function logMessage($message) {
    error_log("[Zeiterfassung] " . $message);
}

try {
    require_once 'config.php';

    header('Content-Type: application/json');

    logMessage("record-time.php wurde aufgerufen");

    $input = file_get_contents('php://input');
    logMessage("Empfangene Rohdaten: " . $input);

    $data = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Ungültige JSON-Daten: ' . json_last_error_msg());
    }

    logMessage("Dekodierte Daten: " . print_r($data, true));

    if (!isset($data['employeeNumber']) || !isset($data['startTime']) || !isset($data['endTime']) || !isset($data['breakDuration'])) {
        throw new Exception('Fehlende Pflichtfelder');
    }

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
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} catch (PDOException $e) {
    logMessage("Datenbankfehler: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Datenbankfehler']);
}

logMessage("record-time.php Ausführung beendet");
