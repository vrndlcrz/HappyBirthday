/* ═══════════════════════════════════════
   STARS
═══════════════════════════════════════ */
for (let i = 0; i < 50; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  s.style.cssText = `
    left:  ${Math.random() * 100}vw;
    top:   ${Math.random() * 100}vh;
    animation-delay: ${Math.random() * 3}s;
    opacity: ${Math.random() * 0.5 + 0.15};
  `;
  document.body.appendChild(s);
}

/* ═══════════════════════════════════════
   CONFETTI
═══════════════════════════════════════ */
const cvs = document.getElementById('confettiCanvas');
const ctx = cvs.getContext('2d');
let pieces = [];

const COLS = ['#f9a8d4','#c4b5fd','#fcd5b5','#bbf7d0','#fde68a','#ec4899','#8b5cf6','#fb923c'];

function resizeCvs() {
  cvs.width  = innerWidth;
  cvs.height = innerHeight;
}
resizeCvs();
addEventListener('resize', resizeCvs);

function burst(n = 100) {
  for (let i = 0; i < n; i++) {
    pieces.push({
      x:     Math.random() * cvs.width,
      y:     -10,
      r:     Math.random() * 7 + 4,
      color: COLS[Math.floor(Math.random() * COLS.length)],
      vx:    (Math.random() - 0.5) * 5,
      vy:    Math.random() * 3 + 2,
      angle: Math.random() * 360,
      spin:  (Math.random() - 0.5) * 9,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    });
  }
}

(function loop() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
  pieces = pieces.filter(p => p.y < cvs.height + 20);
  pieces.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.angle += p.spin;
    p.vy += 0.065;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle * Math.PI / 180);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.88;
    if (p.shape === 'rect') ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
    else { ctx.beginPath(); ctx.arc(0, 0, p.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  });
  requestAnimationFrame(loop);
})();

/* ═══════════════════════════════════════
   FLOATING EMOJIS
═══════════════════════════════════════ */
const FE = ['🎈','🌸','⭐','🎀','💖','✨','🌟','🎁','🦋','🌷'];
const floatersEl = document.getElementById('floaters');

function addFloater() {
  const el  = document.createElement('div');
  el.className = 'floater';
  el.textContent = FE[Math.floor(Math.random() * FE.length)];
  const dur = Math.random() * 8 + 6;
  el.style.cssText = `
    left: ${Math.random() * 100}%;
    animation-duration: ${dur}s;
    animation-delay: ${Math.random() * 4}s;
    font-size: clamp(.85rem, ${Math.random() * 2 + 1.4}vw, 1.7rem);
  `;
  floatersEl.appendChild(el);
  setTimeout(() => el.remove(), (dur + 4) * 1000);
}

setInterval(addFloater, 1300);
for (let i = 0; i < 5; i++) addFloater();

/* ═══════════════════════════════════════
   MUSIC
   - Starts muted (🔇)
   - Click to play (🔊), click again to mute
   - No sound stacking: guard prevents re-entry
═══════════════════════════════════════ */
let audioCtx    = null;
let gainNode    = null;
let oscNodes    = [];
let musicPlaying = false;
let loopTimeout = null;

const NOTES = [
  [264,.25],[264,.25],[297,.5],[264,.5],[352,.5],[330,1],
  [264,.25],[264,.25],[297,.5],[264,.5],[396,.5],[352,1],
  [264,.25],[264,.25],[528,.5],[440,.5],[352,.5],[330,.5],[297,.5],
  [470,.25],[470,.25],[440,.5],[352,.5],[396,.5],[352,1],
];

function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.18, audioCtx.currentTime);
  gainNode.connect(audioCtx.destination);
}

function scheduleTune(startTime) {
  let t = startTime;
  const newOscs = [];
  NOTES.forEach(([freq, dur]) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.connect(gainNode);
    osc.start(t);
    osc.stop(t + dur - 0.02);
    newOscs.push(osc);
    t += dur;
  });
  oscNodes = newOscs;
  return t;
}

