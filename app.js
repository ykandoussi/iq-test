const $=s=>document.querySelector(s),LT='ABCDE',app=$('#app');
const A=Q.map(()=>null),T=Q.map(()=>0),SEQ=Q.map(()=>null);
let i=-1,t0=0,t00=0,tick=null,to=[];
const SIZE=[46,26,20],XS=[[50],[34,66],[20,50,80]],PY=[28,50,72];

// Figuur-renderer voor matrices: s=vorm(0 cirkel,1 vierkant,2 driehoek), n=aantal(0..2), f=vulling(0 vol,1 leeg,2 grijs), p=verticale positie(0..2)
function fig(sp){
  const size=SIZE[sp.n],h=size/2,cy=PY[sp.p];let g='';
  XS[sp.n].forEach(x=>{
    const s=sp.s==0?`<circle r="${h}"/>`:sp.s==1?`<rect x="${-h}" y="${-h}" width="${size}" height="${size}"/>`:`<polygon points="0,${-h} ${h*0.87},${h/2} ${-h*0.87},${h/2}"/>`;
    const fa=sp.f==1?'none':'currentColor',op=sp.f==2?' fill-opacity=".35"':'';
    g+=`<g transform="translate(${x} ${cy})" fill="${fa}"${op} stroke="currentColor" stroke-width="3" stroke-linejoin="round">${s}</g>`;
  });
  return `<svg viewBox="0 0 100 100" aria-hidden="true">${g}</svg>`;
}
// Figuur-renderer voor rotatievragen (raster)
function norm(p){const a=Math.min(...p.map(v=>v[0])),b=Math.min(...p.map(v=>v[1]));return p.map(([x,y])=>[x-a,y-b])}
function xf(c,op){let p=op[0]=='m'?norm(c.map(([x,y])=>[-x,y])):norm(c);for(let k=0;k<+op[1];k++)p=norm(p.map(([x,y])=>[-y,x]));return p}
function gs(p){return `<svg viewBox="0 0 100 100" aria-hidden="true">${p.map(([x,y])=>`<rect x="${10+x*27}" y="${10+y*27}" width="25" height="25" rx="3" fill="currentColor"/>`).join('')}</svg>`}
function seqGen(n){const s=[];while(s.length<n){const d=Math.floor(Math.random()*10);if(s.length&&s[s.length-1]===d)continue;s.push(d)}return s}
function leave(){if(i>=0)T[i]+=(Date.now()-t0)/1000}
function clearTo(){to.forEach(clearTimeout);to=[]}
function clock(){const s=Math.floor((Date.now()-t00)/1000);$('#clock').textContent=String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}

function intro(){
  app.innerHTML=`<h1>Redeneertest</h1><p>Je krijgt ${Q.length} vragen, steeds één per scherm. Er zijn verschillende soorten: woorden, getallenreeksen, logica, rekenen, figuurpatronen, figuren die je moet herkennen na draaien en cijfers onthouden. De vragen worden over het algemeen moeilijker.</p><p>Kies per vraag het beste antwoord. Bij cijfers onthouden zie je de cijfers één voor één; typ ze daarna in. Je mag terug naar een vorige vraag. Werk nauwkeurig maar zonder hulp, rekenmachine of telefoon.</p><p class="s">Er is geen score zichtbaar. Aan het eind kopieer je de resultaten.</p><div class="nav"><span></span><button class="btn p" id="go">Start de test</button></div>`;
  $('#go').onclick=()=>{t00=Date.now();tick=setInterval(clock,1000);show(0)};
}

