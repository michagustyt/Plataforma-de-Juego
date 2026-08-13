<?php
require 'c:/xampp/htdocs/cronicas/api/config.php';
$res = $conexion->query("SELECT c.id AS clase_id, c.nombre AS clase_nombre, u.id AS docente_id, u.nombre AS docente_nombre FROM usuarios u LEFT JOIN clases c ON c.id_docente = u.id WHERE u.rol = 'docente' ORDER BY u.nombre, c.nombre");
$clases = [];
while ($r = $res->fetch_assoc()) {
    $clases[] = $r;
}
echo json_encode($clases);
?>
