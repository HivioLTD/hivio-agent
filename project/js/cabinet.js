// Guard, particles, charts, table
document.addEventListener('DOMContentLoaded', ()=>{
  const auth = localStorage.getItem('hivio_auth');
  if(!auth){ window.location.href = './login.html'; return; }

  // particles
  if(!document.getElementById('bg')){
    const cv = document.createElement('canvas'); cv.id='bg'; document.body.prepend(cv);
  }
  (function particles(){
    const c = document.getElementById('bg'); if(!c) return;
    const ctx = c.getContext('2d'); let w,h;
    const dpr = Math.min(window.devicePixelRatio||1,2);
    function resize(){ w=c.width=innerWidth*dpr; h=c.height=innerHeight*dpr; c.style.width=innerWidth+'px'; c.style.height=innerHeight+'px'; ctx.setTransform(dpr,0,0,dpr,0,0);}
    resize(); addEventListener('resize', resize,{passive:true});
    const pts = Array.from({length:70}, ()=>({x:Math.random()*innerWidth, y:Math.random()*innerHeight, r:Math.random()*1.8+0.6, vx:(Math.random()-0.5)*0.55, vy:(Math.random()-0.5)*0.55}));
    (function step(){
      ctx.clearRect(0,0,innerWidth,innerHeight);
      for(const p of pts){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>innerWidth) p.vx*=-1;
        if(p.y<0||p.y>innerHeight) p.vy*=-1;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba(123,97,255,.45)'; ctx.fill();
      }
      requestAnimationFrame(step);
    })();
  })();

  // logout
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click',(e)=>{
      e.preventDefault();
      localStorage.removeItem('hivio_auth');
      window.location.href = './login.html';
    });
  }

  // Charts
  const eq = document.getElementById('equityChart');
  if(eq && typeof Chart!=='undefined'){
    const N = 200, labels = Array.from({length:N},(_,i)=>`D${i+1}`);
    let v = 100;
    const data = labels.map(()=>{
      const shock = (Math.random()-0.5)*1.0;
      const drift = 0.06/252*100;
      v = v*(1+(drift+shock)/100);
      return +v.toFixed(2);
    });
    new Chart(eq,{
      type:'line',
      data:{ labels, datasets:[{ label:'Equity', data, borderWidth:2, fill:true, tension:0.25 }] },
      options:{ plugins:{legend:{display:false}}, scales:{ x:{display:false} } }
    });
  }

  const sectors = document.getElementById('sectorsChart');
  if(sectors && typeof Chart!=='undefined'){
    new Chart(sectors,{
      type:'doughnut',
      data:{ labels:['Tech','Healthcare','Financials','Industrials','Energy'], datasets:[{ data:[40,18,20,12,10] }]},
      options:{ plugins:{ legend:{ position:'bottom' } } }
    });
  }

  // Table
  const rows = [
    {ticker:'AAPL', name:'Apple Inc.', weight:'18.0%', pl:'+6.4%'},
    {ticker:'MSFT', name:'Microsoft Corp.', weight:'17.5%', pl:'+4.2%'},
    {ticker:'UNH',  name:'UnitedHealth', weight:'9.0%',  pl:'-1.1%'},
    {ticker:'JNJ',  name:'Johnson & Johnson', weight:'8.5%', pl:'+0.9%'},
    {ticker:'XOM',  name:'Exxon Mobil', weight:'6.0%', pl:'-0.3%'}
  ];
  const tbody = document.getElementById('positionsTable');
  if(tbody){
    tbody.innerHTML = rows.map(r=>`<tr><td>${r.ticker}</td><td>${r.name}</td><td>${r.weight}</td><td>${r.pl}</td></tr>`).join('');
  }

  // optional reveal (if more content later)
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
});
