window.RGAMES = window.RGAMES || [];

/* ===== 1. Mancing Mania ===== */
RGAMES.push({ id:'fishing', name:'Mancing Mania', emoji:'🎣', hue:200, desc:'Tekan STOP saat jarum di zona hijau untuk dapat ikan, 8 lemparan.', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div style="text-align:center;color:#fff;padding:14px"><h3>🎣 Mancing Mania</h3><p id="fs-info">Lemparan: 1/8 • Ikan: 0</p><div style="position:relative;height:36px;background:#0d2b45;border-radius:10px;margin:18px 6px;overflow:hidden"><div id="fs-zone" style="position:absolute;top:0;height:100%;background:#2ecc71"></div><div id="fs-pin" style="position:absolute;top:0;width:6px;height:100%;background:#fff"></div></div><div id="fs-msg" style="min-height:26px;font-size:17px">Tekan STOP di zona hijau!</div><button id="fs-btn" style="font-size:18px;padding:12px 30px;border:none;border-radius:10px;background:#e67e22;color:#fff;font-weight:bold">STOP 🎯</button></div>';
  let pos=0, dir=1, casts=0, fish=0, zoneL=30, zoneW=16;
  const zone=el.querySelector('#fs-zone'), pin=el.querySelector('#fs-pin');
  function newZone(){ zoneL=4+Math.random()*72; zoneW=13+Math.random()*9; zone.style.left=zoneL+'%'; zone.style.width=zoneW+'%'; }
  newZone();
  every(()=>{ pos+=dir*2.3; if(pos>=98||pos<=0) dir*=-1; pin.style.left=pos+'%'; },30);
  el.querySelector('#fs-btn').onclick=()=>{ if(done) return; casts++;
    const msg=el.querySelector('#fs-msg');
    if(pos>=zoneL && pos<=zoneL+zoneW){ fish++; msg.textContent='Dapat ikan! 🐟'; } else msg.textContent='Meleset! 😅';
    if(casts>=8){ msg.textContent='Selesai! Ikan didapat: '+fish+'/8 🎉'; fin(fish/8*100); return; }
    el.querySelector('#fs-info').textContent='Lemparan: '+(casts+1)+'/8 • Ikan: '+fish; newZone(); };
}});

/* ===== 2. Letus Balon ===== */
RGAMES.push({ id:'balloon', name:'Letus Balon', emoji:'🎈', hue:340, desc:'Letuskan balon sebanyak-banyaknya dalam 30 detik, jangan sentuh bom!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div id="bl-area" style="position:absolute;inset:0;overflow:hidden"></div><div id="bl-hud" style="position:absolute;top:6px;left:0;right:0;text-align:center;color:#fff;font-weight:bold;z-index:5;pointer-events:none">Skor: 0 • ⏱️ 30</div>';
  const area=el.querySelector('#bl-area');
  let score=0, time=30;
  function hud(){ el.querySelector('#bl-hud').textContent='Skor: '+score+' • ⏱️ '+time; }
  function spawn(){ if(done) return;
    const b=document.createElement('div'); const bomb=Math.random()<0.18;
    b.textContent=bomb?'💣':'🎈';
    b.style.cssText='position:absolute;font-size:'+(42+Math.random()*24)+'px;cursor:pointer;user-select:none;touch-action:none;line-height:1';
    let y=102; b.style.left=(Math.random()*84)+'%'; b.style.top=y+'%'; area.appendChild(b);
    const iv=every(()=>{ y-=1.5; b.style.top=y+'%'; if(y<-16){ b.remove(); clearInterval(iv); } },40);
    b.onpointerdown=e=>{ e.preventDefault(); if(done) return; score=bomb?Math.max(0,score-3):score+1; hud(); b.remove(); clearInterval(iv); }; }
  every(spawn,620); spawn();
  every(()=>{ time--; hud(); if(time<=0) fin(Math.min(100, score*4)); },1000);
}});

