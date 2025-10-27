# 🎨 Installazione Card PhotoFrame per Home Assistant

Questa guida ti mostra come installare la **Custom Lovelace Card** per controllare PhotoFrame direttamente da Home Assistant.

✅ **Funziona con Nabu Casa Cloud** (accesso remoto Germania → Italia)  
✅ **Usa ingress** (nessun problema CORS)  
✅ **Controllo completo** (play, pause, next, previous, intervallo)

---

## 📦 STEP 1: Installazione Card

### **Metodo 1: File Editor (RACCOMANDATO)**

1. **Apri File Editor** in Home Assistant
2. **Naviga in** `/config/www/`
   - Se la cartella `www` non esiste, creala
3. **Crea nuovo file** chiamato `photoframe-card.js`
4. **Copia** il contenuto da `photoframe-card.js` (nel repository addon)
5. **Salva** il file

### **Metodo 2: SSH/Terminal**

```bash
cd /config/www
wget https://raw.githubusercontent.com/EdisonACDC/photoframe-addon-clean/main/photoframe/photoframe-card.js
```

---

## ⚙️ STEP 2: Configurazione Helper

### **Metodo A: Interfaccia Grafica (PIÙ FACILE)**

1. **Vai in** Settings → Devices & Services → **Helpers**
2. **Crea** → **Toggle** (Interruttore)
   - Nome: `PhotoFrame Playing`
   - ID: `input_boolean.photoframe_playing`
   - Icona: `mdi:play-pause`
3. **Crea** → **Number** (Numero)
   - Nome: `PhotoFrame Interval`
   - ID: `input_number.photoframe_interval`
   - Min: `5`, Max: `60`, Step: `5`
   - Valore iniziale: `15`
   - Unità: `s` (secondi)
   - Icona: `mdi:timer-outline`

### **Metodo B: configuration.yaml**

Aggiungi questo al tuo `configuration.yaml`:

```yaml
input_boolean:
  photoframe_playing:
    name: PhotoFrame Playing
    icon: mdi:play-pause

input_number:
  photoframe_interval:
    name: PhotoFrame Interval
    min: 5
    max: 60
    step: 5
    initial: 15
    unit_of_measurement: "s"
    icon: mdi:timer-outline
```

Poi **riavvia Home Assistant**.

---

## 🎴 STEP 3: Registrazione Card in Lovelace

1. **Vai in** Settings → Dashboards → Resources
2. **Aggiungi Resource** (+ in basso a destra)
3. **Compila**:
   - **URL**: `/local/photoframe-card.js`
   - **Tipo**: JavaScript Module
4. **Salva**

> **NOTA**: Se non vedi "Resources", abilita "Advanced Mode" nelle impostazioni utente!

---

## 📋 STEP 4: Aggiungi Card alla Dashboard

1. **Apri** la tua Dashboard
2. **Edit Dashboard** (⋮ menu → Modifica)
3. **Aggiungi Card** → **Manual** (Manuale)
4. **Incolla** questa configurazione:

```yaml
type: custom:photoframe-card
addon_slug: photoframe-beta
title: PhotoFrame Screensaver
show_interval: true
intervals:
  - 5
  - 10
  - 15
  - 30
  - 60
```

5. **Salva**

---

## 🎯 Configurazione Parametri Card

| Parametro | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `addon_slug` | string | **OBBLIGATORIO** | Slug dell'addon (`photoframe-beta`) |
| `title` | string | `PhotoFrame Screensaver` | Titolo della card |
| `show_interval` | boolean | `true` | Mostra pulsanti cambio intervallo |
| `intervals` | array | `[5,10,15,30,60]` | Intervalli disponibili (secondi) |

---

## 🌐 FUNZIONA CON NABU CASA CLOUD?

✅ **SÌ!** La card usa l'**ingress path** di Home Assistant:

```
/api/hassio_ingress/photoframe-beta/api/control
```

Questo percorso funziona:
- ✅ **In locale** (LAN)
- ✅ **Da remoto** (Nabu Casa Cloud)
- ✅ **Ovunque** (VPN, Cloudflare Tunnel, ecc.)

---

## 🔧 RISOLUZIONE PROBLEMI

### **La card non appare**

1. **Svuota cache browser**: `Ctrl+Shift+R` (o `Cmd+Shift+R` su Mac)
2. **Verifica Resources**: Settings → Dashboards → Resources
   - Deve esserci `/local/photoframe-card.js`
3. **Controlla console browser**: `F12` → Console → cerca errori

### **Pulsanti non funzionano**

1. **Verifica helper**:
   - Developer Tools → States
   - Cerca `input_boolean.photoframe_playing`
   - Cerca `input_number.photoframe_interval`
2. **Verifica addon slug**: deve essere esattamente `photoframe-beta`
3. **Controlla console browser**: `F12` → Network → cerca errori API

### **"Errore nel controllo di PhotoFrame"**

1. **Addon avviato?** Settings → Add-ons → PhotoFrame → AVVIA
2. **Ingress attivo?** Clicca su "OPEN WEB UI" - deve aprirsi PhotoFrame
3. **Slug corretto?** Verifica che sia `photoframe-beta` nella config card

---

## 📱 ESEMPIO DASHBOARD COMPLETA

```yaml
title: Casa
views:
  - title: Multimedia
    cards:
      # Card PhotoFrame
      - type: custom:photoframe-card
        addon_slug: photoframe-beta
        title: 🖼️ Cornice Digitale
        show_interval: true
        intervals: [5, 10, 15, 30, 60]
      
      # Altre card...
```

---

## 🤖 AUTOMAZIONI AVANZATE (OPZIONALE)

Puoi creare automazioni per controllare PhotoFrame:

```yaml
automation:
  # Avvia quando torni a casa
  - alias: "PhotoFrame: Avvia quando arrivo"
    trigger:
      - platform: state
        entity_id: person.tuo_nome
        to: "home"
    action:
      - service: input_boolean.turn_on
        target:
          entity_id: input_boolean.photoframe_playing

  # Pausa di notte
  - alias: "PhotoFrame: Pausa notte"
    trigger:
      - platform: time
        at: "23:00:00"
    action:
      - service: input_boolean.turn_off
        target:
          entity_id: input_boolean.photoframe_playing
```

---

## ✅ RIEPILOGO

1. ✅ Copia `photoframe-card.js` in `/config/www/`
2. ✅ Crea helper `input_boolean.photoframe_playing` e `input_number.photoframe_interval`
3. ✅ Registra card in Resources: `/local/photoframe-card.js`
4. ✅ Aggiungi card alla dashboard con `addon_slug: photoframe-beta`
5. ✅ Testa i pulsanti play/pause/next/previous

---

## 🎉 COMPLETATO!

Ora hai il controllo completo di PhotoFrame da Home Assistant, funzionante anche da **remoto con Nabu Casa Cloud**! 🚀
