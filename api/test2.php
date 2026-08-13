<?php
require 'c:/xampp/htdocs/cronicas/api/config.php';
$res = $conexion->query("SELECT id, nombre, rol FROM usuarios");
print_r($res->fetch_all(MYSQLI_ASSOC));
?>
