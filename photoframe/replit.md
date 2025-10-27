# PhotoFrame - Cornice Digitale per Home Assistant

## Panoramica del Progetto
Applicazione web per trasformare un tablet in una cornice digitale elegante con slideshow automatico. Include upload foto, gestione galleria e API REST per integrazione con Home Assistant.

**Sistema Licenze:**
- **TRIAL**: 10 giorni gratuiti con tutte le funzionalità PRO
- **FREE**: Dopo scadenza trial - slideshow base senza effetti transizione
- **PRO**: €5,50 lifetime - sblocca 13 effetti + cestino drag & drop

## Funzionalità Principali

### Funzionalità Base (FREE)
- **Slideshow a schermo intero** con transizione fade
- **Upload foto** tramite drag & drop o selezione file
- **Gestione galleria** con griglia thumbnails
- **Controlli slideshow** (play/pause, avanti/indietro)
- **Impostazioni intervallo** (5-60 secondi tra foto)
- **Auto-hide controlli** dopo 3 secondi di inattività
- **API REST** per controllo remoto da Home Assistant

### Funzionalità PRO (€5,50) + TRIAL (10 giorni gratuiti)
- ✨ **13 effetti transizione** spettacolari personalizzabili
- 🗑️ **Cestino drag & drop** per gestione foto avanzata
- 🎲 **Mix casuale** effetti per varietà automatica
- 📽️ **Effetti cinematografici** (Ken Burns, Flip 3D, Spirale)
- 🔄 **Tutte le future funzionalità premium**

## Architettura

### Frontend (React + TypeScript)
- **Componenti principali**:
  - `PhotoViewer`: Visualizzazione fullscreen foto con animazioni fade
  - `ControlBar`: Barra controlli overlay con glassmorphism
  - `UploadZone`: Area drag & drop per upload
  - `PhotoGrid`: Griglia thumbnails con eliminazione
  - `SettingsPanel`: Pannello impostazioni slide-in
  - `SlideshowPage`: Pagina slideshow con gestione stato
  - `ManagementPage`: Pagina gestione foto

### Backend (Express + TypeScript)
- **Storage**: In-memory con interfaccia `IStorage`
- **Upload**: Multer per gestione file (max 10MB, JPEG/PNG/WebP)
- **Endpoints API**:
  - `GET /api/photos` - Lista tutte le foto
  - `GET /api/photos/:id` - Dettaglio foto singola
  - `POST /api/photos/upload` - Upload multiplo foto
  - `DELETE /api/photos/:id` - Eliminazione foto
  - `GET /api/slideshow/status` - Stato slideshow
  - `POST /api/slideshow/control` - Controllo remoto slideshow
- **File serviti**: `/uploads` directory per foto caricate

## Struttura Dati

### Photo Schema
```typescript
{
  id: string (UUID)
  filename: string
  filepath: string
  uploadedAt: Date
}
```

## Integrazione Home Assistant

### API di Controllo
- **Endpoint**: `POST /api/slideshow/control`
- **Body JSON**:
  ```json
  {
    "action": "play" | "pause" | "next" | "previous",
    "interval": 15  // secondi (opzionale)
  }
  ```

### Esempio Curl
```bash
# Avvia slideshow
curl -X POST http://localhost:5000/api/slideshow/control \
  -H "Content-Type: application/json" \
  -d '{"action": "play", "interval": 20}'

# Foto successiva
curl -X POST http://localhost:5000/api/slideshow/control \
  -H "Content-Type: application/json" \
  -d '{"action": "next"}'
```

### Integrazione con Home Assistant
L'applicazione può essere controllata tramite REST commands in Home Assistant:

```yaml
# configuration.yaml
rest_command:
  photoframe_play:
    url: "http://<REPLIT_URL>/api/slideshow/control"
    method: POST
    content_type: "application/json"
    payload: '{"action": "play", "interval": {{ interval | default(15) }}}'
  
  photoframe_pause:
    url: "http://<REPLIT_URL>/api/slideshow/control"
    method: POST
    content_type: "application/json"
    payload: '{"action": "pause"}'
  
  photoframe_next:
    url: "http://<REPLIT_URL>/api/slideshow/control"
    method: POST
    content_type: "application/json"
    payload: '{"action": "next"}'
```

## Design System
- **Font**: Inter (San-serif moderno)
- **Colori**: Sistema dark/light mode con variabili CSS
- **Animazioni**: 
  - Fade crossfade foto (700ms)
  - Controlli fade in/out (300ms)
  - Panel slide-in (500ms)
- **Layout**: Responsive con breakpoints md/lg

