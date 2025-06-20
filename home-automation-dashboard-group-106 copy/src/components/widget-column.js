import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

class WidgetColumn extends LitElement {
  static properties = {
    header: { type: String },
  }

  static styles = css`
  :host {
    display: block;
    margin: 10px;
    box-sizing: border-box;
  }

  /* Every element you slotted in will get this bottom-margin ... */
  :host ::slotted(*) {
    margin-bottom: 1rem;
  }


  :host ::slotted(*:last-child) {
    margin-bottom: 0;
  }
`;


  constructor() {
    super();
    this.header = '';
  }

  render() {
    return html`
      <div>
        <h2>${this.header}</h2>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('widget-column', WidgetColumn);