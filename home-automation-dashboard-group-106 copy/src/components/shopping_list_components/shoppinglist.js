import {
  LitElement,
  html,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";
import { getUser } from "../../auth.js";

const user = getUser();
let ShoppingList;

if (!user || !user.token) {
  console.warn("User not logged in — skipping ShoppingList setup.");
  ShoppingList = {
    fetchShoppingList: async () => null,
    addItem: async () => null,
    deleteItem: async () => null,
    _quickAdd: async () => null,
    _toast: () => {},
  };
} else {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${user.token}`,
  };
  const BASE = "https://comp2110-portal.stevecassidy.net/lists";
  const LIST_ID = 1;
  const endpoints = `${BASE}/${LIST_ID}`;

  ShoppingList = {
    async fetchShoppingList() {
      try {
        const res = await fetch(endpoints, { headers });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error("Fetch failed:", err);
        return null;
      }
    },

    async addItem(item) {
      try {
        const res = await fetch(endpoints, {
          method: "POST",
          headers,
          body: JSON.stringify(item),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error("Add item failed:", err);
        return null;
      }
    },

    async deleteItem(item) {
      try {
        const url = `${endpoints}/${item.id}`;
        const res = await fetch(url, {
          method: "DELETE",
          headers,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) {
        console.error("Delete item failed:", err);
        return null;
      }
    },

    async _quickAdd(category, name, qty = "", unit = "") {
      try {
        const label = `${category} – ${name}${qty && ` ${qty}`}${
          unit && ` ${unit}`
        }`.trim();
        await ShoppingList.addItem({ content: label });
        await this._refresh?.();
      } catch (err) {
        console.error("Add failed", err);
        this._toast?.("Could not add item – check your connection");
      }
    },

    _toast(msg) {
      const el = Object.assign(document.createElement("div"), {
        textContent: msg,
      });
      el.className = "toast";
      document.body.append(el); // changed from this.renderRoot
      setTimeout(() => el.remove(), 4000);
    },
  };
}

export default ShoppingList;
