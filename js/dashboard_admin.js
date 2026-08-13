const API = 'api';
let todasClases = [];
let reporteData  = [];

// ── INIT ──────────────────────────────────────
async function inicializar() {
  try {
    const r = await fetch(`${API}/perfil.php`);
    if (r.status === 401) { window.location.href = 'login.html'; return; }
    const d = await r.json();
    if (!d.usuario) { window.location.href = 'login.html'; return; }
    if (d.usuario.rol !== 'admin') { redirigir(d.usuario.rol); return; }

    document.getElementById('userName').textContent  = d.usuario.nombre;
    document.getElementById('userEmail').textContent = d.usuario.email;
    document.getElementById('pNombre').value = d.usuario.nombre;
    document.getElementById('pEmail').value  = d.usuario.email;

    await cargarStats();
    cargarTopAlumnos();
  } catch(e) { console.error(e); window.location.href = 'login.html'; }
}

function redirigir(rol) {
  if (rol === 'alumno') window.location.href = 'dashboard_alumno.html';
  else if (rol === 'docente') window.location.href = 'dashboard_docente.html';
  else window.location.href = 'login.html';
}

// ── NAV ──────────────────────────────────────
document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
  btn.addEventListener('click', () => {
    nav(btn.dataset.section);
    if (btn.dataset.section === 'docentes') cargarDocentes();
    if (btn.dataset.section === 'clases')   cargarClases();
    if (btn.dataset.section === 'alumnos')  cargarAlumnos();
    if (btn.dataset.section === 'reportes') cargarReporte();
  });
});
function nav(sec) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(sec).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-item[data-section="${sec}"]`).classList.add('active');
}

// ── LOGOUT / PERFIL ───────────────────────────
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch(`${API}/logout.php`, { method:'POST' });
  window.location.href = 'login.html';
});
document.getElementById('perfilBtn').addEventListener('click', () => {
  document.getElementById('perfilModal').style.display = 'flex';
});
document.getElementById('cerrarPerfil').addEventListener('click', () => {
  document.getElementById('perfilModal').style.display = 'none';
});

function cerrarModal(id) { document.getElementById(id).style.display = 'none'; }
window.cerrarModal = cerrarModal;

function post(action, data) {
  return fetch(`${API}/gestion.php`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action,...data}) }).then(r=>r.json());
}
function get(action, params='') {
  return fetch(`${API}/gestion.php?action=${action}${params}`).then(r=>r.json());
}

// ── STATS ────────────────────────────────────
async function cargarStats() {
  const s = await get('stats_admin');
  document.getElementById('stTotal').textContent   = s.total_usuarios ?? '—';
  document.getElementById('stDocentes').textContent = s.total_docentes ?? '—';
  document.getElementById('stAlumnos').textContent  = s.total_alumnos  ?? '—';
  document.getElementById('stClases').textContent   = s.total_clases   ?? '—';
}

async function cargarTopAlumnos() {
  const alumnos = await get('progreso_alumnos');
  const top = alumnos.slice(0, 5);
  const body = document.getElementById('topBody');
  if (!top.length) { body.innerHTML = '<tr><td colspan="5" class="empty-state">Sin datos aún.</td></tr>'; return; }
  // Fetch alumnos con docente info
  const alumnosAll = await fetch(`${API}/usuarios.php?action=alumnos`).then(r=>r.json());
  const docenteMap = {};
  alumnosAll.forEach(a => { docenteMap[a.id] = a.docente_nombre || '—'; });
  body.innerHTML = top.map((a,i) => `<tr>
    <td class="centered">${['🥇','🥈','🥉','4.','5.'][i]}</td>
    <td>${a.nombre}</td>
    <td>${docenteMap[a.id]||'—'}</td>
    <td class="centered"><span class="nivel-pill">${a.nivel??0}</span></td>
    <td class="centered"><span class="pts-pill">${(a.puntaje??0).toLocaleString()}</span></td>
  </tr>`).join('');
}

// ── DOCENTES ─────────────────────────────────
async function cargarDocentes() {
  const [docs, clases] = await Promise.all([get('docentes'), get('clases')]);
  const clasesPorDoc = {};
  clases.forEach(c => { clasesPorDoc[c.id_docente] = (clasesPorDoc[c.id_docente]||0)+1; });
  const body = document.getElementById('docentesBody');
  if (!docs.length) { body.innerHTML = '<tr><td colspan="5" class="empty-state">Sin docentes registrados.</td></tr>'; return; }
  body.innerHTML = docs.map(d => `<tr>
    <td>${d.nombre}</td>
    <td>${d.email}</td>
    <td class="centered">${clases.filter(c=>c.id_docente==d.id).reduce((s,c)=>s+Number(c.total_alumnos),0)}</td>
    <td class="centered">${clasesPorDoc[d.id]||0}</td>
    <td class="centered"><span class="badge ${d.activo?'badge-ok':'badge-off'}">${d.activo?'Activo':'Inactivo'}</span></td>
    <td class="centered" style="white-space:nowrap;">
      <button class="btn btn-sm btn-info" onclick="editarDocente(${d.id}, '${d.nombre.replace(/'/g,"\\'")}', '${d.email}')"><i class="fas fa-edit"></i></button>
      <button class="btn btn-sm btn-danger" onclick="eliminarDocente(${d.id}, '${d.nombre.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
    </td>
  </tr>`).join('');
}

// ── CLASES ───────────────────────────────────
async function cargarClases() {
  const clases = await get('clases');
  todasClases = clases;
  const body = document.getElementById('clasesBody');
  if (!clases.length) { body.innerHTML = '<tr><td colspan="5" class="empty-state">Sin clases creadas.</td></tr>'; return; }
  body.innerHTML = clases.map(c => `<tr>
    <td>${c.nombre}</td>
    <td>${c.docente_nombre||'—'}</td>
    <td class="centered"><span class="badge badge-alumno">${c.total_alumnos}</span></td>
    <td>${c.descripcion||'—'}</td>
    <td><button class="btn btn-info btn-sm" onclick="verAlumnosClase(${c.id},'${c.nombre.replace(/'/g,"\\'")}')">👥 Ver</button></td>
  </tr>`).join('');
}

window.verAlumnosClase = async function(id, nombre) {
  const alumnos = await get('alumnos_clase', `&id_clase=${id}`);
  const html = alumnos.length
    ? `<ul style="text-align:left;list-style:none;padding:0;">${alumnos.map(a=>`<li style="padding:6px 0;border-bottom:1px dashed #eee;">${a.nombre} <span style="color:#9c7a5a;font-size:12px;">${a.email}</span></li>`).join('')}</ul>`
    : '<p>Sin alumnos en esta clase.</p>';
  Swal.fire({ title:`${nombre}`, html, confirmButtonColor:'var(--primary)' });
};

// ── ALUMNOS ──────────────────────────────────
async function cargarAlumnos() {
  const alumnos = await fetch(`${API}/usuarios.php?action=alumnos`).then(r=>r.json());
  const body = document.getElementById('alumnosBody');
  if (!alumnos.length) { body.innerHTML = '<tr><td colspan="5" class="empty-state">Sin alumnos registrados.</td></tr>'; return; }
  body.innerHTML = alumnos.map(a => `<tr>
    <td>${a.nombre}</td>
    <td>${a.email}</td>
    <td>${a.docente_nombre||'—'}</td>
    <td>${todasClases.find(c=>c.id==a.id_clase)?.nombre||'—'}</td>
    <td class="centered"><span class="badge ${a.activo?'badge-ok':'badge-off'}">${a.activo?'Activo':'Inactivo'}</span></td>
    <td class="centered" style="white-space:nowrap;">
      <button class="btn btn-sm btn-info" onclick="editarAlumno(${a.id}, '${a.nombre.replace(/'/g,"\\'")}', '${a.email}')"><i class="fas fa-edit"></i></button>
      <button class="btn btn-sm btn-danger" onclick="eliminarAlumno(${a.id}, '${a.nombre.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
    </td>
  </tr>`).join('');
}

// ── REPORTES ─────────────────────────────────
async function cargarReporte() {
  reporteData = await get('progreso_alumnos');
  // get docente name per alumno
  const alumnosAll = await fetch(`${API}/usuarios.php?action=alumnos`).then(r=>r.json());
  const docenteMap = {};
  alumnosAll.forEach(a => { docenteMap[a.id] = a.docente_nombre||'—'; });

  const body = document.getElementById('reporteBody');
  if (!reporteData.length) { body.innerHTML = '<tr><td colspan="6" class="empty-state">Sin datos.</td></tr>'; return; }
  body.innerHTML = reporteData.map(a => {
    const fecha = a.timestamp ? new Date(a.timestamp).toLocaleDateString('es-MX') : '—';
    return `<tr>
      <td>${a.nombre}</td>
      <td>${docenteMap[a.id]||'—'}</td>
      <td class="centered"><span class="nivel-pill">${a.nivel??0}</span></td>
      <td class="centered"><span class="pts-pill">${(a.puntaje??0).toLocaleString()}</span></td>
      <td class="centered">${a.precision??0}%</td>
      <td>${fecha}</td>
    </tr>`;
  }).join('');
}

document.getElementById('btnPDF').addEventListener('click', () => {
  if (!reporteData.length) { Swal.fire('Sin datos','Carga los reportes primero','info'); return; }
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
    doc.setFont('helvetica','bold'); doc.setFontSize(18);
    doc.text('Reporte General — Crónicas Fiscales', 15, 22);
    doc.setFont('helvetica','normal'); doc.setFontSize(11);
    doc.text(`Generado: ${new Date().toLocaleString('es-MX')} | Total alumnos: ${reporteData.length}`, 15, 30);
    doc.autoTable({
      startY:40,
      head:[['Alumno','Nivel','Puntaje','Precisión']],
      body: reporteData.map(j=>[j.nombre||'—', j.nivel||0, (j.puntaje||0).toLocaleString(), `${j.precision||0}%`]),
      theme:'striped',
      headStyles:{ fillColor:[231,111,81], textColor:255, fontSize:12, fontStyle:'bold' },
      styles:{ fontSize:10, cellPadding:3, halign:'center' },
      columnStyles:{ 0:{ cellWidth:75, halign:'left' } }
    });
    doc.save('reporte_admin_cronicas_fiscales.pdf');
    Swal.fire({icon:'success',title:'¡PDF generado!',timer:2000,showConfirmButton:false});
  } catch(e) { Swal.fire('Error',e.message,'error'); }
});
document.getElementById('btnRefresh').addEventListener('click', () => cargarReporte());

// ── MODAL NUEVO DOCENTE ───────────────────────
document.getElementById('btnNuevoDocente').addEventListener('click', () => {
  ['docNombre','docEmail','docPass'].forEach(id => document.getElementById(id).value='');
  document.getElementById('modalDocente').style.display='flex';
});
document.getElementById('guardarDocente').addEventListener('click', async () => {
  const nombre = document.getElementById('docNombre').value.trim();
  const email  = document.getElementById('docEmail').value.trim();
  const password = document.getElementById('docPass').value;
  if (!nombre||!email||!password) { Swal.fire('Error','Completa todos los campos','warning'); return; }
  const r = await post('crear_docente', { nombre, email, password });
  if (r.ok) { Swal.fire({icon:'success',title:'Docente creado',timer:1500,showConfirmButton:false}); cerrarModal('modalDocente'); cargarDocentes(); cargarStats(); }
  else Swal.fire('Error', r.error||'No se pudo crear','error');
});

window.editarDocente = async function(id, nombre, email) {
  const { value: formValues } = await Swal.fire({
    title: 'Editar Docente',
    html:
      `<input id="swal-input-n" class="swal2-input" placeholder="Nombre" value="${nombre}">` +
      `<input id="swal-input-e" class="swal2-input" type="email" placeholder="Email" value="${email}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    preConfirm: () => {
      const n = document.getElementById('swal-input-n').value.trim();
      const e = document.getElementById('swal-input-e').value.trim();
      if(!n||!e) Swal.showValidationMessage('Ambos campos son requeridos');
      return { n, e };
    }
  });
  if (formValues) {
    const r = await fetch(`${API}/gestion.php?action=editar_docente`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, nombre:formValues.n, email:formValues.e}) }).then(r=>r.json());
    if (r.ok) { Swal.fire('Éxito', 'Docente actualizado', 'success'); cargarDocentes(); }
    else Swal.fire('Error', r.error||'No se pudo actualizar', 'error');
  }
};

