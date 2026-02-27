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
      const { user, token } = res.data;

      localStorage.setItem('token', token || 'dummy_token');
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
    <Container maxW="md" py={12}>
      <VStack spacing={4} mb={8}>
        {/* LOGO SECTION */}
        <Box
          w="100px"
          h="100px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* Logo Image yahan lagao */}
          <Image
            src={FinalLogo} // Ab yahan variable pass hoga, string nahi
            alt="Hestiya Logo"
            w="120px"
            h="auto"
          />
        </Box>
      </VStack>

      <Box p={8} borderWidth={1} borderRadius="20px" boxShadow="xl" bg={cardBg}>
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
              <FormLabel color={textColor}>Corporate Email</FormLabel>
              <Input
                name="email"
                type="email"
                variant="auth" // Horizon UI style
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
                variant="auth" // Horizon UI style
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
              _hover={{
                bg: '#026d30', // Hover par thoda dark green
              }}
              _active={{
                bg: '#025224',
              }}
            >
              Sign In
            </Button>

            <VStack spacing={3}>
              <Link color={brandGreen} fontSize="sm" fontWeight="600" href="#">
                Forgot Password?
              </Link>
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
  );
};

export default Login;
