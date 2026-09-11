import { create } from "zustand";
import { projectApi } from "../services/api";

export const useProjectStore = create((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await projectApi.getAll();
      set({ projects, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  createProject: async (project) => {
    const created = await projectApi.create(project);
    set((state) => ({
      projects: [...state.projects, created].sort((a, b) =>
        a.name.localeCompare(b.name, "ru")
      ),
      error: null
    }));
    return created;
  },

  updateProject: async (id, project) => {
    const updated = await projectApi.update(id, project);
    set((state) => ({
      projects: state.projects
        .map((item) => item.id === id ? updated : item)
        .sort((a, b) => a.name.localeCompare(b.name, "ru")),
      error: null
    }));
    return updated;
  },

  deleteProject: async (id) => {
    await projectApi.remove(id);
    set((state) => ({
      projects: state.projects.filter((item) => item.id !== id),
      error: null
    }));
  }
}));