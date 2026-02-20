// Chakra imports
import { Box, Flex, Icon, Text, Heading } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React from 'react';
import Footer from 'components/footer/FooterAuth';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
// Custom components
import { NavLink } from 'react-router-dom';
// Assets
import { FaChevronLeft } from 'react-icons/fa';

function AuthIllustration(props) {
  const { children } = props;

  return (
    <Flex position="relative" h="max-content">
      <Flex
        h={{
          sm: 'initial',
          md: 'unset',
          lg: '100vh',
          xl: '97vh',
        }}
        w="100%"
        maxW={{ md: '66%', lg: '1313px' }}
        mx="auto"
        pt={{ sm: '50px', md: '0px' }}
        px={{ lg: '30px', xl: '0px' }}
        ps={{ xl: '70px' }}
        justifyContent="start"
        direction="column"
      >
        {/* Back Link - Updated Text to Hestiya */}
        <NavLink
          to="/admin"
          style={() => ({
            width: 'fit-content',
            marginTop: '40px',
          })}
        >
          <Flex
            align="center"
            ps={{ base: '25px', lg: '0px' }}
            pt={{ lg: '0px', xl: '0px' }}
            w="fit-content"
          >
            <Icon
              as={FaChevronLeft}
              me="12px"
              h="13px"
              w="8px"
              color="secondaryGray.600"
            />
            <Text
              ms="0px"
              fontSize="sm"
              color="secondaryGray.600"
              fontWeight="500"
            >
              Back to Dashboard
            </Text>
          </Flex>
        </NavLink>

        {children}

        {/* Right Side - HESTIYA BRANDING BLOCK */}
        <Box
          display={{ base: 'none', md: 'block' }}
          h="100%"
          minH="100vh"
          w={{ lg: '50vw', '2xl': '44vw' }}
          position="absolute"
          right="0px"
        >
          <Flex
            /* Background Gradient for a premium look */
            bg="linear-gradient(135deg, #4318FF 0%, #2B3674 100%)"
            justify="center"
            align="center"
            w="100%"
            h="100%"
            position="absolute"
            direction="column"
            color="white"
            textAlign="center"
            px="40px"
            borderBottomLeftRadius={{ lg: '120px', xl: '200px' }}
          >
            <Box>
              <Heading
                fontSize={{ lg: '60px', xl: '80px' }}
                fontWeight="800"
                mb="10px"
                letterSpacing="-2px"
              >
                HESTIYA
              </Heading>
              <Text fontSize="20px" fontWeight="400" opacity="0.8" maxW="450px">
                The Intellectual Dashboard for Smart Data Management & Strategic
                Analytics.
              </Text>

              {/* Decorative Line */}
              <Box
                mt="30px"
                mx="auto"
                w="60px"
                h="4px"
                bg="white"
                borderRadius="10px"
              />
            </Box>
          </Flex>
        </Box>
        <Footer />
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}

// PROPS
AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
