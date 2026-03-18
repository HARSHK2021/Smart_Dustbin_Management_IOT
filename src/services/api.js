const API_URL = 'http://localhost:5000/api';

export const dustbinAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/dustbins`);
    return response.json();
  },

  add: async (data) => {
    const response = await fetch(`${API_URL}/dustbins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/dustbins/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

export const complaintAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/complaints`);
    return response.json();
  },

  create: async (data) => {
    const response = await fetch(`${API_URL}/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  },

  updateStatus: async (id, status) => {
    const response = await fetch(`${API_URL}/complaints/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return response.json();
  }
};

export const messageAPI = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/messages`);
    return response.json();
  }
};

export const authAPI = {
  login: async (username, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  }
};
