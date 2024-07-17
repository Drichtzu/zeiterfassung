<?php
require_once 'config.php';

$stmt = $pdo->query("SELECT t.*, e.firstName, e.lastName 
                     FROM time_entries t 
                     JOIN employees e ON t.employee_id = e.id 
                     ORDER BY t.date DESC, t.start_time DESC");
$entries = $stmt->fetchAll();

echo json_encode($entries);