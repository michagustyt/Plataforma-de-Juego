// ============================================================
// theme.js — Lógica para configuración global (Tema y Fondos)
// Se carga ANTES del DOM para evitar FOUC
// ============================================================

(function () {
    // ── 1. Aplicar preferencia guardada inmediatamente ──────
    const savedTheme   = localStorage.getItem('theme')          || 'light';
    const hideBg       = localStorage.getItem('hideBackgrounds') === 'true';

    document.documentElement.setAttribute('data-theme',   savedTheme);
    document.documentElement.setAttribute('data-hide-bg', hideBg);

    // ── 2. Función pública: cambiar tema ────────────────────
    window.setTheme = function (theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        // Sincronizar todos los toggles de la página
        document.querySelectorAll('.theme-toggle-checkbox').forEach(cb => {
            cb.checked = (theme === 'dark');
        });
        document.querySelectorAll('.theme-toggle-label').forEach(lbl => {
            lbl.title = (theme === 'dark') ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
        });
    };

    window.toggleTheme = function () {
        const current = localStorage.getItem('theme') || 'light';
        window.setTheme(current === 'dark' ? 'light' : 'dark');
    };

    // ── 3. Función pública: ocultar/mostrar fondos ──────────
    window.setHideBg = function (hide) {
        document.documentElement.setAttribute('data-hide-bg', hide);
        localStorage.setItem('hideBackgrounds', hide);
        const cb = document.getElementById('hideBgCheck');
        if (cb) cb.checked = hide;
    };

    // ── 4. Inyectar el toggle en la topbar ──────────────────
    function injectThemeToggle() {
        const topbarRight = document.querySelector('.topbar-right');
        if (!topbarRight) return;

        const isDark = (localStorage.getItem('theme') || 'light') === 'dark';

        const wrapper = document.createElement('div');
        wrapper.className = 'theme-toggle-wrap';
        wrapper.innerHTML = `
            <span class="theme-icon">☀️</span>
            <label class="theme-toggle-label" title="${isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}">
                <input type="checkbox" class="theme-toggle-checkbox" ${isDark ? 'checked' : ''}>
                <span class="theme-toggle-slider"></span>
            </label>
            <span class="theme-icon">🌙</span>
        `;

        // Insertar antes del primer botón
        topbarRight.insertBefore(wrapper, topbarRight.firstChild);

        wrapper.querySelector('.theme-toggle-checkbox').addEventListener('change', function () {
            window.setTheme(this.checked ? 'dark' : 'light');
        });
    }

    // ── 5. Modal de configuración completa (juego) ──────────
    window.abrirConfiguracion = function () {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const currentHideBg = localStorage.getItem('hideBackgrounds') === 'true';

        Swal.fire({
            title: '⚙️ Configuración',
            html: `
                <div style="text-align:left;font-size:1rem;padding:10px;">
                    <div style="margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;padding:14px;background:rgba(0,0,0,0.05);border-radius:12px;">
                        <label for="swal-theme" style="cursor:pointer;">
                            <strong>${currentTheme === 'dark' ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}</strong><br>
                            <small style="font-weight:normal;opacity:0.7;">Cambia la apariencia de todas las pantallas</small>
                        </label>
                        <input type="checkbox" id="swal-theme" ${currentTheme === 'dark' ? 'checked' : ''} style="width:22px;height:22px;cursor:pointer;accent-color:#e76f51;">
                    </div>
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:14px;background:rgba(0,0,0,0.05);border-radius:12px;">
                        <label for="swal-hide-bg" style="cursor:pointer;">
                            <strong>🖼️ Ocultar imágenes de fondo</strong><br>
                            <small style="font-weight:normal;opacity:0.7;">Mejora el rendimiento en dispositivos lentos</small>
                        </label>
                        <input type="checkbox" id="swal-hide-bg" ${currentHideBg ? 'checked' : ''} style="width:22px;height:22px;cursor:pointer;accent-color:#e76f51;">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '💾 Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e76f51',
            cancelButtonColor: '#6c757d',
            focusConfirm: false,
            preConfirm: () => ({
                isDark:    document.getElementById('swal-theme').checked,
                isHideBg:  document.getElementById('swal-hide-bg').checked
            })
        }).then((result) => {
            if (result.isConfirmed) {
                window.setTheme(result.value.isDark ? 'dark' : 'light');
                window.setHideBg(result.value.isHideBg);
                Swal.fire({
                    icon: 'success', title: '¡Guardado!',
                    text: 'Configuración actualizada.',
                    timer: 1500, showConfirmButton: false
                });
            }
        });
    };

    // ── 6. Init al cargar el DOM ────────────────────────────
    document.addEventListener('DOMContentLoaded', () => {
        injectThemeToggle();

        // Botón configBtn (pantallas del juego)
        const configBtn = document.getElementById('configBtn');
        if (configBtn) configBtn.addEventListener('click', window.abrirConfiguracion);

        // Botón configuración del sidebar (alumno)
        const sideConfigBtn = document.getElementById('sideConfigBtn');
        if (sideConfigBtn) sideConfigBtn.addEventListener('click', window.abrirConfiguracion);

        // ── Inyectar botón "Volver al Admin" si estamos en modo vista ──
        const topbarRight = document.querySelector('.topbar-right');
        if (topbarRight) {
            fetch('api/switch_role.php')
                .then(r => r.json())
                .then(info => {
                    if (!info.emulando) return;

                    const rolLabel = info.rol_activo === 'docente' ? 'Docente' : 'Alumno';
                    const btn = document.createElement('button');
                    btn.className = 'tb-btn';
                    btn.style.marginRight = '8px';
                    btn.innerHTML = `<i class="fas fa-arrow-left"></i> Volver a Admin`;
                    btn.title = 'Estás viendo el panel como ' + rolLabel + '. Haz clic para regresar al panel de administrador.';

                    btn.addEventListener('click', async () => {
                        try {
                            const r = await fetch('api/switch_role.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ rol: 'admin' })
                            }).then(r => r.json());
                            if (r.ok) window.location.href = r.redirect;
                        } catch(e) {}
                    });

                    // Insertar ANTES del toggle de tema (primer hijo)
                    topbarRight.insertBefore(btn, topbarRight.firstChild);
                })
                .catch(() => {}); // silencioso si no existe el endpoint
        }
    });
})();
