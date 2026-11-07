window.RGAMES = window.RGAMES || [];

/* 1. Menara Hanoi */
RGAMES.push({ id:'hanoi', name:'Menara Hanoi', emoji:'🗼', hue:280, desc:'Pindahkan semua cakram ke tiang kanan dengan langkah sesedikit mungkin.', play(el, api){
  let pegs=[[3,2,1],[],[]], sel=-1, moves=0, done=false;
  el.innerHTML='<div style="padding:14px;color:#fff;text-align:center"><h3>🗼 Menara Hanoi</h3><p id="hn-info">Langkah: 0 • Ketuk tiang untuk mengambil, ketuk tiang lain untuk menaruh</p><div id="hn-board" style="display:flex;gap:10px;justify-content:center;align-items:stretch;height:240px"></div></div>';
  const board=el.querySelector('#hn-board'), info=el.querySelector('#hn-info');
  function render(){
    board.innerHTML='';
    pegs.forEach((peg,i)=>{
      const col=document.createElement('div');
      col.style.cssText='flex:1;display:flex;flex-direction:column-reverse;align-items:center;gap:5px;background:rgba(255,255,255,.07);border-radius:12px;padding:10px 4px;cursor:pointer'+(sel===i?';outline:3px solid #ffd93d':'');
      const base=document.createElement('div'); base.style.cssText='width:90%;height:8px;background:#888;border-radius:4px'; col.appendChild(base);
      peg.forEach(d=>{ const disk=document.createElement('div'); disk.style.cssText='height:30px;border-radius:8px;width:'+(34+d*20)+'%;background:hsl('+(d*55+10)+',85%,55%);box-shadow:inset 0 -4px 0 rgba(0,0,0,.25)'; col.appendChild(disk); });
      col.onclick=()=>tap(i);
      board.appendChild(col);
    });
  }
  function tap(i){
    if(done) return;
    if(sel===-1){ if(pegs[i].length) sel=i; }
    else if(sel===i){ sel=-1; }
    else{
      const d=pegs[sel][pegs[sel].length-1], t=pegs[i][pegs[i].length-1];
      if(t===undefined || d<t){ pegs[i].push(pegs[sel].pop()); moves++; info.textContent='Langkah: '+moves+(pegs[2].length===3?' • SELESAI! 🎉':''); }
      sel=-1;
    }
    render();
    if(pegs[2].length===3){ done=true; api.end(Math.max(25, 100-(moves-7)*8)); }
  }
  render();
}});

/* 2. Sudoku Mini 4x4 */
RGAMES.push({ id:'sudoku4', name:'Sudoku Mini', emoji:'🔢', hue:200, desc:'Isi grid 4x4 dengan angka 1-4, tiap baris dan kolom harus lengkap.', play(el, api){
  const sh=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  const base=[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]], perm=sh([1,2,3,4]);
  const sol=base.map(r=>r.map(v=>perm[v-1]));
  const grid=sol.map(r=>[...r]), locked=[];
  const cells=[]; for(let r=0;r<4;r++) for(let c=0;c<4;c++) cells.push([r,c]);
  sh(cells).slice(0,8).forEach(([r,c])=>grid[r][c]=0);
  for(let r=0;r<4;r++){ locked.push([]); for(let c=0;c<4;c++) locked[r].push(grid[r][c]!==0); }
  let selR=-1, selC=-1, mistakes=0, done=false;
  el.innerHTML='<div style="padding:14px;color:#fff;text-align:center"><h3>🔢 Sudoku Mini</h3><p id="sd-info">Ketuk kotak kosong, lalu pilih angka. Salah: 0</p><div id="sd-grid" style="display:grid;grid-template-columns:repeat(4,58px);gap:6px;justify-content:center;margin:10px auto"></div><div id="sd-pad"></div></div>';
  const gEl=el.querySelector('#sd-grid'), pad=el.querySelector('#sd-pad'), info=el.querySelector('#sd-info');
  function render(){
    gEl.innerHTML='';
    for(let r=0;r<4;r++) for(let c=0;c<4;c++){
      const b=document.createElement('button');
      b.style.cssText='width:58px;height:58px;font-size:24px;font-weight:bold;border-radius:10px;border:none;cursor:pointer;background:'+(locked[r][c]?'#3a4a6b':(selR===r&&selC===c?'#ffd93d':'#e8ecf5'))+';color:'+(locked[r][c]?'#9db4e0':'#222');
      b.textContent=grid[r][c]||'';
      b.onclick=()=>{ if(!locked[r][c]){ selR=r; selC=c; render(); } };
      gEl.appendChild(b);
    }
  }
  [1,2,3,4,0].forEach(n=>{
    const b=document.createElement('button');
    b.style.cssText='width:52px;height:52px;margin:4px;font-size:22px;font-weight:bold;border-radius:10px;border:none;cursor:pointer;background:#00b06f;color:#fff';
    b.textContent=n===0?'⌫':n;
    b.onclick=()=>{
      if(done||selR<0) return;
      grid[selR][selC]=n;
      if(n!==0 && n!==sol[selR][selC]){ mistakes++; info.textContent='Angka itu salah! Salah: '+mistakes; }
      else info.textContent='Ketuk kotak kosong, lalu pilih angka. Salah: '+mistakes;
      render();
      let full=true; for(let r=0;r<4;r++) for(let c=0;c<4;c++) if(grid[r][c]!==sol[r][c]) full=false;
      if(full){ done=true; info.textContent='SELESAI! 🎉'; api.end(Math.max(30, 100-mistakes*10)); }
    };
    pad.appendChild(b);
  });
  render();
}});

