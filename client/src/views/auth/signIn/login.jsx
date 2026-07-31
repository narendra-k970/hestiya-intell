/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  Divider,
  Container,
  Link,
  Image,
  useColorModeValue,
} from '@chakra-ui/react';
import api from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import FinalLogo from 'assets/img/final-logo.webp';
import carbonBG from 'assets/img/carbon_market_bg.png';
// Logo import karein (agar aapke assets mein hai)
// import logo from 'assets/img/layout/logo.png';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Colors based on Light/Dark Mode
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const brandGreen = '#028B3E'; // Aapka favorite green

  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/user/login', credentials);
      const { user, token, refreshToken } = res.data;

      localStorage.setItem('token', token || 'dummy_token');
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      toast({ title: 'Login Success', status: 'success', duration: 3000 });

      // Sahi raste pe bhejo (Jo humne pehle fix kiya tha)
      if (user.role === 'admin') {
        navigate('/admin/default');
      } else {
        navigate('/user/default');
      }
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: err.response?.data?.message || 'Invalid Credentials',
        status: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <Box
      h="100vh"
      w="full"
      backgroundImage={`url(${carbonBG})`}
      backgroundSize="cover"
      backgroundPosition="center"
      backgroundRepeat="no-repeat"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
    >
      {/* Dark overlay for readability */}
      <Box
        position="absolute"
        inset={0}
        bg="rgba(0, 0, 0, 0.55)"
        backdropFilter="blur(1px)"
      />

      <Container maxW="md" py={4} position="relative" zIndex={1}>
        <VStack spacing={2} mb={3}>
          <Image
            src={FinalLogo}
            alt="Hestiya Logo"
            w="70px"
            h="auto"
          />
        </VStack>

        <Box p={8} borderWidth={1} borderRadius="20px" boxShadow="2xl" bg={cardBg}>
          <form onSubmit={handleLogin}>
            <VStack spacing={5} align="stretch">
              <Box textAlign="center">
                <Heading
                  size="xl"
                  fontWeight="800"
                  color={useColorModeValue(brandGreen, 'white')}
                >
                  Hestiya Intelligence
                </Heading>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Enter your credentials to access your account
                </Text>
              </Box>

              <Divider />

              <FormControl isRequired>
                <FormLabel color={textColor}>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  variant="auth"
                  placeholder="name@company.com"
                  onChange={handleChange}
                  value={credentials.email}
                  borderRadius="16px"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel color={textColor}>Password</FormLabel>
                <Input
                  name="password"
                  type="password"
                  variant="auth"
                  placeholder="Min. 8 characters"
                  onChange={handleChange}
                  value={credentials.password}
                  borderRadius="16px"
                />
              </FormControl>

              <Button
                type="submit"
                bg={brandGreen}
                color="white"
                size="lg"
                w="full"
                isLoading={loading}
                loadingText="Signing In..."
                borderRadius="16px"
                _hover={{ bg: '#026d30' }}
                _active={{ bg: '#025224' }}
              >
                Sign In
              </Button>

              <Box textAlign="right">
                <Link
                  color={brandGreen}
                  fontSize="sm"
                  fontWeight="600"
                  onClick={() => navigate('/auth/forgot-password')}
                  cursor="pointer"
                >
                  Forgot Password?
                </Link>
              </Box>

              <VStack spacing={3}>
                <Text fontSize="sm" color={textColor}>
                  Don't have an account?{' '}
                  <Link
                    color={brandGreen}
                    fontWeight="700"
                    onClick={() => navigate('/auth/sign-up')}
                    cursor="pointer"
                  >
                    Register Now
                  </Link>
                </Text>
              </VStack>
            </VStack>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