## Tecnologie
- **Frontend**: React, TypeScript, TailwindCSS, Framer Motion, TanStack Query
- **Backend**: Express, Multer, TypeScript
- **Storage**: In-memory (MemStorage)
- **Build**: Vite

## Note Implementazione
- File foto salvati in `uploads/` directory
- Limite upload: 50 file, max 10MB ciascuno
- Formati supportati: JPEG, PNG, WebP
- Auto-hide controlli dopo 3s inattività
- Preload immagini per transizioni fluide

## Fix Cruciali Home Assistant Ingress

### v1.0.15 - Path relativi asset
- Aggiunto `base: "./"` in vite.config.ts
- Fix: Asset bundle caricati correttamente in Ingress (`./assets/index.js` invece di `/assets/index.js`)

### v1.0.16-17 - Upload directory
- Usa `process.env.UPLOAD_DIR` (/data/uploads) invece di path hardcoded
- Creazione automatica directory con permessi 777
- Logging dettagliato upload

### v1.0.18 - Path relativi API (FIX UPLOAD)
- Funzione `normalizeApiUrl()` converte `/api/*` → `./api/*`
- Fix: Chiamate API raggiungono backend Express invece di Home Assistant CORE
- React Query e apiRequest usano path relativi compatibili con Ingress

### v1.0.19 - Path relativi immagini (FIX VISUALIZZAZIONE)
- Conversione `/uploads/foto.jpg` → `./uploads/foto.jpg` in App.tsx
- Fix: Immagini caricate ora visibili in galleria e slideshow

### v1.0.20 - Effetti transizione slideshow
- Aggiunto selettore effetti in pannello impostazioni
- 6 effetti disponibili:
  - **Dissolvenza** (Fade): Transizione opacità classica
  - **Scorri Sinistra**: Slide da destra a sinistra
  - **Scorri Destra**: Slide da sinistra a destra
  - **Zoom Avanti**: Ingrandimento progressivo
  - **Zoom Indietro**: Rimpicciolimento progressivo
  - **Ken Burns**: Zoom cinematografico lento (effetto documentario)
- Implementato con Framer Motion per animazioni fluide

### v1.0.21 - FIX Storage Persistente + Effetto Mix
- **FIX CRITICO**: Rimosso parametro `map` da config.json
- Ora `/data/uploads` è **PERSISTENTE** al riavvio dell'add-on
- Le foto **NON vengono più cancellate** quando l'add-on si riavvia
- Aggiunto effetto **"🎲 Mix Casuale"** che randomizza effetti ad ogni foto
- Effetto Mix impostato come **default** per varietà automatica
- Fix TypeScript per type safety dell'effetto Mix

### v1.0.22 - Storage Persistente con Auto-Recovery (FIX DEFINITIVO)
- **PROBLEMA RISOLTO**: Sostituito `MemStorage` (in-memory) con `FileStorage` (persistente)
- Metadati foto salvati in `/data/photos.json` (persistono al riavvio)
- **Auto-recovery**: all'avvio scansiona `/data/uploads` e recupera foto "orfane"
- Sincronizzazione automatica tra filesystem e database
- Pulizia automatica metadati per file eliminati
- Le foto **SOPRAVVIVONO** al riavvio dell'add-on! 🎉

### v1.0.23 - Pulsante Eliminazione Sempre Visibile
- Pulsante X rosso sempre visibile su ogni foto (non solo hover)
- Funziona perfettamente su tablet/dispositivi touch
- Gradiente scuro sotto per migliorare leggibilità
- Ombra sul pulsante per maggiore visibilità
- Griglia ottimizzata: 2 colonne mobile, 3 tablet, 5 desktop

### v1.0.24 - FIX z-index Pulsante Delete (FUNZIONA!)
- **FIX CRITICO**: Aggiunto z-10 al pulsante delete per renderlo sopra tutti gli elementi
- Aggiunto pointer-events-none al gradiente per non bloccare i click
- **ORA IL PULSANTE È VISIBILE E CLICCABILE!** 🎯
- Risolto problema di sovrapposizione layer

