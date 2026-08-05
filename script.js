/* =========================================================
   WAYNE ENTERPRISES // BATCOMPUTER — APPLICATION LOGIC
   Vanilla JS. No dependencies required.
   ========================================================= */
(() => {
  'use strict';

  /* ---------------------------------------------------------
     0. STATE & DOM REFERENCES
  --------------------------------------------------------- */
  const state = {
    audioEnabled: true,
    stormActive: true,
    currentPage: 'page-boot',
    mission3Unlocked: false
  };

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const pages = $$('.page');
  const pageDots = $$('.dot');

  const audio = {
    rain: $('#audio-rain'),
    thunder: $('#audio-thunder'),
    click: $('#audio-click'),
    type: $('#audio-type'),
    theme: $('#audio-theme'),
    access: $('#audio-access')
  };

  /* ---------------------------------------------------------
     1. SAFE AUDIO HELPERS
     All audio is optional — if a file is missing from
     assets/audio/, playback simply fails silently.
  --------------------------------------------------------- */
  function safePlay(el, { loop = false, volume = 1, restart = false } = {}) {
    if (!el || !state.audioEnabled) return;
    try {
      el.loop = loop;
      el.volume = volume;
      if (restart) el.currentTime = 0;
      const p = el.play();
      if (p && p.catch) p.catch(() => {});
    } catch (e) { /* ignore */ }
  }

  function safePause(el) {
    if (!el) return;
    try { el.pause(); } catch (e) { /* ignore */ }
  }

  function toggleAudio() {
    state.audioEnabled = !state.audioEnabled;
    const icon = $('.audio-icon');
    if (state.audioEnabled) {
      icon.textContent = '🔊';
      if (state.stormActive) safePlay(audio.rain, { loop: true, volume: .35 });
      else safePlay(audio.theme, { loop: true, volume: .3 });
    } else {
      icon.textContent = '🔇';
      Object.values(audio).forEach(safePause);
    }
  }
  $('#audio-toggle').addEventListener('click', toggleAudio);

  /* ---------------------------------------------------------
     2. TYPEWRITER UTILITY
  --------------------------------------------------------- */
  function typeText(el, text, speed = 28) {
    return new Promise(resolve => {
      el.textContent = '';
      let i = 0;
      const tick = () => {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          if (i % 3 === 0) safePlay(audio.type, { volume: .12, restart: true });
          i++;
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      };
      tick();
    });
  }

  async function typeSequence(lines, speed = 22, gap = 260) {
    for (const { el, text } of lines) {
      await typeText(el, text, speed);
      await wait(gap);
    }
  }

  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ---------------------------------------------------------
     3. PAGE TRANSITIONS
  --------------------------------------------------------- */
  function goToPage(id) {
    const current = $('.page.active');
    const next = document.getElementById(id);
    if (!next || current === next) return;

    if (current) {
      current.classList.add('leaving');
      current.classList.remove('active');
      setTimeout(() => current.classList.remove('leaving'), 900);
    }
    next.classList.add('active');
    state.currentPage = id;
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    next.scrollTop = 0;

    pageDots.forEach(d => d.classList.toggle('active', d.dataset.page === id));

    if (id === 'page-dossier') initDossier();
    if (id === 'page-missions') initMissions();
    if (id === 'page-birthday') initBirthday();
    if (id === 'page-vault') initVault();
  }

  pageDots.forEach(dot => {
    dot.addEventListener('click', () => {
      // Only allow navigating to already-unlocked/visited-ish pages for a smooth UX
      goToPage(dot.dataset.page);
    });
  });

  /* ---------------------------------------------------------
     4. RAIN CANVAS
  --------------------------------------------------------- */
  const rainCanvas = $('#fx-rain');
  const rctx = rainCanvas.getContext('2d');
  let raindrops = [];

  function sizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function initRain() {
    sizeCanvas(rainCanvas);
    const count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    raindrops = Array.from({ length: count }, () => spawnDrop());
  }

  function spawnDrop() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      len: 10 + Math.random() * 18,
      speed: 8 + Math.random() * 9,
      drift: -1 + Math.random() * 2,
      alpha: 0.15 + Math.random() * 0.35
    };
  }

  function drawRain() {
    rctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    if (state.stormActive) {
      rctx.strokeStyle = 'rgba(180,210,230,0.5)';
      rctx.lineWidth = 1;
      raindrops.forEach(d => {
        rctx.globalAlpha = d.alpha;
        rctx.beginPath();
        rctx.moveTo(d.x, d.y);
        rctx.lineTo(d.x + d.drift * 3, d.y + d.len);
        rctx.stroke();
        d.y += d.speed;
        d.x += d.drift;
        if (d.y > rainCanvas.height) {
          d.y = -20;
          d.x = Math.random() * rainCanvas.width;
        }
      });
      rctx.globalAlpha = 1;
    }
    requestAnimationFrame(drawRain);
  }

  window.addEventListener('resize', () => {
    sizeCanvas(rainCanvas);
    sizeCanvas(confettiCanvas);
  });

  /* ---------------------------------------------------------
     5. LIGHTNING + THUNDER
  --------------------------------------------------------- */
  const lightningEl = $('#fx-lightning');
  let lightningTimer = null;

  function scheduleLightning() {
    const delay = 5000 + Math.random() * 9000;
    lightningTimer = setTimeout(() => {
      if (state.stormActive) strikeLightning();
      scheduleLightning();
    }, delay);
  }

  function strikeLightning() {
    lightningEl.classList.remove('flash');
    void lightningEl.offsetWidth; // reflow to restart animation
    lightningEl.classList.add('flash');
    safePlay(audio.thunder, { volume: .3, restart: true });
  }

  /* ---------------------------------------------------------
     6. EMBERS (used on the birthday page for warm atmosphere)
  --------------------------------------------------------- */
  const embersEl = $('#fx-embers');
  let emberInterval = null;

  function startEmbers() {
    stopEmbers();
    emberInterval = setInterval(() => {
      const ember = document.createElement('div');
      ember.className = 'ember';
      ember.style.left = Math.random() * 100 + 'vw';
      ember.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      ember.style.animationDuration = (6 + Math.random() * 6) + 's';
      embersEl.appendChild(ember);
      setTimeout(() => ember.remove(), 13000);
    }, 350);
  }
  function stopEmbers() {
    if (emberInterval) clearInterval(emberInterval);
    embersEl.innerHTML = '';
  }

  /* ---------------------------------------------------------
     7. CONFETTI CANVAS
  --------------------------------------------------------- */
  const confettiCanvas = $('#fx-confetti');
  const cctx = confettiCanvas.getContext('2d');
  let confettiParticles = [];
  let confettiRunning = false;
  const confettiColors = ['#f2c14e', '#4fd8ff', '#d3232f', '#f4e3b2', '#ffffff'];

  function burstConfetti(count = 160) {
    sizeCanvas(confettiCanvas);
    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * confettiCanvas.height * 0.4,
        w: 5 + Math.random() * 5,
        h: 8 + Math.random() * 6,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        speedY: 2 + Math.random() * 3.5,
        speedX: -1.5 + Math.random() * 3,
        rot: Math.random() * 360,
        rotSpeed: -6 + Math.random() * 12,
        life: 0,
        maxLife: 500 + Math.random() * 300
      });
    }
    if (!confettiRunning) {
      confettiRunning = true;
      requestAnimationFrame(drawConfetti);
    }
  }

  function drawConfetti() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiParticles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;
      p.life++;
      cctx.save();
      cctx.translate(p.x, p.y);
      cctx.rotate((p.rot * Math.PI) / 180);
      cctx.fillStyle = p.color;
      cctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
      cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    });
    confettiParticles = confettiParticles.filter(p => p.life < p.maxLife && p.y < confettiCanvas.height + 40);
    if (confettiParticles.length > 0) {
      requestAnimationFrame(drawConfetti);
    } else {
      confettiRunning = false;
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // Gentle continuous confetti trickle on the birthday page
  let confettiTrickle = null;
  function startConfettiTrickle() {
    stopConfettiTrickle();
    confettiTrickle = setInterval(() => burstConfetti(14), 900);
  }
  function stopConfettiTrickle() {
    if (confettiTrickle) clearInterval(confettiTrickle);
  }

  /* ---------------------------------------------------------
     8. PAGE 1 — BOOT SEQUENCE
  --------------------------------------------------------- */
  const startGate = $('#start-gate');
  const startBtn = $('#start-btn');
  const enterBatcaveBtn = $('#enter-batcave');
  const loadingFill = $('#loading-fill');
  const loadingPercent = $('#loading-percent');
  const accessBanner = $('#access-banner');

  startBtn.addEventListener('click', () => {
    safePlay(audio.click, { volume: .5, restart: true });
    startGate.classList.add('hide');
    beginBoot();
  }, { once: true });

  function beginBoot() {
    // Ambient storm audio begins here (first user gesture) to satisfy autoplay policies
    safePlay(audio.rain, { loop: true, volume: .35 });
    scheduleLightning();

    const termLines = $$('#terminal .term-line').map(el => ({ el, text: el.dataset.text }));
    typeSequence(termLines, 16, 180);

    // Loading bar animation, roughly synced with terminal lines
    let pct = 0;
    const loadTimer = setInterval(() => {
      pct += Math.random() * 6 + 2;
      if (pct >= 100) {
        pct = 100;
        clearInterval(loadTimer);
        onBootComplete();
      }
      loadingFill.style.width = pct + '%';
      loadingPercent.textContent = Math.floor(pct) + '%';
    }, 180);
  }

  function onBootComplete() {
    setTimeout(() => {
      safePlay(audio.access, { volume: .5, restart: true });
      accessBanner.classList.add('show');
      setTimeout(() => enterBatcaveBtn.classList.add('show'), 400);
    }, 400);
  }

  enterBatcaveBtn.addEventListener('click', () => {
    safePlay(audio.click, { volume: .5, restart: true });
    goToPage('page-dossier');
  });

  /* ---------------------------------------------------------
     9. PAGE 2 — DOSSIER
  --------------------------------------------------------- */
  let dossierInitialized = false;
  function initDossier() {
    if (dossierInitialized) return;
    dossierInitialized = true;

    const caption = $('#render-caption');
    typeText(caption, 'IDENTITY CONFIRMED: BRUCE WAYNE — THREAT LEVEL: LEGENDARY', 20);

    // Type each profile value
    const rows = $$('#profile-list dd');
    let delay = 500;
    rows.forEach(dd => {
      setTimeout(() => typeText(dd, dd.dataset.type, 30), delay);
      delay += 550;
    });

    // Animate skill bars once visible
    setTimeout(() => {
      $$('#skills .skill-row').forEach((row, i) => {
        setTimeout(() => {
          const value = parseInt(row.dataset.value, 10);
          const fill = row.querySelector('.skill-fill');
          const pctEl = row.querySelector('.skill-pct');
          fill.style.width = value + '%';
          animateCount(pctEl, value);
        }, i * 220);
      });
    }, delay + 200);
  }

  function animateCount(el, target) {
    let current = 0;
    const step = Math.max(1, Math.round(target / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + '%';
    }, 30);
  }

  $('#goto-missions').addEventListener('click', () => {
    safePlay(audio.click, { volume: .5, restart: true });
    goToPage('page-missions');
  });

  /* ---------------------------------------------------------
     10. PAGE 3 — MISSIONS
  --------------------------------------------------------- */
  let missionsInitialized = false;
  function initMissions() {
    if (missionsInitialized) return;
    missionsInitialized = true;

    const mission3 = $('#mission-3');
    mission3.addEventListener('click', unlockMission3);
  }

  async function unlockMission3() {
    if (state.mission3Unlocked) return;
    state.mission3Unlocked = true;

    safePlay(audio.click, { volume: .5, restart: true });

    const card = $('#mission-3');
    card.classList.remove('locked');
    card.classList.add('unlocked');
    card.querySelector('.mission-status-light').classList.remove('red');
    card.querySelector('.mission-status-light').classList.add('green');
    card.querySelector('.mission-status-light').style.animation = 'none';
    card.querySelector('.mission-state span').textContent = 'DECRYPTING...';
    card.querySelector('.mission-icon').textContent = '🔓';

    const folder = $('#folder-anim');
    folder.classList.add('show');
    folder.scrollIntoView({ behavior: 'smooth', block: 'center' });

    await wait(900);

    const docLines = $$('#doc-terminal .term-line').map(el => ({ el, text: el.dataset.text }));
    await typeSequence(docLines, 24, 320);

    card.querySelector('.mission-state span').textContent = 'DECRYPTED';

    await wait(400);
    $('#doc-complete').classList.add('show');

    const continueBtn = $('#goto-birthday');
    continueBtn.disabled = false;
    continueBtn.classList.add('show');
  }

  $('#goto-birthday').addEventListener('click', () => {
    if ($('#goto-birthday').disabled) return;
    safePlay(audio.click, { volume: .5, restart: true });
    goToPage('page-birthday');
  });

  /* ---------------------------------------------------------
     11. PAGE 4 — BIRTHDAY
  --------------------------------------------------------- */
  let birthdayInitialized = false;
  function initBirthday() {
    // Stop the storm, every time this page is entered (cheap + idempotent)
    state.stormActive = false;
    document.body.classList.add('storm-off');
    clearTimeout(lightningTimer);
    safePause(audio.rain);
    safePause(audio.thunder);
    safePlay(audio.theme, { loop: true, volume: .28 });

    startEmbers();
    startConfettiTrickle();
    burstConfetti(220);

    if (birthdayInitialized) return;
    birthdayInitialized = true;

    const alfredText = $('#alfred-text');
    const message = "You've spent your life making sure everyone else's world stays safe. Today, let the world take care of you. Master Wayne — I could not be prouder to serve you. Happy Birthday.";
    setTimeout(() => typeText(alfredText, message, 18), 1800);

    $('#blow-candle').addEventListener('click', () => {
      safePlay(audio.click, { volume: .5, restart: true });
      $('.flame').classList.toggle('lit');
      burstConfetti(60);
    });
  }

  $('#goto-vault').addEventListener('click', () => {
    safePlay(audio.click, { volume: .5, restart: true });
    stopConfettiTrickle();
    goToPage('page-vault');
  });

  /* ---------------------------------------------------------
     12. PAGE 5 — MEMORY VAULT
  --------------------------------------------------------- */
  let vaultInitialized = false;
  function initVault() {
    if (vaultInitialized) return;
    vaultInitialized = true;

    // Resolve photo slots: try to load a real image, fall back to a styled placeholder
    $$('.photo-slot').forEach(slot => {
      const src = slot.dataset.src;
      const caption = slot.dataset.caption;
      const img = new Image();
      img.alt = caption;
      img.onload = () => {
        slot.appendChild(img);
        appendCaption(slot, caption);
      };
      img.onerror = () => {
        const mark = document.createElement('div');
        mark.className = 'placeholder-mark';
        mark.textContent = 'NO IMAGE ON FILE — ADD ' + src.split('/').pop() + ' TO assets/images/';
        slot.appendChild(mark);
        appendCaption(slot, caption);
      };
      img.src = src;
    });

    function appendCaption(slot, caption) {
      const cap = document.createElement('div');
      cap.className = 'cap';
      cap.textContent = caption;
      slot.appendChild(cap);
    }

    // Reveal photo slots + text lines on
