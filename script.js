/* ═══  STARS  ═══ */
for(let i=0;i<50;i++){const s=document.createElement('div');s.className='star';s.style.cssText=`left:${Math.random()*100}vw;top:${Math.random()*100}vh;animation-delay:${Math.random()*3}s;opacity:${Math.random()*0.5+0.15};`;document.body.appendChild(s);}

/* ═══  CONFETTI  ═══ */
const cvs=document.getElementById('confettiCanvas'),ctx=cvs.getContext('2d');let pieces=[];
const COLS=['#f9a8d4','#c4b5fd','#fcd5b5','#bbf7d0','#fde68a','#ec4899','#8b5cf6','#fb923c'];
function resizeCvs(){cvs.width=innerWidth;cvs.height=innerHeight;}resizeCvs();addEventListener('resize',resizeCvs);
function burst(n=100){for(let i=0;i<n;i++)pieces.push({x:Math.random()*cvs.width,y:-10,r:Math.random()*7+4,color:COLS[Math.floor(Math.random()*COLS.length)],vx:(Math.random()-.5)*5,vy:Math.random()*3+2,angle:Math.random()*360,spin:(Math.random()-.5)*9,shape:Math.random()>.5?'rect':'circle'});}
(function loop(){ctx.clearRect(0,0,cvs.width,cvs.height);pieces=pieces.filter(p=>p.y<cvs.height+20);pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.angle+=p.spin;p.vy+=.065;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.angle*Math.PI/180);ctx.fillStyle=p.color;ctx.globalAlpha=.88;if(p.shape==='rect')ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r);else{ctx.beginPath();ctx.arc(0,0,p.r,0,Math.PI*2);ctx.fill();}ctx.restore();});requestAnimationFrame(loop);})();

/* ═══  FLOATERS  ═══ */
const FE=['🎈','🌸','⭐','🎀','💖','✨','🌟','🎁','🦋','🌷'];const floatersEl=document.getElementById('floaters');
function addFloater(){const el=document.createElement('div');el.className='floater';el.textContent=FE[Math.floor(Math.random()*FE.length)];const dur=Math.random()*8+6;el.style.cssText=`left:${Math.random()*100}%;animation-duration:${dur}s;animation-delay:${Math.random()*4}s;font-size:clamp(.85rem,${Math.random()*2+1.4}vw,1.7rem);`;floatersEl.appendChild(el);setTimeout(()=>el.remove(),(dur+4)*1000);}
setInterval(addFloater,1300);for(let i=0;i<5;i++)addFloater();

/* ═══  FLOATING HEARTS  ═══ */
const hcvs=document.getElementById('heartsCanvas');
const hctx=hcvs.getContext('2d');
let hearts=[];
function resizeHcvs(){hcvs.width=innerWidth;hcvs.height=innerHeight;}
resizeHcvs();addEventListener('resize',resizeHcvs);
const HEART_EMOJIS=['💖','💗','💓','💕','💞','🩷','❤️','✨'];

function spawnHearts(){
  /* Spawn 60 hearts from random positions across the screen */
  for(let i=0;i<60;i++){
    hearts.push({
      x: Math.random()*hcvs.width,
      y: hcvs.height + 30,
      emoji: HEART_EMOJIS[Math.floor(Math.random()*HEART_EMOJIS.length)],
      size: Math.random()*28+14,
      vx: (Math.random()-0.5)*2.5,
      vy: -(Math.random()*3+2),
      alpha: 1,
      delay: Math.random()*1200, /* stagger start */
      born: Date.now(),
      swing: Math.random()*2*Math.PI,
      swingSpeed: (Math.random()-0.5)*0.06,
    });
  }
  if(!heartsActive) animateHearts();
}