/* ===== 3. Puzzle Geser ===== */
RGAMES.push({ id:'slidepuzzle', name:'Puzzle Geser', emoji:'🧩', hue:260, desc:'Geser ubin emoji sampai urutannya benar seperti semula.', play(el, api){
  const em=['🐶','🐱','🦊','🐼','🦁','🐸','🐵','🦄'];
  let tiles=em.concat([null]), blank=8, moves=0, done=false;
  const fin=p=>{if(done)return;done=true;api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div style="text-align:center;color:#fff;padding:12px"><h3>🧩 Puzzle Geser</h3><p id="sp-info">Langkah: 0</p><div id="sp-grid" style="display:grid;grid-template-columns:repeat(3,84px);gap:6px;justify-content:center"></div><p style="margin-top:10px">Klik ubin di sebelah kotak kosong untuk menggeser.<br>Urutan asli: 🐶🐱🦊 / 🐼🦁🐸 / 🐵🦄</p></div>';
  const grid=el.querySelector('#sp-grid');
  for(let k=0;k<90;k++){ const opts=[blank-3,blank+3,blank-1,blank+1].filter(i=>i>=0&&i<9&&Math.abs((i%3)-(blank%3))+Math.abs(((i/3)|0)-((blank/3)|0))===1); const i=opts[(Math.random()*opts.length)|0]; tiles[blank]=tiles[i]; tiles[i]=null; blank=i; }
  function draw(){ grid.innerHTML=''; tiles.forEach((t,i)=>{ const d=document.createElement('button'); d.style.cssText='height:84px;font-size:38px;border:none;border-radius:12px;background:'+(t===null?'rgba(255,255,255,.08)':'#2c3e70'); d.textContent=t||''; d.onclick=()=>slide(i); grid.appendChild(d); }); }
  function slide(i){ if(done) return; const bx=blank%3, by=(blank/3)|0, x=i%3, y=(i/3)|0; if(Math.abs(bx-x)+Math.abs(by-y)!==1) return;
    tiles[blank]=tiles[i]; tiles[i]=null; blank=i; moves++; el.querySelector('#sp-info').textContent='Langkah: '+moves; draw();
    if(tiles[8]===null && tiles.slice(0,8).every((t,j)=>t===em[j])){ el.querySelector('#sp-info').textContent='BERHASIL! 🎉 Langkah: '+moves; fin(Math.max(25, 115-moves)); } }
  draw();
}});

/* ===== 4. Kuis Bendera ===== */
RGAMES.push({ id:'flagquiz', name:'Kuis Bendera', emoji:'🏳️', hue:190, desc:'Tebak nama negara dari emoji benderanya, 10 soal.', play(el, api){
  let done=false; const fin=p=>{if(done)return;done=true;api.end(Math.max(0,Math.min(100,Math.round(p))));};
  const Q=[['🇯🇵','Jepang',['Korea Selatan','China','Thailand']],['🇧🇷','Brasil',['Argentina','Meksiko','Spanyol']],['🇫🇷','Prancis',['Italia','Jerman','Belgia']],['🇮🇩','Indonesia',['Malaysia','Singapura','Filipina']],['🇬🇧','Inggris',['Amerika Serikat','Australia','Kanada']],['🇰🇷','Korea Selatan',['Jepang','China','Vietnam']],['🇮🇹','Italia',['Prancis','Spanyol','Portugal']],['🇦🇺','Australia',['Selandia Baru','Inggris','Afrika Selatan']],['🇪🇬','Mesir',['Turki','Arab Saudi','Maroko']],['🇨🇦','Kanada',['Amerika Serikat','Rusia','Norwegia']]];
  const qs=Q.slice().sort(()=>Math.random()-0.5);
  let qi=0, right=0;
  function ask(){ if(qi>=qs.length){ el.innerHTML='<div style="text-align:center;color:#fff;padding:30px"><h3>🏆 Kuis Selesai!</h3><p style="font-size:20px">Benar: '+right+'/10</p></div>'; fin(right*10); return; }
    const flag=qs[qi][0], c=qs[qi][1], opts=[c].concat(qs[qi][2]).sort(()=>Math.random()-0.5);
    el.innerHTML='<div style="text-align:center;color:#fff;padding:14px"><h3>🏳️ Kuis Bendera '+(qi+1)+'/10</h3><div style="font-size:92px;line-height:1.2">'+flag+'</div><p>Negara apa ini?</p><div id="fq-opts"></div><p>Benar: '+right+'</p></div>';
    const box=el.querySelector('#fq-opts');
    opts.forEach(o=>{ const b=document.createElement('button'); b.textContent=o; b.style.cssText='display:block;width:82%;margin:8px auto;padding:12px;font-size:16px;border:none;border-radius:10px;background:#2c3e70;color:#fff;font-weight:bold;cursor:pointer'; b.onclick=()=>{ if(done) return; if(o===c) right++; qi++; ask(); }; box.appendChild(b); }); }
  ask();
}});

/* ===== 5. Dino Lompat ===== */
RGAMES.push({ id:'dino', name:'Dino Lompat', emoji:'🦖', hue:120, desc:'Bantu dino melompati kaktus sejauh mungkin, tap untuk lompat!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<canvas id="dn-cv" width="360" height="300" style="width:100%;display:block;background:linear-gradient(#8fd3f4,#eaf9ff);border-radius:10px"></canvas><p style="text-align:center;color:#fff;margin:8px">Tap / klik di mana saja untuk lompat! 🦖</p>';
  const cv=el.querySelector('#dn-cv'), ctx=cv.getContext('2d');
  let y=0, vy=0, score=0, frame=0, cacti=[];
  el.onpointerdown=()=>{ if(y<=0) vy=11.5; };
  every(()=>{ frame++; vy-=0.6; y+=vy; if(y<0){ y=0; vy=0; }
    if(frame%85===0) cacti.push(370);
    cacti=cacti.map(x=>x-5).filter(x=>x>-34);
    score+=0.22;
    ctx.clearRect(0,0,360,300);
    ctx.fillStyle='#79c94f'; ctx.fillRect(0,252,360,48);
    ctx.font='38px serif'; ctx.fillText('🦖',28,252-y);
    ctx.font='30px serif'; cacti.forEach(x=>ctx.fillText('🌵',x,252));
    ctx.fillStyle='#123'; ctx.font='bold 16px sans-serif'; ctx.fillText('Skor: '+Math.floor(score),10,22);
    for(const x of cacti){ if(x>16 && x<60 && y<32){ ctx.font='44px serif'; ctx.fillText('💥',28,252-y); fin(Math.min(100, Math.floor(score))); return; } }
  },30);
}});

