# Usa un'immagine fissa invece della variabile per evitare errori di build
FROM ghcr.io/home-assistant/amd64-base:3.20

# Imposta le variabili d'ambiente per Node
ENV LANG C.UTF-8
ENV NODE_VERSION 20.11.1

# Installa Node.js e le dipendenze necessarie
RUN apk add --no-cache \
    nodejs \
    npm \
    git \
    python3 \
    make \
    g++

# Crea la directory dell'app
WORKDIR /app

# Copia i file delle dipendenze
COPY package*.json ./

# Installa le dipendenze (inclusa la compilazione dei moduli nativi se necessari)
RUN npm install

# Copia il resto del codice
COPY . .

# Fai il build del frontend (Vite/React)
RUN npm run build

# Crea directory per upload
RUN mkdir -p /data/uploads && chmod 777 /data/uploads

# Copia lo script di avvio e rendilo eseguibile
COPY run.sh /
RUN chmod a+x /run.sh

# Comando di avvio
CMD [ "/run.sh" ]
