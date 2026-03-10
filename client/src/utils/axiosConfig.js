import axios from 'axios';

// 1. Base URL setup
const BASE_URL = 'https://intelligence.hestiya.com/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Session expired. Please login again.');
      // localStorage.clear();
      // window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
