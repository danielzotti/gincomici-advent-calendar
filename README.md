# Advent Calendar 16:9 PWA

An interactive, offline-ready Christmas Advent Calendar Progressive Web App (PWA) built with pure **HTML5, CSS3, and Vanilla JavaScript**, with zero external runtime dependencies.

---

## English

### Features

- **Strict 16:9 Proportional Interface:**
  - The main stage is locked to a `16:9` aspect ratio (`aspect-ratio: 16 / 9`) and uses CSS Container Query Units (`cqw`) for every dimension, font size, border, spacing, shadow, and modal dialog.
  - Resizing the browser window (wider, narrower, or fullscreen) automatically scales the entire interface while keeping exact visual proportions.
- **4-Story Christmas House (24 Windows + Central Door #25):**
  - **Upper 3 Floors:** 6 windows per floor (`18` windows).
  - **Ground Floor:** 6 slightly smaller windows (3 on the left, 3 on the right) plus the central arched **Front Door (#25)** for a total of 25 interactive boxes.
  - **Visual Open/Closed States:** Closed windows feature winter night glass; opened windows swing their shutters outward, glow with a warm golden interior light, display a festive icon, and keep their number badge visible.
- **Two Game Modes:**
  1. **Sequential Mode (Default):** Regardless of which closed window or door you click, items are revealed in the pre-configured sequence (1st click reveals item #1, 2nd click reveals item #2, etc.).
  2. **Fixed-Box Mode:** Each list position maps directly to a specific box number (item #1 → box #1, item #14 → box #14, ..., item #25 → front door #25).
- **Persistent State:**
  - All opened boxes and their assigned content are saved in `localStorage`. Re-clicking an already opened window always reopens the exact same content revealed previously.
- **Configuration Page (`/configuration.html`):**
  - Switch between **Sequential** and **Fixed-Box** modes at any time.
  - **Drag & Drop** sortable list (plus `↑`/`↓` accessibility buttons) to edit titles, descriptions, add new items, or delete items.
  - **Reset Game:** Close all opened windows and reset the sequential counter without losing any configured titles/descriptions.
  - **Window Numbering Layout:** Shuffle the 1–24 numbers randomly across the house facade or sort them sequentially (`1–24`).
  - **JSON Export & Import:** Export the full configuration (optionally including currently opened boxes) to a `.json` file and import it on any device.
- **Offline PWA Support:**
  - Includes `manifest.json` and a Network-First Service Worker (`sw.js`) that fetches fresh updates whenever online and caches all HTML, CSS, JavaScript, and icon assets in the browser cache for full offline usage and desktop/mobile installation.

### Project Structure

```text
/
├── index.html            # Main 16:9 Advent Calendar house & modal
├── configuration.html    # Configuration UI (modes, drag & drop, reset, JSON I/O)
├── manifest.json         # PWA Web App Manifest
├── sw.js                 # Service Worker for full offline caching
├── server.js             # Zero-dependency Node.js static server for local launch
├── package.json          # npm start script
├── css/
│   ├── main.css          # 16:9 container-query scaling, house facade, window states & modal
│   └── config.css        # Configuration page styles
├── js/
│   ├── storage.js        # localStorage persistence, game modes, reset, JSON export/import
│   ├── app.js            # Main calendar rendering, click handling, modal & fullscreen
│   └── config.js         # Drag & drop list, mode switch, shuffle, JSON I/O
└── assets/
    ├── brand/            # Gin Comici logo displayed on the house roof
    └── icons/            # Local SVG & PNG PWA icons (192x192, 512x512)
```

### Running Locally

Service Workers require HTTP/HTTPS (or `localhost`), rather than `file://`. Start the included zero-dependency Node.js server from the project root:

```bash
npm start
```

Or run directly with Node:

```bash
node server.js
```

Then open `http://localhost:8080` (or `http://127.0.0.1:8080`) in your browser. Once loaded once, the app works completely offline and can be installed as a standalone PWA.

---

## Italiano

### Funzionalità

- **Interfaccia 16:9 Proporzionale:**
  - Lo stage principale mantiene sempre il rapporto `16:9` (`aspect-ratio: 16 / 9`) e utilizza le Container Query Units (`cqw`) per ogni dimensione: testi, bordi, spaziature, ombreggiature e modale.
  - Ridimensionando la finestra del browser (o attivando lo schermo intero), l'intera applicazione si riduce o ingrandisce mantenendo intatte tutte le proporzioni.
- **Casa Natalizia a 4 Piani (24 Finestre + Portone Centrale #25):**
  - **3 Piani Superiori:** 6 finestre per piano (`18` finestre).
  - **Piano Terra:** 6 finestre leggermente più piccole (3 a sinistra e 3 a destra) e un **Portone centrale ad arco (#25)**, per un totale di 25 caselle cliccabili.
  - **Stato Aperto / Chiuso:** Le finestre chiuse mostrano vetri scuri invernali; le finestre aperte spalancano le persiane verso l'esterno, si illuminano con una luce calda dorata, mostrano un'icona festiva e mantengono visibile il proprio numero.
- **Due Modalità di Gioco:**
  1. **Modalità Sequenziale (Predefinita):** Indipendentemente dalla finestra cliccata, i contenuti vengono estratti nell'ordine della lista configurata (1° click → 1° elemento, 2° click → 2° elemento, ecc.).
  2. **Modalità Casella Fissa (Preassegnata):** Ogni elemento nella lista corrisponde esattamente alla casella con lo stesso numero (1° elemento → Casella #1, 14° → Casella #14, ..., 25° → Portone #25).
- **Salvataggio Persistente:**
  - Lo stato delle caselle aperte viene salvato in `localStorage`: cliccando nuovamente su una finestra già aperta, si riaprirà sempre lo stesso contenuto mostrato in precedenza.
- **Pagina di Configurazione (`/configuration.html`):**
  - Cambio immediato tra modalità **Sequenziale** e **Casella Fissa**.
  - Lista ordinabile tramite **Drag & Drop** (con pulsanti `↑`/`↓` di supporto) per modificare titolo e descrizione, aggiungere o eliminare elementi.
  - **Reset Partita:** Chiude tutte le finestre aperte e azzera l'avanzamento senza modificare i testi o l'ordine configurato.
  - **Disposizione Numeri:** Permette di rimescolare casualmente i numeri `1–24` sulle finestre della facciata o ordinarli `1–24`.
  - **Esportazione e Importazione JSON:** Esporta l'intera configurazione (scegliendo se includere anche lo stato delle finestre aperte) in un file `.json` e reimportala su qualsiasi dispositivo.
- **PWA Funzionante Offline:**
  - Include `manifest.json` e un Service Worker (`sw.js`) con strategia Network-First che scarica automaticamente gli aggiornamenti quando sei online e salva tutti i file HTML, CSS, JavaScript e le icone nella cache del browser per funzionare anche senza connessione Internet.

### Struttura del Progetto

```text
/
├── index.html            # Pagina principale 16:9 con la casa dell'Avvento e il modale
├── configuration.html    # Pagina di configurazione (modalità, drag & drop, reset, JSON)
├── manifest.json         # Manifest PWA per l'installazione
├── sw.js                 # Service Worker per la cache offline completa
├── server.js             # Server HTTP statico Node.js senza dipendenze esterne
├── package.json          # Script npm start
├── css/
│   ├── main.css          # Scaling 16:9 via cqw, casa a 4 piani, stati finestre e modale
│   └── config.css        # Stile della pagina di configurazione
├── js/
│   ├── storage.js        # Gestione localStorage, modalità di gioco, reset, import/export JSON
│   ├── app.js            # Rendering della casa, click sulle caselle, modale e schermo intero
│   └── config.js         # Lista drag & drop, switch modalità, shuffle numeri, JSON I/O
└── assets/
    ├── brand/            # Logo Gin Comici sul tetto della casa
    └── icons/            # Icone PWA locali SVG e PNG (192x192, 512x512)
```

### Avvio in Locale

Per attivare il Service Worker è necessario servire i file tramite HTTP/HTTPS (o `localhost`) anziché aprirli via `file://`. Dalla cartella del progetto avvia il server Node.js incluso (zero dipendenze da installare):

```bash
npm start
```

Oppure direttamente con Node:

```bash
node server.js
```

Poi apri `http://localhost:8080` (o `http://127.0.0.1:8080`) nel browser. Dopo il primo caricamento, l'app funziona completamente offline ed è installabile come PWA.
