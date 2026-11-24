(function (global) {
  'use strict';

  const STORAGE_KEY = 'advent_calendar_data_v1';

  const DEFAULT_ITEMS = [
    {
      id: 'item-1',
      title: 'Haiku sul Natale',
      description: 'Scrivi o improvvisa un haiku (5-7-5 sillabe) dedicato al Natale e alla magia delle feste.'
    },
    {
      id: 'item-2',
      title: 'Elogio Funebre a un oggetto',
      description: 'Recita un discorso solenne ed emozionante per dare l’ultimo saluto a un oggetto di uso quotidiano.'
    },
    {
      id: 'item-3',
      title: 'Recensione 1 stella',
      description: 'Improvvisa una recensione indignata da 1 stella sul Natale, su Babbo Natale o sul cenone.'
    },
    {
      id: 'item-4',
      title: 'Il regalo peggiore',
      description: 'Racconta o inventa il regalo di Natale più assurdo e indesiderato mai ricevuto, difendendolo a spada tratta.'
    },
    {
      id: 'item-5',
      title: 'Cose da non dire al...',
      description: 'Elenca le frasi assolutamente da evitare durante il pranzo di Natale con i parenti.'
    },
    {
      id: 'item-6',
      title: 'Pubblicità Progresso Assurda',
      description: 'Crea uno spot televisivo per sensibilizzare su un finto problema natalizio gravissimo.'
    },
    {
      id: 'item-7',
      title: 'Lettera a Babbo Natale (Adulto)',
      description: 'Scrivi una richiesta di regali realisticamente disperata, in tono formale o burocratico.'
    },
    {
      id: 'item-8',
      title: 'Il Grinch Condominiale',
      description: 'Scrivi una mail di lamentela dell’amministratore contro le luci natalizie dei vicini.'
    },
    {
      id: 'item-9',
      title: 'Canzone di Natale Riscritta',
      description: 'Cambia il testo di un classico natalizio trasformandolo nella cronaca di una giornata storta.'
    },
    {
      id: 'item-10',
      title: 'Telegiornale dal Polo Nord',
      description: 'Annuncia in diretta una crisi sindacale degli elfi o uno sciopero delle renne.'
    },
    {
      id: 'item-11',
      title: 'Scusa per il Ritardo',
      description: 'Inventa la giustificazione più incredibile ma credibile per arrivare in ritardo alla vigilia.'
    },
    {
      id: 'item-12',
      title: 'Menu Stellato Ridicolo',
      description: 'Descrivi un piatto semplicissimo (es. panettone o pasta in bianco) come uno chef stellato.'
    },
    {
      id: 'item-13',
      title: 'Oroscopo Natalizio Estremo',
      description: 'Fai le previsioni per il prossimo anno di un segno zodiacale a scelta con toni drammatici.'
    },
    {
      id: 'item-14',
      title: 'Intervista alla Renna Rudolph',
      description: 'Interpreta Rudolph che racconta cosa succede davvero dietro le quinte della slitta.'
    },
    {
      id: 'item-15',
      title: 'Tutorial Inutile',
      description: 'Spiega passo per passo come si scarta un regalo nel modo più complicato possibile.'
    },
    {
      id: 'item-16',
      title: 'Conflitto Pandoro vs Panettone',
      description: 'Tieni un’arringa da tribunale per difendere (o condannare) i canditi nel panettone.'
    },
    {
      id: 'item-17',
      title: 'Trailer Cinematografico',
      description: 'Presenta con voce epica la trama del film d’azione intitolato "L’Ultimo Rotolo di Scotch".'
    },
    {
      id: 'item-18',
      title: 'Messaggio Vocale Sbagliato',
      description: 'Simula un audio di 30 secondi mandato per sbaglio nel gruppo WhatsApp di famiglia.'
    },
    {
      id: 'item-19',
      title: 'Guida alla Sopravvivenza',
      description: 'Tre regole d’oro per uscire indenni da una partita a tombola ad alta tensione.'
    },
    {
      id: 'item-20',
      title: 'Segreto di Pulcinella',
      description: 'Confessa un piccolo complotto domestico legato ai biscotti lasciati per Babbo Natale.'
    },
    {
      id: 'item-21',
      title: 'Teoria del Complotto Festiva',
      description: 'Spiega con assoluta serietà perché i maglioni natalizi brutti controllano il meteo.'
    },
    {
      id: 'item-22',
      title: 'Diario di un Albero di Natale',
      description: 'Leggi tre pagine del diario segreto dell’abete in salotto dal 8 dicembre al 6 gennaio.'
    },
    {
      id: 'item-23',
      title: 'Sfida dei Sinonimi',
      description: 'Descrivi una cena di Natale senza poter usare le parole: cibo, regalo, famiglia, freddo.'
    },
    {
      id: 'item-24',
      title: 'Il Discorso della Vigilia',
      description: 'Un brindisi solenne ma esilarante per celebrare la sopravvivenza fino al 24 dicembre.'
    },
    {
      id: 'item-25',
      title: 'Gran Finale di Natale',
      description: 'Hai aperto il portone principale! Sorpresa speciale di Natale per tutti i presenti.'
    }
  ];

  const DEFAULT_LISTS = {
    openIcons: [
      '🎤', '🍸', '🎄', '🎅', '🎁', '🦌', '🔔', '🍾',
      '🧦', '⛄', '⭐', '🍪', '🎺', '🎭', '❄️', '🕯️'
    ],
    newOpenTags: [
      '🎤 Sul palco adesso!',
      '🍸 Gin & Jingle!',
      '🎅 Approvato dagli Elfi!',
      '🦌 Rudolph approva!',
      '🎄 Follia Estratta!'
    ],
    funQuips: [
      'Consiglio: leggila con tono solenne da Oscar.',
      'Effetto collaterale: risate incontrollate garantite.',
      'Approvato dal Comitato Feste Disastrose.',
      '100% spirito natalizio, 0% dignità.',
      'Se qualcuno non ride, paga il prossimo giro!',
      'Garantito dai Gin Comici del Polo Nord.'
    ],
    snowmanLines: [
      'È acqua tonica nel bicchiere, lo giuro! 🍸',
      'Non mi sto sciogliendo, è l’ansia da palco!',
      'Qualcuno ha visto un microfono più freddo? 🎤',
      'Un altro giro di Gin-gle Bells!',
      'Sono fatto di neve, ma spacco di brutto! ⛄'
    ],
    reindeerLines: [
      'Il naso rosso è solo colpa del vin brulé! 🔴',
      'Ho parcheggiato la slitta in doppia fila!',
      'Non toccare il naso, è in modalità turbo!',
      'Gli elfi hanno chiesto l’aumento in panettoni.',
      'Quest’anno traino solo verso l’open bar! 🦌'
    ],
    santaLines: [
      'Troppo pandoro con il mascarpone! 🎅',
      'NON ACCENDETE IL CAMINO!!',
      'Mi sono incastrato sulla casella 14!',
      'Qualcuno tiri le gambe... piano però!',
      'Ho perso la lista dei buoni nel camino!'
    ]
  };

  const DEFAULT_PLAQUE_TEXT = 'Calendario dell\'evento';

  const VALID_ICON_MODES = new Set(['random', 'custom', 'hidden']);

  function cloneDefaultLists() {
    return {
      openIcons: DEFAULT_LISTS.openIcons.slice(),
      newOpenTags: DEFAULT_LISTS.newOpenTags.slice(),
      funQuips: DEFAULT_LISTS.funQuips.slice(),
      snowmanLines: DEFAULT_LISTS.snowmanLines.slice(),
      reindeerLines: DEFAULT_LISTS.reindeerLines.slice(),
      santaLines: DEFAULT_LISTS.santaLines.slice()
    };
  }

  function cloneDefaultItems() {
    return DEFAULT_ITEMS.map((item) => ({
      ...item,
      iconMode: 'random',
      customIcon: ''
    }));
  }

  function createOrderedNumbers() {
    return Array.from({ length: 24 }, (_, i) => i + 1);
  }

  function shuffleArray(array) {
    const copy = array.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function createDefaultData() {
    return {
      version: 1,
      mode: 'sequential', // 'sequential' | 'fixed'
      plaqueText: DEFAULT_PLAQUE_TEXT,
      windowOrder: shuffleArray(createOrderedNumbers()),
      items: cloneDefaultItems(),
      customLists: cloneDefaultLists(),
      state: {
        openedBoxes: {},
        sequentialCursor: 0
      }
    };
  }

  function sanitizeWindowOrder(order) {
    if (!Array.isArray(order) || order.length !== 24) {
      return shuffleArray(createOrderedNumbers());
    }
    const seen = new Set();
    const valid = order.every((n) => Number.isInteger(n) && n >= 1 && n <= 24 && !seen.has(n) && seen.add(n));
    return valid ? order.slice() : shuffleArray(createOrderedNumbers());
  }

  function sanitizeIconMode(mode) {
    return VALID_ICON_MODES.has(mode) ? mode : 'random';
  }

  function sanitizeItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return cloneDefaultItems();
    }
    return items.map((item, idx) => ({
      id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `item-${Date.now()}-${idx}`,
      title: typeof item.title === 'string' ? item.title : '',
      description: typeof item.description === 'string' ? item.description : '',
      iconMode: sanitizeIconMode(item.iconMode),
      customIcon: typeof item.customIcon === 'string' ? item.customIcon : ''
    }));
  }

  function sanitizeStringArray(arr, fallback) {
    if (!Array.isArray(arr)) {
      return fallback.slice();
    }
    return arr
      .filter((val) => typeof val === 'string')
      .map((val) => val.trim())
      .filter(Boolean);
  }

  function sanitizeCustomLists(rawLists) {
    if (!rawLists || typeof rawLists !== 'object') {
      return cloneDefaultLists();
    }
    return {
      openIcons: sanitizeStringArray(rawLists.openIcons, DEFAULT_LISTS.openIcons),
      newOpenTags: sanitizeStringArray(rawLists.newOpenTags, DEFAULT_LISTS.newOpenTags),
      funQuips: sanitizeStringArray(rawLists.funQuips, DEFAULT_LISTS.funQuips),
      snowmanLines: sanitizeStringArray(rawLists.snowmanLines, DEFAULT_LISTS.snowmanLines),
      reindeerLines: sanitizeStringArray(rawLists.reindeerLines, DEFAULT_LISTS.reindeerLines),
      santaLines: sanitizeStringArray(rawLists.santaLines, DEFAULT_LISTS.santaLines)
    };
  }

  function sanitizeData(raw) {
    if (!raw || typeof raw !== 'object') {
      return createDefaultData();
    }

    const mode = raw.mode === 'fixed' ? 'fixed' : 'sequential';
    const plaqueText = typeof raw.plaqueText === 'string' ? raw.plaqueText : DEFAULT_PLAQUE_TEXT;
    const windowOrder = sanitizeWindowOrder(raw.windowOrder);
    const items = sanitizeItems(raw.items);
    const customLists = sanitizeCustomLists(raw.customLists);

    const rawState = raw.state && typeof raw.state === 'object' ? raw.state : {};
    const rawOpened = rawState.openedBoxes && typeof rawState.openedBoxes === 'object' ? rawState.openedBoxes : {};
    const openedBoxes = {};

    Object.keys(rawOpened).forEach((key) => {
      const boxNum = Number(key);
      const entry = rawOpened[key];
      if (Number.isInteger(boxNum) && boxNum >= 1 && boxNum <= 25 && entry && typeof entry === 'object') {
        openedBoxes[String(boxNum)] = {
          itemIndex: Number.isInteger(entry.itemIndex) ? entry.itemIndex : 0,
          itemId: typeof entry.itemId === 'string' ? entry.itemId : null,
          title: typeof entry.title === 'string' ? entry.title : '',
          description: typeof entry.description === 'string' ? entry.description : '',
          iconMode: sanitizeIconMode(entry.iconMode),
          resolvedIcon: typeof entry.resolvedIcon === 'string' ? entry.resolvedIcon : '',
          openedAt: typeof entry.openedAt === 'string' ? entry.openedAt : new Date().toISOString()
        };
      }
    });

    const sequentialCursor =
      Number.isInteger(rawState.sequentialCursor) && rawState.sequentialCursor >= 0
        ? rawState.sequentialCursor
        : Object.keys(openedBoxes).length;

    return {
      version: 1,
      mode,
      plaqueText,
      windowOrder,
      items,
      customLists,
      state: {
        openedBoxes,
        sequentialCursor
      }
    };
  }

  function loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        const fresh = createDefaultData();
        saveData(fresh);
        return fresh;
      }
      const parsed = JSON.parse(stored);
      return sanitizeData(parsed);
    } catch (e) {
      console.warn('Errore nel caricamento da localStorage, uso configurazione predefinita:', e);
      return createDefaultData();
    }
  }

  function saveData(data) {
    const sanitized = sanitizeData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return sanitized;
  }

  function getEffectiveOpenIcons(data) {
    const list = data && data.customLists && Array.isArray(data.customLists.openIcons)
      ? data.customLists.openIcons
      : [];
    return list.length > 0 ? list : DEFAULT_LISTS.openIcons;
  }

  function pickRandomOpenIcon(data) {
    const icons = getEffectiveOpenIcons(data);
    return icons[Math.floor(Math.random() * icons.length)];
  }

  function pickDeterministicOpenIcon(boxNumber, data) {
    const icons = getEffectiveOpenIcons(data);
    const idx = Math.max(0, boxNumber - 1) % icons.length;
    return icons[idx];
  }

  function resolveItemIcon(item, existing, boxNumber, data) {
    const mode = sanitizeIconMode(item ? item.iconMode : existing && existing.iconMode);
    if (mode === 'hidden') {
      return { iconMode: 'hidden', resolvedIcon: '' };
    }
    if (mode === 'custom') {
      const custom = item && typeof item.customIcon === 'string' ? item.customIcon.trim() : '';
      if (custom) {
        return { iconMode: 'custom', resolvedIcon: custom };
      }
      if (existing && existing.resolvedIcon) {
        return { iconMode: 'custom', resolvedIcon: existing.resolvedIcon };
      }
      return { iconMode: 'custom', resolvedIcon: pickDeterministicOpenIcon(boxNumber, data) };
    }
    if (existing && existing.iconMode === 'random' && existing.resolvedIcon) {
      return { iconMode: 'random', resolvedIcon: existing.resolvedIcon };
    }
    return { iconMode: 'random', resolvedIcon: pickDeterministicOpenIcon(boxNumber, data) };
  }

  function resolveOpenedContent(data, boxNumber) {
    const key = String(boxNumber);
    const existing = data.state.openedBoxes[key];
    if (!existing) return null;

    if (existing.itemId) {
      const found = data.items.find((it) => it.id === existing.itemId);
      if (found) {
        const iconInfo = resolveItemIcon(found, existing, boxNumber, data);
        return {
          title: found.title,
          description: found.description,
          iconMode: iconInfo.iconMode,
          resolvedIcon: iconInfo.resolvedIcon,
          alreadyOpened: true
        };
      }
    }

    if (existing.title || existing.description) {
      const iconInfo = resolveItemIcon(null, existing, boxNumber, data);
      return {
        title: existing.title || 'Sorpresa',
        description: existing.description || '',
        iconMode: iconInfo.iconMode,
        resolvedIcon: iconInfo.resolvedIcon,
        alreadyOpened: true
      };
    }

    const byIndex = data.items[existing.itemIndex];
    if (byIndex) {
      const iconInfo = resolveItemIcon(byIndex, existing, boxNumber, data);
      return {
        title: byIndex.title,
        description: byIndex.description,
        iconMode: iconInfo.iconMode,
        resolvedIcon: iconInfo.resolvedIcon,
        alreadyOpened: true
      };
    }

    return {
      title: 'Casella aperta',
      description: 'Contenuto non più presente nella lista.',
      iconMode: 'random',
      resolvedIcon: pickDeterministicOpenIcon(boxNumber, data),
      alreadyOpened: true
    };
  }

  function openBox(boxNumber) {
    const data = loadData();
    const key = String(boxNumber);

    // Se già aperta, restituisci esattamente lo stesso contenuto aperto in precedenza
    if (data.state.openedBoxes[key]) {
      return {
        data,
        content: resolveOpenedContent(data, boxNumber)
      };
    }

    let itemIndex;
    if (data.mode === 'fixed') {
      itemIndex = boxNumber - 1;
    } else {
      itemIndex = data.state.sequentialCursor;
      data.state.sequentialCursor += 1;
    }

    const item = data.items[itemIndex];
    const resolvedItem = item
      ? item
      : {
          id: `fallback-${boxNumber}`,
          title: `Casella #${boxNumber}`,
          description: 'Nessun contenuto configurato per questa posizione. Aggiungi altri elementi in Configurazione.',
          iconMode: 'random',
          customIcon: ''
        };

    const iconMode = sanitizeIconMode(resolvedItem.iconMode);
    let resolvedIcon = '';
    if (iconMode === 'custom') {
      resolvedIcon = (resolvedItem.customIcon || '').trim() || pickRandomOpenIcon(data);
    } else if (iconMode === 'random') {
      resolvedIcon = pickRandomOpenIcon(data);
    }

    data.state.openedBoxes[key] = {
      itemIndex,
      itemId: resolvedItem.id,
      title: resolvedItem.title,
      description: resolvedItem.description,
      iconMode,
      resolvedIcon,
      openedAt: new Date().toISOString()
    };

    const saved = saveData(data);
    return {
      data: saved,
      content: {
        title: resolvedItem.title,
        description: resolvedItem.description,
        iconMode,
        resolvedIcon,
        alreadyOpened: false
      }
    };
  }

  function resetGame() {
    const data = loadData();
    data.state.openedBoxes = {};
    data.state.sequentialCursor = 0;
    return saveData(data);
  }

  function shuffleWindows() {
    const data = loadData();
    data.windowOrder = shuffleArray(createOrderedNumbers());
    return saveData(data);
  }

  function orderWindowsSequentially() {
    const data = loadData();
    data.windowOrder = createOrderedNumbers();
    return saveData(data);
  }

  function exportToJSON(includeState = true) {
    const data = loadData();
    const payload = {
      version: data.version,
      mode: data.mode,
      plaqueText: data.plaqueText,
      windowOrder: data.windowOrder,
      items: data.items,
      customLists: data.customLists
    };
    if (includeState) {
      payload.state = data.state;
    } else {
      payload.state = { openedBoxes: {}, sequentialCursor: 0 };
    }
    return JSON.stringify(payload, null, 2);
  }

  function importFromJSON(jsonString) {
    const parsed = JSON.parse(jsonString);
    if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.items)) {
      throw new Error('Il file JSON non contiene una lista "items" valida.');
    }
    const sanitized = sanitizeData(parsed);
    return saveData(sanitized);
  }

  global.AdventStorage = {
    STORAGE_KEY,
    DEFAULT_ITEMS,
    DEFAULT_LISTS,
    DEFAULT_PLAQUE_TEXT,
    getDefaultLists: cloneDefaultLists,
    loadData,
    saveData,
    openBox,
    resolveOpenedContent,
    resetGame,
    shuffleWindows,
    orderWindowsSequentially,
    exportToJSON,
    importFromJSON,
    createDefaultData
  };
})(window);
