<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

verificar_autenticacion();

$metodo = $_SERVER['REQUEST_METHOD'];
$id_usuario = $_SESSION['usuario_id'];

if ($metodo === 'GET') {
    // Obtener progreso del usuario actual
    $sql = "SELECT id, id_nivel, puntuacion, completado, intentos, fecha_inicio, fecha_completado FROM progreso WHERE id_usuario = ? ORDER BY id_nivel";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    
    $progreso = [];
    while ($fila = $resultado->fetch_assoc()) {
        $progreso[] = $fila;
    }
    
    http_response_code(200);
    echo json_encode([
        'exito' => true,
        'progreso' => $progreso
    ]);
    
} elseif ($metodo === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    $id_nivel = $datos['id_nivel'] ?? null;
    $puntuacion = $datos['puntuacion'] ?? 0;
    $completado = $datos['completado'] ?? false;
    
    if (!$id_nivel) {
        http_response_code(400);
        echo json_encode(['error' => 'id_nivel es requerido']);
        exit();
    }
    
    // Verificar si ya existe progreso para este nivel
    $sql_existe = "SELECT id, intentos FROM progreso WHERE id_usuario = ? AND id_nivel = ?";
    $stmt_existe = $conexion->prepare($sql_existe);
    $stmt_existe->bind_param('ii', $id_usuario, $id_nivel);
    $stmt_existe->execute();
    $resultado_existe = $stmt_existe->get_result();
    
    if ($resultado_existe->num_rows > 0) {
        // Actualizar progreso existente
        $progreso_existente = $resultado_existe->fetch_assoc();
        $nuevos_intentos = $progreso_existente['intentos'] + 1;
        
        $sql_update = "UPDATE progreso SET puntuacion = ?, completado = ?, intentos = ?, fecha_completado = NOW() WHERE id_usuario = ? AND id_nivel = ?";
        $stmt_update = $conexion->prepare($sql_update);
        $stmt_update->bind_param('ibiii', $puntuacion, $completado, $nuevos_intentos, $id_usuario, $id_nivel);
        
        if ($stmt_update->execute()) {
            http_response_code(200);
            echo json_encode([
                'exito' => true,
                'mensaje' => 'Progreso actualizado'
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al actualizar progreso']);
        }
    } else {
        // Insertar nuevo progreso
        $sql_insert = "INSERT INTO progreso (id_usuario, id_nivel, puntuacion, completado, intentos) VALUES (?, ?, ?, ?, 1)";
        $stmt_insert = $conexion->prepare($sql_insert);
        $stmt_insert->bind_param('iiii', $id_usuario, $id_nivel, $puntuacion, $completado);
        
        if ($stmt_insert->execute()) {
            http_response_code(201);
            echo json_encode([
                'exito' => true,
                'mensaje' => 'Progreso registrado',
                'progreso_id' => $stmt_insert->insert_id
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Error al registrar progreso']);
        }
    }
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

$conexion->close();
?>