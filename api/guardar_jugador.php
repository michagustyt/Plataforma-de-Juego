<?php
// guardar_jugador.php — Guarda progreso del jugador usando la sesión activa
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

// Verificar sesión
if (!isset($_SESSION['usuario_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'No autenticado']);
    exit();
}

$body = json_decode(file_get_contents('php://input'), true);
if (!$body) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos']);
    exit();
}

// Siempre usar el id de la sesión (ignorar el id que mande el cliente)
$id        = (int)$_SESSION['usuario_id'];
$nombre    = $_SESSION['usuario_nombre'] ?? 'Godín';
$nivel     = isset($body['nivel'])     ? (int)$body['nivel']     : 0;
$puntaje   = isset($body['puntaje'])   ? (int)$body['puntaje']   : 0;
$precision = isset($body['precision']) ? trim($body['precision']) : '0';

$conn = getDB();

$sql = "INSERT INTO jugadores (id, nombre, nivel, puntaje, precision_pct, timestamp)
        VALUES (?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
            nombre        = VALUES(nombre),
            nivel         = VALUES(nivel),
            puntaje       = VALUES(puntaje),
            precision_pct = VALUES(precision_pct),
            timestamp     = NOW()";

$stmt = $conn->prepare($sql);
$stmt->bind_param('ssiis', $id, $nombre, $nivel, $puntaje, $precision);

if ($stmt->execute()) {
    echo json_encode(['ok' => true, 'mensaje' => 'Progreso guardado']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