function show(n){
  leave();clearTo();i=n;t0=Date.now();const q=Q[i];
  let h=q.q?`<p class="q">${q.q}</p>`:'';
  if(q.d=='mat'){
    h+=`<div class="mg">${q.c.map(c=>`<div>${fig(c)}</div>`).join('')}<div class="qm">?</div></div><div class="opts f">${q.o.map((o,k)=>`<button class="opt fig" data-k="${k}" aria-label="Optie ${LT[k]}">${fig(o)}<span>${LT[k]}</span></button>`).join('')}</div>`;
  } else if(q.d=='rot'){
    h+=`<div class="ex">${gs(xf(q.c,'r0'))}</div><div class="opts f">${q.ops.map((o,k)=>`<button class="opt fig" data-k="${k}" aria-label="Optie ${LT[k]}">${gs(xf(q.c,o))}<span>${LT[k]}</span></button>`).join('')}</div>`;
  } else if(q.d=='span'){
    h+=`<p class="s">${q.mode=='fwd'?'Onthoud de cijfers. Typ ze daarna in dezelfde volgorde in.':'Onthoud de cijfers. Typ ze daarna in omgekeerde volgorde in.'}</p><div class="digit" id="dg" aria-live="polite"></div><div id="inp"></div>`;
  } else {
    h+=`<div class="opts">${q.o.map((o,k)=>`<button class="opt" data-k="${k}"><b>${LT[k]}</b>${o}</button>`).join('')}</div>`;
  }
  h+=`<div class="nav"><button class="btn" id="bk" ${i?'':'disabled'}>Vorige</button><button class="btn p" id="nx">${i==Q.length-1?'Afronden':'Volgende'}</button></div>`;
  app.innerHTML=h;
  $('#count').textContent=`Vraag ${i+1} van ${Q.length}`;
  $('#fill').style.width=(i/Q.length*100)+'%';
  if(q.d=='span')runSpan(q);
  else{
    const sel=()=>app.querySelectorAll('.opt').forEach(b=>b.classList.toggle('on',A[i]===+b.dataset.k));
    sel();
    app.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{A[i]=+b.dataset.k;sel()});
  }
  $('#bk').onclick=()=>show(i-1);
  $('#nx').onclick=()=>i==Q.length-1?finish():show(i+1);
}

function runSpan(q){
  const input=()=>{
    $('#inp').innerHTML=`<input id="typed" class="in" inputmode="numeric" autocomplete="off" aria-label="Typ de cijfers in" value="${A[i]||''}">`;
    $('#typed').oninput=e=>{A[i]=e.target.value||null};
  };
  if(SEQ[i]){$('#dg').textContent='';input();return}
  SEQ[i]=seqGen(q.len);
  const seq=SEQ[i];let k=0;
  const step=()=>{
    if(k<seq.length){
      $('#dg').textContent=seq[k];k++;
      to.push(setTimeout(()=>{$('#dg').textContent='';to.push(setTimeout(step,250))},900));
    } else input();
  };
  step();
}

function ansText(k){
  const q=Q[k];
  if(q.d=='span')return `getoond=${SEQ[k]?SEQ[k].join(''):'-'} | ingetypt=${A[k]||'-'}`;
  return A[k]===null?'-':(q.d=='txt'||q.d=='mat'||q.d=='rot')?LT[A[k]]:'-';
}

function finish(){
  leave();clearInterval(tick);clearTo();$('#fill').style.width='100%';$('#count').textContent='Klaar';
  const tot=Math.round((Date.now()-t00)/1000),open=A.filter(a=>a===null).length;
  const txt=`IQ-TEST RESULTATEN (v2)\nLeeftijd: 14 | Aantal vragen: ${Q.length} | Onbeantwoord: ${open}\nTotale tijd: ${tot} s | Datum: ${new Date().toISOString().slice(0,10)}\n\nvraag-id | antwoord | seconden\n`+Q.map((q,k)=>`${q.id} | ${ansText(k)} | ${T[k].toFixed(1)}`).join('\n');
  app.innerHTML=`<h1>Test afgerond</h1><p>Bedankt! Klik hieronder om de resultaten te kopiëren en stuur ze naar degene die de test heeft gemaakt.</p><button class="btn p big" id="cp">Kopieer resultaten voor analyse</button><textarea id="out" readonly></textarea><p class="s" id="msg"></p>`;
  $('#out').value=txt;
  $('#cp').onclick=async()=>{try{await navigator.clipboard.writeText(txt);$('#msg').textContent='Gekopieerd naar het klembord.'}catch(e){$('#out').select();document.execCommand('copy');$('#msg').textContent='Gekopieerd. Lukt het niet, selecteer dan de tekst hierboven en kopieer handmatig.'}};
}
intro();
