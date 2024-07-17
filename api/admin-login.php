<?php
header('Content-Type: application/json');

// Verbindung zur Datenbank herstellen
require_once 'config.php';

// Empfangen der POST-Daten
$data = json_decode(file_get_contents('php://input'), true);
$inputPassword = $data['password'];

// SQL-Abfrage vorbereiten und ausführen
$stmt = $conn->prepare("SELECT password FROM admin_users WHERE username = 'admin'");
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $storedPassword = $row['password'];

    // Überprüfen des Passworts
    if (password_verify($inputPassword, $storedPassword)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
} else {
    echo json_encode(['success' => false]);
}

$conn->close();
?>