### v1.0.25 - CESTINO con DRAG & DROP (IMPLEMENTAZIONE COMPLETA!) 🗑️
- **NUOVA FUNZIONALITÀ**: Cestino interattivo con drag & drop nativo HTML5
- **Drag & Drop**: Trascina foto dalla galleria al cestino per eliminarle
- **Pulizia Automatica**: Le foto nel cestino vengono eliminate al riavvio dell'add-on
- **Svuota Cestino**: Pulsante per eliminazione immediata senza aspettare riavvio
- **Ripristino**: Pulsante per recuperare foto dal cestino
- **Persistenza**: Flag `inTrash` salvato in photos.json
- **Backend**: Nuovi endpoint API (PATCH /trash, /restore, POST /empty-trash)
- **Storage**: FileStorage con cleanup automatico al boot (cleanupTrashedPhotos)
- **UI**: Cestino sempre visibile con area drop-zone, icona trash, contatore foto
- **Visual Feedback**: Foto nel cestino con opacità ridotta e overlay rosso
- Schema Photo esteso con campo `inTrash: boolean` (default false)

### v1.0.26 - 13 EFFETTI TRANSIZIONE SPETTACOLARI! 🎨✨
- **6 NUOVI EFFETTI** aggiunti agli esistenti (totale 13 effetti!)
- **Nuovi Effetti**:
  - ⬆️ **Scorri Alto** (slideUp): Foto scorre dal basso verso alto
  - ⬇️ **Scorri Basso** (slideDown): Foto scorre dall'alto verso basso
  - 🔄 **Rotazione** (rotate): Rotazione 360° con scala 0.5→1→0.5
  - 🔃 **Flip 3D** (flip): Flip orizzontale 3D (rotateY 90°)
  - 🌀 **Spirale** (spiral): Rotazione 720° totale con zoom 0.3→1→0.3
  - 📐 **Angolo** (corner): Slide diagonale dall'angolo con rotazione 45°
- **Effetti Esistenti Migliorati**: Emoji icons per tutti gli effetti nel pannello
- **UI Migliorata**: Grid 2 colonne scrollabile, font ridotto per spazio
- **Mix Casuale**: Ora include tutti i 12 effetti nel randomizer
- **Framer Motion**: Animazioni fluide 0.7s con easing easeInOut
- **PhotoViewer.tsx**: TransitionEffect esteso con 6 nuove varianti
- **SettingsPanel.tsx**: 13 pulsanti effect con emoji labels
- **SlideshowPage.tsx**: Gestione state effect e propagazione a viewer

### v1.1.0 - Sistema Licenze PRO/FREE (COMPLETATO! ✅)
- **Dual Licensing**: Versione FREE gratuita + PRO €5,50
- **FREE**: 6 effetti base (fade, slideL/R, zoomIn/Out, kenBurns)
- **PRO**: Tutti i 13 effetti + cestino drag & drop + future features
- **Validazione Offline**: Codici `PRO-2025-XXXX-YYYY` con checksum salted
- **Storage Persistente**: License salvata in `license.key` locale
- **Componenti**: LicenseDialog, UpgradeBanner, useLicense hook
- **Backend API**: GET /api/license, POST /api/license/activate
- **Generator Script**: `generate-licenses.js` per creare codici validi
- **Monetizzazione**: Donazioni PayPal (mariusclaudiu88@yahoo.it) + vendita Gumroad/Ko-fi
- **Test E2E**: Passato con successo (FREE → PRO activation flow)
- **Bug Fix**: Doppio JSON.stringify + props trashedPhotos mancanti
- **Architect Review**: PASSED ✅ - Nessun problema critico

### v1.2.0 - Sistema Trial 10 Giorni (COMPLETATO! ✅)
- **10-Day FREE Trial**: Tutte le funzionalità PRO gratuite per 10 giorni
- **Auto-Downgrade**: Dopo scadenza → versione FREE ultra-ridotta (zero effetti, no cestino)
- **Trial Tracking**: firstLaunchDate salvato in `/data/first_launch.txt`
- **3 Stati Licenza**:
  - TRIAL (isTrial=true): <10 giorni, 13 effetti + cestino, banner verde countdown
  - EXPIRED (isExpired=true): ≥10 giorni, 0 effetti, no cestino, banner rosso upgrade
  - PRO (isPro=true): Licenza attiva, tutte funzionalità, no banner
- **Backend API**: /api/license ritorna isTrial, isExpired, daysRemaining
- **Storage**: FileStorage persiste firstLaunchDate automaticamente
- **Frontend**: UpgradeBanner dinamico, SettingsPanel nasconde effetti in FREE
- **Restrizioni FREE**: ZERO effetti transizione (solo fade default), cestino nascosto
- **Test Endpoints**: /api/test/expire-trial, /api/test/reset-trial (development only)
- **E2E Test**: Passato completamente ✅ (TRIAL → EXPIRED → PRO activation)
- **Architect Review**: PASSED ✅ - Trial tracking corretto, restrictions OK
- **Security**: Validazione locale, no sensitive data exposure

## Data: 25 Ottobre 2025
