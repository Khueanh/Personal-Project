import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import ShoppingList from "./shoppinglist.js";

const CATEGORIES = [
  {
    label: "Dairy",
    icon: "🥛",
    items: [
      "🥛 Milk",
      "🥚 Eggs",
      "🍶 Yoghurt",
      "🧈 Butter",
      "🧀 Cheese",
      "🍨 Ice-cream",
    ],
  },

  {
    label: "Fish & Meat",
    icon: "🥩",
    items: ["🍗 Chicken", "🥓 Pork", "🐟 Salmon", "🥩 Steak", "🐟 Tuna"],
  },

  {
    label: "Fruits",
    icon: "🍎",
    items: ["🍎 Apple", "🍌 Banana", "🍇 Grapes", "🍓 Strawberry", "🍊 Orange"],
  },

  {
    label: "Drinks",
    icon: "🥤",
    items: ["🥤 Coke", "🍺 Beer", "🍊 Orange Juice"],
  },

  {
    label: "Grains & Bread",
    icon: "🍞",
    items: ["🍞 Bread", "🍚 Rice", "🍝 Pasta", "🍕 Pizza"],
  },

  {
    label: "Fats Products",
    icon: "🧈",
    items: ["🧈 Butter", "🫒 Olive Oil", "🌻 Sunflower Oil", "🥛 Cream"],
  },

  {
    label: "Tinned & Dry Goods",
    icon: "🥫",
    items: [
      "🍅 Tomatoes",
      "🥫 Pasta Sauce",
      "🥫 Canned Beans",
      "🐟 Canned Fish",
    ],
  },

  {
    label: "Spices & Sauces",
    icon: "🧂",
    items: [
      "🧂 Salt",
      "🌶️ Pepper",
      "🧄 Garlic Powder",
      "🧅 Onion Powder",
      "🥫 Tomato Paste",
    ],
  },

  {
    label: "Cleaning Supplies",
    icon: "🧹",
    items: ["🧴 Detergent", "🧪 Bleach", "🪟 Window Cleaner", "🍽️ Dishwasher"],
  },

  {
    label: "Personal Care",
    icon: "🧴",
    items: ["🧴 Shampoo", "🧴 Conditioner", "🧴 Body Wash", "🦷 Toothpaste"],
  },

  {
    label: "Baby Care",
    icon: "👶",
    items: ["👶 Diapers", "🧻 Baby Wipes", "🍼 Baby Food"],
  },

  {
    label: "Sweets",
    icon: "🍬",
    items: ["🍫 Chocolate", "🍨 Ice Cream", "🍬 Candy"],
  },

  {
    label: "Frozen Products",
    icon: "🧊",
    items: ["🍨 Ice Cream", "🥬 Frozen Vegetables", "🍕 Frozen Pizza"],
  },

  {
    label: "Health Care",
    icon: "💊",
    items: ["💊 Painkillers", "💊 Antibiotics", "💊 Vitamins"],
  },

  {
    label: "Other",
    icon: "📦",
    items: ["🧻 Toilet Paper", "🤧 Tissues", "🔋 Batteries"],
  },
];
class ShoppingListWidget extends LitElement {
  static properties = {
    items: { type: Array },
    loading: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      font-family: system-ui, sans-serif;
      border: 1px solidhsl(315, 49%, 70.8%);
      --radius: 16px;
      width: 25vw;
      min-width: 300px;
    }
    .tile {
      border-radius: calc(var(--radius) * 0.6);
      overflow: hidden;
    }

