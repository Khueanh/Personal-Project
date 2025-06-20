import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { BASE_URL } from '../config.js';
import { getUser } from '../auth.js';
class WeatherWidget extends LitElement {

  static properties = {
    externalHeader: { type: String, state: true},
    externalTemp: { type: Number, state: true },
    externalDesc: { type: String, state: true },
    externalCode: { type: Number, state: true },
    localTemp: { type: Number, state: true }, 
    localHumidity: { type: Number, state: true },
    cityInput: { type: String, state: true },
    cityName: { type: String, state: true },
  }

    static styles = css`
        :host {
            display: block;
            width: 25vw;
            min-width: 300px;
            border-radius: 25px;
        }

        .weather-container:hover {
            transform: scale(1.03);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
        }
        
        img{
            width: 150px;
            height: 150px;
            animation: float 3s ease-in-out infinite;
        }
        
        input{
            border: none;
            width: 40%;
            text-align: center;
            background: transparent;
            padding: 4px 2px;
        }
        button{
            background: #B1C29E;
            border-color: #B1C29E;
            border-style: solid;
            border-radius: 12px;
            width: 60 px;
            height: 28px;
            color: white;
        }


        #externalHeading{
            color: #11274a;
        }

        #localWHeading{
            color: #11274a;
        }

        .weather-container {
            padding: 1rem;
            border-radius: 12px;
            color: #333;
            transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
            border: 1px solid #f5f5f5;
        }

        
        @keyframes float {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
            100% {
                transform: translateY(0px);
            }
        }

        .weather-clear {
            background: linear-gradient(to bottom, #FFEE88, #ffffff);
        }

        .weather-mostly-clear {
            background: linear-gradient(to bottom, #FFEE88, #e3e3e3);
        }

        .weather-cloudy {
            background:linear-gradient(to bottom, #6a758f, #c5d0e6);
        }

        .weather-rain {
            background:linear-gradient(to bottom, #439ff0, #dee8ff);
        }

        .weather-snow {
            background:linear-gradient(to bottom, #c4f5ff,#f7feff);
        }

        .weather-storm {
            background:linear-gradient(to bottom, #6a758f, #c5d0e6);
        }

        .weather-default {
            background-color: white;
        }


        #temperature{
            color: #7d7d7d;
            padding-right:12px;
            font-size:18px;
        }
        #humidity{
            padding-right:50px;
            color: #7d7d7d;
            font-size:18px;
        }

        #localTemperature, #localHumidity{
            text-align: left;
            padding-left: 20px;
            padding-top:10px;
            font-size:21px;
        }

    `;

    constructor() {
        super();
        this.externalHeader = null;
        this.externalTemp = null;
        this.externalDesc = 'Loading...';
        this.localTemp = null;
        this.localHumidity = null;
        this.externalCode = null;
        this.cityInput = '';
        this.cityName = ' ';

    }

    updateInput(e) {
        this.cityInput = e.target.value;
    }

    connectedCallback() {
        super.connectedCallback();
        this.getExternalWeather();
        this.getLocalSensorData();
      
        window.addEventListener('user', (e) => {
          if (e.detail === 'login') {
            this.getLocalSensorData();
          }
          if(e.detail === 'logout') {
            this.localTemp = null;
            this.localHumidity = null;
          }
        });
    }

