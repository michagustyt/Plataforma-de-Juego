const API = 'api';
const NIVELES = [
  'La Amenaza del Fisco','La Travesía del IVA Perdido','El Misterio de las Deducciones',
  'La Batalla de los Impuestos','El Laberinto de la Nómina','Los Secretos del CFDI',
  'La Conspiración Contable','El Último Recurso Fiscal','La Victoria Final'
];

let usuarioActual = null;

async function inicializar() {
  try {
    const r = await fetch(`${API}/perfil.php?t=${Date.now()}`);
    if (r.status === 401) { window.location.href = 'login.html'; return; }
    const d = await r.json();
    if (!d.usuario) { window.location.href = 'login.html'; return; }
    if (d.usuario.rol !== 'alumno') { redirigir(d.usuario.rol); return; }

    if (!d.usuario.id_clase) {
      document.body.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; text-align:center; padding:20px; background-color:var(--bg); color:var(--dark);">
          <h1 style="color:var(--danger); margin-bottom:15px; font-size:2rem;">Acceso Restringido</h1>
          <p style="font-size:1.2rem; margin-bottom:25px; color:var(--dark);">No perteneces a ninguna clase. No tienes acceso a las lecciones.</p>
          <button class="btn btn-primary" onclick="fetch('${API}/logout.php', { method:'POST' }).then(()=>window.location.href='login.html')">Cerrar Sesión</button>
        </div>
      `;
      return;
    }

    usuarioActual = d.usuario;
    document.getElementById('userName').textContent  = d.usuario.nombre;
    document.getElementById('userEmail').textContent = d.usuario.email;
    document.getElementById('userClass').innerHTML = `
      <div style="margin-bottom:4px;"><strong>Clase:</strong> ${d.usuario.clase_nombre || 'Sin clase'}</div>
      <div><strong>Docente:</strong> ${d.usuario.docente_nombre || 'Sin docente'}</div>
    `;
    
    document.getElementById('pNombre').value = d.usuario.nombre;
    document.getElementById('pEmail').value  = d.usuario.email;
    document.getElementById('pBio').value       = d.usuario.bio       || '';
    document.getElementById('pTelefono').value  = d.usuario.telefono  || '';
    document.getElementById('pFecha').value     = d.usuario.fecha_nacimiento || '';

    cargarProgreso();
    cargarRanking();
    renderActividades(null); // render skeleton, update after progreso loads
  } catch(e) { console.error(e); window.location.href = 'login.html'; }
}

function redirigir(rol) {
  if (rol === 'docente') window.location.href = 'dashboard_docente.html';
  else if (rol === 'admin') window.location.href = 'dashboard_admin.html';
  else window.location.href = 'login.html';
}

// ── NAV ──────────────────────────────────────
document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
  btn.addEventListener('click', () => nav(btn.dataset.section));
});
function nav(sec) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sec).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-item[data-section="${sec}"]`).classList.add('active');
}

// ── LOGOUT ───────────────────────────────────
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch(`${API}/logout.php`, { method:'POST' });
  window.location.href = 'login.html';
});

