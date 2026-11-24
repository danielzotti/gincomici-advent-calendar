(function () {
  'use strict';

  const stageEl = document.getElementById('stage');
  const facadeEl = document.getElementById('house-facade');
  const openedCounterEl = document.getElementById('opened-counter');
  const openedProgressFillEl = document.getElementById('opened-progress-fill');
  const fullscreenBtn = document.getElementById('btn-fullscreen');
  const soundBtn = document.getElementById('btn-sound');
  const partyBtn = document.getElementById('btn-party');
  const snowfallEl = document.getElementById('snowfall');
  const confettiLayerEl = document.getElementById('confetti-layer');

  const modalOverlayEl = document.getElementById('modal-overlay');
  const modalHeroEmojiEl = document.getElementById('modal-hero-emoji');
  const modalBoxBadgeEl = document.getElementById('modal-box-badge');
  const modalStatusTagEl = document.getElementById('modal-status-tag');
  const modalTitleEl = document.getElementById('modal-title');
  const modalDescriptionEl = document.getElementById('modal-description');
  const modalFunQuipEl = document.getElementById('modal-fun-quip');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalConfirmBtn = document.getElementById('modal-confirm');

  const snowmanBtn = document.getElementById('easter-snowman');
  const snowmanBubbleEl = document.getElementById('bubble-snowman');
  const reindeerBtn = document.getElementById('easter-reindeer');
  const reindeerBubbleEl = document.getElementById('bubble-reindeer');
  const santaBtn = document.getElementById('easter-santa');
  const santaBubbleEl = document.getElementById('bubble-santa');
  const moonBtn = document.getElementById('easter-moon');

  const OPEN_ICONS = [
    '🎤', '🍸', '🎄', '🎅', '🎁', '🦌', '🔔', '🍾',
    '🧦', '⛄', '⭐', '🍪', '🎺', '🎭', '❄️', '🕯️'
  ];

  const NEW_OPEN_TAGS = [
    '🎤 Sul palco adesso!',
    '🍸 Gin & Jingle!',
    '🎅 Approvato dagli Elfi!',
    '🦌 Rudolph approva!',
    '🎄 Follia Estratta!'
  ];

  const FUN_QUIPS = [
    'Consiglio: leggila con tono solenne da Oscar.',
    'Effetto collaterale: risate incontrollate garantite.',
    'Approvato dal Comitato Feste Disastrose.',
    '100% spirito natalizio, 0% dignità.',
    'Se qualcuno non ride, paga il prossimo giro!',
    'Garantito dai Gin Comici del Polo Nord.'
  ];

  const SNOWMAN_LINES = [
    'È acqua tonica nel bicchiere, lo giuro! 🍸',
    'Non mi sto sciogliendo, è l’ansia da palco!',
    'Qualcuno ha visto un microfono più freddo? 🎤',
    'Un altro giro di Gin-gle Bells!',
    'Sono fatto di neve, ma spacco di brutto! ⛄'
  ];

  const REINDEER_LINES = [
    'Il naso rosso è solo colpa del vin brulé! 🔴',
    'Ho parcheggiato la slitta in doppia fila!',
    'Non toccare il naso, è in modalità turbo!',
    'Gli elfi hanno chiesto l’aumento in panettoni.',
    'Quest’anno traino solo verso l’open bar! 🦌'
  ];

  const SANTA_LINES = [
    'AIUTO! Troppo pandoro con il mascarpone! 🎅',
    'NON ACCENDETE IL CAMINO!!',
    'Mi sono incastrato sulla casella 14!',
    'Qualcuno tiri le gambe... piano però!',
    'Ho perso la lista dei buoni nel camino!'
  ];

  let lastFocusedTrigger = null;
  let soundEnabled = true;
  let partyMode = false;
  let audioCtx = null;

  const bubbleTimers = new WeakMap();
  const easterCounters = {
    snowman: 0,
    reindeer: 0,
    santa: 0
  };

  function getAudioContext() {
    if (!soundEnabled) return null;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) {
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function playTone(freq, startOffset, duration, type = 'triangle', volume = 0.09) {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime + startOffset;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function playBoxOpenSound(isDoor25, isAlreadyOpened) {
    if (!soundEnabled) return;
    if (isAlreadyOpened) {
      playTone(587.33, 0, 0.12, 'sine', 0.07);
      playTone(783.99, 0.07, 0.16, 'sine', 0.07);
      return;
    }

    if (isDoor25) {
      // Fanfara natalizia per il Portone #25
      const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
      const times = [0, 0.09, 0.18, 0.27, 0.42, 0.54];
      notes.forEach((f, idx) => playTone(f, times[idx], 0.28, 'triangle', 0.11));
      return;
    }

    // Campanellini natalizi allegri
    playTone(659.25, 0, 0.14, 'triangle', 0.09);
    playTone(783.99, 0.08, 0.14, 'triangle', 0.09);
    playTone(1046.5, 0.16, 0.26, 'sine', 0.1);
  }

  function playBoingSound() {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
    osc.frequency.exponentialRampToValueAtTime(340, now + 0.28);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  function playPartySound() {
    if (!soundEnabled) return;
    [523.25, 659.25, 783.99, 987.77, 1174.66].forEach((freq, i) => {
      playTone(freq, i * 0.055, 0.2, 'triangle', 0.08);
    });
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    const hadController = Boolean(navigator.serviceWorker.controller);
    let isRefreshing = false;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || isRefreshing) return;
      isRefreshing = true;
      window.location.reload();
    });

    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js', { updateViaCache: 'none' })
        .then((registration) => {
          registration.update().catch(() => {});

          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
              registration.update().catch(() => {});
            }
          });
        })
        .catch((err) => {
          console.warn('Service Worker non registrato:', err);
        });
    });
  }

  function initSnowfall() {
    if (!snowfallEl) return;
    snowfallEl.innerHTML = '';

    const flakeCount = 44;
    for (let i = 0; i < flakeCount; i++) {
      const flake = document.createElement('span');
      flake.className = 'snowflake';
      const size = (0.22 + Math.random() * 0.42).toFixed(2);
      const left = (Math.random() * 100).toFixed(2);
      const duration = (6.5 + Math.random() * 7.5).toFixed(2);
      const delay = (-Math.random() * 12).toFixed(2);
      const drift = ((Math.random() - 0.5) * 6).toFixed(2);
      const opacity = (0.45 + Math.random() * 0.5).toFixed(2);

      flake.style.width = `${size}cqw`;
      flake.style.height = `${size}cqw`;
      flake.style.left = `${left}%`;
      flake.style.opacity = opacity;
      flake.style.animationDuration = `${duration}s`;
      flake.style.animationDelay = `${delay}s`;
      flake.style.setProperty('--drift', `${drift}cqw`);

      snowfallEl.appendChild(flake);
    }
  }

  function spawnConfetti(originEl, count = 24, isGrandFinale = false) {
    if (!confettiLayerEl || !stageEl) return;

    const stageRect = stageEl.getBoundingClientRect();
    let originX = 50;
    let originY = 50;

    if (originEl) {
      const rect = originEl.getBoundingClientRect();
      originX = ((rect.left + rect.width / 2 - stageRect.left) / stageRect.width) * 100;
      originY = ((rect.top + rect.height / 2 - stageRect.top) / stageRect.height) * 100;
    }

    const emojis = ['✨', '🎄', '🎁', '⭐', '❄️', '🍸', '🔔', '🎉'];
    const colors = ['#ffd166', '#e63946', '#06d6a0', '#38bdf8', '#f472b6', '#ffffff'];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement('span');
      const useEmoji = i % 2 === 0;
      piece.className = useEmoji ? 'confetti-piece' : 'confetti-piece confetti-dot';

      if (useEmoji) {
        piece.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      } else {
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      }

      const startX = isGrandFinale ? 15 + Math.random() * 70 : originX;
      const startY = isGrandFinale ? 20 + Math.random() * 45 : originY;
      const angle = Math.random() * Math.PI * 2;
      const dist = isGrandFinale ? 8 + Math.random() * 18 : 5 + Math.random() * 12;
      const tx = Math.cos(angle) * dist;
      const ty = Math.sin(angle) * dist - 3;
      const rot = Math.round((Math.random() - 0.5) * 720);

      piece.style.left = `${startX}%`;
      piece.style.top = `${startY}%`;
      piece.style.setProperty('--tx', `${tx.toFixed(2)}cqw`);
      piece.style.setProperty('--ty', `${ty.toFixed(2)}cqw`);
      piece.style.setProperty('--rot', `${rot}deg`);
      piece.style.animationDelay = `${(Math.random() * 0.14).toFixed(2)}s`;

      confettiLayerEl.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove(), { once: true });
    }
  }

  function showSpeechBubble(bubbleEl, text) {
    if (!bubbleEl) return;
    bubbleEl.textContent = text;
    bubbleEl.hidden = false;
    clearTimeout(bubbleTimers.get(bubbleEl));
    const timer = setTimeout(() => {
      bubbleEl.hidden = true;
    }, 3200);
    bubbleTimers.set(bubbleEl, timer);
  }

  function triggerBounceClass(el, cls, durationMs = 600) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), durationMs);
  }

  function createWindowElement(boxNumber, isOpen) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `box-window${isOpen ? ' is-open' : ''}`;
    btn.dataset.box = String(boxNumber);
    btn.setAttribute(
      'aria-label',
      `Finestra ${boxNumber}${isOpen ? ' (già aperta)' : ' (chiusa)'}`
    );

    const pane = document.createElement('div');
    pane.className = 'window-pane';

    if (isOpen) {
      const icon = document.createElement('span');
      icon.className = 'box-open-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = OPEN_ICONS[(boxNumber - 1) % OPEN_ICONS.length];
      pane.appendChild(icon);
    }

    const num = document.createElement('span');
    num.className = 'box-number';
    num.textContent = String(boxNumber);
    pane.appendChild(num);

    if (boxNumber % 3 === 0) {
      const topGarland = document.createElement('div');
      topGarland.className = 'window-top-garland';
      topGarland.setAttribute('aria-hidden', 'true');
      btn.appendChild(topGarland);
    }

    const shutterLeft = document.createElement('div');
    shutterLeft.className = 'shutter shutter--left';
    shutterLeft.setAttribute('aria-hidden', 'true');

    const shutterRight = document.createElement('div');
    shutterRight.className = 'shutter shutter--right';
    shutterRight.setAttribute('aria-hidden', 'true');

    const sill = document.createElement('div');
    sill.className = 'window-sill';
    sill.setAttribute('aria-hidden', 'true');

    btn.appendChild(pane);
    btn.appendChild(shutterLeft);
    btn.appendChild(shutterRight);
    btn.appendChild(sill);

    return btn;
  }

  function createDoorElement(isOpen) {
    const doorNumber = 25;
    const slot = document.createElement('div');
    slot.className = 'door-slot';

    const lanternLeft = document.createElement('div');
    lanternLeft.className = 'door-lantern door-lantern--left';
    lanternLeft.setAttribute('aria-hidden', 'true');

    const lanternRight = document.createElement('div');
    lanternRight.className = 'door-lantern door-lantern--right';
    lanternRight.setAttribute('aria-hidden', 'true');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `box-door${isOpen ? ' is-open' : ''}`;
    btn.dataset.box = String(doorNumber);
    btn.setAttribute(
      'aria-label',
      `Portone centrale ${doorNumber}${isOpen ? ' (già aperto)' : ' (chiuso)'}`
    );

    const wreath = document.createElement('div');
    wreath.className = 'door-wreath';
    wreath.setAttribute('aria-hidden', 'true');

    const knob = document.createElement('div');
    knob.className = 'door-knob';
    knob.setAttribute('aria-hidden', 'true');

    btn.appendChild(wreath);
    btn.appendChild(knob);

    if (isOpen) {
      const icon = document.createElement('span');
      icon.className = 'box-open-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '🎄';
      btn.appendChild(icon);
    }

    const num = document.createElement('span');
    num.className = 'box-number';
    num.textContent = String(doorNumber);
    btn.appendChild(num);

    slot.appendChild(lanternLeft);
    slot.appendChild(btn);
    slot.appendChild(lanternRight);

    return slot;
  }

  function renderHouse() {
    const data = AdventStorage.loadData();
    const opened = data.state.openedBoxes || {};
    const order = data.windowOrder;

    facadeEl.innerHTML = '';

    // 3 piani superiori da 6 finestre ciascuno (indici 0..17)
    for (let floorIdx = 0; floorIdx < 3; floorIdx++) {
      const floorEl = document.createElement('div');
      floorEl.className = 'floor floor--upper';
      const start = floorIdx * 6;
      for (let i = 0; i < 6; i++) {
        const boxNum = order[start + i];
        const isOpen = Boolean(opened[String(boxNum)]);
        floorEl.appendChild(createWindowElement(boxNum, isOpen));
      }
      facadeEl.appendChild(floorEl);
    }

    // Piano terra: 3 finestre a sinistra (18..20), Portone centrale (25), 3 finestre a destra (21..23)
    const groundEl = document.createElement('div');
    groundEl.className = 'floor floor--ground';

    for (let i = 18; i < 21; i++) {
      const boxNum = order[i];
      groundEl.appendChild(createWindowElement(boxNum, Boolean(opened[String(boxNum)])));
    }

    groundEl.appendChild(createDoorElement(Boolean(opened['25'])));

    for (let i = 21; i < 24; i++) {
      const boxNum = order[i];
      groundEl.appendChild(createWindowElement(boxNum, Boolean(opened[String(boxNum)])));
    }

    facadeEl.appendChild(groundEl);

    const totalOpened = Object.keys(opened).length;
    if (openedCounterEl) {
      openedCounterEl.textContent = `Aperte: ${totalOpened} / 25`;
    }
    if (openedProgressFillEl) {
      openedProgressFillEl.style.width = `${Math.min(100, (totalOpened / 25) * 100)}%`;
    }
  }

  function openModal(boxNumber, content) {
    modalBoxBadgeEl.textContent = boxNumber === 25 ? 'Portone #25' : `Casella #${boxNumber}`;

    if (modalHeroEmojiEl) {
      modalHeroEmojiEl.textContent = boxNumber === 25
        ? '🎅'
        : OPEN_ICONS[(boxNumber - 1) % OPEN_ICONS.length];
    }

    if (content.alreadyOpened) {
      modalStatusTagEl.textContent = '♻️ Già estratta';
      modalStatusTagEl.classList.remove('is-new');
    } else {
      const randomTag = NEW_OPEN_TAGS[Math.floor(Math.random() * NEW_OPEN_TAGS.length)];
      modalStatusTagEl.textContent = boxNumber === 25 ? '🌟 Gran Finale!' : randomTag;
      modalStatusTagEl.classList.add('is-new');
    }

    if (modalFunQuipEl) {
      modalFunQuipEl.textContent = FUN_QUIPS[Math.floor(Math.random() * FUN_QUIPS.length)];
    }

    modalTitleEl.textContent = content.title || `Casella #${boxNumber}`;
    modalDescriptionEl.textContent = content.description || '';
    modalOverlayEl.hidden = false;
    modalCloseBtn.focus();
  }

  function closeModal() {
    modalOverlayEl.hidden = true;
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === 'function') {
      lastFocusedTrigger.focus();
      lastFocusedTrigger = null;
    }
  }

  // Click sulle caselle / portone
  facadeEl.addEventListener('click', (event) => {
    const target = event.target.closest('[data-box]');
    if (!target) return;

    const boxNumber = Number(target.dataset.box);
    if (!Number.isInteger(boxNumber)) return;

    const { data, content } = AdventStorage.openBox(boxNumber);
    renderHouse();
    lastFocusedTrigger = facadeEl.querySelector(`[data-box="${boxNumber}"]`);

    const isDoor25 = boxNumber === 25;
    const totalOpened = Object.keys(data.state.openedBoxes || {}).length;
    playBoxOpenSound(isDoor25, content.alreadyOpened);

    if (!content.alreadyOpened) {
      spawnConfetti(lastFocusedTrigger || target, isDoor25 || totalOpened === 25 ? 54 : 26, isDoor25 || totalOpened === 25);
    }

    openModal(boxNumber, content);
  });

  // Easter Eggs interattivi!
  if (snowmanBtn) {
    snowmanBtn.addEventListener('click', () => {
      const line = SNOWMAN_LINES[easterCounters.snowman % SNOWMAN_LINES.length];
      easterCounters.snowman += 1;
      triggerBounceClass(snowmanBtn, 'is-active', 580);
      showSpeechBubble(snowmanBubbleEl, line);
      spawnConfetti(snowmanBtn, 12, false);
      playBoingSound();
    });
  }

  if (reindeerBtn) {
    reindeerBtn.addEventListener('click', () => {
      const line = REINDEER_LINES[easterCounters.reindeer % REINDEER_LINES.length];
      easterCounters.reindeer += 1;
      triggerBounceClass(reindeerBtn, 'is-active', 540);
      showSpeechBubble(reindeerBubbleEl, line);
      spawnConfetti(reindeerBtn, 12, false);
      playBoingSound();
    });
  }

  if (santaBtn) {
    santaBtn.addEventListener('click', () => {
      const line = SANTA_LINES[easterCounters.santa % SANTA_LINES.length];
      easterCounters.santa += 1;
      triggerBounceClass(santaBtn, 'is-kicking', 1100);
      showSpeechBubble(santaBubbleEl, line);
      spawnConfetti(santaBtn, 14, false);
      playBoingSound();
    });
  }

  if (moonBtn) {
    moonBtn.addEventListener('click', () => {
      triggerBounceClass(moonBtn, 'is-booped', 580);
      spawnConfetti(moonBtn, 18, false);
      playBoingSound();
    });
  }

  // Una finestra chiusa ogni tanto "bussa" per farsi aprire!
  setInterval(() => {
    const closedWindows = facadeEl.querySelectorAll('.box-window:not(.is-open)');
    if (closedWindows.length === 0 || !modalOverlayEl.hidden) return;
    const randomWin = closedWindows[Math.floor(Math.random() * closedWindows.length)];
    triggerBounceClass(randomWin, 'is-knocking', 650);
  }, 4200);

  // Controlli HUD: Follia Natalizia & Suoni
  if (partyBtn && stageEl) {
    partyBtn.addEventListener('click', () => {
      partyMode = !partyMode;
      stageEl.classList.toggle('is-party', partyMode);
      partyBtn.setAttribute('aria-pressed', String(partyMode));
      if (partyMode) {
        spawnConfetti(partyBtn, 46, true);
        playPartySound();
      }
    });
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundBtn.setAttribute('aria-pressed', String(soundEnabled));
      soundBtn.innerHTML = soundEnabled
        ? '<span aria-hidden="true">🔊</span>'
        : '<span aria-hidden="true">🔇</span>';
      if (soundEnabled) {
        playTone(783.99, 0, 0.14, 'triangle', 0.08);
      }
    });
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalConfirmBtn.addEventListener('click', closeModal);

  modalOverlayEl.addEventListener('click', (event) => {
    if (event.target === modalOverlayEl) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modalOverlayEl.hidden) {
      closeModal();
    }
  });

  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  document.addEventListener('fullscreenchange', () => {
    fullscreenBtn.innerHTML = document.fullscreenElement
      ? '<span aria-hidden="true">✕</span>'
      : '<span aria-hidden="true">⛶</span>';
  });

  window.addEventListener('storage', (event) => {
    if (event.key === AdventStorage.STORAGE_KEY) {
      renderHouse();
    }
  });

  initSnowfall();
  renderHouse();
  registerServiceWorker();
})();
