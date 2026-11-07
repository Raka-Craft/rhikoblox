window.RGAMES = window.RGAMES || [];

/* 1. Ular Klasik */
RGAMES.push({ id:'snake', name:'Ular Klasik', emoji:'🐍', hue:140, desc:'Makan apel sebanyak-banyaknya, jangan menabrak!', play(el, api){
  let over=false; const T=[]; let raf=0;
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); cancelAnimationFrame(raf); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<canvas id="sn-cv" width="300" height="300" style="width:100%;max-width:340px;display:block;margin:6px auto;background:#0b2e1a;border-radius:10px;touch-action:none"></canvas><div id="sn-sc" style="text-align:center;color:#fff;font-weight:bold">Skor: 0</div><div style="text-align:center;margin-top:4px"><button data-d="up" class="sn-b">⬆️</button><br><button data-d="left" class="sn-b">⬅️</button><button data-d="down" class="sn-b">⬇️</button><button data-d="right" class="sn-b">➡️</button></div><style>.sn-b{font-size:19px;padding:7px 13px;margin:2px;border:none;border-radius:8px;background:#1d4d2e;color:#fff}</style>';
  const cv=el.querySelector('#sn-cv'), ctx=cv.getContext('2d'), scEl=el.querySelector('#sn-sc'), N=15, C=20;
  let snake=[{x:7,y:7}], dir={x:1,y:0}, nd={x:1,y:0}, food={x:11,y:7}, score=0;
  const place=()=>{ do{ food={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)}; }while(snake.some(s=>s.x===food.x&&s.y===food.y)); };
  place();
  const setDir=(x,y)=>{ if(dir.x!==-x||dir.y!==-y) nd={x:x,y:y}; };
  el.querySelectorAll('.sn-b').forEach(b=>b.onclick=()=>{ const d=b.getAttribute('data-d'); if(d==='up')setDir(0,-1); else if(d==='down')setDir(0,1); else if(d==='left')setDir(-1,0); else setDir(1,0); });
  let sx=0, sy=0;
  cv.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; },{passive:true});
  cv.addEventListener('touchend',e=>{ const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy; if(Math.abs(dx)>Math.abs(dy)) setDir(dx>0?1:-1,0); else setDir(0,dy>0?1:-1); },{passive:true});
  const draw=()=>{ ctx.fillStyle='#0b2e1a'; ctx.fillRect(0,0,300,300); ctx.fillStyle='#ff4757'; ctx.beginPath(); ctx.arc(food.x*C+10,food.y*C+10,8,0,7); ctx.fill(); snake.forEach((s,i)=>{ ctx.fillStyle=i?'#2ed573':'#7bed9f'; ctx.fillRect(s.x*C+1,s.y*C+1,C-2,C-2); }); };
  const step=()=>{ if(over) return; dir=nd; const h={x:snake[0].x+dir.x, y:snake[0].y+dir.y};
    const eats=(h.x===food.x&&h.y===food.y), body=eats?snake:snake.slice(0,-1);
    if(h.x<0||h.y<0||h.x>=N||h.y>=N||body.some(s=>s.x===h.x&&s.y===h.y)){ scEl.textContent='Tabrakan! Skor akhir: '+score; finish(Math.min(95, 10+score*8)); return; }
    snake.unshift(h);
    if(eats){ score++; scEl.textContent='Skor: '+score; place(); } else snake.pop();
    draw(); };
  draw(); T.push(setInterval(step,150));
}});

/* 2. Flappy Blok */
RGAMES.push({ id:'flappy', name:'Flappy Blok', emoji:'🐤', hue:45, desc:'Ketuk untuk terbang melewati pipa-pipa.', play(el, api){
  let over=false; const T=[]; let raf=0;
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); cancelAnimationFrame(raf); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<canvas id="fl-cv" width="320" height="400" style="width:100%;max-width:340px;display:block;margin:6px auto;background:#70c5ce;border-radius:10px;touch-action:none"></canvas><div style="text-align:center;color:#fff">Ketuk layar untuk terbang! Skor: <b id="fl-sc">0</b></div>';
  const cv=el.querySelector('#fl-cv'), ctx=cv.getContext('2d'), scEl=el.querySelector('#fl-sc');
  let y=200, v=0, pipes=[], frame=0, score=0, started=false;
  cv.addEventListener('pointerdown',()=>{ if(!over){ started=true; v=-7.5; } });
  const die=()=>{ scEl.textContent=score+' — Jatuh!'; finish(Math.min(95, 12+score*9)); };
  const loop=()=>{ if(over) return;
    if(started){ v+=0.45; y+=v; frame++;
      if(frame%95===0) pipes.push({x:320, top:60+Math.random()*200, passed:false});
      pipes.forEach(p=>{ p.x-=2.6; if(!p.passed&&p.x+52<56){ p.passed=true; score++; scEl.textContent=score; } });
      pipes=pipes.filter(p=>p.x>-60);
      const gap=112;
      if(y<4||y>396) return die();
      for(const p of pipes){ if(56+13>p.x&&56-13<p.x+52&&(y-13<p.top||y+13>p.top+gap)) return die(); }
    }
    ctx.fillStyle='#70c5ce'; ctx.fillRect(0,0,320,400);
    ctx.fillStyle='#2e9e4f'; pipes.forEach(p=>{ ctx.fillRect(p.x,0,52,p.top); ctx.fillRect(p.x,p.top+112,52,400-p.top-112); });
    ctx.fillStyle='#f7d038'; ctx.beginPath(); ctx.arc(56,y,13,0,7); ctx.fill();
    ctx.fillStyle='#e84118'; ctx.beginPath(); ctx.arc(61,y-3,4,0,7); ctx.fill();
    if(!started){ ctx.fillStyle='#fff'; ctx.font='bold 17px sans-serif'; ctx.textAlign='center'; ctx.fillText('KETUK UNTUK MULAI!',160,120); }
    raf=requestAnimationFrame(loop); };
  raf=requestAnimationFrame(loop);
}});