/* ===== 6. Tangkap Buah ===== */
RGAMES.push({ id:'fruitcatch', name:'Tangkap Buah', emoji:'🧺', hue:90, desc:'Geser keranjang, tangkap buah yang jatuh dan hindari bom!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div id="fc-area" style="position:absolute;inset:0;overflow:hidden"></div><div id="fc-hud" style="position:absolute;top:6px;left:0;right:0;text-align:center;color:#fff;font-weight:bold;z-index:5;pointer-events:none">🍎 0 • ❤️ 3 • ⏱️ 45</div><div id="fc-basket" style="position:absolute;bottom:4px;font-size:46px;z-index:4;line-height:1">🧺</div>';
  const area=el.querySelector('#fc-area'), basket=el.querySelector('#fc-basket');
  const W=()=>el.clientWidth||360, H=()=>el.clientHeight||440;
  let bx=W()/2, caught=0, lives=3, time=45;
  basket.style.left=(bx-24)+'px';
  el.onpointermove=e=>{ const r=el.getBoundingClientRect(); bx=Math.max(24,Math.min(W()-24, e.clientX-r.left)); basket.style.left=(bx-24)+'px'; };
  function hud(){ el.querySelector('#fc-hud').textContent='🍎 '+caught+' • ❤️ '+lives+' • ⏱️ '+time; }
  const FR=['🍎','🍊','🍇','🍓','🍌','🍉'];
  function spawn(){ if(done) return;
    const bomb=Math.random()<0.15, d=document.createElement('div');
    d.textContent=bomb?'💣':FR[(Math.random()*FR.length)|0];
    d.style.cssText='position:absolute;font-size:36px;line-height:1;user-select:none';
    let x=10+Math.random()*(W()-50), y=-40; d.style.left=x+'px'; d.style.top=y+'px'; area.appendChild(d);
    const sp=2.6+Math.random()*1.8;
    const iv=every(()=>{ y+=sp; d.style.top=y+'px';
      if(y>H()-64 && y<H()-16 && Math.abs(x+18-bx)<46){ if(bomb){ lives--; hud(); if(lives<=0){ d.remove(); clearInterval(iv); fin(Math.min(60, caught*2)); return; } } else { caught++; hud(); } d.remove(); clearInterval(iv); }
      else if(y>H()){ d.remove(); clearInterval(iv); } },24); }
  every(spawn,780); spawn();
  every(()=>{ time--; hud(); if(time<=0) fin(Math.min(100, caught*4)); },1000);
}});

/* ===== 7. Batu Gunting Kertas ===== */
RGAMES.push({ id:'rps', name:'Batu Gunting Kertas', emoji:'✊', hue:280, desc:'Lawan bot! Siapa yang duluan menang 5 ronde, dia juaranya.', play(el, api){
  let done=false; const fin=p=>{if(done)return;done=true;api.end(Math.max(0,Math.min(100,Math.round(p))));};
  let me=0, bot=0;
  const EM=['✊','✋','✌️'], NM=['Batu','Kertas','Gunting'];
  el.innerHTML='<div style="text-align:center;color:#fff;padding:16px"><h3>✊ Batu Gunting Kertas</h3><p id="rp-score" style="font-size:19px">Kamu 0 — 0 Bot</p><div id="rp-show" style="font-size:56px;min-height:70px">❓ vs ❓</div><p id="rp-msg">Pilih senjatamu! Menang 5 ronde duluan.</p><div id="rp-btns"></div></div>';
  const box=el.querySelector('#rp-btns');
  EM.forEach((e,i)=>{ const b=document.createElement('button'); b.textContent=e; b.style.cssText='font-size:34px;margin:6px;padding:12px 16px;border:none;border-radius:12px;background:#2c3e70;cursor:pointer'; b.onclick=()=>play(i); box.appendChild(b); });
  function play(i){ if(done) return; const j=(Math.random()*3)|0;
    el.querySelector('#rp-show').textContent=EM[i]+' vs '+EM[j];
    let msg='';
    if(i===j) msg='Seri! '+NM[i]+' lawan '+NM[j]+' 😄';
    else if((i===0&&j===2)||(i===1&&j===0)||(i===2&&j===1)){ me++; msg='Kamu menang ronde ini! 🎉'; }
    else { bot++; msg='Bot menang ronde ini 😅'; }
    el.querySelector('#rp-score').textContent='Kamu '+me+' — '+bot+' Bot';
    if(me>=5){ el.querySelector('#rp-msg').textContent='JUARA! Kamu menang 5 ronde! 🏆'; fin(100); return; }
    if(bot>=5){ el.querySelector('#rp-msg').textContent='Bot juara kali ini. Skor kamu '+me+' ronde.'; fin(me*12); return; }
    el.querySelector('#rp-msg').textContent=msg; }
}});

