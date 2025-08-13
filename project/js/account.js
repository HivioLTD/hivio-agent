// Redirect to login if not authenticated
(function guard(){
  const auth = JSON.parse(localStorage.getItem('hivio_auth') || 'null');
  if(!auth){ window.location.href = './login.html'; }
})();

document.addEventListener('DOMContentLoaded', ()=>{
  // Elements
  const imgEl   = document.getElementById('avatarImg');
  const inputEl = document.getElementById('avatarInput');
  const roleBadge = document.getElementById('roleBadge');
  const loginId = document.getElementById('loginId');
  const form = document.getElementById('profileForm');

  // Load profile
  const auth = JSON.parse(localStorage.getItem('hivio_auth') || 'null');
  const prof = JSON.parse(localStorage.getItem('hivio_profile') || 'null') || {};

  // Defaults
  const defaults = {
    firstName: 'Vsevolod',
    lastName: 'Kuznetsov',
    position: 'Director',
    role: 'admin', // admin/manager/analyst/viewer
    birth: '',
    email: 'name@hivio.uk',
    phone: '+44 20 0000 0000',
    twofa: 'enabled',
    resp: 'Strategy, team leadership, risk limits, approvals',
    avatarB64: ''
  };
  const state = Object.assign({}, defaults, prof);

  // Fill form
  const el = id => document.getElementById(id);
  el('firstName').value = state.firstName;
  el('lastName').value  = state.lastName;
  el('position').value  = state.position;
  el('role').value      = state.role;
  el('birth').value     = state.birth;
  el('email').value     = state.email;
  el('phone').value     = state.phone;
  el('twofa').value     = state.twofa;
  el('resp').value      = state.resp;

  // Role badge + login id
  roleBadge.textContent = (state.role === 'admin' ? 'Director · Full rights'
                          : state.role === 'manager' ? 'Manager · Ops'
                          : state.role === 'analyst' ? 'Analyst · Read & propose'
                          : 'Viewer · Read-only');
  loginId.textContent = (auth && auth.login) ? auth.login : '—';

  // Avatar
  const setAvatar = (b64)=>{
    if(b64){ imgEl.src = b64; }
    else{
      const svg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7df0ff"/><stop offset="1" stop-color="#7b61ff"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/></svg>');
      imgEl.src = 'data:image/svg+xml;charset=utf-8,' + svg;
    }
  };
  setAvatar(state.avatarB64);

  inputEl.addEventListener('change', (e)=>{
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.avatarB64 = reader.result;
      setAvatar(state.avatarB64);
      localStorage.setItem('hivio_profile', JSON.stringify(state));
    };
    reader.readAsDataURL(file);
  });

  // Save
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    state.firstName = el('firstName').value.trim();
    state.lastName  = el('lastName').value.trim();
    state.position  = el('position').value.trim();
    state.role      = el('role').value;
    state.birth     = el('birth').value;
    state.email     = el('email').value.trim();
    state.phone     = el('phone').value.trim();
    state.twofa     = el('twofa').value;
    state.resp      = el('resp').value.trim();

    localStorage.setItem('hivio_profile', JSON.stringify(state));
    roleBadge.textContent = (state.role === 'admin' ? 'Director · Full rights'
                            : state.role === 'manager' ? 'Manager · Ops'
                            : state.role === 'analyst' ? 'Analyst · Read & propose'
                            : 'Viewer · Read-only');
    alert('Saved');
  });

  // Reset
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    localStorage.removeItem('hivio_profile');
    window.location.reload();
  });

  // Sign out (на странице профиля тоже)
  const signOut = ()=>{
    try{ localStorage.removeItem('hivio_auth'); }catch(_){}
    window.location.href = './login.html';
  };
  document.getElementById('signOut').addEventListener('click', signOut);
  document.getElementById('menuSignout').addEventListener('click', (e)=>{ e.preventDefault(); signOut(); });

  // Employees (admin only)
  const empTable = document.getElementById('empTable');
  const addEmpBtn = document.getElementById('addEmpBtn');
  const empNote   = document.getElementById('empNote');

  const isAdmin = (auth && auth.login === '5512299') || state.role === 'admin';
  if(!isAdmin){
    addEmpBtn.disabled = true;
    addEmpBtn.style.opacity = .5;
    empNote.textContent = 'Only Director can add or remove employees (view only).';
  }

  const EMP_KEY = 'hivio_employees';
  const emps = JSON.parse(localStorage.getItem(EMP_KEY) || '[]');

  function renderEmps(){
    empTable.innerHTML = '';
    if(!emps.length){
      const tr = document.createElement('tr');
      tr.innerHTML = '<td colspan="4" class="muted">No employees yet.</td>';
      empTable.appendChild(tr);
      return;
    }
    emps.forEach((e, idx)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${e.name}</td><td>${e.position}</td><td>${e.role}</td>
        <td style="text-align:right">${isAdmin ? `<button data-i="${idx}" class="btn-pill danger">Remove</button>`:''}</td>`;
      empTable.appendChild(tr);
    });
    if(isAdmin){
      empTable.querySelectorAll('button[data-i]').forEach(b=>{
        b.addEventListener('click', ()=>{
          const i = +b.getAttribute('data-i');
          emps.splice(i,1);
          localStorage.setItem(EMP_KEY, JSON.stringify(emps));
          renderEmps();
        });
      });
    }
  }
  renderEmps();

  addEmpBtn.addEventListener('click', ()=>{
    if(!isAdmin) return;
    const name = prompt('Employee full name:');
    if(!name) return;
    const position = prompt('Position:','Analyst');
    const role = prompt('Role (manager/analyst/viewer):','analyst');
    emps.push({name, position, role});
    localStorage.setItem(EMP_KEY, JSON.stringify(emps));
    renderEmps();
  });
});
