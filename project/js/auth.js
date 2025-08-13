// Фиксированные данные для входа
const VALID_LOGIN = "5512299";
const VALID_PASS  = "xxx2000tt";

// Лёгкий фон-частицы
(function initParticles(){
  try{
    if(!document.getElementById('bg')){
      const cv = document.createElement('canvas'); cv.id='bg'; document.body.prepend(cv);
    }
    const c = document.getElementById('bg'); if(!c) return;
    const ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio||1, 2);

    function resize(){
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      c.style.width = innerWidth + 'px';
      c.style.height = innerHeight + 'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    resize(); addEventListener('resize', resize, {passive:true});

    const pts = Array.from({length:60}, ()=>({
      x:Math.random()*innerWidth, y:Math.random()*innerHeight,
      r:Math.random()*1.6+0.5, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5
    }));

    (function step(){
      ctx.clearRect(0,0,innerWidth,innerHeight);
      for(const p of pts){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>innerWidth) p.vx*=-1;
        if(p.y<0||p.y>innerHeight) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(125,240,255,.45)'; ctx.fill();
      }
      requestAnimationFrame(step);
    })();
  }catch(e){ console.warn('Particles init error:', e); }
})();

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