/* 3. Susun Kata */
RGAMES.push({ id:'unscramble', name:'Susun Kata', emoji:'🔤', hue:160, desc:'Susun huruf acak menjadi kata yang benar, ada 6 kata.', play(el, api){
  const sh=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  const words=sh(['KUCING','PISANG','SEKOLAH','BUKU','MOBIL','RUMAH','BOLA','AYAM','PINTU','SUSU']).slice(0,6);
  let idx=0, correct=0, mistakes=0, picked=[], done=false;
  el.innerHTML='<div style="padding:16px;color:#fff;text-align:center"><h3>🔤 Susun Kata</h3><p id="us-info"></p><div id="us-built" style="min-height:56px;margin:10px"></div><div id="us-chips" style="margin:10px"></div><button id="us-check" style="font-size:16px;padding:10px 22px;border-radius:10px;border:none;background:#00b06f;color:#fff;font-weight:bold;cursor:pointer">CEK ✔</button> <button id="us-skip" style="font-size:16px;padding:10px 16px;border-radius:10px;border:none;background:#666;color:#fff;cursor:pointer">Lewati ⏭</button></div>';
  const info=el.querySelector('#us-info'), builtEl=el.querySelector('#us-built'), chipsEl=el.querySelector('#us-chips');
  let letters=[];
  function load(){
    const w=words[idx]; letters=sh(w.split('')); if(letters.join('')===w) letters.reverse();
    picked=[]; render();
  }
  function render(){
    info.textContent='Kata '+(idx+1)+' dari 6 • Benar: '+correct+' • Salah cek: '+mistakes;
    builtEl.innerHTML=''; chipsEl.innerHTML='';
    picked.forEach((li,pos)=>{
      const b=document.createElement('button');
      b.style.cssText='width:46px;height:46px;margin:3px;font-size:22px;font-weight:bold;border-radius:9px;border:none;background:#ffd93d;color:#333;cursor:pointer';
      b.textContent=letters[li]; b.onclick=()=>{ picked.splice(pos,1); render(); };
      builtEl.appendChild(b);
    });
    if(!picked.length) builtEl.innerHTML='<span style="color:#aaa">Ketuk huruf di bawah untuk menyusun kata…</span>';
    letters.forEach((ch,li)=>{
      if(picked.includes(li)) return;
      const b=document.createElement('button');
      b.style.cssText='width:46px;height:46px;margin:3px;font-size:22px;font-weight:bold;border-radius:9px;border:none;background:#4a6fa5;color:#fff;cursor:pointer';
      b.textContent=ch; b.onclick=()=>{ picked.push(li); render(); };
      chipsEl.appendChild(b);
    });
  }
  function next(){ idx++; if(idx>=6){ done=true; api.end(Math.max(5, Math.min(100, Math.round(correct/6*100)-mistakes*2))); } else load(); }
  el.querySelector('#us-check').onclick=()=>{
    if(done) return;
    const built=picked.map(li=>letters[li]).join('');
    if(built.length<words[idx].length){ info.textContent='Hurufnya belum lengkap!'; return; }
    if(built===words[idx]){ correct++; next(); } else { mistakes++; picked=[]; render(); info.textContent='Masih salah, coba lagi! Salah cek: '+mistakes; }
  };
  el.querySelector('#us-skip').onclick=()=>{ if(!done) next(); };
  load();
}});

/* 4. Kuis Hewan */
RGAMES.push({ id:'animalquiz', name:'Kuis Hewan', emoji:'🦁', hue:35, desc:'Tebak nama hewan dari petunjuknya, ada 10 soal.', play(el, api){
  const sh=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  const Q=[
    ['🦁','Dijuluki raja hutan','Singa',['Singa','Harimau','Serigala','Beruang']],
    ['🐘','Hewan darat terbesar, punya belalai panjang','Gajah',['Gajah','Badak','Kuda Nil','Kerbau']],
    ['🐧','Burung yang tidak bisa terbang, hidup di daerah dingin','Pinguin',['Pinguin','Elang','Merpati','Angsa']],
    ['🦘','Hewan Australia, melompat dan punya kantung','Kanguru',['Kanguru','Koala','Kelinci','Rusa']],
    ['🐙','Hewan laut yang punya delapan kaki','Gurita',['Gurita','Cumi-cumi','Ubur-ubur','Bintang Laut']],
    ['🦉','Burung yang aktif berburu di malam hari','Burung Hantu',['Burung Hantu','Kelelawar','Garuda','Camar']],
    ['🐢','Hewan bercangkang, jalannya lambat','Kura-kura',['Kura-kura','Siput','Kepiting','Kodok']],
    ['🦒','Hewan dengan leher yang sangat panjang','Jerapah',['Jerapah','Unta','Kuda','Rusa']],
    ['🐝','Serangga yang menghasilkan madu','Lebah',['Lebah','Semut','Kupu-kupu','Lalat']],
    ['🐸','Bisa hidup di air dan darat, suka melompat','Katak',['Katak','Buaya','Ikan','Ular']]
  ];
  let idx=0, score=0, done=false; const T=[];
  el.innerHTML='<div style="padding:16px;color:#fff;text-align:center"><h3>🦁 Kuis Hewan</h3><p id="aq-info"></p><div id="aq-emoji" style="font-size:76px;margin:6px"></div><p id="aq-clue" style="font-size:17px"></p><div id="aq-opts" style="max-width:320px;margin:12px auto"></div></div>';
  const info=el.querySelector('#aq-info'), em=el.querySelector('#aq-emoji'), clue=el.querySelector('#aq-clue'), opts=el.querySelector('#aq-opts');
  function show(){
    const q=Q[idx];
    info.textContent='Soal '+(idx+1)+' dari 10 • Skor: '+score;
    em.textContent=q[0]; clue.textContent=q[1]; opts.innerHTML='';
    sh(q[3]).forEach(o=>{
      const b=document.createElement('button');
      b.style.cssText='display:block;width:100%;margin:7px 0;padding:13px;font-size:17px;border-radius:11px;border:none;background:#33507e;color:#fff;font-weight:bold;cursor:pointer';
      b.textContent=o;
      b.onclick=()=>{
        if(done) return;
        const right=o===q[2]; if(right) score++;
        b.style.background=right?'#00b06f':'#d64545';
        [...opts.children].forEach(x=>x.disabled=true);
        T.push(setTimeout(()=>{ idx++; if(idx>=10){ done=true; api.end(score*10); } else show(); },650));
      };
      opts.appendChild(b);
    });
  }
  show();
}});

