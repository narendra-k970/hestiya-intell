import './assets/css/App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';
import { ChakraProvider } from '@chakra-ui/react';
import initialTheme from './theme/theme';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const location = useLocation();

  const [auth, setAuth] = useState({
    isAuthenticated: localStorage.getItem('token') !== null,
    role: localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')).role
      : null,
  });

  // Jab bhi location badle, storage se auth state sync karo
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    let userRole = null;

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        userRole = user.role;
      } catch (e) {
        console.error('User data parsing error', e);
      }
    }

    setAuth({
      isAuthenticated: token !== null,
      role: userRole,
    });
  }, [location]);

  const { isAuthenticated, role } = auth;

  return (
    <ChakraProvider theme={currentTheme}>
      <Routes>
        {/* 1. Auth Path: Agar login hai toh seedha uske default page par bhejo */}
        <Route
          path="auth/*"
          element={
            isAuthenticated ? (
              role === 'admin' ? (
                <Navigate to="/admin/default" replace />
              ) : (
                <Navigate to="/user/default" replace />
              )
            ) : (
              <AuthLayout />
            )
          }
        />

        {/* 2. Admin Path */}
        <Route
          path="admin/*"
          element={
            isAuthenticated && role === 'admin' ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />

        {/* 3. User Path: Layout load karega lekin layout prop ke sath (optional) */}
        <Route
          path="user/*"
          element={
            isAuthenticated && role === 'user' ? (
              <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />

        {/* 4. Root Path: Sabse pehle yahan check hoga */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === 'admin' ? (
                <Navigate to="/admin/default" replace />
              ) : (
                <Navigate to="/user/default" replace />
              )
            ) : (
              <Navigate to="/auth/sign-in" replace />
            )
          }
        />

        {/* 5. Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ChakraProvider>
  );
}
