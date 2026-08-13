<?php
// get_jugadores.php — Todos los jugadores con progreso (para panel docente/admin)
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// Requiere sesión activa
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit();
}

$conn = getDB();

// Join con usuarios para tener nombre real y clase
$result = $conn->query(
    "SELECT j.id, u.nombre, j.nivel, j.puntaje,
            j.precision_pct AS `precision`, j.timestamp,
            u.email, u.id_clase
     FROM jugadores j
     JOIN usuarios u ON u.id = j.id
     ORDER BY j.puntaje DESC"
);

$jugadores = [];
while ($row = $result->fetch_assoc()) {
    $row['nivel']   = (int)$row['nivel'];
    $row['puntaje'] = (int)$row['puntaje'];
    $jugadores[] = $row;
}

echo json_encode($jugadores);

$conn->close();
?>