function startMusic() {
  initAudio();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  if (musicPlaying) return;           // ← no stacking
  musicPlaying = true;
  document.getElementById('musicBtn').textContent = '🔊';

  function playLoop() {
    const endTime = scheduleTune(audioCtx.currentTime + 0.05);
    const msLeft  = (endTime - audioCtx.currentTime) * 1000 + 100;
    loopTimeout   = setTimeout(() => { if (musicPlaying) playLoop(); }, msLeft);
  }
  playLoop();
}

function stopMusic() {
  musicPlaying = false;
  clearTimeout(loopTimeout);
  oscNodes.forEach(o => { try { o.stop(); } catch (_) {} });
  oscNodes = [];
  document.getElementById('musicBtn').textContent = '🔇';
}

document.getElementById('musicBtn').addEventListener('click', () => {
  musicPlaying ? stopMusic() : startMusic();
});

/* ═══════════════════════════════════════
   DARK MODE
═══════════════════════════════════════ */
let dark = false;
document.getElementById('darkBtn').addEventListener('click', () => {
  dark = !dark;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  document.getElementById('darkBtn').textContent = dark ? '☀️' : '🌙';
});

/* ═══════════════════════════════════════
   PAGE TRANSITIONS
═══════════════════════════════════════ */
const landingPage       = document.getElementById('landingPage');
const gamePage          = document.getElementById('gamePage');
const backBtn           = document.getElementById('backBtn');
const slideshowOverlay  = document.getElementById('slideshowOverlay');

document.getElementById('giftBtn').addEventListener('click', () => {
  landingPage.classList.add('hidden');
  gamePage.classList.remove('hidden');
  backBtn.classList.add('show');
  burst(120);
  resetGame();
});

backBtn.addEventListener('click', () => {
  gamePage.classList.add('hidden');
  slideshowOverlay.classList.remove('show');
  landingPage.classList.remove('hidden');
  backBtn.classList.remove('show');
});

/* ═══════════════════════════════════════
   SLIDESHOW
═══════════════════════════════════════ */
const SLIDES = [
  { emoji: '🌟', caption: 'You shine so bright!',   sub: 'Every room lights up the moment you walk in. Never forget how brilliant you are.' },
  { emoji: '🌺', caption: 'Beautiful inside & out',  sub: 'Like the most beautiful flower in full bloom — that\'s you, always and forever.' },
  { emoji: '🎂', caption: 'Another amazing year!',   sub: 'Each candle represents a chapter of your incredible story. Here\'s to many more!' },
  { emoji: '🦋', caption: 'You\'ve grown so much',   sub: 'Watching you transform and flourish has been the most beautiful thing to witness.' },
  { emoji: '💖', caption: 'So deeply loved',         sub: 'You are cherished more than words can ever express. Happy Birthday, superstar!' },
  { emoji: '🎊', caption: 'Celebrate YOU today!',    sub: 'You deserve all the confetti, all the cake, and every single happiness in the world.' },
];

const ssFrame = document.getElementById('ssFrame');
const ssDots  = document.getElementById('ssDots');
let ssIdx = 0;

SLIDES.forEach((slide, i) => {
  /* slide card */
  const el = document.createElement('div');
  el.className = 'ss-slide' + (i === 0 ? ' active' : '');
  el.dataset.idx = i;
  /* Use .ss-caption-inner span so Pacifico caption gradient isn't clipped */
  el.innerHTML = `
    <div class="ss-photo">${slide.emoji}</div>
    <p class="ss-caption"><span class="ss-caption-inner">${slide.caption}</span></p>
    <p class="ss-subcap">${slide.sub}</p>
  `;
  ssFrame.appendChild(el);

  /* dot */
  const dot = document.createElement('div');
  dot.className = 'ss-dot' + (i === 0 ? ' active' : '');
  dot.addEventListener('click', () => { goToSlide(i); stopAuto(); startAuto(); });
  ssDots.appendChild(dot);
});