/* 3. 2048 Mini */
RGAMES.push({ id:'g2048', name:'2048 Mini', emoji:'🔢', hue:35, desc:'Geser dan gabungkan ubin sampai 2048!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div id="g8-sc" style="text-align:center;color:#fff;font-weight:bold;margin:4px">Skor: 0</div><div id="g8-grid" style="display:grid;grid-template-columns:repeat(4,64px);gap:6px;justify-content:center;touch-action:none"></div><div style="text-align:center;margin-top:8px"><button data-d="up" class="g8-b">⬆️</button><br><button data-d="left" class="g8-b">⬅️</button><button data-d="down" class="g8-b">⬇️</button><button data-d="right" class="g8-b">➡️</button></div><style>.g8-b{font-size:19px;padding:7px 13px;margin:2px;border:none;border-radius:8px;background:#8f7a66;color:#fff}.g8-c{height:64px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:19px;background:#cdc1b4;color:#776e65}</style>';
  const grid=el.querySelector('#g8-grid'), scEl=el.querySelector('#g8-sc');
  const COL={2:'#eee4da',4:'#ede0c8',8:'#f2b179',16:'#f59563',32:'#f67c5f',64:'#f65e3b',128:'#edcf72',256:'#edcc61',512:'#edc850',1024:'#edc53f',2048:'#edc22e'};
  let b=Array(16).fill(0), score=0;
  const add=()=>{ const e=[]; b.forEach((v,i)=>{ if(!v) e.push(i); }); if(e.length) b[e[Math.floor(Math.random()*e.length)]]=Math.random()<0.9?2:4; };
  const render=()=>{ grid.innerHTML=b.map(v=>'<div class="g8-c" style="background:'+(COL[v]||'#cdc1b4')+';color:'+(v>4?'#fff':'#776e65')+'">'+(v||'')+'</div>').join(''); scEl.textContent='Skor: '+score; };
  const slide=row=>{ const r=row.filter(v=>v); for(let i=0;i<r.length-1;i++){ if(r[i]===r[i+1]){ r[i]*=2; score+=r[i]; r.splice(i+1,1); } } while(r.length<4) r.push(0); return r; };
  const idx=(d,i,j)=> d==='left'?i*4+j : d==='right'?i*4+(3-j) : d==='up'?j*4+i : (3-j)*4+i;
  const move=d=>{ if(over) return; const old=b.join(',');
    for(let i=0;i<4;i++){ let line=[]; for(let j=0;j<4;j++) line.push(b[idx(d,i,j)]); line=slide(line); for(let j=0;j<4;j++) b[idx(d,i,j)]=line[j]; }
    if(b.join(',')!==old){ add(); render(); if(!canMove()){ scEl.textContent='Game over! Skor: '+score; finish(Math.min(100, Math.floor(score/60))); } } };
  const canMove=()=>{ if(b.some(v=>!v)) return true; for(let i=0;i<4;i++) for(let j=0;j<4;j++){ const v=b[i*4+j]; if(j<3&&b[i*4+j+1]===v) return true; if(i<3&&b[(i+1)*4+j]===v) return true; } return false; };
  el.querySelectorAll('.g8-b').forEach(x=>x.onclick=()=>move(x.getAttribute('data-d')));
  let sx=0, sy=0;
  grid.addEventListener('touchstart',e=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; },{passive:true});
  grid.addEventListener('touchend',e=>{ const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy; if(Math.max(Math.abs(dx),Math.abs(dy))<24) return; move(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')); },{passive:true});
  add(); add(); render();
}});

/* 4. Memory Kartu */
RGAMES.push({ id:'memory', name:'Memory Kartu', emoji:'🃏', hue:280, desc:'Temukan semua pasangan kartu emoji.', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div id="mm-sc" style="text-align:center;color:#fff;font-weight:bold;margin:6px">Pasangan: 0/6</div><div id="mm-grid" style="display:grid;grid-template-columns:repeat(4,64px);gap:8px;justify-content:center"></div>';
  const grid=el.querySelector('#mm-grid'), scEl=el.querySelector('#mm-sc');
  const em=['🍎','🚗','🐶','⚽','🌟','🍕'];
  const cards=em.concat(em).map(e=>({e:e,hit:false})).sort(()=>Math.random()-0.5);
  let open=[], matched=0, attempts=0, lock=false;
  const render=()=>{ grid.innerHTML=cards.map((c,i)=>'<button data-i="'+i+'" style="height:64px;font-size:28px;border:none;border-radius:10px;background:'+(c.hit?'#00b06f':(open.indexOf(i)>=0?'#fff':'#576574'))+'">'+((c.hit||open.indexOf(i)>=0)?c.e:'❓')+'</button>').join('');
    grid.querySelectorAll('button').forEach(btn=>btn.onclick=()=>flip(parseInt(btn.getAttribute('data-i'),10))); };
  const flip=i=>{ if(over||lock||cards[i].hit||open.indexOf(i)>=0) return; open.push(i); render();
    if(open.length===2){ attempts++; lock=true; const a=open[0], c=open[1];
      T.push(setTimeout(()=>{ if(cards[a].e===cards[c].e){ cards[a].hit=cards[c].hit=true; matched++; scEl.textContent='Pasangan: '+matched+'/6'; if(matched===6){ render(); finish(Math.max(45, 106-attempts*3)); return; } } open=[]; lock=false; render(); },550)); } };
  render();
}});

