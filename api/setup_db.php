<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'cronicas_godin';

// Conectar sin especificar BD para crearla si no existe
$conexion = new mysqli($host, $usuario, $password);

if ($conexion->connect_error) {
    echo json_encode(['error' => 'Conexión fallida: ' . $conexion->connect_error]);
    exit();
}

// Crear base de datos
$sql_crear_bd = "CREATE DATABASE IF NOT EXISTS cronicas_godin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if (!$conexion->query($sql_crear_bd)) {
    echo json_encode(['error' => 'Error al crear BD: ' . $conexion->error]);
    exit();
}

// Usar la BD
$conexion->select_db($base_datos);

// Crear tabla usuarios
$sql_usuarios = "
CREATE TABLE IF NOT EXISTS usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('alumno', 'docente', 'admin') DEFAULT 'alumno',
    id_clase INT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";

if (!$conexion->query($sql_usuarios)) {
    echo json_encode(['error' => 'Error al crear tabla usuarios: ' . $conexion->error]);
    exit();
}

// Crear tabla perfiles
$sql_perfiles = "
CREATE TABLE IF NOT EXISTS perfiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNIQUE NOT NULL,
    bio TEXT,
    foto_perfil VARCHAR(255),
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";

if (!$conexion->query($sql_perfiles)) {
    echo json_encode(['error' => 'Error al crear tabla perfiles: ' . $conexion->error]);
    exit();
}

// Crear tabla progreso
$sql_progreso = "
CREATE TABLE IF NOT EXISTS progreso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_nivel INT NOT NULL,
    puntuacion INT DEFAULT 0,
    completado BOOLEAN DEFAULT FALSE,
    intentos INT DEFAULT 0,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";

if (!$conexion->query($sql_progreso)) {
    echo json_encode(['error' => 'Error al crear tabla progreso: ' . $conexion->error]);
    exit();
}

// Crear tabla clases (para agrupar alumnos por docente)
$sql_clases = "
CREATE TABLE IF NOT EXISTS clases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_docente INT NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_docente) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";

if (!$conexion->query($sql_clases)) {
    echo json_encode(['error' => 'Error al crear tabla clases: ' . $conexion->error]);
    exit();
}

// Crear tabla actividades
$sql_actividades = "
CREATE TABLE IF NOT EXISTS actividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50),
    puntos_totales INT DEFAULT 100,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";

if (!$conexion->query($sql_actividades)) {
    echo json_encode(['error' => 'Error al crear tabla actividades: ' . $conexion->error]);
    exit();
}

// Crear tabla jugadores (resumen de progreso global)
$sql_jugadores = "
CREATE TABLE IF NOT EXISTS jugadores (
    id INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    nivel INT NOT NULL DEFAULT 0,
    puntaje INT NOT NULL DEFAULT 0,
    precision_pct VARCHAR(10) NOT NULL DEFAULT '0',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES usuarios(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
";

if (!$conexion->query($sql_jugadores)) {
    echo json_encode(['error' => 'Error al crear tabla jugadores: ' . $conexion->error]);
    exit();
}

echo json_encode([
    'exito' => true,
    'mensaje' => 'Base de datos inicializada correctamente',
    'tablas_creadas' => ['usuarios', 'perfiles', 'progreso', 'clases', 'actividades', 'jugadores']
]);

$conexion->close();
?>