function updateSlideshow() {
  ssFrame.querySelectorAll('.ss-slide').forEach((s, i) => {
    s.classList.toggle('active', i === ssIdx);
    if (i !== ssIdx) s.classList.remove('exit');
  });
  ssDots.querySelectorAll('.ss-dot').forEach((d, i) => {
    d.classList.toggle('active', i === ssIdx);
  });
  document.getElementById('ssCounter').textContent = `${ssIdx + 1} / ${SLIDES.length}`;
}

function goToSlide(n) {
  ssIdx = ((n % SLIDES.length) + SLIDES.length) % SLIDES.length;
  updateSlideshow();
}

let ssAuto = null;
function startAuto() { ssAuto = setInterval(() => goToSlide(ssIdx + 1), 4000); }
function stopAuto()  { clearInterval(ssAuto); }

document.getElementById('ssNext').addEventListener('click', () => { stopAuto(); goToSlide(ssIdx + 1); startAuto(); });
document.getElementById('ssPrev').addEventListener('click', () => { stopAuto(); goToSlide(ssIdx - 1); startAuto(); });
ssFrame.addEventListener('mouseenter', () => stopAuto());
ssFrame.addEventListener('mouseleave', () => { if (slideshowOverlay.classList.contains('show')) startAuto(); });

/* ═══════════════════════════════════════
   CLAW GAME
═══════════════════════════════════════ */
const TOYS = [
  { id:'toy0', img:'pattybara.png',      name:'PattyBara',      message:"Gotcha back, Mom! 🌸 Even on my sniffly, sleepy days, your hugs are the best victory. You’re doing amazing as a mama. Happy Birthday!" },
  { id:'toy1', img:'side.png',       name:'Side',       message:"Yay, Mom found me! 🌟 You always know exactly where I am. Life is a wonderful surprise because of you. Keep bouncing forward with joy today! Happy Birthday!" },
  { id:'toy2', img:'astro.png',      name:'Astro',     message:"You’re too clever for me, Mom! ✨ You always taught me to have courage, and look—it paid off! Thank you for helping me chase the stars. Happy Birthday!" },
  { id:'toy3', img:'capy.png', name:'Capy', message:"Mom, you caught me! 🐾 Every time you hold me close, I feel so safe and loved. You’re the best mama ever—stay cozy and keep dreaming big. Happy Birthday!" },
  { id:'toy4', img:'ichi.png',           name:'Ichi',           message:"The purrfect catch by the purrfect Mom! 🎀 I get my persistence and heart from you. You’re my champion every single day. Happy Birthday!" },
  { id:'toy5', img:'slowy.png',          name:'Slowy',          message:"Slow and steady... right into Mom's arms! 🐢 Thank you for being so patient and wonderful with me. I love you more than words can say. Happy Birthday!" },
  { id:'toy6', img:'cali.png',           name:'Cali',           message:"You caught me, you superstar Mama! 💖 You deserve all the happiness in the world today for everything you do for us. Happy Birthday!" }
];

let clawX      = 50;
let dropping   = false;
let caughtCount = 0;
let remaining  = [...TOYS];
let pendingHit  = null;

const glassBox     = document.getElementById('glassBox');
const clawAssembly = document.getElementById('clawAssembly');
const clawWire     = document.getElementById('clawWire');
const armLeft      = document.getElementById('armLeft');
const armRight     = document.getElementById('armRight');
const btnLeft      = document.getElementById('btnLeft');
const btnRight     = document.getElementById('btnRight');
const btnDrop      = document.getElementById('btnDrop');
const scoreBadge   = document.getElementById('scoreBadge');
const msgOverlay   = document.getElementById('msgOverlay');

function setToyPositions() {
  TOYS.forEach(toy => {
    const el = document.getElementById(toy.id);
    if (el && !el.classList.contains('grabbed')) {
      el.style.left   = el.dataset.pos + '%';
      el.style.bottom = (el.dataset.bottom || '6') + '%';
    }
  });
}
setToyPositions();
addEventListener('resize', setToyPositions);

