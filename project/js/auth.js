// Hardcoded demo auth: login 5512299, password xxx2000tt
document.addEventListener('DOMContentLoaded', ()=>{
  // particles background (light)
  if(!document.getElementById('bg')){
    const cv = document.createElement('canvas'); cv.id='bg'; document.body.prepend(cv);
  }
  (function particles(){
    const c = document.getElementById('bg'); if(!c) return;
    const ctx = c.getContext('2d'); let w,h;
    const dpr = Math.min(window.devicePixelRatio||1,2);
    function resize(){ w=c.width=innerWidth*dpr; h=c.height=innerHeight*dpr; c.style.width=innerWidth+'px'; c.style.height=innerHeight+'px'; ctx.setTransform(dpr,0,0,dpr,0,0);}
    resize(); addEventListener('resize', resize,{passive:true});
    const pts = Array.from({length:60}, ()=>({x:Math.random()*innerWidth, y:Math.random()*innerHeight, r:Math.random()*1.6+0.5, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5}));
    (function step(){
      ctx.clearRect(0,0,innerWidth,innerHeight);
      for(const p of pts){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>innerWidth) p.vx*=-1;
        if(p.y<0||p.y>innerHeight) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(125,240,255,.55)'; ctx.fill();
      }
      requestAnimationFrame(step);
    })();
  })();

  const VALID_LOGIN = "5512299";
  const VALID_PASS  = "xxx2000tt";

  const form = document.getElementById('loginForm');
  if(!form) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const login = document.getElementById('login').value.trim();
    const pass  = document.getElementById('password').value.trim();

    if(login === VALID_LOGIN && pass === VALID_PASS){
      localStorage.setItem('hivio_auth', JSON.stringify({ login, ts: Date.now() }));
      window.location.href = './cabinet.html';
    }else{
      alert('Invalid login or password');
    }
  });
});
