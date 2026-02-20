/* eslint-disable */
import { Portal, Box, useDisclosure } from '@chakra-ui/react';
import Footer from 'components/footer/FooterAdmin.js';
import Navbar from 'components/navbar/NavbarAdmin.js';
import Sidebar from 'components/sidebar/Sidebar.js';
import { SidebarContext } from 'contexts/SidebarContext';
import React, { useState, useEffect } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import routes from 'routes.js';

export default function Dashboard(props) {
  const { ...rest } = props;
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // User details nikaalte hain state sync ke liye
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userRole = user?.role || 'user';

  const sidebarWidth = toggleSidebar ? '80px' : '285px';

  // 1. Security & Redirection Check
  useEffect(() => {
    if (!userData) {
      navigate('/auth/sign-in');
      return;
    }

    // Current route ko find karo taaki permission check ho sake
    const currentRoute = routes.find((route) =>
      location.pathname.includes(route.layout + route.path),
    );

    // Agar route mil gaya aur roles define hain, toh check karo permission hai ya nahi
    if (currentRoute && currentRoute.roles) {
      if (!currentRoute.roles.includes(userRole)) {
        // Galat role hai toh sahi dashboard pe bhagao
        const defaultPath =
          userRole === 'admin' ? '/admin/default' : '/user/default';
        navigate(defaultPath);
      }
    }
  }, [location, navigate, userData, userRole]);

  // 2. Navbar Brand Text dynamic
  const getActiveRoute = (routes) => {
    let activeRoute = 'Dashboard';
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + routes[i].path) !== -1
      ) {
        return routes[i].name;
      }
    }
    return activeRoute;
  };

  // 3. Routes Generate karne wala function (FIXED HERE)
  const getRoutes = (routes) => {
    return routes.map((route, key) => {
      // Ab ye /admin aur /user dono layout ko render karega
      if (route.layout === '/admin' || route.layout === '/user') {
        // Agar route ke liye role restriction hai aur user ke paas permission nahi hai
        if (route.roles && !route.roles.includes(userRole)) return null;

        return (
          <Route path={`${route.path}`} element={route.component} key={key} />
        );
      }
      return null;
    });
  };

  const { onOpen } = useDisclosure();

  return (
    <Box>
      <SidebarContext.Provider value={{ toggleSidebar, setToggleSidebar }}>
        <Sidebar
          routes={routes}
          display="none"
          mini={toggleSidebar}
          {...rest}
        />

        <Box
          float="right"
          minHeight="100vh"
          height="100%"
          overflow="auto"
          position="relative"
          maxHeight="100%"
          w={{ base: '100%', xl: `calc( 100% - ${sidebarWidth} )` }}
          maxWidth={{ base: '100%', xl: `calc( 100% - ${sidebarWidth} )` }}
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        >
          <Portal>
            <Navbar
              onOpen={onOpen}
              logoText={'Hestiya Dashboard'}
              brandText={getActiveRoute(routes)}
              fixed={fixed}
              {...rest}
            />
          </Portal>

          <Box
            mx="auto"
            p={{ base: '20px', md: '30px' }}
            minH="100vh"
            pt="50px"
          >
            <Routes>
              {/* Dynamic Routes Load honge */}
              {getRoutes(routes)}

              {/* Default redirect agar path match na kare */}
              <Route
                path="/"
                element={
                  <Navigate
                    to={
                      userRole === 'admin' ? '/admin/default' : '/user/default'
                    }
                    replace
                  />
                }
              />
            </Routes>
          </Box>

          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
