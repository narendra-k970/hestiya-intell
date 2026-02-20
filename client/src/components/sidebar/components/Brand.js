/* eslint-disable */
import React, { useContext } from 'react';
import { Flex, useColorModeValue, Image, Text, Box } from '@chakra-ui/react';
import { HSeparator } from 'components/separator/Separator';
import { SidebarContext } from 'contexts/SidebarContext';

export function SidebarBrand() {
  let logoColor = useColorModeValue('navy.700', 'white');
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <Flex align="center" direction="column">
      <Flex
        align="center"
        justify="center"
        my="32px"
        transition="all 0.3s ease"
      >
        {toggleSidebar ? (
          <Box
            bg={logoColor}
            color={useColorModeValue('white', 'navy.700')}
            borderRadius="10px"
            w="40px"
            h="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="xl" fontWeight="bold">
              HI
            </Text>
          </Box>
        ) : (
          <Flex align="center" gap="10px">
            <Image
              src="/final-logo.webp"
              alt="Hestiya Logo"
              h="40px"
              w="40px"
              fallbackSrc="https://via.placeholder.com/40"
            />
            <Text
              fontSize="20px"
              fontWeight="700"
              color={logoColor}
              whiteSpace="nowrap"
            >
              Hestiya Intelligence
            </Text>
          </Flex>
        )}
      </Flex>

      <HSeparator mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
