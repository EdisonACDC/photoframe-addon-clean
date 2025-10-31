# Changelog

Tutte le modifiche importanti a questo progetto saranno documentate in questo file.

## [1.0.32] - 2025-10-31

### 🐛 Critical Bug Fix - Process Crash
- **RISOLTO**: Addon crashava continuamente causando errori HTTP 503
- Rimosso `throw err;` dall'error handler Express che terminava il processo Node
- Errori ora vengono loggati senza crashare l'applicazione
- Ingress Home Assistant ora funziona stabilmente
- Fix riavvii continui ogni 10 minuti

### Dettagli Tecnici
- Error middleware in `server/index.ts` ora logga ma non rilancia eccezioni
- Aggiunto controllo `!res.headersSent` prima di inviare risposta errore
- Processo rimane attivo anche in caso di errori nelle route

---

## [1.0.31] - 2025-10-31

### 🔧 Fix Ingress Configuration
- Rimossa porta `5000/tcp` dal config che creava conflitto con ingress
- Mantenuto solo `ingress_port: 5000` per comunicazione interna
- Card e rest_command usano entrambi ingress (zero conflitti)

---

## [1.0.27] - 2025-10-26

### 🔧 Fix Integrazione Lovelace Card
- **Aggiunto supporto CORS** per permettere alla Lovelace Card di comunicare con l'add-on
- Headers CORS configurati per accettare richieste da qualsiasi origine (necessario per Home Assistant)
- Gestione richieste OPTIONS per preflight CORS
- Fix compatibilità con `photoframe-screensaver-card.js` per widget e screensaver

### Dettagli Tecnici
- Middleware CORS in `server/index.ts`
- Headers: `Access-Control-Allow-Origin: *`
- Metodi permessi: GET, POST, PUT, DELETE, OPTIONS

---

## [1.1.0] - 2025-10-25

### ✨ Nuovo Sistema Licenze PRO/FREE
- Sistema dual-licensing: versione FREE gratuita + versione PRO (€5,50)
- Validazione codici licenza **offline** (nessun server esterno)
- Codici formato `PRO-2025-XXXX-YYYY` con algoritmo checksum
- Storage licenza locale persistente in `license.key`
- Script generatore codici: `generate-licenses.js`

### Funzionalità FREE
- 6 effetti transizione base (Dissolvenza, Scorri L/R, Zoom In/Out, Ken Burns)
- Upload foto drag & drop
- Gestione galleria
- Slideshow fullscreen
- API REST

### Funzionalità PRO
- 7 effetti aggiuntivi (Mix, Scorri Alto/Basso, Rotazione, Flip 3D, Spirale, Angolo)
- Cestino drag & drop per gestione foto avanzata
- Tutte le future funzionalità premium

### Componenti Aggiunti
- `LicenseDialog.tsx` - Dialog attivazione licenza
- `UpgradeBanner.tsx` - Banner promozione PRO
- `useLicense.ts` - Hook gestione stato licenza
- `shared/license.ts` - Algoritmo validazione offline

### API Endpoints Aggiunti
- `GET /api/license` - Stato licenza corrente
- `POST /api/license/activate` - Attivazione codice licenza

### Monetizzazione
- Banner upgrade PRO in UI
- Donazioni PayPal: mariusclaudiu88@yahoo.it
- Vendita licenze via Gumroad/Ko-fi

### Bug Fix
- Rimosso doppio JSON.stringify in attivazione licenza
- Fix props mancanti trashedPhotos in App.tsx

---

## [1.0.26] - 2025-10-25

### 🎨 13 Effetti Transizione
- Aggiunti 6 nuovi effetti (totale 13):
  - Scorri Alto/Basso
  - Rotazione 360°
  - Flip 3D
  - Spirale
  - Angolo
- Effetti esistenti migliorati con emoji icons
- Grid 2 colonne scrollabile nel pannello impostazioni

---

## [1.0.25] - 2025-10-25

### 🗑️ Cestino Drag & Drop
- Cestino interattivo HTML5 drag & drop
- Pulizia automatica foto al riavvio
- Pulsante Svuota Cestino
- Pulsante Ripristina
- Flag `inTrash` in photos.json
- Endpoint: PATCH /trash, /restore, POST /empty-trash

---

## [1.0.24] - 2025-10-25

### Bug Fix
- Fix z-index pulsante delete (z-10)
- Fix pointer-events gradiente

---

## [1.0.23] - 2025-10-25

### UI Migliorata
- Pulsante delete sempre visibile (non solo hover)
- Ottimizzato per tablet/touch
- Griglia responsive (2-3-5 colonne)

---

## [1.0.22] - 2025-10-25

### 💾 Storage Persistente
- Sostituito MemStorage con FileStorage
- Metadati in /data/photos.json
- Auto-recovery al boot
- Foto persistenti al riavvio

---

## [1.0.21] - 2025-10-25

### Effetto Mix Casuale
- Effetto Mix randomizza transizioni
- Fix storage persistente /data/uploads
- Mix come default

---

## [1.0.20] - 2025-10-25

### Effetti Transizione
- Selettore effetti in pannello
- 6 effetti base implementati
- Framer Motion animations

---

## [1.0.19] - 2025-10-25

### Bug Fix
- Fix path relativi immagini per Ingress

---

## [1.0.18] - 2025-10-25

### Bug Fix
- Fix path relativi API per Ingress
- Upload funzionante in Home Assistant

---

## [1.0.15-17] - 2025-10-25

### Bug Fix
- Fix asset bundle path
- Fix upload directory
- Logging dettagliato

---

## [1.0.0] - 2025-10-24

### Aggiunto
- Upload foto tramite drag & drop
- Gestione galleria con visualizzazione griglia
- Slideshow a schermo intero con transizioni fluide
- Controlli play/pause, next/previous
- Pannello impostazioni per intervallo slideshow (5-60 secondi)
- Auto-hide controlli dopo 3 secondi di inattività
- API REST per controllo remoto
- Integrazione completa con Home Assistant
- Storage persistente foto
- Supporto formati JPEG, PNG, WebP
- Limite upload configurabile
- Documentazione completa

### Sicurezza
- Validazione upload file
- Limitazioni dimensione file
- Solo accesso rete locale
- Nessuna telemetria

---

## [Unreleased]

### In sviluppo
- Supporto video (MP4)
- Album/cartelle multiple
- Metadati foto (EXIF)
- Ordinamento foto (data, nome, casuale)
