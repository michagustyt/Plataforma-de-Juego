<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    $email = $datos['email'] ?? null;
    $contraseña = $datos['contraseña'] ?? null;
    
    if (!$email || !$contraseña) {
        http_response_code(400);
        echo json_encode(['error' => 'Email y contraseña son requeridos']);
        exit();
    }
    
    // Buscar usuario por email
    $sql = "SELECT id, nombre, email, contraseña, rol, activo FROM usuarios WHERE email = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit();
    }
    
    $usuario = $resultado->fetch_assoc();
    
    // Verificar si el usuario está activo
    if (!$usuario['activo']) {
        http_response_code(403);
        echo json_encode(['error' => 'Usuario desactivado']);
        exit();
    }
    
    // Verificar contraseña
    if (!password_verify($contraseña, $usuario['contraseña'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
        exit();
    }
    
    // Crear sesión
    $_SESSION['usuario_id'] = $usuario['id'];
    $_SESSION['usuario_nombre'] = $usuario['nombre'];
    $_SESSION['usuario_email'] = $usuario['email'];
    $_SESSION['usuario_rol'] = $usuario['rol'];
    
    // Actualizar último acceso
    $sql_update = "UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?";
    $stmt_update = $conexion->prepare($sql_update);
    $stmt_update->bind_param('i', $usuario['id']);
    $stmt_update->execute();
    
    http_response_code(200);
    echo json_encode([
        'exito' => true,
        'mensaje' => 'Login exitoso',
        'usuario' => [
            'id' => $usuario['id'],
            'nombre' => $usuario['nombre'],
            'email' => $usuario['email'],
            'rol' => $usuario['rol']
        ]
    ]);
    
} elseif ($metodo === 'GET') {
    // Obtener estado de sesión actual
    if (isset($_SESSION['usuario_id'])) {
        echo json_encode([
            'autenticado' => true,
            'usuario' => [
                'id' => $_SESSION['usuario_id'],
                'nombre' => $_SESSION['usuario_nombre'],
                'email' => $_SESSION['usuario_email'],
                'rol' => $_SESSION['usuario_rol']
            ]
        ]);
    } else {
        echo json_encode(['autenticado' => false]);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

$conexion->close();
?>