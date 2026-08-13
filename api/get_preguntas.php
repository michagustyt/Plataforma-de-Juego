<?php
// ============================================================
// get_preguntas.php — Lee el JSON de preguntas de un nivel
// Uso: GET /api/get_preguntas.php?nivel=1
// ============================================================
require_once 'config.php';

$nivel = isset($_GET['nivel']) ? (int)$_GET['nivel'] : 0;

if ($nivel < 1 || $nivel > 9) {
    http_response_code(400);
    echo json_encode(['error' => 'Nivel inválido. Debe estar entre 1 y 9']);
    exit();
}

// Los archivos JSON están en /juego/data/
$baseDir = dirname(__DIR__) . DIRECTORY_SEPARATOR . 'data';
$archivo = $baseDir . DIRECTORY_SEPARATOR . "preguntas_nivel{$nivel}.json";

if (!file_exists($archivo)) {
    http_response_code(404);
    echo json_encode(['error' => "No se encontró el archivo de preguntas para el nivel {$nivel}"]);
    exit();
}

$contenido = file_get_contents($archivo);
$preguntas = json_decode($contenido, true);

if ($preguntas === null) {
    http_response_code(500);
    echo json_encode(['error' => 'El archivo JSON está mal formado']);
    exit();
}

echo json_encode($preguntas);
