(function () {
  'use strict';

  const facadeEl = document.getElementById('house-facade');
  const openedCounterEl = document.getElementById('opened-counter');
  const fullscreenBtn = document.getElementById('btn-fullscreen');

  const modalOverlayEl = document.getElementById('modal-overlay');
  const modalBoxBadgeEl = document.getElementById('modal-box-badge');
  const modalStatusTagEl = document.getElementById('modal-status-tag');
  const modalTitleEl = document.getElementById('modal-title');
  const modalDescriptionEl = document.getElementById('modal-description');
  const modalCloseBtn = document.getElementById('modal-close');
  const modalConfirmBtn = document.getElementById('modal-confirm');

  const OPEN_ICONS = ['✨', '🎄', '⭐', '🎁', '🕯️', '❄️', '🔔', '🦌'];

  let lastFocusedTrigger = null;

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

    return btn;
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

    // Aggiorna contatore e badge modalità
    const totalOpened = Object.keys(opened).length;
    if (openedCounterEl) {
      openedCounterEl.textContent = `Aperte: ${totalOpened} / 25`;
    }
  }

  function openModal(boxNumber, content) {
    modalBoxBadgeEl.textContent = boxNumber === 25 ? 'Portone #25' : `Casella #${boxNumber}`;

    if (content.alreadyOpened) {
      modalStatusTagEl.textContent = 'Già aperta';
      modalStatusTagEl.classList.remove('is-new');
    } else {
      modalStatusTagEl.textContent = 'Nuova apertura!';
      modalStatusTagEl.classList.add('is-new');
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

  facadeEl.addEventListener('click', (event) => {
    const target = event.target.closest('[data-box]');
    if (!target) return;

    const boxNumber = Number(target.dataset.box);
    if (!Number.isInteger(boxNumber)) return;

    const { content } = AdventStorage.openBox(boxNumber);
    renderHouse();
    lastFocusedTrigger = facadeEl.querySelector(`[data-box="${boxNumber}"]`);
    openModal(boxNumber, content);
  });

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

  renderHouse();
  registerServiceWorker();
})();
