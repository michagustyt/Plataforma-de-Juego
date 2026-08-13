# Sistema de Login - Crónicas Fiscales

## Configuración Inicial

### 1. Base de Datos (XAMPP)

#### Crear la base de datos:

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Crea una nueva base de datos llamada `cronicas_godin`
3. Asegúrate de que MySQL esté corriendo en XAMPP

#### Ejecutar el script de setup:

1. Accede a: `http://localhost/cronicas_godin/api/setup_db.php`
2. Esto creará automáticamente todas las tablas necesarias

### 2. Estructura de Archivos Creados

```
api/
├── config.php          # Conexión a base de datos
├── setup_db.php        # Script para crear tablas
├── login.php           # Autenticación de usuarios
├── registro.php        # Registro de nuevos usuarios
├── perfil.php          # Gestión del perfil
├── progreso.php        # Gestión del progreso
└── logout.php          # Cerrar sesión

css/
├── login.css           # Estilos para login/registro
└── dashboard.css       # Estilos para dashboard

js/
├── login.js            # Lógica del login
├── registro.js         # Lógica del registro
└── dashboard_alumno.js # Dashboard del alumno

├── login.html          # Página de login
├── registro.html       # Página de registro
└── dashboard_alumno.html # Dashboard del alumno
```

### 3. Roles y Permisos

**Alumno:**
- Ver su perfil
- Ver sus actividades
- Ver su progreso
- Actualizar información personal

**Docente:** (Próximamente)
- Ver sus alumnos de su clase
- Ver progreso de sus alumnos
- Crear y asignar actividades
- Ver panel de control

**Administrador:** (Próximamente)
- Ver todos los alumnos
- Ver todos los docentes
- Gestionar usuarios
- Ver reportes generales

### 4. Flujo de Autenticación

1. Usuario va a `login.html`
2. Ingresa email y contraseña
3. Backend valida credenciales en `api/login.php`
4. Si es correcto, se redirige según rol:
   - Alumno → `dashboard_alumno.html`
   - Docente → `dashboard_docente.html`
   - Admin → `dashboard_admin.html`

### 5. Credenciales de Prueba

Para registrar usuarios de prueba:
1. Ve a `registro.html`
2. Completa el formulario
3. Selecciona el rol (Estudiante o Docente)
4. Haz clic en "Crear Cuenta"

### 6. Próximas Funcionalidades

- [ ] Dashboard del Docente
- [ ] Dashboard del Administrador
- [ ] Sistema de actividades
- [ ] Sistema de calificaciones
- [ ] Reportes de progreso
- [ ] Notificaciones
- [ ] Recuperación de contraseña

## Notas Importantes

- Las contraseñas se almacenan con hash bcrypt
- Las sesiones se manejan en el servidor (PHP)
- Los datos del usuario se guardan en localStorage para acceso rápido
- La conexión a BD es local (localhost)

## Solución de Problemas

### Error de conexión a BD
- Verifica que MySQL esté corriendo en XAMPP
- Comprueba las credenciales en `api/config.php`
- Asegúrate de que la base de datos `cronicas_godin` existe

### Las tablas no se crean
- Intenta acceder a `api/setup_db.php` manualmente
- Revisa la consola del navegador para mensajes de error
- Verifica los permisos de MySQL