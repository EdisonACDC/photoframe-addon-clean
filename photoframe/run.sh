#!/usr/bin/with-contenv bashio

bashio::log.info "Avvio PhotoFrame Add-on..."

# Leggi configurazione
UPLOAD_LIMIT=$(bashio::config 'upload_limit')
MAX_FILE_SIZE=$(bashio::config 'max_file_size')

bashio::log.info "Limite upload: ${UPLOAD_LIMIT} file"
bashio::log.info "Dimensione massima file: ${MAX_FILE_SIZE}MB"

# Crea directory uploads se non esiste
mkdir -p /data/uploads

# Export variabili ambiente
export UPLOAD_DIR=/data/uploads
export PORT=5000
export APP_ROOT=/app

cd /app

# Crea directory uploads se non esiste
bashio::log.info "Verifica directory uploads..."
if [ ! -d "/data/uploads" ]; then
  bashio::log.info "Creazione /data/uploads..."
  mkdir -p /data/uploads
  chmod 777 /data/uploads
  bashio::log.info "/data/uploads creata con permessi 777"
else
  bashio::log.info "/data/uploads esiste già"
  chmod 777 /data/uploads
  bashio::log.info "Permessi aggiornati: 777"
fi

# Debug: verifica file esistenti
bashio::log.info "=== DEBUG INFO ==="
bashio::log.info "Contenuto /app:"
ls -la /app | head -10
bashio::log.info "Contenuto /data:"
ls -la /data 2>/dev/null || bashio::log.warning "/data NON ESISTE"
bashio::log.info "Permessi /data/uploads:"
ls -la /data/uploads 2>/dev/null || bashio::log.warning "/data/uploads NON ESISTE"
bashio::log.info "UPLOAD_DIR env: $UPLOAD_DIR"
bashio::log.info "==================="

# Avvia l'applicazione
bashio::log.info "PhotoFrame avviato su porta 5000"
exec npm start
