/* eslint-disable */
import React, { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { SidebarContext } from 'contexts/SidebarContext';

export function SidebarLinks(props) {
  let location = useLocation();
  let activeColor = useColorModeValue('gray.700', 'white');
  let inactiveColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.600',
  );
  let activeIcon = useColorModeValue('brand.500', 'white');
  let brandColor = '#249758';

  const { routes } = props;
  const { toggleSidebar } = useContext(SidebarContext);

  const userData = localStorage.getItem('user');
  let userRole = (userData ? JSON.parse(userData).role : 'user').toLowerCase();

  const activeRoute = (routeName) =>
    location.pathname.includes(routeName.toLowerCase());

  // --- Normal Link Render (Home, Carbon, etc.) ---
  const renderSingleLink = (route, index) => (
    <NavLink key={index} to={route.layout + route.path}>
      <Box>
        <HStack
          spacing={activeRoute(route.path) ? '22px' : '26px'}
          py="5px"
          ps="10px"
        >
          <Flex w="100%" alignItems="center">
            <Box
              color={activeRoute(route.path) ? activeIcon : inactiveColor}
              me={toggleSidebar ? '0px' : '18px'}
            >
              {route.icon}
            </Box>
            <Text
              display={toggleSidebar ? 'none' : 'block'}
              me="auto"
              color={activeRoute(route.path) ? activeColor : inactiveColor}
              fontWeight={activeRoute(route.path) ? 'bold' : '500'}
            >
              {route.name}
            </Text>
          </Flex>
          <Box
            h="36px"
            w="4px"
            bg={activeRoute(route.path) ? brandColor : 'transparent'}
            borderRadius="5px"
          />
        </HStack>
      </Box>
    </NavLink>
  );

  const createLinks = (routesList) => {
    return routesList.map((route, index) => {
      // Role Check logic
      const isRoleAllowed = route.roles
        ? route.roles.map((r) => r.toLowerCase()).includes(userRole)
        : true;
      if (!isRoleAllowed) return null;

      // CASE 1: AGAR GROUP HAI (I-Recs)
      if (route.isGroup) {
        return (
          <Accordion allowToggle key={index} variant="unstyled" w="100%">
            <AccordionItem border="none">
              <AccordionButton
                py="12px"
                ps="10px"
                _hover={{ bg: 'none' }}
                _focus={{ boxShadow: 'none' }}
              >
                <Flex w="100%" alignItems="center">
                  <Box
                    color={inactiveColor}
                    me={toggleSidebar ? '0px' : '18px'}
                  >
                    {route.icon}
                  </Box>
                  {!toggleSidebar && (
                    <>
                      <Text color={inactiveColor} fontWeight="500" me="auto">
                        {route.name}
                      </Text>
                      <AccordionIcon color={inactiveColor} />
                    </>
                  )}
                </Flex>
              </AccordionButton>
              <AccordionPanel ps={toggleSidebar ? '0px' : '30px'} pb="10px">
                {/* I-Recs ke andar wale items */}
                {createLinks(route.items)}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        );
      }

      // CASE 2: AGAR NORMAL ROUTE HAI (Jaise Home ya Carbon Credits)
      return renderSingleLink(route, index);
    });
  };

  return <>{createLinks(routes)}</>;
}

export default SidebarLinks;
