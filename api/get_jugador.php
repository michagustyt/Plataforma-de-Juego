<?php
// get_jugador.php — Obtiene el progreso del jugador por su id de usuario
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// Aceptar id por GET (desde el juego) o usar la sesión activa
if (isset($_GET['id']) && $_GET['id'] !== '') {
    $id = (int)$_GET['id'];
} elseif (isset($_SESSION['usuario_id'])) {
    $id = (int)$_SESSION['usuario_id'];
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Falta el parámetro id']);
    exit();
}

$conn = getDB();

$stmt = $conn->prepare(
    "SELECT id, nombre, nivel, puntaje, precision_pct AS `precision`, timestamp
     FROM jugadores WHERE id = ?"
);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(null); // Jugador sin progreso aún
} else {
    $jugador = $result->fetch_assoc();
    $jugador['nivel']   = (int)$jugador['nivel'];
    $jugador['puntaje'] = (int)$jugador['puntaje'];
    echo json_encode($jugador);
}

$stmt->close();
$conn->close();
?>
