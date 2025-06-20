import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { getUser, storeUser, deleteUser } from '../auth.js';
import { BASE_URL } from '../config.js';

class LoginWidget extends LitElement {
  static properties = {
    user: { type: Object, state: true },
    showModal: { type: Boolean, state: true },
    errorMessage: { type: String, state: true }, // 추가
  };

  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      padding-right: 4vw;
    }

    .overlay {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }

    .modal {
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      width: 300px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
    }

    input[type="submit"], button {
      background: #FADA7A;
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.5rem;
      cursor: pointer;
      font-weight: bold;
    }

    input[type="submit"]:hover,
    button:hover {
      background: #F0A04B;
    }

    .modal-header {
      font-size: 1.2rem;
      margin-bottom: 1rem;
      color: black;
      text-align: center;
    }

    .error-message {
      color: red;
      font-size: 0.9rem;
      text-align: center;
    }

    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
      display: block;
      margin: 0 auto;
    }

    #loginButton {
      display: block;
      background: #FADA7A;
      width: 120px;
      height: 45px;
      font-size: 15px;
    }

    .login {
      padding-left: 30px;
    }

    #user-name {
      margin-left: -5px;
      text-align: left;
      white-space: nowrap;
      color: #5d6266;
    }

    #heart {
      text-align: center;
      font-size: 15px;
      width: 100px;
    }
  `;

  constructor() {
    super();
    this.user = getUser();
    this.showModal = false;
    this.errorMessage = ''; // 초기화
    this.loginUrl = `${BASE_URL}users/login`;
  }

  openModal() {
    this.showModal = true;
    this.errorMessage = '';
  }

  closeModal() {
    this.showModal = false;
  }

  async submitForm(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const res = await fetch(this.loginUrl, {
        method: 'post',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await res.json();

      if (response.username) {
        this.user = response;
        storeUser(response);
        this.showModal = false;
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Username or Password is Incorrect!';
      }
    } catch (err) {
      this.errorMessage = 'Error';
    }
  }

  logout() {
    deleteUser();
    this.user = null;
  }

  render() {
    return html`
      <p id="heart">┈┈ˏˋ♥´ˎ┈┈</p>
      ${this.user
        ? html`
            <div class="login">
              <img src="./src/images/profile.JPG" alt="profile" class="profile-img" />
              <p id="user-name"><strong>${this.user.name}</strong></p>
              <button @click=${this.logout}>Logout</button>
            </div>
          `
        : html`<button id="loginButton" @click=${this.openModal}>Login</button>`}

      ${this.showModal
        ? html`
            <div class="overlay" @click=${this.closeModal}>
              <div class="modal" @click=${e => e.stopPropagation()}>
                <div class="modal-header">Login</div>
                <form @submit=${this.submitForm}>
                  <input type="text" name="username" placeholder="Username" required />
                  <input type="password" name="password" placeholder="Password" required />
                  <input type="submit" value="Login" />
                </form>
                ${this.errorMessage
                  ? html`<p class="error-message">${this.errorMessage}</p>`
                  : ''}
              </div>
            </div>
          `
        : ''}
      <p id="heart">┈┈ˏˋ♥´ˎ┈┈</p>
    `;
  }
}

customElements.define('login-widget', LoginWidget);