/* 5. Tic Tac Toe */
RGAMES.push({ id:'tictactoe', name:'Tic Tac Toe', emoji:'❌', hue:200, desc:'Kamu X, kalahkan bot O!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div id="tt-st" style="text-align:center;color:#fff;font-weight:bold;margin:8px">Giliranmu (X)</div><div id="tt-grid" style="display:grid;grid-template-columns:repeat(3,74px);gap:7px;justify-content:center"></div>';
  const grid=el.querySelector('#tt-grid'), stEl=el.querySelector('#tt-st');
  let b=Array(9).fill(''), turn=true;
  const LINES=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const win=w=>LINES.some(l=>b[l[0]]===w&&b[l[1]]===w&&b[l[2]]===w);
  const render=()=>{ grid.innerHTML=b.map((v,i)=>'<button data-i="'+i+'" style="height:74px;font-size:32px;border:none;border-radius:10px;background:#fff">'+v+'</button>').join('');
    grid.querySelectorAll('button').forEach(btn=>btn.onclick=()=>tap(parseInt(btn.getAttribute('data-i'),10))); };
  const endGame=()=>{ if(win('X')){ stEl.textContent='Kamu MENANG! 🎉'; finish(100); } else if(win('O')){ stEl.textContent='Bot menang. Coba lagi!'; finish(15); } else if(b.every(v=>v)){ stEl.textContent='Seri!'; finish(50); } else return false; return true; };
  const botMove=()=>{ if(over) return; const free=b.map((v,i)=>v?null:i).filter(v=>v!==null); if(!free.length) return;
    const find=w=>{ for(const l of LINES){ const vals=l.map(i=>b[i]); if(vals.filter(x=>x===w).length===2&&vals.indexOf('')>=0) return l[vals.indexOf('')]; } return -1; };
    let m=find('O'); if(m<0) m=find('X'); if(m<0&&b[4]==='') m=4; if(m<0) m=free[Math.floor(Math.random()*free.length)];
    b[m]='O'; render(); if(!endGame()){ turn=true; stEl.textContent='Giliranmu (X)'; } };
  const tap=i=>{ if(over||!turn||b[i]) return; b[i]='X'; turn=false; render(); if(endGame()) return; stEl.textContent='Bot berpikir…'; T.push(setTimeout(botMove,400)); };
  render();
}});

/* 6. Pantul Balok */
RGAMES.push({ id:'breakout', name:'Pantul Balok', emoji:'🧱', hue:0, desc:'Hancurkan semua bata dengan bola pantul.', play(el, api){
  let over=false; const T=[]; let raf=0;
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); cancelAnimationFrame(raf); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<canvas id="bk-cv" width="320" height="400" style="width:100%;max-width:340px;display:block;margin:6px auto;background:#1e272e;border-radius:10px;touch-action:none"></canvas><div id="bk-sc" style="text-align:center;color:#fff;font-weight:bold">Bata: 0/24 • Nyawa: 3</div>';
  const cv=el.querySelector('#bk-cv'), ctx=cv.getContext('2d'), scEl=el.querySelector('#bk-sc');
  const ROWS=4, COLS=6, TOT=ROWS*COLS;
  let bricks=[], broken=0, lives=3, px=128;
  const resetBricks=()=>{ bricks=[]; for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) bricks.push({x:8+c*51, y:36+r*22, w:45, h:15, on:true, hue:r*45+150}); };
  let ball={x:160,y:300,vx:2.6,vy:-3.2};
  const resetBall=()=>{ ball={x:px+32,y:300,vx:(Math.random()<0.5?-2.6:2.6),vy:-3.2}; };
  resetBricks(); resetBall();
  const setPaddle=cx=>{ const r=cv.getBoundingClientRect(); px=Math.max(0,Math.min(320-64,(cx-r.left)*(320/r.width)-32)); };
  cv.addEventListener('pointermove',e=>setPaddle(e.clientX));
  cv.addEventListener('pointerdown',e=>setPaddle(e.clientX));
  const upd=()=>{ scEl.textContent='Bata: '+broken+'/'+TOT+' • Nyawa: '+lives; };
  const loop=()=>{ if(over) return;
    ball.x+=ball.vx; ball.y+=ball.vy;
    if(ball.x<8||ball.x>312) ball.vx*=-1;
    if(ball.y<8) ball.vy*=-1;
    if(ball.vy>0&&ball.y>368&&ball.y<382&&ball.x>px&&ball.x<px+64){ ball.vy=-Math.abs(ball.vy); ball.vx=((ball.x-(px+32))/32)*3.4; }
    if(ball.y>408){ lives--; upd(); if(lives<=0){ finish(Math.round(broken/TOT*90)); return; } resetBall(); }
    for(const br of bricks){ if(br.on&&ball.x>br.x&&ball.x<br.x+br.w&&ball.y>br.y&&ball.y<br.y+br.h){ br.on=false; broken++; ball.vy*=-1; upd(); if(broken>=TOT){ finish(100); return; } break; } }
    ctx.fillStyle='#1e272e'; ctx.fillRect(0,0,320,400);
    bricks.forEach(br=>{ if(br.on){ ctx.fillStyle='hsl('+br.hue+',70%,55%)'; ctx.fillRect(br.x,br.y,br.w,br.h); } });
    ctx.fillStyle='#00d2d3'; ctx.fillRect(px,372,64,10);
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ball.x,ball.y,7,0,7); ctx.fill();
    raf=requestAnimationFrame(loop); };
  upd(); raf=requestAnimationFrame(loop);
}});

