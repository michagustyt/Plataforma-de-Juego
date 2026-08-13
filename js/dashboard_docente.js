const API = 'api';
let misClases = [];
let jugadoresReporte = [];
let preguntasActuales = [];
let nivelActual = null;
let editandoIdx = null;

// ── INIT ──────────────────────────────────────
async function inicializar() {
  try {
    const r = await fetch(`${API}/perfil.php`);
    if (r.status === 401) { window.location.href = 'login.html'; return; }
    const d = await r.json();
    if (!d.usuario) { window.location.href = 'login.html'; return; }
    if (d.usuario.rol !== 'docente') { redirigir(d.usuario.rol); return; }

    document.getElementById('userName').textContent  = d.usuario.nombre;
    document.getElementById('userEmail').textContent = d.usuario.email;
    document.getElementById('pNombre').value = d.usuario.nombre;
    document.getElementById('pEmail').value  = d.usuario.email;
    document.getElementById('pBio').value       = d.usuario.bio       || '';
    document.getElementById('pTelefono').value  = d.usuario.telefono  || '';
    document.getElementById('pFecha').value     = d.usuario.fecha_nacimiento || '';

    await cargarMisClases();
    await cargarStats();
    cargarTopAlumnos();
  } catch(e) { console.error(e); window.location.href = 'login.html'; }
}

function redirigir(rol) {
  if (rol === 'alumno') window.location.href = 'dashboard_alumno.html';
  else if (rol === 'admin') window.location.href = 'dashboard_admin.html';
  else window.location.href = 'login.html';
}

// ── NAV ──────────────────────────────────────
document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
  btn.addEventListener('click', () => {
    nav(btn.dataset.section);
    if (btn.dataset.section === 'alumnos')  cargarAlumnos();
    if (btn.dataset.section === 'clases')   renderClases();
    if (btn.dataset.section === 'reportes') cargarReporte();
  });
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

// ── PERFIL ───────────────────────────────────
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
  const body = { bio:document.getElementById('pBio').value, telefono:document.getElementById('pTelefono').value, fecha_nacimiento:document.getElementById('pFecha').value };
  const r = await fetch(`${API}/perfil.php`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
  if (r.ok) { Swal.fire({icon:'success',title:'¡Guardado!',timer:1500,showConfirmButton:false}); document.getElementById('perfilModal').style.display='none'; }
  else Swal.fire('Error','No se pudo guardar','error');
});

// ── HELPERS ──────────────────────────────────
function cerrarModal(id) { document.getElementById(id).style.display = 'none'; }
window.cerrarModal = cerrarModal;

function post(action, data) {
  return fetch(`${API}/gestion.php`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ action, ...data })
  }).then(r => r.json());
}
function get(action, params='') {
  return fetch(`${API}/gestion.php?action=${action}${params}`).then(r => r.json());
}

// ── STATS ────────────────────────────────────
async function cargarStats() {
  const s = await get('stats_docente');
  document.getElementById('stAlumnos').textContent = s.total_alumnos ?? '—';
  document.getElementById('stClases').textContent  = s.total_clases  ?? '—';
}

async function cargarMisClases() {
  misClases = await get('clases');
  // Fill selects
  ['alClase','asClase', 'filtroClaseReporte'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const base = id === 'alClase' ? '<option value="">— Sin asignar —</option>' :
                 id === 'filtroClaseReporte' ? '<option value="">— Todos los alumnos —</option>' :
                 '<option value="">— Selecciona —</option>';
    sel.innerHTML = base + misClases.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
  });
}

// ── TOP ALUMNOS (inicio) ─────────────────────
async function cargarTopAlumnos() {
  const alumnos = await get('progreso_alumnos');
  const top5 = alumnos.slice(0, 5);
  const body = document.getElementById('topBody');
  if (!top5.length) { body.innerHTML='<tr><td colspan="5" class="empty-state">Sin alumnos registrados aún.</td></tr>'; return; }

  // Stats generales
  const niveles = alumnos.filter(a=>a.nivel).map(a=>+a.nivel);
  document.getElementById('stTop').textContent  = alumnos[0]?.puntaje  ?? '—';
  document.getElementById('stProm').textContent = niveles.length ? (niveles.reduce((a,b)=>a+b,0)/niveles.length).toFixed(1) : '0';

  body.innerHTML = top5.map((a,i) => `<tr>
    <td class="centered">${['🥇','🥈','🥉','4.','5.'][i]}</td>
    <td>${a.nombre}</td>
    <td class="centered"><span class="nivel-pill">${a.nivel ?? 0}</span></td>
    <td class="centered"><span class="pts-pill">${(a.puntaje??0).toLocaleString()}</span></td>
    <td class="centered">${a.precision ?? 0}%</td>
  </tr>`).join('');
}

