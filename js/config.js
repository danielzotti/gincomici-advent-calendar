(function () {
  'use strict';

  const modeInputs = document.querySelectorAll('input[name="gameMode"]');
  const openedStatusEl = document.getElementById('opened-status');
  const resetGameBtn = document.getElementById('btn-reset-game');
  const shuffleWindowsBtn = document.getElementById('btn-shuffle-windows');
  const sortWindowsBtn = document.getElementById('btn-sort-windows');
  const windowOrderPreviewEl = document.getElementById('window-order-preview');
  const exportStateChk = document.getElementById('chk-export-state');
  const exportJsonBtn = document.getElementById('btn-export-json');
  const importJsonBtn = document.getElementById('btn-import-json');
  const importJsonFileInput = document.getElementById('file-import-json');
  const restoreDefaultsBtn = document.getElementById('btn-restore-defaults');
  const addItemBtn = document.getElementById('btn-add-item');
  const itemsListEl = document.getElementById('items-list');
  const itemsCountEl = document.getElementById('items-count');
  const itemsHintEl = document.getElementById('items-hint');
  const toastEl = document.getElementById('toast');

  let currentData = AdventStorage.loadData();
  let draggedIndex = null;
  let toastTimer = null;

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
        .catch(() => {});
    });
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.hidden = true;
    }, 2800);
  }

  function persist() {
    currentData = AdventStorage.saveData(currentData);
    renderMeta();
  }

  function getBadgeInfo(index, mode) {
    const pos = index + 1;
    if (mode === 'fixed') {
      if (pos === 25) {
        return { label: 'Portone #25', cls: 'position-badge is-door' };
      }
      if (pos > 25) {
        return { label: `Extra #${pos}`, cls: 'position-badge is-extra' };
      }
      return { label: `Casella #${pos}`, cls: 'position-badge' };
    }

    if (pos === 25) {
      return { label: '25° estratto', cls: 'position-badge is-door' };
    }
    if (pos > 25) {
      return { label: `Extra #${pos}`, cls: 'position-badge is-extra' };
    }
    return { label: `${pos}° estratto`, cls: 'position-badge' };
  }

  function renderMeta() {
    // Radio mode
    modeInputs.forEach((input) => {
      input.checked = input.value === currentData.mode;
    });

    // Opened count
    const openedCount = Object.keys(currentData.state.openedBoxes || {}).length;
    openedStatusEl.textContent = `${openedCount} / 25`;

    // Window order preview per floor
    const o = currentData.windowOrder;
    const f4 = o.slice(0, 6).join(', ');
    const f3 = o.slice(6, 12).join(', ');
    const f2 = o.slice(12, 18).join(', ');
    const f1 = `${o.slice(18, 21).join(', ')}, |25|, ${o.slice(21, 24).join(', ')}`;
    windowOrderPreviewEl.innerHTML = `Piano 4: ${f4}<br/>Piano 3: ${f3} <br/>Piano 2: ${f2} <br/>Terra: ${f1}`;

    // Items header hint
    itemsCountEl.textContent = String(currentData.items.length);
    itemsHintEl.textContent =
      currentData.mode === 'fixed'
        ? 'Modalità Casella fissa attiva: trascina gli elementi per associarli direttamente alle caselle #1–#24 e al Portone #25.'
        : 'Modalità Sequenziale attiva: trascina gli elementi per definire l’ordine di estrazione al click sulle caselle.';
  }

  function refreshBadgesOnly() {
    const rows = itemsListEl.querySelectorAll('.item-row');
    rows.forEach((row, idx) => {
      const badgeEl = row.querySelector('.position-badge');
      const info = getBadgeInfo(idx, currentData.mode);
      badgeEl.className = info.cls;
      badgeEl.textContent = info.label;
    });
  }

  function renderItems() {
    itemsListEl.innerHTML = '';

    currentData.items.forEach((item, index) => {
      const li = document.createElement('li');
      li.className = 'item-row';
      li.dataset.index = String(index);
      li.draggable = false;

      // Maniglia drag & drop (abilita draggable solo quando si afferra la maniglia, lasciando libera la selezione testo negli input)
      const handle = document.createElement('div');
      handle.className = 'drag-handle';
      handle.title = 'Trascina per riordinare';
      handle.setAttribute('aria-label', 'Trascina per riordinare');
      handle.textContent = '☰';

      handle.addEventListener('pointerdown', () => {
        li.draggable = true;
      });
      handle.addEventListener('pointerup', () => {
        li.draggable = false;
      });

      const badge = document.createElement('span');
      const badgeInfo = getBadgeInfo(index, currentData.mode);
      badge.className = badgeInfo.cls;
      badge.textContent = badgeInfo.label;

      const fields = document.createElement('div');
      fields.className = 'item-fields';

      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.className = 'field-input';
      titleInput.placeholder = 'Titolo della sorpresa...';
      titleInput.value = item.title;
      titleInput.setAttribute('aria-label', `Titolo elemento ${index + 1}`);
      titleInput.addEventListener('input', (e) => {
        currentData.items[index].title = e.target.value;
        persist();
      });

      const descInput = document.createElement('textarea');
      descInput.className = 'field-textarea';
      descInput.placeholder = 'Descrizione o consegna da mostrare nel modale...';
      descInput.value = item.description;
      descInput.setAttribute('aria-label', `Descrizione elemento ${index + 1}`);
      descInput.addEventListener('input', (e) => {
        currentData.items[index].description = e.target.value;
        persist();
      });

      fields.appendChild(titleInput);
      fields.appendChild(descInput);

      const controls = document.createElement('div');
      controls.className = 'item-controls';

      const upBtn = document.createElement('button');
      upBtn.type = 'button';
      upBtn.className = 'btn-icon';
      upBtn.title = 'Sposta su';
      upBtn.setAttribute('aria-label', 'Sposta su');
      upBtn.textContent = '↑';
      upBtn.disabled = index === 0;
      upBtn.addEventListener('click', () => moveItem(index, index - 1));

      const downBtn = document.createElement('button');
      downBtn.type = 'button';
      downBtn.className = 'btn-icon';
      downBtn.title = 'Sposta giù';
      downBtn.setAttribute('aria-label', 'Sposta giù');
      downBtn.textContent = '↓';
      downBtn.disabled = index === currentData.items.length - 1;
      downBtn.addEventListener('click', () => moveItem(index, index + 1));

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn-icon btn-icon--danger';
      delBtn.title = 'Elimina elemento';
      delBtn.setAttribute('aria-label', 'Elimina elemento');
      delBtn.textContent = '✕';
      delBtn.addEventListener('click', () => deleteItem(index));

      controls.appendChild(upBtn);
      controls.appendChild(downBtn);
      controls.appendChild(delBtn);

      // Eventi HTML5 Drag & Drop
      li.addEventListener('dragstart', (e) => {
        draggedIndex = index;
        li.classList.add('is-dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
      });

      li.addEventListener('dragend', () => {
        li.draggable = false;
        li.classList.remove('is-dragging');
        itemsListEl.querySelectorAll('.is-drag-over').forEach((el) => el.classList.remove('is-drag-over'));
        draggedIndex = null;
      });

      li.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;
        e.dataTransfer.dropEffect = 'move';
        li.classList.add('is-drag-over');
      });

      li.addEventListener('dragleave', () => {
        li.classList.remove('is-drag-over');
      });

      li.addEventListener('drop', (e) => {
        e.preventDefault();
        li.classList.remove('is-drag-over');
        if (draggedIndex === null || draggedIndex === index) return;
        moveItem(draggedIndex, index);
      });

      li.appendChild(handle);
      li.appendChild(badge);
      li.appendChild(fields);
      li.appendChild(controls);

      itemsListEl.appendChild(li);
    });
  }

  function moveItem(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= currentData.items.length || fromIndex === toIndex) return;
    const [moved] = currentData.items.splice(fromIndex, 1);
    currentData.items.splice(toIndex, 0, moved);
    persist();
    renderItems();
  }

  function deleteItem(index) {
    if (currentData.items.length <= 1) {
      showToast('Deve rimanere almeno un elemento nella lista.');
      return;
    }
    currentData.items.splice(index, 1);
    persist();
    renderItems();
    showToast('Elemento rimosso.');
  }

  // Listener cambio modalità
  modeInputs.forEach((input) => {
    input.addEventListener('change', (e) => {
      currentData.mode = e.target.value === 'fixed' ? 'fixed' : 'sequential';
      persist();
      refreshBadgesOnly();
      showToast(
        currentData.mode === 'fixed'
          ? 'Modalità "Casella fissa" attivata.'
          : 'Modalità "Sequenziale" attivata.'
      );
    });
  });

  // Reset Partita
  resetGameBtn.addEventListener('click', () => {
    const openedCount = Object.keys(currentData.state.openedBoxes || {}).length;
    if (openedCount === 0) {
      showToast('Tutte le caselle sono già chiuse.');
      return;
    }
    if (window.confirm(`Vuoi chiudere tutte le ${openedCount} caselle aperte? I contenuti configurati non verranno modificati.`)) {
      currentData = AdventStorage.resetGame();
      renderMeta();
      showToast('Partita resettata: tutte le finestre sono di nuovo chiuse.');
    }
  });

  // Disposizione numeri finestre
  shuffleWindowsBtn.addEventListener('click', () => {
    currentData = AdventStorage.shuffleWindows();
    renderMeta();
    showToast('Numeri delle 24 finestre rimescolati!');
  });

  sortWindowsBtn.addEventListener('click', () => {
    currentData = AdventStorage.orderWindowsSequentially();
    renderMeta();
    showToast('Numeri delle finestre ordinati da 1 a 24.');
  });

  // Aggiunta elemento
  addItemBtn.addEventListener('click', () => {
    const nextNum = currentData.items.length + 1;
    currentData.items.push({
      id: `item-${Date.now()}-${nextNum}`,
      title: `Nuovo elemento #${nextNum}`,
      description: ''
    });
    persist();
    renderItems();
    const lastInput = itemsListEl.lastElementChild?.querySelector('.field-input');
    if (lastInput) {
      lastInput.focus();
      lastInput.select();
    }
    showToast('Nuovo elemento aggiunto.');
  });

  // Ripristina predefiniti
  restoreDefaultsBtn.addEventListener('click', () => {
    if (window.confirm('Ripristinare i 25 elementi predefiniti e resettare la configurazione attuale?')) {
      currentData = AdventStorage.saveData(AdventStorage.createDefaultData());
      renderMeta();
      renderItems();
      showToast('Configurazione predefinita ripristinata.');
    }
  });

  // Esporta JSON
  exportJsonBtn.addEventListener('click', () => {
    const json = AdventStorage.exportToJSON(exportStateChk.checked);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateTag = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `calendario-avvento-config-${dateTag}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Configurazione esportata in JSON.');
  });

  // Importa JSON
  importJsonBtn.addEventListener('click', () => {
    importJsonFileInput.value = '';
    importJsonFileInput.click();
  });

  importJsonFileInput.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        currentData = AdventStorage.importFromJSON(String(reader.result));
        renderMeta();
        renderItems();
        showToast('Configurazione importata con successo!');
      } catch (err) {
        alert(`Errore durante l'importazione del JSON: ${err.message}`);
      }
    };
    reader.readAsText(file);
  });

  renderMeta();
  renderItems();
  registerServiceWorker();
})();