function resetGame() {
  clawX       = 50;
  dropping    = false;
  caughtCount = 0;
  remaining   = [...TOYS];
  pendingHit  = null;

  clawAssembly.style.left   = '50%';
  clawWire.style.height     = '40px';
  armLeft.className         = 'claw-arm left';
  armRight.className        = 'claw-arm right';
  btnDrop.textContent       = 'DROP! 🎀';
  scoreBadge.textContent    = 'Gifts caught: 0 / 7 🎁';

  setButtons(false);

  /* Restore toys */
  TOYS.forEach(toy => {
    let el = document.getElementById(toy.id);
    if (!el) {
      el = document.createElement('div');
      el.className    = 'toy';
      el.id           = toy.id;
      const posMap    = { toy0:'8',  toy1:'24', toy2:'42', toy3:'60', toy4:'76', toy5:'16', toy6:'54' };
      const bottomMap = { toy0:'6',  toy1:'6',  toy2:'6',  toy3:'6',  toy4:'6',  toy5:'30', toy6:'30' };
      el.dataset.pos    = posMap[toy.id];
      el.dataset.bottom = bottomMap[toy.id];
      el.innerHTML = `<img src="${toy.img}" class="toy-img" alt="${toy.name}" />`;
      glassBox.insertBefore(el, glassBox.querySelector('.chute'));
    }
    el.style.left    = el.dataset.pos + '%';
    el.style.bottom  = (el.dataset.bottom || '6') + '%';
    el.style.opacity = '1';
    el.classList.remove('grabbed');
  });

  slideshowOverlay.classList.remove('show');
  msgOverlay.classList.remove('show');
  const _sv = document.getElementById('samvernOverlay'); if (_sv) _sv.classList.remove('show');
  stopAuto();
  ssIdx = 0;
  updateSlideshow();
}

function setButtons(off) {
  btnLeft.disabled = btnRight.disabled = btnDrop.disabled = off;
}

function moveClaw(dir) {
  if (dropping) return;
  clawX = Math.max(6, Math.min(94, clawX + dir * 8));
  clawAssembly.style.left = clawX + '%';
}