// ── ALUMNOS ──────────────────────────────────
async function cargarAlumnos() {
  const [alumnos, progreso] = await Promise.all([
    get('alumnos_clase', '&id_clase=0').then(() => get('progreso_alumnos')),
    get('progreso_alumnos')
  ]);
  renderTablaAlumnos(progreso);
}

function renderTablaAlumnos(alumnos) {
  const body = document.getElementById('alumnosBody');
  if (!alumnos.length) {
    body.innerHTML = '<tr><td colspan="6" class="empty-state">No tienes alumnos asignados.</td></tr>';
    return;
  }
  body.innerHTML = alumnos.map(a => {
    const clase = misClases.find(c => c.id == a.id_clase)?.nombre || '—';
    return `<tr>
      <td>${a.nombre}</td>
      <td>${a.email}</td>
      <td>${clase}</td>
      <td class="centered"><span class="nivel-pill">${a.nivel??0}</span></td>
      <td class="centered"><span class="pts-pill">${(a.puntaje??0).toLocaleString()}</span></td>
      <td>
        <button class="btn btn-info btn-sm" onclick="verDetalleAlumno(${JSON.stringify(a).replace(/"/g,'&quot;')})"><i class="fas fa-search"></i> Detalles</button>
        <button class="btn btn-warning btn-sm" style="margin-left: 5px;" onclick="restablecerPassword(${a.id}, '${a.nombre.replace(/'/g, "\\'")}')"><i class="fas fa-key"></i> Restablecer</button>
        <button class="btn btn-danger btn-sm" style="margin-left: 5px;" onclick="desasignarAlumno(${a.id}, '${a.nombre.replace(/'/g, "\\'")}')"><i class="fas fa-times"></i> Expulsar</button>
      </td>
    </tr>`;
  }).join('');
}

