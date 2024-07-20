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

    // Überprüfen, ob die Mitarbeiternummer existiert und die entsprechende ID abrufen
    $stmt = $pdo->prepare("SELECT id FROM employees WHERE number = ?");
    $stmt->execute([$employeeNumber]);
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$employee) {
        throw new Exception('Ungültige Mitarbeiternummer. Bitte überprüfen Sie die eingegebene Nummer.');
    }

    $employeeId = $employee['id'];

    // Berechnen der Gesamtzeit in Minuten
    $start = new DateTime($startTime);
    $end = new DateTime($endTime);
    $totalTime = ($end->getTimestamp() - $start->getTimestamp()) / 60 - $breakDuration;

    logMessage("Validierte Daten: employeeId=$employeeId, startTime=$startTime, endTime=$endTime, pauseDuration=$breakDuration, totalTime=$totalTime");

    $stmt = $pdo->prepare("INSERT INTO time_entries (employee_id, date, start_time, end_time, pause_duration, total_time) VALUES (?, CURDATE(), ?, ?, ?, ?)");
    $result = $stmt->execute([$employeeId, $startTime, $endTime, $breakDuration, $totalTime]);

    if ($result) {
        logMessage("Zeit erfolgreich erfasst");
        echo json_encode(['success' => true, 'message' => 'Zeit erfolgreich erfasst']);
    } else {
        throw new Exception('Fehler beim Erfassen der Zeit: ' . json_encode($stmt->errorInfo()));
    }

} catch (PDOException $e) {
    logMessage("Datenbankfehler: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Datenbankfehler']);
} catch (Exception $e) {
    logMessage("Fehler: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

logMessage("record-time.php Ausführung beendet");
