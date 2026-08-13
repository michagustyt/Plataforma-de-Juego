document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contraseña').value;
    const errorMsg = document.getElementById('errorMsg');
    
    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                contraseña: contraseña
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Login exitoso - redirigir según rol
            const rol = data.usuario.rol;
            
            if (rol === 'alumno') {
                window.location.href = 'dashboard_alumno.html';
            } else if (rol === 'docente') {
                window.location.href = 'dashboard_docente.html';
            } else if (rol === 'admin') {
                window.location.href = 'dashboard_admin.html';
            }
        } else {
            errorMsg.textContent = data.error || 'Error al iniciar sesión';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMsg.textContent = 'Error de conexión. Intenta de nuevo.';
        errorMsg.style.display = 'block';
    }
});

// Verificar si ya hay sesión activa
window.addEventListener('load', async () => {
    try {
        const response = await fetch('api/login.php');
        const data = await response.json();
        
        if (data.autenticado) {
            // Ya hay sesión, redirigir al dashboard
            const rol = data.usuario.rol;
            
            if (rol === 'alumno') {
                window.location.href = 'dashboard_alumno.html';
            } else if (rol === 'docente') {
                window.location.href = 'dashboard_docente.html';
            } else if (rol === 'admin') {
                window.location.href = 'dashboard_admin.html';
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('contraseña');

if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', function () {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}