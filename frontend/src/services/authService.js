import { api, storageKeys } from './api';

function persistAuth(data) {
  const token = data?.token || data?.jwt || data?.accessToken || null;
  if (token) {
    window.localStorage.setItem(storageKeys.token, token);
  }

  const session = {
    user: data?.user || null,
    authenticatedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(storageKeys.session, JSON.stringify(session));
  return session;
}

export const authService = {
  async login(payload) {
    const { data } = await api.post('/auth/login', payload);
    persistAuth(data);
    return data;
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    persistAuth(data);
    return data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      window.localStorage.removeItem(storageKeys.token);
      window.localStorage.removeItem(storageKeys.session);
    }
  },

  async getCurrentUser() {
    const candidates = ['/auth/me', '/auth/user', '/auth/profile'];
    for (const endpoint of candidates) {
      try {
        const { data } = await api.get(endpoint);
        if (data?.user) {
          persistAuth(data);
          return data.user;
        }
      } catch (error) {
        if (error.response?.status && error.response.status < 500) {
          continue;
        }
      }
    }

    const session = window.localStorage.getItem(storageKeys.session);
    return session ? JSON.parse(session).user : null;
  },
};