let heartsActive=false;
function animateHearts(){
  heartsActive=true;
  hctx.clearRect(0,0,hcvs.width,hcvs.height);
  const now=Date.now();
  hearts=hearts.filter(h=>{
    if(now-h.born < h.delay) return true; /* waiting to spawn */
    h.swing+=h.swingSpeed;
    h.x+=h.vx+Math.sin(h.swing)*0.8;
    h.y+=h.vy;
    h.vy*=0.998; /* very slight deceleration */
    h.alpha-=0.004;
    if(h.alpha<=0||h.y<-60) return false;
    hctx.globalAlpha=h.alpha;
    hctx.font=`${h.size}px serif`;
    hctx.textAlign='center';
    hctx.fillText(h.emoji,h.x,h.y);
    return true;
  });
  hctx.globalAlpha=1;
  if(hearts.length>0) requestAnimationFrame(animateHearts);
  else heartsActive=false;
}

/* ═══  BIRTHDAY MUSIC  ═══ */
let audioCtx=null,gainNode=null,oscNodes=[],musicPlaying=false,loopTimeout=null;
const NOTES=[[264,.25],[264,.25],[297,.5],[264,.5],[352,.5],[330,1],[264,.25],[264,.25],[297,.5],[264,.5],[396,.5],[352,1],[264,.25],[264,.25],[528,.5],[440,.5],[352,.5],[330,.5],[297,.5],[470,.25],[470,.25],[440,.5],[352,.5],[396,.5],[352,1]];
function initAudio(){if(audioCtx)return;audioCtx=new(window.AudioContext||window.webkitAudioContext)();gainNode=audioCtx.createGain();gainNode.gain.setValueAtTime(.18,audioCtx.currentTime);gainNode.connect(audioCtx.destination);}
function scheduleTune(st){let t=st;const n=[];NOTES.forEach(([f,d])=>{const o=audioCtx.createOscillator();o.type='sine';o.frequency.setValueAtTime(f,t);o.connect(gainNode);o.start(t);o.stop(t+d-.02);n.push(o);t+=d;});oscNodes=n;return t;}
function startMusic(){initAudio();if(audioCtx.state==='suspended')audioCtx.resume();if(musicPlaying)return;musicPlaying=true;document.getElementById('musicBtn').textContent='🔊';function pl(){const e=scheduleTune(audioCtx.currentTime+.05);loopTimeout=setTimeout(()=>{if(musicPlaying)pl();},(e-audioCtx.currentTime)*1000+100);}pl();}
function stopMusic(){musicPlaying=false;clearTimeout(loopTimeout);oscNodes.forEach(o=>{try{o.stop();}catch(_){}});oscNodes=[];document.getElementById('musicBtn').textContent='🔇';}
document.getElementById('musicBtn').addEventListener('click',()=>{musicPlaying?stopMusic():startMusic();});

/* ═══  LETTER MUSIC — myValentine.mp3  ═══ */
let letterAudio=null,letterMusicPlaying=false;

function startLetterMusic(){
  if(letterMusicPlaying)return;
  letterMusicPlaying=true;
  letterAudio=new Audio('myValentine.mp3');
  letterAudio.loop=true;
  letterAudio.volume=0;
  letterAudio.play().catch(()=>{});
  /* Fade in over ~2s */
  let v=0;
  const fi=setInterval(()=>{v=Math.min(v+.02,.75);letterAudio.volume=v;if(v>=.75)clearInterval(fi);},80);
}

function stopLetterMusic(){
  if(!letterMusicPlaying||!letterAudio)return;
  letterMusicPlaying=false;
  const audio=letterAudio;letterAudio=null;
  let v=audio.volume;
  const fo=setInterval(()=>{v=Math.max(v-.05,0);audio.volume=v;if(v<=0){clearInterval(fo);audio.pause();audio.currentTime=0;}},60);
}

/* ═══  DARK MODE  ═══ */
let dark=false;document.getElementById('darkBtn').addEventListener('click',()=>{dark=!dark;document.documentElement.setAttribute('data-theme',dark?'dark':'light');document.getElementById('darkBtn').textContent=dark?'☀️':'🌙';});