    /* catalogue tile layout */
    .tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
    }

    /* bigger, block-level icon so the label always starts underneath */
    .tile .icon {
      display: block;
      font-size: 42px;
      line-height: 1;
    }

    /* keep the label centred and allow wrapping */
    .tile .label {
      text-align: center;
      font-size: 0.9rem;
      line-height: 1.25;
      word-wrap: break-word;
    }

    /* Catalogue */
    .catalogue-card {
      border: var(--border);
      border-radius: var(--radius);
      padding: 0.6rem 1rem 1rem;
      background:rgb(223, 242, 226);
      margin-bottom: 1rem;
      box-shadow: 0 3px 10px rgb(0 0 0 / 0.05);
    }
    .catalogue-card,
    .list-card {
      transition: transform 0.18s cubic-bezier(0.2, 0.7, 0.4, 1.2),
        box-shadow 0.18s;
    }
    .catalogue-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
      gap: 0.6rem;
    }
    .grid-item {
      border: var(--border);
      border-radius: var(--radius);
      padding: 0.6rem 1rem 1rem;
      background: #fff;
    }
    /* catalogue tiles */
    .tile {
      padding: 0.6rem 0.4rem;
      font-size: 0.9rem;
    }

    /* catalogue hover */
    .tile {
      transition: transform 0.18s cubic-bezier(0.2, 0.7, 0.4, 1.2),
      box-shadow 0.18s, background 0.18s;
      border: 1px solid transparent;
    }

    .tile:hover {
      background: #f2f8ff;
      transform: translateY(-4px) scale(1.05);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.06);
      border-color: #c9e0ff;
    }
    .add-tile {
      cursor: pointer;
    }

    .tile .icon {
      font-size: 36px;
    }
    .tile .label {
      margin-top: 0.4rem;
    }

    .catalogue-card:hover,
    .list-card:hover {
      transform: scale(1.03);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }

    /* picker dialog */
    dialog {
      max-width: 480px;
      border: none;
      border-radius: 14px;
      box-shadow: 0 12px 32px #0005;
      border-radius: calc(var(--radius) * 1.4);
    }
    .picker-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
      gap: 0.7rem;
    }
    .pick-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 0.55rem 0.4rem;
      border: 1px solid #d0d0d0;
      border-radius: 10px;
      background: #fafafa;
      font-size: 0.85rem;
      transition: background 0.15s;
    }
    .pick-btn:hover {
      background: #f2f8ff;
    }
    .pick-btn:active {
      background: #e8f2ff;
    }
    .pick-btn .icon {
      font-size: 32px;
      line-height: 1;
    }
    .pick-btn .label {
      text-align: center;
      line-height: 1.2;
      white-space: pre-wrap;
    }

    /* header wrapper unchanged */
    .picker-header {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 0.8rem;
    }

    .picker-header h4 {
      margin: 0;
      padding: 0 3.2rem;
      font-size: 1.35rem;
    }

    /* close button stays absolute */
    .close-btn {
      position: absolute;
      top: -0.3rem;
      right: 0.6rem;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 2px solid currentColor;
      background: #fff;
      font-size: 22px;
      line-height: 1;
      color: #555;
      cursor: pointer;
    }
    /* Shopping list */
    .list-card {
      border: var(--border);
      border-radius: var(--radius);
      background:#FFFAEE;
      padding: 0.8rem;
      box-shadow: 0 3px 10px rgb(0 0 0 / 0.05);
    }
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      margin-bottom: 0.6rem;
    }
    .list-header button {
      border: none;
      background: none;
      cursor: pointer;
      font-size: 1.1rem;
      line-height: 1;
    }
    form {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 0.8rem;
    }
    form input {
      flex: 1;
      padding: 0.5rem 0.6rem;
      border: var(--border);
      border-radius: var(--radius);
      font-size: 0.9rem;
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      border-top: var(--border);
      padding: 0.5rem 0.2rem;
    }

    li:first-child {
      border-top: none;
    }
    li.checked span {
      text-decoration: line-through;
      color: #777;
    }
    .empty {
      color: #888;
      font-style: italic;
      padding: 0.4rem 0;
    }

    /*  HOVER EFFECTS for the list */
    li {
      position: relative;
      transition: background 0.15s ease;
    }

    li:hover {
      background: #f5f9ff;
    }

    li:hover::before {
      content: "";
      position: absolute;
      inset: 0;
      border-left: 4px solid #3b82f6;
      pointer-events: none;
      border-radius: 4px;
    }

    .delete-btn {
      border: 1px solid #999;
      border-radius: 6px;
      width: 38px;
      height: 38px;
      background: #fff;
      font-size: 22px;
      cursor: pointer;
      opacity: 0.4;
      transition: opacity 0.15s ease;
    }

    li:hover .delete-btn {
      opacity: 1;
    }

    .toast {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      background: #222;
      color: #fff;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      opacity: 0.9;
    }
  `;

  constructor() {
    super();
    this.items = [];
    this.loading = true;
  }

  async connectedCallback() {
    super.connectedCallback();
    const data = await ShoppingList.fetchShoppingList();
    if (data && data.contents) {
      this.items = data.contents;
      console.log("Fetched shopping list:", this.items);
    }
  }

  render() {
    return html`
      <!-- CATALOGUE -->
      <section class="catalogue-card">
        <div class="catalogue-header"><span>🛒</span><span>Products</span></div>

        <div class="grid">
          ${CATEGORIES.map(
            (cat) => html`
              <div class="tile" @click=${() => this._openPicker(cat)}>
                <span class="icon">${cat.icon}</span>
                <span class="label">${cat.label}</span>
              </div>
            `
          )}

          <div class="tile add-tile" @click=${this._openCustomDialog}>
            <span class="icon">➕</span>
            <span class="label">Add item</span>
          </div>
        </div>
      </section>

      <!-- SHOPPING LIST -->
      <section class="list-card">
        <div class="list-header">
          <span>Shopping List</span>

          <div class="actions">
            <button class="icon-btn" @click=${this._sortAZ} title="Sort A-Z">
              ↕
            </button>

            <button
              class="icon-btn delete-btn"
              @click=${this._deleteChecked}
              ?disabled=${!this.items.some((i) => i.checked)}
              title="Delete checked"
            >
              🗑
            </button>
          </div>
        </div>

        <form @submit=${this._submitItem}>
          <input
            id="newItem"
            placeholder="Add item (e.g. Apples 3 kg)"
            autocomplete="off"
          />
        </form>

        ${this.loading
          ? html`<div class="empty">No Added Items...</div>`
          : html` ${this.items.length
              ? html`<ul>
                  ${this.items.map(
                    (item) => html` <li class=${item.checked ? "checked" : ""}>
                      <input
                        type="checkbox"
                        .checked=${item.checked ?? false}
                        @change=${(e) => this._toggleCheck(e, item)}
                      />
                      <span>${item.content}</span>
                      <button
                        @click=${() => this._deleteItem(item)}
                        title="Delete"
                      >
                        🗑
                      </button>
                    </li>`
                  )}
                </ul>`
              : html`<div class="empty">No items yet</div>`}`}
      </section>
      <dialog id="picker" @click=${this._maybeClose}></dialog>
    `;
  }

  async _submitItem(e) {
    e?.preventDefault();
    const input = this.renderRoot.querySelector("#newItem");
    const raw = input?.value.trim(); // e.g. "Apples 3 kg"
    if (!raw) return;

    const parts = raw.split(/\s+/); // ["Apples","3","kg"]
    const name = parts.shift(); // "Apples"
    const quantity = parts.shift() ?? ""; // "3"  (or '')
    const unit = parts.join(" ") ?? ""; // "kg" (or '')

    /* use 'Other' as default category for free-text */
    await this._quickAdd("Other", name, quantity, unit);

    input.value = "";
  }

  async _quickAdd(category, name, quantity = "", unit = "") {
    const qtyPart = quantity ? ` ${quantity}` : "";
    const unitPart = unit ? ` ${unit}` : "";
    const label = `${category} - ${name}${qtyPart}${unitPart}`.trim();
    await ShoppingList.addItem({ content: label });
    await this._refresh();
  }

  async _deleteItem(item) {
    await ShoppingList.deleteItem({ id: item.id }); // call the API
    await this._refresh(); // re-load list
  }

  async _deleteChecked() {
    const checked = this.items.filter((i) => i.checked);
    if (!checked.length) return;

    await Promise.all(
      checked.map((i) => ShoppingList.deleteItem({ id: i.id }))
    );

    await this._refresh();
  }

  async _toggleCheck(e, item) {
    item.checked = e.target.checked;
    this.requestUpdate();
  }

  _sortAZ() {
    this.items = [...this.items].sort((a, b) =>
      a.content.localeCompare(b.content, "de")
    );
  }

  async _refresh() {
    this.loading = true;
    const data = await ShoppingList.fetchShoppingList();
    this.items = data?.contents ?? [];
    this.loading = false;
  }

  _openPicker(category) {
    const dialog = this.renderRoot.getElementById("picker");

    dialog.innerHTML = `
      <div class="picker-header">
        <h4>${category.label}</h4>
        <button class="close-btn" aria-label="Close">&times;</button>
      </div>
  
      <div class="picker-grid">
  ${category.items
    .map((str) => {
      const [icon, ...words] = str.split(" ");
      const label = words.join(" ");
      return `
      <button class="pick-btn"
              data-cat="${category.label}"
              data-name="${str}">
        <span class="icon">${icon}</span>
        <span class="label">${label}</span>
      </button>
    `;
    })
    .join("")}
