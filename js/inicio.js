const audio = document.getElementById('background-music');
const musicButton = document.querySelector('.music-button');
const musicIcon = document.getElementById('music-icon');
const musicText = document.getElementById('music-text');
let isMusicPlaying = false;

audio.volume = 0.3;

// Verificar sesión activa al cargar inicio
window.addEventListener('load', async () => {
    try {
        const response = await fetch('api/login.php');
        const data = await response.json();
        if (!data.autenticado) {
            window.location.href = 'login.html';
        }
        // Si está autenticado, permanece en inicio.html (página de juego)
    } catch (error) {
        console.error('Error verificando sesión:', error);
    }
});

// Botón de configuración: muestra info del usuario logueado
document.getElementById('configBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('api/perfil.php');
        if (response.status === 401) {
            window.location.href = 'login.html';
            return;
        }
        const data = await response.json();
        if (data.usuario) {
            const u = data.usuario;
            Swal.fire({
                title: '⚙️ Mi cuenta',
                html: `
                    <div style="text-align:left; font-size:15px; line-height:2">
                        <p><strong>👤 Nombre:</strong> ${u.nombre}</p>
                        <p><strong>📧 Email:</strong> ${u.email}</p>
                        <p><strong>🎓 Rol:</strong> ${u.rol}</p>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: '🚪 Cerrar sesión',
                cancelButtonText: 'Cerrar',
                confirmButtonColor: '#dc3545',
                cancelButtonColor: '#6c757d'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await fetch('api/logout.php', { method: 'POST' });
                    window.location.href = 'login.html';
                }
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

function iniciarJuego() {
    Swal.fire({
        title: "¡Buena suerte! 😉",
        text: "¡El juego comenzará pronto!",
        icon: ""
    });
    window.location.href = 'introduccion.html';
    if (!isMusicPlaying) {
        audio.play();
        isMusicPlaying = true;
        musicIcon.textContent = '🔇';
        musicText.textContent = 'Silencio';
    }
}

function toggleMusic() {
    if (isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
        musicIcon.textContent = '🎵';
        musicText.textContent = 'Música';
    } else {
        audio.play().then(() => {
            isMusicPlaying = true;
            musicIcon.textContent = '🔇';
            musicText.textContent = 'Silencio';
        }).catch(() => {});
    }
}

window.toggleMusic = toggleMusic;
window.iniciarJuego = iniciarJuego;
