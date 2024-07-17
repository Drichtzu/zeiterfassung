<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        $sql = "SELECT * FROM employees";
        $result = $conn->query($sql);
        $employees = [];
        while($row = $result->fetch_assoc()) {
            $employees[] = $row;
        }
        echo json_encode($employees);
        break;
    
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "INSERT INTO employees (name, position) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $data['name'], $data['position']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Mitarbeiter erfolgreich hinzugefügt"]);
        } else {
            echo json_encode(["error" => "Fehler beim Hinzufügen des Mitarbeiters"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $sql = "UPDATE employees SET name = ?, position = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $data['name'], $data['position'], $data['id']);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Mitarbeiter erfolgreich aktualisiert"]);
        } else {
            echo json_encode(["error" => "Fehler beim Aktualisieren des Mitarbeiters"]);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'];
        $sql = "DELETE FROM employees WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo json_encode(["message" => "Mitarbeiter erfolgreich gelöscht"]);
        } else {
            echo json_encode(["error" => "Fehler beim Löschen des Mitarbeiters"]);
        }
        break;
}

$conn->close();