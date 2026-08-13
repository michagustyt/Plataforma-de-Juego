<?php
// ============================================================
// eliminar_jugadores.php — Borra TODOS los registros
// Uso: POST /api/eliminar_jugadores.php
// ============================================================
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

$conn = getDB();

if ($conn->query("DELETE FROM jugadores")) {
    echo json_encode(['ok' => true, 'eliminados' => $conn->affected_rows]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al eliminar: ' . $conn->error]);
}

$conn->close();
