/* eslint-disable */
import { Box, Flex, Stack } from '@chakra-ui/react';
import Brand from 'components/sidebar/components/Brand';
import Links from 'components/sidebar/components/Links';
import React, { useContext } from 'react';
import { SidebarContext } from 'contexts/SidebarContext';

function SidebarContent(props) {
  const { routes } = props;

  // Sidebar ki toggle state nikaalein
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <Flex
      direction="column"
      height="100%"
      pt="25px"
      px={toggleSidebar ? '10px' : '16px'}
      borderRadius="30px"
      transition="all 0.3s ease"
    >
      <Brand display={toggleSidebar ? 'none' : 'block'} />

      <Stack direction="column" mb="auto" mt="8px">
        <Box
          ps={toggleSidebar ? '0px' : '20px'}
          pe={{ md: '16px', '2xl': '1px' }}
        >
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box mt="60px" mb="40px" borderRadius="30px"></Box>
    </Flex>
  );
}

export default SidebarContent;
