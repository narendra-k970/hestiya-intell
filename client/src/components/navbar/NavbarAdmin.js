/* eslint-disable */
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  Text,
  useColorModeValue,
  IconButton,
} from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useContext } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';
import { SidebarContext } from 'contexts/SidebarContext'; // Context import kiya
import { MdMenuOpen, MdMenu } from 'react-icons/md'; // Icons import kiye

export default function AdminNavbar(props) {
  const [scrolled, setScrolled] = useState(false);

  // Sidebar Context se states nikaalein
  const { toggleSidebar, setToggleSidebar } = useContext(SidebarContext);

  useEffect(() => {
    window.addEventListener('scroll', changeNavbar);
    return () => {
      window.removeEventListener('scroll', changeNavbar);
    };
  });

  const { secondary, message, brandText } = props;

  // Colors & Styles
  let mainText = useColorModeValue('navy.700', 'white');
  let secondaryText = useColorModeValue('gray.700', 'white');
  let navbarBg = useColorModeValue(
    'rgba(244, 247, 254, 0.2)',
    'rgba(11,20,55,0.5)',
  );
  let shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    'unset',
  );

  // Sidebar ki width ke hisaab se Navbar ki width adjust karein
  const sidebarWidth = toggleSidebar ? '80px' : '300px';

  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Box
      position="fixed"
      boxShadow={scrolled ? shadow : 'none'}
      bg={navbarBg}
      backdropFilter="blur(20px)"
      borderRadius="16px"
      borderWidth="1.5px"
      borderStyle="solid"
      borderColor="transparent"
      transition="all 0.25s linear"
      alignItems={{ xl: 'center' }}
      display={secondary ? 'block' : 'flex'}
      minH="75px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt="0px"
      pb="8px"
      // Navbar ki right spacing aur width ko dynamic banaya
      right={{ base: '12px', md: '30px' }}
      px={{ sm: '15px', md: '10px' }}
      ps={{ xl: '12px' }}
      pt="8px"
      top={{ base: '12px', md: '16px', lg: '20px' }}
      w={{
        base: 'calc(100vw - 6%)',
        md: 'calc(100vw - 8%)',
        lg: 'calc(100vw - 6%)',
        // XL screens par width sidebar ke gap ke hisaab se calculate hogi
        xl: `calc(100vw - ${sidebarWidth} - 60px)`,
        '2xl': `calc(100vw - ${sidebarWidth} - 75px)`,
      }}
    >
      <Flex
        w="100%"
        flexDirection={{ sm: 'column', md: 'row' }}
        alignItems={{ xl: 'center' }}
      >
        {/* --- TOGGLE BUTTON SECTION --- */}
        <IconButton
          ms="10px"
          me="10px"
          display={{ base: 'none', xl: 'flex' }} // Desktop par toggle dikhega
          icon={toggleSidebar ? <MdMenu /> : <MdMenuOpen />}
          variant="ghost"
          onClick={() => setToggleSidebar(!toggleSidebar)}
          fontSize="24px"
          _hover={{ bg: 'none' }}
          _active={{ bg: 'none' }}
        />

        <Box mb={{ sm: '8px', md: '0px' }}>
          <Breadcrumb>
            <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
              <BreadcrumbLink href="#" color={secondaryText}>
                Pages
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
              <BreadcrumbLink href="#" color={secondaryText}>
                {brandText}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <Link
            color={mainText}
            href="#"
            fontWeight="bold"
            fontSize="34px"
            _hover={{ color: { mainText } }}
          >
            {brandText}
          </Link>
        </Box>

        <Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
          <AdminNavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>
      {secondary ? <Text color="white">{message}</Text> : null}
    </Box>
  );
}

AdminNavbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
