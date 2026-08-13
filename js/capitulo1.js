// ============================================================
// capitulo1.js — Sin Firebase, 100% local (XAMPP)
// ============================================================

const NIVEL_ACTUAL = 1;
const TITULO_NIVEL = "Nivel 1: La Amenaza del Fisco";
const API_BASE = '../api';

const personajes = {
    Narrador: { img: "../assets/personajes/Brenda.png", color: "#b8dcecff" },
    Brenda:   { img: "../assets/personajes/Brenda2.jpeg", color: "#ecd089ff" },
    Rogelio:  { img: "../assets/personajes/DonRogelio.jpeg", color: "#b8c2f3ff" },
    Carlos:   { img: "../assets/personajes/Carlos1.jpeg", color: "#f3b8c2ff" },
    Jose:     { img: "../assets/personajes/Jose2.jpeg", color: "#f3c2b8ff" }
};

const dialogos = [
    { personaje: "Narrador", texto: "¡¡Ay!, ¡Hola Godín. ¿Estás listo para enfrentar el Fisco?. Antes de empezar conoce al equipo de trabajo que te acompañará durante la aventura.", fondo: "../assets/oficina.png" },
    { personaje: "Rogelio",  texto: "Es el dueño de 'Seguros Patito, S.A. de C.V.'. Un hombre presumido y totalmente desconectado de la operación diaria de su empresa. Prefiere practicar su swing de golf en la oficina y mezclar sus gastos personales con los de la compañía. Para él, la 'sinergia' probablemente suena a un platillo exótico.", fondo: "../assets/oficina.png" },
    { personaje: "Carlos",   texto: "Es el héroe de esta historia. Un becario veinteañero lleno de optimismo y ganas de aprender. Aunque es ingenuo y tiene poca experiencia, su actitud positiva es su mejor herramienta para navegar el caótico mundo corporativo de 'Seguros Patito'. Es el godín promedio en su primer día, an sin ser aplastado por la rutina.", fondo: "../assets/oficina.png" },
    { personaje: "Brenda",   texto: "Es la gerente de la oficina y la jefa directa de Carlos. Vive en un estado de estrés perpetuo, ansiosa y totalmente dependiente del café para sobrevivir al día. Su escritorio, lleno de post-its y papeles, es un reflejo de su caos mental. Aunque regaña a Carlos, en el fondo intenta guiarlo.", fondo: "../assets/oficina.png" },
    { personaje: "Jose",     texto: "Es el contador veterano de la oficina. Conoce las leyes fiscales de memoria, pero nunca tiene tiempo para explicar nada porque siempre apaga incendios.", fondo: "../assets/oficina.png" },
    { personaje: "Narrador", texto: "¡¡Bienvenido al Nivel 1, Godín! Prepárate.", fondo: "../assets/oficina.png" },
    { personaje: "Brenda",   texto: "¡Oye! ¡Tenemos un problema! ¡El Fisco viene!", fondo: "../assets/gente.png" },
    { personaje: "Rogelio",  texto: "Responde bien a las preguntas para salvar a la oficina.", fondo: "../assets/oficina.png" }
];