/* ═══  PAGE TRANSITIONS  ═══ */
const landingPage=document.getElementById('landingPage'),gamePage=document.getElementById('gamePage'),backBtn=document.getElementById('backBtn');
document.getElementById('giftBtn').addEventListener('click',()=>{landingPage.classList.add('hidden');gamePage.classList.remove('hidden');backBtn.classList.add('show');burst(120);resetGame();});
backBtn.addEventListener('click',()=>{gamePage.classList.add('hidden');landingPage.classList.remove('hidden');backBtn.classList.remove('show');document.getElementById('samvernOverlay').classList.remove('show');document.getElementById('letterOverlay').classList.remove('show');msgOverlay.classList.remove('show');stopLetterMusic();dropping=false;gameActive=false;});

/* ═══  CLAW GAME  ═══ */
const TOYS=[
  {id:'toy0',img:'pattybara.png',name:'PattyBara',message:"Gotcha back, Mom! 🌸 Even on my sniffly, sleepy days, your hugs are the best victory. You're doing amazing as a mama. Happy Birthday!"},
  {id:'toy1',img:'side.png',name:'Side',message:"Yay, Mom found me! 🌟 You always know exactly where I am. Life is a wonderful surprise because of you. Keep bouncing forward with joy today! Happy Birthday!"},
  {id:'toy2',img:'astro.png',name:'Astro',message:"You're too clever for me, Mom! ✨ You always taught me to have courage, and look—it paid off! Thank you for helping me chase the stars. Happy Birthday!"},
  {id:'toy3',img:'capy.png',name:'Capy',message:"Mom, you caught me! 🐾 Every time you hold me close, I feel so safe and loved. You're the best mama ever—stay cozy and keep dreaming big. Happy Birthday!"},
  {id:'toy4',img:'ichi.png',name:'Ichi',message:"The purrfect catch by the purrfect Mom! 🎀 I get my persistence and heart from you. You're my champion every single day. Happy Birthday!"},
  {id:'toy5',img:'slowy.png',name:'Slowy',message:"Slow and steady... right into Mom's arms! 🐢 Thank you for being so patient and wonderful with me. I love you more than words can say. Happy Birthday!"},
  {id:'toy6',img:'cali.png',name:'Cali',message:"You caught me, you superstar Mama! 💖 You deserve all the happiness in the world today for everything you do for us. Happy Birthday!"}
];

let clawX=50,dropping=false,caughtCount=0,remaining=[...TOYS],pendingHit=null,gameActive=false;

const glassBox=document.getElementById('glassBox'),clawAssembly=document.getElementById('clawAssembly'),clawWire=document.getElementById('clawWire'),armLeft=document.getElementById('armLeft'),armRight=document.getElementById('armRight'),btnLeft=document.getElementById('btnLeft'),btnRight=document.getElementById('btnRight'),btnDrop=document.getElementById('btnDrop'),scoreBadge=document.getElementById('scoreBadge'),msgOverlay=document.getElementById('msgOverlay');

function setToyPositions(){TOYS.forEach(toy=>{const el=document.getElementById(toy.id);if(el&&!el.classList.contains('grabbed')){el.style.left=el.dataset.pos+'%';el.style.bottom=(el.dataset.bottom||'6')+'%';}});}
setToyPositions();addEventListener('resize',setToyPositions);

function lockEndButtons(){
  /* Disable all end-screen buttons while game is active */
  const sv=document.getElementById('svBtn');
  const lr=document.getElementById('btnReplay');
  if(sv){sv.disabled=true;}
  if(lr){lr.disabled=true;lr.classList.remove('visible');}
}
function unlockEndButtons(){
  /* Called only when game is fully over */
  /* svBtn gets re-enabled when Samvern overlay is shown */
  /* btnReplay gets re-enabled only after letter finishes typing */
}

