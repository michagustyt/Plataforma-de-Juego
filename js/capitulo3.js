// ============================================================
// capitulo3.js — Sin Firebase, 100% local (XAMPP)
// ============================================================

const NIVEL_ACTUAL = 3;
const TITULO_NIVEL = "Nivel 3: El cierre que hace llorar";
const API_BASE = '../api';

const personajes = {
    Narrador: { img: "../assets/personajes/Brenda.png", color: "#b8dcecff" },
    Brenda:   { img: "../assets/personajes/Brenda2.jpeg", color: "#ecd089ff" },
    Rogelio:  { img: "../assets/personajes/DonRogelio.jpeg", color: "#b8c2f3ff" },
    Carlos:   { img: "../assets/personajes/Carlos1.jpeg", color: "#f3b8c2ff" },
    Jose:     { img: "../assets/personajes/Jose2.jpeg", color: "#f3c2b8ff" }
};

const dialogos = [
    { personaje: "Narrador", texto: "Es fin de mes. El momento más temido en toda oficina...", fondo: "../assets/oficina.png" },
    { personaje: "Rogelio",  texto: "El cierre contable es como un examen final. Todo debe cuadrar. Todo.", fondo: "../assets/oficina.png" },
    { personaje: "Brenda",   texto: "¡Hay diferencias en bancos! ¡Inventario obsoleto! ¡Y no encuentro las conciliaciones!", fondo: "../assets/oficina.png" },
    { personaje: "Carlos",   texto: "Por eso estás aquíí, Godín. Para que esto no sea un desastre total. Sin presión, ¿eh?", fondo: "../assets/oficina.png" }
];

