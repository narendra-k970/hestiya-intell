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
import api from '../../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';
import { industries, companySizes, genders, countries } from './constant';
import logo from 'assets/img/final-logo.webp';
import carbonBG from 'assets/img/carbon_market_bg.png';

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

  // --- Updated handleSendOtp in Frontend ---
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await api.post('/user/send-otp', {
        email: formData.email,
      });

      toast({
        title: 'Success',
        description: res.data.message || 'OTP Sent Successfully',
        status: 'success',
      });
      setStep(2);
    } catch (err) {
      const serverMessage = err.response?.data?.message;

      // Smart handling for existing unverified users
      if (
        serverMessage?.includes('registered') ||
        serverMessage?.includes('verify')
      ) {
        toast({
          title: 'Account Found',
          description: 'Please verify the OTP sent to your email to continue.',
          status: 'info',
        });
        setStep(2); // Direct OTP screen par le jao
      } else {
        toast({
          title: 'Registration Error',
          description: serverMessage || 'Connection Error.',
          status: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await api.post('/user/verify-otp', {
        email: formData.email.trim().toLowerCase(),
        otp: formData.otp.toString().trim(),
      });

      toast({ title: 'Email Verified Successfully', status: 'success' }); // FIX: Navigate nahi karna hai, Step 3 (KYC) par bhejnan hai

      setStep(3);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Invalid OTP';
      toast({ title: errorMsg, status: 'error' });
    }
    setLoading(false);
  };

  const handleFinalSubmit = async () => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast({
        title: 'Weak Password',
        description: 'Password must contain at least 6 characters, including one uppercase letter, one number, and one special character.',
        status: 'warning',
        duration: 5000,
      });
      return;
    }

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
      {/* Dark overlay */}
      <Box
        position="absolute"
        inset={0}
        bg="rgba(0, 0, 0, 0.55)"
        backdropFilter="blur(1px)"
      />
      <Container maxW="container.sm" py={4} position="relative" zIndex={1}>
        <VStack spacing={2} mb={3}>
          <Image src={logo} alt="Hestiya Logo" maxW="70px" />
          <Heading size="md" color={useColorModeValue('white', 'white')}>
            Create Your Account
          </Heading>
        </VStack>

        <Box
          p={5}
          borderWidth={1}
          borderRadius="20px"
          boxShadow="2xl"
          bg={cardBg}
          maxH="75vh"
          overflowY="auto"
          css={{
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { background: '#028B3E', borderRadius: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
          }}
        >
          <VStack spacing={3} align="stretch">
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
              <VStack spacing={2}>
                {/* 1. Name Section */}
                <SimpleGrid columns={[1, 2]} spacing={4} w="full">
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    borderRadius="16px"
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    borderRadius="16px"
                    onChange={handleChange}
                    required
                  />
                </SimpleGrid>

                {/* 2. Authentication & Contact */}
                <FormControl isRequired>
                  <Input
                    name="password"
                    type="password"
                    placeholder="Create Password"
                    borderRadius="16px"
                    onChange={handleChange}
                    mb="8px"
                  />
                  {/* Password Validation Indicators */}
                  <Box mb="8px" ml="4px" fontSize="xs" fontWeight="500" textAlign="left">
                    <Text color={(formData.password || '').length >= 6 ? "green.500" : "gray.500"}>
                      {(formData.password || '').length >= 6 ? "✓" : "○"} At least 6 characters
                    </Text>
                    <Text color={/[A-Z]/.test(formData.password || '') ? "green.500" : "gray.500"}>
                      {/[A-Z]/.test(formData.password || '') ? "✓" : "○"} One uppercase letter
                    </Text>
                    <Text color={/\d/.test(formData.password || '') ? "green.500" : "gray.500"}>
                      {/\d/.test(formData.password || '') ? "✓" : "○"} One number
                    </Text>
                    <Text color={/[\W_]/.test(formData.password || '') ? "green.500" : "gray.500"}>
                      {/[\W_]/.test(formData.password || '') ? "✓" : "○"} One special character (!@#$)
                    </Text>
                  </Box>
                </FormControl>

                <Input
                  name="phoneNumber"
                  placeholder="Phone Number (with country code)"
                  borderRadius="16px"
                  onChange={handleChange}
                />

                <Select
                  name="gender"
                  placeholder="Select Gender"
                  borderRadius="16px"
                  onChange={handleChange}
                >
                  {genders.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </Select>

                <Divider py={2} />
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  alignSelf="flex-start"
                  color={brandGreen}
                >
                  COMPANY INFORMATION
                </Text>

                {/* 3. Company Section */}
                <Input
                  name="companyName"
                  placeholder="Company Legal Name"
                  borderRadius="16px"
                  onChange={handleChange}
                />

                <SimpleGrid columns={[1, 2]} spacing={4} w="full">
                  <Select
                    name="industry"
                    placeholder="Industry"
                    borderRadius="16px"
                    onChange={handleChange}
                  >
                    {industries.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </Select>
                  <Select
                    name="companySize"
                    placeholder="Company Size"
                    borderRadius="16px"
                    onChange={handleChange}
                  >
                    {companySizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </SimpleGrid>

                <Select
                  name="countryOfIncorporation"
                  placeholder="Country of Incorporation"
                  borderRadius="16px"
                  onChange={handleChange}
                  color="black" // Text visibility ke liye
                  bg="white"
                >
                  {countries && countries.length > 0 ? (
                    countries.map((c, index) => (
                      <option key={c.code || index} value={c.name || c}>
                        {c.name || c}
                      </option>
                    ))
                  ) : (
                    <option disabled>Loading countries...</option>
                  )}
                </Select>

                <Input
                  name="reason"
                  placeholder="Reason"
                  borderRadius="16px"
                  onChange={handleChange}
                />

                <Button
                  bg={brandGreen}
                  color="white"
                  w="full"
                  h="40px"
                  mt={2}
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
    </Box>
  );
};

export default AuthForm;
