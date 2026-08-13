// ============================================================
// capitulo4.js — Sin Firebase, 100% local (XAMPP)
// ============================================================

const NIVEL_ACTUAL = 4;
const TITULO_NIVEL = "Nivel 4: Auditoría y control interno en la empresa.";
const API_BASE = '../api';

const personajes = {
    Narrador: { img: "../assets/personajes/Brenda.png", color: "#b8dcecff" },
    Brenda: { img: "../assets/personajes/Brenda2.jpeg", color: "#ecd089ff" },
    Rogelio: { img: "../assets/personajes/DonRogelio.jpeg", color: "#b8c2f3ff" },
    Carlos: { img: "../assets/personajes/Carlos1.jpeg", color: "#f3b8c2ff" },
    Jose: { img: "../assets/personajes/Jose2.jpeg", color: "#f3c2b8ff" }
};

const dialogos = [
    { 
        personaje: "Narrador", 
        texto: "Ha llegado el día más temido... LA AUDITORÍA.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Brenda", 
        texto: "¡LOS AUDITORES YA ESTÁN AQUÍ! ¡Piden papeles de hace 3 años!",
        fondo: "../assets/gente.png" 
    },
    { 
        personaje: "Rogelio", 
        texto: "Cálmate, Brenda. Con controles internos sólidos, no hay nada que temer.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Narrador", 
        texto: "Cada documento cuenta. Cada procedimiento importa. ¿Estás listo, Godín?",
        fondo: "../assets/oficina.png" 
    }
];

