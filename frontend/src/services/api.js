import axios from 'axios';

const storageKeys = {
  token: 'moodsync_token',
  session: 'moodsync_session',
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem(storageKeys.token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem(storageKeys.token);
      window.localStorage.removeItem(storageKeys.session);
    }
    return Promise.reject(error);
  },
);

export { storageKeys };
