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
  Image,
  useColorModeValue,
  Progress,
  HStack,
  Link,
} from '@chakra-ui/react';
import api from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import FinalLogo from 'assets/img/final-logo.webp';
import carbonBG from 'assets/img/carbon_market_bg.png';

const ForgotPassword = () => {
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
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      toast({ title: 'Please enter your email', status: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/user/forgot-password-send-otp', {
        email: formData.email,
      });
      toast({
        title: 'OTP Sent',
        description: res.data.message || 'Check your email for the reset code.',
        status: 'success',
      });
      setStep(2);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to send OTP',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = () => {
    if (!formData.otp) {
      toast({ title: 'Please enter the OTP', status: 'warning' });
      return;
    }
    // Note: We'll verify OTP along with the password reset in the final step 
    // or we can add an intermediate check. Let's just move to step 3 for simplicity 
    // as the backend resetPassword validates the OTP anyway.
    setStep(3);
  };

  const handleResetPassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return;
    }
    if (formData.newPassword.length < 6) {
      toast({ title: 'Password must be at least 6 characters', status: 'error' });
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/user/reset-password', {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      toast({
        title: 'Success',
        description: 'Password reset successfully. Please login.',
        status: 'success',
      });
      setTimeout(() => navigate('/auth/sign-in'), 2000);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Reset failed',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
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
      <Box
        position="absolute"
        inset={0}
        bg="rgba(0, 0, 0, 0.55)"
        backdropFilter="blur(1px)"
      />
      <Container maxW="md" py={4} position="relative" zIndex={1}>
        <VStack spacing={2} mb={3}>
          <Image src={FinalLogo} alt="Hestiya Logo" maxW="70px" />
          <Heading size="md" color="white">
            Reset Your Password
          </Heading>
        </VStack>

        <Box p={8} borderWidth={1} borderRadius="20px" boxShadow="2xl" bg={cardBg}>
          <VStack spacing={5} align="stretch">
            <Box>
              <HStack justifyContent="space-between" mb={2}>
                <Text fontSize="xs" fontWeight="bold" color={brandGreen}>
                  STEP {step} OF 3
                </Text>
                <Text fontSize="xs" fontWeight="bold" color={secondaryText}>
                  {step === 1 ? 'Email' : step === 2 ? 'Verification' : 'New Password'}
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
                    placeholder="name@company.com"
                    onChange={handleChange}
                    value={formData.email}
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
                  Send Reset Code
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
                    onChange={handleChange}
                    value={formData.otp}
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
                  _hover={{ bg: '#026d30' }}
                >
                  Verify Code
                </Button>
              </VStack>
            )}

            {step === 3 && (
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel color={textColor}>New Password</FormLabel>
                  <Input
                    name="newPassword"
                    type="password"
                    placeholder="Min. 6 characters"
                    onChange={handleChange}
                    value={formData.newPassword}
                    borderRadius="16px"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color={textColor}>Confirm Password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    placeholder="Repeat password"
                    onChange={handleChange}
                    value={formData.confirmPassword}
                    borderRadius="16px"
                  />
                </FormControl>
                <Button
                  bg={brandGreen}
                  color="white"
                  w="full"
                  h="50px"
                  borderRadius="16px"
                  onClick={handleResetPassword}
                  isLoading={loading}
                  _hover={{ bg: '#026d30' }}
                >
                  Reset Password
                </Button>
              </VStack>
            )}

            <Divider />
            <Text textAlign="center" fontSize="sm" color={textColor}>
              Remembered your password?{' '}
              <Link
                color={brandGreen}
                fontWeight="bold"
                onClick={() => navigate('/auth/sign-in')}
                _hover={{ textDecoration: 'underline' }}
              >
                Sign In
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
