import { create } from "zustand";

const STORAGE_KEY = "taskmanager_session";

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export const useAuthStore = create((set) => ({
  user: readSession(),

  setSession: (user) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  }
}));