const API_URL = "https://taskmanager-api-fdnu.onrender.com";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    let message = `Ошибка API: ${response.status}`;
    try {
      const data = await response.json();
      message = data.message || message;
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const authApi = {
  findUser: async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await request(
      `/users?email=${encodeURIComponent(normalizedEmail)}`
    );

    const user = users[0];

    if (!user) {
      return null;
    }

    if (user.password !== password) {
      return null;
    }

    return user;
  },

  findByEmail: async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await request(
      `/users?email=${encodeURIComponent(normalizedEmail)}`
    );
    return users[0] || null;
  },
  register: (user) =>
    request("/users", {
      method: "POST",
      body: JSON.stringify(user)
    })
};

export const taskApi = {
  getAll: () => request("/tasks?_sort=-createdAt"),
  getById: (id) => request(`/tasks/${id}`),
  create: (task) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(task)
    }),
  update: (id, task) =>
    request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(task)
    }),
  remove: (id) => request(`/tasks/${id}`, { method: "DELETE" })
};

export const projectApi = {
  getAll: () => request("/projects?_sort=name"),
  create: (project) =>
    request("/projects", {
      method: "POST",
      body: JSON.stringify(project)
    }),
  update: (id, project) =>
    request(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project)
    }),
  remove: (id) => request(`/projects/${id}`, { method: "DELETE" })
};