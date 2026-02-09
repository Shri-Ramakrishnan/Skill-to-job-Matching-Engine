import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

const AUTH_FAILURE_MESSAGES = new Set(['invalid token', 'token expired', 'not authorized']);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = String(error?.response?.data?.message || '')
      .trim()
      .toLowerCase()
      .replace(/[.!]$/, '');

    if (status === 401 && AUTH_FAILURE_MESSAGES.has(message)) {
      window.dispatchEvent(new Event('forceLogout'));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
