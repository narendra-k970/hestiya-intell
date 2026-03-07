/* eslint-disable */
import React, { useEffect, useState } from 'react'; // useEffect, useState add kiya
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
  useColorMode,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import routes from 'routes.js';

export default function HeaderLinks(props) {
  const { secondary } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  // --- USER NAME LOGIC ---
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    // LocalStorage se user object nikal rahe hain
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // Agar aapke object mein 'firstName' key hai toh wo set hoga
        if (user.firstName) {
          setUserName(user.firstName);
        } else if (user.name) {
          // Agar sirf 'name' hai toh uska pehla word le lenge
          setUserName(user.name.split(' ')[0]);
        }
      } catch (err) {
        console.error('Error parsing user data', err);
      }
    }
  }, []);
  // -----------------------

  const navbarIcon = useColorModeValue('gray.400', 'white');
  const menuBg = useColorModeValue('white', 'navy.800');
  const shadow = useColorModeValue(
    '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
    '14px 17px 40px 4px rgba(112, 144, 176, 0.06)',
  );

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/auth/sign-in');
    window.location.reload();
  };

  return (
    <Flex
      w={{ sm: '100%', md: 'auto' }}
      alignItems="center"
      flexDirection="row"
      bg={menuBg}
      p="10px"
      borderRadius="30px"
      boxShadow={shadow}
    >
      <SearchBar me="10px" borderRadius="30px" />
      <SidebarResponsive routes={routes} />

      <Flex
        alignItems="center"
        justifyContent="center"
        cursor="pointer"
        ms="10px"
        onClick={toggleColorMode}
      >
        {colorMode === 'light' ? (
          <IoMdMoon color={navbarIcon} width="18px" height="18px" />
        ) : (
          <IoMdSunny color={navbarIcon} width="18px" height="18px" />
        )}
      </Flex>

      <Menu>
        <MenuButton p="0px" ms="15px">
          <Flex
            align="center"
            justify="center"
            bg="#249758"
            color="white"
            borderRadius="50%"
            w="40px"
            h="40px"
            fontWeight="bold"
            fontSize="sm"
          >
            {/* Avatar mein naam ka pehla akshar dikhane ke liye */}
            {userName.charAt(0).toUpperCase()}
          </Flex>
        </MenuButton>
        <MenuList
          boxShadow={shadow}
          p="0px"
          mt="10px"
          borderRadius="20px"
          bg={menuBg}
          border="none"
        >
          <Flex w="100%" mb="0px">
            <Text
              ps="20px"
              pt="16px"
              pb="10px"
              w="100%"
              borderBottom="1px solid"
              borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')}
              fontSize="sm"
              fontWeight="700"
              color={useColorModeValue('navy.700', 'white')}
            >
              {/* Yahan ab dynamically name dikhega */}
              👋&nbsp; Hey, {userName}
            </Text>
          </Flex>
          <Flex flexDirection="column" p="10px">
            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              borderRadius="8px"
              px="14px"
              onClick={() => navigate('/user/profile')}
            >
              <Text fontSize="sm">Profile Settings</Text>
            </MenuItem>

            <MenuItem
              _hover={{ bg: 'none' }}
              _focus={{ bg: 'none' }}
              color="red.400"
              borderRadius="8px"
              px="14px"
              onClick={handleLogout}
            >
              <Text fontSize="sm" fontWeight="bold">
                Log Out
              </Text>
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu>
    </Flex>
  );
}
