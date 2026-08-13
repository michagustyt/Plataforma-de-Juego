<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';

verificar_autenticacion();

$metodo = $_SERVER['REQUEST_METHOD'];
$rol_usuario = $_SESSION['usuario_rol'];
$id_usuario_actual = $_SESSION['usuario_id'];

if ($metodo === 'GET' && isset($_GET['action'])) {
    $action = $_GET['action'];

    if ($action === 'todos') {
        verificar_rol('admin');
        $sql = "SELECT id, nombre, email, rol, activo, fecha_registro FROM usuarios ORDER BY fecha_registro DESC";
        $resultado = $conexion->query($sql);
        $usuarios = [];
        while ($fila = $resultado->fetch_assoc()) $usuarios[] = $fila;
        echo json_encode($usuarios); // array directo

    } elseif ($action === 'docentes') {
        $sql = "SELECT id, nombre, email FROM usuarios WHERE rol = 'docente' ORDER BY nombre";
        $resultado = $conexion->query($sql);
        $docentes = [];
        while ($fila = $resultado->fetch_assoc()) {
            $fila['alumnos_asignados'] = obtener_alumnos_docente($conexion, $fila['id']);
            $docentes[] = $fila;
        }
        echo json_encode($docentes); // array directo

    } elseif ($action === 'alumnos') {
        if ($rol_usuario === 'docente') {
            $sql = "SELECT u.id, u.nombre, u.email, u.id_clase, u.activo FROM usuarios u WHERE u.rol = 'alumno' AND u.id_clase = ? ORDER BY u.nombre";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param('i', $id_usuario_actual);
        } elseif ($rol_usuario === 'admin') {
            $sql = "SELECT u.id, u.nombre, u.email, u.id_clase, u.activo, d.nombre as docente_nombre 
                    FROM usuarios u 
                    LEFT JOIN clases c ON u.id_clase = c.id 
                    LEFT JOIN usuarios d ON c.id_docente = d.id 
                    WHERE u.rol = 'alumno' 
                    ORDER BY u.nombre";
            $stmt = $conexion->prepare($sql);
        } else {
            http_response_code(403);
            echo json_encode(['error' => 'No tienes permiso']);
            exit();
        }
        $stmt->execute();
        $resultado = $stmt->get_result();
        $alumnos = [];
        while ($fila = $resultado->fetch_assoc()) $alumnos[] = $fila;
        echo json_encode($alumnos); // array directo

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Acción no reconocida']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}

function obtener_alumnos_docente($conexion, $id_docente) {
    $sql = "SELECT COUNT(*) as total FROM usuarios WHERE rol = 'alumno' AND id_clase = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $id_docente);
    $stmt->execute();
    $fila = $stmt->get_result()->fetch_assoc();
    return (int)$fila['total'];
}

$conexion->close();
?>