    async getExternalWeather() {
        const fallbackLat = -33.87; // Sydney
        const fallbackLon = 151.21;

        if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            pos => {
            const { latitude, longitude } = pos.coords;
            this.fetchExternalWeather(latitude, longitude);
            },
            err => {
            console.warn('Location denied, using Sydney.');
            this.fetchExternalWeather(fallbackLat, fallbackLon);
            }
        );
        } else {
        this.fetchExternalWeather(fallbackLat, fallbackLon);
        }
    }

    //search city
    async getWeatherByCityName() {
        try {
          const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(this.cityInput)}`);
          const geo = await geoRes.json();
    
          if (!geo.results || geo.results.length === 0) {
            this.cityName = 'City not found';
            this.temperature = null;
            this.description = '';
            return;
        }
    
          const { latitude, longitude, name } = geo.results[0];
          this.cityName = name;
          this.fetchExternalWeather(latitude, longitude)
        } catch (e) {
          console.error('Failed to fetch weather:', e);
          this.cityName = 'Error fetching data';
          this.temperature = null;
          this.description = '';
        }
    }

    async fetchExternalWeather(lat, lon) {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        this.externalTemp = data.current_weather?.temperature ?? null;
        this.externalDesc = this.getWeatherDescription(data.current_weather?.weathercode);
        this.externalCode = data.current_weather?.weathercode;
    }


    //Weather Description
    getWeatherDescription(code) {
        const map = {
            0: "Clear sky ☀️",
            1: "Mainly clear 🌤️",
            2: "Partly cloudy ⛅",
            3: "Overcast ☁️",
            45: "Fog 🌫", 48: "Depositing rime fog 🌫",
            51: "Light drizzle 🌦", 53: "Moderate drizzle 🌦", 55: "Dense drizzle 🌦",
            56: "Freezing light drizzle 🌦", 57: "Freezing dense drizzle 🌦",
            61: "Light rain 🌧", 63: "Moderate rain 🌧", 65: "Heavy rain 🌧",
            66: "Freezing light rain 🌧", 67: "Freezing heavy rain 🌧",
            71: "Light snow ☃️", 73: "Moderate snow ☃️", 75: "Heavy snow ☃️",
            77: "Snow grains 🌨️",
            80: "Light rain shower 🌦", 81: "Moderate rain shower 🌦", 82: "Violent rain shower 🌧",
            85: "Light snow shower 🌨️", 86: "Heavy snow shower 🌨️",
            95: "Thunderstorm 🌩️", 96: "Thunderstorm with light hail ⛈️", 99: "Thunderstorm with heavy hail ⛈️"
            };
        return map[code] || "Unknown";
    }

    // I drew all of these weather images....
    getImageByWeatherCode(code) {
        if (code === 0) return './src/weatherimages/cuter-sun.png';
        if ([1, 2].includes(code)) return './src/weatherimages/cloudy-with-sun.png';
        if ([3,45,48].includes(code)) return './src/weatherimages/cloudy-with-eyes.png';
        if ((code >= 51 && code <= 67) || [80, 81, 82].includes(code)) return './src/weatherimages/raining.png';
        if ((code >= 71 && code <= 75)) return './src/weatherimages/snowman.png';
        if ([77, 85,86].includes(code)) return './src/weatherimages/snowing.png';
        if (code == 95) return './src/weatherimages/thunderstorm.png';
        if ([96,99].includes(code)) return './src/weatherimages/thunderstorm-with-hail.png'
        return null;
    }

    //change colours depends on weather code
    getWeatherClass(code) {
        if (code === 0) return 'weather-clear';
        if ([1, 2].includes(code)) return 'weather-mostly-clear';
        if ([3, 45, 48].includes(code)) return 'weather-cloudy';
        if ((code >= 51 && code <= 67) || [80, 81, 82].includes(code)) return 'weather-rain';
        if ((code >= 71 && code <= 77) || [85, 86].includes(code)) return 'weather-snow';
        if (code >= 95) return 'weather-storm';
        return 'weather-default';
    }

    //Local data
    async getLocalSensorData() {
        const user = getUser();
        const token = user?.token;
        if (!token) {
          console.warn("No token found via getUser");
          return;
        }
      
        const res = await fetch(`${BASE_URL}home/sensors/1357`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      
        const data = await res.json();
        const readings = data.data;
      
        if (!Array.isArray(readings) || readings.length === 0) return;
      
        const random = Math.floor(Math.random() * readings.length);
        const randomData = readings[random];
      
        this.localTemp = randomData.temperature;
        this.localHumidity = randomData.humidity;
    }

    onSearch(e) {
        e.preventDefault();
        this.getWeatherByCityName(); 
    }

    render() {
        const imageSrc = this.externalCode !== null ? this.getImageByWeatherCode(this.externalCode) : '';
        // const imageSrc = './src/weatherimages/snowing.png' <- image test code
        const weatherClass = this.getWeatherClass(this.externalCode);


        return html`
        <div class="weather-container ${weatherClass}">
            <h3 id='externalHeading'>${this.cityName} Weather</h3>
            ${imageSrc ? html`<img src="${imageSrc}" alt="weather image" width="100">` : ''}
            <p>${this.externalTemp ?? '...'} °C, ${this.externalDesc}</p>
            
            <form @submit=${this.onSearch}>
                <input 
                    type="text" 
                    placeholder="Enter city" 
                    .value=${this.cityInput} 
                    @input=${this.updateInput}
                >
                <button @click=${this.getWeatherByCityName}>Search</button>
            </form>
            
            <h3 id="localWHeading">Local Weather</h3>
            <p id="localTemperature"><span id="temperature">Temperature </span> <span id="localTempValue">${this.localTemp ?? '...'} °C</span></p>
            <p id="localHumidity"><span id="humidity">Humidity </span><span id="localHumValue">${this.localHumidity ?? '...'} %</span></p>
        </div>


        `;
    }

}

customElements.define('weather-widget', WeatherWidget);
