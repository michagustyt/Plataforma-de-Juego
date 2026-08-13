<?php
// ============================================================
// guardar_preguntas.php — Sobreescribe el JSON de preguntas de un nivel
// Recibe JSON: { "nivel": 1, "preguntas": [...] }
// ============================================================
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit();
}

$body = json_decode(file_get_contents('php://input'), true);

if (!$body || !isset($body['nivel']) || !isset($body['preguntas'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos inválidos. Se requieren nivel y preguntas']);
    exit();
}

$nivel     = (int)$body['nivel'];
$preguntas = $body['preguntas'];

if ($nivel < 1 || $nivel > 9) {
    http_response_code(400);
    echo json_encode(['error' => 'Nivel inválido. Debe estar entre 1 y 9']);
    exit();
}

$baseDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';

// Crear directorio si no existe
if (!is_dir($baseDir)) {
    mkdir($baseDir, 0755, true);
}

$archivo = $baseDir . DIRECTORY_SEPARATOR . "preguntas_nivel{$nivel}.json";
$contenidoJSON = json_encode($preguntas, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

if (file_put_contents($archivo, $contenidoJSON) !== false) {
    echo json_encode(['ok' => true, 'mensaje' => "Preguntas del nivel {$nivel} guardadas correctamente", 'total' => count($preguntas)]);
} else {
    http_response_code(500);
    echo json_encode(['error' => "No se pudo escribir el archivo. Verifica los permisos de la carpeta /data/"]);
}