window.eliminarDocente = async function(id, nombre) {
  const res = await Swal.fire({ title: `¿Eliminar a ${nombre}?`, text: 'Se eliminarán sus clases también.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Sí, eliminar' });
  if (res.isConfirmed) {
    const r = await fetch(`${API}/gestion.php?action=eliminar_docente`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) }).then(r=>r.json());
    if (r.ok) { Swal.fire('Eliminado', '', 'success'); cargarDocentes(); cargarClases(); }
    else Swal.fire('Error', r.error||'No se pudo eliminar', 'error');
  }
};

// ── MODAL NUEVA CLASE ─────────────────────────
document.getElementById('btnNuevaClase').addEventListener('click', async () => {
  const docs = await get('docentes');
  const sel = document.getElementById('claseDocente');
  sel.innerHTML = docs.length
    ? docs.map(d=>`<option value="${d.id}">${d.nombre}</option>`).join('')
    : '<option value="">Sin docentes disponibles</option>';
  ['claseNombre','claseDesc'].forEach(id => document.getElementById(id).value='');
  document.getElementById('modalClase').style.display='flex';
});
document.getElementById('guardarClase').addEventListener('click', async () => {
  const nombre     = document.getElementById('claseNombre').value.trim();
  const id_docente = document.getElementById('claseDocente').value;
  const desc       = document.getElementById('claseDesc').value.trim();
  if (!nombre||!id_docente) { Swal.fire('Error','Nombre y docente son requeridos','warning'); return; }
  const r = await post('crear_clase', { nombre, id_docente, descripcion:desc });
  if (r.ok) { Swal.fire({icon:'success',title:'Clase creada',timer:1500,showConfirmButton:false}); cerrarModal('modalClase'); cargarClases(); cargarStats(); }
  else Swal.fire('Error', r.error||'No se pudo crear','error');
});