const preguntasLocales = [
    {
        id: "pregunta_1", orden: 1, activa: true,
        pregunta: "1.- La empresa compró una laptop por $30,000, con vida útil de 3 años, sin valor residual.",
        opciones: ["Depreciar solo si la usa el hijo del patrón.", "No depreciar.", "Registrar depreciación mensual: 30,000 / 36.", "Depreciar todo al momento de compra."],
        respuesta: 2,
        feedback: ["No depende de quién la use, sino de su función en la empresa.", "No depreciar impide reflejar el desgaste del equipo y afecta los estados financieros.", "Correcto: La depreciación se reconoce mes a mes según la vida útil del activo.", "Depreciar todo de golpe distorsiona los resultados."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_2", orden: 2, activa: true,
        pregunta: "2.- La empresa no ha provisionado las vacaciones devengadas de sus empleados.",
        opciones: ["Reconocer provisión por el pasivo laboral según días devengados.", "Registrar solo cuando el empleado salga.", "Pagar con vales de despensa 'morales'.", "Hacer encuesta para ver quién piensa irse."],
        respuesta: 0,
        feedback: ["Correcto: Las vacaciones deben reconocerse conforme se generan, aunque no se tomen an.", "Esperar hasta que salgan genera distorsión en la nómina del siguiente período.", "Los vales no sustituyen la obligación contable.", "No se provisiona por 'intención', sino por derechos laborales devengados."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_3", orden: 3, activa: true,
        pregunta: "3.- Hay 10 impresoras obsoletas registradas a su costo original.",
        opciones: ["Reetiquetar como 'impresoras vintage premium'.", "Reconocer pérdida por deterioro al valor neto de realización.", "Mantener costo 'para que no se vea feo'.", "Regalarlas y deducir como donativo sin requisitos."],
        respuesta: 1,
        feedback: ["Llamarlas 'vintage' no cambia su valor contable.", "Correcto: El inventario debe reflejar su valor real; si ya no se puede vender al mismo precio, se ajusta.", "Ocultar pérdidas solo retrasa el problema.", "Los donativos requieren cumplir reglas fiscales."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_4", orden: 4, activa: true,
        pregunta: "4.- Contrato de oficina a 36 meses, con renta fija y depósito.",
        opciones: ["Llamar al casero para pedir factura sin IVA.", "Llevarlo 'fuera de balance'.", "Registrar todo como gasto de renta mensual.", "Reconocer pasivo por arrendamiento y derecho de uso; depreciar y devengar intereses."],
        respuesta: 3,
        feedback: ["El IVA debe incluirse en la factura, no se puede omitir.", "'Fuera de balance' es una práctica obsoleta.", "Solo aplica a rentas cortas o de bajo valor.", "Correcto: Las normas (NIIF 16 / NIF D-5) exigen registrar el arrendamiento como activo y pasivo."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_5", orden: 5, activa: true,
        pregunta: "5.- El banco muestra 3 depósitos no identificados y 2 cheques en tránsito.",
        opciones: ["Reconocer todo como ingreso extra.", "Mover diferencias a 'Otros'.", "Identificar depósitos con CFDI y registrar cheques en tránsito; ajustar conciliación.", "Reconciliar 'a ojo de buen cubero'."],
        respuesta: 2,
        feedback: ["No todo depósito es ingreso. Puede ser préstamo o transferencia interna.", "'Otros' no debe usarse para ocultar diferencias.", "Correcto: Cada diferencia debe analizarse y documentarse.", "'A ojo' no es un método contable aceptado."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_6", orden: 6, activa: true,
        pregunta: "6.- Proyecto de software de 6 meses, 60% de avance, cobro al final.",
        opciones: ["Reconocer ingreso por porcentaje de avance con evidencia.", "Hasta el cobro.", "Reconocer 100% de avance.", "Ponerlo como anticipo de clientes."],
        respuesta: 0,
        feedback: ["Correcto: Los ingresos se reconocen conforme se avanza el proyecto, no hasta el pago.", "Eso sería base de efectivo, no contable.", "Reconocer todo sin terminar el trabajo es incorrecto.", "No es anticipo si ya se ha prestado parte del servicio."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_7", orden: 7, activa: true,
        pregunta: "7.- Hay diferencias temporales por depreciación fiscal acelerada.",
        opciones: ["Llevarlo a una hoja aparte.", "Compensarlo contra IVA.", "Ignorarlo.", "Reconocer ISR diferido por la diferencia entre base contable y fiscal."],
        respuesta: 3,
        feedback: ["No sirve tenerlo 'aparte'; debe presentarse en los estados financieros.", "No se puede mezclar ISR con IVA.", "Ignorarlo distorsiona los resultados del período.", "Correcto: El ISR diferido refleja los impuestos que se pagarán o recuperarán en el futuro."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_8", orden: 8, activa: true,
        pregunta: "8.- La empresa tiene utilidad positiva, pero caja negativa.",
        opciones: ["Copiar el estado de resultados y llamarlo 'flujo'.", "Armar flujo indirecto: utilidad + ajustes no monetarios +- cambios en capital de trabajo.", "Poner 'se usó en operaciones' y salir corriendo.", "¿Quéitar el rubro de 'clientes' para que cuadre."],
        respuesta: 1,
        feedback: ["El flujo no es copia del estado de resultados.", "Correcto: El flujo de efectivo explica cómo la utilidad no siempre significa efectivo.", "Poner frases vagas no soluciona el análisis financiero.", "No se debe eliminar rubros para 'hacerlo cuadrar'."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_9", orden: 9, activa: true,
        pregunta: "9.- Una sola persona compra, recibe, registra y paga.",
        opciones: ["Hacer juramento de honestidad anual.", "Poner una cámara y ya.", "Dejarlo así 'porque confío'.", "Segregar funciones: compras, recepción, contabilidad y tesorería."],
        respuesta: 3,
        feedback: ["Los juramentos son simbólicos, no preventivos.", "Una cámara no sustituye una revisión contable.", "La confianza no reemplaza el control interno.", "Correcto: Separar funciones evita fraudes y errores."],
        fondo: "../assets/oficina.png"
    },
    {
        id: "pregunta_10", orden: 10, activa: true,
        pregunta: "10.- Todo está listo, pero no hay índice, referencias cruzadas ni soporte de ajustes.",
        opciones: ["Armar índice, numerar cédulas, vincular pólizas y XML, checklist de cierre.", "Subir todo a carpeta 'FINAL_V3_DEFINIDO_ahora_sí'.", "Mandar correo que diga 'Todo listo, por favor revisar'.", "Imprimir todo y meterlo en una caja de zapatos."],
        respuesta: 0,
        feedback: ["Correcto: Un cierre ordenado garantiza trazabilidad y auditoría eficiente.", "Nombres de carpetas graciosos no sustituyen el orden contable.", "Un correo no deja evidencia formal.", "Guardar papeles sin control dificulta futuras revisiones."],
        fondo: "../assets/oficina.png"
    }
];

let preguntas = [];
let puntajeNivel = 0, preguntaActual = 0, indexDialogo = 0, vidas = 5;
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
let intervaloMaquíinaEscribir, respondiendo = false;

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

async function cargarPreguntas() {
    try {
        const res = await fetch(`${API_BASE}/get_preguntas.php?nivel=${NIVEL_ACTUAL}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) { preguntas = data; return true; }
        throw new Error('vacío');
    } catch (e) { preguntas = [...preguntasLocales]; return true; }
}

async function inicializarNivel() {
    document.title = TITULO_NIVEL;
    document.getElementById("nivelInfo").textContent = TITULO_NIVEL;
    if (!await cargarSesion()) return;
    await cargarPreguntas();
    actualizarVidas(); playMusic(); mostrarDialogo(dialogos[indexDialogo]);
}

function mostrarDialogo(dialogo) {
    if (!dialogo) return;
    if (dialogo.fondo) document.body.style.backgroundImage = `url('${dialogo.fondo}')`;
    const p = personajes[dialogo.personaje];
    avatarImgEl.src = p.img; nombrePersonajeEl.textContent = dialogo.personaje;
    const burbuja = document.querySelector(".burbuja");
    burbuja.style.borderColor = p.color;
    burbuja.style.borderWidth = '4px';
    burbuja.style.backgroundColor = ''; avatarImgEl.style.borderColor = p.color;
    textoDialogoEl.textContent = "";
    let i = 0; const texto = dialogo.texto.normalize("NFC");
    if (intervaloMaquíinaEscribir) clearInterval(intervaloMaquíinaEscribir);
    intervaloMaquíinaEscribir = setInterval(() => {
        if (i < texto.length) { textoDialogoEl.textContent += texto[i]; i++; }
        else clearInterval(intervaloMaquíinaEscribir);
    }, 30);
}

window.siguienteDialogo = () => {
    if (respondiendo) return;
    if (intervaloMaquíinaEscribir && textoDialogoEl.textContent.length < dialogos[indexDialogo].texto.length) {
        clearInterval(intervaloMaquíinaEscribir); textoDialogoEl.textContent = dialogos[indexDialogo].texto; return;
    }
    indexDialogo++;
    if (indexDialogo < dialogos.length) mostrarDialogo(dialogos[indexDialogo]); else iniciarJuego();
};

function iniciarJuego() {
    respondiendo = true;
    dialogoEl.style.animation = "fadeOut 0.5s ease-out forwards";
    setTimeout(() => {
        dialogoEl.classList.add("oculto"); barraSuperiorEl.classList.remove("oculto");
        juegoEl.classList.remove("oculto"); juegoEl.style.zIndex = 5;
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
        const opcionesDiv = document.querySelector(".opciones"); opcionesDiv.innerHTML = "";
        p.opciones.forEach((opcion, i) => {
            const btn = document.createElement("button"); btn.textContent = opcion; btn.dataset.index = i;
            btn.onclick = () => verificarRespuesta(btn, i); opcionesDiv.appendChild(btn);
        });
        juegoEl.classList.remove('fading-out'); respondiendo = false;
    }, 400);
}

function verificarRespuesta(btnPresionado, indice) {
    if (respondiendo) return; respondiendo = true;
    const p = preguntas[preguntaActual]; const esCorrecta = (indice === p.respuesta);
    document.querySelectorAll(".opciones button").forEach(btn => { btn.disabled = true; });
    if (esCorrecta) {
        if(window.playCorrect) playCorrect();
        btnPresionado.classList.add("correct"); puntajeNivel++;
        setTimeout(() => {
            mostrarMensaje(p.feedback[indice], "correcto"); mensajeBotonEl.textContent = "¡Siguiente!";
            mensajeBotonEl.onclick = () => { cerrarMensaje(); preguntaActual++; mostrarPregunta(); };
        }, 1000);
    } else {
        if(window.playWrong) playWrong();
        document.body.classList.add('shake-effect');
        setTimeout(() => document.body.classList.remove('shake-effect'), 500);
        btnPresionado.classList.add("incorrect"); vidas--; actualizarVidas();
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
    mensajeContenidoEl.classList.remove("correcto", "incorrecto"); mensajeContenidoEl.classList.add(tipo);
    const e = document.getElementById("btnMenuGameOver"); if (e) e.remove();
    if (tipo === "correcto") mensajeTextoEl.innerHTML = "Correcto. " + texto;
    else mensajeTextoEl.innerHTML = texto.startsWith("<h1") ? texto : "No es correcto... " + texto;
    mensajeEl.classList.remove("oculto"); mensajeBotonEl.onclick = cerrarMensaje;
}
window.cerrarMensaje = () => { mensajeEl.classList.add("oculto"); };

function mostrarGameOver() {
    cerrarMensaje();
    mostrarMensaje(`<h1 style="font-family:'Fredoka One',cursive;color:var(--border-incorrect);">💀 Game Over 💀</h1><p>¡¡Oh no, ${nombreJugador}! ¡Puedes intentarlo de nuevo!</p>`, "incorrecto");
    mensajeBotonEl.textContent = "Reintentar Nivel"; mensajeBotonEl.onclick = () => location.reload();
    const btnMenu = document.createElement("button"); btnMenu.id = "btnMenuGameOver"; btnMenu.textContent = "Volver al Menú";
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
        const nivelGuardado = jugadorActual ? (jugadorActual.nivel || 0) : 0;
        const puntajeAnterior = jugadorActual ? (jugadorActual.puntaje || 0) : 0;
        await fetch(`${API_BASE}/guardar_jugador.php`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: userId, nombre: nombreJugador, nivel: Math.max(nivelGuardado, NIVEL_ACTUAL), puntaje: puntajeAnterior + puntajeNivel, precision: precisionNivel })
        });
    } catch (error) { console.error('Error al guardar:', error); }
    const contenedor = document.createElement("div"); contenedor.className = "contenedor-victoria";
    contenedor.innerHTML = `<h1>¡Nivel ${NIVEL_ACTUAL} Superado! 🎉</h1><p>¡Felicidades, ${nombreJugador}!</p><p>Respuestas Correctas: <strong>${puntajeNivel} / ${totalPreguntas}</strong></p><p>Precisión: <strong>${precisionNivel}%</strong></p><p>Vidas Restantes: <strong style="font-size:1.8rem;">${"🪙".repeat(vidas)}</strong></p><button id="btnSiguiente">Volver al Menú</button>`;
    gameContainerEl.appendChild(contenedor);
    document.getElementById("btnSiguiente").onclick = () => { window.location.href = '../introduccion.html'; };
}

inicializarNivel();
