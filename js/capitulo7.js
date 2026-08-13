// ============================================================
// capitulo7.js — Sin Firebase, 100% local (XAMPP)
// ============================================================

const NIVEL_ACTUAL = 7;
const TITULO_NIVEL = "Nivel 7: Automatización, datos y cumplimiento digital";
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
        texto: "El futuro es ahora. Robots, datos, inteligencia artificial...",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Brenda", 
        texto: "¡Necesitamos automatizar TODO! ¡ETL, RPA, dashboards en tiempo real!",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Rogelio", 
        texto: "La tecnología es poderosa, pero sin control puede ser peligrosa.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Brenda", 
        texto: "¡Y hay que proteger datos personales! ¡Y hacer backups! ¡Y validar XML!",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Narrador", 
        texto: "¡Bienvenido a la era digital de las finanzas. Aquíí, el que no automatiza, pierde.",
        fondo: "../assets/oficina.png" 
    }
];

// Preguntas locales (fallback si falla la API)
const preguntasLocales = [
    {
        pregunta: "Necesitas implementar un pipeline ETL para procesar facturas electrónicas (CFDI) hacia un data warehouse. ¿Cuál es el enfoque correcto?",
        opciones: [
            "Pegar todo a una hoja gigante",
            "¿Quéitar validaciones para ir más rápido",
            "Validar timbre, UUID, método de pago y esquema, controlar duplicados y trazabilidad",
            "Cargar PDF porque 'se ve igualito'"
        ],
        respuesta: 2,
        feedback: [
            "Incorrecto. Las hojas de cálculo no escalan y pierden la relación entre datos",
            "Incorrecto. Sin validaciones pierdes integridad y puedes procesar documentos inválidos",
            "Correcto: El ETL debe validar estructura XML, integridad fiscal y prevenir duplicados",
            "Incorrecto. Los PDF no tienen datos estructurados para análisis automatizado"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Los campos clave tienen valores nulos y formatos inconsistentes. ¿Cómo aseguras la calidad de datos?",
        opciones: [
            "Reglas de calidad: tipos estrictos, catálogos, pruebas unitarias y alertas",
            "'Autocorrección' que inventa valores",
            "Deja nulos y rezar",
            "Arreglar a mano cada mes"
        ],
        respuesta: 0,
        feedback: [
            "Correcto. Asegura consistencia y validez en los datos para análisis y reportes",
            "Incorrecto. 'Autocorrección' puede introducir errores y inconsistencia",
            "Incorrecto. Dejar nulos puede dificultar la detección de problemas",
            "Incorrecto. Arreglar a mano cada mes es ineficiente y propenso a errores"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "La directiva solicita margen por cliente en tiempo real. ¿Cómo implementas el dashboard?",
        opciones: [
            "Un gráfico bonito sin filtros",
            "CSV pegado cada viernes",
            "Modelo semántico con hechos y dimensiones, KPIs versionados y seguridad por rol",
            "Publicar el dashboard con acceso público"
        ],
        respuesta: 2,
        feedback: [
            "Incorrecto: La visualización sin interactividad limita el análisis profundo",
            "Incorrecto: Los datos desactualizados no cumplen con 'tiempo real'",
            "Correcto: Arquitectura dimensional permite análisis multidimensional con seguridad",
            "Incorrecto: La información financiera sensible requiere controles de acceso"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "¿Cómo automatizas la conciliación bancaria entre el banco y el ERP?",
        opciones: [
            "Conciliar 'cuando cuadre solo'",
            "Conciliar a ojo",
            "Solo por monto exacto",
            "Algoritmos por monto, fecha, referencia y fuzzy matching con revisión humana"
        ],
        respuesta: 3,
        feedback: [
            "Incorrecto: Deja transacciones pendientes indefinidamente",
            "Incorrecto: Propenso a errores humanos y no es escalable",
            "Incorrecto: Ignora transacciones con diferencias menores o partidas múltiples",
            "Correcto: Combinación de matching exacto y aproximado con supervisión"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Reportes acceden a datos personales sin anonimizar. ¿Cómo manejas la protección?",
        opciones: [
            "Copiar base completa al escritorio",
            "Compartir por correo 'urgente'",
            "Enmascaramiento, minimización, logs, principio de menor privilegio",
            "Subir a nube pública sin restricciones"
        ],
        respuesta: 2,
        feedback: [
            "Incorrecto: Crea múltiples copias no seguras de datos sensibles",
            "Incorrecto: El correo no es seguro para datos personales",
            "Correcto: Estrategia completa de protección de datos según mejores prácticas",
            "Incorrecto: Expone datos a riesgos de seguridad y incumplimiento legal"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Alto volumen de pólizas de nómina estándar. ¿Cómo automatizas el proceso?",
        opciones: [
            "RPA con validaciones contables y bitácora de excepción",
            "Contratar 5 capturistas nocturnos",
            "Macros sin control",
            "Incumple requisitos legales de contabilidad"
        ],
        respuesta: 0,
        feedback: [
            "Correcto: RPA automatiza con controles y registro de excepciones",
            "Incorrecto: Solución costosa y propensa a errores humanos",
            "Incorrecto: Las macros no tienen trazabilidad ni manejo robusto de errores",
            "Incorrecto: Incumple requisitos legales de contabilidad"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "¿Cómo implementas detección de facturas con RFC en lista negra?",
        opciones: [
            "Revisar manual cada trimestre",
            "Investigar lista 69-B, bloquear acreditamiento y disparar alerta",
            "Ignorar hasta auditoría",
            "'Whitelist' para amigos"
        ],
        respuesta: 1,
        feedback: [
            "Incorrecto: Permite transacciones riesgosas por meses antes de detectarlas",
            "Correcto: Investiga y bloquea acreditamientos, dispara alertas y registra excepciones",
            "Incorrecto: Ignora hasta auditoría, posible pérdida de control",
            "Incorrecto: 'Whitelist' no protege contra facturas fraudulentas"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "¿Cómo garantizas la trazabilidad de cambios en sistemas financieros?",
        opciones: [
            "Auditoría de campo: quién, cuándo, antes/después; approvals",
            "Registro libre con confianza",
            "Cambios directos en BD en producción",
            "Bitácora en post-it"
        ],
        respuesta: 0,
        feedback: [
            "Correcto: Registra cambios detallados con quién, cuándo y cómo",
            "Incorrecto: No garantiza confianza en los cambios",
            "Incorrecto: Puede ser manipulado por usuarios con privilegios",
            "Incorrecto: No es una solución de trazabilidad"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "¿Quéieren predecir morosidad a 60 días. ¿Qué enfoque usas?",
        opciones: [
            "Regresión con 2 datos",
            "Intuición del vendedor estrella",
            "Modelo supervisado con variables históricas y validación",
            "Tirar una moneda"
        ],
        respuesta: 2,
        feedback: [
            "Incorrecto: Muestra insuficiente para modelo predictivo confiable",
            "Incorrecto: Subjetivo y no escalable a toda la cartera",
            "Correcto: Enfoque estadístico robusto con datos históricos y validación",
            "Incorrecto: Completamente aleatorio y sin base analítica"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Falla del servidor del ERP el último día del mes. ¿Cómo respondes?",
        opciones: [
            "Backup único en el mismo servidor",
            "DRP probado, backups 3-2-1, RTO/RPO definidos y failover",
            "Llamar al técnico a 'soplarle'",
            "Rezar al santo de la nube."
        ],
        respuesta: 1,
        feedback: [
            "Incorrecto: Si falla el servidor, también falla el backup",
            "Correcto: Estrategia completa de recuperación con métricas definidas",
            "Incorrecto: No es una solución técnica confiable",
            "Incorrecto: No sustituye un plan técnico de continuidad"
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