window.editarAlumno = async function(id, nombre, email) {
  const { value: formValues } = await Swal.fire({
    title: 'Editar Alumno',
    html:
      `<input id="swal-input-na" class="swal2-input" placeholder="Nombre" value="${nombre}">` +
      `<input id="swal-input-ea" class="swal2-input" type="email" placeholder="Email" value="${email}">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    preConfirm: () => {
      const n = document.getElementById('swal-input-na').value.trim();
      const e = document.getElementById('swal-input-ea').value.trim();
      if(!n||!e) Swal.showValidationMessage('Ambos campos son requeridos');
      return { n, e };
    }
  });
  if (formValues) {
    const r = await fetch(`${API}/gestion.php?action=editar_alumno`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id, nombre:formValues.n, email:formValues.e}) }).then(r=>r.json());
    if (r.ok) { Swal.fire('Éxito', 'Alumno actualizado', 'success'); cargarAlumnos(); }
    else Swal.fire('Error', r.error||'No se pudo actualizar', 'error');
  }
};

window.eliminarAlumno = async function(id, nombre) {
  const res = await Swal.fire({ title: `¿Eliminar a ${nombre}?`, text: 'Se borrará su progreso.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Sí, eliminar' });
  if (res.isConfirmed) {
    const r = await fetch(`${API}/gestion.php?action=eliminar_alumno`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id}) }).then(r=>r.json());
    if (r.ok) { Swal.fire('Eliminado', '', 'success'); cargarAlumnos(); }
    else Swal.fire('Error', r.error||'No se pudo eliminar', 'error');
  }
};

// ── MODAL NUEVO ALUMNO ────────────────────────
document.getElementById('btnNuevoAlumno').addEventListener('click', async () => {
  const clases = await get('clases');
  const sel = document.getElementById('alClase');
  sel.innerHTML = '<option value="">— Sin asignar —</option>' + clases.map(c=>`<option value="${c.id}">${c.nombre} (${c.docente_nombre})</option>`).join('');
  ['alNombre','alEmail','alPass'].forEach(id => document.getElementById(id).value='');
  document.getElementById('modalAlumno').style.display='flex';
});
document.getElementById('guardarAlumno').addEventListener('click', async () => {
  const nombre = document.getElementById('alNombre').value.trim();
  const email  = document.getElementById('alEmail').value.trim();
  const password = document.getElementById('alPass').value;
  const id_clase = document.getElementById('alClase').value;
  if (!nombre||!email||!password) { Swal.fire('Error','Completa nombre, email y contraseña','warning'); return; }
  const r = await post('crear_alumno', { nombre, email, password, id_clase });
  if (r.ok) { Swal.fire({icon:'success',title:'Alumno creado',timer:1500,showConfirmButton:false}); cerrarModal('modalAlumno'); cargarAlumnos(); cargarStats(); }
  else Swal.fire('Error', r.error||'No se pudo crear','error');
});

// ── MODAL ASIGNAR ALUMNO ──────────────────────
document.getElementById('btnAsignarAlumno').addEventListener('click', async () => {
  const [sinClase, clases] = await Promise.all([get('alumnos_sin_clase'), get('clases')]);
  document.getElementById('asAlumno').innerHTML = sinClase.length
    ? sinClase.map(a=>`<option value="${a.id}">${a.nombre} - ${a.nombre_clase ? `(Clase: ${a.nombre_clase})` : '(Sin clase)'}</option>`).join('')
    : '<option value="">Sin alumnos disponibles</option>';
  document.getElementById('asClase').innerHTML = '<option value="">— Selecciona —</option>' + clases.map(c=>`<option value="${c.id}">${c.nombre} (${c.docente_nombre})</option>`).join('');
  document.getElementById('modalAsignar').style.display='flex';
});
document.getElementById('guardarAsignar').addEventListener('click', async () => {
  const id_alumno = document.getElementById('asAlumno').value;
  const id_clase  = document.getElementById('asClase').value;
  if (!id_alumno||!id_clase) { Swal.fire('Error','Selecciona alumno y clase','warning'); return; }
  const r = await post('asignar_alumno', { id_alumno, id_clase });
  if (r.ok) { Swal.fire({icon:'success',title:'Asignado',timer:1500,showConfirmButton:false}); cerrarModal('modalAsignar'); cargarAlumnos(); }
  else Swal.fire('Error', r.error||'Error al asignar','error');
});

inicializar();

// ── MODO VISTA (SWITCH ROL) ───────────────────
// Las variables globales para guardar los datos de modo vista
let listaDocentesModo = [];
let listaAlumnosModo = [];

async function cargarSelectoresModo() {
  try {
    const docentes = await get('docentes');
    const alumnos = await fetch(`${API}/usuarios.php?action=alumnos`).then(r => r.json());
    listaDocentesModo = docentes;
    listaAlumnosModo = alumnos;
  } catch (e) {
    console.error("Error loading lists for mode switcher", e);
  }
}

async function switchRol(rol, id) {
  const body = { rol };
  if (rol === 'docente' && id) body.id_docente = id;
  if (rol === 'alumno'  && id) body.id_alumno  = id;

  const r = await fetch(`${API}/switch_role.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => r.json());

  if (r.ok) {
    window.location.href = r.redirect;
  } else {
    Swal.fire('Error', r.error || 'No se pudo cambiar de modo', 'error');
  }
}

document.getElementById('btnModoDocente').addEventListener('click', async () => {
  if (listaDocentesModo.length === 0) { Swal.fire('Aviso', 'No hay docentes disponibles', 'info'); return; }
  
  const options = {};
  listaDocentesModo.forEach(d => options[d.id] = d.nombre);
  
  const { value: id } = await Swal.fire({
    title: 'Modo Docente',
    input: 'select',
    inputOptions: options,
    inputPlaceholder: 'Selecciona un docente',
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-sign-in-alt"></i> Entrar',
    cancelButtonText: 'Cancelar'
  });
  
  if (id) switchRol('docente', id);
});

document.getElementById('btnModoAlumno').addEventListener('click', async () => {
  if (listaAlumnosModo.length === 0) { Swal.fire('Aviso', 'No hay alumnos disponibles', 'info'); return; }
  
  const options = {};
  listaAlumnosModo.forEach(a => options[a.id] = `${a.nombre} (${a.nombre_clase||'sin clase'})`);
  
  const { value: id } = await Swal.fire({
    title: 'Modo Alumno',
    input: 'select',
    inputOptions: options,
    inputPlaceholder: 'Selecciona un alumno',
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-sign-in-alt"></i> Entrar',
    cancelButtonText: 'Cancelar'
  });
  
  if (id) switchRol('alumno', id);
});

// Comprueba si existe un banner pendiente (viene de otro panel como admin emulando)
(async () => {
  try {
    const info = await fetch(`${API}/switch_role.php`).then(r => r.json());
    if (info.emulando) {
      const banner = document.getElementById('emuBanner');
      document.getElementById('emuRolLabel').textContent =
        info.rol_activo.charAt(0).toUpperCase() + info.rol_activo.slice(1);
      banner.style.display = 'flex';

      document.getElementById('btnVolverAdmin').addEventListener('click', async () => {
        await switchRol('admin', null);
      });
    }
  } catch(e) {}

  // Cargar los selectores de modo al arrancar
  cargarSelectoresModo();
})();
