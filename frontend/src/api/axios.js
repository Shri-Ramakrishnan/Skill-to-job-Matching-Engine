import axios from 'axios';

// Decide base URL safely
const baseURL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5000/api'
    : import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 15000, // prevents hanging requests (Render cold starts)
});

const AUTH_FAILURE_MESSAGES = new Set([
  'invalid token',
  'token expired',
  'not authorized',
]);

// Attach JWT to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle auth failures globally
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