</div>
      <form id="qtyForm" class="qty-form">
        <input name="qty"  placeholder="Qty"  size="4">
        <input name="unit" placeholder="Unit" size="6">
      </form>
    `;

    /* the “×” */
    dialog
      .querySelector(".close-btn")
      .addEventListener("click", () => dialog.close());

    dialog.querySelectorAll(".pick-btn").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const { cat, name } = e.currentTarget.dataset;
        const qty = dialog.querySelector("[name=qty]").value.trim();
        const unit = dialog.querySelector("[name=unit]").value.trim();
        this._quickAdd(cat, name, qty, unit);
        dialog.close();
      })
    );

    dialog.showModal();
  }

  _openCustomDialog() {
    const dialog = this.renderRoot.getElementById("picker");

    dialog.innerHTML = `
      <div class="picker-header">
        <h4>Add Item</h4>
        <button class="close-btn" aria-label="Close">&times;</button>
      </div>

      <form id="customForm" class="custom-form">
        <input name="item" placeholder="e.g. Avocado 2 pcs" autofocus />
        <div class="actions">
          <button type="submit" class="primary">Add</button>
        </div>
      </form>
    `;

    dialog
      .querySelector(".close-btn")
      .addEventListener("click", () => dialog.close());

    dialog.querySelector("#customForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = dialog.querySelector("[name=item]").value.trim();
      if (!raw) return;
      const [name, qty = "", unit = ""] = raw.split(/\s+/);
      this._quickAdd("Other", name, qty, unit);
      dialog.close();
    });

    dialog.showModal();
  }
}

customElements.define("shopping-list-widget", ShoppingListWidget);
