<?php
require_once 'config.php';

header('Content-Type: application/json');

try {
    if (!isset($_GET['employeeNumber'])) {
        throw new Exception('Mitarbeiternummer fehlt');
    }

    $employeeNumber = filter_var($_GET['employeeNumber'], FILTER_SANITIZE_STRING);

    // Mitarbeiter abrufen
    $stmt = $pdo->prepare("SELECT * FROM employees WHERE number = ?");
    $stmt->execute([$employeeNumber]);
    $employee = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$employee) {
        throw new Exception('Mitarbeiter nicht gefunden');
    }

    // Zeiteinträge abrufen
    $stmt = $pdo->prepare("SELECT * FROM time_entries WHERE employee_id = ? ORDER BY date DESC, start_time DESC");
    $stmt->execute([$employee['id']]);
    $timeEntries = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Gesamtstunden berechnen
    $totalMinutes = 0;
    foreach ($timeEntries as &$entry) {
        $totalMinutes += $entry['total_time'];
        // Konvertiere Minuten in Stunden:Minuten Format
        $entry['total_time_formatted'] = sprintf('%02d:%02d', floor($entry['total_time'] / 60), $entry['total_time'] % 60);
    }
    $totalHours = $totalMinutes / 60;

    // Stundenkonto aktualisieren
    $stmt = $pdo->prepare("UPDATE employees SET existingHours = ? WHERE id = ?");
    $stmt->execute([$totalHours, $employee['id']]);

    echo json_encode([
        'success' => true, 
        'employee' => $employee, 
        'timeEntries' => $timeEntries, 
        'totalHours' => number_format($totalHours, 2)
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
