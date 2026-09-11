import { create } from "zustand";
import { taskApi } from "../services/api";

export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskApi.getAll();
      set({ tasks, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createTask: async (task) => {
    const created = await taskApi.create(task);
    set((state) => ({ tasks: [created, ...state.tasks], error: null }));
    return created;
  },

  updateTask: async (id, task) => {
    const updated = await taskApi.update(id, task);
    set((state) => ({
      tasks: state.tasks.map((item) => item.id === id ? updated : item),
      error: null
    }));
    return updated;
  },

  deleteTask: async (id) => {
    await taskApi.remove(id);
    set((state) => ({
      tasks: state.tasks.filter((item) => item.id !== id),
      error: null
    }));
  }
}));