/* 7. Blok Jatuh */
RGAMES.push({ id:'blockfall', name:'Blok Jatuh', emoji:'🟦', hue:230, desc:'Susun blok jatuh, lengkapi baris untuk poin!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<canvas id="bf-cv" width="200" height="360" style="display:block;margin:6px auto;background:#111;border-radius:10px"></canvas><div id="bf-sc" style="text-align:center;color:#fff;font-weight:bold">Baris: 0</div><div style="text-align:center;margin-top:4px"><button id="bf-l" class="bf-b">⬅️</button><button id="bf-r" class="bf-b">🔄</button><button id="bf-d" class="bf-b">⬇️</button><button id="bf-r2" class="bf-b">➡️</button></div><style>.bf-b{font-size:19px;padding:7px 13px;margin:2px;border:none;border-radius:8px;background:#2f3542;color:#fff}</style>';
  const cv=el.querySelector('#bf-cv'), ctx=cv.getContext('2d'), scEl=el.querySelector('#bf-sc');
  const W=10, H=18, CZ=20;
  const SHAPES=[[[1,1,1,1]],[[1,1],[1,1]],[[0,1,0],[1,1,1]],[[1,0,0],[1,1,1]],[[0,0,1],[1,1,1]],[[0,1,1],[1,1,0]],[[1,1,0],[0,1,1]]];
  const COLORS=['#00d2d3','#f7d038','#a55eea','#fd9644','#2ed573','#4b7bec','#eb3b5a'];
  let board=Array.from({length:H},()=>Array(W).fill(0)), lines=0, raw=0, cur=null;
  const collide=(m,x,y)=>{ for(let r=0;r<m.length;r++) for(let c=0;c<m[r].length;c++){ if(!m[r][c]) continue; const bx=x+c, by=y+r; if(bx<0||bx>=W||by>=H) return true; if(by>=0&&board[by][bx]) return true; } return false; };
  const spawn=()=>{ const k=Math.floor(Math.random()*SHAPES.length); cur={m:SHAPES[k].map(r=>r.slice()), x:3, y:0, col:COLORS[k]}; if(collide(cur.m,cur.x,cur.y)){ draw(); scEl.textContent='Penuh! Baris: '+lines; finish(Math.min(100, lines*12+Math.floor(raw/50))); } };
  const lock=()=>{ cur.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v&&cur.y+r>=0) board[cur.y+r][cur.x+c]=cur.col; }));
    let cleared=0; board=board.filter(row=>{ if(row.every(v=>v)){ cleared++; return false; } return true; });
    while(board.length<H) board.unshift(Array(W).fill(0));
    if(cleared){ lines+=cleared; raw+=cleared*100; scEl.textContent='Baris: '+lines; } spawn(); };
  const step=()=>{ if(over) return; if(!collide(cur.m,cur.x,cur.y+1)) cur.y++; else lock(); draw(); };
  const draw=()=>{ ctx.fillStyle='#111'; ctx.fillRect(0,0,200,360);
    board.forEach((row,r)=>row.forEach((v,c)=>{ if(v){ ctx.fillStyle=v; ctx.fillRect(c*CZ+1,r*CZ+1,CZ-2,CZ-2); } }));
    if(cur) cur.m.forEach((row,r)=>row.forEach((v,c)=>{ if(v){ ctx.fillStyle=cur.col; ctx.fillRect((cur.x+c)*CZ+1,(cur.y+r)*CZ+1,CZ-2,CZ-2); } })); };
  const mv=(dx)=>{ if(cur&&!collide(cur.m,cur.x+dx,cur.y)){ cur.x+=dx; draw(); } };
  const rot=()=>{ if(!cur) return; const m=cur.m[0].map((_,i)=>cur.m.map(r=>r[i]).reverse()); if(!collide(m,cur.x,cur.y)){ cur.m=m; draw(); } };
  el.querySelector('#bf-l').onclick=()=>mv(-1);
  el.querySelector('#bf-r2').onclick=()=>mv(1);
  el.querySelector('#bf-r').onclick=rot;
  el.querySelector('#bf-d').onclick=()=>{ step(); };
  spawn(); draw(); T.push(setInterval(step,480));
}});

/* 8. Ranjau Mini */
RGAMES.push({ id:'mines', name:'Ranjau Mini', emoji:'💣', hue:210, desc:'Buka semua kotak tanpa menginjak ranjau!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div style="text-align:center;margin:6px"><button id="mn-mode" style="font-size:15px;padding:8px 14px;border:none;border-radius:9px;background:#f39c12;color:#fff;font-weight:bold">Mode: Buka 👆</button><span id="mn-info" style="color:#fff;font-weight:bold;margin-left:10px">Ranjau: 10</span></div><div id="mn-grid" style="display:grid;grid-template-columns:repeat(8,38px);gap:3px;justify-content:center"></div>';
  const grid=el.querySelector('#mn-grid'), modeBtn=el.querySelector('#mn-mode'), info=el.querySelector('#mn-info');
  const N=8, MINES=10, TOT=N*N-MINES;
  let mines=null, cells=[], revealed=0, flagMode=false;
  const placeMines=safe=>{ mines=new Set(); while(mines.size<MINES){ const i=Math.floor(Math.random()*N*N); if(i!==safe) mines.add(i); } };
  const adj=i=>{ const x=i%N, y=Math.floor(i/N); let n=0; for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ const nx=x+dx, ny=y+dy; if(nx>=0&&nx<N&&ny>=0&&ny<N&&mines.has(ny*N+nx)) n++; } return n; };
  const render=()=>{ grid.innerHTML=cells.map((c,i)=>'<button data-i="'+i+'" style="height:38px;font-size:16px;border:none;border-radius:6px;background:'+(c.open?'#dfe6e9':'#636e72')+';color:'+(c.n===1?'#0984e3':c.n===2?'#00b06f':'#d63031')+'">'+(c.open?(c.n||''):(c.flag?'🚩':''))+'</button>').join('');
    grid.querySelectorAll('button').forEach(btn=>btn.onclick=()=>tap(parseInt(btn.getAttribute('data-i'),10))); };
  const reveal=i=>{ const c=cells[i]; if(c.open||c.flag) return; c.open=true; revealed++; c.n=adj(i);
    if(c.n===0){ const x=i%N, y=Math.floor(i/N); for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){ const nx=x+dx, ny=y+dy; if(nx>=0&&nx<N&&ny>=0&&ny<N) reveal(ny*N+nx); } } };
  const tap=i=>{ if(over||cells[i].open) return;
    if(flagMode){ cells[i].flag=!cells[i].flag; render(); return; }
    if(cells[i].flag) return;
    if(!mines) placeMines(i);
    if(mines.has(i)){ cells.forEach((c,j)=>{ if(mines.has(j)){ c.open=true; c.n=0; } }); cells[i].boom=true; render(); grid.children[i].textContent='💥'; info.textContent='Kena ranjau!'; finish(Math.min(60, revealed)); return; }
    reveal(i); render();
    if(revealed>=TOT){ info.textContent='Semua aman! 🎉'; finish(100); } };
  modeBtn.onclick=()=>{ flagMode=!flagMode; modeBtn.textContent=flagMode?'Mode: Bendera 🚩':'Mode: Buka 👆'; };
  for(let i=0;i<N*N;i++) cells.push({open:false,flag:false,n:0});
  render();
}});

