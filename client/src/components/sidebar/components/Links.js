/* eslint-disable */
import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { SidebarContext } from 'contexts/SidebarContext';

export function SidebarLinks(props) {
  let location = useLocation();
  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600',
  );
  let activeIcon = useColorModeValue('brand.500', 'white');
  let textColor = useColorModeValue('secondaryGray.500', 'white');
  let brandColor = useColorModeValue('brand.500', 'brand.400');

  const { routes } = props;

  // Sidebar ki toggle state nikaalein
  const { toggleSidebar } = useContext(SidebarContext);

  // --- ROLE BASED LOGIC ---
  const userData = localStorage.getItem('user');
  let userRole = 'user';
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      userRole = parsedUser.role || 'user';
    } catch (e) {
      console.error('Error parsing user role', e);
    }
  }

  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  const createLinks = (routes) => {
    return routes
      .filter((route) => {
        if (route.roles) {
          return route.roles.includes(userRole);
        }
        return true;
      })
      .map((route, index) => {
        if (route.layout === '/auth') {
          return null;
        }

        if (route.category) {
          return (
            <React.Fragment key={index}>
              {!toggleSidebar && (
                <Text
                  fontSize={'md'}
                  color={activeColor}
                  fontWeight="bold"
                  mx="auto"
                  ps={{ sm: '10px', xl: '16px' }}
                  pt="18px"
                  pb="12px"
                >
                  {route.name}
                </Text>
              )}
              {createLinks(route.items)}
            </React.Fragment>
          );
        }

        // --- FIXED LINE BELOW: Added /user layout check ---
        else if (
          route.layout === '/admin' ||
          route.layout === '/user' ||
          route.layout === '/rtl'
        ) {
          return (
            <NavLink key={index} to={route.layout + route.path}>
              {route.icon ? (
                <Box>
                  <HStack
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                    }
                    py="5px"
                    ps="10px"
                  >
                    <Flex w="100%" alignItems="center" justifyContent="center">
                      <Box
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeIcon
                            : textColor
                        }
                        me={toggleSidebar ? '0px' : '18px'}
                      >
                        {route.icon}
                      </Box>

                      <Text
                        display={toggleSidebar ? 'none' : 'block'}
                        me="auto"
                        color={
                          activeRoute(route.path.toLowerCase())
                            ? activeColor
                            : textColor
                        }
                        fontWeight={
                          activeRoute(route.path.toLowerCase())
                            ? 'bold'
                            : 'normal'
                        }
                      >
                        {route.name}
                      </Text>
                    </Flex>

                    <Box
                      h="36px"
                      w="4px"
                      bg={
                        activeRoute(route.path.toLowerCase())
                          ? brandColor
                          : 'transparent'
                      }
                      borderRadius="5px"
                    />
                  </HStack>
                </Box>
              ) : (
                <Box>
                  <HStack
                    spacing={
                      activeRoute(route.path.toLowerCase()) ? '22px' : '26px'
                    }
                    py="5px"
                    ps="10px"
                  >
                    <Text
                      display={toggleSidebar ? 'none' : 'block'}
                      me="auto"
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : inactiveColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? 'bold'
                          : 'normal'
                      }
                    >
                      {route.name}
                    </Text>
                    <Box h="36px" w="4px" bg="brand.400" borderRadius="5px" />
                  </HStack>
                </Box>
              )}
            </NavLink>
          );
        }
      });
  };

  return createLinks(routes);
}

export default SidebarLinks;
