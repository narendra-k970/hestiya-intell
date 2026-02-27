/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  Icon,
} from '@chakra-ui/react';
import api from '../../../utils/axiosConfig';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

// Image import
import bgImage from '../../../assets/img/admin-bg.jpeg';

function SignIn() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async () => {
    try {
      const response = await api.post('/user/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      window.location.href = '/admin/default';
    } catch (e) {
      toast({ title: 'Error', status: 'error', duration: 3000 });
    }
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      position="fixed"
      top="0"
      left="0"
      zIndex="-1"
      backgroundImage={`url(${bgImage})`}
      backgroundSize="cover"
      backgroundPosition="center"
    >
      {/* Black Overlay */}
      <Box
        w="100%"
        h="100%"
        bg="rgba(0,0,0,0.6)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {/* Card */}
        <Box bg="white" p="40px" borderRadius="20px" w="400px" boxShadow="2xl">
          <Heading mb="20px">Hestiya Login</Heading>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              mb="15px"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormLabel>Password</FormLabel>
            <InputGroup mb="20px">
              <Input
                type={show ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement
                cursor="pointer"
                onClick={() => setShow(!show)}
              >
                <Icon as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye} />
              </InputRightElement>
            </InputGroup>
            <Button
              w="100%"
              colorScheme="blue"
              onClick={handleLogin}
              isLoading={loading}
            >
              Log In
            </Button>
          </FormControl>
        </Box>
      </Box>
    </Box>
  );
}

export default SignIn;
