// Main site interactions: particles, scroll reveal, demo chart

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Particle background
(function particles(){
  const c = document.getElementById('bg');
  if(!c) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const ctx = c.getContext('2d');
  let w, h, particles = [];

  function resize(){
    w = c.width = innerWidth * dpr;
    h = c.height = innerHeight * dpr;
    c.style.width = innerWidth + 'px';
    c.style.height = innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', resize, {passive:true});
  resize();

  const COUNT = prefersReduced ? 40 : 90;
  for(let i=0;i<COUNT;i++){
    particles.push({
      x: Math.random()*innerWidth,
      y: Math.random()*innerHeight,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.5)*0.6,
      r: Math.random()*1.8+0.6
    });
  }

  function step(){
    ctx.clearRect(0,0,innerWidth,innerHeight);

    // connections
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y, dist = Math.hypot(dx,dy);
        if(dist < 120){
          const o = (1 - dist/120)*0.35;
          ctx.globalAlpha = o;
          const grad = ctx.createLinearGradient(a.x,a.y,b.x,b.y);
          grad.addColorStop(0,'#7df0ff'); grad.addColorStop(1,'#7b61ff');
          ctx.strokeStyle = grad;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // dots
    for(const p of particles){
      p.x += p.vx; p.y += p.vy;
      if(p.x < -20) p.x = innerWidth+20;
      if(p.x > innerWidth+20) p.x = -20;
      if(p.y < -20) p.y = innerHeight+20;
      if(p.y > innerHeight+20) p.y = -20;

      const grad = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r*6);
      grad.addColorStop(0, 'rgba(125,240,255,0.8)');
      grad.addColorStop(1, 'rgba(125,240,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    if(!prefersReduced) requestAnimationFrame(step);
  }
  step();
})();

// Scroll reveal
(function reveal(){
  const els = document.querySelectorAll('[data-reveal]');
  if(!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const delay = +e.target.getAttribute('data-reveal-delay')||0;
        setTimeout(()=> e.target.classList.add('show'), delay);
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.12});
  els.forEach(el => io.observe(el));
})();

// Footer year
document.addEventListener('DOMContentLoaded', ()=>{
  const y = document.getElementById('year');
  if(y) y.textContent = new Date().getFullYear();
});

// Demo chart in hero
document.addEventListener('DOMContentLoaded', ()=>{
  const ctx = document.getElementById('heroEquity');
  if(!ctx || typeof Chart === 'undefined') return;
  const N = 160;
  const labels = Array.from({length:N}, (_,i)=>`D${i+1}`);
  let v = 100;
  const data = labels.map(()=>{
    const shock = (Math.random()-0.5)*1.15;
    const drift = 0.08/252*100;
    v = v*(1+(drift+shock)/100);
    return +v.toFixed(2);
  });
  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'Strategy (demo)', data, borderWidth: 2, fill: true, tension: 0.25 }]},
    options: {
      plugins:{ legend:{display:false}},
      scales:{ x:{display:false}, y:{ ticks:{ callback:v=> (v|0) }}}
    }
  });
});