/* 9. Gebuk Tikus */
RGAMES.push({ id:'whack', name:'Gebuk Tikus', emoji:'🐭', hue:30, desc:'Gebuk tikus sebanyak-banyaknya dalam 30 detik!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div id="wk-sc" style="text-align:center;color:#fff;font-weight:bold;margin:6px">Sisa: 30 dtk • Gebukan: 0</div><div id="wk-grid" style="display:grid;grid-template-columns:repeat(3,88px);gap:10px;justify-content:center"></div>';
  const grid=el.querySelector('#wk-grid'), scEl=el.querySelector('#wk-sc');
  let hits=0, left=30, active=-1;
  grid.innerHTML=Array.from({length:9},(_,i)=>'<button data-i="'+i+'" style="height:72px;font-size:36px;border:none;border-radius:50%;background:#7f5539">🕳️</button>').join('');
  const cells=Array.prototype.slice.call(grid.querySelectorAll('button'));
  const show=()=>{ cells.forEach((c,i)=>{ c.textContent=(i===active)?'🐭':'🕳️'; }); };
  cells.forEach((c,i)=>c.onclick=()=>{ if(over) return; if(i===active){ hits++; active=-1; show(); scEl.textContent='Sisa: '+left+' dtk • Gebukan: '+hits; } });
  T.push(setInterval(()=>{ if(over) return; active=Math.floor(Math.random()*9); show(); T.push(setTimeout(()=>{ if(active>=0){ active=-1; show(); } },680)); },820));
  T.push(setInterval(()=>{ if(over) return; left--; scEl.textContent='Sisa: '+left+' dtk • Gebukan: '+hits; if(left<=0) finish(Math.min(100, hits*4)); },1000));
}});

/* 10. Refleks Warna */
RGAMES.push({ id:'reflex', name:'Refleks Warna', emoji:'🎨', hue:320, desc:'Ketuk warna yang diminta secepat mungkin!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div id="rf-st" style="text-align:center;color:#fff;font-weight:bold;margin:8px">Nyawa: 3 • Benar: 0</div><div id="rf-target" style="text-align:center;font-size:26px;font-weight:bold;color:#fff"></div><div style="height:12px;background:#444;border-radius:6px;margin:14px auto;max-width:300px"><div id="rf-bar" style="height:12px;width:100%;background:#00b06f;border-radius:6px"></div></div><div id="rf-btns" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:320px;margin:10px auto"></div>';
  const stEl=el.querySelector('#rf-st'), tgEl=el.querySelector('#rf-target'), bar=el.querySelector('#rf-bar'), btns=el.querySelector('#rf-btns');
  const COLORS=[{n:'MERAH',c:'#ff4757'},{n:'BIRU',c:'#3742fa'},{n:'HIJAU',c:'#2ed573'},{n:'KUNING',c:'#ffa502'}];
  let target=0, score=0, lives=3, limit=1800, remain=1800, ticking=false;
  btns.innerHTML=COLORS.map((c,i)=>'<button data-i="'+i+'" style="height:64px;border:none;border-radius:12px;background:'+c.c+';color:#fff;font-size:17px;font-weight:bold">'+c.n+'</button>').join('');
  btns.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{ if(over||!ticking) return; const i=parseInt(btn.getAttribute('data-i'),10);
    if(i===target){ score++; tgEl.textContent='Benar! ✅'; } else { lives--; tgEl.textContent='Salah! ❌'; }
    stEl.textContent='Nyawa: '+lives+' • Benar: '+score;
    if(lives<=0){ finish(Math.min(100, score*6)); return; } next(); });
  const next=()=>{ if(over) return; target=Math.floor(Math.random()*4); limit=Math.max(700, 1800-score*60); remain=limit; ticking=true;
    tgEl.innerHTML='Ketuk: <span style="color:'+COLORS[target].c+'">'+COLORS[target].n+'</span>'; bar.style.width='100%'; };
  T.push(setInterval(()=>{ if(over||!ticking) return; remain-=50; bar.style.width=Math.max(0,remain/limit*100)+'%';
    if(remain<=0){ ticking=false; lives--; stEl.textContent='Nyawa: '+lives+' • Benar: '+score; tgEl.textContent='Waktu habis! ⏰'; if(lives<=0){ finish(Math.min(100, score*6)); return; } T.push(setTimeout(next,500)); } },50));
  next();
}});

