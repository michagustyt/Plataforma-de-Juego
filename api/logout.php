<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Destruir sesión del servidor
    session_destroy();
    
    http_response_code(200);
    echo json_encode([
        'exito' => true,
        'mensaje' => 'Sesión cerrada correctamente'
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

?>