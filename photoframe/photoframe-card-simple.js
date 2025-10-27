class PhotoFrameCard extends HTMLElement {
  setConfig(config) {
    if (!config.addon_slug) {
      throw new Error('addon_slug obbligatorio');
    }
    this.config = config;
  }

  set hass(hass) {
    if (!this.content) {
      this.innerHTML = `
        <ha-card header="${this.config.title || 'PhotoFrame'}">
          <div class="card-content">
            <div style="display:flex;gap:8px;margin-bottom:16px;">
              <button onclick="photoFrameCtrl('${this.config.addon_slug}','previous')" style="flex:1;padding:12px;border:none;border-radius:8px;background:#1976d2;color:white;cursor:pointer;">⏮️ Prec</button>
              <button onclick="photoFrameCtrl('${this.config.addon_slug}','play')" style="flex:1;padding:12px;border:none;border-radius:8px;background:#4caf50;color:white;cursor:pointer;">▶️ Play</button>
              <button onclick="photoFrameCtrl('${this.config.addon_slug}','pause')" style="flex:1;padding:12px;border:none;border-radius:8px;background:#ff9800;color:white;cursor:pointer;">⏸️ Pausa</button>
              <button onclick="photoFrameCtrl('${this.config.addon_slug}','next')" style="flex:1;padding:12px;border:none;border-radius:8px;background:#1976d2;color:white;cursor:pointer;">Succ ⏭️</button>
            </div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <button onclick="photoFrameInt('${this.config.addon_slug}',5)" style="padding:8px 14px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;">5s</button>
              <button onclick="photoFrameInt('${this.config.addon_slug}',10)" style="padding:8px 14px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;">10s</button>
              <button onclick="photoFrameInt('${this.config.addon_slug}',15)" style="padding:8px 14px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;">15s</button>
              <button onclick="photoFrameInt('${this.config.addon_slug}',30)" style="padding:8px 14px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;">30s</button>
              <button onclick="photoFrameInt('${this.config.addon_slug}',60)" style="padding:8px 14px;border:1px solid #ddd;border-radius:6px;background:white;cursor:pointer;">60s</button>
            </div>
          </div>
        </ha-card>
      `;
      this.content = true;
    }
  }

  getCardSize() {
    return 3;
  }
}

window.photoFrameCtrl = async function(slug, action) {
  try {
    await fetch('/api/hassio_ingress/' + slug + '/api/control', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({action: action})
    });
    console.log('PhotoFrame:', action);
  } catch(e) {
    alert('Errore: ' + e.message);
  }
};

window.photoFrameInt = async function(slug, interval) {
  try {
    await fetch('/api/hassio_ingress/' + slug + '/api/control', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({action: 'play', interval: interval})
    });
    console.log('Intervallo:', interval + 's');
  } catch(e) {
    alert('Errore: ' + e.message);
  }
};

customElements.define('photoframe-card', PhotoFrameCard);
console.log('✅ PhotoFrame Card caricata!');