/* 11. Matematika Kilat */
RGAMES.push({ id:'mathquiz', name:'Matematika Kilat', emoji:'➗', hue:190, desc:'Jawab 10 soal matematika secepat kilat!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div id="mq-st" style="text-align:center;color:#fff;font-weight:bold;margin:8px">Soal 1/10 • Benar: 0</div><div id="mq-q" style="text-align:center;font-size:38px;font-weight:bold;color:#fff;margin:10px"></div><div id="mq-timer" style="text-align:center;color:#ffd94d;font-size:17px">⏰ 10</div><div id="mq-btns" style="display:flex;gap:10px;justify-content:center;margin-top:16px"></div>';
  const stEl=el.querySelector('#mq-st'), qEl=el.querySelector('#mq-q'), tmEl=el.querySelector('#mq-timer'), btns=el.querySelector('#mq-btns');
  let qn=0, correct=0, ans=0, left=10, timerOn=false;
  const gen=()=>{ const ops=['+','−','×'], op=ops[Math.floor(Math.random()*3)]; let a,b;
    if(op==='×'){ a=2+Math.floor(Math.random()*8); b=2+Math.floor(Math.random()*8); ans=a*b; }
    else if(op==='−'){ a=5+Math.floor(Math.random()*40); b=Math.floor(Math.random()*a); ans=a-b; }
    else { a=Math.floor(Math.random()*50); b=Math.floor(Math.random()*50); ans=a+b; }
    qEl.textContent=a+' '+op+' '+b+' = ?';
    const opts=new Set([ans]); while(opts.size<3){ opts.add(ans+(Math.floor(Math.random()*11)-5||3)); }
    const arr=Array.from(opts).sort(()=>Math.random()-0.5);
    btns.innerHTML=arr.map(v=>'<button data-v="'+v+'" style="font-size:22px;padding:12px 20px;border:none;border-radius:12px;background:#0984e3;color:#fff;font-weight:bold">'+v+'</button>').join('');
    btns.querySelectorAll('button').forEach(btn=>btn.onclick=()=>{ if(over||!timerOn) return; if(parseInt(btn.getAttribute('data-v'),10)===ans) correct++; next(); }); };
  const next=()=>{ qn++; if(qn>=10){ stEl.textContent='Selesai! Benar: '+correct+'/10'; timerOn=false; finish(correct*10); return; }
    stEl.textContent='Soal '+(qn+1)+'/10 • Benar: '+correct; left=10; tmEl.textContent='⏰ 10'; timerOn=true; gen(); };
  T.push(setInterval(()=>{ if(over||!timerOn) return; left--; tmEl.textContent='⏰ '+left; if(left<=0) next(); },1000));
  stEl.textContent='Soal 1/10 • Benar: 0'; timerOn=true; gen();
}});

/* 12. Susun Menara */
RGAMES.push({ id:'stack', name:'Susun Menara', emoji:'🏗️', hue:25, desc:'Ketuk untuk menjatuhkan blok, susun setinggi mungkin!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div id="st-sc" style="text-align:center;color:#fff;font-weight:bold;margin:4px">Tinggi: 0</div><div id="st-stage" style="position:relative;width:320px;height:360px;margin:4px auto;background:#222f3e;border-radius:10px;overflow:hidden;touch-action:none"></div><div style="text-align:center;color:#fff">Ketuk panggung untuk menjatuhkan blok!</div>';
  const stage=el.querySelector('#st-stage'), scEl=el.querySelector('#st-sc');
  const BH=22, MAXLV=16;
  let level=0, perfects=0, prev={x:60,w:200}, cur=null, cx=0, dir=1, speed=2.6;
  const mkBlock=(x,y,w,col)=>{ const d=document.createElement('div'); d.style.cssText='position:absolute;height:'+BH+'px;border-radius:4px;left:'+x+'px;top:'+y+'px;width:'+w+'px;background:'+col; stage.appendChild(d); return d; };
  mkBlock(prev.x, 360-BH, prev.w, '#f39c12');
  const spawn=()=>{ const y=360-BH*(level+2); cur=mkBlock(0, y, prev.w, 'hsl('+((level*37)%360)+',75%,55%)'); cx=0; dir=1; };
  spawn();
  T.push(setInterval(()=>{ if(over||!cur) return; cx+=dir*speed; if(cx<0){ cx=0; dir=1; } if(cx+prev.w>320){ cx=320-prev.w; dir=-1; } cur.style.left=cx+'px'; },16));
  stage.addEventListener('pointerdown',()=>{ if(over||!cur) return;
    const left=Math.max(cx, prev.x), right=Math.min(cx+prev.w, prev.x+prev.w);
    if(right<=left){ cur.style.background='#e84118'; scEl.textContent='Meleset! Tinggi: '+level; finish(Math.min(92, level*8)); return; }
    if(Math.abs(cx-prev.x)<5){ perfects++; cur.style.left=prev.x+'px'; prev={x:prev.x, w:prev.w}; }
    else { cur.style.left=left+'px'; cur.style.width=(right-left)+'px'; prev={x:left, w:right-left}; }
    level++; scEl.textContent='Tinggi: '+level+(perfects?' • Sempurna: '+perfects:'');
    if(level>=MAXLV){ finish(100); return; }
    speed=Math.min(6, speed+0.25); spawn(); });
}});

/* 13. Pelari Blok */
RGAMES.push({ id:'runner', name:'Pelari Blok', emoji:'🏃', hue:160, desc:'Lompat melewati rintangan, lari sejauh mungkin!', play(el, api){
  let over=false; const T=[]; let raf=0;
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); cancelAnimationFrame(raf); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<canvas id="rn-cv" width="340" height="180" style="width:100%;max-width:360px;display:block;margin:8px auto;background:#87ceeb;border-radius:10px;touch-action:none"></canvas><div id="rn-sc" style="text-align:center;color:#fff;font-weight:bold">Jarak: 0 m</div>';
  const cv=el.querySelector('#rn-cv'), ctx=cv.getContext('2d'), scEl=el.querySelector('#rn-sc');
  const GY=150;
  let py=GY-24, vy=0, dist=0, speed=4.2, obs=[], nextIn=60, frame=0;
  const jump=()=>{ if(!over&&py>=GY-24) vy=-12.5; };
  cv.addEventListener('pointerdown', jump);
  const loop=()=>{ if(over) return; frame++;
    vy+=0.75; py+=vy; if(py>GY-24){ py=GY-24; vy=0; }
    dist+=speed/10; speed=Math.min(8, speed+0.0012);
    if(--nextIn<=0){ obs.push({x:350, w:14+Math.random()*12, h:20+Math.random()*16}); nextIn=55+Math.random()*55; }
    obs.forEach(o=>{ o.x-=speed; });
    obs=obs.filter(o=>o.x>-30);
    for(const o of obs){ if(40+20>o.x&&40<o.x+o.w&&py+24>GY-o.h){ scEl.textContent='Nabrak! Jarak: '+Math.floor(dist)+' m'; finish(Math.min(95, Math.floor(dist/16))); return; } }
    scEl.textContent='Jarak: '+Math.floor(dist)+' m';
    if(dist>=1500){ scEl.textContent='FINIS! 🏁'; finish(100); return; }
    ctx.fillStyle='#87ceeb'; ctx.fillRect(0,0,340,180);
    ctx.fillStyle='#2e9e4f'; ctx.fillRect(0,GY,340,30);
    ctx.fillStyle='#e84118'; obs.forEach(o=>ctx.fillRect(o.x, GY-o.h, o.w, o.h));
    ctx.fillStyle='#273c75'; ctx.fillRect(40,py,22,24);
    ctx.fillStyle='#f7d038'; ctx.fillRect(45,py+4,6,6);
    raf=requestAnimationFrame(loop); };
  raf=requestAnimationFrame(loop);
}});

