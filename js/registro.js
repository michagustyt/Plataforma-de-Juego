let datosClases = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('api/registro.php?t=' + Date.now());
        if (response.ok) {
            datosClases = await response.json();
            const docentes = new Map();
            datosClases.forEach(item => {
                docentes.set(item.docente_id, item.docente_nombre);
            });
            
            const docenteSelect = document.getElementById('docente_select');
            docentes.forEach((nombre, id) => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = nombre;
                docenteSelect.appendChild(option);
            });
        }
    } catch (e) {
        console.error('Error cargando clases:', e);
    }
});



document.getElementById('docente_select').addEventListener('change', (e) => {
    const idDocente = e.target.value;
    const claseSelect = document.getElementById('clase_select');
    const labelClase = document.getElementById('label_clase');
    
    claseSelect.innerHTML = '<option value="">— Selecciona la Clase —</option>';
    
    if (idDocente) {
        const clasesDocente = datosClases.filter(c => c.docente_id == idDocente);
        clasesDocente.forEach(c => {
            const option = document.createElement('option');
            option.value = c.clase_id;
            option.textContent = c.clase_nombre;
            claseSelect.appendChild(option);
        });
        claseSelect.style.display = 'block';
        labelClase.style.display = 'block';
    } else {
        claseSelect.style.display = 'none';
        labelClase.style.display = 'none';
    }
});

document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const contraseña = document.getElementById('contraseña').value;
    const confirmar_contraseña = document.getElementById('confirmar_contraseña').value;
    const rol = document.getElementById('rol').value;
    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');
    
    // Limpiar mensajes previos
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';
    
    try {
        const response = await fetch('api/registro.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                email: email,
                contraseña: contraseña,
                confirmar_contraseña: confirmar_contraseña,
                rol: rol,
                id_clase: document.getElementById('clase_select').value
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            successMsg.textContent = data.mensaje + ' Redirigiendo a login...';
            successMsg.style.display = 'block';
            
            // Redirigir a login después de 2 segundos
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        } else {
            errorMsg.textContent = data.error || 'Error al crear cuenta';
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMsg.textContent = 'Error de conexión. Intenta de nuevo.';
        errorMsg.style.display = 'block';
    }
});