/* 5. Piano Tiles */
RGAMES.push({ id:'piano', name:'Piano Tiles', emoji:'🎹', hue:260, desc:'Ketuk 40 ubin hitam yang turun, jangan sampai lolos atau salah ketuk.', play(el, api){
  const H=440, TOTAL=40;
  let tiles=[], spawned=0, hit=0, done=false; const T=[];
  el.innerHTML='<div id="pt-wrap" style="position:relative;width:100%;height:440px;background:linear-gradient(#1c2340,#0d1020);overflow:hidden;cursor:pointer"><p id="pt-info" style="position:absolute;top:8px;left:0;right:0;text-align:center;color:#fff;z-index:5;margin:0;font-weight:bold">Ubin: 0 / 40</p></div>';
  const wrap=el.querySelector('#pt-wrap'), info=el.querySelector('#pt-info'), W=wrap.clientWidth||360;
  function end(p){ if(done) return; done=true; T.forEach(t=>{clearInterval(t);clearTimeout(t);}); api.end(p); }
  const spawn=setInterval(()=>{
    if(spawned>=TOTAL){ clearInterval(spawn); return; }
    spawned++;
    const d=document.createElement('div'), col=Math.random()*4|0;
    d.style.cssText='position:absolute;top:-104px;width:25%;height:100px;background:#151515;border:2px solid #444;border-radius:6px;box-sizing:border-box;left:'+(col*25)+'%';
    const t={el:d, y:-104};
    d.addEventListener('pointerdown',e=>{ e.stopPropagation(); if(done||t.dead) return; t.dead=true; hit++; info.textContent='Ubin: '+hit+' / 40'; d.remove(); tiles=tiles.filter(x=>x!==t); if(hit>=TOTAL) end(100); });
    wrap.appendChild(d); tiles.push(t);
  },640); T.push(spawn);
  const loop=setInterval(()=>{
    const sp=3+hit*0.07;
    for(const t of [...tiles]){
      t.y+=sp; t.el.style.top=t.y+'px';
      if(t.y>H){ end(Math.round(hit/TOTAL*75)); return; }
    }
  },16); T.push(loop);
  wrap.addEventListener('pointerdown',()=>{ end(Math.round(hit/TOTAL*55)); });
}});

/* 6. Bola Warna */
RGAMES.push({ id:'colorswitch', name:'Bola Warna', emoji:'🔴', hue:320, desc:'Tap untuk melompat, lewati gerbang dengan warna yang sama dengan bolamu.', play(el, api){
  const COLORS=['#ff595e','#ffca3a','#8ac926','#1982c4'], GOAL=8, H=440;
  const W=el.clientWidth||360;
  let ballY=210, vy=0, ballC=Math.random()*4|0, passed=0, bars=[], tick=0, done=false; const T=[];
  el.innerHTML='<div id="cw-wrap" style="position:relative;width:100%;height:440px;background:#14142b;overflow:hidden;cursor:pointer"><p id="cw-info" style="position:absolute;top:8px;left:0;right:0;text-align:center;color:#fff;z-index:6;margin:0;font-weight:bold">Gerbang: 0 / 8</p><div id="cw-ball" style="position:absolute;width:30px;height:30px;border-radius:50%;left:50%;margin-left:-15px;z-index:5;box-shadow:0 0 12px rgba(255,255,255,.35)"></div></div>';
  const wrap=el.querySelector('#cw-wrap'), ballEl=el.querySelector('#cw-ball'), info=el.querySelector('#cw-info');
  function end(p){ if(done) return; done=true; T.forEach(t=>{clearInterval(t);clearTimeout(t);}); api.end(Math.max(0,Math.min(100,p))); }
  function drawBall(){ ballEl.style.top=ballY+'px'; ballEl.style.background=COLORS[ballC]; }
  function spawnBar(){
    const order=[0,1,2,3].sort(()=>Math.random()-.5);
    const bar=document.createElement('div');
    bar.style.cssText='position:absolute;left:0;width:200%;height:24px;display:flex;z-index:3';
    for(let i=0;i<8;i++){ const s=document.createElement('div'); s.style.cssText='flex:1;background:'+COLORS[order[i%4]]; bar.appendChild(s); }
    wrap.appendChild(bar);
    bars.push({el:bar, y:-30, order, phase:Math.random()*6.28, done:false});
  }
  spawnBar();
  const spawn=setInterval(()=>{ if(!done) spawnBar(); },2300); T.push(spawn);
  wrap.addEventListener('pointerdown',()=>{ if(!done) vy=-8.2; });
  const loop=setInterval(()=>{
    tick++;
    vy+=0.36; ballY+=vy;
    if(ballY<0){ ballY=0; vy=0; }
    if(ballY>H-30){ end(Math.round(passed/GOAL*70)); return; }
    drawBall();
    for(const b of [...bars]){
      b.y+=2.1;
      const tx=-((Math.sin(tick*0.02+b.phase)*0.5+0.5)*W);
      b.el.style.top=b.y+'px'; b.el.style.transform='translateX('+tx+'px)';
      if(!b.done && b.y+12>=ballY+15){
        b.done=true;
        const idx=Math.floor((W/2-tx)/(W/4))%4, col=b.order[idx<0?idx+4:idx];
        if(col===ballC){ passed++; info.textContent='Gerbang: '+passed+' / 8'; ballC=Math.random()*4|0; drawBall(); if(passed>=GOAL){ end(100); return; } }
        else { end(Math.round(passed/GOAL*70)); return; }
      }
      if(b.y>H+10){ b.el.remove(); bars=bars.filter(x=>x!==b); }
    }
  },16); T.push(loop);
  drawBall();
}});