/* ===== 8. Ketik Cepat ===== */
RGAMES.push({ id:'typing', name:'Ketik Cepat', emoji:'⌨️', hue:170, desc:'Ketik 10 kata yang muncul secepat dan setepat mungkin!', play(el, api){
  const T=[]; let done=false;
  const later=(f,ms)=>{const i=setTimeout(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearTimeout(t);clearInterval(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  const WORDS=['kucing','sekolah','bintang','pelangi','roket','pantai','gunung','sungai','melati','komputer','sepeda','jendela','matahari','bulan','angin','perahu','taman','buku','pensil','awan'];
  const list=WORDS.slice().sort(()=>Math.random()-0.5).slice(0,10);
  let idx=0, right=0, start=Date.now();
  el.innerHTML='<div style="text-align:center;color:#fff;padding:18px"><h3>⌨️ Ketik Cepat</h3><p id="ty-info">Kata 1/10 • Benar: 0</p><div id="ty-word" style="font-size:44px;font-weight:bold;letter-spacing:2px;margin:16px"></div><input id="ty-in" type="text" autocomplete="off" style="font-size:21px;width:230px;text-align:center;padding:10px;border-radius:9px;border:none;text-transform:lowercase"><p style="margin-top:10px">Tekan Enter setelah mengetik ⏎</p></div>';
  const inp=el.querySelector('#ty-in');
  function show(){ el.querySelector('#ty-word').textContent=list[idx]; el.querySelector('#ty-info').textContent='Kata '+(idx+1)+'/10 • Benar: '+right; inp.value=''; inp.focus(); }
  inp.onkeydown=e=>{ if(e.key!=='Enter'||done) return; const v=inp.value.trim().toLowerCase();
    if(v===list[idx]) right++; idx++;
    if(idx>=10){ const sec=Math.round((Date.now()-start)/1000); el.querySelector('#ty-word').textContent='🏁'; el.querySelector('#ty-info').textContent='Selesai! Benar '+right+'/10 dalam '+sec+' detik';
      let pts=right*8; if(right>0) pts+= sec<=35?20:(sec<=60?12:5); fin(pts); return; }
    show(); };
  show();
  later(()=>inp.focus(),100);
}});

/* ===== 9. Labirin Kecil ===== */
RGAMES.push({ id:'maze', name:'Labirin Kecil', emoji:'🌀', hue:230, desc:'Lewati labirin dan capai pintu keluar secepat mungkin!', play(el, api){
  const T=[]; let done=false, keyH=null;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});if(keyH)document.removeEventListener('keydown',keyH);api.end(Math.max(0,Math.min(100,Math.round(p))));};
  const N=9, S=2*N+1;
  const g=[]; for(let y=0;y<S;y++){ g.push([]); for(let x=0;x<S;x++) g[y].push(1); }
  const stack=[[1,1]]; g[1][1]=0;
  while(stack.length){ const cur=stack[stack.length-1], cx=cur[0], cy=cur[1];
    const dirs=[[2,0],[-2,0],[0,2],[0,-2]].filter(d=>{ const nx=cx+d[0], ny=cy+d[1]; return nx>0&&ny>0&&nx<S-1&&ny<S-1&&g[ny][nx]===1; });
    if(!dirs.length){ stack.pop(); continue; }
    const d=dirs[(Math.random()*dirs.length)|0], nx=cx+d[0], ny=cy+d[1];
    g[cy+d[1]/2][cx+d[0]/2]=0; g[ny][nx]=0; stack.push([nx,ny]); }
  let px=1, py=1, sec=0;
  el.innerHTML='<div style="text-align:center;color:#fff;padding:8px"><p id="mz-info" style="margin:4px">⏱️ 0 detik • Capai 🚪!</p><div id="mz-grid" style="display:grid;grid-template-columns:repeat(19,19px);gap:0;justify-content:center"></div><div style="margin-top:8px"><button data-d="up" style="font-size:19px;padding:8px 15px;margin:2px;border:none;border-radius:8px;background:#2c3e70;color:#fff">⬆️</button><br><button data-d="left" style="font-size:19px;padding:8px 15px;margin:2px;border:none;border-radius:8px;background:#2c3e70;color:#fff">⬅️</button><button data-d="down" style="font-size:19px;padding:8px 15px;margin:2px;border:none;border-radius:8px;background:#2c3e70;color:#fff">⬇️</button><button data-d="right" style="font-size:19px;padding:8px 15px;margin:2px;border:none;border-radius:8px;background:#2c3e70;color:#fff">➡️</button></div></div>';
  const grid=el.querySelector('#mz-grid');
  function draw(){ let h=''; for(let y=0;y<S;y++) for(let x=0;x<S;x++){ let bg='#26324f', tx='';
      if(g[y][x]===0) bg='#aebfe8';
      if(x===S-2&&y===S-2){ tx='🚪'; bg='#7be495'; }
      if(x===px&&y===py){ tx='😃'; bg='#ffd94d'; }
      h+='<div style="width:19px;height:19px;background:'+bg+';font-size:13px;line-height:19px;text-align:center">'+tx+'</div>'; }
    grid.innerHTML=h; }
  function move(dx,dy){ if(done) return; const nx=px+dx, ny=py+dy; if(nx<0||ny<0||nx>=S||ny>=S||g[ny][nx]===1) return; px=nx; py=ny; draw();
    if(px===S-2&&py===S-2){ el.querySelector('#mz-info').textContent='BERHASIL KELUAR! 🎉 Waktu: '+sec+' detik'; fin(Math.max(20, 120-sec*2)); } }
  el.querySelectorAll('button[data-d]').forEach(b=>{ b.onclick=()=>{ const d=b.getAttribute('data-d'); move(d==='left'?-1:d==='right'?1:0, d==='up'?-1:d==='down'?1:0); }; });
  keyH=e=>{ const k=e.key; if(k==='ArrowUp')move(0,-1); else if(k==='ArrowDown')move(0,1); else if(k==='ArrowLeft')move(-1,0); else if(k==='ArrowRight')move(1,0); };
  document.addEventListener('keydown',keyH);
  every(()=>{ sec++; if(!done) el.querySelector('#mz-info').textContent='⏱️ '+sec+' detik • Capai 🚪!'; },1000);
  draw();
}});

/* ===== 10. Panah Target ===== */
RGAMES.push({ id:'archery', name:'Panah Target', emoji:'🏹', hue:20, desc:'Hentikan pengukur kekuatan di zona pas, 8 panah untuk skor tertinggi!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div style="text-align:center;color:#fff;padding:12px"><h3>🏹 Panah Target</h3><p id="ar-info">Panah: 1/8 • Skor: 0</p><div id="ar-target" style="position:relative;width:210px;height:210px;margin:8px auto;border-radius:50%;background:radial-gradient(circle,#fff 0 18%,#e33 18% 38%,#fff 38% 58%,#39f 58% 78%,#fff 78% 100%);border:4px solid #6b4a1f"></div><div style="position:relative;height:26px;background:#0d2b45;border-radius:8px;margin:10px 20px;overflow:hidden"><div id="ar-zone" style="position:absolute;top:0;height:100%;background:#2ecc71"></div><div id="ar-pin" style="position:absolute;top:0;width:5px;height:100%;background:#fff"></div></div><button id="ar-btn" style="font-size:18px;padding:11px 28px;border:none;border-radius:10px;background:#e67e22;color:#fff;font-weight:bold">TEMBAK 🏹</button></div>';
  let pos=0, dir=1, arrows=0, total=0, zL=40, zW=16;
  const zone=el.querySelector('#ar-zone'), pin=el.querySelector('#ar-pin'), target=el.querySelector('#ar-target');
  function newZone(){ zL=8+Math.random()*76; zW=12+Math.random()*8; zone.style.left=zL+'%'; zone.style.width=zW+'%'; }
  newZone();
  every(()=>{ pos+=dir*2.6; if(pos>=98||pos<=0) dir*=-1; pin.style.left=pos+'%'; },28);
  el.querySelector('#ar-btn').onclick=()=>{ if(done) return;
    const center=zL+zW/2, dist=Math.abs(pos-center);
    const pts=Math.max(0, Math.round(100-dist*3.2)); total+=pts; arrows++;
    const ang=Math.random()*Math.PI*2, r=Math.min(98, dist*2.4);
    const m=document.createElement('div'); m.textContent='📍';
    m.style.cssText='position:absolute;font-size:17px;left:'+(105+Math.cos(ang)*r-8)+'px;top:'+(105+Math.sin(ang)*r-10)+'px';
    target.appendChild(m);
    if(arrows>=8){ el.querySelector('#ar-info').textContent='Selesai! Total skor: '+total; fin(total/8); return; }
    el.querySelector('#ar-info').textContent='Panah: '+(arrows+1)+'/8 • Skor: '+total+' (panah ini +'+pts+')'; newZone(); };
}});