function resetGame(){
  clawX=50;dropping=false;caughtCount=0;remaining=[...TOYS];pendingHit=null;
  popClosing=false;svClosing=false;replayClosing=false;
  gameActive=true;

  clawAssembly.style.left='50%';clawWire.style.height='40px';
  armLeft.className='claw-arm left';armRight.className='claw-arm right';
  btnDrop.textContent='DROP! 🎀';
  scoreBadge.textContent='Gifts caught: 0 / 7 🎁';
  setButtons(false);

  /* Always disable end-screen buttons at game start */
  lockEndButtons();

  TOYS.forEach(toy=>{
    let el=document.getElementById(toy.id);
    if(!el){el=document.createElement('div');el.className='toy';el.id=toy.id;const pm={toy0:'8',toy1:'24',toy2:'42',toy3:'60',toy4:'76',toy5:'16',toy6:'54'};const bm={toy0:'6',toy1:'6',toy2:'6',toy3:'6',toy4:'6',toy5:'30',toy6:'30'};el.dataset.pos=pm[toy.id];el.dataset.bottom=bm[toy.id];el.innerHTML=`<img src="${toy.img}" class="toy-img" alt="${toy.name}" />`;glassBox.insertBefore(el,glassBox.querySelector('.chute'));}
    el.style.left=el.dataset.pos+'%';el.style.bottom=(el.dataset.bottom||'6')+'%';el.style.opacity='1';el.style.transition='';el.classList.remove('grabbed');
  });

  document.getElementById('samvernOverlay').classList.remove('show');
  document.getElementById('letterOverlay').classList.remove('show');
  msgOverlay.classList.remove('show');
}

function setButtons(off){btnLeft.disabled=off;btnRight.disabled=off;btnDrop.disabled=off;}
function moveClaw(dir){if(dropping)return;clawX=Math.max(6,Math.min(94,clawX+dir*8));clawAssembly.style.left=clawX+'%';}

function dropClaw(){
  if(!gameActive||dropping||remaining.length===0)return;
  dropping=true;setButtons(true);
  const boxRect=glassBox.getBoundingClientRect(),boxH=boxRect.height;
  const chEl=clawAssembly.querySelector('.claw-head'),cgEl=clawAssembly.querySelector('.claw-grip');
  const chH=chEl?chEl.getBoundingClientRect().height:8,cgH=cgEl?cgEl.getBoundingClientRect().height:22;
  let hit=null,stopWireH=Math.max(boxH*.80,80);
  for(const toy of remaining){const el=document.getElementById(toy.id);if(!el)continue;if(Math.abs(clawX-parseFloat(el.dataset.pos))<11){hit=toy;const tbp=parseFloat(el.dataset.bottom||'6')/100,th=el.getBoundingClientRect().height||50;stopWireH=Math.max(boxH-tbp*boxH-th-chH,20);break;}}
  const DS=2.5,RS=3.8;let wireH=40;
  function animateDrop(){wireH=Math.min(wireH+DS,stopWireH);clawWire.style.height=wireH+'px';if(wireH<stopWireH)requestAnimationFrame(animateDrop);else onReachedToy();}
  function onReachedToy(){armLeft.className='claw-arm closed-left';armRight.className='claw-arm closed-right';if(hit){const el=document.getElementById(hit.id);if(el){el.classList.add('grabbed');el.style.transition='none';const th=el.getBoundingClientRect().height||50;const gb=chH+wireH+cgH;el.style.bottom=Math.max(boxH-gb-th,0)+'px';el.style.left=clawX+'%';}}setTimeout(animateRetract,280);}
  function animateRetract(){wireH=Math.max(wireH-RS,40);clawWire.style.height=wireH+'px';if(hit){const el=document.getElementById(hit.id);if(el){const th=el.getBoundingClientRect().height||50;const gb=chH+wireH+cgH;el.style.bottom=Math.max(boxH-gb-th,0)+'px';el.style.left=clawX+'%';}}if(wireH>40)requestAnimationFrame(animateRetract);else onRetracted();}
  function onRetracted(){if(hit){const el=document.getElementById(hit.id);if(el){el.style.opacity='0';setTimeout(()=>{try{el.remove();}catch(_){}},350);}pendingHit=hit;burst(80);showPrize(hit);}else{finishDrop();}}
  requestAnimationFrame(animateDrop);
}

function finishDrop(){
  dropping=false;armLeft.className='claw-arm left';armRight.className='claw-arm right';
  if(remaining.length>0){setButtons(false);}
  else{gameActive=false;btnDrop.textContent='🎉 All Done!';btnDrop.disabled=true;setTimeout(showSamvern,700);}
}