/* 7. Pesawat Luar Angkasa */
RGAMES.push({ id:'shooter', name:'Pesawat Luar Angkasa', emoji:'🚀', hue:230, desc:'Geser pesawatmu, tembak musuh dan bertahan selama 60 detik.', play(el, api){
  const cv=document.createElement('canvas'); cv.width=el.clientWidth||360; cv.height=440;
  cv.style.cssText='width:100%;height:440px;background:#070b1d;display:block;touch-action:none;cursor:pointer';
  el.appendChild(cv);
  const ctx=cv.getContext('2d'), W=cv.width, H=440;
  let shipX=W/2, bullets=[], enemies=[], kills=0, timeLeft=60, done=false; const T=[];
  function end(p){ if(done) return; done=true; T.forEach(t=>{clearInterval(t);clearTimeout(t);}); cancelAnimationFrame(raf); api.end(Math.max(0,Math.min(100,p))); }
  function move(e){ const r=cv.getBoundingClientRect(); shipX=Math.max(20,Math.min(W-20,(e.clientX-r.left)*(W/r.width))); }
  cv.addEventListener('pointermove',move); cv.addEventListener('pointerdown',move);
  T.push(setInterval(()=>{ bullets.push({x:shipX,y:H-56}); },230));
  T.push(setInterval(()=>{ enemies.push({x:24+Math.random()*(W-48), y:-26, s:1.1+Math.random()*1.3}); },880));
  T.push(setInterval(()=>{ timeLeft--; if(timeLeft<=0) end(Math.min(100, 35+kills*3)); },1000));
  let raf=0;
  function frame(){
    if(done) return;
    ctx.clearRect(0,0,W,H);
    ctx.fillStyle='#fff'; ctx.font='11px monospace';
    for(let i=0;i<40;i++){ ctx.fillRect((i*67)%W,(i*97)%H,2,2); }
    ctx.font='34px serif'; ctx.textAlign='center';
    ctx.fillText('🚀',shipX,H-18);
    bullets=bullets.filter(b=>b.y>-12);
    ctx.fillStyle='#ffd93d';
    bullets.forEach(b=>{ b.y-=7; ctx.fillRect(b.x-2,b.y,4,12); });
    enemies=enemies.filter(en=>en.y<H+26);
    for(const en of enemies){
      en.y+=en.s;
      ctx.fillText('👾',en.x,en.y);
      if(Math.abs(en.x-shipX)<30 && en.y>H-52){ end(Math.min(65,kills*3)); return; }
      for(const b of bullets){
        if(Math.abs(b.x-en.x)<22 && Math.abs(b.y-en.y)<22){ en.dead=true; b.dead=true; kills++; break; }
      }
    }
    enemies=enemies.filter(en=>!en.dead); bullets=bullets.filter(b=>!b.dead);
    ctx.fillStyle='#fff'; ctx.font='bold 16px sans-serif'; ctx.textAlign='left';
    ctx.fillText('💥 '+kills+'   ⏱ '+timeLeft+' dtk',10,24);
    raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
}});

/* 8. Susun Burger */
RGAMES.push({ id:'burger', name:'Susun Burger', emoji:'🍔', hue:30, desc:'Susun burger sesuai pesanan dari lapisan bawah ke atas, selesaikan 5 pesanan.', play(el, api){
  const MID=[['🥩','Daging'],['🧀','Keju'],['🥬','Selada'],['🍅','Tomat'],['🍳','Telur'],['🧅','Bawang']];
  const ALL=[['🍞','Roti'],...MID];
  let orderNo=0, stack=[], step=0, mistakes=0, done=false;
  el.innerHTML='<div style="padding:14px;color:#fff;text-align:center"><h3>🍔 Susun Burger</h3><p id="bg-info"></p><div style="display:flex;justify-content:center;gap:26px"><div><div style="font-size:13px;color:#aaa">PESANAN<br>(atas → bawah)</div><div id="bg-target" style="font-size:34px;line-height:1.25"></div></div><div><div style="font-size:13px;color:#aaa">BURGERMU</div><div id="bg-mine" style="font-size:34px;line-height:1.25"></div></div></div><div id="bg-btns" style="margin-top:12px"></div></div>';
  const info=el.querySelector('#bg-info'), tEl=el.querySelector('#bg-target'), mEl=el.querySelector('#bg-mine'), btns=el.querySelector('#bg-btns');
  ALL.forEach(([em,nm])=>{
    const b=document.createElement('button');
    b.style.cssText='margin:4px;padding:9px 11px;font-size:15px;border-radius:10px;border:none;background:#33507e;color:#fff;cursor:pointer';
    b.textContent=em+' '+nm;
    b.onclick=()=>{
      if(done) return;
      if(em===stack[step]){
        step++; render();
        if(step>=stack.length){ orderNo++; if(orderNo>=5){ done=true; info.textContent='Semua pesanan selesai! 🎉'; api.end(Math.max(25,100-mistakes*6)); } else { newOrder(); } }
      } else { mistakes++; info.textContent='Bahan itu belum waktunya! Salah: '+mistakes; }
    };
    btns.appendChild(b);
  });
  function render(){
    info.textContent='Pesanan '+(orderNo+1)+' dari 5 • Susun dari BAWAH ke ATAS • Salah: '+mistakes;
    tEl.innerHTML=[...stack].reverse().map(x=>'<div>'+x+'</div>').join('');
    mEl.innerHTML=stack.slice(0,step).reverse().map(x=>'<div>'+x+'</div>').join('')||'<div style="color:#666;font-size:16px">kosong</div>';
  }
  function newOrder(){
    const n=3+(orderNo>=2?1:0); stack=['🍞'];
    let prev='';
    for(let i=0;i<n;i++){ let m; do{ m=MID[Math.random()*MID.length|0][0]; }while(m===prev); stack.push(m); prev=m; }
    stack.push('🍞'); step=0; render();
  }
  newOrder();
}});

/* 9. Terjun Tepat */
RGAMES.push({ id:'parachute', name:'Terjun Tepat', emoji:'🪂', hue:195, desc:'Ketuk untuk membuka parasut dan mengarahkan pendaratan sedekat mungkin ke target.', play(el, api){
  const W=el.clientWidth||360, H=440;
  const targetCX=60+Math.random()*(W-120);
  let x=W/2, y=8, deployed=false, targetX=null, t=0, done=false; const T=[];
  el.innerHTML='<div id="pc-wrap" style="position:relative;width:100%;height:440px;background:linear-gradient(#7ec8f7,#dff3ff);overflow:hidden;cursor:pointer"><p style="position:absolute;top:8px;left:0;right:0;text-align:center;color:#14508c;margin:0;font-weight:bold;z-index:5">Ketuk = buka parasut & arahkan ke target 🎯</p><div id="pc-man" style="position:absolute;font-size:38px;z-index:4;transform:translate(-50%,0)">🧍</div><div style="position:absolute;bottom:0;left:0;right:0;height:40px;background:#58a05c"></div><div style="position:absolute;bottom:0;width:90px;height:40px;background:#ffd93d;border:3px dashed #e08a00;box-sizing:border-box;left:'+(targetCX-45)+'px"></div><div style="position:absolute;bottom:8px;font-size:22px;transform:translate(-50%,0);left:'+targetCX+'px">🎯</div></div>';
  const wrap=el.querySelector('#pc-wrap'), man=el.querySelector('#pc-man');
  function end(p){ if(done) return; done=true; T.forEach(i=>clearInterval(i)); api.end(Math.max(0,Math.min(100,p))); }
  wrap.addEventListener('pointerdown',e=>{
    const r=wrap.getBoundingClientRect(); targetX=(e.clientX-r.left)*(W/r.width);
    if(!deployed){ deployed=true; man.textContent='🪂'; }
  });
  const loop=setInterval(()=>{
    t++;
    if(deployed){
      y+=1.15;
      if(targetX!==null){ const dx=targetX-x; x+=Math.max(-2.2,Math.min(2.2,dx*0.06)); }
      x+=Math.sin(t/22)*0.3;
    } else {
      y+=3.4; x+=Math.sin(t/16)*1.5;
    }
    x=Math.max(16,Math.min(W-16,x));
    man.style.left=x+'px'; man.style.top=y+'px';
    if(y>=H-72){
      if(!deployed){ man.textContent='💥'; end(4); }
      else end(Math.round(100-Math.abs(x-targetCX)/2.2));
    }
  },30); T.push(loop);
}});

/* 10. Tinggi Rendah */
RGAMES.push({ id:'highlow', name:'Tinggi Rendah', emoji:'🃏', hue:350, desc:'Tebak kartu berikutnya lebih tinggi atau lebih rendah, 12 ronde.', play(el, api){
  const RANK=['A','2','3','4','5','6','7','8','9','10','J','Q','K'], SUIT=['♠️','♥️','♦️','♣️'];
  let cur=1+Math.random()*13|0, suit=SUIT[Math.random()*4|0], rounds=0, correct=0, done=false;
  el.innerHTML='<div style="padding:16px;color:#fff;text-align:center"><h3>🃏 Tinggi Rendah</h3><p id="hl-info"></p><div id="hl-card" style="width:130px;height:180px;margin:12px auto;background:#fff;border-radius:14px;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.4)"></div><p id="hl-msg" style="min-height:24px"></p><button id="hl-up" style="font-size:17px;padding:12px 20px;margin:4px;border-radius:11px;border:none;background:#00b06f;color:#fff;font-weight:bold;cursor:pointer">⬆️ LEBIH TINGGI</button><button id="hl-dn" style="font-size:17px;padding:12px 20px;margin:4px;border-radius:11px;border:none;background:#d64545;color:#fff;font-weight:bold;cursor:pointer">⬇️ LEBIH RENDAH</button></div>';
  const info=el.querySelector('#hl-info'), card=el.querySelector('#hl-card'), msg=el.querySelector('#hl-msg');
  function render(){
    info.textContent='Ronde '+(rounds+1)+' dari 12 • Benar: '+correct;
    card.innerHTML='<div style="font-size:52px;font-weight:bold;color:'+(suit==='♥️'||suit==='♦️'?'#d64545':'#222')+'">'+RANK[cur-1]+'</div><div style="font-size:40px">'+suit+'</div>';
  }
  function guess(up){
    if(done) return;
    let nx; do{ nx=1+Math.random()*13|0; }while(nx===cur);
    const right=up?nx>cur:nx<cur;
    if(right) correct++;
    rounds++;
    msg.textContent=(right?'✅ Benar! ':'❌ Salah! ')+'Kartu berikutnya: '+RANK[nx-1];
    cur=nx; suit=SUIT[Math.random()*4|0];
    if(rounds>=12){ done=true; msg.textContent+=' • SELESAI! 🎉'; api.end(Math.round(correct/12*100)); }
    render();
  }
  el.querySelector('#hl-up').onclick=()=>guess(true);
  el.querySelector('#hl-dn').onclick=()=>guess(false);
  render();
}});

/* 11. Ingat Kotak */
RGAMES.push({ id:'gridmemory', name:'Ingat Kotak', emoji:'🧠', hue:150, desc:'Hafalkan kotak yang menyala, lalu ketuk lagi semuanya.', play(el, api){
  let level=1, targets=[], picked=[], locked=true, done=false; const T=[];
  el.innerHTML='<div style="padding:14px;color:#fff;text-align:center"><h3>🧠 Ingat Kotak</h3><p id="gm-info">Level 1 • Hafalkan kotaknya…</p><div id="gm-grid" style="display:grid;grid-template-columns:repeat(4,64px);gap:7px;justify-content:center;margin:12px auto"></div></div>';
  const info=el.querySelector('#gm-info'), gEl=el.querySelector('#gm-grid');
  const cells=[];
  for(let i=0;i<16;i++){
    const b=document.createElement('button');
    b.style.cssText='width:64px;height:64px;border-radius:11px;border:none;background:#2c3a58;cursor:pointer;font-size:22px;color:#fff';
    b.onclick=()=>tap(i,b);
    gEl.appendChild(b); cells.push(b);
  }
  function end(p){ if(done) return; done=true; T.forEach(t=>{clearTimeout(t);clearInterval(t);}); api.end(p); }
  function startLevel(){
    picked=[]; locked=true;
    const n=Math.min(10, level+2);
    targets=[]; while(targets.length<n){ const v=Math.random()*16|0; if(!targets.includes(v)) targets.push(v); }
    info.textContent='Level '+level+' • Hafalkan '+n+' kotak…';
    cells.forEach((b,i)=>{ b.style.background=targets.includes(i)?'#ffd93d':'#2c3a58'; b.textContent=targets.includes(i)?'⭐':''; });
    T.push(setTimeout(()=>{ cells.forEach(b=>{ b.style.background='#2c3a58'; b.textContent=''; }); locked=false; info.textContent='Level '+level+' • Sekarang ketuk kotaknya!'; },1100));
  }
  function tap(i,b){
    if(done||locked||picked.includes(i)) return;
    if(targets.includes(i)){ picked.push(i); b.style.background='#00b06f'; b.textContent='✔';
      if(picked.length===targets.length){ level++; info.textContent='Hebat! Naik level… 🎉'; locked=true; T.push(setTimeout(startLevel,800)); }
    } else { b.style.background='#d64545'; end(Math.min(95, level*12)); }
  }
  startLevel();
}});

/* 12. Tebak Kata Gantung */
RGAMES.push({ id:'hangman', name:'Tebak Kata Gantung', emoji:'🔡', hue:45, desc:'Tebak huruf demi huruf kata rahasia sebelum 6 nyawamu habis.', play(el, api){
  const WORDS=['PENSIL','PENGHAPUS','BUKU','KURSI','PAPAN','KAPUR','SEKOLAH','JENDELA','PENGGARIS','KOTAK PENSIL','MEJA','TAS'];
  const word=WORDS[Math.random()*WORDS.length|0];
  const FACES=['😀','🙂','😐','😟','😰','😱','💀'];
  let wrong=0; const guessed=new Set(); let done=false;
  el.innerHTML='<div style="padding:14px;color:#fff;text-align:center"><h3>🔡 Tebak Kata Gantung</h3><div id="hg-face" style="font-size:56px">😀</div><p id="hg-info">Tema: benda di sekolah • Nyawa: 6</p><div id="hg-word" style="font-size:30px;letter-spacing:5px;font-weight:bold;margin:12px;word-break:break-all"></div><div id="hg-keys" style="max-width:430px;margin:0 auto"></div></div>';
  const face=el.querySelector('#hg-face'), info=el.querySelector('#hg-info'), wEl=el.querySelector('#hg-word'), keys=el.querySelector('#hg-keys');
  function render(){
    wEl.textContent=word.split('').map(ch=>ch===' '?' ':(guessed.has(ch)?ch:'_')).join(' ');
    face.textContent=FACES[wrong];
    info.textContent='Tema: benda di sekolah • Nyawa: '+(6-wrong);
  }
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(ch=>{
    const b=document.createElement('button');
    b.style.cssText='width:38px;height:38px;margin:2.5px;font-size:16px;font-weight:bold;border-radius:8px;border:none;background:#33507e;color:#fff;cursor:pointer';
    b.textContent=ch;
    b.onclick=()=>{
      if(done||guessed.has(ch)) return;
      guessed.add(ch); b.disabled=true;
      if(word.includes(ch)){ b.style.background='#00b06f'; }
      else { wrong++; b.style.background='#d64545'; }
      render();
      const revealed=word.replace(/ /g,'').split('').filter(c=>guessed.has(c)).length, total=word.replace(/ /g,'').length;
      if(revealed===total){ done=true; info.textContent='MENANG! Katanya: '+word+' 🎉'; api.end(100-wrong*8); }
      else if(wrong>=6){ done=true; info.textContent='Kalah! Katanya: '+word; api.end(Math.round(revealed/total*35)); }
    };
    keys.appendChild(b);
  });
  render();
}});

/* 13. Roda Hadiah */
RGAMES.push({ id:'spinwheel', name:'Roda Hadiah', emoji:'🎡', hue:300, desc:'Putar roda 5 kali dan kumpulkan poin sebanyak-banyaknya, hati-hati sektor zonk.', play(el, api){
  const SECT=[10,50,0,100,20,0,30,20], COL=['#e74c3c','#f39c12','#9b59b6','#f1c40f','#3498db','#7f8c8d','#2ecc71','#e67e22'];
  let rot=0, spins=5, total=0, spinning=false, done=false; const T=[];
  const grad=SECT.map((v,i)=>COL[i]+' '+(i*45)+'deg '+(i*45+45)+'deg').join(',');
  el.innerHTML='<div style="padding:14px;color:#fff;text-align:center"><h3>🎡 Roda Hadiah</h3><p id="sw-info">Total: 0 • Sisa putaran: 5</p><div style="font-size:22px">🔻</div><div id="sw-wheel" style="position:relative;width:250px;height:250px;margin:2px auto;border-radius:50%;border:6px solid #fff;background:conic-gradient('+grad+');transition:transform 2.6s cubic-bezier(.12,.8,.22,1)"></div><br><button id="sw-btn" style="font-size:18px;padding:12px 30px;border-radius:12px;border:none;background:#00b06f;color:#fff;font-weight:bold;cursor:pointer">PUTAR! 🎡</button></div>';
  const wheel=el.querySelector('#sw-wheel'), info=el.querySelector('#sw-info'), btn=el.querySelector('#sw-btn');
  SECT.forEach((v,i)=>{
    const s=document.createElement('span');
    s.style.cssText='position:absolute;left:calc(50% - 16px);top:calc(50% - 13px);width:32px;text-align:center;font-weight:bold;font-size:15px;color:#fff;text-shadow:0 1px 3px #000;transform:rotate('+(i*45+22.5)+'deg) translateY(-92px)';
    s.textContent=v===0?'💀':v; wheel.appendChild(s);
  });
  btn.onclick=()=>{
    if(done||spinning) return;
    spinning=true; btn.disabled=true;
    const k=Math.random()*8|0;
    const want=(360-(k*45+22.5))%360, cur=((rot%360)+360)%360;
    rot+=1440+((want-cur+360)%360);
    wheel.style.transform='rotate('+rot+'deg)';
    T.push(setTimeout(()=>{
      spinning=false; spins--; total+=SECT[k];
      info.textContent='Dapat: '+(SECT[k]===0?'ZONK 💀':SECT[k])+' • Total: '+total+' • Sisa putaran: '+spins;
      if(spins<=0){ done=true; btn.textContent='SELESAI 🎉'; api.end(Math.min(100, Math.round(total/2))); }
      else btn.disabled=false;
    },2750));
  };
}});

/* 14. Lompat Tali */
RGAMES.push({ id:'jumprope', name:'Lompat Tali', emoji:'🪢', hue:120, desc:'Ketuk untuk melompat tepat saat tali lewat di bawah kakimu.', play(el, api){
  const cv=document.createElement('canvas'); cv.width=el.clientWidth||360; cv.height=440;
  cv.style.cssText='width:100%;height:440px;background:linear-gradient(#8ed6ff,#e8f9ff);display:block;touch-action:none;cursor:pointer';
  el.appendChild(cv);
  const ctx=cv.getContext('2d'), W=cv.width;
  const cx=W/2, pivY=228, R=118, ground=352;
  let a=0, lastPass=-1, jumps=0, jumpStart=-9999, done=false; const T=[];
  function end(p){ if(done) return; done=true; T.forEach(i=>clearInterval(i)); api.end(Math.min(100,p)); }
  cv.addEventListener('pointerdown',()=>{ const now=performance.now(); if(now-jumpStart>430) jumpStart=now; });
  const loop=setInterval(()=>{
    const now=performance.now();
    a+=0.088+jumps*0.0022;
    const pi=Math.floor((a-Math.PI/2)/(Math.PI*2));
    if(pi>lastPass){
      lastPass=pi;
      if(now-jumpStart<=430) jumps++; else { end(jumps*5); return; }
    }
    const jp=(now-jumpStart)/430, jumpOff=(jp>=0&&jp<=1)?Math.sin(jp*Math.PI)*36:0;
    ctx.clearRect(0,0,W,440);
    ctx.fillStyle='#58a05c'; ctx.fillRect(0,ground,W,440-ground);
    const x1=cx+R*Math.cos(a), y1=pivY+R*Math.sin(a), x2=cx+R*Math.cos(a+Math.PI), y2=pivY+R*Math.sin(a+Math.PI);
    ctx.strokeStyle='#8a5a2b'; ctx.lineWidth=5; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    ctx.fillStyle='#ffd93d'; ctx.beginPath(); ctx.arc(x1,y1,7,0,7); ctx.arc(x2,y2,7,0,7); ctx.fill();
    const fy=ground-jumpOff;
    ctx.strokeStyle='#22304a'; ctx.lineWidth=5; ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(cx,fy-58,13,0,7); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,fy-45); ctx.lineTo(cx,fy-16); ctx.moveTo(cx,fy-40); ctx.lineTo(cx-17,fy-26); ctx.moveTo(cx,fy-40); ctx.lineTo(cx+17,fy-26);
    ctx.moveTo(cx,fy-16); ctx.lineTo(cx-13,fy); ctx.moveTo(cx,fy-16); ctx.lineTo(cx+13,fy); ctx.stroke();
    ctx.fillStyle='#14508c'; ctx.font='bold 19px sans-serif'; ctx.textAlign='center';
    ctx.fillText('Lompatan: '+jumps, cx, 30);
    ctx.font='14px sans-serif'; ctx.fillText('Ketuk layar untuk melompat!', cx, 52);
  },16); T.push(loop);
}});

