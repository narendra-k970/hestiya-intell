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
  Select,
  SimpleGrid,
  useToast,
  Text,
  Divider,
  Container,
  Image,
  useColorModeValue,
  Progress,
  HStack,
  Link,
} from '@chakra-ui/react';
// 1. Axios ki jagah apna custom api instance import kiya
import api from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { industries, companySizes, genders, countries } from './constant';
import logo from 'assets/img/final-logo.webp';

const AuthForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const brandGreen = '#028B3E';
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');

  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    companyName: '',
    industry: '',
    companySize: '',
    countryOfIncorporation: '',
    reason: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      // 2. Updated to use 'api' and short endpoint
      await api.post('/user/send-otp', {
        email: formData.email,
      });
      toast({ title: 'OTP Sent!', status: 'success' });
      setStep(2);
    } catch (err) {
      toast({ title: err.response?.data?.message || 'Error', status: 'error' });
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      // 3. Updated to use 'api' and short endpoint
      const response = await api.post('/user/verify-otp', {
        email: formData.email,
        otp: formData.otp,
      });
      toast({ title: 'Verified Successfully', status: 'success' });
      if (response.data.isKycPending) {
        setStep(3);
      } else {
        navigate('/auth/sign-in');
      }
    } catch (err) {
      toast({ title: 'Invalid OTP', status: 'error' });
    }
    setLoading(false);
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // 4. Updated to use 'api' and short endpoint
      await api.post('/user/complete-signup', formData);
      toast({
        title: 'Account Created!',
        description: 'Redirecting to login...',
        status: 'success',
        duration: 3000,
      });

      setTimeout(() => {
        navigate('/auth/sign-in');
      }, 2000);
    } catch (err) {
      toast({
        title: err.response?.data?.message || 'Failed',
        status: 'error',
      });
    }
    setLoading(false);
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={4} mb={6}>
        <Image src={logo} alt="Hestiya Logo" maxW="140px" />
        <Heading size="lg" color={useColorModeValue(brandGreen, 'white')}>
          Create Your Account
        </Heading>
      </VStack>

      <Box
        p={8}
        borderWidth={1}
        borderRadius="20px"
        boxShadow="2xl"
        bg={cardBg}
      >
        <VStack spacing={6} align="stretch">
          <Box>
            <HStack justifyContent="space-between" mb={2}>
              <Text fontSize="xs" fontWeight="bold" color={brandGreen}>
                STEP {step} OF 3
              </Text>
              <Text fontSize="xs" fontWeight="bold" color={secondaryText}>
                {step === 1
                  ? 'Identity'
                  : step === 2
                    ? 'Verification'
                    : 'Company Details'}
              </Text>
            </HStack>
            <Progress
              value={(step / 3) * 100}
              size="xs"
              borderRadius="full"
              sx={{ '& > div': { backgroundColor: brandGreen } }}
            />
          </Box>

          <Divider />

          {step === 1 && (
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={textColor}>Corporate Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  variant="auth"
                  placeholder="name@company.com"
                  onChange={handleChange}
                  borderRadius="16px"
                />
              </FormControl>
              <Button
                bg={brandGreen}
                color="white"
                w="full"
                h="50px"
                borderRadius="16px"
                onClick={handleSendOtp}
                isLoading={loading}
                _hover={{ bg: '#026d30' }}
              >
                Send Verification Code
              </Button>
            </VStack>
          )}

          {step === 2 && (
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel color={textColor}>Verification Code</FormLabel>
                <Input
                  name="otp"
                  placeholder="6-digit OTP"
                  variant="auth"
                  onChange={handleChange}
                  borderRadius="16px"
                />
              </FormControl>
              <Button
                bg={brandGreen}
                color="white"
                w="full"
                h="50px"
                borderRadius="16px"
                onClick={handleVerifyOtp}
                isLoading={loading}
                _hover={{ bg: '#026d30' }}
              >
                Verify OTP
              </Button>
            </VStack>
          )}

          {step === 3 && (
            <VStack spacing={5}>
              <SimpleGrid columns={[1, 2]} spacing={4} w="full">
                <Input
                  name="firstName"
                  placeholder="First Name"
                  borderRadius="16px"
                  onChange={handleChange}
                />
                <Input
                  name="lastName"
                  placeholder="Last Name"
                  borderRadius="16px"
                  onChange={handleChange}
                />
              </SimpleGrid>

              <Select
                name="industry"
                placeholder="Select Industry"
                borderRadius="16px"
                onChange={handleChange}
              >
                {industries.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </Select>

              <Button
                bg={brandGreen}
                color="white"
                size="lg"
                w="full"
                h="50px"
                borderRadius="16px"
                onClick={handleFinalSubmit}
                isLoading={loading}
                _hover={{ bg: '#026d30' }}
              >
                Complete Registration
              </Button>
            </VStack>
          )}

          <Divider />
          <Text textAlign="center" fontSize="sm" color={textColor}>
            Already have an account?{' '}
            <Link
              color={brandGreen}
              fontWeight="bold"
              onClick={() => navigate('/auth/sign-in')}
              _hover={{ textDecoration: 'underline' }}
            >
              Sign In here
            </Link>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default AuthForm;
