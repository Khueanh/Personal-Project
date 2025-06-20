# COMP2110 Portal - Starter

This is the starter repository for the COMP2110 Portal front end assignment 2025. You are
expected to customise this README file to describe your own project.  You should update this
file with some documentation on your group's implementation.

## Team Member and Norminated Widget
Taehee Kim – Weather Widget
Le Khue Anh Nguyen - Shopping List
Hing Shan Anna Chow - TODO List
Le Hoang Nguyen Nguyen – Device Controller Widget

## Basic Plan 

### TODO List (Hing Shan Anna Chow)
1.  Understand task and API endpoint
2.  Plan and decide TODO List feature:
-   Display current task 
-   Add box to mark as done
-   Add/Delete Task feature? 
3.  Write html code (after discussing the overall design of the dashboard)
4.  Plan JS + CSS code
5.  Write JS + CSS Code
6.  Ask for comment and review

### Weather widget (Taehee Kim)
- Understand Weather API
- Display weather information with the outside temperature from the sensor
- Make it looks good by using CSS
- Review the codes and make them better
- Commit regularly!!

### Shopping List (Khue Anh)
1. Understand task and `/lists` API endpoint  
2. Plan features for Shopping List:  
   - Display current shopping list items  
   - Add item to the list  
   - Remove item from the list  
   - Optional: Mark items as bought  
3. Write HTML structure for widget layout  
4. Plan JS + CSS logic and styling  
5. Implement JS to interact with API and update UI  
6. Style the widget with CSS to match dashboard theme  
7. Test functionality and fix bugs  
8. Ask for feedback and refine code from team m
9. Commit regularly with clear messages !!!

### Device Controller Widget (Le Hoang Nguyen Nguyen)
1. Understand the task and API endpoints.
2. Plan and decide Device Controller Features:
   - Show ON/OFF status.
   - Allow a toggle control to turn the device On or Off.
   - Choose a device type.
3. HTML Structure Planning.
4. JS Logic Planning & CSS Styling Planning.
5. Implement HTML + JS + CSS.
6. Collaborate and Get feedback (Adjust code quality or design if needed based on feedback.)
7. Commit regularly.

## Installation

The project has no external dependencies, it uses Lit via a CDN load directly into
the HTML page.   Node is used only to run a local HTTP server.

```bash
npm install
```

Will install the `http-server` node module.

```bash
npm start
```

will run the server.

## Assignment

Details about the assignment and back-end server are provided in [this document](Assignment.md).

## Project Overview
This dashboard displays widgets for weather, clock, shopping list, TO-DO list and Heater Controller. It is designed using Lit components and aims to be modular and extensible.

## Setup
1. Clone the repository
2. Run a local HTTP server (e.g., using Live Server in VSCode)
3. Open `index.html` in a browser

## Folder Structure
- `/components`: All Lit-based custom components
- `/src`: Images and supporting assets
- `dashboard.js`: Main layout and logic

## Contribution
Feel free to fork and submit pull requests. Please follow the existing component structure.

## Notes
Make sure your browser allows geolocation for accurate weather display.

# AI USAGE

### Taehee Kim (Weather Widget)
Token handling and login/logout event logic were developed with help from ChatGPT. I used it to understand how to store tokens and trigger events.
During development, I experimented with two approaches for handling the authentication token:
- Direct Token Storage: Storing only the token string in localStorage under the key authToken, and accessing it via localStorage.getItem('authToken').

- Structured User Object: Storing the entire user object (including the token) in localStorage using JSON.stringify(), and retrieving it using a helper function getUser() which parses the stored object.

While the first method was simpler, it lacked flexibility when additional user information (like the username) was needed elsewhere in the app. Therefore, I chose the second method, which allowed me to store both the token and user-related data in a structured format. 
Generative AI was used to help me understand how to manage and retrieve authentication tokens more effectively. It helped clarify the differences between token storage approaches. I still implemented and tested the code myself, and the AI's role was primarily advisory. This assistance improved my understanding of authentication flows and local storage usage in web apps.