/* 14. Pong Klasik */
RGAMES.push({ id:'pong', name:'Pong Klasik', emoji:'🏓', hue:190, desc:'Pong! Duluan sampai 5 poin menang.', play(el, api){
  let over=false; const T=[]; let raf=0;
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); cancelAnimationFrame(raf); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<canvas id="pg-cv" width="320" height="400" style="width:100%;max-width:340px;display:block;margin:6px auto;background:#111;border-radius:10px;touch-action:none"></canvas><div id="pg-sc" style="text-align:center;color:#fff;font-weight:bold">Kamu 0 — 0 Bot</div>';
  const cv=el.querySelector('#pg-cv'), ctx=cv.getContext('2d'), scEl=el.querySelector('#pg-sc');
  let px=125, bx=160, ps=0, bs=0;
  let ball={x:160,y:200,vx:2.4,vy:3.2};
  const serve=dirn=>{ ball={x:160,y:200,vx:(Math.random()<0.5?-2.4:2.4),vy:3.2*dirn}; };
  const setP=cx=>{ const r=cv.getBoundingClientRect(); px=Math.max(0,Math.min(320-70,(cx-r.left)*(320/r.width)-35)); };
  cv.addEventListener('pointermove',e=>setP(e.clientX));
  cv.addEventListener('pointerdown',e=>setP(e.clientX));
  const upd=()=>{ scEl.textContent='Kamu '+ps+' — '+bs+' Bot'; };
  const loop=()=>{ if(over) return;
    bx+=Math.max(-3.4, Math.min(3.4, (ball.x-(bx+35))*0.14));
    bx=Math.max(0,Math.min(320-70,bx));
    ball.x+=ball.vx; ball.y+=ball.vy;
    if(ball.x<8||ball.x>312) ball.vx*=-1;
    if(ball.vy<0&&ball.y<26&&ball.y>12&&ball.x>bx&&ball.x<bx+70){ ball.vy=Math.abs(ball.vy); ball.vx=((ball.x-(bx+35))/35)*3.2; }
    if(ball.vy>0&&ball.y>374&&ball.y<388&&ball.x>px&&ball.x<px+70){ ball.vy=-Math.abs(ball.vy); ball.vx=((ball.x-(px+35))/35)*3.2; }
    if(ball.y<0){ ps++; upd(); if(ps>=5){ scEl.textContent='Kamu MENANG 5-'+bs+'! 🎉'; finish(100); return; } serve(1); }
    if(ball.y>400){ bs++; upd(); if(bs>=5){ scEl.textContent='Bot menang 5-'+ps; finish(20+ps*12); return; } serve(-1); }
    ctx.fillStyle='#111'; ctx.fillRect(0,0,320,400);
    ctx.strokeStyle='#333'; ctx.beginPath(); ctx.moveTo(0,200); ctx.lineTo(320,200); ctx.stroke();
    ctx.fillStyle='#eb3b5a'; ctx.fillRect(bx,12,70,10);
    ctx.fillStyle='#00d2d3'; ctx.fillRect(px,378,70,10);
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ball.x,ball.y,7,0,7); ctx.fill();
    raf=requestAnimationFrame(loop); };
  raf=requestAnimationFrame(loop);
}});

/* 15. Simon Ingatan */
RGAMES.push({ id:'simon', name:'Simon Ingatan', emoji:'🧠', hue:270, desc:'Ingat dan ulangi urutan warna yang makin panjang!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div id="sm-st" style="text-align:center;color:#fff;font-weight:bold;margin:8px">Perhatikan urutannya…</div><div id="sm-grid" style="display:grid;grid-template-columns:repeat(2,110px);gap:10px;justify-content:center"></div>';
  const grid=el.querySelector('#sm-grid'), stEl=el.querySelector('#sm-st');
  const COLS=['#ff4757','#ffa502','#2ed573','#3742fa'];
  let seq=[], idx=0, accepting=false;
  grid.innerHTML=COLS.map((c,i)=>'<button data-i="'+i+'" style="height:110px;border:none;border-radius:16px;background:'+c+';opacity:0.45"></button>').join('');
  const pads=Array.prototype.slice.call(grid.querySelectorAll('button'));
  const flash=i=>{ pads[i].style.opacity='1'; T.push(setTimeout(()=>{ pads[i].style.opacity='0.45'; },380)); };
  const playSeq=()=>{ accepting=false; stEl.textContent='Perhatikan… Level '+(seq.length); seq.forEach((s,i)=>{ T.push(setTimeout(()=>flash(s), 600+i*620)); });
    T.push(setTimeout(()=>{ accepting=true; idx=0; stEl.textContent='Giliranmu! Level '+seq.length; }, 600+seq.length*620)); };
  const nextRound=()=>{ if(over) return; seq.push(Math.floor(Math.random()*4)); if(seq.length>10){ finish(100); return; } playSeq(); };
  pads.forEach((p,i)=>p.onclick=()=>{ if(over||!accepting) return; flash(i);
    if(i!==seq[idx]){ stEl.textContent='Salah! Sampai level '+seq.length; finish(Math.min(100,(seq.length-1)*11)); return; }
    idx++; if(idx>=seq.length){ accepting=false; stEl.textContent='Betul! 🎉'; if(seq.length>=10){ finish(100); return; } T.push(setTimeout(nextRound,800)); } });
  seq.push(Math.floor(Math.random()*4)); T.push(setTimeout(playSeq,600));
}});

