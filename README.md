# PhotoFrame - Cornice Digitale per Home Assistant

## 🖼️ Repository Add-on 

Questo repository contiene l'add-on PhotoFrame testato e funzionante per Home Assistant.

### ✨ Caratteristiche

- 📸 Slideshow automatico con 13 transizioni
- 🎨 Interfaccia touch-friendly per tablet
- 🏠 Integrazione completa con Home Assistant
- 🎯 Controllo remoto tramite API REST
- 🔒 **Funziona SOLO in rete locale** (non compatibile con Nabu Casa Cloud)
---

## ❤️ Donazioni

Se ti piace il progetto **PhotoFrame** e vuoi supportarne lo sviluppo, puoi fare una donazione ❤️  

[![Donate with PayPal](https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif)](
https://www.paypal.com/donate/?business=speedgmcv@gmail.com&currency_code=EUR
)

Ogni contributo è molto apprezzato e aiuta a mantenere e migliorare il progetto 🙏
---

## ⚠️ IMPORTANTE - Accesso Solo Locale

Questo add-on **funziona esclusivamente sulla rete locale (LAN)** e **NON è accessibile tramite Nabu Casa Cloud** o connessioni esterne.

### Perché solo locale?
L'add-on utilizza porte e percorsi che non sono esposti attraverso il proxy di Nabu Casa. Per accedere da remoto, è necessario configurare:
- **VPN** (WireGuard, Tailscale, OpenVPN)
- **Port forwarding** sul router (sconsigliato per sicurezza)
- **Tunnel SSH** o simili

### Come accedere:
✅ **Rete locale (WiFi di casa):**
http://homeassistant.local:5000

oppure
http://192.168.1.X:5000

(sostituisci `X` con l'IP del tuo Home Assistant)

❌ **Da remoto (fuori casa):**
- Nabu Casa: ❌ Non funziona
- Soluzione: Usa **Tailscale** o altra VPN

---

## 🚀 Installazione su Home Assistant

### Passo 1: Aggiungi Repository

1. Vai su **Home Assistant** → **Add-on Store**
2. Clicca sul menu **⋮** (in alto a destra)
3. Seleziona **"Archivi"**
4. Clicca **"Aggiungi"**
5. Incolla questo URL:
https://github.com/EdisonACDC/photoframe-addon-clean

6. Clicca **"Aggiungi"**

### Passo 2: Installa Add-on

1. Torna all'**Add-on Store**
2. Cerca **"PhotoFrame - Cornice Digitale BETA"**
3. Clicca **"Installa"**
4. Aspetta 5-8 minuti per la compilazione

### Passo 3: Configurazione

1. Vai alla pagina dell'add-on
2. Abilita **"Mostra nel pannello laterale"**
3. Clicca **"Avvia"**

### Passo 4: Accesso

**Solo rete locale:**
http://homeassistant.local:5000

oppure
http://192.168.1.X:5000


---

## 🎴 Card Lovelace per Dashboard

Puoi integrare PhotoFrame direttamente nella tua dashboard di Home Assistant con una **card personalizzata** che mostra lo slideshow e si trasforma in screensaver quando inattivo.

### Installazione Card

#### Passo 1: Scarica il file
1. Scarica il file [`photoframe-screensaver-card.js`](./photoframe-screensaver-card.js) da questo repository
2. Salva il file sul tuo computer

#### Passo 2: Carica il file in Home Assistant
1. Apri **File Editor** in Home Assistant (installa l'add-on se non ce l'hai)
2. Crea la cartella (se non esiste):
/homeassistant/www/community/photoframe-screensaver-card/

3. Carica il file `photoframe-screensaver-card.js` in questa cartella
4. Il percorso finale deve essere:
/homeassistant/www/community/photoframe-screensaver-card/photoframe-screensaver-card.js


#### Passo 3: Registra la risorsa
1. Vai in **Impostazioni** → **Dashboard** → **Risorse**
2. Clicca **"Aggiungi risorsa"**
3. Inserisci:
- **URL:** `/local/community/photoframe-screensaver-card/photoframe-screensaver-card.js`
- **Tipo:** JavaScript Module
4. Clicca **"Crea"**
5. Ricarica la pagina (Ctrl+F5 o Cmd+R)

### Configurazione Card

Aggiungi questa card alla tua dashboard:

```yaml
type: custom:photoframe-screensaver-card
addon_url: http://192.168.1.100:5000  # Sostituisci con l'IP del tuo Home Assistant
idle_timeout: 60                       # Secondi di inattività prima dello screensaver
slideshow_interval: 15                 # Secondi tra una foto e l'altra
transition_effect: fade                # Effetto transizione (vedi sotto)
show_controls: true                    # Mostra controlli play/pausa
card_height: 400                       # Altezza card in pixel
image_fit: cover                       # "cover" (schermo pieno) o "contain" (foto intera)
enable_auto_fullscreen: true           # Attiva screensaver automatico
Effetti Transizione Disponibili
Puoi scegliere tra questi effetti per transition_effect:

fade - Dissolvenza classica
slideLeft - Scorri da destra a sinistra
slideRight - Scorri da sinistra a destra
slideUp - Scorri dal basso verso l'alto
slideDown - Scorri dall'alto verso il basso
zoomIn - Zoom in avvicinamento
zoomOut - Zoom in allontanamento
kenBurns - Effetto Ken Burns (zoom lento)
rotate - Rotazione 3D
flip - Flip 3D orizzontale
spiral - Spirale rotante
corner - Entrata dall'angolo
mix - Casuale (cambia effetto ad ogni foto)
Esempio Card Completa
yaml
Copy
type: custom:photoframe-screensaver-card
addon_url: http://192.168.1.95:5000
idle_timeout: 120
slideshow_interval: 10
transition_effect: mix
show_controls: true
card_height: 500
image_fit: cover
enable_auto_fullscreen: true
Funzionalità Card
✅ Slideshow automatico con controlli play/pausa
✅ Screensaver fullscreen dopo inattività
✅ 13 effetti di transizione (+ modalità casuale)
✅ Controlli touch-friendly per tablet
✅ Auto-hide controlli dopo 3 secondi
✅ Precaricamento immagini per transizioni fluide
✅ Editor visuale integrato in Lovelace

📚 Documentazione
Documentazione completa
Changelog
README dettagliato
🔧 Supporto
Versione: 1.0.28
Testata e funzionante solo in rete locale

📝 Note
Questo repository è stato creato dal backup dell'immagine Docker funzionante
Tutti i file sono identici alla versione testata e stabile
L'add-on NON funziona con Nabu Casa - richiede accesso locale o VPN
La card Lovelace funziona solo se l'add-on è raggiungibile via rete locale

---

✅ **Aggiornato con il percorso corretto:** `/homeassistant/www/community/photoframe-screensaver-card/photoframe-screensaver-card.js`