### Khue Anh (Shopping List)
- When first starting the project, I struggled with the Token and API, so I asked ChatGPT for help, so I can understand what was the bug, and find a way to fix it.
- Design: I did ask for some advice for the design as well as fix a bit because some of the items or name of categories were clashed with each other. 
- Functions: There were some errors while I'm creating "adding items" and "delelte single item/ all items" function, there was no return so I asked to fix the bug. 
- AI help me to understand my lack of knowlegde, what were my mistakes and why I got those errors.  I fully understand what I wrote in my widget so for me it's just a tool to help me study. I used AI not for copying and paste, for me it has broaden my knowlege and let me know what my knowlegde is lack of.

### Le Hoang Nguyen Nguyen (Controller Device)
Working on LitElement components has always been a challenge for me, so I asked AI to clarify concepts and organising my code. Help me understand how to fetch the outside temperature from API, also manage the On/Off button using a toggle switch, and allow user to set a desired temperature using a rage slider, it provided clear explanations and insightful.
When it came to styling, AI suggested me using CSS gradients. It also provided the CSS @keyframes foe the fire icon animation.
There was a moment I felt stuck since the slider appeared all white, AI helps me to fix the track and thumb. Additionally, I wanted the slider was locked when the heater was turned off. AI did help me by using 'disabled' attribute on the slider input
Essentially, I used AI as a guide, providing explanations and solutions to help me write more organised and maintainable code. 

### Hing Shan Anna Chow (Todo List)
I relied on ChatGPT to learn key API concepts, like tasks schema and to figure out how to fetch and integrate data into my app.

ChatGPT helped me build the basic code framework: the widget title, task list section, “add task” form (including the date picker), and submit button. It guided me through implementing the completion checkbox, sorting tasks by date, and routing each item to either the “To Do” or “Completed” list. Whenever I ran into CSS challenges that Google couldn’t solve, ChatGPT provided styling examples and best practices. I also used ChatGPT as a step-by-step debugger. Even when its initial suggestions didn’t work, its guided prompts taught me how to isolate errors, interpret console messages, and validate each change. That process strengthened my logical sequencing and problem-solving skills.

ChatGPT acted as a tutor and coding coach in this assignment. It sped up app development and deepened my understanding of API integration, code structure, and syntax. I discovered that AI is a tool, not a replacement for creativity and critical thinking and its suggestions often needs my own adjustments to fit the project’s specific needs.

# TASK FEATURE
<<<<<<< HEAD

## TODOList

TODOList.js
* Manages all API communication for the to-do app.  
* Builds request headers using the authenticated user’s token.  
* Provides three main functions:  
* fetchTasks() – retrieves a list of tasks from the server.  
* addTask(task) – sends a new task to the server.  
* deleteTask(id) – deletes a specific task by ID.  
* Handles and logs HTTP errors.  
* Returns parsed JSON responses for integration with the frontend.

 TODOList-widget.js
* Defines a custom web component using LitElement: \<todo-list-widget\>.  
* Declares reactive properties: tasks, loading, completedTasks, newTask, and newDue.  
* On load:  
  * Listens for login/logout events.  
  * Fetches tasks from the server.  
  * Seeds sample tasks if the list is empty.  
* Implements functionality to:  
  * Add new tasks with optional due dates.  
  * Toggle task completion status.  
  * Delete tasks from the list.  
  * Sort tasks by due date.  
  * Format due dates and flag tasks due soon.  
* render() dynamically builds the UI:  
  * Displays "To Do" and "Completed" sections.  
  * Integrates task actions with functions from TODOList.js.  
  * Includes form inputs, checkboxes, and delete buttons.
=======
### Shopping List (Khue Anh)
This feature allows users to create, check off, sort, manage what users want to buy and delete personal shopping lists. Tasks are stored in localStorage and automatically update as you interact with the list.
Users are free to add any items that are not available in the products's list by clicking the "+" button then they can manually type products name, quantity, unit.
They can also delete all the items in one time after select 1 or more items in the list. 
The UI leverages existing .list-card styles for consistent look-and-feel alongside the shopping list.
>>>>>>> fa47f34 (Shopping List feature)
