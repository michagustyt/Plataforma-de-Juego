<?php
session_start();
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$host      = 'localhost';
$usuario   = 'root';
$password  = '';
$base_datos = 'cronicas_godin';

$conexion = new mysqli($host, $usuario, $password, $base_datos);
if ($conexion->connect_error) {
    die(json_encode(['error' => 'Conexión fallida: ' . $conexion->connect_error]));
}
$conexion->set_charset('utf8mb4');

// Alias getDB() para compatibilidad con guardar_jugador.php, get_jugador.php, get_jugadores.php
function getDB() {
    global $conexion;
    return $conexion;
}

function verificar_autenticacion() {
    if (!isset($_SESSION['usuario_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'No autenticado.']);
        exit();
    }
}

function verificar_rol($rol_requerido) {
    verificar_autenticacion();
    if ($_SESSION['usuario_rol'] !== $rol_requerido) {
        http_response_code(403);
        echo json_encode(['error' => 'No tienes permiso.']);
        exit();
    }
}

function obtener_usuario_actual($conexion) {
    verificar_autenticacion();
    $id = $_SESSION['usuario_id'];
    $stmt = $conexion->prepare("SELECT id, nombre, email, rol FROM usuarios WHERE id = ?");
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $res = $stmt->get_result();
    if ($res->num_rows === 0) {
        session_destroy();
        http_response_code(401);
        echo json_encode(['error' => 'Usuario no encontrado']);
        exit();
    }
    return $res->fetch_assoc();
}
?>
