# Crónicas Fiscales - El Origen del Godín

Juego educativo interactivo sobre contabilidad fiscal con sistema de autenticación y roles de usuario.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Nuevas Características](#nuevas-características)
- [Instalación](#instalación)
- [Estructura de Base de Datos](#estructura-de-base-de-datos)
- [Roles y Permisos](#roles-y-permisos)
- [API Rest](#api-rest)
- [Guía de Uso](#guía-de-uso)
- [Cambios Realizados](#cambios-realizados)

## 🎮 Descripción

**Crónicas Fiscales** es un juego educativo que enseña a los estudiantes sobre contabilidad, impuestos y cumplimiento fiscal a través de una experiencia gamificada. El jugador toma el rol de un "Gódin" (profesional contable) que debe superar 9 niveles de desafíos fiscales.

### Características Originales (Sin Cambios)

- ✅ 9 niveles de juego progresivos
- ✅ Sistema de preguntas y respuestas
- ✅ Tracking de puntuación
- ✅ Modo oscuro disponible
- ✅ Panel de docente para ver progreso
- ✅ Música de fondo ambiental

## 🆕 Nuevas Características

### Sistema de Autenticación

- ✅ Registro de nuevos usuarios
- ✅ Login con email y contraseña
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sesiones seguras con PHP

### Roles y Dashboards

- ✅ **Alumno**: Panel personal con progreso individual
- ✅ **Docente**: Visualiza solo sus alumnos, reportes por clase
- ✅ **Administrador**: Panel completo del sistema, todos los usuarios

### Base de Datos Local

- ✅ MySQL con XAMPP
- ✅ Tablas optimizadas para usuarios, perfiles y progreso
- ✅ Sin dependencias externas (Firebase)

### API Rest

- ✅ Endpoints para autenticación
- ✅ CRUD de usuarios
- ✅ Gestión de perfiles
- ✅ Tracking de progreso

## 🚀 Instalación

### Requisitos

- XAMPP 7.4+ (Apache + MySQL + PHP)
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Git (opcional)

### Paso 1: Configurar XAMPP

1. **Descarga XAMPP** desde [apachefriends.org](https://www.apachefriends.org/)
2. **Instala XAMPP** en tu computadora
3. **Inicia los servicios**:
   - Abre el Control Panel de XAMPP
   - Inicia Apache
   - Inicia MySQL

### Paso 2: Clonar o Descargar el Proyecto

**Opción A: Con Git**
```bash
git clone https://github.com/michagustyt/cronicas_godin.git
cd cronicas_godin
```

**Opción B: Descargar ZIP**
1. Descarga el repositorio como ZIP
2. Extrae en `C:\xampp\htdocs\cronicas_godin` (Windows)
   O `/Applications/XAMPP/htdocs/cronicas_godin` (Mac)

### Paso 3: Crear Base de Datos

1. Abre **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Haz clic en "Nueva"
3. Nombre: `cronicas_godin`
4. Collation: `utf8mb4_unicode_ci`
5. Clic en "Crear"

### Paso 4: Ejecutar Setup

1. Ve a: `http://localhost/cronicas_godin/api/setup_db.php`
2. Deberías ver: ✅ "Base de datos inicializada correctamente"
3. Si hay errores, verifica:
   - Apache y MySQL estén corriendo
   - Permisos en la carpeta del proyecto
   - Credenciales en `api/config.php`

### Paso 5: Acceder a la Aplicación

Abre en tu navegador: **`http://localhost/cronicas_godin`**

## 🗄️ Estructura de Base de Datos

### Tabla: `usuarios`

Almacena información de todos los usuarios.

```sql
CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('alumno', 'docente', 'admin') DEFAULT 'alumno',
    id_clase INT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_acceso TIMESTAMP NULL
);
```

**Campos:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | INT | Identificador único |
| nombre | VARCHAR(100) | Nombre completo |
| email | VARCHAR(100) | Email único para login |
| contraseña | VARCHAR(255) | Hash bcrypt |
| rol | ENUM | alumno, docente o admin |
| id_clase | INT | Referencia a clase (docentes) |
| activo | BOOLEAN | Estado del usuario |
| fecha_registro | TIMESTAMP | Fecha de creación |
| ultimo_acceso | TIMESTAMP | Último acceso |

### Tabla: `perfiles`

Información adicional del usuario.

```sql
CREATE TABLE perfiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT UNIQUE NOT NULL,
    bio TEXT,
    foto_perfil VARCHAR(255),
    telefono VARCHAR(20),
    fecha_nacimiento DATE,
    fecha_actualizacion TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
```

### Tabla: `progreso`

Registra el progreso en actividades.

```sql
CREATE TABLE progreso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_actividad INT NOT NULL,
    puntuacion INT DEFAULT 0,
    completado BOOLEAN DEFAULT FALSE,
    intentos INT DEFAULT 0,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);
```

### Tabla: `clases`

Agrupa alumnos por docente.

```sql
CREATE TABLE clases (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    id_docente INT NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_docente) REFERENCES usuarios(id)
);
```

### Tabla: `actividades`

Define las actividades del juego.

```sql
CREATE TABLE actividades (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(50),
    puntos_totales INT DEFAULT 100,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 👥 Roles y Permisos

### 🎓 Alumno

**Permisos:**
- ✅ Ver su perfil personal
- ✅ Jugar todos los niveles
- ✅ Ver su progreso personal
- ✅ Editar información personal
- ❌ Ver otros alumnos
- ❌ Ver datos de docentes

**Dashboard:**
- Resumen de progreso
- Lista de actividades completadas
- Puntuación total
- Botón para comenzar aventura

### 👨‍🏫 Docente

**Permisos:**
- ✅ Ver su perfil personal
- ✅ Ver SOLO los alumnos de su clase
- ✅ Ver progreso detallado de sus alumnos
- ✅ Exportar reportes de su clase
- ✅ Editar información personal
- ❌ Ver alumnos de otros docentes
- ❌ Acceder a panel de admin

**Dashboard:**
- Lista de sus alumnos
- Progreso por alumno
- Estadísticas de clase
- Exportar PDF
- Gestionar preguntas (si aplica)

### 👨‍💼 Administrador

**Permisos:**
- ✅ Ver todos los usuarios
- ✅ Gestionar docentes
- ✅ Gestionar alumnos
- ✅ Ver reportes globales
- ✅ Activar/Desactivar usuarios
- ✅ Exportar reportes completos
- ✅ Acceso total al sistema

**Dashboard:**
- Estadísticas completas
- Lista de todos los usuarios
- Gestión de docentes
- Gestión de alumnos
- Sistema de reportes

## 🔐 Flujo de Autenticación

### Registro

```
┌─────────────────┐
│ registro.html   │ ← Usuario llena formulario
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ api/registro.php        │ ← Validar datos
└────────┬────────────────┘
         │
         ├─ Verificar email único
         ├─ Hash contraseña (bcrypt)
         ├─ Guardar usuario
         └─ Crear perfil vacío
         │
         ▼
┌─────────────────┐
│ login.html      │ ← Redirigir para login
└─────────────────┘
```

### Login

```
┌─────────────────┐
│ login.html      │ ← Email + Contraseña
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ api/login.php           │ ← Verificar credenciales
└────────┬────────────────┘
         │
         ├─ Buscar usuario por email
         ├─ Verificar contraseña (bcrypt)
         ├─ Crear sesión
         └─ Guardar en localStorage
         │
         ▼
    ┌────────────┐
    │  Según rol │
    └─────┬──────┘
         │
    ┌────┴────────────────────┐
    │                         │
    ▼                         ▼
Alumno              Docente/Admin
dashboard_alumno → dashboard_docente
.html               .html o
                    dashboard_admin.html
```

## 📡 API Rest

### Base URL

```
http://localhost/cronicas_godin/api/
```

### Endpoints de Autenticación

#### POST `/login.php`

**Request:**
```json
{
  "email": "usuario@example.com",
  "contraseña": "micontraseña123"
}
```

**Response (200):**
```json
{
  "mensaje": "Login exitoso",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "alumno"
  }
}
```

**Response (401):**
```json
{
  "error": "Credenciales inválidas"
}
```

---

#### POST `/registro.php`

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contraseña": "micontraseña123",
  "rol": "alumno"
}
```

**Response (201):**
```json
{
  "mensaje": "Usuario registrado exitosamente",
  "usuario_id": 1
}
```

---

#### POST `/logout.php`

**Response (200):**
```json
{
  "mensaje": "Sesión cerrada correctamente"
}
```

---

### Endpoints de Usuarios

#### GET `/usuarios.php?action=todos`

Solo Admin. Obtiene todos los usuarios.

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "alumno",
    "activo": true,
    "fecha_registro": "2026-07-10T00:00:00"
  }
]
```

---

#### GET `/usuarios.php?action=docentes`

Obtiene todos los docentes.

**Response:**
```json
[
  {
    "id": 2,
    "nombre": "Prof. María",
    "email": "maria@example.com",
    "alumnos_asignados": 15
  }
]
```

---

#### GET `/usuarios.php?action=alumnos`

- **Admin/Docente:** Todos los alumnos / Solo sus alumnos

**Response:**
```json
[
  {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "docente_nombre": "Prof. María"
  }
]
```

---

### Endpoints de Perfil

#### GET `/perfil.php`

Obtiene el perfil del usuario actual.

**Response:**
```json
{
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  },
  "perfil": {
    "bio": "Estudiante de contabilidad",
    "telefono": "1234567890",
    "fecha_nacimiento": "2000-01-01"
  }
}
```

---

#### PUT `/perfil.php`

Actualiza el perfil del usuario.

**Request:**
```json
{
  "bio": "Mi nueva bio",
  "telefono": "9876543210",
  "fecha_nacimiento": "2000-01-01"
}
```

**Response (200):**
```json
{
  "mensaje": "Perfil actualizado"
}
```

---

### Endpoints de Progreso

#### GET `/progreso.php`

Obtiene el progreso del usuario actual.

**Response:**
```json
[
  {
    "id": 1,
    "id_actividad": 1,
    "puntuacion": 85,
    "completado": true,
    "intentos": 2,
    "fecha_completado": "2026-07-10T10:30:00"
  }
]
```

---

#### POST `/progreso.php`

Registra una actividad completada.

**Request:**
```json
{
  "id_actividad": 1,
  "puntuacion": 85,
  "completado": true
}
```

**Response (201):**
```json
{
  "mensaje": "Progreso registrado",
  "progreso_id": 5
}
```

---

## 📁 Estructura de Archivos

```
cronicas_godin/
│
├── api/
│   ├── config.php              # Configuración y conexión BD
│   ├── setup_db.php            # Script de inicialización
│   ├── login.php               # Autenticación
│   ├── registro.php            # Crear usuario
│   ├── logout.php              # Cerrar sesión
│   ├── perfil.php              # Gestión de perfil
│   ├── progreso.php            # Seguimiento de progreso
│   ├── usuarios.php            # CRUD de usuarios
│   └── estadisticas.php        # Reportes (Admin)
│
├── css/
│   ├── inicio.css              # Estilos portada
│   ├── dark-mode.css           # Tema oscuro
│   ├── dashboard.css           # Estilos dashboards
│   └── [otros estilos originales]
│
├── js/
│   ├── theme.js                # Cambio de tema
│   ├── login.js                # Lógica de login
│   ├── registro.js             # Lógica de registro
│   ├── dashboard_alumno.js     # Dashboard alumno
│   ├── dashboard_docente.js    # Dashboard docente
│   ├── dashboard_admin.js      # Dashboard admin
│   └── [otros scripts originales]
│
├── html/
│   ├── capitulo1.html          # Nivel 1
│   ├── capitulo2.html          # Nivel 2
│   └── ... [hasta capitulo9]
│
├── data/
│   └── [datos del juego]
│
├── assets/
│   ├── Audio.mp3               # Música de fondo
│   └── [otras imágenes/assets]
│
├── login.html                  # Página de login
├── registro.html               # Página de registro
├── dashboard_alumno.html       # Panel del alumno
├── dashboard_docente.html      # Panel del docente
├── dashboard_admin.html        # Panel del admin
├── inicio.html                 # Portada original
├── introduccion.html           # Selección de niveles
├── paneldocente.html           # Panel docente original
├── final.html                  # Pantalla final
├── README.md                   # Esta documentación
└── .gitignore
```

## 🎮 Guía de Uso

### Para Alumno

1. **Registrarse:**
   - Ve a `http://localhost/cronicas_godin/registro.html`
   - Completa el formulario
   - Selecciona rol: "Estudiante"
   - Haz clic en "Crear Cuenta"

2. **Login:**
   - Ve a `http://localhost/cronicas_godin/login.html`
   - Ingresa email y contraseña
   - Haz clic en "Entrar"

3. **Dashboard:**
   - Verás tu progreso personal
   - Haz clic en "Comenzar Aventura" para jugar
   - El sistema rastreará tu progreso

4. **Ver Progreso:**
   - En el dashboard, sección "Mi Progreso"
   - Puedes ver puntuación por nivel

### Para Docente

1. **Registrarse como Docente:**
   - Ve a `http://localhost/cronicas_godin/registro.html`
   - Selecciona rol: "Docente"
   - Completa el formulario y registrate

2. **Acceder al Dashboard:**
   - Login con tus credenciales
   - Verás automáticamente el panel de docente

3. **Ver Alumnos:**
   - Sección "Mis Alumnos"
   - Solo ves los alumnos de tu clase
   - Puedes ver su progreso detallado

4. **Exportar Reportes:**
   - Botón "Exportar PDF"
   - Se descargará un reporte de tus alumnos

### Para Administrador

1. **Crear Usuario Admin:**
   - En phpMyAdmin: `usuarios` tabla
   - Inserta un usuario con `rol = 'admin'`
   - O edita un usuario existente

2. **Acceder al Dashboard:**
   - Login con credenciales de admin
   - Verás el panel de administrador

3. **Gestionar Usuarios:**
   - Sección "Todos los Usuarios"
   - Puedes ver y gestionar todos
   - Sección "Docentes" y "Alumnos" separadas

4. **Ver Reportes:**
   - Sección "Reportes"
   - Exportar estadísticas completas del sistema

## 🔧 Configuración Avanzada

### Cambiar Credenciales de Base de Datos

Edita `api/config.php`:

```php
$host = 'localhost';        // Host MySQL
$usuario = 'root';          // Usuario MySQL
$password = '';             // Contraseña
$base_datos = 'cronicas_godin';  // Nombre BD
```

### Cambiar Puerto de MySQL

Si usas un puerto diferente a 3306:

```php
$conexion = new mysqli($host, $usuario, $password, $base_datos, 3307);
```

### Habilitar HTTPS

Para producción, modifica las URLs a `https://`

## 🐛 Solución de Problemas

### Error: "Conexión fallida"

**Solución:**
- Verifica que Apache y MySQL estén corriendo
- Comprueba que la BD `cronicas_godin` existe
- Revisa credenciales en `api/config.php`
- Ejecuta nuevamente `api/setup_db.php`

### Error: "Email ya registrado"

**Solución:**
- El email ya existe en la BD
- Usa un email diferente
- O elimina el usuario de phpMyAdmin

### Error: "Las tablas no se crean"

**Solución:**
- Ve a `http://localhost/cronicas_godin/api/setup_db.php`
- Revisa los mensajes de error
- Verifica permisos de la carpeta

### Contraseña olvidada

**Solución:**
- Crea una nueva cuenta con otro email
- O accede a phpMyAdmin y borra el usuario para registrarlo nuevamente

## 📝 Cambios Realizados

### Versión 1.0 - Sistema de Login

**Archivos Creados:**
- ✅ `api/config.php` - Configuración
- ✅ `api/setup_db.php` - Inicializar BD
- ✅ `api/login.php` - Autenticación
- ✅ `api/registro.php` - Registro
- ✅ `api/logout.php` - Cerrar sesión
- ✅ `api/perfil.php` - Gestión de perfil
- ✅ `api/progreso.php` - Seguimiento
- ✅ `api/usuarios.php` - CRUD usuarios
- ✅ `login.html` - Página de login
- ✅ `registro.html` - Página de registro
- ✅ `dashboard_alumno.html` - Panel alumno
- ✅ `dashboard_docente.html` - Panel docente
- ✅ `dashboard_admin.html` - Panel admin
- ✅ `js/login.js` - Lógica login
- ✅ `js/registro.js` - Lógica registro
- ✅ `js/dashboard_alumno.js` - Lógica dashboard
- ✅ `js/dashboard_docente.js` - Lógica docente
- ✅ `js/dashboard_admin.js` - Lógica admin
- ✅ `css/dashboard.css` - Estilos dashboards

**Archivos NO Modificados:**
- ✅ `inicio.html` - Original intacto
- ✅ `introduccion.html` - Original intacto
- ✅ `paneldocente.html` - Original intacto
- ✅ `final.html` - Original intacto
- ✅ Estructura de actividades - Original intacta
- ✅ Estilos originales - Sin cambios

**Características:**
- ✅ Sistema de autenticación completo
- ✅ Tres roles de usuario (alumno, docente, admin)
- ✅ Base de datos local con MySQL
- ✅ Perfiles de usuario personalizables
- ✅ Tracking de progreso
- ✅ API REST completa
- ✅ Dashboards específicos por rol
- ✅ Exportación a PDF

## 🚀 Próximas Funcionalidades

- [ ] Recuperación de contraseña por email
- [ ] Edición de actividades por docente
- [ ] Sistema de notificaciones
- [ ] Certificados de finalización
- [ ] Análisis avanzado de desempeño
- [ ] Foto de perfil
- [ ] Chat entre docente y alumnos
- [ ] Badges y logros
- [ ] Integración con Google Classroom

## 📞 Contacto y Soporte

Para reportar problemas o sugerencias:
- Crea un **Issue** en el repositorio
- Contacta al desarrollador

## 📄 Licencia

Este proyecto es parte del curso de **Ingeniería en Sistemas Computacionales**.

**Créditos:**
- Docentes: Benedicta Domínguez, Miriam Olvera
- Desarrolladores: [Tu nombre aquí]
- Institución: UPT (Universidad Politécnica de Tulancingo)

---

**Última actualización:** 10 de julio de 2026
**Versión:** 1.0
**Estado:** En desarrollo
#   P l a t a f o r m a - d e - J u e g o  
 