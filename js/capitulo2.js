// ============================================================
// capitulo2.js — Sin Firebase, 100% local (XAMPP)
// ============================================================

const NIVEL_ACTUAL = 2;
const TITULO_NIVEL = "Nivel 2: La travesía del IVA perdido";
const API_BASE = '../api';

const personajes = {
    Narrador: { img: "../assets/personajes/Brenda.png", color: "#b8dcecff" },
    Brenda:   { img: "../assets/personajes/Brenda2.jpeg", color: "#ecd089ff" },
    Rogelio:  { img: "../assets/personajes/DonRogelio.jpeg", color: "#b8c2f3ff" },
    Carlos:   { img: "../assets/personajes/Carlos1.jpeg", color: "#f3b8c2ff" },
    Jose:     { img: "../assets/personajes/Jose2.jpeg", color: "#f3c2b8ff" }
};

const dialogos = [
    { personaje: "Narrador", texto: "¡Felicidades por sobrevivir al Nivel 1! Pero ahora viene algo peor...", fondo: "../assets/oficina.png" },
    { personaje: "Carlos",   texto: "El IVA es como un laberinto, Godín. Un paso en falso y... ¡zas! Multa del SAT.", fondo: "../assets/oficina.png" },
    { personaje: "Brenda",   texto: "¡Hay facturas PPD sin complemento! ¡Notas de crédito sin emitir! ¡ESTO ES EL CAOS!", fondo: "../assets/oficina.png" },
    { personaje: "Carlos",   texto: "Tranquila, Brenda. Godín sabe lo que hace... ¿verdad, Godín?", fondo: "../assets/oficina.png" }
];

