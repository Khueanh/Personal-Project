# Starter
This project contains a modular dashboard built with Lit, showcasing a **Shopping List** widget developed by **Khue Anh**.

## Widget: Shopping List – Developed by Le Khue Anh Nguyen

### Overview
The Shopping List widget enables users to create and manage personal shopping lists. It supports core functionalities such as:
- Displaying current shopping items
- Adding custom items (with name, quantity, unit)
- Removing individual or multiple selected items
- Optional: Marking items as “bought” for better list organization

The UI reuses `.list-card` styling from the dashboard for consistency, and all list states persist through `localStorage`.

### Development Plan
1. **Understand requirements and API endpoint** – Focused on `/lists`.
2. **Feature planning**
   - Show existing items from the server
   - Allow user input for new items
   - Add/delete items, optionally mark as bought
3. **HTML Structure** – Defined a clear layout using semantic tags and components.
4. **JS & CSS Planning** – Structured component logic for readability and maintainability.
5. **Implementation**
   - Used LitElement to create a responsive widget
   - Integrated with server API for CRUD operations
   - Styled the widget for consistency with overall dashboard
6. **Testing and Debugging**
   - Fixed issues with adding/removing items
   - Ensured clean UI/UX for interactions
7. **Refinement**
   - Polished UI with spacing and hover states
   - Handled empty list gracefully
   - Committed changes regularly
---

## Installation

This project uses **Lit via CDN** in the HTML file and **Node.js** only for running a local server.

```bash
npm install