// ── PERFIL MODAL ─────────────────────────────
document.getElementById('perfilBtn').addEventListener('click', () => {
  document.getElementById('perfilModal').style.display = 'flex';
});
document.getElementById('cerrarPerfil').addEventListener('click', () => {
  document.getElementById('perfilModal').style.display = 'none';
});
document.getElementById('perfilModal').addEventListener('click', e => {
  if (e.target === document.getElementById('perfilModal'))
    document.getElementById('perfilModal').style.display = 'none';
});
document.getElementById('guardarPerfil').addEventListener('click', async () => {
  const body = {
    bio: document.getElementById('pBio').value,
    telefono: document.getElementById('pTelefono').value,
    fecha_nacimiento: document.getElementById('pFecha').value
  };
  const r = await fetch(`${API}/perfil.php`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  if (r.ok) {
    Swal.fire({ icon:'success', title:'¡Guardado!', timer:1500, showConfirmButton:false });
    document.getElementById('perfilModal').style.display = 'none';
  } else { Swal.fire('Error','No se pudo guardar','error'); }
});

// ── PROGRESO ─────────────────────────────────
let jugadorData = null;

async function cargarProgreso() {
  try {
    const r = await fetch(`${API}/get_jugador.php?id=${usuarioActual?.id || ''}&t=${Date.now()}`);
    const data = await r.json();
    jugadorData = data;

    if (!data || !data.id) {
      document.getElementById('statNivel').textContent    = '0';
      document.getElementById('statPuntaje').textContent  = '0';
      document.getElementById('statPrecision').textContent = '0%';
      document.getElementById('statNiveles').textContent  = '0/9';
      document.getElementById('resumenProgreso').innerHTML = '<div class="empty-state"><div class="e-icon"></div>¡Aún no has jugado! Empieza tu aventura.</div>';
      renderActividades(data);
      renderProgresoDetalle(data);
      return;
    }

    const nivel    = data.nivel    || 0;
    const puntaje  = data.puntaje  || 0;
    const prec     = data.precision || '0';

    document.getElementById('statNivel').textContent    = nivel;
    document.getElementById('statPuntaje').textContent  = puntaje.toLocaleString();
    document.getElementById('statPrecision').textContent = prec + '%';
    document.getElementById('statNiveles').textContent  = `${nivel}/9`;

    // Barra de progreso resumen
    const pct = Math.round((nivel / 9) * 100);
    document.getElementById('resumenProgreso').innerHTML = `
      <div style="margin-bottom:10px;font-weight:700;color:var(--dark);">Avance general: ${pct}%</div>
      <div class="prog-bar-wrap"><div class="prog-bar-fill" style="width:${pct}%"></div></div>
      <p style="margin-top:10px;font-size:13px;color:#9c7a5a;">Has completado <strong>${nivel}</strong> de <strong>9</strong> capítulos con un puntaje acumulado de <strong>${puntaje.toLocaleString()} pts</strong>.</p>
    `;

    renderActividades(data);
    renderProgresoDetalle(data);
  } catch(e) { console.error(e); }
}

function renderActividades(jugador) {
  const grid = document.getElementById('nivGrid');
  grid.innerHTML = '';
  NIVELES.forEach((nombre, i) => {
    const num = i + 1;
    const completado = jugador && jugador.nivel >= num;
    const actual     = jugador && jugador.nivel === num - 1;
    const card = document.createElement('div');
    card.className = 'niv-card' + (completado ? ' completado' : '');
    card.innerHTML = `
      <div class="niv-num">Capítulo ${num}</div>
      <div class="niv-name">${nombre}</div>
      <div class="niv-pts">${completado ? (jugador.nivel === num ? jugador.puntaje + ' pts' : 'Completado') : (actual ? '<i class="fas fa-play"></i> En curso' : 'Por desbloquear')}</div>
      <span class="niv-status ${completado ? 'done' : actual ? 'pending' : 'locked'}">
        ${completado ? 'Completado' : actual ? '<i class="fas fa-play"></i> Disponible' : 'Bloqueado'}
      </span>
    `;
    if (completado || actual || !jugador) {
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        window.location.href = `html/capitulo${num}.html`;
      });
    }
    grid.appendChild(card);
  });
}

function renderProgresoDetalle(jugador) {
  const cont = document.getElementById('progresoDetalle');
  if (!jugador || !jugador.nivel) {
    cont.innerHTML = '<div class="empty-state"><div class="e-icon"></div>Aquí verás tu progreso nivel por nivel cuando comiences a jugar.</div>';
    return;
  }
  let html = '';
  NIVELES.forEach((nombre, i) => {
    const num = i + 1;
    const done = jugador.nivel >= num;
    const pct  = done ? 100 : 0;
    html += `
      <div class="card" style="margin-bottom:14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <span style="font-weight:800;color:${done ? 'var(--primary)' : '#9c7a5a'};">${done ? '' : ''} Capítulo ${num}: ${nombre}</span>
          <span class="badge ${done ? 'badge-ok' : 'badge-off'}">${done ? 'Completado' : 'Pendiente'}</span>
        </div>
        <div class="prog-bar-wrap"><div class="prog-bar-fill" style="width:${pct}%"></div></div>
        <p style="font-size:13px;margin-top:6px;color:#9c7a5a;">
          ${done ? `Puntaje acumulado hasta nivel ${num}: ${jugador.puntaje} pts | Precisión: ${jugador.precision || 0}%` : 'Sin intentos registrados'}
        </p>
      </div>
    `;
  });
  cont.innerHTML = html;
}