const preguntasLocales = [
    {
        id: "pregunta_1", orden: 1, activa: true,
        pregunta: "1.- Una factura de $120,000 + IVA se emitió como PPD (Pago en Parcialidades o Diferido), pero el cliente pagó el total el mismo día. ¿Qué se hace?",
        opciones: ["Dejar como PPD y emitir complemento de pago inmediato.", "Emitir nota de crédito por el IVA y rezar.", "Cancelar y reemitir como PUE con la fecha correcta.", "Hacer nada, total es el mismo dinero."],
        respuesta: 2,
        feedback: ["Incorrecto: El complemento de pago aplica solo cuando realmente se paga después.", "Incorrecto: No procede emitir nota de crédito; eso no corrige el tipo de CFDI.", "Correcto: Si el pago se realiza el mismo día, debe ser PUE (Pago en una sola exhibición).", "Incorrecto: No hacer nada puede causar inconsistencias fiscales y rechazo del comprobante."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_2", orden: 2, activa: true,
        pregunta: "2.- Factura PPD de enero cobrada en febrero, pero no se emitió complemento de pago. ¿Qué se hace?",
        opciones: ["Emitir complemento de pago con fecha de febrero y registrar IVA causado en febrero.", "Registrar el IVA en enero 'por intuición'.", "Emitir nueva factura PUE en febrero y duplicar ingreso.", "Cancelar todo y empezar la vida con otro RFC."],
        respuesta: 0,
        feedback: ["Correcto: El IVA se causa hasta que se cobra, y el complemento de pago lo acredita.", "Incorrecto: El IVA no puede registrarse por 'intuición', debe basarse en el cobro real.", "Incorrecto: Duplicar el ingreso sería un error contable grave.", "Incorrecto: Aunque tentador, no es una opción fiscalmente viable."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_3", orden: 3, activa: true,
        pregunta: "3.- El cliente devuelve 3 de 10 piezas facturadas.",
        opciones: ["Cancelar la factura completa y reemitir por 7 piezas", "Registrar como descuento comercial sin CFDI.", "Guardar la devolución en la 'caja de los misterios'.", "Emitir nota de crédito parcial por el valor y el IVA correspondiente."],
        respuesta: 3,
        feedback: ["Incorrecto: Cancelar toda la factura es innecesario y genera confusión.", "Incorrecto: Los descuentos deben reflejarse con CFDI, no solo en registros internos.", "Incorrecto: 'Caja de los misterios' no es una cuenta contable reconocida por el SAT.", "Correcto: La nota de crédito ajusta legalmente el valor e IVA del CFDI original."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_4", orden: 4, activa: true,
        pregunta: "4.- Los proveedores solo enviaron PDF sin XML timbrado.",
        opciones: ["Acreditar con el PDF.", "Solicitar el XML y validar timbrado antes de acreditar.", "Capturar manualmente en Excel 'para salir del paso'.", "Postergar el registro hasta cierre anual."],
        respuesta: 1,
        feedback: ["Incorrecto: El PDF sin XML no tiene validez fiscal para acreditar IVA.", "Correcto: Solo el CFDI (XML) da derecho al IVA acreditable.", "Incorrecto: Excel no sustituye al comprobante fiscal digital.", "Incorrecto: Posponerlo no corrige el incumplimiento."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_5", orden: 5, activa: true,
        pregunta: "5.- Se reciben $50,000 de anticipo sin CFDI correspondiente.",
        opciones: ["Emitir CFDI de anticipo con IVA y posteriormente de ingresos por el resto.", "Esperar a la factura final.", "Emitir recibo simple 'anticipo moral'.", "Registrar como ingreso diferido sin impuestos."],
        respuesta: 0,
        feedback: ["Correcto: Los anticipos generan IVA al cobrarse, deben tener CFDI propio.", "Incorrecto: Esperar a la factura final es omitir el IVA causado en el momento del cobro.", "Incorrecto: 'Recibo moral' no tiene validez fiscal.", "Incorrecto: No registrar el IVA es incumplimiento fiscal."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_6", orden: 6, activa: true,
        pregunta: "6.- Factura de internet de oficina también usada para Netflix del patrón.",
        opciones: ["Pasar todo a 'gasto secreto'.", "Acreditar 100% porque 'se trabaja mucho'.", "No acreditar nada por medio.", "Acreditar proporcionalmente el IVA solo por la parte de negocio."],
        respuesta: 3,
        feedback: ["Incorrecto: No existe la cuenta 'gasto secreto' (al menos no para el SAT).", "Incorrecto: 'Se trabaja mucho' no es un criterio fiscal.", "Incorrecto: Puedes acreditar la parte empresarial sin riesgo.", "Correcto: Solo es acreditable el IVA de gastos estrictamente indispensables."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_7", orden: 7, activa: true,
        pregunta: "7.- Se vende un servicio a cliente extranjero sin prueba de exportación.",
        opciones: ["Aplicar 0% 'porque suena internacional'.", "Gravar al 16% y ya.", "Reunir pruebas de materialidad y residencia fiscal del cliente; aplicar 0% con soporte.", "Facturar sin impuesto y sin RFC extranjero."],
        respuesta: 2,
        feedback: ["Incorrecto: No basta con que el cliente esté 'fuera del país'.", "Incorrecto: Cobrar 16% genera retención innecesaria.", "Correcto: La tasa 0% requiere evidencia del servicio exportado y residencia del cliente.", "Incorrecto: Sin RFC o prueba, la factura es inválida para efectos fiscales."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_8", orden: 8, activa: true,
        pregunta: "8.- IVA trasladado $80,000; acreditable $65,000; pagos provisionales no aplicados.",
        opciones: ["Determinar saldo a cargo $15,000, verificar pagos y presentar DIOT.", "Compensar con 'saldo emocional a favor'.", "Declarar en ceros 'por si acaso'.", "Patear al siguiente mes."],
        respuesta: 0,
        feedback: ["Correcto: Es la conciliación formal y el procedimiento fiscal correcto.", "Incorrecto: Compensar con 'saldo emocional a favor' no es una opción fiscalmente viable.", "Incorrecto: Declarar en ceros 'por si acaso' no es una opción fiscalmente viable.", "Incorrecto: Patear al siguiente mes no es una opción fiscalmente viable."],
        fondo: "../assets/oficina.png"
    }
];

let preguntas = [];
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

async function cargarPreguntas() {
    try {
        const res = await fetch(`${API_BASE}/get_preguntas.php?nivel=${NIVEL_ACTUAL}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) { preguntas = data; return true; }
        throw new Error('Array vacío');
    } catch (error) {
        console.warn('⚠️ Usando preguntas locales:', error.message);
        preguntas = [...preguntasLocales];
        return true;
    }
}

async function inicializarNivel() {
    document.title = TITULO_NIVEL;
    document.getElementById("nivelInfo").textContent = TITULO_NIVEL;
    if (!await cargarSesion()) return;
    await cargarPreguntas();
    actualizarVidas();
    playMusic();
    mostrarDialogo(dialogos[indexDialogo]);
}

function mostrarDialogo(dialogo) {
    if (!dialogo) return;
    if (dialogo.fondo) document.body.style.backgroundImage = `url('${dialogo.fondo}')`;
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
    const texto = dialogo.texto.normalize("NFC");
    if (intervaloMaquíinaEscribir) clearInterval(intervaloMaquíinaEscribir);
    intervaloMaquíinaEscribir = setInterval(() => {
        if (i < texto.length) { textoDialogoEl.textContent += texto[i]; i++; }
        else clearInterval(intervaloMaquíinaEscribir);
    }, 30);
}

window.siguienteDialogo = () => {
    if (respondiendo) return;
    if (intervaloMaquíinaEscribir && textoDialogoEl.textContent.length < dialogos[indexDialogo].texto.length) {
        clearInterval(intervaloMaquíinaEscribir);
        textoDialogoEl.textContent = dialogos[indexDialogo].texto;
        return;
    }
    indexDialogo++;
    if (indexDialogo < dialogos.length) mostrarDialogo(dialogos[indexDialogo]);
    else iniciarJuego();
};

function iniciarJuego() {
    respondiendo = true;
    dialogoEl.style.animation = "fadeOut 0.5s ease-out forwards";
    setTimeout(() => {
        dialogoEl.classList.add("oculto");
        barraSuperiorEl.classList.remove("oculto");
        juegoEl.classList.remove("oculto");
        juegoEl.style.zIndex = 5;
        if (preguntas.length > 0 && preguntas[0].fondo) document.body.style.backgroundImage = `url('${preguntas[0].fondo}')`;
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
        if (p.fondo) document.body.style.backgroundImage = `url('${p.fondo}')`;
        const opcionesDiv = document.querySelector(".opciones");
        opcionesDiv.innerHTML = "";
        p.opciones.forEach((opcion, i) => {
            const btn = document.createElement("button");
            btn.textContent = opcion; btn.dataset.index = i;
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
    document.querySelectorAll(".opciones button").forEach(btn => { btn.disabled = true; });
    if (esCorrecta) {
        if(window.playCorrect) playCorrect();
        btnPresionado.classList.add("correct");
        puntajeNivel++;
        setTimeout(() => {
            mostrarMensaje(p.feedback[indice], "correcto");
            mensajeBotonEl.textContent = "¡Siguiente!";
            mensajeBotonEl.onclick = () => { cerrarMensaje(); preguntaActual++; mostrarPregunta(); };
        }, 1000);
    } else {
        if(window.playWrong) playWrong();
        document.body.classList.add('shake-effect');
        setTimeout(() => document.body.classList.remove('shake-effect'), 500);
        btnPresionado.classList.add("incorrect");
        vidas--; actualizarVidas();
        const btnCorrecto = document.querySelector(`.opciones button[data-index="${p.respuesta}"]`);
        if (btnCorrecto) btnCorrecto.classList.add("reveal-correct");
        setTimeout(() => {
            mostrarMensaje(p.feedback[indice], "incorrecto");
            if (vidas === 0) { mensajeBotonEl.textContent = "Ver Resultado"; mensajeBotonEl.onclick = () => mostrarGameOver(); }
            else { mensajeBotonEl.textContent = "Continuar"; mensajeBotonEl.onclick = () => { cerrarMensaje(); preguntaActual++; mostrarPregunta(); }; }
        }, 2000);
    }
}

function actualizarVidas() { vidasEl.innerHTML = '<i class="fas fa-heart"></i>'.repeat(vidas) + '<i class="far fa-heart" style="opacity:0.5;"></i>'.repeat(5 - vidas); }

function mostrarMensaje(texto, tipo = "incorrecto") {
    mensajeContenidoEl.classList.remove("correcto", "incorrecto");
    mensajeContenidoEl.classList.add(tipo);
    const e = document.getElementById("btnMenuGameOver"); if (e) e.remove();
    if (tipo === "correcto") mensajeTextoEl.innerHTML = "Correcto. " + texto;
    else mensajeTextoEl.innerHTML = texto.startsWith("<h1") ? texto : "Incorrecto. " + texto;
    mensajeEl.classList.remove("oculto");
    mensajeBotonEl.onclick = cerrarMensaje;
}

window.cerrarMensaje = () => { mensajeEl.classList.add("oculto"); };

function mostrarGameOver() {
    cerrarMensaje();
    mostrarMensaje(`<h1 style="font-family: 'Fredoka One', cursive; color: var(--border-incorrect);">💀 Game Over 💀</h1><p>¡¡Oh no, ${nombreJugador}! ¡Puedes intentarlo de nuevo!</p>`, "incorrecto");
    mensajeBotonEl.textContent = "Reintentar Nivel";
    mensajeBotonEl.onclick = () => location.reload();
    const btnMenu = document.createElement("button");
    btnMenu.id = "btnMenuGameOver"; btnMenu.textContent = "Volver al Menú";
    btnMenu.style.cssText = "background-color:var(--secondary-color);color:var(--text-dark);margin-top:10px;";
    btnMenu.onclick = () => window.location.href = '../introduccion.html';
    mensajeContenidoEl.appendChild(btnMenu);
}

async function mostrarVictoria() {
    juegoEl.classList.add("oculto"); barraSuperiorEl.classList.add("oculto");
    const totalPreguntas = preguntas.length;
    const precisionNivel = ((puntajeNivel / totalPreguntas) * 100).toFixed(0);
    document.body.style.backgroundImage = `url('../assets/fondoVictoria.png')`;
    try {
        const jugadorActual = await fetch(`${API_BASE}/get_jugador.php?id=${userId}`).then(r => r.json());
        const nivelGuardado   = jugadorActual ? (jugadorActual.nivel   || 0) : 0;
        const puntajeAnterior = jugadorActual ? (jugadorActual.puntaje || 0) : 0;
        await fetch(`${API_BASE}/guardar_jugador.php`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, nombre: nombreJugador, nivel: Math.max(nivelGuardado, NIVEL_ACTUAL), puntaje: puntajeAnterior + puntajeNivel, precision: precisionNivel })
        });
    } catch (error) { console.error('Error al guardar:', error); }
    const contenedor = document.createElement("div");
    contenedor.className = "contenedor-victoria";
    contenedor.innerHTML = `<h1>¡Nivel ${NIVEL_ACTUAL} Superado!</h1><p>¡Felicidades, ${nombreJugador}!</p><p>Respuestas Correctas: <strong>${puntajeNivel} / ${totalPreguntas}</strong></p><p>Precisión: <strong>${precisionNivel}%</strong></p><p>Vidas Restantes: <strong style="font-size:1.8rem;">${"🪙".repeat(vidas)}</strong></p><button id="btnSiguiente">Volver al Menú</button>`;
    gameContainerEl.appendChild(contenedor);
    document.getElementById("btnSiguiente").onclick = () => { window.location.href = '../introduccion.html'; };
}

inicializarNivel();