/* ===== 11. Potong Buah ===== */
RGAMES.push({ id:'fruitslice', name:'Potong Buah', emoji:'🍉', hue:350, desc:'Tap buah yang beterbangan untuk memotongnya, jangan kena bom!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div id="sl-area" style="position:absolute;inset:0;overflow:hidden"></div><div id="sl-hud" style="position:absolute;top:6px;left:0;right:0;text-align:center;color:#fff;font-weight:bold;z-index:5;pointer-events:none">🔪 Terpotong: 0 • ⏱️ 45</div>';
  const area=el.querySelector('#sl-area');
  const W=()=>el.clientWidth||360, H=()=>el.clientHeight||440;
  let cut=0, time=45;
  function hud(){ el.querySelector('#sl-hud').textContent='🔪 Terpotong: '+cut+' • ⏱️ '+time; }
  const FR=['🍉','🍍','🍎','🍊','🥝','🍑','🍓'];
  function spawn(){ if(done) return;
    const bomb=Math.random()<0.16, d=document.createElement('div');
    d.textContent=bomb?'💣':FR[(Math.random()*FR.length)|0];
    d.style.cssText='position:absolute;font-size:42px;line-height:1;user-select:none;cursor:pointer;touch-action:none;z-index:3';
    let x=20+Math.random()*(W()-70), y=H()+10, vy=-(12+Math.random()*3.5), vx=(Math.random()-0.5)*2.2;
    d.style.left=x+'px'; d.style.top=y+'px'; area.appendChild(d);
    const iv=every(()=>{ vy+=0.38; y+=vy; x+=vx; d.style.top=y+'px'; d.style.left=x+'px';
      if(y>H()+60){ d.remove(); clearInterval(iv); } },30);
    d.onpointerdown=e=>{ e.preventDefault(); if(done) return;
      if(bomb){ cut=Math.max(0,cut-3); d.textContent='💥'; }
      else { cut++; d.textContent='✨'; }
      hud(); clearInterval(iv); setTimeout(()=>d.remove(),120); }; }
  every(spawn,700); spawn();
  every(()=>{ time--; hud(); if(time<=0) fin(Math.min(100, cut*3)); },1000);
}});

