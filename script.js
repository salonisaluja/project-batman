(function() {
  'use strict';

  var state = {
    audioEnabled: true,
    stormActive: true,
    currentPage: 'page-boot',
    mission3Unlocked: false
  };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var pageDots = $$('.dot');

  var audio = {
    rain: $('#audio-rain'),
    thunder: $('#audio-thunder'),
    click: $('#audio-click'),
    type: $('#audio-type'),
    theme: $('#audio-theme'),
    access: $('#audio-access')
  };

  function safePlay(el, opts) {
    opts = opts || {};
    if (!el || !state.audioEnabled) return;
    try {
      el.loop = !!opts.loop;
      el.volume = opts.volume === undefined ? 1 : opts.volume;
      if (opts.restart) el.currentTime = 0;
      var p = el.play();
      if (p && p.catch) p.catch(function(){});
    } catch (e) {}
  }

  function safePause(el) {
    if (!el) return;
    try { el.pause(); } catch (e) {}
  }

  function toggleAudio() {
    state.audioEnabled = !state.audioEnabled;
    var icon = $('.audio-icon');
    if (state.audioEnabled) {
      icon.textContent = 'SOUND: ON';
      if (state.stormActive) safePlay(audio.rain, { loop: true, volume: 0.35 });
      else safePlay(audio.theme, { loop: true, volume: 0.3 });
    } else {
      icon.textContent = 'SOUND: OFF';
      for (var key in audio) { safePause(audio[key]); }
    }
  }
  $('#audio-toggle').addEventListener('click', toggleAudio);

  function wait(ms) { return new Promise(function(resolve) { setTimeout(resolve, ms); }); }

  function typeText(el, text, speed) {
    speed = speed || 28;
    return new Promise(function(resolve) {
      el.textContent = '';
      var i = 0;
      function tick() {
        if (i < text.length) {
          el.textContent += text.charAt(i);
          if (i % 3 === 0) safePlay(audio.type, { volume: 0.12, restart: true });
          i++;
          setTimeout(tick, speed);
        } else {
          resolve();
        }
      }
      tick();
    });
  }

  function typeSequence(lines, speed, gap) {
    speed = speed || 22;
    gap = gap || 260;
    var chain = Promise.resolve();
    lines.forEach(function(line) {
      chain = chain.then(function() { return typeText(line.el, line.text, speed); })
                    .then(function() { return wait(gap); });
    });
    return chain;
  }

  function goToPage(id) {
    var current = $('.page.active');
    var next = document.getElementById(id);
    if (!next || current === next) return;

    if (current) {
      current.classList.add('leaving');
      current.classList.remove('active');
      setTimeout(function() { current.classList.remove('leaving'); }, 900);
    }
    next.classList.add('active');
    state.currentPage = id;
    next.scrollTop = 0;
    window.scrollTo(0, 0);

    pageDots.forEach(function(d) {
      d.classList.toggle('active', d.dataset.page === id);
    });

    if (id === 'page-dossier') initDossier();
    if (id === 'page-missions') initMissions();
    if (id === 'page-birthday') initBirthday();
    if (id === 'page-vault') initVault();
  }

  pageDots.forEach(function(dot) {
    dot.addEventListener('click', function() { goToPage(dot.dataset.page); });
  });

  var rainCanvas = $('#fx-rain');
  var rctx = rainCanvas.getContext('2d');
  var raindrops = [];

  function sizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

  function initRain() {
    sizeCanvas(rainCanvas);
    var count = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    raindrops = [];
    for (var i = 0; i < count; i++) raindrops.push(spawnDrop());
  }

  function drawRain() {
    rctx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    if (state.stormActive) {
      rctx.strokeStyle = 'rgba(180,210,230,0.5)';
      rctx.lineWidth = 1;
      raindrops.forEach(function(d) {
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

  window.addEventListener('resize', function() {
    sizeCanvas(rainCanvas);
    sizeCanvas(confettiCanvas);
  });

  var lightningEl = $('#fx-lightning');
  var lightningTimer = null;

  function scheduleLightning() {
    var delay = 5000 + Math.random() * 9000;
    lightningTimer = setTimeout(function() {
      if (state.stormActive) strikeLightning();
      scheduleLightning();
    }, delay);
  }

  function strikeLightning() {
    lightningEl.classList.remove('flash');
    void lightningEl.offsetWidth;
    lightningEl.classList.add('flash');
    safePlay(audio.thunder, { volume: 0.3, restart: true });
  }

  var embersEl = $('#fx-embers');
  var emberInterval = null;

  function startEmbers() {
    stopEmbers();
    emberInterval = setInterval(function() {
      var ember = document.createElement('div');
      ember.className = 'ember';
      ember.style.left = (Math.random() * 100) + 'vw';
      ember.style.setProperty('--drift', (Math.random() * 80 - 40) + 'px');
      ember.style.animationDuration = (6 + Math.random() * 6) + 's';
      embersEl.appendChild(ember);
      setTimeout(function() { ember.remove(); }, 13000);
    }, 350);
  }
  function stopEmbers() {
    if (emberInterval) clearInterval(emberInterval);
    embersEl.innerHTML = '';
  }

  var confettiCanvas = $('#fx-confetti');
  var cctx = confettiCanvas.getContext('2d');
  var confettiParticles = [];
  var confettiRunning = false;
  var confettiColors = ['#f2c14e', '#4fd8ff', '#d3232f', '#f4e3b2', '#ffffff'];

  function burstConfetti(count) {
    count = count || 160;
    sizeCanvas(confettiCanvas);
    for (var i = 0; i < count; i++) {
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
    confettiParticles.forEach(function(p) {
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
    confettiParticles = confettiParticles.filter(function(p) {
      return p.life < p.maxLife && p.y < confettiCanvas.height + 40;
    });
    if (confettiParticles.length > 0) {
      requestAnimationFrame(drawConfetti);
    } else {
      confettiRunning = false;
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  var confettiTrickle = null;
  function startConfettiTrickle() {
    stopConfettiTrickle();
    confettiTrickle = setInterval(function() { burstConfetti(14); }, 900);
  }
  function stopConfettiTrickle() {
    if (confettiTrickle) clearInterval(confettiTrickle);
  }

  var startGate = $('#start-gate');
  var startBtn = $('#start-btn');
  var enterBatcaveBtn = $('#enter-batcave');
  var loadingFill = $('#loading-fill');
  var loadingPercent = $('#loading-percent');
  var accessBanner = $('#access-banner');

  startBtn.addEventListener('click', function onStart() {
    safePlay(audio.click, { volume: 0.5, restart: true });
    startGate.classList.add('hide');
    beginBoot();
    startBtn.removeEventListener('click', onStart);
  });

  function beginBoot() {
    safePlay(audio.rain, { loop: true, volume: 0.35 });
    scheduleLightning();

    var termLines = $$('#terminal .term-line').map(function(el) {
      return { el: el, text: el.dataset.text };
    });
    typeSequence(termLines, 16, 180);

    var pct = 0;
    var loadTimer = setInterval(function() {
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
    setTimeout(function() {
      safePlay(audio.access, { volume: 0.5, restart: true });
      accessBanner.classList.add('show');
      setTimeout(function() { enterBatcaveBtn.classList.add('show'); }, 400);
    }, 400);
  }

  enterBatcaveBtn.addEventListener('click', function() {
    safePlay(audio.click, { volume: 0.5, restart: true });
    goToPage('page-dossier');
  });

  var dossierInitialized = false;
  function initDossier() {
    if (dossierInitialized) return;
    dossierInitialized = true;

    var caption = $('#render-caption');
    typeText(caption, 'IDENTITY CONFIRMED: BRUCE WAYNE - THREAT LEVEL: LEGENDARY', 20);

    var rows = $$('#profile-list dd');
    var delay = 500;
    rows.forEach(function(dd) {
      setTimeout(function() { typeText(dd, dd.dataset.type, 30); }, delay);
      delay += 550;
    });

    setTimeout(function() {
      $$('#skills .skill-row').forEach(function(row, i) {
        setTimeout(function() {
          var value = parseInt(row.dataset.value, 10);
          var fill = row.querySelector('.skill-fill');
          var pctEl = row.querySelector('.skill-pct');
          fill.style.width = value + '%';
          animateCount(pctEl, value);
        }, i * 220);
      });
    }, delay + 200);
  }

  function animateCount(el, target) {
    var current = 0;
    var step = Math.max(1, Math.round(target / 30));
    var timer = setInterval(function() {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + '%';
    }, 30);
  }

  $('#goto-missions').addEventListener('click', function() {
    safePlay(audio.click, { volume: 0.5, restart: true });
    goToPage('page-missions');
  });

  var missionsInitialized = false;
  function initMissions() {
    if (missionsInitialized) return;
    missionsInitialized = true;
    $('#mission-3').addEventListener('click', unlockMission3);
  }

  function unlockMission3() {
    if (state.mission3Unlocked) return;
    state.mission3Unlocked = true;

    safePlay(audio.click, { volume: 0.5, restart: true });

    var card = $('#mission-3');
    card.classList.remove('locked');
    card.classList.add('unlocked');
    card.querySelector('.mission-status-light').classList.remove('red');
    card.querySelector('.mission-status-light').classList.add('green');
    card.querySelector('.mission-status-light').style.animation = 'none';
    card.querySelector('.mission-state span').textContent = 'DECRYPTING...';
    card.querySelector('.mission-icon').textContent = 'UNLOCKED';

    var folder = $('#folder-anim');
    folder.classList.add('show');
    folder.scrollIntoView({ behavior: 'smooth', block: 'center' });

    wait(900).then(function() {
      var docLines = $$('#doc-terminal .term-line').map(function(el) {
        return { el: el, text: el.dataset.text };
      });
      return typeSequence(docLines, 24, 320);
    }).then(function() {
      card.querySelector('.mission-state span').textContent = 'DECRYPTED';
      return wait(400);
    }).then(function() {
      $('#doc-complete').classList.add('show');
      var continueBtn = $('#goto-birthday');
      continueBtn.disabled = false;
      continueBtn.classList.add('show');
    });
  }

  $('#goto-birthday').addEventListener('click', function() {
    if ($('#goto-birthday').disabled) return;
    safePlay(audio.click, { volume: 0.5, restart: true });
    goToPage('page-birthday');
  });

  var birthdayInitialized = false;
  function initBirthday() {
    state.stormActive = false;
    document.body.classList.add('storm-off');
    clearTimeout(lightningTimer);
    safePause(audio.rain);
    safePause(audio.thunder);
    safePlay(audio.theme, { loop: true, volume: 0.28 });

    startEmbers();
    startConfettiTrickle();
    burstConfetti(220);

    if (birthdayInitialized) return;
    birthdayInitialized = true;

    var alfredText = $('#alfred-text');
    var message = "You've spent your life making sure everyone else's world stays safe. Today, let the world take care of you. Master Wayne - I could not be prouder to serve you. Happy Birthday.";
    setTimeout(function() { typeText(alfredText, message, 18); }, 1800);

    $('#blow-candle').addEventListener('click', function() {
      safePlay(audio.click, { volume: 0.5, restart: true });
      $('.flame').classList.toggle('lit');
      burstConfetti(60);
    });
  }

  $('#goto-vault').addEventListener('click', function() {
    safePlay(audio.click, { volume: 0.5, restart: true });
    stopConfettiTrickle();
    goToPage('page-vault');
  });

  var vaultInitialized = false;
  function initVault() {
    if (vaultInitialized) return;
    vaultInitialized = true;

    $$('.photo-slot').forEach(function(slot) {
      var src = slot.dataset.src;
      var caption = slot.dataset.caption;
      var img = new Image();
      img.alt = caption;
      img.onload = function() {
        slot.appendChild(img);
        appendCaption(slot, caption);
      };
      img.onerror = function() {
        var mark = document.createElement('div');
        mark.className = 'placeholder-mark';
        mark.textContent = 'NO IMAGE ON FILE - ADD ' + src.split('/').pop() + ' TO assets/images/';
        slot.appendChild(mark);
        appendCaption(slot, caption);
      };
      img.src = src;
    });

    function appendCaption(slot, caption) {
      var cap = document.createElement('div');
      cap.className = 'cap';
      cap.textContent = caption;
      slot.appendChild(cap);
    }

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    $$('.photo-slot').forEach(function(slot) { observer.observe(slot); });

    var vtLines = $$('#vault-text .vt-line');
    var vtObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          vtObserver.disconnect();
          var chain = Promise.resolve();
          vtLines.forEach(function(line) {
            chain = chain.then(function() {
              line.classList.add('revealed');
              return typeText(line, line.dataset.text, 26);
            }).then(function() { return wait(300); });
          });
          chain.then(revealFinal);
        }
      });
    }, { threshold: 0.4 });
    vtObserver.observe($('#vault-text'));

    function revealFinal() {
      setTimeout(function() {
        $('#mission-complete-final').classList.add('show');
      }, 500);
    }

    $('#restart-btn').addEventListener('click', function() {
      window.location.reload();
    });
  }

  initRain();
  sizeCanvas(confettiCanvas);
  requestAnimationFrame(drawRain);

})();