/* 15. Galeri Tembak */
RGAMES.push({ id:'gallery', name:'Galeri Tembak', emoji:'🎯', hue:0, desc:'Ketuk target yang muncul sebelum menghilang, ada 20 target.', play(el, api){
  const FACES=['🎯','🐰','⭐','🦆','🎈'];
  let shown=0, hits=0, active=-1, done=false; const T=[];
  el.innerHTML='<div style="padding:14px;color:#fff;text-align:center"><h3>🎯 Galeri Tembak</h3><p id="gl-info">Target: 0 / 20 • Kena: 0</p><div id="gl-grid" style="display:grid;grid-template-columns:repeat(3,96px);gap:9px;justify-content:center;margin:14px auto"></div></div>';
  const info=el.querySelector('#gl-info'), gEl=el.querySelector('#gl-grid');
  const cells=[];
  for(let i=0;i<9;i++){
    const b=document.createElement('button');
    b.style.cssText='width:96px;height:96px;font-size:48px;border-radius:14px;border:none;background:#2c3a58;cursor:pointer';
    b.onclick=()=>{
      if(done) return;
      if(i===active){ hits++; clearTimeout(timer); active=-1; b.textContent='💥'; info.textContent='Target: '+shown+' / 20 • Kena: '+hits; T.push(setTimeout(spawn,180)); }
    };
    gEl.appendChild(b); cells.push(b);
  }
  let timer=0;
  function end(){ if(done) return; done=true; T.forEach(t=>{clearTimeout(t);clearInterval(t);}); api.end(Math.round(hits/20*100)); }
  function spawn(){
    if(done) return;
    if(shown>=20){ end(); return; }
    cells.forEach(b=>b.textContent='');
    shown++;
    active=Math.random()*9|0;
    cells[active].textContent=FACES[Math.random()*FACES.length|0];
    info.textContent='Target: '+shown+' / 20 • Kena: '+hits;
    const dur=Math.max(460, 980-shown*24);
    timer=setTimeout(()=>{ if(done) return; active=-1; spawn(); },dur); T.push(timer);
  }
  spawn();
}});