/* ===== 12. Balap Dadu ===== */
RGAMES.push({ id:'dicerace', name:'Balap Dadu', emoji:'🎲', hue:45, desc:'Lempar dadu dan balapan sampai petak 30 melawan bot!', play(el, api){
  const T=[]; let done=false;
  const later=(f,ms)=>{const i=setTimeout(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearTimeout(t);clearInterval(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  let me=0, bot=0, busy=false;
  el.innerHTML='<div style="color:#fff;padding:16px"><h3 style="text-align:center">🎲 Balap Dadu ke 30</h3><p>🧑 Kamu: <b id="dr-me">0</b>/30</p><div style="height:20px;background:#223;border-radius:10px;overflow:hidden"><div id="dr-mebar" style="height:100%;width:0%;background:#2ecc71"></div></div><p style="margin-top:12px">🤖 Bot: <b id="dr-bot">0</b>/30</p><div style="height:20px;background:#223;border-radius:10px;overflow:hidden"><div id="dr-botbar" style="height:100%;width:0%;background:#e74c3c"></div></div><div id="dr-dice" style="text-align:center;font-size:54px;margin:14px">🎲</div><p id="dr-msg" style="text-align:center">Giliranmu! Tekan tombolnya.</p><div style="text-align:center"><button id="dr-btn" style="font-size:18px;padding:12px 26px;border:none;border-radius:10px;background:#f39c12;color:#fff;font-weight:bold">LEMPAR DADU 🎲</button></div></div>';
  const DICE=['⚀','⚁','⚂','⚃','⚄','⚅'];
  function draw(){ el.querySelector('#dr-me').textContent=me; el.querySelector('#dr-bot').textContent=bot;
    el.querySelector('#dr-mebar').style.width=(me/30*100)+'%'; el.querySelector('#dr-botbar').style.width=(bot/30*100)+'%'; }
  function roll(who){ const v=1+((Math.random()*6)|0); el.querySelector('#dr-dice').textContent=DICE[v-1];
    if(who==='me') me=Math.min(30,me+v); else bot=Math.min(30,bot+v); draw(); return v; }
  el.querySelector('#dr-btn').onclick=()=>{ if(done||busy) return; busy=true;
    const v=roll('me'); el.querySelector('#dr-msg').textContent='Kamu dapat '+v+'! Sekarang giliran bot…';
    if(me>=30){ el.querySelector('#dr-msg').textContent='MENANG! Kamu sampai duluan! 🏆'; fin(100); return; }
    later(()=>{ if(done) return; const bv=roll('bot');
      if(bot>=30){ el.querySelector('#dr-msg').textContent='Bot sampai duluan 😅 Kamu di petak '+me+'.'; fin(Math.round(me/30*70)); return; }
      el.querySelector('#dr-msg').textContent='Bot dapat '+bv+'. Giliranmu lagi!'; busy=false; },900); };
}});

/* ===== 13. Tembak Zombie ===== */
RGAMES.push({ id:'zombie', name:'Tembak Zombie', emoji:'🧟', hue:100, desc:'Tap zombie yang muncul untuk menembaknya, jangan tembak warga!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const later=(f,ms)=>{const i=setTimeout(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div style="text-align:center;color:#fff;padding:12px"><h3>🧟 Tembak Zombie</h3><p id="zb-hud">🎯 Kena: 0 • ⏱️ 45</p><div id="zb-grid" style="display:grid;grid-template-columns:repeat(3,92px);gap:8px;justify-content:center"></div><p style="margin-top:8px">🧟 tembak! 🧑 jangan ditembak ya!</p></div>';
  const grid=el.querySelector('#zb-grid');
  let hits=0, time=45;
  const cells=[];
  for(let i=0;i<9;i++){ const c=document.createElement('button'); c.textContent='🚪'; c.dataset.type='';
    c.style.cssText='height:92px;font-size:44px;border:none;border-radius:12px;background:#2c3e70;cursor:pointer';
    c.onclick=()=>{ if(done||!c.dataset.type) return;
      if(c.dataset.type==='z'){ hits++; c.textContent='💥'; }
      else { hits=Math.max(0,hits-2); c.textContent='😱'; }
      c.dataset.type=''; hud();
      later(()=>{ if(c.textContent==='💥'||c.textContent==='😱') c.textContent='🚪'; },220); };
    grid.appendChild(c); cells.push(c); }
  function hud(){ el.querySelector('#zb-hud').textContent='🎯 Kena: '+hits+' • ⏱️ '+time; }
  function spawn(){ if(done) return;
    const free=cells.filter(c=>!c.dataset.type); if(!free.length) return;
    const c=free[(Math.random()*free.length)|0], z=Math.random()<0.74;
    c.dataset.type=z?'z':'p'; c.textContent=z?'🧟':'🧑';
    later(()=>{ if(c.dataset.type){ c.dataset.type=''; c.textContent='🚪'; } },850); }
  every(spawn,880); spawn();
  every(()=>{ time--; hud(); if(time<=0) fin(Math.min(100, hits*3)); },1000);
}});

/* ===== 14. Parkir Mobil ===== */
RGAMES.push({ id:'parking', name:'Parkir Mobil', emoji:'🚗', hue:210, desc:'Tap STOP agar mobil berhenti tepat di zona parkir, 6 level makin cepat!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const later=(f,ms)=>{const i=setTimeout(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div style="color:#fff;padding:14px;text-align:center"><h3>🅿️ Parkir Mobil</h3><p id="pk-info">Level 1/6 • Skor: 0</p><div id="pk-road" style="position:relative;height:120px;background:#39424f;border-radius:12px;margin:16px 4px;overflow:hidden"><div style="position:absolute;left:0;right:0;top:58px;border-top:4px dashed #ffd94d"></div><div id="pk-zone" style="position:absolute;top:14px;height:92px;background:rgba(46,204,113,.45);border:3px solid #2ecc71;border-radius:8px"></div><div id="pk-car" style="position:absolute;top:34px;font-size:52px;line-height:1">🚗</div></div><p id="pk-msg" style="min-height:24px">Mobil melaju… tap STOP di zona hijau!</p><button id="pk-btn" style="font-size:19px;padding:12px 34px;border:none;border-radius:10px;background:#e74c3c;color:#fff;font-weight:bold">STOP ✋</button></div>';
  const road=el.querySelector('#pk-road'), car=el.querySelector('#pk-car'), zone=el.querySelector('#pk-zone');
  let level=0, total=0, x=-70, zL=0, running=false;
  const RW=()=>road.clientWidth||340;
  function startLevel(){ level++; x=-70; running=true;
    zL=90+Math.random()*(RW()-190); zone.style.left=zL+'px'; zone.style.width='76px';
    el.querySelector('#pk-info').textContent='Level '+level+'/6 • Skor: '+total;
    el.querySelector('#pk-msg').textContent='Mobil melaju… tap STOP di zona hijau!'; }
  const iv=every(()=>{ if(!running||done) return; x+=2.4+level*0.85; car.style.left=x+'px';
    if(x>RW()+10){ running=false; el.querySelector('#pk-msg').textContent='Kelewatan! Tidak parkir 😅';
      if(level>=6) fin(total/6); else later(startLevel,900); } },20);
  el.querySelector('#pk-btn').onclick=()=>{ if(!running||done) return; running=false;
    const center=x+30, zc=zL+38, d=Math.abs(center-zc);
    const pts=d<=16?100:(d<=38?70:(d<=60?40:10)); total+=pts;
    el.querySelector('#pk-msg').textContent=(d<=16?'SEMPURNA! 🎉':(d<=60?'Lumayan! 👍':'Meleset jauh 😅'))+' +'+pts+' poin';
    el.querySelector('#pk-info').textContent='Level '+level+'/6 • Skor: '+total;
    if(level>=6) fin(total/6); else later(startLevel,1000); };
  startLevel();
}});

/* ===== 15. Hoki Udara ===== */
RGAMES.push({ id:'airhockey', name:'Hoki Udara', emoji:'🏒', hue:195, desc:'Geser paddle-mu, cetak gol ke bot! Pertama sampai 5 gol menang.', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<canvas id="ah-cv" width="340" height="400" style="width:100%;display:block;background:#0e3a5c;border-radius:10px"></canvas><p style="text-align:center;color:#fff;margin:6px">Geser jarimu untuk menggerakkan paddle bawah 🔵</p>';
  const cv=el.querySelector('#ah-cv'), ctx=cv.getContext('2d');
  const Wd=340, Ht=400;
  let px=Wd/2, bx=Wd/2, puck={x:Wd/2,y:Ht/2,vx:2.4,vy:3.2}, my=0, botg=0;
  el.onpointermove=e=>{ const r=cv.getBoundingClientRect(); px=Math.max(28,Math.min(Wd-28,(e.clientX-r.left)*Wd/r.width)); };
  function reset(dir){ puck={x:Wd/2,y:Ht/2,vx:(Math.random()<0.5?-2.4:2.4),vy:3.2*dir}; }
  every(()=>{ if(done) return;
    puck.x+=puck.vx; puck.y+=puck.vy;
    if(puck.x<12){ puck.x=12; puck.vx*=-1; } if(puck.x>Wd-12){ puck.x=Wd-12; puck.vx*=-1; }
    bx+=Math.max(-3.4,Math.min(3.4,(puck.x-bx)*0.09)); bx=Math.max(28,Math.min(Wd-28,bx));
    if(puck.y<44 && puck.y>14 && Math.abs(puck.x-bx)<40 && puck.vy<0){ puck.vy=Math.abs(puck.vy)*1.04; puck.vx+=(puck.x-bx)*0.06; }
    if(puck.y>Ht-44 && puck.y<Ht-14 && Math.abs(puck.x-px)<40 && puck.vy>0){ puck.vy=-Math.abs(puck.vy)*1.04; puck.vx+=(puck.x-px)*0.06; }
    puck.vx=Math.max(-6,Math.min(6,puck.vx)); puck.vy=Math.max(-6.5,Math.min(6.5,puck.vy||3));
    if(puck.y<-14){ my++; if(my>=5){ draw(); fin(100); return; } reset(1); }
    else if(puck.y>Ht+14){ botg++; if(botg>=5){ draw(); fin(my*15+10); return; } reset(-1); }
    draw();
  },16);
  function draw(){ ctx.clearRect(0,0,Wd,Ht);
    ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,Ht/2); ctx.lineTo(Wd,Ht/2); ctx.stroke();
    ctx.fillStyle='#ffd94d'; ctx.fillRect(Wd/2-45,0,90,8); ctx.fillRect(Wd/2-45,Ht-8,90,8);
    ctx.fillStyle='#e74c3c'; ctx.beginPath(); ctx.arc(bx,26,24,0,7); ctx.fill();
    ctx.fillStyle='#3498db'; ctx.beginPath(); ctx.arc(px,Ht-26,24,0,7); ctx.fill();
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(puck.x,puck.y,11,0,7); ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='bold 17px sans-serif'; ctx.fillText('🤖 '+botg,10,24); ctx.fillText('🧑 '+my,10,Ht-14); }
  draw();
}});