// Preguntas locales (fallback si la API no responde)
const preguntasLocales = [
    {
        id: "pregunta_1", orden: 1, activa: true,
        pregunta: "1.- La empresa compra un flamenco rosa de plástico para decorar la oficina. ¿Cómo se registra contablemente?",
        opciones: ["Activo Fijo.", "Gasto de Decoración.", "Activo Biológico No Circulante.", "Tirar el recibo y hacerse guaje."],
        respuesta: 0,
        feedback: ["Correcto: El flamenco es un bien tangible con vida útil mayor a un año, se clasifica como Activo Fijo.", "Incorrecto: Un gasto de decoración aplica para artículos de consumo inmediato, no para bienes con vida útil prolongada.", "Incorrecto: Los activos biológicos son organismos vivos (ganado, plantas), no decoraciones de plástico.", "Incorrecto: Tirar el recibo genera problemas fiscales y contables."],
        fondo: "../assets/capitulo1/flamenco.jpg"
    },
    {
        id: "pregunta_2", orden: 2, activa: true,
        pregunta: "2.- El jefe paga una cena elegante, pero fue solo. ¿Cómo se registra?",
        opciones: ["Gasto de Venta (deducible)", "Llamar al restaurante", "Gasto No Deducible", "Tirar la factura y decir que se perdió"],
        respuesta: 2,
        feedback: ["Incorrecto: Para ser deducible, los gastos de representación deben tener sustancia de negocio.", "Incorrecto: Llamar al restaurante no resuelve el problema fiscal.", "Correcto: Una cena del jefe en solitario sin propósito de negocio comprobado es un Gasto No Deducible.", "Incorrecto: Tirar la factura no elimina la obligación fiscal."],
        fondo: "../assets/capitulo1/auto_jefe.jpg"
    },
    {
        id: "pregunta_3", orden: 3, activa: true,
        pregunta: "3.- Se contrata a un chamán para limpiar la energía negativa de la oficina. ¿Cómo se registra?",
        opciones: ["Servicios Profesionales", "Mantenimiento y Conservación", "Gasto No Deducible", "Cooperacha sin registrar"],
        respuesta: 2,
        feedback: ["Incorrecto: Los servicios profesionales deben ser estrictamente indispensables para la actividad económica.", "Incorrecto: Mantenimiento aplica a bienes tangibles, no a energías.", "Correcto: El SAT no reconoce los servicios de un chamán como gastos estrictamente indispensables; es un Gasto No Deducible.", "Incorrecto: No registrar gastos es una práctica irregular."],
        fondo: "../assets/capitulo1/chaman.jpg"
    },
    {
        id: "pregunta_4", orden: 4, activa: true,
        pregunta: "4.- El compadre te da una servilleta firmada por una deuda de $5,000. ¿Qué haces?",
        opciones: ["Dudores Diversos", "Llamar al compadre", "Enmarcarla como arte", "Ignorarla"],
        respuesta: 3,
        feedback: ["Incorrecto: Una servilleta no es un documento legal ni un CFDI; no puede registrarse como cuenta por cobrar válida.", "Incorrecto: Llamar al compadre es un paso personal, no una acción contable.", "Incorrecto: Enmarcarla puede ser creativo, pero no resuelve el problema contable.", "Correcto: Una servilleta no tiene validez jurídica ni fiscal en México; debe ignorarse contablemente y buscar un documento formal."],
        fondo: "../assets/capitulo1/servilleta.jpg"
    },
    {
        id: "pregunta_5", orden: 5, activa: true,
        pregunta: "5.- ¿Son válidos los post-it como comprobantes fiscales?",
        opciones: ["No, se necesita CFDI", "Sí, con firma de Brenda", "Sí, pero solo los amarillos", "Pasarlos a Excel bien bonito"],
        respuesta: 0,
        feedback: ["Correcto: En México, el único comprobante fiscal válido es el CFDI timbrado por el SAT. Los post-it no tienen ninguna validez fiscal.", "Incorrecto: Ninguna firma interna convierte un post-it en comprobante fiscal válido.", "Incorrecto: El color del post-it no tiene relevancia fiscal alguna.", "Incorrecto: Digitalizar información inválida no la convierte en válida."],
        fondo: "../assets/capitulo1/post-it.jpg"
    },
    {
        id: "pregunta_6", orden: 6, activa: true,
        pregunta: "6.- La empresa compra 100 kg de café gourmet para el personal. ¿Cómo se registra?",
        opciones: ["Gasto de oficina", "Inventario", "Preguntar al jefe", "Llevarte un kilo a casa"],
        respuesta: 0,
        feedback: ["Correcto: El café para consumo del personal es un gasto de oficina o consumo interno, no un bien destinado a la venta.", "Incorrecto: El inventario registra bienes destinados a la venta o producción, no al consumo interno.", "Incorrecto: La decisión contable no depende de la opinión del jefe sino de la naturaleza de la transacción.", "Incorrecto: Llevarte insumos de la empresa constituye un faltante de inventario."],
        fondo: "../assets/capitulo1/cafe.jpg"
    },
    {
        id: "pregunta_7", orden: 7, activa: true,
        pregunta: "7.- ¿La multa de la factura de la luz es deducible?",
        opciones: ["No deducible", "Sí, solo el consumo", "Pagar con la tanda", "Ocultar el recargo"],
        respuesta: 1,
        feedback: ["Incorrecto: El consumo de electricidad sí es deducible; solo la multa y recargos no lo son.", "Correcto: El consumo de electricidad es un gasto deducible; las multas y recargos por pago tardío son no deducibles según el SAT.", "Incorrecto: Pagar con la tanda no es una práctica contable reconocida.", "Incorrecto: Ocultar recargos es una práctica fraudulenta con consecuencias legales."],
        fondo: "../assets/capitulo1/factura_luz.jpg"
    },
    {
        id: "pregunta_8", orden: 8, activa: true,
        pregunta: "8.- La empresa compra una laptop nueva. ¿Cómo se clasifica?",
        opciones: ["Gasto personal del jefe", "Instalar software para justificar", "Pedirla al junior", "Equipo de Cómputo (Activo Fijo)"],
        respuesta: 3,
        feedback: ["Incorrecto: Los bienes de la empresa no son de uso personal de los directivos.", "Incorrecto: Instalar software no cambia la clasificación contable del hardware.", "Incorrecto: Asignarla al junior no determina su clasificación contable.", "Correcto: Una laptop es un bien tangible con vida útil mayor a un año, se clasifica como Equipo de Cómputo dentro del Activo Fijo."],
        fondo: "../assets/capitulo1/laptop.jpg"
    },
    {
        id: "pregunta_9", orden: 9, activa: true,
        pregunta: "9.- Se paga la reparación del auto del jefe. ¿Cómo se registra?",
        opciones: ["Preguntarle a Rogelio", "Registrar sin preguntar", "Verificar si es activo de la empresa", "Preguntar el chisme en recepción"],
        respuesta: 2,
        feedback: ["Incorrecto: La decisión contable no depende de la opinión del jefe.", "Incorrecto: Registrar sin verificar puede generar un gasto no deducible.", "Correcto: Primero hay que verificar si el auto está registrado como activo de la empresa; si no lo es, la reparación es un Gasto No Deducible.", "Incorrecto: El chisme en recepción no es una fuente de información contable válida."],
        fondo: "../assets/capitulo1/auto_jefe.jpg"
    },
    {
        id: "pregunta_10", orden: 10, activa: true,
        pregunta: "10.- Se contrata TV de paga para la oficina. ¿Se considera deducible?",
        opciones: ["Sí, para estar informados", "Es para la sala de juntas", "No es indispensable, no deducible", "Para ver el partido"],
        respuesta: 2,
        feedback: ["Incorrecto: El SAT exige que el gasto sea estrictamente indispensable para la actividad económica.", "Incorrecto: El uso en sala de juntas no garantiza que sea indispensable para el giro del negocio.", "Correcto: La TV de paga generalmente no es indispensable para la operación del negocio, por lo que es un Gasto No Deducible.", "Incorrecto: Ver el partido definitivamente no es un propósito de negocio."],
        fondo: "../assets/capitulo1/tv_paga.jpg"
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
const dialogoEl       = document.getElementById("dialogo");
const juegoEl         = document.getElementById("juego");
const barraSuperiorEl = document.getElementById("barraSuperior");
const vidasEl         = document.getElementById("vidas");
const avatarImgEl     = document.getElementById("avatarImg");
const nombrePersonajeEl = document.getElementById("nombrePersonaje");
const textoDialogoEl  = document.getElementById("textoDialogo");
const mensajeEl       = document.getElementById("mensaje");
const mensajeContenidoEl = document.getElementById("mensajeContenido");
const mensajeTextoEl  = document.getElementById("mensajeTexto");
const mensajeBotonEl  = document.getElementById("mensajeBotonPrincipal");
const gameContainerEl = document.querySelector(".game-container");

// --- Lógica de Música ---
const musicButtonEl      = document.getElementById("musicButton");
const backgroundMusicEl  = document.getElementById("backgroundMusic");
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
        Swal.fire({ title: "Error", text: "No hay preguntas disponibles.", icon: "error" })
            .then(() => { window.location.href = '../introduccion.html'; });
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
        if (i < texto.length) { textoDialogoEl.textContent += texto[i]; i++; }
        else { clearInterval(intervaloMaquíinaEscribir); }
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
    if (preguntaActual >= preguntas.length) { mostrarVictoria(); return; }
    const p = preguntas[preguntaActual];
    juegoEl.classList.add('fading-out');
    setTimeout(() => {
        document.getElementById("pregunta").textContent = p.pregunta;
        if (p.fondo) { document.body.style.backgroundImage = `url('${p.fondo}')`; }
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
    document.querySelectorAll(".opciones button").forEach(btn => { btn.disabled = true; });
    if (esCorrecta) {
        if(window.playCorrect) playCorrect();
        btnPresionado.classList.add("correct");
        puntajeNivel++;
        setTimeout(() => {
            mostrarMensaje(feedbackTexto, "correcto");
            mensajeBotonEl.textContent = "¡Siguiente!";
            mensajeBotonEl.onclick = () => { cerrarMensaje(); preguntaActual++; mostrarPregunta(); };
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
                mensajeBotonEl.onclick = () => { cerrarMensaje(); preguntaActual++; mostrarPregunta(); };
            }
        }, 2000);
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
        if (texto.startsWith("<h1")) { mensajeTextoEl.innerHTML = texto; }
        else { mensajeTextoEl.innerHTML = "Incorrecto. " + texto; }
    }
    mensajeEl.classList.remove("oculto");
    mensajeBotonEl.onclick = cerrarMensaje;
}

window.cerrarMensaje = () => { mensajeEl.classList.add("oculto"); };

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

    try {
        const jugadorActual = await fetch(`${API_BASE}/get_jugador.php?id=${userId}`).then(r => r.json());
        const nivelGuardado  = jugadorActual ? (jugadorActual.nivel   || 0) : 0;
        const puntajeAnterior = jugadorActual ? (jugadorActual.puntaje || 0) : 0;
        const nuevoNivel      = Math.max(nivelGuardado, NIVEL_ACTUAL);
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
        <h1>¡Nivel ${NIVEL_ACTUAL} Superado!</h1>
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
