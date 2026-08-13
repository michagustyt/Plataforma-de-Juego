<?php
// switch_role.php — Permite al administrador emular otro rol temporalmente
// Solo funciona si el usuario real es 'admin'. No modifica la base de datos.
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

verificar_autenticacion();

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'POST') {
    // Solo el admin real puede cambiar de rol
    $rol_real = $_SESSION['usuario_rol_real'] ?? $_SESSION['usuario_rol'];
    if ($rol_real !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Solo el administrador puede cambiar de modo.']);
        exit();
    }

    $datos   = json_decode(file_get_contents('php://input'), true);
    $nuevo_rol = $datos['rol'] ?? '';

    $roles_permitidos = ['admin', 'docente', 'alumno'];
    if (!in_array($nuevo_rol, $roles_permitidos)) {
        http_response_code(400);
        echo json_encode(['error' => 'Rol inválido.']);
        exit();
    }

    // Guardar el rol real la primera vez
    if (!isset($_SESSION['usuario_rol_real'])) {
        $_SESSION['usuario_rol_real']    = $_SESSION['usuario_rol'];
        $_SESSION['usuario_nombre_real'] = $_SESSION['usuario_nombre'];
        $_SESSION['usuario_id_real']     = $_SESSION['usuario_id'];
    }

    if ($nuevo_rol === 'alumno') {
        // Si se quiere ver como alumno, necesitamos un alumno de referencia para ver el dashboard
        // Buscamos un alumno real con clase para que la vista funcione correctamente
        $id_alumno = isset($datos['id_alumno']) ? (int)$datos['id_alumno'] : 0;
        if ($id_alumno > 0) {
            $stmt = $conexion->prepare("SELECT id, nombre, email FROM usuarios WHERE id=? AND rol='alumno' LIMIT 1");
            $stmt->bind_param('i', $id_alumno);
        } else {
            $stmt = $conexion->prepare("SELECT id, nombre, email FROM usuarios WHERE rol='alumno' AND id_clase IS NOT NULL LIMIT 1");
        }
        $stmt->execute();
        $alumno = $stmt->get_result()->fetch_assoc();
        if ($alumno) {
            $_SESSION['usuario_id']     = $alumno['id'];
            $_SESSION['usuario_nombre'] = $alumno['nombre'];
            $_SESSION['usuario_email']  = $alumno['email'];
        }
    } elseif ($nuevo_rol === 'docente') {
        $id_docente = isset($datos['id_docente']) ? (int)$datos['id_docente'] : 0;
        if ($id_docente > 0) {
            $stmt = $conexion->prepare("SELECT id, nombre, email FROM usuarios WHERE id=? AND rol='docente' LIMIT 1");
            $stmt->bind_param('i', $id_docente);
        } else {
            $stmt = $conexion->prepare("SELECT id, nombre, email FROM usuarios WHERE rol='docente' LIMIT 1");
        }
        $stmt->execute();
        $docente = $stmt->get_result()->fetch_assoc();
        if ($docente) {
            $_SESSION['usuario_id']     = $docente['id'];
            $_SESSION['usuario_nombre'] = $docente['nombre'];
            $_SESSION['usuario_email']  = $docente['email'];
        }
    } else {
        // Restaurar el admin real
        $_SESSION['usuario_id']     = $_SESSION['usuario_id_real'];
        $_SESSION['usuario_nombre'] = $_SESSION['usuario_nombre_real'];
        $_SESSION['usuario_email']  = $_SESSION['usuario_email_real'] ?? $_SESSION['usuario_email'];
        unset($_SESSION['usuario_rol_real'], $_SESSION['usuario_nombre_real'], $_SESSION['usuario_id_real']);
    }

    $_SESSION['usuario_rol'] = $nuevo_rol;

    // Determinar la URL de redirección
    $destinos = [
        'admin'   => 'dashboard_admin.html',
        'docente' => 'dashboard_docente.html',
        'alumno'  => 'dashboard_alumno.html',
    ];

    echo json_encode([
        'ok'       => true,
        'rol'      => $nuevo_rol,
        'redirect' => $destinos[$nuevo_rol],
    ]);

} elseif ($metodo === 'GET') {
    // Devuelve info sobre el modo actual
    $rol_real    = $_SESSION['usuario_rol_real']    ?? $_SESSION['usuario_rol'];
    $nombre_real = $_SESSION['usuario_nombre_real'] ?? $_SESSION['usuario_nombre'];
    echo json_encode([
        'rol_activo'   => $_SESSION['usuario_rol'],
        'rol_real'     => $rol_real,
        'nombre_real'  => $nombre_real,
        'emulando'     => isset($_SESSION['usuario_rol_real']),
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

$conexion->close();
?>