/* ===== 16. Golf Mini ===== */
RGAMES.push({ id:'golf', name:'Golf Mini', emoji:'⛳', hue:130, desc:'Atur arah dan kekuatan, masukkan bola dalam maks 5 pukulan per hole!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<canvas id="gf-cv" width="340" height="330" style="width:100%;display:block;background:#3da33d;border-radius:10px"></canvas><p id="gf-info" style="text-align:center;color:#fff;margin:6px">Hole 1/3 • Pukulan: 0</p><div style="text-align:center"><button id="gf-btn" style="font-size:17px;padding:11px 24px;border:none;border-radius:10px;background:#f39c12;color:#fff;font-weight:bold">KUNCI ARAH 🎯</button></div>';
  const cv=el.querySelector('#gf-cv'), ctx=cv.getContext('2d');
  const Wd=340, Ht=330;
  let hole=0, strokes=0, totalPts=0, phase='aim', ang=45, angDir=1, pow=0, powDir=1;
  let ball={x:40,y:Ht-40}, holePos={x:280,y:70}, moving=null;
  function newHole(){ hole++; strokes=0; phase='aim'; ball={x:34+Math.random()*40,y:Ht-34-Math.random()*30};
    holePos={x:200+Math.random()*110, y:40+Math.random()*110};
    el.querySelector('#gf-btn').textContent='KUNCI ARAH 🎯'; info(); draw(); }
  function info(){ el.querySelector('#gf-info').textContent='Hole '+hole+'/3 • Pukulan: '+strokes+'/5'; }
  function draw(){ ctx.clearRect(0,0,Wd,Ht);
    ctx.fillStyle='#2f8f2f'; for(let i=0;i<6;i++) ctx.fillRect(i*60,0,30,Ht);
    ctx.fillStyle='#111'; ctx.beginPath(); ctx.arc(holePos.x,holePos.y,11,0,7); ctx.fill();
    ctx.font='24px serif'; ctx.fillText('🚩',holePos.x+6,holePos.y-8);
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ball.x,ball.y,8,0,7); ctx.fill();
    ctx.strokeStyle='#333'; ctx.stroke();
    if(phase==='aim'&&!moving){ ctx.strokeStyle='#ffd94d'; ctx.lineWidth=3; ctx.beginPath(); ctx.moveTo(ball.x,ball.y);
      ctx.lineTo(ball.x+Math.cos(ang*Math.PI/180)*52, ball.y-Math.sin(ang*Math.PI/180)*52); ctx.stroke(); }
    if(phase==='power'&&!moving){ ctx.fillStyle='#e74c3c'; ctx.fillRect(10,Ht-16,pow*1.4,9); ctx.fillStyle='#fff'; ctx.font='11px sans-serif'; ctx.fillText('Kekuatan',10,Ht-20); } }
  every(()=>{ if(done) return;
    if(moving){ ball.x+=moving.vx; ball.y+=moving.vy; moving.vx*=0.955; moving.vy*=0.955;
      if(ball.x<8){ ball.x=8; moving.vx*=-0.7; } if(ball.x>Wd-8){ ball.x=Wd-8; moving.vx*=-0.7; }
      if(ball.y<8){ ball.y=8; moving.vy*=-0.7; } if(ball.y>Ht-8){ ball.y=Ht-8; moving.vy*=-0.7; }
      const d=Math.hypot(ball.x-holePos.x,ball.y-holePos.y), sp=Math.hypot(moving.vx,moving.vy);
      if(d<13 && sp<4.2){ moving=null; holeDone(true); }
      else if(sp<0.35){ moving=null; if(strokes>=5) holeDone(false); else { phase='aim'; el.querySelector('#gf-btn').textContent='KUNCI ARAH 🎯'; } }
      draw(); return; }
    if(phase==='aim'){ ang+=angDir*1.6; if(ang>=82||ang<=8) angDir*=-1; draw(); }
    else if(phase==='power'){ pow+=powDir*2.6; if(pow>=100||pow<=0) powDir*=-1; draw(); } },24);
  function holeDone(success){ const pts=success?[100,85,70,55,40][strokes-1]||40:10; totalPts+=pts;
    el.querySelector('#gf-info').textContent=(success?'MASUK dalam '+strokes+' pukulan! 🎉':'Gagal masuk di hole ini 😅')+' +'+pts+' poin';
    if(hole>=3){ fin(totalPts/3); return; }
    const iv=setTimeout(()=>{ if(!done) newHole(); },1300); T.push(iv); }
  el.querySelector('#gf-btn').onclick=()=>{ if(done||moving) return;
    if(phase==='aim'){ phase='power'; pow=0; el.querySelector('#gf-btn').textContent='PUKUL! ⛳'; }
    else if(phase==='power'){ strokes++; info();
      const sp=pow/100*9.5+1, rad=ang*Math.PI/180;
      moving={vx:Math.cos(rad)*sp, vy:-Math.sin(rad)*sp}; phase='aim'; } };
  newHole();
}});

