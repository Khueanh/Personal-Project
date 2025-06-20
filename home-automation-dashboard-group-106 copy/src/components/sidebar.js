import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import './login-widget.js';
import './clock.js';

class SidebarWidget extends LitElement {
    static properties = {
        showTooltip: { type: Boolean, state: true },
    };
  static styles = css`
    :host {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        width: 180px;
        background: #B1C29E;
        color: white;
        padding: 1rem;
        box-sizing: border-box;
        z-index: 999;
    }

    .clock {
        padding-top: 20px;
    }

    .alarm-button {
        background-color: transparent;
        border: none;
        border-radius: 6px;
        padding: 10px;
        font-weight: bold;
        cursor: pointer;
        margin-top: 1rem;
        width: 10px;
        
    }

    .alarm-button:hover {
        transform: scale(1.1);
        transition: transform 0.2s ease;
    }

    .tooltip {
        position: absolute;
        left: 50px;
        bottom: 30px;
        background: white;
        color: black;
        padding: 10px 14px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        font-size: 0.9rem;
        z-index: 1000;
        white-space: nowrap;
    }

    .tooltip::after {
        content: "";
        position: absolute;
        top: 50%;
        left: -6px;
        transform: translateY(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: transparent white transparent transparent;
    }
  `;
    constructor(){
        super();
        this.showTooltip = false;
    }

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener('click', this.handleOutsideClick);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('click', this.handleOutsideClick);
    }

    handleOutsideClick = (e) => {
        if (this.showTooltip && !this.shadowRoot.contains(e.target)) {
          this.showTooltip = false;
        }
    }

    toggleTooltip() {
        this.showTooltip = !this.showTooltip;
    }
    
    render() {
        return html`
          <div>
            <login-widget></login-widget>
            <div class="clock">
              <x-clock></x-clock>
            </div>
          </div>
      
          <div style="position: relative; margin-top: 1rem;">
            <button class="alarm-button" @click=${(e) => { e.stopPropagation(); this.toggleTooltip(); }}>
              <img src="./src/images/alarm.png" alt="Notification" width="25" height="25">
            </button>
            ${this.showTooltip ? html`
              <div class="tooltip">No mesages</div>
            ` : ''}
          </div>
        `;
      }
}

customElements.define('sidebar-widget', SidebarWidget);
