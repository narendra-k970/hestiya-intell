import axios from 'axios';

// 1. Base URL setup
const BASE_URL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Request Interceptor: Har request se pehle token check karega
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Automatic Authorization header add kar dega
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. Response Interceptor: Error handling ko centralize karne ke liye
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Agar 401 (Unauthorized) aaye toh user ko login par bhej sakte ho
    if (error.response && error.response.status === 401) {
      console.error('Session expired. Please login again.');
      // localStorage.clear();
      // window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
