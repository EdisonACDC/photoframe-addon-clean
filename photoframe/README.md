# PhotoFrame - Cornice Digitale per Home Assistant 📷✨

![PhotoFrame Logo](icon.png)

> Trasforma il tuo tablet in una cornice digitale elegante con slideshow automatico e 13 effetti transizione spettacolari!

[![Home Assistant](https://img.shields.io/badge/Home_Assistant-Add--on-41BDF5?logo=home-assistant)](https://www.home-assistant.io/)
[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/EdisonACDC/photoframe-addon/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## ✨ Funzionalità

### 🆓 Versione FREE (sempre gratuita!)
- **6 effetti transizione base**: Dissolvenza, Scorri Sinistra/Destra, Zoom Avanti/Indietro, Ken Burns
- **Slideshow fullscreen** con controlli auto-hide
- **Upload foto** drag & drop (max 10MB, JPEG/PNG/WebP)
- **Gestione galleria** con griglia thumbnails
- **Intervallo personalizzabile** (5-60 secondi tra foto)
- **API REST** per controllo remoto da Home Assistant
- **100% Privato** - foto salvate localmente

### 🌟 Versione PRO (€5,50 via Gumroad/Ko-fi)
- **7 effetti aggiuntivi**: Mix Casuale, Scorri Alto/Basso, Rotazione, Flip 3D, Spirale, Angolo (13 effetti totali!)
- **Cestino drag & drop** per gestione foto avanzata
- **Tutte le future funzionalità premium**

**🎁 Supporta lo sviluppo con una donazione PayPal:**  
👉 [mariusclaudiu88@yahoo.it](mailto:mariusclaudiu88@yahoo.it)

---

## 📦 Installazione

### Metodo 1: Tramite Repository (Consigliato)
1. In Home Assistant, vai su **Impostazioni** → **Add-on** → **Add-on Store**
2. Clicca sui **tre puntini** in alto a destra → **Repository**
3. Aggiungi questo URL:
   ```
   https://github.com/EdisonACDC/photoframe-addon
   ```
4. Cerca **"PhotoFrame - Cornice Digitale"** e installa
5. Abilita **Avvia all'avvio** e **Watchdog**
6. Clicca **Avvia**

### Metodo 2: Installazione Manuale
1. Copia la cartella `photoframe` in `/addons/`
2. Vai su **Impostazioni** → **Add-on** → **Add-on Store**
3. Clicca sui **tre puntini** → **Controlla aggiornamenti**
4. L'add-on apparirà nella lista "Locale"
5. Installa e avvia

---

## 🚀 Utilizzo

### Sul Tablet
1. Apri il browser del tablet
2. Vai su: `http://homeassistant.local:5000` (o l'IP del tuo HA)
3. Carica le foto tramite drag & drop
4. Clicca **"Avvia Slideshow"**
5. Metti il browser a schermo intero

### Controllo Remoto
L'add-on è controllabile tramite REST commands in `configuration.yaml`:

```yaml
rest_command:
  photoframe_play:
    url: "http://localhost:5000/api/slideshow/control"
    method: POST
    content_type: "application/json"
    payload: '{"action": "play", "interval": {{ interval | default(15) }}}'
  
  photoframe_pause:
    url: "http://localhost:5000/api/slideshow/control"
    method: POST
    content_type: "application/json"
    payload: '{"action": "pause"}'
  
  photoframe_next:
    url: "http://localhost:5000/api/slideshow/control"
    method: POST
    content_type: "application/json"
    payload: '{"action": "next"}'
```

Esempio automazione:
```yaml
automation:
  - alias: "Avvia slideshow al mattino"
    trigger:
      platform: time
      at: "07:00:00"
    action:
      service: rest_command.photoframe_play
      data:
        interval: 20
```

---

## 🔓 Sblocca PhotoFrame PRO

### Acquista Licenza (€5,50)
Scegli uno dei seguenti metodi:

**Opzione 1: Gumroad**  
👉 [Acquista su Gumroad](https://gumroad.com/YOUR_LINK_HERE)

**Opzione 2: Ko-fi**  
👉 [Acquista su Ko-fi](https://ko-fi.com/YOUR_LINK_HERE)

Dopo l'acquisto riceverai un codice licenza nel formato `PRO-2025-XXXX-YYYY`.

### Attivazione Licenza
1. Apri PhotoFrame
2. Clicca sul banner **"Sblocca PRO"** oppure su un effetto bloccato
3. Inserisci il codice licenza ricevuto
4. Clicca **"Attiva Licenza"**

🎉 Fatto! Tutte le funzionalità PRO sono ora sbloccate (offline, nessun server richiesto).

---

## 🎨 Effetti Transizione

### FREE (6 effetti)
- ✨ **Dissolvenza** - Transizione classica fade
- ⬅️ **Scorri Sinistra** - Slide da destra a sinistra
- ➡️ **Scorri Destra** - Slide da sinistra a destra
- 🔍 **Zoom Avanti** - Ingrandimento progressivo
- 🔎 **Zoom Indietro** - Rimpicciolimento progressivo
- 🎬 **Ken Burns** - Zoom cinematografico lento

### PRO (7 effetti aggiuntivi)
- 🎲 **Mix Casuale** - Effetto randomizzato per ogni foto
- ⬆️ **Scorri Alto** - Slide dal basso verso alto
- ⬇️ **Scorri Basso** - Slide dall'alto verso basso
- 🔄 **Rotazione** - Rotazione 360° con scala
- 🔃 **Flip 3D** - Flip orizzontale tridimensionale
- 🌀 **Spirale** - Rotazione 720° con zoom
- 📐 **Angolo** - Slide diagonale dall'angolo

---

## 🗑️ Gestione Foto (PRO)

Il **cestino drag & drop** permette di:
- Trascinare foto nel cestino invece di eliminarle immediatamente
- Ripristinare foto dal cestino
- Svuotare il cestino manualmente o automaticamente al riavvio

---

## 📱 Setup Tablet Consigliato

1. **Disabilita sleep** nelle impostazioni del tablet
2. **Attiva modalità chiosco** (Kiosk Mode):
   - Android: usa app come "Fully Kiosk Browser"
   - iOS: usa "Guided Access"
3. **Collegamento permanente** alla corrente
4. **Supporto da tavolo o parete**

---

## 🔒 Privacy e Sicurezza

- ✅ Tutte le foto rimangono sul tuo server locale (`/data/uploads`)
- ✅ Nessun dato inviato a server esterni
- ✅ Licenza PRO validata **offline** (nessun server di licenze)
- ✅ Accessibile solo dalla tua rete locale
- ✅ Nessuna raccolta dati o telemetria

---

## 🛠️ Risoluzione Problemi

**L'add-on non si avvia?**
- Controlla i log in **Impostazioni** → **Add-on** → **PhotoFrame** → **Log**

**Il tablet non si connette?**
- Verifica che sia sulla stessa rete WiFi di Home Assistant
- Prova con l'IP invece di homeassistant.local

**Le foto non si caricano?**
- Verifica dimensione file (max 10MB)
- Formati supportati: JPEG, PNG, WebP
- Limite: 50 file per upload

---

## 📝 Changelog

### Version 1.1.0 (Ottobre 2025)
- ✨ Nuovo sistema licenze PRO/FREE
- 🎨 13 effetti transizione totali (6 FREE + 7 PRO)
- 🗑️ Cestino drag & drop (PRO)
- 🎁 Banner donazioni PayPal
- 🔐 Validazione licenze offline

### Version 1.0.26
- 13 effetti transizione spettacolari
- Cestino con drag & drop HTML5
- Storage persistente con auto-recovery
- Fix z-index pulsante delete

### Version 1.0.0
- Release iniziale
- Upload e gestione foto
- Slideshow con controlli
- Integrazione Home Assistant

---

## 💖 Supporta il Progetto

Se PhotoFrame FREE ti è utile, considera una **donazione PayPal**:  
📧 [mariusclaudiu88@yahoo.it](mailto:mariusclaudiu88@yahoo.it)

Oppure **sblocca PhotoFrame PRO** per supportare lo sviluppo e ottenere funzionalità esclusive!

---

## ❓ FAQ

**Ho perso il mio codice licenza PRO, cosa faccio?**  
Il codice è salvato localmente in `/data/license.key`. Se hai migrato l'add-on su un nuovo sistema:
1. Controlla la tua email di acquisto (Gumroad/Ko-fi)
2. Recupera il codice e riattiva manualmente
3. In caso di problemi, contatta il supporto su GitHub

**Posso usare la stessa licenza su più dispositivi?**  
Sì, la licenza è legata al codice acquistato e può essere attivata su ogni installazione PhotoFrame che possiedi.

**La licenza scade?**  
No, la licenza PRO è permanente e include tutte le future funzionalità premium.

**Come funziona la validazione offline?**  
La licenza usa un algoritmo checksum locale - nessun server esterno richiesto. Massima privacy!

---

## 🐛 Supporto

**Bug o problemi?**  
👉 [Apri un issue su GitHub](https://github.com/EdisonACDC/photoframe-addon/issues)

**Domande?**  
👉 [Discussioni su GitHub](https://github.com/EdisonACDC/photoframe-addon/discussions)

---

## 🛠️ Tecnologie

- **Frontend**: React, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Express.js, TypeScript
- **Storage**: Filesystem persistente
- **Build**: Vite
- **Licenze**: Validazione offline

---

## 📄 Licenza

MIT License

---

**Sviluppato con ❤️ da EdisonACDC**  
Germania, 2025