/* 16. Balap Klik */
RGAMES.push({ id:'clickrace', name:'Balap Klik', emoji:'👆', hue:340, desc:'Spam ketuk tombol untuk memenangkan balapan!', play(el, api){
  let over=false; const T=[];
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<div style="max-width:330px;margin:8px auto;color:#fff;font-weight:bold"><div>Kamu 🏃</div><div class="cr-track"><div id="cr-you" class="cr-run">🏃</div></div><div>Bot Kilat 🤖</div><div class="cr-track"><div id="cr-b1" class="cr-run">🤖</div></div><div>Bot Turbo 🤖</div><div class="cr-track"><div id="cr-b2" class="cr-run">🤖</div></div></div><div style="text-align:center"><button id="cr-tap" style="font-size:21px;padding:14px 40px;border:none;border-radius:14px;background:#00b06f;color:#fff;font-weight:bold">TAP! 👆</button></div><style>.cr-track{position:relative;height:30px;background:#3d4852;border-radius:8px;margin:2px 0 8px}.cr-run{position:absolute;top:2px;font-size:22px;left:0}</style>';
  const youEl=el.querySelector('#cr-you'), b1El=el.querySelector('#cr-b1'), b2El=el.querySelector('#cr-b2');
  let you=0, b1=0, b2=0;
  const draw=()=>{ youEl.style.left='calc('+(you*0.92)+'% )'; b1El.style.left='calc('+(b1*0.92)+'% )'; b2El.style.left='calc('+(b2*0.92)+'% )'; };
  el.querySelector('#cr-tap').onclick=()=>{ if(over) return; you+=1.7; draw(); if(you>=100){ you=100; draw(); finish(100); } };
  T.push(setInterval(()=>{ if(over) return; b1+=Math.random()*1.55; b2+=Math.random()*1.45; draw();
    if(b1>=100||b2>=100){ finish(Math.round(Math.min(90, you*0.9))); } },120));
}});

/* 17. Hindari Meteor */
RGAMES.push({ id:'dodge', name:'Hindari Meteor', emoji:'☄️', hue:250, desc:'Geser roket menghindari meteor selama 45 detik!', play(el, api){
  let over=false; const T=[]; let raf=0;
  const finish=p=>{ if(over) return; over=true; T.forEach(id=>{clearInterval(id);clearTimeout(id);}); cancelAnimationFrame(raf); api.end(Math.max(0,Math.min(100,Math.round(p)))); };
  el.innerHTML='<canvas id="dg-cv" width="320" height="400" style="width:100%;max-width:340px;display:block;margin:6px auto;background:#0c0c2e;border-radius:10px;touch-action:none"></canvas><div id="dg-sc" style="text-align:center;color:#fff;font-weight:bold">Bertahan: 0 dtk</div>';
  const cv=el.querySelector('#dg-cv'), ctx=cv.getContext('2d'), scEl=el.querySelector('#dg-sc');
  let px=160, py=355, mets=[], survived=0, frames=0;
  const setP=(cx,cy)=>{ const r=cv.getBoundingClientRect(); px=Math.max(14,Math.min(306,(cx-r.left)*(320/r.width))); if(cy!==null) py=Math.max(300,Math.min(388,(cy-r.top)*(400/r.height))); };
  cv.addEventListener('pointermove',e=>{ if(e.buttons) setP(e.clientX,e.clientY); });
  cv.addEventListener('pointerdown',e=>setP(e.clientX,e.clientY));
  T.push(setInterval(()=>{ if(over) return; mets.push({x:16+Math.random()*288, y:-18, r:8+Math.random()*8, s:2.4+Math.random()*2+survived*0.05}); },430));
  T.push(setInterval(()=>{ if(over) return; survived++; scEl.textContent='Bertahan: '+survived+' dtk'; if(survived>=45){ scEl.textContent='Hebat! Kamu bertahan 45 detik! 🏆'; finish(100); } },1000));
  const loop=()=>{ if(over) return; frames++;
    mets.forEach(m=>{ m.y+=m.s; });
    mets=mets.filter(m=>m.y<430);
    for(const m of mets){ const dx=m.x-px, dy=m.y-py; if(dx*dx+dy*dy<Math.pow(m.r+13,2)){ scEl.textContent='Kena meteor! Bertahan '+survived+' dtk'; finish(Math.min(92, Math.floor(survived*2.1))); return; } }
    ctx.fillStyle='#0c0c2e'; ctx.fillRect(0,0,320,400);
    ctx.fillStyle='#fff'; for(let i=0;i<24;i++){ ctx.fillRect((i*67+frames*0)%320, (i*41)%400, 2, 2); }
    mets.forEach(m=>{ ctx.fillStyle='#e67e22'; ctx.beginPath(); ctx.arc(m.x,m.y,m.r,0,7); ctx.fill(); ctx.fillStyle='#f39c12'; ctx.beginPath(); ctx.arc(m.x,m.y,m.r*0.55,0,7); ctx.fill(); });
    ctx.font='26px sans-serif'; ctx.textAlign='center'; ctx.fillText('🚀', px, py+9);
    raf=requestAnimationFrame(loop); };
  raf=requestAnimationFrame(loop);
}});
