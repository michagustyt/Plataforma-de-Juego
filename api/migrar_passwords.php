<?php
/**
 * Script para migrar contraseñas de texto plano a Bcrypt.
 * Solo se debe ejecutar una vez para actualizar los usuarios antiguos.
 */
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

global $conexion;

// Seleccionar todos los usuarios
$sql = "SELECT id, email, contraseña FROM usuarios";
$result = $conexion->query($sql);

if (!$result) {
    echo json_encode(['error' => 'Error al consultar usuarios: ' . $conexion->error]);
    exit();
}

$actualizados = 0;
$ya_seguros = 0;
$errores = 0;

while ($usuario = $result->fetch_assoc()) {
    $id = $usuario['id'];
    $pass = $usuario['contraseña'];

    // Un hash bcrypt típicamente tiene 60 caracteres y empieza con $2y$ (en PHP)
    // Verificamos de forma sencilla si ya parece ser un hash
    if (strlen($pass) === 60 && substr($pass, 0, 4) === '$2y$') {
        $ya_seguros++;
        continue;
    }

    // Es texto plano, hay que encriptarlo
    $hash = password_hash($pass, PASSWORD_BCRYPT);
    
    $update_stmt = $conexion->prepare("UPDATE usuarios SET contraseña = ? WHERE id = ?");
    $update_stmt->bind_param('si', $hash, $id);
    
    if ($update_stmt->execute()) {
        $actualizados++;
    } else {
        $errores++;
    }
}

echo json_encode([
    'mensaje' => 'Migración de contraseñas finalizada.',
    'resultados' => [
        'actualizados_a_bcrypt' => $actualizados,
        'ya_estaban_seguros' => $ya_seguros,
        'errores' => $errores
    ]
]);

$conexion->close();
?>
