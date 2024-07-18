<?php
header('Content-Type: application/json');

$host = 'localhost';
$db   = 'zeiterfassung';
$user = 'zeiterfassung_user';
$pass = 'IhrSicheresPasswort';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die(json_encode(['error' => 'Datenbankverbindung fehlgeschlagen: ' . $e->getMessage()]));
}