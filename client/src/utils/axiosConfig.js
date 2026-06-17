import axios from 'axios';

// 1. Base URL setup
const BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : 'https://intelligence.hestiya.com/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Refresh ke baad bhi ye line localStorage se token nikal legi
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. Response Interceptor for auto-logout on Token Expiry
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expire ho gaya hai, user ko logout karo
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Login page par bhej do
      if (!window.location.pathname.includes('/auth/sign-in')) {
        window.location.href = '/auth/sign-in';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