function dropClaw() {
  if (dropping || remaining.length === 0) return;
  dropping = true;
  setButtons(true);

  const boxRect = glassBox.getBoundingClientRect();
  const boxH    = boxRect.height;

  /* Heights of the claw head + grip (measured once from DOM) */
  const clawHeadEl  = clawAssembly.querySelector('.claw-head');
  const clawGripEl  = clawAssembly.querySelector('.claw-grip');
  const clawHeadH   = clawHeadEl  ? clawHeadEl.getBoundingClientRect().height  : 8;
  const clawGripH   = clawGripEl  ? clawGripEl.getBoundingClientRect().height  : 22;
  /* Total fixed height above and below the wire */
  const clawTipOffset = clawHeadH + clawGripH; /* px from box-top to bottom of claw grip */

  /* ── Detect hit BEFORE dropping so we know target depth ── */
  let hit     = null;
  let stopWireH = Math.max(boxH * 0.80, 80); /* default: drop to near-bottom */

  for (const toy of remaining) {
    const el = document.getElementById(toy.id);
    if (!el) continue;
    if (Math.abs(clawX - parseFloat(el.dataset.pos)) < 11) {
      hit = toy;
      /* We want the claw grip bottom to reach the toy's top edge.
         toy top from box-top = boxH - (bottom% * boxH) - toyHeight        */
      const toyBottomPct = parseFloat(el.dataset.bottom || '6') / 100;
      const toyH         = el.getBoundingClientRect().height || 50;
      const toyTopFromBoxTop = boxH - toyBottomPct * boxH - toyH;
      /* wire length = distance from box top to toy top, minus fixed claw parts above wire */
      stopWireH = Math.max(toyTopFromBoxTop - clawHeadH, 20);
      break;
    }
  }

  /* ── Phase 1: animate wire dropping ── */
  const DROP_SPEED    = 2.5;   /* px per frame going down  */
  const RETRACT_SPEED = 3.8;   /* px per frame going up    */
  let   wireH = 40;

  function animateDrop() {
    wireH = Math.min(wireH + DROP_SPEED, stopWireH);
    clawWire.style.height = wireH + 'px';
    if (wireH < stopWireH) {
      requestAnimationFrame(animateDrop);
    } else {
      onReachedToy();
    }
  }

  function onReachedToy() {
    /* Close the claws */
    armLeft.className  = 'claw-arm closed-left';
    armRight.className = 'claw-arm closed-right';

    /* If we have a hit, snap the toy directly under the grip RIGHT NOW */
    if (hit) {
      const el = document.getElementById(hit.id);
      if (el) {
        el.classList.add('grabbed');
        el.style.transition = 'none'; /* disable CSS transition — JS owns position */
        /* Position toy so its top is flush with the claw grip bottom.
           claw grip bottom from box top = clawHeadH + wireH + clawGripH
           toy bottom from box bottom    = boxH - (gripBottom + toyH)          */
        const toyH      = el.getBoundingClientRect().height || 50;
        const gripBottomFromBoxTop = clawHeadH + wireH + clawGripH;
        const toyBottomPx = boxH - gripBottomFromBoxTop - toyH;
        el.style.bottom = Math.max(toyBottomPx, 0) + 'px';
        el.style.left   = clawX + '%';
      }
    }

    /* Short pause so player sees the grab, then retract */
    setTimeout(animateRetract, 280);
  }

  function animateRetract() {
    wireH = Math.max(wireH - RETRACT_SPEED, 40);
    clawWire.style.height = wireH + 'px';

    /* Keep toy glued to claw grip bottom every frame */
    if (hit) {
      const el = document.getElementById(hit.id);
      if (el) {
        const toyH = el.getBoundingClientRect().height || 50;
        const gripBottomFromBoxTop = clawHeadH + wireH + clawGripH;
        const toyBottomPx = boxH - gripBottomFromBoxTop - toyH;
        el.style.bottom = Math.max(toyBottomPx, 0) + 'px';
        el.style.left   = clawX + '%';
      }
    }

    if (wireH > 40) {
      requestAnimationFrame(animateRetract);
    } else {
      onRetracted();
    }
  }

  function onRetracted() {
    if (hit) {
      const el = document.getElementById(hit.id);
      if (el) {
        el.style.opacity = '0';
        setTimeout(() => { try { el.remove(); } catch(_){} }, 350);
      }
      pendingHit = hit;
      burst(80);
      showPrize(hit);
    } else {
      finishDrop();
    }
  }

  /* Kick off the drop */
  requestAnimationFrame(animateDrop);
}

function finishDrop() {
  dropping = false;
  armLeft.className  = 'claw-arm left';
  armRight.className = 'claw-arm right';

  if (remaining.length > 0) {
    setButtons(false);
  } else {
    btnDrop.textContent  = '🎉 All Done!';
    btnDrop.disabled     = true;
    setTimeout(showSamvern, 700);
  }
}

function showPrize(toy) {
  /* pop-name uses inner span so gradient isn't clipped */
  document.getElementById('popEmoji').innerHTML = `<img src="${toy.img}" class="pop-toy-img" alt="${toy.name}" />`;
  document.getElementById('popName').innerHTML    = `<span class="pop-name-inner">${toy.name}</span>`;
  document.getElementById('popText').textContent  = toy.message;
  msgOverlay.classList.add('show');
}

function showSlideshow() {
  burst(200);
  ssIdx = 0;
  updateSlideshow();
  slideshowOverlay.classList.add('show');
  startAuto();
}

/* ── SAMVERN HIDDEN MESSAGE ── */
const SAMVERN_MSG =
  "Hi mommy, daddy didn't forget me! 🕊️\n\n" +
  "I've always been there in every single moment and talk between you and dad.\n\n" +
  "Enjoy your birthday, mom!\n" +
  "I'm always watching over you with love. 🤍";

