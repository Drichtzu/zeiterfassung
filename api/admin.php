<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (isset($data['action'])) {
        switch($data['action']) {
            case 'login':
                // In einer echten Anwendung würden Sie hier eine sichere Passwortüberprüfung implementieren
                if ($data['password'] === '1') {
                    echo json_encode(['success' => true, 'message' => 'Login erfolgreich']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Ungültiges Passwort']);
                }
                break;
            
            case 'get_report':
                $stmt = $pdo->query("SELECT e.id, e.number, e.firstName, e.lastName, SUM(t.total_time) as total_minutes 
                                     FROM employees e 
                                     LEFT JOIN time_entries t ON e.id = t.employee_id 
                                     GROUP BY e.id");
                $report = $stmt->fetchAll();
                foreach ($report as &$entry) {
                    $entry['total_hours'] = round($entry['total_minutes'] / 60, 2);
                    unset($entry['total_minutes']);
                }
                echo json_encode($report);
                break;
            
            default:
                echo json_encode(['success' => false, 'message' => 'Unbekannte Aktion']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Keine Aktion angegeben']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Ungültige Anfragemethode']);
}