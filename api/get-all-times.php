<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $startDate = $_GET['startDate'] ?? null;
    $endDate = $_GET['endDate'] ?? null;

    if (!$startDate || !$endDate) {
        echo json_encode(['success' => false, 'message' => 'Start- und Enddatum sind erforderlich']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT e.firstName, e.lastName, t.date, t.startTime, t.endTime, t.pauseDuration, 
                   TIME_FORMAT(TIMEDIFF(t.endTime, t.startTime), '%H:%i') AS totalTime
            FROM time_entries t
            JOIN employees e ON t.employeeId = e.id
            WHERE t.date BETWEEN ? AND ?
            ORDER BY t.date, e.lastName, e.firstName
        ");
        $stmt->execute([$startDate, $endDate]);
        $times = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(['success' => true, 'times' => $times]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Datenbankfehler: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Ungültige Anfragemethode']);
}
