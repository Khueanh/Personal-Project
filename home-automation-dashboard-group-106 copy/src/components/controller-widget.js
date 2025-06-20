import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { BASE_URL } from '../config.js';

class ControllerWidget extends LitElement {
  static properties = {
    externalTemp: { type: Number },
    heaterStatus: { type: String },
    desiredTemp: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-width: 260px;
      border-radius: 25px;
      background: linear-gradient(135deg, rgb(244, 240, 234) 0%, rgb(240, 195, 168) 100%);
      box-sizing: border-box;
      font-family: 'Segoe UI', sans-serif;
      color: rgb(198, 132, 96);
    }

    :host(:hover) {
      transform: translateY(-5px) scale(1.03);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    .widget {
      padding: 1rem;
      border-radius: 12px;
      transition: all 0.1s ease;
      background: transparent;
      box-shadow: none;
    }

    h3 {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: rgb(244, 101, 79);
    }

    @keyframes flicker {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.1) rotate(-1deg); opacity: 0.85; }
    }

    .heater-icon {
      font-size: 80px;
      text-align: center;
      display: block;
      margin: 20px auto 10px;
      transition: transform 0.3s ease;
    }

    .heater-icon.on {
      animation: flicker 1.2s ease-in-out infinite;
      text-shadow: 0 0 8px rgba(255, 85, 34, 0.6), 0 0 16px rgba(255, 85, 34, 0.3);
    }

    .temp {
      text-align: center;
      margin-bottom: 1rem;
      font-size: 1.3rem;
      color: rgb(49, 46, 44);
    }

    .status {
      text-align: center;
      font-weight: bold;
      font-size: 1.3rem;
      margin: 10px 0;
    }

    .status.on {
      color: rgb(206, 71, 50);
    }

    .status.off {
      color: rgb(180, 103, 52);
    }

    .switch {
      position: relative;
      display: block;
      width: 70px;
      height: 34px;
      margin: 15px auto 5px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgb(180, 103, 52);
      transition: 0.4s;
      border-radius: 34px;
    }

    .slider::before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
      z-index: 1;
    }

    input:checked + .slider {
      background-color: rgb(199, 82, 63);
    }

    input:checked + .slider::before {
      transform: translateX(36px);
    }

    .switch-label {
      text-align: center;
      font-size: 0.9rem;
      color: #8b3f2f;
    }

    .temp-control {
      text-align: center;
      margin-top: 20px;
    }

    .temp-control label {
      font-weight: bold;
      margin-bottom: 5px;
      display: block;
      font-size: 1.3rem;
      color: rgb(204, 63, 63);
    }

    .temp-control input[type="range"] {
      width: 100%;
      -webkit-appearance: none;
      appearance: none;
      border-radius: 15px;
      height: 10px;
      margin-top: 10px;
      cursor: pointer;
    }

    .temp-control input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      background: rgb(193, 81, 70);
      cursor: pointer;
      border-radius: 50%;
      border: none;
    }

    .temp-control input[type="range"]::-moz-range-thumb {
      width: 20px;
      height: 20px;
      background: rgb(153, 55, 44);
      cursor: pointer;
      border-radius: 50%;
      border: none;
    }
  `;

  constructor() {
    super();
    this.externalTemp = null;
    this.heaterStatus = 'off';
    this.desiredTemp = 22;
  }

  connectedCallback() {
    super.connectedCallback();
    this.getExternalWeather();
  }

  async getExternalWeather() {
    try {
      const fallbackLat = -33.87;
      const fallbackLon = 151.21;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            const { latitude, longitude } = pos.coords;
            this.fetchExternalWeather(latitude, longitude);
          },
          () => {
            this.fetchExternalWeather(fallbackLat, fallbackLon);
          }
        );
      } else {
        this.fetchExternalWeather(fallbackLat, fallbackLon);
      }
    } catch (error) {
      console.error('Error getting external weather:', error);
    }
  }

  async fetchExternalWeather(lat, lon) {
    try {
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      const data = await res.json();
      this.externalTemp = data.current_weather?.temperature ?? null;
    } catch (error) {
      console.error('Error fetching external weather:', error);
    }
  }

  toggleHeater(e) {
    this.heaterStatus = e.target.checked ? 'on' : 'off';
  }

  updateDesiredTemp(e) {
    const temp = Number(e.target.value);
    if (temp >= 10 && temp <= 30) {
      this.desiredTemp = temp;
    } else {
      console.error('Invalid desired temperature:', temp);
    }
  }

  render() {
    const gradientPercent = ((this.desiredTemp - 10) / 20) * 100;

    return html`
      <div class="widget">
        <h3>Heater Controller</h3>
        <div class="heater-icon ${this.heaterStatus === 'on' ? 'on' : ''}">🔥</div>

        <div class="temp">
          Outside Temp: ${this.externalTemp ?? '...'} °C
        </div>

        ${this.heaterStatus === 'on' ? html`
          <div class="temp">
            Desired Temp: ${this.desiredTemp} °C
          </div>
        ` : ''}

        <div class="status ${this.heaterStatus === 'on' ? 'on' : 'off'}">
          <span>Heater is </span>
          <span>${this.heaterStatus.toUpperCase()}</span>
        </div>

        <label class="switch">
          <input type="checkbox" @change=${this.toggleHeater} .checked=${this.heaterStatus === 'on'}>
          <span class="slider"></span>
        </label>
        <div class="switch-label">Toggle Heater</div>

        <div class="temp-control">
          <label for="heater-temp">Desired Temperature: ${this.desiredTemp} °C</label>
          <input
            id="heater-temp"
            type="range"
            min="10"
            max="30"
            step="1"
            .value=${this.desiredTemp}
            ?disabled=${this.heaterStatus !== 'on'}
            @input=${this.updateDesiredTemp}
            style="background: linear-gradient(to right, #ea8e71 0%, #ea8e71 ${gradientPercent}%, #fff5e6 ${gradientPercent}%, #fff5e6 100%);
                   opacity: ${this.heaterStatus === 'on' ? 1 : 0.4};"
          />
        </div>
      </div>
    `;
  }
}

customElements.define('controller-widget', ControllerWidget);
