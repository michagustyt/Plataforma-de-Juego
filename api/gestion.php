<?php
header('Content-Type: application/json; charset=utf-8');
require_once 'config.php';
verificar_autenticacion();

$metodo = $_SERVER['REQUEST_METHOD'];
$rol    = $_SESSION['usuario_rol'];
$yo     = $_SESSION['usuario_id'];

// ─── GET ───────────────────────────────────────────────────────────────────
if ($metodo === 'GET') {
    $action = $_GET['action'] ?? '';

    // Listar todos los docentes (admin)
    if ($action === 'docentes') {
        verificar_rol('admin');
        $res = $conexion->query("SELECT id, nombre, email, activo FROM usuarios WHERE rol='docente' ORDER BY nombre");
        $rows = [];
        while ($r = $res->fetch_assoc()) $rows[] = $r;
        echo json_encode($rows);

    // Listar clases (admin ve todas; docente ve las suyas)
    } elseif ($action === 'clases') {
        if ($rol === 'admin') {
            $res = $conexion->query("SELECT c.id, c.nombre, c.descripcion, u.nombre AS docente_nombre, u.id AS id_docente,
                (SELECT COUNT(*) FROM usuarios WHERE id_clase=c.id AND rol='alumno') AS total_alumnos
                FROM clases c JOIN usuarios u ON c.id_docente=u.id ORDER BY c.nombre");
        } else {
            $stmt = $conexion->prepare("SELECT c.id, c.nombre, c.descripcion,
                (SELECT COUNT(*) FROM usuarios WHERE id_clase=c.id AND rol='alumno') AS total_alumnos
                FROM clases c WHERE c.id_docente=? ORDER BY c.nombre");
            $stmt->bind_param('i', $yo);
            $stmt->execute();
            $res = $stmt->get_result();
        }
        $rows = [];
        while ($r = $res->fetch_assoc()) $rows[] = $r;
        echo json_encode($rows);

    // Alumnos de una clase
    } elseif ($action === 'alumnos_clase') {
        $id_clase = (int)($_GET['id_clase'] ?? 0);
        $stmt = $conexion->prepare("SELECT u.id, u.nombre, u.email, u.activo FROM usuarios u
            WHERE u.id_clase=? AND u.rol='alumno' ORDER BY u.nombre");
        $stmt->bind_param('i', $id_clase);
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = [];
        while ($r = $res->fetch_assoc()) $rows[] = $r;
        echo json_encode($rows);

    // Alumnos (todos) para poder re-asignarlos
    } elseif ($action === 'alumnos_sin_clase') {
        $res = $conexion->query("SELECT u.id, u.nombre, u.email, u.id_clase, c.nombre AS nombre_clase FROM usuarios u LEFT JOIN clases c ON u.id_clase = c.id WHERE u.rol='alumno' ORDER BY u.nombre");
        $rows = [];
        while ($r = $res->fetch_assoc()) $rows[] = $r;
        echo json_encode($rows);

    // Progreso de alumnos de mis clases (docente) o todos (admin)
    } elseif ($action === 'progreso_alumnos') {
        if ($rol === 'docente') {
            $sql = "SELECT u.id, u.nombre, u.email, u.id_clase, j.nivel, j.puntaje, j.precision_pct AS `precision`, j.timestamp
                FROM usuarios u
                JOIN clases c ON u.id_clase=c.id AND c.id_docente=?
                LEFT JOIN jugadores j ON j.id=u.id
                WHERE u.rol='alumno' ORDER BY j.puntaje DESC";
            $stmt = $conexion->prepare($sql);
            $stmt->bind_param('i', $yo);
        } else {
            $sql = "SELECT u.id, u.nombre, u.email, u.id_clase, j.nivel, j.puntaje, j.precision_pct AS `precision`, j.timestamp
                FROM usuarios u LEFT JOIN jugadores j ON j.id=u.id
                WHERE u.rol='alumno' ORDER BY j.puntaje DESC";
            $stmt = $conexion->prepare($sql);
        }
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = [];
        while ($r = $res->fetch_assoc()) $rows[] = $r;
        echo json_encode($rows);
    // Ranking de clase para docente o admin
    } elseif ($action === 'ranking_clase') {
        $id_clase = isset($_GET['id_clase']) ? (int)$_GET['id_clase'] : 0;
        if (!$id_clase) { echo json_encode([]); exit(); }
        $sql = "SELECT u.id, u.nombre, IFNULL(j.puntaje, 0) as puntaje, IFNULL(j.nivel, 0) as nivel 
                FROM usuarios u 
                LEFT JOIN jugadores j ON j.id = u.id 
                WHERE u.id_clase = ? AND u.rol = 'alumno' 
                ORDER BY puntaje DESC, u.nombre ASC";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param('i', $id_clase);
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = [];
        $rank = 1;
        while ($r = $res->fetch_assoc()) {
            $r['posicion'] = $rank++;
            $rows[] = $r;
        }
        echo json_encode($rows);

    // Ranking para alumno (ve a su propia clase)
    } elseif ($action === 'ranking_mi_clase') {
        verificar_rol('alumno');
        $stmt = $conexion->prepare("SELECT id_clase FROM usuarios WHERE id = ?");
        $stmt->bind_param('i', $yo);
        $stmt->execute();
        $clase_res = $stmt->get_result()->fetch_assoc();
        $id_clase = $clase_res['id_clase'] ?? 0;
        
        if (!$id_clase) { echo json_encode([]); exit(); }
        
        $sql = "SELECT u.id, u.nombre, IFNULL(j.puntaje, 0) as puntaje, IFNULL(j.nivel, 0) as nivel 
                FROM usuarios u 
                LEFT JOIN jugadores j ON j.id = u.id 
                WHERE u.id_clase = ? AND u.rol = 'alumno' 
                ORDER BY puntaje DESC, u.nombre ASC";
        $stmt = $conexion->prepare($sql);
        $stmt->bind_param('i', $id_clase);
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = [];
        $rank = 1;
        while ($r = $res->fetch_assoc()) {
            $r['posicion'] = $rank++;
            $rows[] = $r;
        }
        echo json_encode($rows);


    // Stats para dashboard admin
    } elseif ($action === 'stats_admin') {
        verificar_rol('admin');
        $stats = [];
        $stats['total_usuarios'] = $conexion->query("SELECT COUNT(*) c FROM usuarios")->fetch_assoc()['c'];
        $stats['total_docentes'] = $conexion->query("SELECT COUNT(*) c FROM usuarios WHERE rol='docente'")->fetch_assoc()['c'];
        $stats['total_alumnos']  = $conexion->query("SELECT COUNT(*) c FROM usuarios WHERE rol='alumno'")->fetch_assoc()['c'];
        $stats['total_clases']   = $conexion->query("SELECT COUNT(*) c FROM clases")->fetch_assoc()['c'];
        echo json_encode($stats);

    // Stats para dashboard docente
    } elseif ($action === 'stats_docente') {
        verificar_rol('docente');
        $stats = [];
        $stmt = $conexion->prepare("SELECT COUNT(*) c FROM usuarios u JOIN clases c ON u.id_clase=c.id WHERE c.id_docente=? AND u.rol='alumno'");
        $stmt->bind_param('i', $yo);
        $stmt->execute();
        $stats['total_alumnos'] = $stmt->get_result()->fetch_assoc()['c'];
        $stmt2 = $conexion->prepare("SELECT COUNT(*) c FROM clases WHERE id_docente=?");
        $stmt2->bind_param('i', $yo);
        $stmt2->execute();
        $stats['total_clases'] = $stmt2->get_result()->fetch_assoc()['c'];
        echo json_encode($stats);

    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Acción no reconocida']);
    }

// ─── POST ──────────────────────────────────────────────────────────────────
} elseif ($metodo === 'POST') {
    $datos  = json_decode(file_get_contents('php://input'), true);
    $action = $datos['action'] ?? '';

    // Crear docente (admin)
    if ($action === 'crear_docente') {
        verificar_rol('admin');
        $nombre = trim($datos['nombre'] ?? '');
        $email  = trim($datos['email'] ?? '');
        $pass   = $datos['password'] ?? '';
        if (!$nombre || !$email || !$pass) { echo json_encode(['error'=>'Datos incompletos']); exit(); }
        $hash = password_hash($pass, PASSWORD_DEFAULT);
        $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?,?,'','docente')");
        $stmt->bind_param('ss', $nombre, $email);
        // set real password
        $stmt2 = $conexion->prepare("INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?,?,?,?)");
        $rol2='docente';
        $stmt2->bind_param('ssss', $nombre, $email, $hash, $rol2);
        if ($stmt2->execute()) {
            echo json_encode(['ok'=>true, 'id'=>$stmt2->insert_id]);
        } else {
            echo json_encode(['error'=>'Email ya registrado o error DB: '.$conexion->error]);
        }
    } elseif ($action === 'editar_docente') {
        verificar_rol('admin');
        $id = (int)($datos['id'] ?? 0);
        $nombre = trim($datos['nombre'] ?? '');
        $email = trim($datos['email'] ?? '');
        if (!$id || !$nombre || !$email) { echo json_encode(['error'=>'Datos incompletos']); exit(); }
        $stmt = $conexion->prepare("UPDATE usuarios SET nombre=?, email=? WHERE id=? AND rol='docente'");
        $stmt->bind_param('ssi', $nombre, $email, $id);
        if ($stmt->execute()) echo json_encode(['ok'=>true]);
        else echo json_encode(['error'=>'Error DB: '.$conexion->error]);

    } elseif ($action === 'eliminar_docente') {
        verificar_rol('admin');
        $id = (int)($datos['id'] ?? 0);
        if (!$id) { echo json_encode(['error'=>'ID requerido']); exit(); }
        // Eliminar docente y sus clases/alumnos relacionados dependerá de la estructura (foreign keys con CASCADE)
        // Por simplicidad, solo borraremos el usuario
        $stmt = $conexion->prepare("DELETE FROM usuarios WHERE id=? AND rol='docente'");
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) echo json_encode(['ok'=>true]);
        else echo json_encode(['error'=>'Error DB: '.$conexion->error]);

    } elseif ($action === 'editar_alumno') {
        verificar_rol('admin');
        $id = (int)($datos['id'] ?? 0);
        $nombre = trim($datos['nombre'] ?? '');
        $email = trim($datos['email'] ?? '');
        if (!$id || !$nombre || !$email) { echo json_encode(['error'=>'Datos incompletos']); exit(); }
        $stmt = $conexion->prepare("UPDATE usuarios SET nombre=?, email=? WHERE id=? AND rol='alumno'");
        $stmt->bind_param('ssi', $nombre, $email, $id);
        if ($stmt->execute()) echo json_encode(['ok'=>true]);
        else echo json_encode(['error'=>'Error DB: '.$conexion->error]);

    } elseif ($action === 'eliminar_alumno') {
        verificar_rol('admin');
        $id = (int)($datos['id'] ?? 0);
        if (!$id) { echo json_encode(['error'=>'ID requerido']); exit(); }
        $stmt = $conexion->prepare("DELETE FROM usuarios WHERE id=? AND rol='alumno'");
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) echo json_encode(['ok'=>true]);
        else echo json_encode(['error'=>'Error DB: '.$conexion->error]);


    // Crear clase (admin o docente)
    } elseif ($action === 'crear_clase') {
        $nombre = trim($datos['nombre'] ?? '');
        $desc   = trim($datos['descripcion'] ?? '');
        $id_doc = ($rol === 'admin') ? (int)($datos['id_docente'] ?? $yo) : $yo;
        if (!$nombre) { echo json_encode(['error'=>'Nombre requerido']); exit(); }
        $stmt = $conexion->prepare("INSERT INTO clases (nombre, descripcion, id_docente) VALUES (?,?,?)");
        $stmt->bind_param('ssi', $nombre, $desc, $id_doc);
        if ($stmt->execute()) echo json_encode(['ok'=>true,'id'=>$stmt->insert_id]);
        else echo json_encode(['error'=>'Error al crear clase']);

    // Crear alumno (admin o docente)
    } elseif ($action === 'crear_alumno') {
        $nombre   = trim($datos['nombre'] ?? '');
        $email    = trim($datos['email'] ?? '');
        $pass     = $datos['password'] ?? '';
        $id_clase = (int)($datos['id_clase'] ?? 0);
        if (!$nombre || !$email || !$pass) { echo json_encode(['error'=>'Datos incompletos']); exit(); }
        // Docente solo puede asignar a sus clases
        if ($rol === 'docente' && $id_clase) {
            $chk = $conexion->prepare("SELECT id FROM clases WHERE id=? AND id_docente=?");
            $chk->bind_param('ii', $id_clase, $yo);
            $chk->execute();
            if ($chk->get_result()->num_rows === 0) { echo json_encode(['error'=>'Clase no pertenece a este docente']); exit(); }
        }
        $hash = password_hash($pass, PASSWORD_DEFAULT);
        $rol2 = 'alumno';
        if ($id_clase) {
            $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, email, contraseña, rol, id_clase) VALUES (?,?,?,?,?)");
            $stmt->bind_param('ssssi', $nombre, $email, $hash, $rol2, $id_clase);
        } else {
            $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?,?,?,?)");
            $stmt->bind_param('ssss', $nombre, $email, $hash, $rol2);
        }
        if ($stmt->execute()) echo json_encode(['ok'=>true,'id'=>$stmt->insert_id]);
        else echo json_encode(['error'=>'Email ya registrado o error DB: '.$conexion->error]);

    // Asignar alumno existente a clase
    } elseif ($action === 'asignar_alumno') {
        $id_alumno = (int)($datos['id_alumno'] ?? 0);
        $id_clase  = (int)($datos['id_clase']  ?? 0);
        if (!$id_alumno || !$id_clase) { echo json_encode(['error'=>'Datos incompletos']); exit(); }
        if ($rol === 'docente') {
            $chk = $conexion->prepare("SELECT id FROM clases WHERE id=? AND id_docente=?");
            $chk->bind_param('ii', $id_clase, $yo);
            $chk->execute();
            if ($chk->get_result()->num_rows === 0) { echo json_encode(['error'=>'Sin permiso']); exit(); }
        }
        $stmt = $conexion->prepare("UPDATE usuarios SET id_clase=? WHERE id=? AND rol='alumno'");
        $stmt->bind_param('ii', $id_clase, $id_alumno);
        if ($stmt->execute()) echo json_encode(['ok'=>true]);
        else echo json_encode(['error'=>'Error al asignar']);

    // Eliminar/desasignar alumno de clase
    } elseif ($action === 'desasignar_alumno') {
        $id_alumno = (int)($datos['id_alumno'] ?? 0);
        $stmt = $conexion->prepare("UPDATE usuarios SET id_clase=NULL WHERE id=? AND rol='alumno'");
        $stmt->bind_param('i', $id_alumno);
        if ($stmt->execute()) echo json_encode(['ok'=>true]);
        else echo json_encode(['error'=>'Error']);

    // Restablecer contraseña de alumno
    } elseif ($action === 'restablecer_password_alumno') {
        $id_alumno = (int)($datos['id_alumno'] ?? 0);
        $nueva_pass = $datos['nueva_password'] ?? '';
        
        if (!$id_alumno || !$nueva_pass) { echo json_encode(['error'=>'Datos incompletos']); exit(); }
        
        // Si es docente, verificar que el alumno le pertenece
        if ($rol === 'docente') {
            $chk = $conexion->prepare("SELECT u.id FROM usuarios u JOIN clases c ON u.id_clase = c.id WHERE u.id=? AND c.id_docente=? AND u.rol='alumno'");
            $chk->bind_param('ii', $id_alumno, $yo);
            $chk->execute();
            if ($chk->get_result()->num_rows === 0) { echo json_encode(['error'=>'No tienes permiso para editar a este alumno']); exit(); }
        }
        
        $hash = password_hash($nueva_pass, PASSWORD_DEFAULT);
        $stmt = $conexion->prepare("UPDATE usuarios SET contraseña=? WHERE id=? AND rol='alumno'");
        $stmt->bind_param('si', $hash, $id_alumno);
        
        if ($stmt->execute()) {
            echo json_encode(['ok'=>true]);
        } else {
            echo json_encode(['error'=>'Error al actualizar la contraseña']);
        }

    } else {
        http_response_code(400);
        echo json_encode(['error'=>'Acción no reconocida']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error'=>'Método no permitido']);
}
$conexion->close();
?>