window.desasignarAlumno = async function(id_alumno, nombre_alumno) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: `¿Quieres remover a ${nombre_alumno} de tu clase?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: 'var(--danger)',
    cancelButtonColor: 'var(--accent)',
    confirmButtonText: 'Sí, remover',
    cancelButtonText: 'Cancelar'
  });
  
  if (result.isConfirmed) {
    const r = await post('desasignar_alumno', { id_alumno });
    if (r.ok) {
      Swal.fire('Removido', 'El alumno ha sido quitado de la clase.', 'success');
      cargarAlumnos();
    } else {
      Swal.fire('Error', r.error || 'No se pudo remover al alumno', 'error');
    }
  }
};

window.verDetalleAlumno = function(a) {
  const niveles = ['La Amenaza del Fisco','La Travesía del IVA','El Misterio de las Deducciones','La Batalla de los Impuestos','El Laberinto de la Nómina','Los Secretos del CFDI','La Conspiración Contable','El Último Recurso Fiscal','La Victoria Final'];
  let html = `<div style="text-align:left;max-height:300px;overflow-y:auto;"><ul style="list-style:none;padding:0;">`;
  for (let i=1;i<=9;i++) {
    const done = (a.nivel||0) >= i;
    html += `<li style="padding:7px 0;border-bottom:1px dashed #eee;display:flex;justify-content:space-between;">
      <span><strong>Cap. ${i}:</strong> ${niveles[i-1]}</span>
      <span style="color:${done?'var(--success)':'#9c7a5a'};font-weight:700;">${done?'Completado':'Pendiente'}</span>
    </li>`;
  }
  html += `</ul><p style="margin-top:12px;text-align:right;font-weight:800;">Puntaje: ${(a.puntaje||0).toLocaleString()} pts &nbsp;|&nbsp; Precisión: ${a.precision||0}%</p></div>`;
  Swal.fire({ title:`${a.nombre}`, html, confirmButtonColor:'var(--primary)' });
};

window.restablecerPassword = async function(id_alumno, nombre_alumno) {
  const { value: nueva_password } = await Swal.fire({
    title: `Restablecer contraseña`,
    text: `Para: ${nombre_alumno}`,
    input: 'password',
    inputLabel: 'Nueva contraseña',
    inputPlaceholder: 'Escribe la nueva contraseña',
    showCancelButton: true,
    confirmButtonColor: 'var(--accent)',
    cancelButtonColor: 'var(--danger)',
    confirmButtonText: 'Guardar Contraseña',
    cancelButtonText: 'Cancelar',
    inputValidator: (value) => {
      if (!value || value.trim().length === 0) {
        return '¡Debes ingresar una contraseña!'
      }
    }
  });

  if (nueva_password) {
    Swal.fire({ title: 'Actualizando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
      const r = await post('restablecer_password_alumno', { id_alumno, nueva_password });
      if (r.ok) {
        Swal.fire('¡Actualizada!', 'La contraseña ha sido restablecida con éxito.', 'success');
      } else {
        Swal.fire('Error', r.error || 'No se pudo restablecer la contraseña', 'error');
      }
    } catch (e) {
      Swal.fire('Error', 'Hubo un problema de conexión.', 'error');
    }
  }
};

// ── CLASES ───────────────────────────────────
async function renderClases() {
  const clases = await get('clases');
  const cont = document.getElementById('clasesGrid');
  if (!clases.length) { cont.innerHTML = '<div class="empty-state"><div class="e-icon"></div>Aún no tienes clases. ¡Crea una!</div>'; return; }
  cont.innerHTML = '<div class="niv-grid">' + clases.map(c => `
    <div class="card" style="border-left:5px solid var(--accent);">
      <div class="card-title">${c.nombre}</div>
      <p style="font-size:13px;color:#9c7a5a;margin-bottom:10px;">${c.descripcion||'Sin descripción'}</p>
      <p><strong>${c.total_alumnos}</strong> alumno(s)</p>
      <div style="margin-top:12px;">
        <button class="btn btn-info btn-sm" onclick="verAlumnosClase(${c.id},'${c.nombre.replace(/'/g,"\\'")}')">👥 Ver alumnos</button>
      </div>
    </div>`).join('') + '</div>';
}

window.verAlumnosClase = async function(id, nombre) {
  const alumnos = await get('alumnos_clase', `&id_clase=${id}`);
  let html = alumnos.length
    ? `<ul style="text-align:left;list-style:none;padding:0;">${alumnos.map(a=>`<li style="padding:6px 0;border-bottom:1px dashed #eee;">${a.nombre} <span style="color:#9c7a5a;font-size:12px;">${a.email}</span></li>`).join('')}</ul>`
    : '<p>Sin alumnos en esta clase aún.</p>';
  Swal.fire({ title:`${nombre}`, html, confirmButtonColor:'var(--primary)' });
};

// ── REPORTES ─────────────────────────────────
async function cargarReporte() {
  jugadoresReporte = await get('progreso_alumnos');
  renderTablaReporte();
}

function renderTablaReporte() {
  const body = document.getElementById('reporteBody');
  const filtroId = document.getElementById('filtroClaseReporte').value;
  let dataFiltrada = jugadoresReporte;
  if (filtroId) {
    dataFiltrada = dataFiltrada.filter(a => a.id_clase == filtroId);
  }

  if (!dataFiltrada.length) {
    body.innerHTML = '<tr><td colspan="7" class="empty-state">Sin datos de progreso para esta selección.</td></tr>';
    return;
  }
  const clasesMap = {};
  misClases.forEach(c => clasesMap[c.id] = c.nombre);
  body.innerHTML = dataFiltrada.map(a => {
    const fecha = a.timestamp ? new Date(a.timestamp).toLocaleDateString('es-MX') : '—';
    return `<tr>
      <td>${a.nombre}</td>
      <td>${clasesMap[a.id_clase]||'—'}</td>
      <td class="centered"><span class="nivel-pill">${a.nivel??0}</span></td>
      <td class="centered"><span class="pts-pill">${(a.puntaje??0).toLocaleString()}</span></td>
      <td class="centered">${a.precision??0}%</td>
      <td>${fecha}</td>
      <td><button class="btn btn-info btn-sm" onclick="verDetalleAlumno(${JSON.stringify(a).replace(/"/g,'&quot;')})"><i class="fas fa-search"></i> </button></td>
    </tr>`;
  }).join('');
}

if (document.getElementById('filtroClaseReporte')) {
  document.getElementById('filtroClaseReporte').addEventListener('change', renderTablaReporte);
}

// ── PDF ──────────────────────────────────────
document.getElementById('btnPDF').addEventListener('click', () => generarPDF());
document.getElementById('btnRefresh').addEventListener('click', () => cargarReporte());

function generarPDF() {
  const filtroId = document.getElementById('filtroClaseReporte').value;
  let dataFiltrada = jugadoresReporte;
  if (filtroId) {
    dataFiltrada = dataFiltrada.filter(a => a.id_clase == filtroId);
  }

  if (!dataFiltrada.length) { Swal.fire('Sin datos','No hay alumnos para generar el reporte.','info'); return; }
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    doc.setFont('helvetica','bold');
    doc.setFontSize(18); doc.text('Reporte de Progreso — Crónicas Fiscales', 15, 22);
    doc.setFontSize(11); doc.setFont('helvetica','normal');
    doc.text(`Generado: ${new Date().toLocaleString('es-MX')}`, 15, 30);
    
    let textoFiltro = "Todos los alumnos";
    if (filtroId) {
       const claseSeleccionada = misClases.find(c => c.id == filtroId);
       if (claseSeleccionada) textoFiltro = `Clase: ${claseSeleccionada.nombre}`;
    }
    doc.text(`Filtro: ${textoFiltro}`, 15, 37);
    doc.text(`Total de alumnos: ${dataFiltrada.length}`, 15, 44);

    const head = [['Alumno','Nivel Completado','Puntaje Total','Precisión %']];
    const body = dataFiltrada.map(j => [j.nombre||'—', j.nivel||0, (j.puntaje||0).toLocaleString(), `${j.precision||0}%`]);
    doc.autoTable({
      startY:50, head, body, theme:'striped',
      headStyles:{ fillColor:[231,111,81], textColor:255, fontSize:12, fontStyle:'bold' },
      styles:{ fontSize:10, cellPadding:3, halign:'center' },
      columnStyles:{ 0:{ cellWidth:70, halign:'left' }, 1:{ cellWidth:35 }, 2:{ cellWidth:35 }, 3:{ cellWidth:30 } }
    });
    doc.save('reporte_cronicas_fiscales.pdf');
    Swal.fire({icon:'success',title:'¡PDF generado!',timer:2000,showConfirmButton:false});
  } catch(e) { Swal.fire('Error',e.message,'error'); }
}

// ── MODAL NUEVA CLASE ─────────────────────────
document.getElementById('btnNuevaClase').addEventListener('click', () => {
  document.getElementById('claseNombre').value = '';
  document.getElementById('claseDesc').value = '';
  document.getElementById('modalClase').style.display = 'flex';
});
document.getElementById('guardarClase').addEventListener('click', async () => {
  const nombre = document.getElementById('claseNombre').value.trim();
  const desc   = document.getElementById('claseDesc').value.trim();
  if (!nombre) { Swal.fire('Error','El nombre es requerido','warning'); return; }
  const r = await post('crear_clase', { nombre, descripcion:desc });
  if (r.ok) {
    Swal.fire({icon:'success',title:'Clase creada',timer:1500,showConfirmButton:false});
    cerrarModal('modalClase');
    await cargarMisClases();
    renderClases();
  } else Swal.fire('Error', r.error || 'No se pudo crear', 'error');
});

// ── MODAL NUEVO ALUMNO ────────────────────────
document.getElementById('btnNuevoAlumno').addEventListener('click', async () => {
  await cargarMisClases();
  document.getElementById('alNombre').value = '';
  document.getElementById('alEmail').value  = '';
  document.getElementById('alPass').value   = '';
  document.getElementById('modalAlumno').style.display = 'flex';
});
document.getElementById('guardarAlumno').addEventListener('click', async () => {
  const nombre   = document.getElementById('alNombre').value.trim();
  const email    = document.getElementById('alEmail').value.trim();
  const password = document.getElementById('alPass').value;
  const id_clase = document.getElementById('alClase').value;
  if (!nombre || !email || !password) { Swal.fire('Error','Completa nombre, email y contraseña','warning'); return; }
  const r = await post('crear_alumno', { nombre, email, password, id_clase });
  if (r.ok) {
    Swal.fire({icon:'success',title:'Alumno creado',timer:1500,showConfirmButton:false});
    cerrarModal('modalAlumno');
    cargarAlumnos();
  } else Swal.fire('Error', r.error || 'No se pudo crear', 'error');
});

// ── MODAL ASIGNAR ALUMNO ──────────────────────
document.getElementById('btnAsignarAlumno').addEventListener('click', async () => {
  const sinClase = await get('alumnos_sin_clase');
  const selA = document.getElementById('asAlumno');
  selA.innerHTML = sinClase.length
    ? sinClase.map(a=>`<option value="${a.id}">${a.nombre} - ${a.nombre_clase ? `(Clase: ${a.nombre_clase})` : '(Sin clase)'}</option>`).join('')
    : '<option value="">Sin alumnos disponibles</option>';
  await cargarMisClases();
  document.getElementById('modalAsignar').style.display = 'flex';
});
document.getElementById('guardarAsignar').addEventListener('click', async () => {
  const id_alumno = document.getElementById('asAlumno').value;
  const id_clase  = document.getElementById('asClase').value;
  if (!id_alumno || !id_clase) { Swal.fire('Error','Selecciona alumno y clase','warning'); return; }
  const r = await post('asignar_alumno', { id_alumno, id_clase });
  if (r.ok) {
    Swal.fire({icon:'success',title:'Alumno asignado',timer:1500,showConfirmButton:false});
    cerrarModal('modalAsignar');
    cargarAlumnos();
  } else Swal.fire('Error', r.error || 'Error al asignar','error');
});

// ── PREGUNTAS ─────────────────────────────────
document.getElementById('btnCargarPreguntas').addEventListener('click', async () => {
  nivelActual = document.getElementById('selNivel').value;
  if (!nivelActual) { Swal.fire('Ups!','Selecciona un nivel','warning'); return; }
  Swal.fire({title:'Cargando...',allowOutsideClick:false,didOpen:()=>Swal.showLoading()});
  try {
    const res  = await fetch(`${API}/get_preguntas.php?nivel=${nivelActual}`);
    const data = await res.json();
    preguntasActuales = Array.isArray(data) ? data : [];
    preguntasActuales.sort((a,b)=>(a.orden||0)-(b.orden||0));
    Swal.close();
    renderPreguntas();
    document.getElementById('botonesPreguntas').style.display = 'flex';
  } catch(e) { Swal.fire('Error','No se pudieron cargar las preguntas','error'); }
});

document.getElementById('btnNuevaPregunta').addEventListener('click', () => abrirModalPregunta(null));
document.getElementById('btnGuardarCambios').addEventListener('click', guardarCambiosNivel);
document.getElementById('guardarPreguntaBtn').addEventListener('click', guardarPreguntaModal);

function renderPreguntas() {
  const cont = document.getElementById('listaPreguntas');
  if (!preguntasActuales.length) {
    cont.innerHTML = '<div class="empty-state"><div class="e-icon"><i class="fas fa-pencil-alt"></i> </div>Sin preguntas en este nivel. ¡Añade la primera!</div>';
    return;
  }
  cont.innerHTML = preguntasActuales.map((p,i) => `
    <div class="pregunta-card">
      <div class="pq-hdr">
        <div class="pq-text">${i+1}. ${p.pregunta||'Sin texto'}</div>
        <div class="pq-btns">
          <button class="btn btn-info btn-sm" onclick="abrirModalPregunta(${i})"><i class="fas fa-pencil-alt"></i> Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarPregunta(${i})"><i class="fas fa-trash"></i> </button>
        </div>
      </div>
      <div class="opciones-lista">${(p.opciones||[]).map((op,j)=>`<div class="opcion-item${j===p.respuesta?' correcta':''}">
        ${String.fromCharCode(65+j)}. ${op}${j===p.respuesta?' ':''}
      </div>`).join('')}</div>
    </div>`).join('');
}
window.abrirModalPregunta = function(idx) {
  editandoIdx = idx;
  document.getElementById('modalPreguntaTitulo').textContent = idx===null ? 'Nueva Pregunta' : `Editar Pregunta ${idx+1}`;
  const p = idx !== null ? preguntasActuales[idx] : {};
  document.getElementById('inPregunta').value = p.pregunta||'';
  [0,1,2,3].forEach(i => document.getElementById(`inOp${i}`).value = p.opciones?.[i]||'');
  document.getElementById('inRespuesta').value = p.respuesta||0;
  document.getElementById('modalPregunta').style.display = 'flex';
};
window.eliminarPregunta = function(idx) {
  Swal.fire({title:'¿Eliminar?',text:'Esta pregunta se borrará de la lista',icon:'warning',showCancelButton:true,confirmButtonColor:'var(--danger)',cancelButtonText:'Cancelar',confirmButtonText:'Sí, eliminar'}).then(r=>{
    if(r.isConfirmed){ preguntasActuales.splice(idx,1); renderPreguntas(); }
  });
};
function guardarPreguntaModal() {
  const pregunta = document.getElementById('inPregunta').value.trim();
  const opciones = [0,1,2,3].map(i => document.getElementById(`inOp${i}`).value.trim());
  const respuesta = +document.getElementById('inRespuesta').value;
  if (!pregunta) { Swal.fire('Error','La pregunta no puede estar vacía','error'); return; }
  if (opciones.some(o=>!o)) { Swal.fire('Error','Completa todas las opciones','error'); return; }
  const obj = { pregunta, opciones, respuesta, feedback:['','','',''], activa:true };
  if (editandoIdx !== null) preguntasActuales[editandoIdx] = {...preguntasActuales[editandoIdx],...obj};
  else preguntasActuales.push({ id:`p_${Date.now()}`, orden:preguntasActuales.length+1, ...obj });
  cerrarModal('modalPregunta');
  renderPreguntas();
  Swal.fire({icon:'success',title:'Guardado en memoria',text:'Haz clic en "Guardar cambios" para aplicar',timer:2500});
}
async function guardarCambiosNivel() {
  if (!nivelActual) return;
  Swal.fire({title:'Guardando...',allowOutsideClick:false,didOpen:()=>Swal.showLoading()});
  try {
    const res  = await fetch(`${API}/guardar_preguntas.php`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nivel:+nivelActual,preguntas:preguntasActuales.map((p,i)=>({...p,orden:i+1}))})});
    const data = await res.json();
    if (data.ok) Swal.fire({icon:'success',title:'¡Guardado!',text:`${data.total} preguntas guardadas`,timer:2000,showConfirmButton:false});
    else throw new Error(data.error);
  } catch(e){ Swal.fire('Error',e.message,'error'); }
}


// ── RANKING ───────────────────────────────────
async function cargarClasesRanking() {
  const clases = await get('clases');
  const select = document.getElementById('rankingClaseSelect');
  if (!clases.length) {
    select.innerHTML = '<option value="">No tienes clases</option>';
    return;
  }
  select.innerHTML = '<option value="">Selecciona una clase...</option>' + 
    clases.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
}

async function cargarRankingDocente(id_clase) {
  const podiumCont = document.getElementById('podiumDocenteContainer');
  const tableBody = document.getElementById('rankingDocenteTableBody');

  if (!id_clase) {
    podiumCont.innerHTML = '<div class="empty-state" style="width:100%; text-align:center;">Selecciona una clase para ver el ranking.</div>';
    tableBody.innerHTML = '<tr><td colspan="4" class="empty-state">Selecciona una clase.</td></tr>';
    return;
  }

  podiumCont.innerHTML = '<div class="loading-msg" style="width:100%; text-align:center;">Cargando podio...</div>';
  tableBody.innerHTML = '<tr><td colspan="4" class="loading-msg">Cargando...</td></tr>';

  try {
    const data = await fetch(`${API}/gestion.php?action=ranking_clase&id_clase=${id_clase}`).then(r => r.json());
    if (!data || !data.length) {
      podiumCont.innerHTML = '<div class="empty-state" style="width:100%; text-align:center;">No hay alumnos clasificados en esta clase.</div>';
      tableBody.innerHTML = '<tr><td colspan="4" class="empty-state">Sin alumnos clasificados.</td></tr>';
      return;
    }

    // Podium Logic
    let podiumHtml = '';
    const top3 = data.slice(0, 3);
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
    tableBody.innerHTML = data.slice(3).map(a => `
      <tr>
        <td class="rank-num">${a.posicion}</td>
        <td>${a.nombre}</td>
        <td class="centered">${a.nivel}</td>
        <td class="centered" style="font-weight:700;">${a.puntaje} pts</td>
      </tr>
    `).join('');
    
    if (data.length <= 3) {
      tableBody.innerHTML = '<tr><td colspan="4" class="empty-state">No hay más alumnos en la clase.</td></tr>';
    }
  } catch(e) {
    console.error("Error al cargar ranking docente:", e);
    podiumCont.innerHTML = '<div class="empty-state" style="width:100%; text-align:center;color:var(--danger);">Error al cargar.</div>';
    tableBody.innerHTML = '<tr><td colspan="4" class="empty-state" style="color:var(--danger);">Error al cargar.</td></tr>';
  }
}

document.getElementById('btnCargarRanking').addEventListener('click', () => {
  const id = document.getElementById('rankingClaseSelect').value;
  cargarRankingDocente(id);
});

inicializar();
cargarClasesRanking();

