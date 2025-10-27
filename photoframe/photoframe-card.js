class PhotoFrameCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    if (!this.content) {
      this.createCard();
    }
    this.updateCard();
  }

  setConfig(config) {
    if (!config.addon_slug) {
      throw new Error('addon_slug è obbligatorio nella configurazione');
    }
    this.config = {
      addon_slug: config.addon_slug,
      title: config.title || 'PhotoFrame Screensaver',
      show_interval: config.show_interval !== false,
      intervals: config.intervals || [5, 10, 15, 30, 60],
      ...config
    };
  }

  createCard() {
    this.attachShadow({ mode: 'open' });
    
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
      }
      
      .card {
        background: var(--ha-card-background, var(--card-background-color, white));
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
        padding: 16px;
        font-family: var(--paper-font-body1_-_font-family);
      }
      
      .card-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }
      
      .card-icon {
        width: 40px;
        height: 40px;
        background: var(--primary-color);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }
      
      .card-title {
        font-size: 18px;
        font-weight: 500;
        color: var(--primary-text-color);
        flex: 1;
      }
      
      .status-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        text-transform: uppercase;
      }
      
      .status-playing {
        background: #4caf50;
        color: white;
      }
      
      .status-paused {
        background: #ff9800;
        color: white;
      }
      
      .controls {
        display: flex;
        gap: 8px;
        margin-bottom: 16px;
      }
      
      .control-btn {
        flex: 1;
        padding: 12px;
        border: none;
        border-radius: 8px;
        background: var(--primary-color);
        color: white;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
      }
      
      .control-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }
      
      .control-btn:active {
        transform: translateY(0);
      }
      
      .control-btn.secondary {
        background: var(--secondary-background-color, #f5f5f5);
        color: var(--primary-text-color);
      }
      
      .interval-section {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid var(--divider-color, #e0e0e0);
      }
      
      .interval-label {
        font-size: 13px;
        color: var(--secondary-text-color);
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .interval-buttons {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }
      
      .interval-btn {
        padding: 8px 14px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 6px;
        background: white;
        color: var(--primary-text-color);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .interval-btn:hover {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
      
      .interval-btn.active {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
        font-weight: 600;
      }
      
      .error {
        padding: 12px;
        background: #ffebee;
        border-left: 4px solid #f44336;
        border-radius: 4px;
        color: #c62828;
        font-size: 13px;
        margin-top: 12px;
      }
      
      .loading {
        text-align: center;
        padding: 20px;
        color: var(--secondary-text-color);
      }
    `;
    
    this.shadowRoot.appendChild(style);
    this.content = document.createElement('div');
    this.shadowRoot.appendChild(this.content);
  }

  updateCard() {
    if (!this._hass || !this.config) return;

    const isPlaying = this._hass.states[`input_boolean.photoframe_playing`]?.state === 'on';
    const currentInterval = parseInt(this._hass.states[`input_number.photoframe_interval`]?.state) || 15;

    this.content.innerHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-icon">🖼️</div>
          <div class="card-title">${this.config.title}</div>
          <div class="status-badge ${isPlaying ? 'status-playing' : 'status-paused'}">
            ${isPlaying ? '▶ Playing' : '⏸ Paused'}
          </div>
        </div>
        
        <div class="controls">
          <button class="control-btn" onclick="photoFrameControl('${this.config.addon_slug}', 'previous')">
            ⏮️ Precedente
          </button>
          <button class="control-btn" onclick="photoFrameControl('${this.config.addon_slug}', '${isPlaying ? 'pause' : 'play'}')">
            ${isPlaying ? '⏸️ Pausa' : '▶️ Play'}
          </button>
          <button class="control-btn" onclick="photoFrameControl('${this.config.addon_slug}', 'next')">
            Successiva ⏭️
          </button>
        </div>
        
        ${this.config.show_interval ? `
          <div class="interval-section">
            <div class="interval-label">⏱️ Intervallo Slideshow</div>
            <div class="interval-buttons">
              ${this.config.intervals.map(sec => `
                <button 
                  class="interval-btn ${currentInterval === sec ? 'active' : ''}"
                  onclick="photoFrameSetInterval('${this.config.addon_slug}', ${sec})"
                >
                  ${sec}s
                </button>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  getCardSize() {
    return 3;
  }
}

// Funzione globale per controllo slideshow
window.photoFrameControl = async function(addonSlug, action) {
  try {
    const response = await fetch(`/api/hassio_ingress/${addonSlug}/api/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    
    if (!response.ok) throw new Error('Errore controllo');
    
    // Aggiorna lo stato in Home Assistant
    if (action === 'play') {
      await setHassState('input_boolean.photoframe_playing', 'on');
    } else if (action === 'pause') {
      await setHassState('input_boolean.photoframe_playing', 'off');
    }
    
    console.log(`✅ PhotoFrame: ${action}`);
  } catch (error) {
    console.error('❌ Errore PhotoFrame:', error);
    alert('Errore nel controllo di PhotoFrame');
  }
};

// Funzione globale per cambio intervallo
window.photoFrameSetInterval = async function(addonSlug, interval) {
  try {
    const response = await fetch(`/api/hassio_ingress/${addonSlug}/api/control`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'play', interval })
    });
    
    if (!response.ok) throw new Error('Errore impostazione intervallo');
    
    // Aggiorna lo stato in Home Assistant
    await setHassState('input_number.photoframe_interval', interval);
    
    console.log(`✅ Intervallo impostato: ${interval}s`);
  } catch (error) {
    console.error('❌ Errore intervallo:', error);
    alert('Errore nell\'impostazione dell\'intervallo');
  }
};

// Helper per aggiornare stati Home Assistant
async function setHassState(entityId, state) {
  try {
    await fetch(`/api/states/${entityId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state })
    });
  } catch (error) {
    console.warn('Impossibile aggiornare stato:', entityId);
  }
}

// Registra la card
customElements.define('photoframe-card', PhotoFrameCard);

// Registra per il card picker
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'photoframe-card',
  name: 'PhotoFrame Screensaver',
  description: 'Controlla PhotoFrame direttamente da Home Assistant (funziona con Nabu Casa Cloud)',
  preview: true
});

console.log('%c✨ PhotoFrame Card caricata! v2.0', 'color: #4caf50; font-weight: bold; font-size: 14px;');
