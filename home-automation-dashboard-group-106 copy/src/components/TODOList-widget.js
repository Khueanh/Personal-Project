// 📁 src/components/TODOList-widget.js
import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';
import { getUser }               from '../auth.js';
import TODOList                  from './TODOList.js';


// Expose TODOList API globally for console debugging
window.TODOList = TODOList;

class TODOListWidget extends LitElement {
  static properties = {
    tasks:          { type: Array },
    loading:        { type: Boolean },
    completedTasks: { type: Array },
    _hasSeeded:     { type: Boolean },
    newTask:        { type: String },
    newDue:         { type: String }
  };

  static styles = css`
    :host {
      display: block;
      width: 25vw;
      border-radius: 25px;
      background: #FFFAEE;
      padding: 2vw;
      box-sizing: border-box;
      border: 1px solid #FBF4E4;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
    :host(:hover) {
      transform: translateY(-5px) scale(1.03);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
  
    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.6rem;
      text-align: center;
      color: #33333;
    }
    .TodoList-img{
      width: 50px;
      object-fit: cover;
      display: block;
      margin: 0 auto;
      padding: 1.5rem;
    }

    form {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    input[type="text"], input[type="date"] {
      flex: 1;
      min-width: 0;
      padding: 0.4rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 0.95rem;
    }
    button.add {
      flex-basis: 100%;
      padding: 0.5rem;
      background: #a4c77b;
      border: none;
      color: white;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1.1rem;
      margin-top: 0.5rem;
    }
    button.add:hover { background: #43a047; }
    .todo-section { margin-top: 1rem; }
    .todo-section h4 {
      margin: 0 0 0.5rem;
      font-size: 1.5rem;
      color: #555;
    }
    ul { list-style: none; padding: 0; margin: 0; }
    li {
      display: flex;
      justify-content: flex-start;
      text-align: left;
      align-items: center;
      padding: 0.4rem 0;
      border-top: 1px solid #eee;
    }
    li:first-child { border-top: none; }
    .check-btn {
      width: 1.4em; height: 1.4em;
      border: 2px solid #6e5846;
      border-radius: 50%;
      background: transparent;
      color: #6e5846;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 0.5rem;
      cursor: pointer;
      font-size: 1em;
      transition: background-color 0.2s, color 0.2s;
    }
    .check-btn.completed { background: #6e5846; color: white; }
    .task-text { flex: 1; color: #333;      font-size: 1rem; }
    .task-date {
      margin-left: 0.5rem;
      font-size: 0.85rem;
      color: #666;
    }
    li.due-soon .task-text,
    li.due-soon .task-date {
      color: #b75b56;

    }
    .delete-btn {
      background: transparent;
      border: none;
      color: #d32f2f;
      font-size: 1.2rem;
      cursor: pointer;
      margin-left: 0.5rem;

      /* smooth out hover transitions */
      transition: 
        background-color 0.2s ease, 
        color 0.2s ease, 
        transform 0.1s ease;
    }
    
    .delete-btn:hover {
      /* give it a slight pop */
      transform: scale(1.3);
      /* keep the button round if you like */
      border-radius: 50%;
    }
  `;

  constructor() {
    super();
    this.tasks          = [];
    this.loading        = true;
    this.completedTasks = [];
    this._hasSeeded     = false;
    this.newTask        = '';
    this.newDue         = '';
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('user', async e => {
      if (e.detail === 'login')  await this._initTasks();
      if (e.detail === 'logout') this.tasks = [];
    });
    const user = getUser();
    user?.token ? this._initTasks() : (this.loading = false);
  }

  async _initTasks() {
    await this._refresh();
    if (!this._hasSeeded && this.tasks.length === 0) {
      this._hasSeeded = true;
      await this._seedSampleTasks();
    }
  }

