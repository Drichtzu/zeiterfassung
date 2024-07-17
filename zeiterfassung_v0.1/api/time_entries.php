<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT * FROM time_entries";
        $result = $conn->query($sql);
        $entries = [];
        while($row = $result->fetch_assoc()) {
            $entries[] = $row;
        }
        echo json_encode($entries);
        break;
    
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "INSERT INTO time_entries (employee_id, start_time, end_time) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("iss", $data['employee_id'], $data['start_time'], $data['end_time']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Zeiteintrag erfolgreich hinzugefügt"]);
        } else {
            echo json_encode(["error" => "Fehler beim Hinzufügen des Zeiteintrags"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "UPDATE time_entries SET start_time = ?, end_time = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $data['start_time'], $data['end_time'], $data['id']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Zeiteintrag erfolgreich aktualisiert"]);
        } else {
            echo json_encode(["error" => "Fehler beim Aktualisieren des Zeiteintrags"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $sql = "DELETE FROM time_entries WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Zeiteintrag erfolgreich gelöscht"]);
        } else {
            echo json_encode(["error" => "Fehler beim Löschen des Zeiteintrags"]);
        }
        break;
}

$conn->close();