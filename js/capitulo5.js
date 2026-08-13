// ============================================================
// capitulo5.js — Sin Firebase, 100% local (XAMPP)
// ============================================================

const NIVEL_ACTUAL = 5;
const TITULO_NIVEL = "Nivel 5: Costeo, Presupuestos y decisiones duras";
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
        texto: "Nivel final. Aquíí se separan los godines de los verdaderos contadores.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Rogelio", 
        texto: "Los números no mienten, Godín. Pero hay que saber interpretarlos.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Brenda", 
        texto: "¡El presupuesto no cuadra! ¡Los costos se disparan! ¡Y el jefe quiere respuestas YA!",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Rogelio", 
        texto: "Punto de equilibrio, costeo ABC, flujo de caja... Esto es la prueba final.",
        fondo: "../assets/oficina.png" 
    },
    { 
        personaje: "Narrador", 
        texto: "Es hora de demostrar que no solo sabes registrar... sabes DECIDIR.",
        fondo: "../assets/oficina.png" 
    }
];

// Preguntas locales (fallback si falla la API)
const preguntasLocales = [
    {
        pregunta: "1.- Los gastos generales se han disparado debido a los constantes setups y la compleja logística interna. ¿Qué sistema de costeo implementarías?",
        opciones: [
            "Repartir costos usando un porcentaje fijo para todos los productos",
            "Cargar todos los gastos al producto más vendido",
            "Implementar Costeo ABC usando inductores: horas de setup, pedidos y traslados",
            "Traspasar los gastos a la cuenta de gastos de venta"
        ],
        respuesta: 2,
        feedback: [
            "Incorrecto: Repartir por porcentaje fijo no refleja la realidad de cómo se consumen los recursos",
            "Incorrecto: Cargar todo al producto estrella distorsiona sus márgenes reales",
            "Correcto: El Costeo ABC asigna costos según las actividades que los generan, dando información más precisa",
            "Incorrecto: Los gastos de producción no deben trasladarse a gastos de venta"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "2.- Tienes estos datos: Precio = $500, Costo variable = $300, Costos fijos = $200,000. ¿Cuál es tu punto de equilibrio?",
        opciones: [
            "Q* = 1,000 unidades",
            "Q* = 400 unidades",
            "Q* = 2,000 unidades",
            "No calcular el punto de equilibrio"
        ],
        respuesta: 0,
        feedback: [
            "Correcto: Fórmula: Q* = 200,000 / (500 - 300) = 1,000 unidades",
            "Incorrecto: Revisa la fórmula del punto de equilibrio",
            "Incorrecto: Cálculos incorrectos en la aplicación de la fórmula",
            "Incorrecto: El punto de equilibrio es fundamental para saber cuándo cubres costos"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "3.- El volumen real fue solo 80% del plan presupuestado. ¿Cómo manejas esta situación?",
        opciones: [
            "A Mover metas a posteriori",
            "Comparar real vs maestro y culpar al destino",
            " Eliminar el presupuesto",
            "Ajustar presupuesto a volumen real y analizar variaciones"
        ],
        respuesta: 3,
        feedback: [
            "Incorrecto: Manipular metas después del hecho no es una solución ética",
            "Incorrecto: Buscar culpables no identifica las causas reales del problema",
            "Incorrecto: Sin presupuesto pierdes control financiero y dirección",
            "Correcto: El presupuesto flexible permite evaluar desempeño real vs capacidad"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "4.- La máquina M2 limita la producción a 70 u/h, pero la demanda es de 100 u/h. ¿Qué estrategia aplicas?",
        opciones: [
            "Hacer inventario de WIP gigantesco",
            "Subordinar flujo a M2, usar buffers y mejorar set-up",
            "Vender menos",
            "Acelerar M1 para 'compensar'"
        ],
        respuesta: 1,
        feedback: [
            "Incorrecto: Inventario excesivo genera costos de almacenamiento y obsolescencia.",
            "Correcto: Identifica y optimiza la restricción - filosofía TOC correcta",
            "Incorrecto: Renunciar a ventas no es solución - hay que optimizar la capacidad",
            "Incorrecto: Solo crea inventario acumulado antes del cuello de botella"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "5.- Un proveedor ofrece una pieza a $45. Tu costo interno es $40 variables + $10 fijos evitables. ¿Qué decides?",
        opciones: [
            "Subestimar fijos",
            "Decidir por volado",
            "Mantener interno por orgullo",
            "Costo relevante interno $50 > $45, conviene comprar"
        ],
        respuesta: 3,
        feedback: [
            "Incorrecto: Ignorar costos fijos lleva a subcosteo y malas decisiones",
            "Incorrecto: Las decisiones estratégicas requieren análisis, no suerte",
            "Incorrecto: Las decisiones emocionales no son financieramente sólidas",
            "Correcto: Correcto: Considera todos los costos evitables ($50 vs $45)"
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "6.- Estándar: 2 kg a $20 c/u | Real: 2.2 kg a $18 c/u. ¿Cómo analizas las variaciones?",
        opciones: [
            "Separar variación de precio y eficiencia; actuar en compras y proceso",
            "Mezclar todas las variaciones y atribuirlas a la mala suerte",
            "Subir el estándar sin analizar las causas raíz",
            "Ignorar las variaciones por considerarlas normales"
        ],
        respuesta: 0,
        feedback: [
            "Correcto: Separar variaciones permite identificar si el problema es de precios (compras) o eficiencia (producción) para acciones específicas.",
            "Incorrecto: Mezclar variaciones impide identificar responsabilidades y tomar acciones correctivas efectivas.",
            "Incorrecto: Ajustar estándares sin análisis oculta problemas operativos que requieren solución.",
            "Incorrecto: Ignorar variaciones significativas puede ocultar ineficiencias costosas."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "7.- Los cobros se atrasan 30 días y la nómina vence mañana. ¿Cómo manejas la crisis de liquidez?",
        opciones: [
            "Retrasar el pago de nómina a los empleados",
            "Ofrecer descuentos agresivos sin calcular el impacto financiero",
            "Implementar calendario de cobros, línea de crédito y priorizar pagos críticos",
            "Vender activos productivos clave para obtener liquidez"
        ],
        respuesta: 2,
        feedback: [
            "Incorrecto: Retrasar nómina afecta la moral laboral y puede generar problemas legales.",
            "Incorrecto: Descuentos agresivos pueden generar pérdidas mayores que el problema de liquidez.",
            "Correcto: Solución estructural: mejorar cobranza, usar crédito para desfases temporales y proteger pagos esenciales.",
            "Incorrecto: Vender activos productivos resuelve el corto plazo pero compromete la capacidad operativa futura."
        ],
        fondo: "../assets/oficina.png"
    },
    {
        pregunta: "8.- Proyecto A: TIR 18%, Proyecto B: TIR 22%, capital limitado. ¿Qué proyecto seleccionar?",
        opciones: [
            "Elegir Proyecto A por preferencia personal o 'cariño'",
            "Seleccionar Proyecto B por mayor rentabilidad (TIR 22%)",
            "Intentar ambos proyectos usando deuda costosa y riesgosa",
            "No realizar ningún proyecto por miedo al riesgo"
        ],
        respuesta: 1,
        feedback: [
            "Incorrecto: Las decisiones de inversión deben basarse en criterios financieros, no emocionales.",
            "Correcto: Con capital limitado, se selecciona el proyecto con mayor TIR (22%) para optimizar el rendimiento del capital.",
            "Incorrecto: Usar deuda tóxica puede convertir proyectos rentables en no rentables después de costos financieros.",
            "Incorrecto: No invertir tiene un costo de oportunidad: perder la posibilidad de generar rendimientos."
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
