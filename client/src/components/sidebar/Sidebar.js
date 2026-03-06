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
  Button,
  Text,
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
import { MdHeadsetMic } from 'react-icons/md';

const BRAND_GREEN = '#249758';

function Sidebar(props) {
  const { routes } = props;
  const { toggleSidebar } = useContext(SidebarContext);

  const filteredRoutes = useMemo(() => {
    const userData = localStorage.getItem('user');
    const userRole = userData
      ? JSON.parse(userData).role.toLowerCase()
      : 'user';
    return routes.filter((route) => {
      if (route.layout === '/auth') return false;
      if (route.isGroup) return true;
      const currentLayout = userRole === 'admin' ? '/admin' : '/user';
      return route.layout === currentLayout;
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
        boxShadow={shadow}
        display="flex"
        flexDirection="column"
      >
        {/* Scrollable Content */}
        <Box flex="1" overflow="hidden">
          <Scrollbars
            autoHide
            renderTrackVertical={renderTrack}
            renderThumbVertical={renderThumb}
            renderView={renderView}
          >
            <Content routes={filteredRoutes} />
          </Scrollbars>
        </Box>

        {/* Fixed Bottom Button */}
        <Box
          p="5px 20px"
          borderTop="1px solid"
          borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}
        >
          <Button
            variant="solid"
            bg={BRAND_GREEN}
            color="white"
            w="100%"
            h="46px"
            borderRadius="12px"
            _hover={{ bg: '#1e7d48' }}
            leftIcon={!toggleSidebar ? <Icon as={MdHeadsetMic} /> : null}
            onClick={() => window.open('#', '_blank')}
          >
            {!toggleSidebar ? (
              <Text fontSize="sm" fontWeight="700">
                Talk To An Advisor
              </Text>
            ) : (
              <Icon as={MdHeadsetMic} boxSize="20px" />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

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
      const isRoleAllowed = route.roles ? route.roles.includes(userRole) : true;
      if (route.isGroup && route.items) {
        route.items = route.items.filter((sub) =>
          sub.roles ? sub.roles.includes(userRole) : true,
        );
        return route.items.length > 0;
      }
      return isRoleAllowed;
    });
  }, [routes]);

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          w="20px"
          h="20px"
          me="10px"
          cursor="pointer"
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
          <DrawerBody
            px="0rem"
            pb="0"
            display="flex"
            flexDirection="column"
            h="100vh"
          >
            <Box flex="1" overflow="hidden">
              <Scrollbars
                autoHide
                renderTrackVertical={renderTrack}
                renderThumbVertical={renderThumb}
                renderView={renderView}
              >
                <Content routes={filteredRoutes} />
              </Scrollbars>
            </Box>
            <Box p="20px">
              <Button
                bg={BRAND_GREEN}
                color="white"
                w="100%"
                borderRadius="12px"
                leftIcon={<Icon as={MdHeadsetMic} />}
              >
                Talk To An Advisor
              </Button>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}

Sidebar.propTypes = { routes: PropTypes.arrayOf(PropTypes.object) };
export default Sidebar;
