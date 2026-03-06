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

  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  const userRole = (user?.role || 'user').toLowerCase();

  const sidebarWidth = toggleSidebar ? '80px' : '285px';

  useEffect(() => {
    if (!userData) {
      navigate('/auth/sign-in');
      return;
    }
  }, [navigate, userData]);

  // --- 2. Navbar Brand Text (Updated to support groups) ---
  const getActiveRoute = (routesList) => {
    for (let i = 0; i < routesList.length; i++) {
      if (routesList[i].isGroup) {
        const found = getActiveRoute(routesList[i].items);
        if (found !== 'Dashboard') return found;
      } else {
        if (
          location.pathname.includes(routesList[i].layout + routesList[i].path)
        ) {
          return routesList[i].name;
        }
      }
    }
    return 'Dashboard';
  };

  // --- 3. Routes Generate Function (RECURSIVE FIX) ---
  const getRoutes = (routesList) => {
    let allRoutes = [];

    routesList.forEach((route, key) => {
      // Case A: Agar ye Group hai (I-Recs), toh iske andar ke items ko nikaalo
      if (route.isGroup && route.items) {
        route.items.forEach((item, index) => {
          if (
            item.roles &&
            !item.roles.map((r) => r.toLowerCase()).includes(userRole)
          )
            return;

          allRoutes.push(
            <Route
              path={`${item.path}`}
              element={item.component}
              key={`${key}-${index}`}
            />,
          );
        });
      }
      // Case B: Agar ye normal route hai (Home, Carbon Credits)
      else if (route.layout === '/admin' || route.layout === '/user') {
        if (
          route.roles &&
          !route.roles.map((r) => r.toLowerCase()).includes(userRole)
        )
          return;

        allRoutes.push(
          <Route path={`${route.path}`} element={route.component} key={key} />,
        );
      }
    });

    return allRoutes;
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
              {getRoutes(routes)}
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
