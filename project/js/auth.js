// Данные для входа
const VALID_LOGIN = "5512299";
const VALID_PASS  = "xxx2000tt";

/* ВАЖНО:
   Частицы и scroll-reveal теперь идут из project/js/main.js,
   поэтому здесь НЕТ инициализации фона, чтобы не дублировать анимацию.
*/

// Авторизация
document.addEventListener('DOMContentLoaded', ()=>{
  const form = document.getElementById('loginForm');
  if(!form){
    console.error('loginForm not found on login.html');
    return;
  }

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const login = (document.getElementById('login')||{}).value?.trim();
    const pass  = (document.getElementById('password')||{}).value?.trim();
    const err   = document.getElementById('err');

    if(login === VALID_LOGIN && pass === VALID_PASS){
      localStorage.setItem('hivio_auth', JSON.stringify({ login, ts: Date.now() }));
      window.location.href = './cabinet.html';
    }else{
      if(err) err.style.display = 'block';
      else alert('Invalid login or password');
    }
  });
});
