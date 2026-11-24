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
      windowOrder: shuffleArray(createOrderedNumbers()),
      items: DEFAULT_ITEMS.map((item) => ({ ...item })),
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

  function sanitizeItems(items) {
    if (!Array.isArray(items) || items.length === 0) {
      return DEFAULT_ITEMS.map((item) => ({ ...item }));
    }
    return items.map((item, idx) => ({
      id: typeof item.id === 'string' && item.id.trim() ? item.id.trim() : `item-${Date.now()}-${idx}`,
      title: typeof item.title === 'string' ? item.title : '',
      description: typeof item.description === 'string' ? item.description : ''
    }));
  }

  function sanitizeData(raw) {
    if (!raw || typeof raw !== 'object') {
      return createDefaultData();
    }

    const mode = raw.mode === 'fixed' ? 'fixed' : 'sequential';
    const windowOrder = sanitizeWindowOrder(raw.windowOrder);
    const items = sanitizeItems(raw.items);

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
      windowOrder,
      items,
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

  function resolveOpenedContent(data, boxNumber) {
    const key = String(boxNumber);
    const existing = data.state.openedBoxes[key];
    if (!existing) return null;

    if (existing.itemId) {
      const found = data.items.find((it) => it.id === existing.itemId);
      if (found) {
        return { title: found.title, description: found.description, alreadyOpened: true };
      }
    }

    if (existing.title || existing.description) {
      return {
        title: existing.title || 'Sorpresa',
        description: existing.description || '',
        alreadyOpened: true
      };
    }

    const byIndex = data.items[existing.itemIndex];
    if (byIndex) {
      return { title: byIndex.title, description: byIndex.description, alreadyOpened: true };
    }

    return { title: 'Casella aperta', description: 'Contenuto non più presente nella lista.', alreadyOpened: true };
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
          description: 'Nessun contenuto configurato per questa posizione. Aggiungi altri elementi in Configurazione.'
        };

    data.state.openedBoxes[key] = {
      itemIndex,
      itemId: resolvedItem.id,
      title: resolvedItem.title,
      description: resolvedItem.description,
      openedAt: new Date().toISOString()
    };

    const saved = saveData(data);
    return {
      data: saved,
      content: {
        title: resolvedItem.title,
        description: resolvedItem.description,
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
      windowOrder: data.windowOrder,
      items: data.items
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
    loadData,
    saveData,
    openBox,
    resetGame,
    shuffleWindows,
    orderWindowsSequentially,
    exportToJSON,
    importFromJSON,
    createDefaultData
  };
})(window);