function showPrize(toy){
  document.getElementById('popEmoji').innerHTML=`<img src="${toy.img}" class="pop-toy-img" alt="${toy.name}" />`;
  document.getElementById('popName').innerHTML=`<span class="pop-name-inner">${toy.name}</span>`;
  document.getElementById('popText').textContent=toy.message;
  msgOverlay.classList.add('show');
}

let popClosing=false;
function closePop(){
  if(popClosing)return;popClosing=true;
  msgOverlay.classList.remove('show');
  if(pendingHit){remaining=remaining.filter(t=>t.id!==pendingHit.id);caughtCount++;scoreBadge.textContent=`Gifts caught: ${caughtCount} / 7 🎁`;pendingHit=null;}
  setTimeout(()=>{popClosing=false;finishDrop();},350);
}
document.getElementById('btnClosePop').addEventListener('click',e=>{e.stopPropagation();closePop();});
document.getElementById('btnClosePop').addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();closePop();},{passive:false});

/* ═══  SAMVERN  ═══ */
const SAMVERN_MSG="Hi mommy, daddy didn't forget me! 🌟\n\nI've always been there in every single moment and talk between you and dad.\n\nEnjoy your birthday, mom!\nI'm always watching over you with love. 🤍";
const samvernOverlay=document.getElementById('samvernOverlay'),svMessageEl=document.getElementById('svMessage'),svBtn=document.getElementById('svBtn');

function showSamvern(){
  /* Enable the svBtn now that the game is over */
  svBtn.disabled=false;
  samvernOverlay.classList.add('show');
  svMessageEl.textContent='';svMessageEl.classList.add('typing');svBtn.classList.remove('visible');
  const lines=SAMVERN_MSG.split('\n');
  setTimeout(()=>{let li=0,ci=0;function typeNext(){if(li>=lines.length){svMessageEl.classList.remove('typing');setTimeout(()=>svBtn.classList.add('visible'),600);return;}if(ci<lines[li].length){svMessageEl.appendChild(document.createTextNode(lines[li][ci++]));setTimeout(typeNext,36);}else{svMessageEl.appendChild(document.createElement('br'));const wasBlank=lines[li]==='';li++;ci=0;setTimeout(typeNext,wasBlank?220:36);}}typeNext();},900);
}

let svClosing=false;
function closeSamvern(){
  if(svClosing||svBtn.disabled)return;svClosing=true;
  samvernOverlay.classList.remove('show');stopMusic();
  setTimeout(()=>{svClosing=false;startLetterMusic();showLetter();},600);
}
svBtn.addEventListener('click',e=>{e.stopPropagation();closeSamvern();});
svBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();closeSamvern();},{passive:false});

/* ═══  DADDY'S LETTER  ═══ */
const DADDY_LETTER=[
  "I'm sorry na hindi mo ako kasama today. Babawi ako sa'yo sa susunod—ilibre kita ng chicken, ice cream, shake, fries, kahit ano pa 'yan, hehe.",
  "Sa ngayon, ito muna ang maliit na regalo ko para sa'yo. Hindi man siya ganun ka-effort, gusto ko pa rin maramdaman mo na sa pamamagitan ng mga anak natin, I will always be there. Yakapin mo lang sila—lalo na si Pattybara—at ipaparamdam nila sa'yo na andiyan lang si Daddy para sa kanila, at higit sa lahat, para sa Mommy nila.",
  "Mahal, maraming salamat sa lahat ng pag-intindi at pagsama mo sa'kin. Kahit minsan wala akong sapat na pera tuwing lumalabas tayo, nandiyan ka para umintindi at akuin ang mga gastusin. Kahit pakiramdam ko minsan parang sampal iyon sa pride ko, pinaparamdam mo pa rin na okay lang ang lahat.",
  "Salamat, Samsam, dahil kahit hindi ako perpekto, marunong kang mag-adjust at unawain ako para lang maging komportable ako. Hindi ko man maibigay lahat ngayon, pero gagawa ako ng paraan para maibigay sa'yo ang lahat ng pangangailangan mo at mga bagay na gusto mo.",
  "Hindi man ako ang pinaka-perpektong lalaki para sa'yo, araw-araw pipiliin pa rin kitang mahalin at panindigan. Pangako ko na patuloy akong magsisikap para maging mas mabuting partner at ama para sa pamilyang binubuo natin.",
  "I love you. 💓"
];
const letterOverlay=document.getElementById('letterOverlay'),letterBody=document.getElementById('letterBody'),btnReplay=document.getElementById('btnReplay');