  async _seedSampleTasks() {
    const samples = [
      { text: 'Do Laundry',                     due: '2025-05-22' },
      { text: 'Read a Book',                    due: ''           },
      { text: 'Exam Revision',                  due: '2025-06-12' },
      { text: 'Clean the Kitchen',              due: '2025-05-23' },
      { text: 'Submit COMP2110 Assignment',     due: '2025-05-18' }
    ];
  
    // titles to mark completed
    const completedNames = [
      'Submit COMP2110 Assignment',
      'Do Laundry'
    ];
  
    for (const item of samples) {
      const isDone = completedNames.includes(item.text);
      await TODOList.addTask({
        summary:  item.text,
        text:     item.text,
        priority: 1,
        // use whichever completed category your API expects:
        category: isDone ? 'Completed' : 'ToDo',
        due:      item.due ? new Date(item.due).toISOString() : ''
      });
    }
  
    // now re-fetch from server so your widget shows the two as “complete”
    await this._refresh();
  }
  

    

  async _refresh() {
    this.loading = true;
    const data   = await TODOList.fetchTasks();
    this.tasks   = Array.isArray(data?.tasks) ? data.tasks : [];
    this.loading = false;
  }

  async _submitTask(e) {
    e.preventDefault();
    if (!this.newTask.trim()) return;
    await TODOList.addTask({
      summary:  this.newTask,
      text:     this.newTask,
      priority: 1,
      category: 'ToDo',
      due:      this.newDue ? new Date(this.newDue).toISOString() : ''
    });
    this.newTask = '';
    this.newDue  = '';
    await this._refresh();
  }

  _toggleComplete(id) {
    const set = new Set(this.completedTasks);
    set.has(id) ? set.delete(id) : set.add(id);
    this.completedTasks = [...set];
  }

  async _deleteTask(id) {
    await TODOList.deleteTask(id);
    this.completedTasks = this.completedTasks.filter(x => x !== id);
    await this._refresh();
  }

  _formatDate(due) {
    if (!due) return '';
    const d = new Date(due);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  _isDue(due) {
    if (!due) return false;
    const d = new Date(due);
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return d.getTime() <= tomorrow.getTime();
  }

  render() {
    if (this.loading) return html`<div>Loading…</div>`;

    const sorted = [...this.tasks].sort((a, b) => {
      const aHas = !!a.due, bHas = !!b.due;
      if (aHas !== bHas) return aHas ? -1 : 1;
      if (!aHas) return 0;
      return new Date(a.due) - new Date(b.due);
    });

    const todo     = sorted.filter(t => !this.completedTasks.includes(t.id));
    const complete = sorted.filter(t =>  this.completedTasks.includes(t.id));

    return html`

      <h3>My Tasks</h3>
      <img src="./src/images/to-do-list.JPG" alt="profile" class="TodoList-img" />
    
      <form @submit=${this._submitTask}>
        <input
          type="text"
          placeholder="Task"
          .value=${this.newTask}
          @input=${e => this.newTask = e.target.value}
        />
        <input
          type="date"
          .value=${this.newDue}
          @input=${e => this.newDue = e.target.value}
        />
        <button type="submit" class="add">➕ Add</button>
      </form>

      <hr></hr>

      <div class="todo-section">
        <h4>To Do</h4>
        ${todo.length
          ? html`<ul>
              ${todo.map(t => html`
                <li class=${this._isDue(t.due) ? 'due-soon':''}>
                  <button class="check-btn" @click=${() => this._toggleComplete(t.id)}></button>
                  <span class="task-text">${t.summary}</span>
                  ${this._formatDate(t.due)
                    ? html`<span class="task-date">${this._formatDate(t.due)}</span>`
                    : html``}
                  <button class="delete-btn" @click=${() => this._deleteTask(t.id)}>➖</button>
                </li>
              `)}
            </ul>`
          : html`<div>No pending tasks</div>`}
      </div>
      <hr></hr>
      <div class="todo-section">
  
        <h4>Completed</h4>
        ${complete.length
          ? html`<ul>
              ${complete.map(t => html`
                <li class=${this._isDue(t.due) ? 'due-soon':''}>
                  <button class="check-btn completed" @click=${() => this._toggleComplete(t.id)}>✓</button>
                  <span class="task-text">${t.summary}</span>
                  ${this._formatDate(t.due)
                    ? html`<span class="task-date">${this._formatDate(t.due)}</span>`
                    : html``}
                  <button class="delete-btn" @click=${() => this._deleteTask(t.id)}>➖</button>
                </li>
              `)}
            </ul>`
          : html`<div> </div>`}
          <hr></hr>
      </div>
    `;
  }
}

customElements.define('todo-list-widget', TODOListWidget);
