// 📁 src/components/TODOList.js

import { getUser } from '../auth.js';

const baseUrl = 'https://comp2110-portal.stevecassidy.net/tasks';

// Helper to build headers (including the Bearer token)
function getHeaders() {
  const user = getUser();
  console.log('Using token:', user?.token);
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${user?.token || ''}`,
  };
}

const TODOList = {
  /**
   * Fetch a page of tasks.
   * By default, start=0, count=10.
   */
  async fetchTasks() {
    const url = new URL(baseUrl);
    url.searchParams.set('start', 0);
    url.searchParams.set('count', 10);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} fetching tasks`);
      }
      const data = await res.json();
      console.log('Fetched TODO tasks:', data);
      return data;
    } catch (err) {
      console.error('Fetch tasks failed:', err);
      return null;
    }
  },

  /**
   * Add a new task.
   * Expects a full task object, e.g.:
   *   { summary, text, priority, category, due }
   */
  async addTask(task) {
    try {
      const res = await fetch(baseUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(task),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} adding task`);
      }
      const data = await res.json();
      console.log('Added task:', data);
      return data;
    } catch (err) {
      console.error('Add task failed:', err);
      return null;
    }
  },

  /**
   * Delete a task by ID.
   */
  async deleteTask(id) {
    const url = `${baseUrl}/${id}`;
    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} deleting task`);
      }
      const data = await res.json();
      console.log('Deleted task:', data);
      return data;
    } catch (err) {
      console.error('Delete task failed:', err);
      return null;
    }
  },
};

export default TODOList;
