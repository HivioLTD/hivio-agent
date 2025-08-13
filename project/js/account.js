// Guard: must be signed in
document.addEventListener('DOMContentLoaded', ()=>{
  const auth = JSON.parse(localStorage.getItem('hivio_auth') || 'null');
  if(!auth){ window.location.href = './login.html'; return; }

 