// Preguntas locales (fallback si falla la API)
const preguntasLocales = [
    {
        pregunta: "1.- El auditor solicita la carta de representación firmada por la administración.",
        opciones: ["Firmar una hoja en blanco 'para que el auditor la llene'.", "Adjuntar el reglamento interno.", "Elaborar carta firmada por administración, con alcance, limitaciones y confirmaciones clave.", "Enviar un correo informal diciendo 'todo bien'."],
        respuesta: 2,
        feedback: [
            "Jamás se firma algo en blanco; es un grave riesgo legal y profesional. Vida menos.",
            "El reglamento no cumple con los fines de la carta. Vida menos.",
            "Correcto: La carta de representación es un requisito formal que confirma que la información entregada es veraz y completa.",
            "Un correo no sustituye un documento oficial. Vida menos."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "2.- Se detecta una debilidad en el control de compras.",
        opciones: ["Aceptar mayor muestra sustantiva y documentar remediación del control.", "Discutir 4 horas para reducir la muestra.", "Cambiar el flujo del proceso en plena auditoría.", "Esconder facturas problemáticas en 'varios'."],
        respuesta: 0,
        feedback: [
            "Correcto: Si el control es débil, el auditor debe aumentar la evidencia sustantiva y dejar constancia de las acciones correctivas.",
            "Las discusiones no sustituyen evidencia. Vida menos.",
            "Cambiar el proceso durante la auditoría crea más confusión. Vida menos.",
            "Ocultar errores agrava el problema y puede considerarse fraude. Vida menos."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "3.- Hay diferencias porque existen notas de crédito no registradas.",
        opciones: ["Registrar ingresos extra para que cuadre.", "Conciliar contra NC pendientes, registrar ajustes y preparar cédula de diferencias.", "Reenviar confirmaciones hasta que coincidan.", "Ignorar porque 'el cliente siempre se equivoca'."],
        respuesta: 1,
        feedback: [
            "Manipular ingresos genera errores graves o fraudes. Vida menos.",
            "Correcto: La conciliación debe explicar cada diferencia y respaldarse con evidencia contable.",
            "Reenviar confirmaciones hasta que coincidan no resuelve el fondo del problema.",
            "No asumir que el cliente se equivoca; hay que revisar ambas partes."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "4.- Tesorería y contabilidad comparten el mismo usuario del sistema.",
        opciones: ["Segregar roles, activar MFA, bitácoras y revisión trimestral.", "Cambiar la contraseña y ya.", "Dar 'usuario invitado' para todos.", "Llevar control en Excel fuera del ERP."],
        respuesta: 0,
        feedback: [
            "Correcto: Cada usuario debe tener acceso limitado según su función; el MFA y las bitácoras fortalecen la seguridad.",
            "Cambiar contraseña no resuelve la falta de segregación. Vida menos.",
            "'Usuario invitado' es el camino al caos. Vida menos.",
            "Llevar controles fuera del sistema debilita la trazabilidad. Vida menos."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "5.- Después del cierre, un cliente importante entra en concurso mercantil.",
        opciones: ["Cambiar la fecha del cierre.", "Borrar al cliente del catálogo.", "Revelar hecho subsecuente tipo II y evaluar deterioro de cuentas por cobrar.", "No revelar."],
        respuesta: 2,
        feedback: [
            "Manipular fechas es una práctica inaceptable. Vida menos.",
            "Borrar datos no elimina la realidad económica. Vida menos.",
            "Correcto: Los hechos ocurridos después del cierre que afectan la interpretación de los estados deben revelarse.",
            "Omitir información relevante puede engañar a los usuarios de los estados financieros. Vida menos."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "6.- Hay 10,000 pólizas, el control es débil y la tolerancia al error es baja.",
        opciones: ["Pedir al auditor que elija menos.", "Elegir las que 'se ven bien'.", "Tomar 5 al azar.", "Aumentar la muestra, estratificar por riesgo y monto."],
        respuesta: 3,
        feedback: [
            "Reducir muestras sin justificación invalida el trabajo. Vida menos.",
            "'Se ven bien' no es criterio estadístico. Vida menos.",
            "Cinco muestras no son representativas. Vida menos.",
            "Correcto: A menor confianza en los controles, mayor debe ser la muestra para obtener evidencia suficiente."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "7.- No existe una matriz de riesgos formal en la empresa.",
        opciones: ["Guardar todo en la cabeza de Don Rogelio.", "Declarar 'tolerancia infinita al riesgo'.", "Hacer un mapa bonito sin responsables.", "Construir matriz con riesgo inherente, de control, respuesta y dueño del control."],
        respuesta: 3,
        feedback: [
            "Confiar en la memoria de alguien no es control formal. Vida menos.",
            "No tener límites de riesgo es invitar al desastre. Vida menos.",
            "Sin responsables, el mapa no sirve. Vida menos",
            "Correcto: La matriz identifica riesgos, controles y responsables; es base del control interno."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "8.- El auditor detecta un hallazgo material en inventarios.",
        opciones: ["Registrar el ajuste, recalcular indicadores y emitir estados revisados.", "Dejarlo en 'papeleta del auditor' sin registrar.", "Pasarlo a partidas no recurrentes.", "Esperar al año que entra."],
        respuesta: 0,
        feedback: [
            "Correcto: Los hallazgos materiales deben reflejarse en los estados financieros, no solo en los papeles del auditor.",
            "No registrar un ajuste invalida los resultados. Vida menos. Vida menos.",
            "No todo hallazgo se puede 'enterrar' en partidas especiales. Vida menos.",
            "Postergar ajustes solo acumula errores futuros. Vida menos."
        ],
        fondo: "../assets/oficina.png"
    }
];

let preguntas = [];

// --- Variables del juego ---
let puntajeNivel = 0;
let preguntaActual = 0;
let indexDialogo = 0;
let vidas = 5;
let userId = null;
let nombreJugador = "Godín";

// Obtener sesión del servidor (sin localStorage)
async function cargarSesion() {
    try {
        const response = await fetch('../api/login.php');
        const data = await response.json();
        if (!data.autenticado) {
            window.location.href = '../login.html';
            return false;
        }
        userId = data.usuario.id;
        nombreJugador = data.usuario.nombre || "Godín";
        return true;
    } catch (error) {
        console.error('Error al obtener sesión:', error);
        window.location.href = '../login.html';
        return false;
    }
}
let intervaloMaquíinaEscribir;
let respondiendo = false;

// --- Elementos del DOM ---
const dialogoEl = document.getElementById("dialogo");
const juegoEl = document.getElementById("juego");
const barraSuperiorEl = document.getElementById("barraSuperior");
const vidasEl = document.getElementById("vidas");
const avatarImgEl = document.getElementById("avatarImg");
const nombrePersonajeEl = document.getElementById("nombrePersonaje");
const textoDialogoEl = document.getElementById("textoDialogo");
const mensajeEl = document.getElementById("mensaje");
const mensajeContenidoEl = document.getElementById("mensajeContenido");
const mensajeTextoEl = document.getElementById("mensajeTexto");
const mensajeBotonEl = document.getElementById("mensajeBotonPrincipal");
const gameContainerEl = document.querySelector(".game-container");

// --- Lógica de Música ---
const musicButtonEl = document.getElementById("musicButton");
const backgroundMusicEl = document.getElementById("backgroundMusic");
let isMusicPlaying = false;

function playMusic() {
    if (localStorage.getItem('musicEnabled') === 'false') {
        musicButtonEl.innerHTML = '<span>🎵</span> Música';
        return;
    }
    if (!isMusicPlaying) {
        backgroundMusicEl.play().then(() => {
            isMusicPlaying = true;
            musicButtonEl.innerHTML = '<span>🔇</span> Silencio';
            localStorage.setItem('musicEnabled', 'true');
        }).catch(e => {});
    }
}
musicButtonEl.onclick = () => {
    if (isMusicPlaying) {
        backgroundMusicEl.pause();
        isMusicPlaying = false;
        musicButtonEl.innerHTML = '<span>🎵</span> Música';
        localStorage.setItem('musicEnabled', 'false');
    } else {
        backgroundMusicEl.play();
        isMusicPlaying = true;
        musicButtonEl.innerHTML = '<span>🔇</span> Silencio';
        localStorage.setItem('musicEnabled', 'true');
    }
};

// --- Cargar preguntas desde API local ---
async function cargarPreguntas() {
    try {
        const res = await fetch(`${API_BASE}/get_preguntas.php?nivel=${NIVEL_ACTUAL}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            preguntas = data;
            console.log(`✅ ${preguntas.length} preguntas cargadas desde API local`);
            return true;
        }
        throw new Error('Array vacío');
    } catch (error) {
        console.warn('⚠️ API no disponible, usando preguntas locales:', error.message);
        preguntas = [...preguntasLocales];
        return true;
    }
}

// --- Inicialización del Nivel ---
async function inicializarNivel() {
    document.title = TITULO_NIVEL;
    document.getElementById("nivelInfo").textContent = TITULO_NIVEL;

    if (!await cargarSesion()) return;

    const cargadas = await cargarPreguntas();
    if (!cargadas || preguntas.length === 0) {
        Swal.fire({
            title: "Error",
            text: "No hay preguntas disponibles para este nivel.",
            icon: "error"
        }).then(() => {
            window.location.href = '../introduccion.html';
        });
        return;
    }

    actualizarVidas();
    playMusic();
    mostrarDialogo(dialogos[indexDialogo]);
}

// --- Lógica de Diálogos ---
function mostrarDialogo(dialogo) {
    if (!dialogo) return;
    if (dialogo.fondo) {
        document.body.style.backgroundImage = `url('${dialogo.fondo}')`;
    }
    const p = personajes[dialogo.personaje];
    avatarImgEl.src = p.img;
    nombrePersonajeEl.textContent = dialogo.personaje;
    const burbuja = document.querySelector(".burbuja");
    burbuja.style.borderColor = p.color;
    burbuja.style.borderWidth = '4px';
    burbuja.style.backgroundColor = '';
    avatarImgEl.style.borderColor = p.color;
    textoDialogoEl.textContent = "";
    let i = 0;
    const velocidad = 30;
    const texto = dialogo.texto.normalize("NFC");
    if (intervaloMaquíinaEscribir) clearInterval(intervaloMaquíinaEscribir);
    intervaloMaquíinaEscribir = setInterval(() => {
        if (i < texto.length) {
            textoDialogoEl.textContent += texto[i];
            i++;
        } else {
            clearInterval(intervaloMaquíinaEscribir);
        }
    }, velocidad);
}

window.siguienteDialogo = () => {
    if (respondiendo) return;
    if (intervaloMaquíinaEscribir && textoDialogoEl.textContent.length < dialogos[indexDialogo].texto.length) {
        clearInterval(intervaloMaquíinaEscribir);
        textoDialogoEl.textContent = dialogos[indexDialogo].texto;
        return;
    }
    indexDialogo++;
    if (indexDialogo < dialogos.length) {
        mostrarDialogo(dialogos[indexDialogo]);
    } else {
        iniciarJuego();
    }
};

// --- Lógica del Juego ---
function iniciarJuego() {
    respondiendo = true;
    dialogoEl.style.animation = "fadeOut 0.5s ease-out forwards";
    setTimeout(() => {
        dialogoEl.classList.add("oculto");
        barraSuperiorEl.classList.remove("oculto");
        juegoEl.classList.remove("oculto");
        juegoEl.style.zIndex = 5;
        if (preguntas.length > 0 && preguntas[0].fondo) {
            document.body.style.backgroundImage = `url('${preguntas[0].fondo}')`;
        }
        mostrarPregunta();
    }, 500);
}

function mostrarPregunta() {
    const barra = document.getElementById('nivelProgreso');
    if(barra && typeof preguntas !== 'undefined' && preguntas.length > 0) {
        const p = (preguntaActual / preguntas.length) * 100;
        barra.style.width = p + '%';
    }
    if (preguntaActual >= preguntas.length) {
        mostrarVictoria();
        return;
    }
    const p = preguntas[preguntaActual];
    juegoEl.classList.add('fading-out');
    setTimeout(() => {
        document.getElementById("pregunta").textContent = p.pregunta;
        if (p.fondo) {
            document.body.style.backgroundImage = `url('${p.fondo}')`;
        }
        const opcionesDiv = document.querySelector(".opciones");
        opcionesDiv.innerHTML = "";
        p.opciones.forEach((opcion, i) => {
            const btn = document.createElement("button");
            btn.textContent = opcion;
            btn.dataset.index = i;
            btn.onclick = () => verificarRespuesta(btn, i);
            opcionesDiv.appendChild(btn);
        });
        juegoEl.classList.remove('fading-out');
        respondiendo = false;
    }, 400);
}

function verificarRespuesta(btnPresionado, indice) {
    if (respondiendo) return;
    respondiendo = true;
    const p = preguntas[preguntaActual];
    const esCorrecta = (indice === p.respuesta);
    const feedbackTexto = p.feedback[indice];
    const todosLosBotones = document.querySelectorAll(".opciones button");
    todosLosBotones.forEach(btn => { btn.disabled = true; });
    if (esCorrecta) {
        if(window.playCorrect) playCorrect();
        btnPresionado.classList.add("correct");
        puntajeNivel++;
        setTimeout(() => {
            mostrarMensaje(feedbackTexto, "correcto");
            mensajeBotonEl.textContent = "¡Siguiente!";
            mensajeBotonEl.onclick = () => {
                cerrarMensaje();
                preguntaActual++;
                mostrarPregunta();
            };
        }, 1000);
    } else {
        if(window.playWrong) playWrong();
        document.body.classList.add('shake-effect');
        setTimeout(() => document.body.classList.remove('shake-effect'), 500);
        btnPresionado.classList.add("incorrect");
        vidas--;
        actualizarVidas();
        const btnCorrecto = document.querySelector(`.opciones button[data-index="${p.respuesta}"]`);
        if (btnCorrecto) btnCorrecto.classList.add("reveal-correct");
        setTimeout(() => {
            mostrarMensaje(feedbackTexto, "incorrecto");
            if (vidas === 0) {
                mensajeBotonEl.textContent = "Ver Resultado";
                mensajeBotonEl.onclick = () => mostrarGameOver();
            } else {
                mensajeBotonEl.textContent = "Continuar";
                mensajeBotonEl.onclick = () => {
                    cerrarMensaje();
                    preguntaActual++;
                    mostrarPregunta();
                };
            }
        }, 1500);
    }
}

function actualizarVidas() {
    vidasEl.innerHTML = '<i class="fas fa-heart"></i>'.repeat(vidas) + '<i class="far fa-heart" style="opacity:0.5;"></i>'.repeat(5 - vidas);
}

function mostrarMensaje(texto, tipo = "incorrecto") {
    mensajeContenidoEl.classList.remove("correcto", "incorrecto");
    mensajeContenidoEl.classList.add(tipo);
    const btnMenuExistente = document.getElementById("btnMenuGameOver");
    if (btnMenuExistente) btnMenuExistente.remove();
    if (tipo === "correcto") {
        mensajeTextoEl.innerHTML = "Correcto. " + texto;
    } else {
        if (texto.startsWith("<h1")) {
            mensajeTextoEl.innerHTML = texto;
        } else {
            mensajeTextoEl.innerHTML = "No es correcto... " + texto;
        }
    }
    mensajeEl.classList.remove("oculto");
    mensajeBotonEl.onclick = cerrarMensaje;
}

window.cerrarMensaje = () => {
    mensajeEl.classList.add("oculto");
};

function mostrarGameOver() {
    cerrarMensaje();
    mostrarMensaje(
        `<h1 style="font-family: 'Fredoka One', cursive; color: var(--border-incorrect);">💀 Game Over 💀</h1>
        <p>¡¡Oh no, ${nombreJugador}! El Fisco te ha vencido esta vez. ¡Puedes intentarlo de nuevo!</p>`,
        "incorrecto"
    );
    mensajeBotonEl.textContent = "Reintentar Nivel";
    mensajeBotonEl.onclick = () => location.reload();
    const btnMenu = document.createElement("button");
    btnMenu.id = "btnMenuGameOver";
    btnMenu.textContent = "Volver al Menú";
    btnMenu.style.backgroundColor = "var(--secondary-color)";
    btnMenu.style.color = "var(--text-dark)";
    btnMenu.style.marginTop = "10px";
    btnMenu.onclick = () => window.location.href = '../introduccion.html';
    mensajeContenidoEl.appendChild(btnMenu);
}

async function mostrarVictoria() {
    juegoEl.classList.add("oculto");
    barraSuperiorEl.classList.add("oculto");
    const totalPreguntas = preguntas.length;
    const precisionNivel = ((puntajeNivel / totalPreguntas) * 100).toFixed(0);
    document.body.style.backgroundImage = `url('../assets/fondoVictoria.png')`;

    // Guardar progreso en API local
    try {
        const jugadorActual = await fetch(`${API_BASE}/get_jugador.php?id=${userId}`).then(r => r.json());
        const nivelGuardado = jugadorActual ? (jugadorActual.nivel || 0) : 0;
        const puntajeAnterior = jugadorActual ? (jugadorActual.puntaje || 0) : 0;
        const nuevoNivel = Math.max(nivelGuardado, NIVEL_ACTUAL);
        const puntajeAcumulativo = puntajeAnterior + puntajeNivel;

        await fetch(`${API_BASE}/guardar_jugador.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: userId,
                nombre: nombreJugador,
                nivel: nuevoNivel,
                puntaje: puntajeAcumulativo,
                precision: precisionNivel
            })
        });
    } catch (error) {
        console.error('Error al guardar progreso:', error);
        Swal.fire({ title: "¡Aviso!", text: "No se pudo guardar tu progreso.", icon: "warning" });
    }

    const contenedor = document.createElement("div");
    contenedor.className = "contenedor-victoria";
    contenedor.innerHTML = `
        <h1>¡Nivel ${NIVEL_ACTUAL} Superado! 🎉</h1>
        <p>¡Felicidades, ${nombreJugador}!</p>
        <p>Respuestas Correctas: <strong>${puntajeNivel} / ${totalPreguntas}</strong></p>
        <p>Precisión: <strong>${precisionNivel}%</strong></p>
        <p>Vidas Restantes: <strong style="font-size: 1.8rem;">${"🪙".repeat(vidas)}</strong></p>
        <button id="btnSiguiente">Volver al Menú</button>
    `;
    gameContainerEl.appendChild(contenedor);
    document.getElementById("btnSiguiente").onclick = () => {
        window.location.href = '../introduccion.html';
    };
}

// --- Iniciar ---
inicializarNivel();