// ── RANKING ───────────────────────────────────
async function cargarRanking() {
  try {
    const data = await fetch(`${API}/gestion.php?action=ranking_mi_clase`).then(r => r.json());
    if (!data || !data.length) {
      document.getElementById('podiumContainer').innerHTML = '<div class="empty-state">No hay datos de ranking aún.</div>';
      document.getElementById('rankingTableBody').innerHTML = '<tr><td colspan="4" class="empty-state">Sin alumnos registrados</td></tr>';
      return;
    }

    const miId = usuarioActual.id;
    let miPosicionIndex = data.findIndex(a => a.id == miId);
    let miPosicionData = data[miPosicionIndex];

    // Banner logic
    const bannerPos = document.getElementById('miRankingPos');
    const bannerMsg = document.getElementById('miRankingMsg');
    
    if (miPosicionData) {
      bannerPos.innerHTML = `Tu posición actual: <strong>#${miPosicionData.posicion}</strong>`;
      if (miPosicionIndex > 0) {
        const puntosFaltantes = data[miPosicionIndex - 1].puntaje - miPosicionData.puntaje;
        bannerMsg.innerHTML = `¡Estás a solo <strong>${puntosFaltantes} puntos</strong> de alcanzar a ${data[miPosicionIndex - 1].nombre}!`;
      } else {
        bannerMsg.innerHTML = `¡Felicidades! Eres el #1 de tu clase. ¡Sigue así!`;
      }
    } else {
      bannerPos.textContent = `Sin clasificar`;
      bannerMsg.textContent = `Completa niveles para aparecer en el ranking.`;
    }

    // Podium Logic
    const podiumCont = document.getElementById('podiumContainer');
    let podiumHtml = '';
    const top3 = data.slice(0, 3);
    
    // Order for podium: 2nd, 1st, 3rd
    const podiumOrder = [];
    if (top3[1]) podiumOrder.push({ ...top3[1], class: 'second silver', rank: 2 });
    if (top3[0]) podiumOrder.push({ ...top3[0], class: 'first gold', rank: 1 });
    if (top3[2]) podiumOrder.push({ ...top3[2], class: 'third bronze', rank: 3 });

    podiumHtml = podiumOrder.map(u => `
      <div class="podium-step ${u.class}">
        <div class="podium-avatar">${u.rank===1?'👑':u.rank===2?'🥈':'🥉'}</div>
        <div class="podium-name">${u.nombre.split(' ')[0]}</div>
        <div class="podium-pts">${u.puntaje} pts</div>
        <div class="podium-bar">${u.rank}</div>
      </div>
    `).join('');
    podiumCont.innerHTML = podiumHtml;

    // Table Logic
    const tableBody = document.getElementById('rankingTableBody');
    tableBody.innerHTML = data.slice(3).map(a => `
      <tr class="${a.id == miId ? 'me' : ''}">
        <td class="rank-num">${a.posicion}</td>
        <td>${a.nombre} ${a.id == miId ? '(Tú)' : ''}</td>
        <td class="centered">${a.nivel}</td>
        <td class="centered" style="font-weight:700;">${a.puntaje} pts</td>
      </tr>
    `).join('');
    
    if (data.length <= 3) {
      tableBody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay más alumnos en la clase.</td></tr>';
    }

  } catch(e) {
    console.error("Error al cargar ranking:", e);
  }
}

inicializar();
