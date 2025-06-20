import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import './components/widget-block.js';
import './components/widget-column.js';
import './components/ad-widget.js';
import './components/login-widget.js';
import './components/weather-widget.js'
import './components/controller-widget.js';
import './components/shopping_list_components/shopping-list-widget.js';
import './components/TODOList-widget.js';
import './components/clock.js'
import './components/sidebar.js';



class Comp2110Dashboard extends LitElement {
  static properties = {
    header: { type: String },
  }

  static styles = css`
    :host {
      min-height: 100vh; 
      min-width: 100vw;  
      font-size: 14pt;
      color: #485666;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: #fafafa;
      display: block;
      padding: 1rem;
    }

    main {
      display: flex;
      content-justify: center
      gap:2rem; /* equal space between columns */
      justify-content:center; 
      align-items:flex-start; /* keeps tops aligned */
    }
    header {
      display: flex;
      align-items: center;      /* 이미지와 텍스트 수직 정렬 */
      justify-content: center;  /* 가로 방향 가운데 정렬 */
      gap: 10px;                /* 이미지-텍스트 사이 간격 */
      padding: 1rem;
      text-align: center;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;

  constructor() {
    super();
    this.header = 'Smart Home Dashboard';
  }

  render() {
    return html`
      <header>
        <img src='./src/images/house.png' alt="house icon" height="30" width="30">
        <h1>${this.header}</h1>
      </header>

      <main>
          <widget-column>
            <weather-widget></weather-widget>
            <controller-widget></controller-widget>
          </widget-column>  
          <widget-column>
            <shopping-list-widget></shopping-list-widget> 
            
          </widget-column>  
          <widget-column>
            <todo-list-widget></todo-list-widget>
            <ad-widget></ad-widget>
          </widget-column>
      </main>

      <p class="app-footer">
        A product of the COMP2110 Web Development Collective &copy; 2025
      </p>
    `;
  }
}

customElements.define('comp2110-dashboard', Comp2110Dashboard);