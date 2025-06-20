import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class Clock extends LitElement {
  static properties = {
    currentTime: { type: String, state: true },
    currentDay: { type: String, state: true},
    currentDate: { type: String, state: true},
  }

  static styles = css`
    :host {
      display: block;
      margin-top:-50px;
    }

    p {
        font-size: 1rem;
        font-family: 'Segoe UI', sans-serif;
        color: #444;
        font-weight: 300;
        transition: all 0.3s ease-in-out;
    } 
    .date-box{
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      display: block;
      background-image: url('./src/images/date-background.jpeg');
      background-size: cover;       
      background-position: center; 
      background-repeat: no-repeat;
      margin-top: -50px;

    }
    #weekday{
      font-size: 35px;
      padding-top: 20px;
      padding-left: 10px;

    }
    #date{
      margin-top:-30px;
      padding-bottom:20px;
      padding-left: 10px;
    }
    .clock-box{
      text-align: center;
      margin-left: -8px;
    }
    
    #time{
      font-size: 40px;
      font-weight: 700; 
      background-color: #F0A04B;
      border-radius: 50%;        
      width: 140px;              
      height: 140px;
      line-height: 140px; 
      display: inline-block;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      color: #FCE7C8;
      margin-top:20px;
    }

  `;

  constructor() {
    super();
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
  }

  updateTime() {
    const now = new Date();
  
    // 날짜와 요일
    this.currentDate = now.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    this.currentDay = now.toLocaleDateString(undefined, {
      weekday: 'short'
    });
  
    // 시간
    this.currentTime = now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
   
  render() {
    return html`
      <div class="date-and-clock">
        <div class="date-box">
          <p id="weekday"><strong>${this.currentDay}</strong></p>
          <p id="date">${this.currentDate}</p>
        </div>  
        <div class="clock-box">
          <p id="time">${this.currentTime}</p>
        </div>
      </div>
    `;
  }
}

customElements.define('x-clock', Clock);