function showLetter(){
  burst(60);letterOverlay.classList.add('show');letterBody.innerHTML='';
  btnReplay.disabled=true;btnReplay.classList.remove('visible');
  let pIdx=0;
  function typeNextParagraph(){
    if(pIdx>=DADDY_LETTER.length){
      setTimeout(()=>{btnReplay.disabled=false;btnReplay.classList.add('visible');},400);
      return;
    }
    const p=document.createElement('p');p.className='letter-para';letterBody.appendChild(p);
    const text=DADDY_LETTER[pIdx++];let ci=0;
    function typeChar(){if(ci<text.length){p.appendChild(document.createTextNode(text[ci++]));letterBody.scrollTop=letterBody.scrollHeight;setTimeout(typeChar,22);}else{setTimeout(typeNextParagraph,700);}}
    typeChar();
  }
  typeNextParagraph();
}

let replayClosing=false;
function doReplay(){
  if(replayClosing||gameActive||btnReplay.disabled)return;
  replayClosing=true;btnReplay.disabled=true;
  /* Spawn hearts first */
  spawnHearts();
  /* After hearts bloom, go to LANDING PAGE */
  setTimeout(()=>{
    letterOverlay.classList.remove('show');
    stopLetterMusic();
    setTimeout(()=>{
      replayClosing=false;
      gamePage.classList.add('hidden');
      backBtn.classList.remove('show');
      landingPage.classList.remove('hidden');
      /* Silently reset so next play starts fresh */
      dropping=false;gameActive=false;caughtCount=0;remaining=[...TOYS];pendingHit=null;
      popClosing=false;svClosing=false;replayClosing=false;
      lockEndButtons();
    },400);
  },1800);
}
btnReplay.addEventListener('click',e=>{e.stopPropagation();doReplay();});
btnReplay.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();doReplay();},{passive:false});

/* ═══  CONTROLS  ═══ */
const held={};
document.addEventListener('keydown',e=>{if(['Space','ArrowLeft','ArrowRight','ArrowDown','ArrowUp'].includes(e.code))e.preventDefault();if(held[e.code])return;held[e.code]=true;if(e.code==='ArrowLeft'||e.code==='KeyA')moveClaw(-1);if(e.code==='ArrowRight'||e.code==='KeyD')moveClaw(1);if(['Space','Enter','ArrowDown','KeyS'].includes(e.code))dropClaw();});
document.addEventListener('keyup',e=>{delete held[e.code];});
btnLeft.addEventListener('click',()=>moveClaw(-1));btnRight.addEventListener('click',()=>moveClaw(1));btnDrop.addEventListener('click',()=>dropClaw());
let holdTimer=null;
function startHold(dir){moveClaw(dir);holdTimer=setInterval(()=>moveClaw(dir),180);}
function stopHold(){clearInterval(holdTimer);holdTimer=null;}
btnLeft.addEventListener('touchstart',e=>{e.preventDefault();startHold(-1);},{passive:false});
btnLeft.addEventListener('touchend',e=>{e.preventDefault();stopHold();},{passive:false});
btnLeft.addEventListener('touchcancel',e=>{e.preventDefault();stopHold();},{passive:false});
btnRight.addEventListener('touchstart',e=>{e.preventDefault();startHold(1);},{passive:false});
btnRight.addEventListener('touchend',e=>{e.preventDefault();stopHold();},{passive:false});
btnRight.addEventListener('touchcancel',e=>{e.preventDefault();stopHold();},{passive:false});
btnDrop.addEventListener('touchstart',e=>{e.preventDefault();dropClaw();},{passive:false});
