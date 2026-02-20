/* eslint-disable */
import React, { useContext, useMemo } from 'react';
import {
  Box,
  Flex,
  Drawer,
  DrawerBody,
  Icon,
  useColorModeValue,
  DrawerOverlay,
  useDisclosure,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Content from 'components/sidebar/components/Content';
import {
  renderThumb,
  renderTrack,
  renderView,
} from 'components/scrollbar/Scrollbar';
import { Scrollbars } from 'react-custom-scrollbars-2';
import PropTypes from 'prop-types';
import { SidebarContext } from 'contexts/SidebarContext';
import { IoMenuOutline } from 'react-icons/io5';

function Sidebar(props) {
  const { routes } = props;
  const { toggleSidebar } = useContext(SidebarContext);

  // --- ROBUST FILTERING LOGIC ---
  const filteredRoutes = useMemo(() => {
    const userData = localStorage.getItem('user');
    let userRole = 'user';

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        // Role ko hamesha lowercase mein lo mismatch se bachne ke liye
        userRole = (parsedUser.role || 'user').toLowerCase();
      } catch (e) {
        console.error('Sidebar Auth Error:', e);
      }
    }

    return routes.filter((route) => {
      // 1. Auth routes ko kabhi mat dikhao
      if (route.layout === '/auth') return false;

      // 2. Layout Match: User role ke hisaab se sahi prefix dhundo
      const currentLayout = userRole === 'admin' ? '/admin' : '/user';
      const isLayoutMatch = route.layout === currentLayout;

      // 3. Role Check: Kya ye route user ke role ke liye allowed hai?
      const isRoleAllowed = route.roles
        ? route.roles.map((r) => r.toLowerCase()).includes(userRole)
        : true;

      return isLayoutMatch && isRoleAllowed;
    });
  }, [routes]);

  let variantChange = '0.2s linear';
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
    'unset',
  );
  let sidebarBg = useColorModeValue('white', 'navy.800');
  const sidebarWidth = toggleSidebar ? '80px' : '300px';

  return (
    <Box
      display={{ sm: 'none', xl: 'block' }}
      position="fixed"
      minH="100%"
      zIndex="1"
    >
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w={sidebarWidth}
        h="100vh"
        m="0px"
        overflowX="hidden"
        boxShadow={shadow}
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          {/* Filtered routes pass ho rahe hain */}
          <Content routes={filteredRoutes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// Mobile Responsive Version
export function SidebarResponsive(props) {
  const { routes } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  let sidebarBackgroundColor = useColorModeValue('white', 'navy.800');
  let menuColor = useColorModeValue('gray.400', 'white');

  const filteredRoutes = useMemo(() => {
    const userData = localStorage.getItem('user');
    const userRole = userData
      ? JSON.parse(userData).role.toLowerCase()
      : 'user';

    return routes.filter((route) => {
      if (route.layout === '/auth') return false;
      const currentLayout = userRole === 'admin' ? '/admin' : '/user';
      return (
        route.layout === currentLayout &&
        (route.roles ? route.roles.includes(userRole) : true)
      );
    });
  }, [routes]);

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: 'pointer' }}
        />
      </Flex>
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="left"
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" maxW="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton zIndex="3" />
          <DrawerBody maxW="285px" px="0rem" pb="0">
            <Scrollbars
              autoHide
              renderTrackVertical={renderTrack}
              renderThumbVertical={renderThumb}
              renderView={renderView}
            >
              <Content routes={filteredRoutes} />
            </Scrollbars>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

Sidebar.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};

export default Sidebar;
