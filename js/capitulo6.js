// ============================================================
// capitulo6.js — Sin Firebase, 100% local (XAMPP)
// ============================================================

const NIVEL_ACTUAL = 6;
const TITULO_NIVEL = "Nivel 6: NIIF / IFRS, Consolidación e instrumentos Financieros.";
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
        texto: "¡Bienvenido al mundo de las NIIF. Donde todo es internacional... y complicado.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Rogelio", 
        texto: "IFRS 15, IAS 36, IFRS 9... Cada norma es un universo, Godín.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Brenda", 
        texto: "¡Tenemos que consolidar filiales! ¡En diferentes monedas! ¡Y con derivados!",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Rogelio", 
        texto: "Las normas internacionales no perdonan. Cada error puede costar millones.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Narrador", 
        texto: "Es hora de pensar como contador global. ¿Estás listo para el desafío?",
        fondo: "../assets/oficina.png" 
    }
];

// Preguntas locales (fallback si falla la API)
const preguntasLocales = [
    {
        pregunta: "Tienes un contrato con 3 obligaciones: software, soporte anual y capacitación. ¿Cómo reconoces los ingresos según IFRS 15?",
        opciones: [
            "Reconocer todo al facturar",
            "Identificar obligaciones, asignar precio independiente y reconocer por tiempo/entrega",
            "Reconocer al cobrar",
            "Mezclar en un solo paquíete sin notas"
        ],
        respuesta: 1,
        feedback: [
            "Incorrecto. El hecho de facturar no determina el reconocimiento de ingresos.",
            "¡Correcto! IFRS 15 requiere identificar obligaciones separadas y reconocer cuando se cumplen.",
            "Incorrecto. El cobro no determina el momento del reconocimiento, solo el riesgo crediticio.",
            "Incorrecto. Oculta la naturaleza económica de las transacciones separadas."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Contrato de arrendamiento con opción de extensión que es razonablemente cierta de ejercerse. ¿Cómo lo contabilizas?",
        opciones: [
            "Ignorar extensión",
            "Llevar como gasto mensual",
            "Incluir extensión en plazo del ROU y medir pasivo con tasa incremental",
            "Capitalizar depósito como ingreso"
        ],
        respuesta: 2,
        feedback: [
            "Incorrecto. Subestima la obligación si es probable que se ejerza la extensión",
            "Incorrecto. IFRS 16 requiere reconocer activo y pasivo por arrendamientos",
            "¡Correcto! Se debe incluir el período de extensión cuando es razonablemente cierto.",
            "Incorrecto. Los depósitos en garantía no son ingresos, son pasivos contingentes"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Una unidad generadora de efectivo muestra indicios de deterioro. ¿Qué procede según IAS 36?",
        opciones: [
            "Rebajar vida útil 'para que cuadre'",
            "Test de impairment: valor en uso vs valor razonable; reconocer pérdida si procede",
            "Esperar al siguiente cierre",
            "Revaluar al alza sin base"
        ],
        respuesta: 1,
        feedback: [
            "Incorrecto. Manipular supuestos contables sin base técnica es incorrecto",
            "¡Exacto! IAS 36 requiere comparar valor recuperable con valor en libros",
            "Incorrecto. Los indicios de deterioro deben evaluarse inmediatamente",
            "Incorrecto. Contradice el principio de prudencia y las NIIF"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Una cuenta por cobrar muestra aumento significativo en riesgo crediticio. ¿Cómo procedes según IFRS 9?",
        opciones: [
            "Mantener Stage 1",
            "Castigar de inmediato sin análisis",
            "Vender la cartera a un tercero",
            "Pasar de Stage 1 a Stage 2; pérdida crediticia esperada a vida media"
        ],
        respuesta: 2,
        feedback: [
            "Incorrecto. Ignora el deterioro crediticio significativo detectado",
            "Incorrecto. No sigue la metodología de pérdidas crediticias esperadas",
            "Incorrecto. No resuelve el problema contable del reconocimiento del deterioro",
            "¡Correcto! IFRS 9 requiere reclasificar y medir pérdidas esperadas a vida del instrumento"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Filial funcional en USD, matriz en MXN. ¿Cómo conviertes los estados financieros según IAS 21?",
        opciones: [
            "Traducir a tipo cierre activos/pasivos; tipo promedio en resultados; OCI por diferencias",
            "Tipo spot para todo",
            "Promedio anual hasta para balance",
            "Re expresar a 'tipo bonito'"
        ],
        respuesta: 0,
        feedback: [
            "¡Muy bien! IAS 21 establece tratamiento diferenciado según partida.",
            "Incorrecto. No sigue el tratamiento diferenciado de IAS 21 para balance vs resultados.",
            "Incorrecto. El balance debe usar tipo de cambio de cierre, no promedio",
            "Incorrecto. Los tipos de cambio deben ser los reales de mercado."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Matriz posee 48% pero controla decisiones clave vía acuerdos. ¿Cómo se determina la consolidación?",
        opciones: [
            "Equity method por debajo de 50% siempre",
            "No reconocer porque 'no llega al 51%'",
            "Proforma secreta",
            "Consolidar por control, no solo por porcentaje"
        ],
        respuesta: 3,
        feedback: [
            "Incorrecto. Ignora el concepto de control que prima sobre el porcentaje accionario",
            "Incorrecto. El control puede existir con menos del 50% mediante acuerdos",
            "Incorrecto. Las operaciones deben contabilizarse transparentemente.",
            "¡Muy bien!  IFRS 10 se basa en control efectivo, no solo propiedad"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Existe una demanda legal probable y cuantificable. ¿Cuál es el tratamiento según IAS 37?",
        opciones: [
            "Reconocer provisión y revelar incertidumbre",
            "Revelar sin reconocer",
            "Nada",
            "Reconocer por el doble 'por si acaso'"
        ],
        respuesta: 0,
        feedback: [
            "Correcto. IAS 37 requiere reconocer cuando hay obligación presente probable y cuantificable",
            "Incorrecto. Si es probable y cuantificable, debe reconocerse como provisión",
            "Incorrecto. Omite una obligación legal existente",
            "Incorrecto. El doble 'por si acaso' no es necesario"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "Plan de beneficio definido pequeño, pero con obligación actuarial. ¿Cómo se contabiliza según IAS 19?",
        opciones: [
            "Tratar como contribución definida",
            "Medir obligación actuarial, tasa de descuento; OCI por re-mediciones",
            "Ignorar por 'tamaño'",
            "Registrar solo pagos"
        ],
        respuesta: 0,
        feedback: [
            "Incorrecto. Confunde la naturaleza de los planes de beneficio definido.",
            "Correcto.  IAS 19 requiere medición actuarial completa independientemente del tamaño.",
            "Incorrecto. El tamaño no exime del cumplimiento de las NIIF.",
            "Incorrecto. No reconoce la obligación actuarial acumulada."
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
