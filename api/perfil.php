<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

verificar_autenticacion();

$metodo = $_SERVER['REQUEST_METHOD'];
$id_usuario = $_SESSION['usuario_id'];

if ($metodo === 'GET') {
    // Obtener perfil del usuario actual
    $sql = "
        SELECT 
            u.id, u.nombre, u.email, u.rol, u.fecha_registro, u.id_clase,
            p.bio, p.telefono, p.fecha_nacimiento,
            c.nombre AS clase_nombre, d.nombre AS docente_nombre
        FROM usuarios u
        LEFT JOIN perfiles p ON u.id = p.id_usuario
        LEFT JOIN clases c ON u.id_clase = c.id
        LEFT JOIN usuarios d ON c.id_docente = d.id
        WHERE u.id = ?
    ";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    if ($resultado->num_rows === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Usuario no encontrado']);
        exit();
    }
    
    $perfil = $resultado->fetch_assoc();
    
    http_response_code(200);
    echo json_encode([
        'exito' => true,
        'usuario' => $perfil
    ]);
    
} elseif ($metodo === 'PUT') {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    $bio = $datos['bio'] ?? null;
    $telefono = $datos['telefono'] ?? null;
    $fecha_nacimiento = $datos['fecha_nacimiento'] ?? null;
    
    // Actualizar perfil
    $sql = "UPDATE perfiles SET ";
    $parametros = [];
    $tipos = '';
    
    if ($bio !== null) {
        $sql .= "bio = ?";
        $parametros[] = $bio;
        $tipos .= 's';
    }
    
    if ($telefono !== null) {
        if (!empty($parametros)) $sql .= ", ";
        $sql .= "telefono = ?";
        $parametros[] = $telefono;
        $tipos .= 's';
    }
    
    if ($fecha_nacimiento !== null) {
        if (!empty($parametros)) $sql .= ", ";
        $sql .= "fecha_nacimiento = ?";
        $parametros[] = $fecha_nacimiento;
        $tipos .= 's';
    }
    
    if (empty($parametros)) {
        http_response_code(400);
        echo json_encode(['error' => 'No hay datos para actualizar']);
        exit();
    }
    
    $sql .= " WHERE id_usuario = ?";
    $parametros[] = $id_usuario;
    $tipos .= 'i';
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param($tipos, ...$parametros);
    
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            'exito' => true,
            'mensaje' => 'Perfil actualizado correctamente'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error al actualizar perfil']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

$conexion->close();
?>