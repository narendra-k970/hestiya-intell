import axios from 'axios';

// 1. Base URL setup
const BASE_URL = 'https://intelligence.hestiya.com/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Session expired. Redirecting to login...');

      // 1. Storage saaf karein taaki purana token expire hone par loop na bane
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // 2. Redirect to login
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
