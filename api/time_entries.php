<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if (isset($_GET['employee_id'])) {
            $stmt = $pdo->prepare("SELECT * FROM time_entries WHERE employee_id = ?");
            $stmt->execute([$_GET['employee_id']]);
            echo json_encode($stmt->fetchAll());
        } else {
            $stmt = $pdo->query("SELECT t.*, e.firstName, e.lastName FROM time_entries t JOIN employees e ON t.employee_id = e.id");
            echo json_encode($stmt->fetchAll());
        }
        break;
    
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("INSERT INTO time_entries (employee_id, date, start_time, end_time, pause_duration, total_time) VALUES (?, ?, ?, ?, ?, ?)");
        $total_time = calculateTotalTime($data['start_time'], $data['end_time'], $data['pause_duration']);
        if ($stmt->execute([$data['employee_id'], $data['date'], $data['start_time'], $data['end_time'], $data['pause_duration'], $total_time])) {
            echo json_encode(['success' => true, 'message' => 'Zeiteintrag erfolgreich hinzugefügt']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Hinzufügen des Zeiteintrags']);
        }
        break;
    
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare("UPDATE time_entries SET employee_id = ?, date = ?, start_time = ?, end_time = ?, pause_duration = ?, total_time = ? WHERE id = ?");
        $total_time = calculateTotalTime($data['start_time'], $data['end_time'], $data['pause_duration']);
        if ($stmt->execute([$data['employee_id'], $data['date'], $data['start_time'], $data['end_time'], $data['pause_duration'], $total_time, $data['id']])) {
            echo json_encode(['success' => true, 'message' => 'Zeiteintrag erfolgreich aktualisiert']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Aktualisieren des Zeiteintrags']);
        }
        break;
    
    case 'DELETE':
        $id = $_GET['id'];
        $stmt = $pdo->prepare("DELETE FROM time_entries WHERE id = ?");
        if ($stmt->execute([$id])) {
            echo json_encode(['success' => true, 'message' => 'Zeiteintrag erfolgreich gelöscht']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Fehler beim Löschen des Zeiteintrags']);
        }
        break;
}

function calculateTotalTime($start, $end, $pause) {
    $start_time = strtotime($start);
    $end_time = strtotime($end);
    $total_minutes = ($end_time - $start_time) / 60 - $pause;
    return max(0, $total_minutes);
}