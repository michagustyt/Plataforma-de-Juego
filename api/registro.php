<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET') {
    // Retornar todas las clases agrupadas por docente para el registro
    $res = $conexion->query("SELECT c.id AS clase_id, c.nombre AS clase_nombre, u.id AS docente_id, u.nombre AS docente_nombre FROM usuarios u LEFT JOIN clases c ON c.id_docente = u.id WHERE u.rol = 'docente' ORDER BY u.nombre, c.nombre");
    $clases = [];
    while ($r = $res->fetch_assoc()) {
        $clases[] = $r;
    }
    echo json_encode($clases);
    exit();
}

if ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    $nombre = trim($datos['nombre'] ?? '');
    $email = trim($datos['email'] ?? '');
    $contraseña = $datos['contraseña'] ?? '';
    $confirmar_contraseña = $datos['confirmar_contraseña'] ?? '';
    $rol = $datos['rol'] ?? 'alumno';
    $id_clase = $datos['id_clase'] ?? null;
    
    // Validaciones
    if (!$nombre || !$email || !$contraseña || !$confirmar_contraseña) {
        http_response_code(400);
        echo json_encode(['error' => 'Todos los campos son requeridos']);
        exit();
    }
    
    if (strlen($nombre) < 3) {
        http_response_code(400);
        echo json_encode(['error' => 'El nombre debe tener al menos 3 caracteres']);
        exit();
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email inválido']);
        exit();
    }
    
    if (strlen($contraseña) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'La contraseña debe tener al menos 6 caracteres']);
        exit();
    }
    
    if ($contraseña !== $confirmar_contraseña) {
        http_response_code(400);
        echo json_encode(['error' => 'Las contraseñas no coinciden']);
        exit();
    }
    
    if (!in_array($rol, ['alumno', 'docente'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Rol inválido']);
        exit();
    }
    
    // Verificar si el email ya existe
    $sql_existe = "SELECT id FROM usuarios WHERE email = ?";
    $stmt_existe = $conexion->prepare($sql_existe);
    $stmt_existe->bind_param('s', $email);
    $stmt_existe->execute();
    
    if ($stmt_existe->get_result()->num_rows > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'El email ya está registrado']);
        exit();
    }
    
    // Hashear contraseña
    $contraseña_hash = password_hash($contraseña, PASSWORD_BCRYPT);
    
    // Insertar usuario
    if ($rol === 'alumno' && !empty($id_clase)) {
        $sql_insert = "INSERT INTO usuarios (nombre, email, contraseña, rol, activo, id_clase) VALUES (?, ?, ?, ?, TRUE, ?)";
        $stmt_insert = $conexion->prepare($sql_insert);
        $stmt_insert->bind_param('ssssi', $nombre, $email, $contraseña_hash, $rol, $id_clase);
    } else {
        $sql_insert = "INSERT INTO usuarios (nombre, email, contraseña, rol, activo) VALUES (?, ?, ?, ?, TRUE)";
        $stmt_insert = $conexion->prepare($sql_insert);
        $stmt_insert->bind_param('ssss', $nombre, $email, $contraseña_hash, $rol);
    }
    
    if (!$stmt_insert->execute()) {
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear usuario: ' . $stmt_insert->error]);
        exit();
    }
    
    $usuario_id = $stmt_insert->insert_id;
    
    // Crear perfil vacío
    $sql_perfil = "INSERT INTO perfiles (id_usuario) VALUES (?)";
    $stmt_perfil = $conexion->prepare($sql_perfil);
    $stmt_perfil->bind_param('i', $usuario_id);
    $stmt_perfil->execute();
    
    http_response_code(201);
    echo json_encode([
        'exito' => true,
        'mensaje' => 'Usuario registrado exitosamente. Por favor inicia sesión.',
        'usuario_id' => $usuario_id
    ]);
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

$conexion->close();
?>