# Documentazione PhotoFrame Add-on

## Panoramica

PhotoFrame è un add-on per Home Assistant che trasforma qualsiasi tablet in una cornice digitale elegante e funzionale.

## Architettura

L'add-on è basato su:
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Express.js + Node.js
- **Storage**: File system locale (persistente)

## API REST

### Endpoint Disponibili

#### GET /api/photos
Ottiene la lista di tutte le foto caricate.

**Response:**
```json
[
  {
    "id": "uuid-foto",
    "filename": "vacanza.jpg",
    "filepath": "/uploads/uuid-foto.jpg",
    "uploadedAt": "2025-01-15T10:30:00Z"
  }
]
```

#### POST /api/photos/upload
Carica una o più foto.

**Request:** multipart/form-data con campo `photos`

**Response:**
```json
{
  "success": true,
  "count": 3
}
```

#### DELETE /api/photos/:id
Elimina una foto specifica.

**Response:**
```json
{
  "success": true
}
```

#### GET /api/slideshow/status
Ottiene lo stato attuale dello slideshow.

**Response:**
```json
{
  "isPlaying": true,
  "currentIndex": 2,
  "totalPhotos": 10,
  "interval": 15
}
```

#### POST /api/slideshow/control
Controlla lo slideshow da remoto.

**Request Body:**
```json
{
  "action": "play|pause|next|previous",
  "interval": 20
}
```

**Response:**
```json
{
  "success": true,
  "action": "play"
}
```

## Integrazione Home Assistant

### Configurazione Configuration.yaml

Aggiungi al tuo `configuration.yaml`:

```yaml
# PhotoFrame Controls
rest_command:
  photoframe_play:
    url: "http://localhost:5000/api/slideshow/control"
    method: POST
    content_type: "application/json"
    payload: '{"action": "play"}'
  
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
  
  photoframe_previous:
    url: "http://localhost:5000/api/slideshow/control"
    method: POST
    content_type: "application/json"
    payload: '{"action": "previous"}'
```

### Script di Automazione

```yaml
script:
  photoframe_morning_start:
    alias: "Avvia PhotoFrame al Mattino"
    sequence:
      - service: rest_command.photoframe_play

automation:
  - alias: "PhotoFrame - Avvio Mattutino"
    trigger:
      - platform: time
        at: "08:00:00"
    action:
      - service: script.photoframe_morning_start
```

### Card Lovelace

Aggiungi alla tua dashboard:

```yaml
type: vertical-stack
cards:
  - type: iframe
    url: http://homeassistant.local:5000
    aspect_ratio: 16:9
  - type: horizontal-stack
    cards:
      - type: button
        name: Play
        icon: mdi:play
        tap_action:
          action: call-service
          service: rest_command.photoframe_play
      - type: button
        name: Pausa
        icon: mdi:pause
        tap_action:
          action: call-service
          service: rest_command.photoframe_pause
      - type: button
        name: Avanti
        icon: mdi:skip-next
        tap_action:
          action: call-service
          service: rest_command.photoframe_next
```

## Storage e Persistenza

### Directory Dati

Le foto caricate sono salvate in:
```
/data/uploads/
```

Questa directory è persistente e sopravvive ai riavvii dell'add-on.

### Backup

Le foto vengono automaticamente incluse nei backup di Home Assistant.

Per backup manuale:
1. Vai su **Impostazioni** → **Sistema** → **Backup**
2. Crea un nuovo backup
3. Le foto in `/data/uploads` saranno incluse

## Limitazioni

- Formati supportati: JPEG, PNG, WebP
- Dimensione massima file: configurabile (default 10MB)
- Numero massimo foto: configurabile (default 50)

## Prestazioni

### Requisiti Minimi
- RAM: 256MB
- CPU: 1 core
- Storage: 500MB + spazio per foto

### Ottimizzazione
- Le immagini vengono servite in modo ottimizzato
- Preload per transizioni fluide
- Cache browser abilitata

## Sicurezza

L'add-on è progettato per:
- ✅ Funzionare solo sulla rete locale
- ✅ Non esporre dati all'esterno
- ✅ Validare tutti gli upload
- ✅ Limitare dimensioni file

### Accesso Esterno

Per accedere da fuori casa, usa:
- Home Assistant Cloud (Nabu Casa)
- VPN (WireGuard, OpenVPN)
- **NON esporre direttamente la porta 5000 su internet**

## Troubleshooting

### Log Dettagliati

Accedi ai log completi da:
**Impostazioni** → **Add-on** → **PhotoFrame** → **Log**

### Problemi Comuni

**Errore "Cannot upload files"**
- Verifica spazio su disco
- Controlla permessi directory /data

**Slideshow non si avvia**
- Verifica che ci siano foto caricate
- Controlla console browser (F12)

**Controlli non rispondono**
- Ricarica la pagina
- Pulisci cache browser
