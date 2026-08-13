// ============================================================
// capitulo9.js — Sin Firebase, 100% local (XAMPP)
// ============================================================

const NIVEL_ACTUAL = 9;
const TITULO_NIVEL = "Nivel 9: El Godín Legendario";
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
        texto: "Has llegado lejos, Godín. Pero ahora... las matemáticas se ponen serias.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Rogelio", 
        texto: "Black-Scholes, Value at Risk, CAPM... ¡Bienvenido al mundo cuantitativo.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Brenda", 
        texto: "¿Opciones? ¿Derivados? ¿Simulaciones Montecarlo? ¡Esto es de otro nivel!",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Rogelio", 
        texto: "Aquíí no hay espacio para intuiciones. Solo fórmulas, probabilidades y gestión de riesgos.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Narrador", 
        texto: "Las finanzas cuantitativas son el arma definitiva. ¿Puedes dominarlas, Godín?",
        fondo: "../assets/oficina.png" 
    }
];

// Preguntas locales (fallback si falla la API)
const preguntasLocales = [
    {
        pregunta: "Es el momento del cierre final. ¿Qué entregas para demostrar el control total de las finanzas?",
        opciones: [
            "Exportar Excel y mandarlo",
            "Archivo vacío que diga 'confía'",
            "Conciliación fiscal, contable y financiera con anexos",
            "PDF de 1000 páginas"
        ],
        respuesta: 1,
        feedback: [
            "Incorrecto. Falta documentación de soporte y procedimientos.",
            "Incorrecto. La transparencia y evidencia son esenciales en finanzas.",
            "¡Correcto! Integración completa que demuestra consistencia en todos los frentes.",
            "Incorrecto. Volumen sin estructura no facilita la revisión ni auditoría."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "¿Cómo pruebas la resiliencia del sistema financiero ante escenarios adversos?",
        opciones: [
            "Simulaciones extremas de tasas, PIB y defaults.",
            "Solo escenario base",
            "Optimista infinito",
            "Números bonitos improvisados"
        ],
        respuesta: 0,
        feedback: [
            "¡Correcto! Análisis comprehensivo de múltiples factores de riesgo simultáneos",
            "Incorrecto. No prepara para crisis ni eventos inesperados.",
            "Incorrecto. Ignora riesgos potenciales y vulnerabilidades.",
            "Incorrecto. Sin metodología ni base estadística sólida."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "¿Cuál es el método más robusto para valorar una empresa?",
        opciones: [
            "1 peso 'para no pagar impuestos'",
            "Valor que sueña el jefe",
            "Multiplicador al azar",
            "DCF con WACC y sensibilidad"
        ],
        respuesta: 3,
        feedback: [
            "Incorrecto. Práctica fraudulenta con consecuencias legales graves.",
            "Incorrecto. Las valoraciones deben basarse en análisis, no deseos.",
            "Incorrecto. Arbitrario y sin fundamento en la realidad económica.",
            "¡Correcto! Método estándar que considera flujos futeros y costo de capital."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Es la batalla final contra el dragón financiero. ¿Qué presentas como tu defensa definitiva?",
        opciones: [
            "Rendirse",
            "Tirar la laptop por la ventana",
            "Llamar a RH",
            "Entregar todo: cierre, auditoría, NIIF, riesgos, bots RPA"
        ],
        respuesta: 3,
        feedback: [
            "Incorrecto. La perseverancia es clave en la gestión financiera.",
            "Incorrecto. Destruir herramientas no resuelve problemas financieros.",
            "Incorrecto. Recursos Humanos no maneja crisis financieras técnicas.",
            "¡Correcto! Demostración completa de dominio en todas las áreas financieras."
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
    // Nivel 9 es el último — redirige a pantalla final
    document.getElementById("btnSiguiente").onclick = () => {
        window.location.href = '../final.html';
    };
}

// --- Iniciar ---
inicializarNivel();