/* ===== 17. Bowling Ketuk ===== */
RGAMES.push({ id:'bowling', name:'Bowling Ketuk', emoji:'🎳', hue:250, desc:'Kunci arah dan kekuatan lemparan, jatuhkan pin sebanyak mungkin dalam 5 giliran!', play(el, api){
  const T=[]; let done=false;
  const every=(f,ms)=>{const i=setInterval(f,ms);T.push(i);return i;};
  const later=(f,ms)=>{const i=setTimeout(f,ms);T.push(i);return i;};
  const fin=p=>{if(done)return;done=true;T.forEach(t=>{clearInterval(t);clearTimeout(t);});api.end(Math.max(0,Math.min(100,Math.round(p))));};
  el.innerHTML='<div style="text-align:center;color:#fff;padding:12px"><h3>🎳 Bowling Ketuk</h3><p id="bw-info">Giliran 1/5 • Total pin: 0</p><div id="bw-pins" style="font-size:30px;min-height:88px;line-height:1.25"></div><div id="bw-meterlbl" style="min-height:22px">Tahap 1: kunci ARAH lemparan</div><div style="position:relative;height:24px;background:#0d2b45;border-radius:8px;margin:8px 26px;overflow:hidden"><div id="bw-band" style="position:absolute;top:0;height:100%;background:rgba(46,204,113,.5)"></div><div id="bw-pin" style="position:absolute;top:0;width:5px;height:100%;background:#fff"></div></div><button id="bw-btn" style="font-size:18px;padding:11px 28px;border:none;border-radius:10px;background:#9b59b6;color:#fff;font-weight:bold">KUNCI 🎯</button></div>';
  const pinEl=el.querySelector('#bw-pin'), band=el.querySelector('#bw-band');
  let turn=0, total=0, phase='aim', pos=0, dir=1, aimPos=50;
  function drawPins(n){ const rows=[1,2,3,4]; let left=n, h='';
    rows.forEach(r=>{ let s=''; for(let i=0;i<r;i++){ if(left>0){ s+='🎳'; left--; } else s+='·'; } h+=s+'<br>'; });
    el.querySelector('#bw-pins').innerHTML=h; }
  function setBand(){ if(phase==='aim'){ band.style.left='42%'; band.style.width='16%'; } else { band.style.left='55%'; band.style.width='45%'; } }
  function newTurn(){ turn++; phase='aim'; pos=0; setBand(); drawPins(10);
    el.querySelector('#bw-info').textContent='Giliran '+turn+'/5 • Total pin: '+total;
    el.querySelector('#bw-meterlbl').textContent='Tahap 1: kunci ARAH lemparan';
    el.querySelector('#bw-btn').textContent='KUNCI 🎯'; }
  every(()=>{ pos+=dir*(phase==='aim'?2.6:3.2); if(pos>=98||pos<=0) dir*=-1; pinEl.style.left=pos+'%'; },26);
  el.querySelector('#bw-btn').onclick=()=>{ if(done) return;
    if(phase==='aim'){ aimPos=pos; phase='power'; setBand();
      el.querySelector('#bw-meterlbl').textContent='Tahap 2: kunci KEKUATAN (makin kanan makin kuat)';
      el.querySelector('#bw-btn').textContent='LEMPAR 🎳'; return; }
    const q=Math.max(0, 1-Math.abs(aimPos-50)/46);
    let pins=Math.round(q*10*(0.45+pos/100*0.62)); pins=Math.max(0,Math.min(10,pins));
    total+=pins; drawPins(10-pins);
    el.querySelector('#bw-meterlbl').textContent='Pin jatuh: '+pins+'! 🎳';
    el.querySelector('#bw-info').textContent='Giliran '+turn+'/5 • Total pin: '+total;
    if(turn>=5) fin(total/50*100); else later(newTurn,1100); };
  newTurn();
}});
