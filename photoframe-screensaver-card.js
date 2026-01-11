// PhotoFrame Screensaver Card for Home Assistant
// Version 2.0.1 - Compact Card + Responsive Photos
// Uses Home Assistant's built-in LitElement

console.info(
  '%c  PHOTOFRAME-SCREENSAVER-CARD  \n%c  Version 2.0.1 - COMPACT + RESPONSIVE    ',
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// Registra card nel picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'photoframe-screensaver-card',
  name: 'PhotoFrame Screensaver Card',
  description: 'Slideshow card che diventa screensaver fullscreen quando inattivo',
  preview: true,
});

// TRANSITION EFFECTS DEFINITIONS
const TRANSITION_EFFECTS = {
  fade: {
    name: 'Dissolvenza',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0 },
          { opacity: 1 }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1 },
          { opacity: 0 }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  slideLeft: {
    name: '◀️ Scorri Sinistra',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'translateX(100%)' },
          { opacity: 1, transform: 'translateX(0)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: 'translateX(-100%)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  slideRight: {
    name: '▶️ Scorri Destra',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'translateX(-100%)' },
          { opacity: 1, transform: 'translateX(0)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'translateX(0)' },
          { opacity: 0, transform: 'translateX(100%)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  slideUp: {
    name: '⬆️ Scorri Alto',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'translateY(100%)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(-100%)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  slideDown: {
    name: '⬇️ Scorri Basso',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'translateY(-100%)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: 'translateY(100%)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  zoomIn: {
    name: '🔍 Zoom Avanti',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'scale(0.8)' },
          { opacity: 1, transform: 'scale(1)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(1.2)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  zoomOut: {
    name: '🔎 Zoom Indietro',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'scale(1.2)' },
          { opacity: 1, transform: 'scale(1)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 0, transform: 'scale(0.8)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  kenBurns: {
    name: '📽️ Ken Burns',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'scale(1)' },
          { opacity: 1, transform: 'scale(1.1)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'scale(1.1)' },
          { opacity: 0, transform: 'scale(1.15)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  rotate: {
    name: '🔄 Rotazione',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'rotate(-180deg) scale(0.5)' },
          { opacity: 1, transform: 'rotate(0deg) scale(1)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'rotate(0deg) scale(1)' },
          { opacity: 0, transform: 'rotate(180deg) scale(0.5)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  flip: {
    name: '🔃 Flip 3D',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'perspective(1000px) rotateY(-90deg) scale(0.8)' },
          { opacity: 1, transform: 'perspective(1000px) rotateY(0deg) scale(1)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'perspective(1000px) rotateY(0deg) scale(1)' },
          { opacity: 0, transform: 'perspective(1000px) rotateY(90deg) scale(0.8)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  spiral: {
    name: '🌀 Spirale',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'rotate(-360deg) scale(0.3)' },
          { opacity: 1, transform: 'rotate(0deg) scale(1)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'rotate(0deg) scale(1)' },
          { opacity: 0, transform: 'rotate(360deg) scale(0.3)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  corner: {
    name: '📐 Angolo',
    animation: (img, enter) => {
      if (enter) {
        img.animate([
          { opacity: 0, transform: 'translate(100%, -100%) rotate(-45deg) scale(0.5)' },
          { opacity: 1, transform: 'translate(0, 0) rotate(0deg) scale(1)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      } else {
        img.animate([
          { opacity: 1, transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          { opacity: 0, transform: 'translate(-100%, 100%) rotate(45deg) scale(0.5)' }
        ], { duration: 700, easing: 'ease-in-out', fill: 'forwards' });
      }
    }
  },
  mix: {
    name: '🎲 Mix Casuale',
    animation: null // Special case - will pick random effect
  }
};

class PhotoFrameScreensaverCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._photos = [];
    this._currentIndex = 0;
    this._isPlaying = true;
    this._isFullscreen = false;
    this._isLoading = true;
    this._lastActivityTime = Date.now();
    this._ingressUrl = null;
    this._imageCache = new Map();
    this._controlsVisible = true;
    this._controlsHideTimer = null;
  }

  set hass(hass) {
    this._hass = hass;
  }

  setConfig(config) {
    this.config = {
      addon_url: config.addon_url || '',
      addon_slug: config.addon_slug || 'photoframe-beta',
      use_ingress: config.use_ingress || false,
      idle_timeout: config.idle_timeout || 30,
      slideshow_interval: config.slideshow_interval || 15,
      transition_effect: config.transition_effect || 'fade',
      show_controls: config.show_controls !== false,
      card_height: config.card_height || 250,
      image_fit: config.image_fit || 'cover',
      enable_auto_fullscreen: config.enable_auto_fullscreen !== false,
      ...config,
    };
  }

  // Visual Editor Support
  static getConfigElement() {
    return document.createElement('photoframe-screensaver-card-editor');
  }

  static getStubConfig() {
    return {
      type: 'custom:photoframe-screensaver-card',
      addon_url: 'http://192.168.1.100:5000',
      idle_timeout: 60,
      slideshow_interval: 15,
      transition_effect: 'fade',
      show_controls: true,
      card_height: 250,
      image_fit: 'cover',
      enable_auto_fullscreen: true
    };
  }

  async connectedCallback() {
    this._createDOM();
    this._startIdleDetection();
    this._startControlsAutoHide();
    await this._resolveBaseUrl();
    this._fetchPhotos();
  }

  disconnectedCallback() {
    this._stopIdleDetection();
    this._stopSlideshow();
    this._stopControlsAutoHide();
  }

  async _resolveBaseUrl() {
    if (this.config.addon_url) {
      let addonUrl = this.config.addon_url;
      try {
        const configUrl = new URL(addonUrl);
        const currentProtocol = window.location.protocol;
        
        if (currentProtocol === 'https:' && configUrl.protocol === 'http:') {
          configUrl.protocol = 'https:';
          if (configUrl.port === '5000' || configUrl.port === '') {
            configUrl.port = '5443';
          }
          addonUrl = configUrl.toString().replace(/\/$/, '');
          console.log('[PhotoFrame Card] Auto-switched to HTTPS:', addonUrl);
        }
      } catch (err) {
        console.warn('[PhotoFrame Card] Could not parse addon_url, using as-is:', addonUrl);
      }
      
      this._ingressUrl = addonUrl;
      console.log('[PhotoFrame Card] Using manual URL:', this._ingressUrl);
      return;
    }

    if (this.config.use_ingress && this._hass) {
      try {
        const ingressResponse = await this._hass.callApi('GET', `hassio/ingress/session`);
        this._ingressUrl = `/api/hassio_ingress/${ingressResponse}`;
        console.log('[PhotoFrame Card] Using ingress URL:', this._ingressUrl);
        return;
      } catch (err) {
        try {
          const slug = this.config.addon_slug;
          this._ingressUrl = `/api/hassio_ingress/${slug}`;
          console.log('[PhotoFrame Card] Using ingress URL with slug:', this._ingressUrl);
          return;
        } catch (err2) {
          console.warn('[PhotoFrame Card] Could not determine ingress URL:', err2);
        }
      }
    }

    console.error('[PhotoFrame Card] No valid base URL found!');
  }

  async _fetchPhotos() {
    if (!this._ingressUrl) {
      console.error('[PhotoFrame Card] No base URL available');
      this._isLoading = false;
      this._updateUI();
      return;
    }

    try {
      this._isLoading = true;
      this._updateUI();
      
      const apiUrl = `${this._ingressUrl}/api/photos`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const photos = await response.json();
      
      this._photos = photos
        .filter(p => !p.filepath?.includes('/trash/'))
        .map(p => {
          const actualFilename = p.filepath.split('/').pop();
          return {
            ...p,
            url: `${this._ingressUrl}/uploads/${actualFilename}`,
          };
        });
      
      this._isLoading = false;
      this._updateUI();
      this._updatePhoto();
      this._preloadImages();
      this._startSlideshow();
    } catch (error) {
      console.error('[PhotoFrame Card] Error fetching photos:', error);
      this._isLoading = false;
      this._photos = [];
      this._updateUI();
    }
  }

  _preloadImages() {
    for (let i = 0; i < Math.min(3, this._photos.length); i++) {
      const photo = this._photos[i];
      if (!this._imageCache.has(photo.url)) {
        const img = new Image();
        img.src = photo.url;
        this._imageCache.set(photo.url, img);
      }
    }
  }

  _startSlideshow() {
    if (this._slideshowInterval) {
      clearInterval(this._slideshowInterval);
    }

    if (this._isPlaying && this._photos.length > 0) {
      this._slideshowInterval = setInterval(() => {
        this._nextPhoto();
      }, this.config.slideshow_interval * 1000);
    }
  }

  _stopSlideshow() {
    if (this._slideshowInterval) {
      clearInterval(this._slideshowInterval);
      this._slideshowInterval = null;
    }
  }

  _getRandomEffect() {
    const effects = Object.keys(TRANSITION_EFFECTS).filter(e => e !== 'mix');
    return effects[Math.floor(Math.random() * effects.length)];
  }

  _nextPhoto() {
    if (this._photos.length === 0) return;
    this._currentIndex = (this._currentIndex + 1) % this._photos.length;
    this._updatePhoto();
    
    const nextIndex = (this._currentIndex + 1) % this._photos.length;
    const nextPhoto = this._photos[nextIndex];
    if (nextPhoto && !this._imageCache.has(nextPhoto.url)) {
      const img = new Image();
      img.src = nextPhoto.url;
      this._imageCache.set(nextPhoto.url, img);
    }
  }

  _prevPhoto() {
    if (this._photos.length === 0) return;
    this._currentIndex = (this._currentIndex - 1 + this._photos.length) % this._photos.length;
    this._updatePhoto();
  }

  _togglePlay() {
    this._isPlaying = !this._isPlaying;
    if (this._isPlaying) {
      this._startSlideshow();
    } else {
      this._stopSlideshow();
    }
    this._updateUI();
  }

  _startIdleDetection() {
    const resetTimer = () => {
      this._lastActivityTime = Date.now();
      if (this._isFullscreen) {
        this._exitFullscreen();
      }
    };

    ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(
      event => document.addEventListener(event, resetTimer)
    );

    this._idleCheckInterval = setInterval(() => {
      const now = Date.now();
      const idleTime = (now - this._lastActivityTime) / 1000;

      if (this.config.enable_auto_fullscreen && idleTime > this.config.idle_timeout && !this._isFullscreen && this._photos.length > 0) {
        this._enterFullscreen();
      }
    }, 1000);
  }

  _stopIdleDetection() {
    if (this._idleCheckInterval) {
      clearInterval(this._idleCheckInterval);
      this._idleCheckInterval = null;
    }
  }

  _startControlsAutoHide() {
    const container = this.shadowRoot.querySelector('.screensaver-container');
    if (!container) return;

    const showControls = () => {
      this._controlsVisible = true;
      this._updateUI();
      
      if (this._controlsHideTimer) {
        clearTimeout(this._controlsHideTimer);
      }
      
      this._controlsHideTimer = setTimeout(() => {
        this._controlsVisible = false;
        this._updateUI();
      }, 3000);
    };

    container.addEventListener('mousemove', showControls);
    container.addEventListener('touchstart', showControls);
    
    this._controlsHideTimer = setTimeout(() => {
      this._controlsVisible = false;
      this._updateUI();
    }, 3000);
  }

  _stopControlsAutoHide() {
    if (this._controlsHideTimer) {
      clearTimeout(this._controlsHideTimer);
      this._controlsHideTimer = null;
    }
  }

  _enterFullscreen() {
    this._isFullscreen = true;
    this._updateUI();
  }

  _exitFullscreen() {
    this._isFullscreen = false;
    this._updateUI();
  }

  _createDOM() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: relative;
          height: 100%;
        }

        .screensaver-container {
          position: relative;
          width: 100%;
          height: ${this.config.card_height}px;
          background: #000;
          border-radius: 12px;
          overflow: hidden;
        }

        .photo-viewer {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          position: relative;
        }

        .screensaver-container.fullscreen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
          border-radius: 0 !important;
        }

        .photo {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          max-width: none;
          max-height: none;
          object-fit: ${this.config.image_fit};
          object-position: center;
          opacity: 0;
        }

        .photo.active {
          opacity: 1;
        }

        .controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          padding: 8px 16px;
          border-radius: 50px;
          z-index: 10;
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }

        .controls.auto-hide {
          opacity: 0;
          pointer-events: none;
        }

        .controls button {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 6px 10px;
          border-radius: 8px;
          transition: background 0.2s;
          line-height: 1;
        }

        .controls button:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        /* Controlli più grandi quando in fullscreen */
        .screensaver-container.fullscreen .controls {
          bottom: 50px;
          padding: 12px 20px;
          gap: 10px;
        }
        
        .screensaver-container.fullscreen .controls button {
          font-size: 24px;
          padding: 8px 12px;
        }

        .loading,
        .no-photos {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          height: 100%;
          padding: 20px;
          text-align: center;
          color: white;
        }
        
        .loading > div:first-child,
        .no-photos > div:first-child {
          font-size: clamp(32px, 8vw, 64px);
        }
        
        .loading > div:nth-child(2),
        .no-photos > div:nth-child(2) {
          font-size: clamp(14px, 3vw, 20px);
        }

        .hint {
          margin-top: 15px;
          font-size: 13px;
          opacity: 0.7;
          line-height: 1.5;
        }

        .hidden {
          display: none !important;
        }
      </style>
      <div class="screensaver-container">
        <div class="photo-viewer">
          <img class="photo" alt="Photo" />
        </div>

        <div class="controls hidden">
          <button class="btn-prev" title="Foto precedente">⏮️</button>
          <button class="btn-play" title="Pausa">⏸️</button>
          <button class="btn-next" title="Prossima foto">⏭️</button>
          <button class="btn-fullscreen" title="Screensaver">🖼️</button>
        </div>

        <div class="loading">
          <div style="font-size: 48px;">⏳</div>
          <div style="margin-top: 20px; font-size: 18px;">Caricamento foto...</div>
        </div>

        <div class="no-photos hidden">
          <div style="font-size: 64px;">📸</div>
          <div style="margin-top: 20px; font-size: 20px; font-weight: bold;">
            Nessuna foto disponibile
          </div>
          <div class="hint">
            Carica alcune foto nell'add-on PhotoFrame<br>
            e ricarica questa pagina
          </div>
        </div>
      </div>
    `;

    const btnPrev = this.shadowRoot.querySelector('.btn-prev');
    const btnPlay = this.shadowRoot.querySelector('.btn-play');
    const btnNext = this.shadowRoot.querySelector('.btn-next');
    const btnFullscreen = this.shadowRoot.querySelector('.btn-fullscreen');

    if (btnPrev) btnPrev.addEventListener('click', () => this._prevPhoto());
    if (btnPlay) btnPlay.addEventListener('click', () => this._togglePlay());
    if (btnNext) btnNext.addEventListener('click', () => this._nextPhoto());
    if (btnFullscreen) btnFullscreen.addEventListener('click', () => this._enterFullscreen());
  }

  _updateUI() {
    const container = this.shadowRoot.querySelector('.screensaver-container');
    const controls = this.shadowRoot.querySelector('.controls');
    const loading = this.shadowRoot.querySelector('.loading');
    const noPhotos = this.shadowRoot.querySelector('.no-photos');
    const btnPlay = this.shadowRoot.querySelector('.btn-play');

    if (container) {
      if (this._isFullscreen) {
        container.classList.add('fullscreen');
      } else {
        container.classList.remove('fullscreen');
      }
    }

    if (controls) {
      if (this.config.show_controls && !this._isFullscreen && this._photos.length > 0 && !this._isLoading) {
        controls.classList.remove('hidden');
        if (this._controlsVisible) {
          controls.classList.remove('auto-hide');
        } else {
          controls.classList.add('auto-hide');
        }
      } else {
        controls.classList.add('hidden');
      }
    }

    if (loading) {
      if (this._isLoading) {
        loading.classList.remove('hidden');
      } else {
        loading.classList.add('hidden');
      }
    }

    if (noPhotos) {
      if (!this._isLoading && this._photos.length === 0) {
        noPhotos.classList.remove('hidden');
      } else {
        noPhotos.classList.add('hidden');
      }
    }

    if (btnPlay) {
      btnPlay.innerHTML = this._isPlaying ? '⏸️' : '▶️';
      btnPlay.title = this._isPlaying ? 'Pausa' : 'Play';
    }
  }

  _updatePhoto() {
    const img = this.shadowRoot.querySelector('.photo');
    const currentPhoto = this._photos[this._currentIndex];
    
    if (img && currentPhoto) {
      let effect = this.config.transition_effect;
      
      // Handle "mix" - pick random effect
      if (effect === 'mix') {
        effect = this._getRandomEffect();
      }
      
      const transitionDef = TRANSITION_EFFECTS[effect] || TRANSITION_EFFECTS.fade;
      
      // Exit animation on current image
      if (img.src && transitionDef.animation) {
        transitionDef.animation(img, false);
      }
      
      // Wait for exit, then change image and enter
      setTimeout(() => {
        img.src = currentPhoto.url;
        img.alt = currentPhoto.filename;
        
        if (transitionDef.animation) {
          transitionDef.animation(img, true);
        }
      }, 100);
    }
  }

  getCardSize() {
    return Math.ceil(this.config.card_height / 50);
  }
}

// VISUAL EDITOR ELEMENT
class PhotoFrameScreensaverCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
  }

  _render() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
    }

    const effects = Object.keys(TRANSITION_EFFECTS).map(key => ({
      value: key,
      label: TRANSITION_EFFECTS[key].name
    }));

    this.shadowRoot.innerHTML = `
      <style>
        .card-config {
          padding: 16px;
          font-family: var(--paper-font-body1_-_font-family);
        }
        
        .config-section {
          margin-bottom: 24px;
        }
        
        .config-section h3 {
          margin: 0 0 12px 0;
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        
        .config-row {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .config-row label {
          flex: 1;
          font-size: 14px;
          color: var(--primary-text-color);
        }
        
        .config-row input,
        .config-row select {
          flex: 0 0 60%;
          padding: 8px;
          font-size: 14px;
          border: 1px solid var(--divider-color);
          border-radius: 4px;
          background: var(--primary-background-color);
          color: var(--primary-text-color);
        }
        
        .config-row ha-switch {
          margin-left: auto;
        }
        
        .help-text {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }
      </style>
      
      <div class="card-config">
        <div class="config-section">
          <h3>🔗 Connessione Add-on</h3>
          <div class="config-row">
            <label>URL Add-on PhotoFrame</label>
            <input type="text" id="addon_url" value="${this._config.addon_url || ''}" placeholder="http://192.168.1.100:5000">
          </div>
          <div class="help-text">Inserisci l'URL dell'add-on PhotoFrame (es: http://192.168.1.100:5000)</div>
        </div>
        
        <div class="config-section">
          <h3>⏱️ Timing</h3>
          <div class="config-row">
            <label>Timeout Inattività (secondi)</label>
            <input type="number" id="idle_timeout" value="${this._config.idle_timeout || 60}" min="10" max="600">
          </div>
          <div class="help-text">Tempo di inattività prima di attivare lo screensaver</div>
          
          <div class="config-row">
            <label>Intervallo Slideshow (secondi)</label>
            <input type="number" id="slideshow_interval" value="${this._config.slideshow_interval || 15}" min="3" max="120">
          </div>
          <div class="help-text">Tempo tra un cambio foto e l'altro</div>
        </div>
        
        <div class="config-section">
          <h3>🎨 Effetti & Visualizzazione</h3>
          <div class="config-row">
            <label>Effetto Transizione</label>
            <select id="transition_effect">
              ${effects.map(e => `
                <option value="${e.value}" ${this._config.transition_effect === e.value ? 'selected' : ''}>
                  ${e.label}
                </option>
              `).join('')}
            </select>
          </div>
          
          <div class="config-row">
            <label>Adattamento Immagine</label>
            <select id="image_fit">
              <option value="contain" ${this._config.image_fit === 'contain' ? 'selected' : ''}>Contieni (foto intera)</option>
              <option value="cover" ${this._config.image_fit === 'cover' ? 'selected' : ''}>Copri (schermo pieno)</option>
            </select>
          </div>
          
          <div class="config-row">
            <label>Altezza Card (pixel)</label>
            <input type="number" id="card_height" value="${this._config.card_height || 250}" min="200" max="2000" step="50">
          </div>
        </div>
        
        <div class="config-section">
          <h3>⚙️ Opzioni</h3>
          <div class="config-row">
            <label>Mostra Controlli</label>
            <input type="checkbox" id="show_controls" ${this._config.show_controls !== false ? 'checked' : ''}>
          </div>
          
          <div class="config-row">
            <label>Screensaver Automatico</label>
            <input type="checkbox" id="enable_auto_fullscreen" ${this._config.enable_auto_fullscreen !== false ? 'checked' : ''}>
          </div>
          <div class="help-text">Attiva/disattiva l'ingresso automatico in modalità screensaver</div>
        </div>
      </div>
    `;

    this._attachListeners();
  }

  _attachListeners() {
    const inputs = this.shadowRoot.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('change', () => this._configChanged());
    });
  }

  _configChanged() {
    const newConfig = {
      type: 'custom:photoframe-screensaver-card',
      addon_url: this.shadowRoot.getElementById('addon_url').value,
      idle_timeout: parseInt(this.shadowRoot.getElementById('idle_timeout').value),
      slideshow_interval: parseInt(this.shadowRoot.getElementById('slideshow_interval').value),
      transition_effect: this.shadowRoot.getElementById('transition_effect').value,
      image_fit: this.shadowRoot.getElementById('image_fit').value,
      card_height: parseInt(this.shadowRoot.getElementById('card_height').value),
      show_controls: this.shadowRoot.getElementById('show_controls').checked,
      enable_auto_fullscreen: this.shadowRoot.getElementById('enable_auto_fullscreen').checked
    };

    this._config = newConfig;

    const event = new CustomEvent('config-changed', {
      detail: { config: newConfig },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
}

customElements.define('photoframe-screensaver-card', PhotoFrameScreensaverCard);
customElements.define('photoframe-screensaver-card-editor', PhotoFrameScreensaverCardEditor);

window.PhotoFrameScreensaverCard = PhotoFrameScreensaverCard;ADMIN-2025-PERM-IS6Z