const samvernOverlay = document.getElementById('samvernOverlay');
const svMessageEl    = document.getElementById('svMessage');
const svBtn          = document.getElementById('svBtn');

function showSamvern() {
  samvernOverlay.classList.add('show');
  svMessageEl.textContent = '';
  svMessageEl.classList.add('typing');
  svBtn.classList.remove('visible');
  const lines = SAMVERN_MSG.split('\n');
  setTimeout(() => {
    let li = 0, ci = 0;
    function typeNext() {
      if (li >= lines.length) {
        svMessageEl.classList.remove('typing');
        setTimeout(() => svBtn.classList.add('visible'), 600);
        return;
      }
      if (ci < lines[li].length) {
        svMessageEl.appendChild(document.createTextNode(lines[li][ci++]));
        setTimeout(typeNext, 38);
      } else {
        svMessageEl.appendChild(document.createElement('br'));
        li++; ci = 0;
        setTimeout(typeNext, lines[li - 1] === '' ? 200 : 38);
      }
    }
    typeNext();
  }, 900);
}

function closeSamvern() {
  samvernOverlay.classList.remove('show');
  setTimeout(showSlideshow, 650);
}
svBtn.addEventListener('click', () => closeSamvern());
svBtn.addEventListener('touchstart', e => { e.preventDefault(); closeSamvern(); }, { passive: false });


/* ── Close popup ── */
function closePop() {
  msgOverlay.classList.remove('show');
  if (pendingHit) {
    remaining  = remaining.filter(t => t.id !== pendingHit.id);
    caughtCount++;
    scoreBadge.textContent = `Gifts caught: ${caughtCount} / 7 🎁`;
    pendingHit = null;
  }
  finishDrop();
}

document.getElementById('btnClosePop').addEventListener('click', closePop);
document.getElementById('btnClosePop').addEventListener('touchstart', e => {
  e.preventDefault();
  closePop();
}, { passive: false });

/* ── Replay ── */
document.getElementById('btnReplay').addEventListener('click', () => {
  slideshowOverlay.classList.remove('show');
  stopAuto();
  resetGame();
});

/* ── Keyboard controls ── */
const held = {};
document.addEventListener('keydown', e => {
  if (['Space','ArrowLeft','ArrowRight','ArrowDown','ArrowUp'].includes(e.code)) e.preventDefault();
  if (held[e.code]) return;
  held[e.code] = true;
  if (e.code === 'ArrowLeft'  || e.code === 'KeyA') moveClaw(-1);
  if (e.code === 'ArrowRight' || e.code === 'KeyD') moveClaw(1);
  if (['Space','Enter','ArrowDown', 'KeyS'].includes(e.code)) dropClaw();
});
document.addEventListener('keyup', e => { delete held[e.code]; });

/* ── Button clicks ── */
btnLeft.addEventListener('click',  () => moveClaw(-1)); 
btnRight.addEventListener('click', () => moveClaw(1));
btnDrop.addEventListener('click',  () => dropClaw());

/* ── Touch hold (keep moving while finger held) ── */
let holdTimer = null;
function startHold(dir) { moveClaw(dir); holdTimer = setInterval(() => moveClaw(dir), 180); }
function stopHold()     { clearInterval(holdTimer); holdTimer = null; }

btnLeft.addEventListener('touchstart',  e => { e.preventDefault(); startHold(-1); }, { passive: false });
btnLeft.addEventListener('touchend',    e => { e.preventDefault(); stopHold(); },    { passive: false });
btnLeft.addEventListener('touchcancel', e => { e.preventDefault(); stopHold(); },    { passive: false });

btnRight.addEventListener('touchstart',  e => { e.preventDefault(); startHold(1); }, { passive: false });
btnRight.addEventListener('touchend',    e => { e.preventDefault(); stopHold(); },   { passive: false });
btnRight.addEventListener('touchcancel', e => { e.preventDefault(); stopHold(); },   { passive: false });

btnDrop.addEventListener('touchstart', e => { e.preventDefault(); dropClaw(); }, { passive: false });