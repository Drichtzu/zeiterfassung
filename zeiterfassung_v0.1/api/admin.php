<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        if (isset($data['action'])) {
            switch($data['action']) {
                case 'login':
                    $sql = "SELECT * FROM admins WHERE username = ? AND password = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->bind_param("ss", $data['username'], $data['password']);
                    $stmt->execute();
                    $result = $stmt->get_result();
                    if ($result->num_rows > 0) {
                        echo json_encode(["message" => "Login erfolgreich"]);
                    } else {
                        echo json_encode(["error" => "Ungültige Anmeldedaten"]);
                    }
                    break;
                
                case 'get_report':
                    // Hier können Sie eine Berichtsfunktion implementieren
                    // Zum Beispiel: Gesamtarbeitszeit pro Mitarbeiter
                    $sql = "SELECT e.name, SUM(TIMESTAMPDIFF(MINUTE, t.start_time, t.end_time)) as total_minutes 
                            FROM employees e 
                            JOIN time_entries t ON e.id = t.employee_id 
                            GROUP BY e.id";
                    $result = $conn->query($sql);
                    $report = [];
                    while($row = $result->fetch_assoc()) {
                        $report[] = $row;
                    }
                    echo json_encode($report);
                    break;

                default:
                    echo json_encode(["error" => "Unbekannte Aktion"]);
            }
        } else {
            echo json_encode(["error" => "Keine Aktion angegeben"]);
        }
        break;

    default:
        echo json_encode(["error" => "Nicht unterstützte Methode"]);
}

$conn->close();