/* 16. Kata Terakhir */
RGAMES.push({ id:'wordchain', name:'Kata Terakhir', emoji:'🔗', hue:265, desc:'Pilih kata berikutnya yang diawali huruf terakhir kata sebelumnya, 8 ronde.', play(el, api){
  const CHAIN=['MOBIL','LEMON','NASI','IKAN','NAGA','AYAM','MATA','API','INTAN'];
  const POOL=['BUKU','MEJA','SAPI','KAKI','TALI','GULA','ROTI','KOPI','SUSU','PINTU','DASI','TOPI','JARI','EMBER','OMBAK','KURSI','BOLA','GIGI'];
  const sh=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;};
  let round=0, score=0, done=false; const T=[];
  el.innerHTML='<div style="padding:16px;color:#fff;text-align:center"><h3>🔗 Kata Terakhir</h3><p id="wc-info"></p><div style="font-size:15px;color:#aaa">Kata sekarang:</div><div id="wc-cur" style="font-size:40px;font-weight:bold;letter-spacing:3px;margin:4px"></div><p id="wc-hint"></p><div id="wc-opts" style="max-width:320px;margin:12px auto"></div></div>';
  const info=el.querySelector('#wc-info'), curEl=el.querySelector('#wc-cur'), hint=el.querySelector('#wc-hint'), opts=el.querySelector('#wc-opts');
  function show(){
    const cur=CHAIN[round], need=cur[cur.length-1], right=CHAIN[round+1];
    info.textContent='Ronde '+(round+1)+' dari 8 • Skor: '+score;
    curEl.textContent=cur;
    hint.textContent='Pilih kata yang diawali huruf "'+need+'"';
    opts.innerHTML='';
    const dis=sh(POOL.filter(w=>w[0]!==need&&w!==right)).slice(0,2);
    sh([right,...dis]).forEach(o=>{
      const b=document.createElement('button');
      b.style.cssText='display:block;width:100%;margin:7px 0;padding:13px;font-size:18px;border-radius:11px;border:none;background:#33507e;color:#fff;font-weight:bold;cursor:pointer;letter-spacing:2px';
      b.textContent=o;
      b.onclick=()=>{
        if(done) return;
        const ok=o===right; if(ok) score++;
        b.style.background=ok?'#00b06f':'#d64545';
        [...opts.children].forEach(x=>x.disabled=true);
        T.push(setTimeout(()=>{ round++; if(round>=8){ done=true; api.end(Math.round(score/8*100)); } else show(); },600));
      };
      opts.appendChild(b);
    });
  }
  show();
}});
