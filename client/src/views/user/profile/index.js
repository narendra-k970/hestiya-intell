/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  VStack,
  HStack,
  Badge,
  Divider,
  Spinner,
  useColorModeValue,
  Icon,
  SimpleGrid,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Progress,
  useDisclosure,
  useToast,
  Textarea,
} from '@chakra-ui/react';
import {
  MdEmail,
  MdBusiness,
  MdVerified,
  MdErrorOutline,
  MdPerson,
  MdPhone,
  MdLayers,
  MdLocationOn,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdCheckCircle,
  MdFeedback,
} from 'react-icons/md';
import api from '../../../utils/axiosConfig';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset Password Modal State
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Enter OTP + Password, 3: Success
  const [resetData, setResetData] = useState({ otp: '', newPassword: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Feedback Modal State
  const { isOpen: isFeedbackOpen, onOpen: onFeedbackOpen, onClose: onFeedbackClose } = useDisclosure();
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandGreen = '#239758';
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');
  const cardBg = useColorModeValue('white', '#111C44');
  const modalBg = useColorModeValue('white', 'navy.800');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No active session found. Please login.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await api.get('/user/profile');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // --- Reset Password Handlers ---
  const handleOpenModal = () => {
    setStep(1);
    setResetData({ otp: '', newPassword: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirm(false);
    onOpen();
  };

  const handleSendOtp = async () => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/user/forgot-password-send-otp', { email: user.email });
      toast({
        title: 'OTP Sent!',
        description: res.data.message || 'Check your email for the reset code.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      setStep(2);
    } catch (err) {
      toast({
        title: 'Failed to Send OTP',
        description: err.response?.data?.message || 'Something went wrong.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetData.otp.trim()) {
      toast({ title: 'Please enter the OTP', status: 'warning' });
      return;
    }
    if (resetData.newPassword.length < 6) {
      toast({ title: 'Password must be at least 6 characters', status: 'warning' });
      return;
    }
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast({ title: 'Passwords do not match', status: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/user/reset-password', {
        email: user.email,
        otp: resetData.otp,
        newPassword: resetData.newPassword,
      });
      toast({
        title: 'Password Updated!',
        description: res.data.message || 'Your password has been reset successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setStep(3);
    } catch (err) {
      toast({
        title: 'Reset Failed',
        description: err.response?.data?.message || 'Invalid OTP or session expired.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackText.trim()) {
      toast({ title: 'Please enter your feedback', status: 'warning' });
      return;
    }
    setIsSubmittingFeedback(true);
    try {
      await api.post('/user/feedback', { message: feedbackText });
      toast({ title: 'Feedback Submitted', description: 'Thank you for your feedback!', status: 'success' });
      setFeedbackText('');
      onFeedbackClose();
    } catch (err) {
      toast({ title: 'Submission Failed', description: err.response?.data?.message || 'Something went wrong', status: 'error' });
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // --- Render ---
  if (loading)
    return (
      <Flex h="80vh" align="center" justify="center">
        <Spinner size="xl" color={brandGreen} thickness="4px" />
      </Flex>
    );

  if (error)
    return (
      <Flex h="80vh" align="center" justify="center" direction="column">
        <Icon as={MdErrorOutline} boxSize={12} color="red.400" />
        <Text mt={4} fontWeight="bold">{error}</Text>
        <Button mt={4} size="sm" colorScheme="green" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Flex>
    );

  return (
    <Box pt={{ base: '130px', md: '110px' }} px={{ base: '20px', md: '30px' }} w="100%">

      {/* ── Top Header ── */}
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'center', md: 'flex-end' }}
        justify="space-between"
        mb="40px"
        gap={6}
      >
        <HStack spacing={6} align="center">
          <Avatar
            size="xl"
            name={user?.firstName}
            bg={brandGreen}
            src={user?.avatar}
            border="4px solid white"
            boxShadow="xl"
          />
          <VStack align="start" spacing={2}>
            <Text
              fontSize={{ base: '24px', md: '32px' }}
              fontWeight="800"
              color={textColor}
              lineHeight="1"
            >
              {user?.firstName} {user?.lastName}
            </Text>
            <HStack spacing={3} flexWrap="wrap">
              <Badge
                colorScheme={user?.isKycCompleted ? 'green' : 'orange'}
                variant="solid"
                px={3}
                borderRadius="full"
              >
                {user?.isKycCompleted ? 'KYC VERIFIED' : 'KYC PENDING'}
              </Badge>
              <Badge colorScheme="blue" px={3} borderRadius="full">
                {user?.plan || 'Standard Plan'}
              </Badge>
              <Text fontSize="sm" color="gray.500" fontWeight="600">
                ID: {user?._id?.slice(-6).toUpperCase()}
              </Text>
            </HStack>
          </VStack>
        </HStack>

        {/* Action Buttons */}
        <HStack spacing={4}>
          <Button
            leftIcon={<Icon as={MdLock} />}
            colorScheme="green"
            variant="outline"
            size="sm"
            borderRadius="12px"
            onClick={handleOpenModal}
            _hover={{ bg: brandGreen, color: 'white' }}
          >
            Reset Password
          </Button>
          <Button
            leftIcon={<Icon as={MdFeedback} />}
            bg={brandGreen}
            color="white"
            size="sm"
            borderRadius="12px"
            onClick={onFeedbackOpen}
            _hover={{ bg: '#1a7a45' }}
          >
            Give Feedback
          </Button>
        </HStack>
      </Flex>

      <Divider mb="40px" borderColor={borderColor} />

      {/* ── Details Grid ── */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacingX={10} spacingY={12}>
        <InfoItem icon={MdPerson} label="Full Name" value={`${user?.firstName} ${user?.lastName}`} />
        <InfoItem icon={MdEmail} label="Registered Email" value={user?.email} />
        <InfoItem icon={MdPhone} label="Contact Number" value={user?.phone || user?.phoneNumber || 'Not Linked'} />
        <InfoItem icon={MdBusiness} label="Organization" value={user?.companyName || 'Private User'} />
        <InfoItem icon={MdLayers} label="Active Subscription" value={user?.plan || 'Basic Analytics'} />
        <InfoItem
          icon={MdVerified}
          label="Account Status"
          value={user?.isEmailVerified ? 'Active & Verified' : 'Verification Needed'}
        />
        <InfoItem icon={MdLocationOn} label="Region" value={user?.countryOfIncorporation || 'Global'} />
      </SimpleGrid>

      {/* ── Reset Password Modal ── */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="20px" bg={modalBg} overflow="hidden">

          {/* Colored top bar */}
          <Box bg={brandGreen} px={6} py={5}>
            <Text color="white" fontWeight="800" fontSize="lg">Reset Your Password</Text>
            <Text color="whiteAlpha.800" fontSize="sm">
              {step === 1 && 'We will send a verification code to your email.'}
              {step === 2 && 'Enter the OTP and set your new password.'}
              {step === 3 && 'Your password has been changed successfully.'}
            </Text>
          </Box>

          {/* Progress Bar */}
          {step < 3 && (
            <Progress
              value={(step / 2) * 100}
              size="xs"
              colorScheme="green"
              borderRadius="0"
            />
          )}

          <ModalCloseButton color={step === 1 || step === 2 ? 'white' : textColor} top={4} right={4} />

          <ModalBody py={6}>
            {/* ── STEP 1: Confirm Email & Send OTP ── */}
            {step === 1 && (
              <VStack spacing={5} align="stretch">
                <FormControl>
                  <FormLabel fontWeight="700" fontSize="sm">Your Registered Email</FormLabel>
                  <Input
                    value={user?.email}
                    isReadOnly
                    borderRadius="12px"
                    bg={useColorModeValue('gray.50', 'whiteAlpha.100')}
                    fontWeight="600"
                    color="gray.500"
                    cursor="not-allowed"
                  />
                  <FormHelperText>
                    OTP will be sent to this email address.
                  </FormHelperText>
                </FormControl>
                <Button
                  bg={brandGreen}
                  color="white"
                  w="full"
                  h="48px"
                  borderRadius="12px"
                  onClick={handleSendOtp}
                  isLoading={isSubmitting}
                  loadingText="Sending..."
                  _hover={{ bg: '#1a7a45' }}
                  leftIcon={<Icon as={MdEmail} />}
                >
                  Send OTP to My Email
                </Button>
              </VStack>
            )}

            {/* ── STEP 2: Enter OTP + New Password ── */}
            {step === 2 && (
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel fontWeight="700" fontSize="sm">Verification Code (OTP)</FormLabel>
                  <Input
                    placeholder="Enter 6-digit OTP"
                    borderRadius="12px"
                    value={resetData.otp}
                    onChange={(e) => setResetData({ ...resetData, otp: e.target.value })}
                    maxLength={6}
                    letterSpacing="4px"
                    fontSize="lg"
                    fontWeight="700"
                    textAlign="center"
                  />
                  <FormHelperText>Check your inbox for the code.</FormHelperText>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="700" fontSize="sm">New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      borderRadius="12px"
                      value={resetData.newPassword}
                      onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={<Icon as={showPassword ? MdVisibilityOff : MdVisibility} />}
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password"
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontWeight="700" fontSize="sm">Confirm New Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat password"
                      borderRadius="12px"
                      value={resetData.confirmPassword}
                      onChange={(e) => setResetData({ ...resetData, confirmPassword: e.target.value })}
                      borderColor={
                        resetData.confirmPassword && resetData.newPassword !== resetData.confirmPassword
                          ? 'red.400'
                          : undefined
                      }
                    />
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={<Icon as={showConfirm ? MdVisibilityOff : MdVisibility} />}
                        onClick={() => setShowConfirm(!showConfirm)}
                        aria-label="Toggle confirm password"
                      />
                    </InputRightElement>
                  </InputGroup>
                  {resetData.confirmPassword && resetData.newPassword !== resetData.confirmPassword && (
                    <FormHelperText color="red.400">Passwords do not match</FormHelperText>
                  )}
                </FormControl>

                <HStack spacing={3} pt={2}>
                  <Button
                    variant="outline"
                    borderRadius="12px"
                    flex={1}
                    onClick={() => setStep(1)}
                    size="md"
                  >
                    Back
                  </Button>
                  <Button
                    bg={brandGreen}
                    color="white"
                    borderRadius="12px"
                    flex={2}
                    onClick={handleResetPassword}
                    isLoading={isSubmitting}
                    loadingText="Updating..."
                    _hover={{ bg: '#1a7a45' }}
                    leftIcon={<Icon as={MdLock} />}
                  >
                    Update Password
                  </Button>
                </HStack>
              </VStack>
            )}

            {/* ── STEP 3: Success ── */}
            {step === 3 && (
              <VStack spacing={5} align="center" py={4}>
                <Icon as={MdCheckCircle} boxSize={16} color={brandGreen} />
                <VStack spacing={1}>
                  <Text fontWeight="800" fontSize="lg">Password Changed!</Text>
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    Your password has been updated successfully. Use it the next time you log in.
                  </Text>
                </VStack>
                <Button
                  bg={brandGreen}
                  color="white"
                  borderRadius="12px"
                  w="full"
                  onClick={onClose}
                  _hover={{ bg: '#1a7a45' }}
                >
                  Done
                </Button>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ── Feedback Modal ── */}
      <Modal isOpen={isFeedbackOpen} onClose={onFeedbackClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" mx={4} p={2}>
          <ModalHeader>Give Us Feedback</ModalHeader>
          <ModalCloseButton mt={3} />
          <ModalBody>
            <Text fontSize="sm" color="gray.500" mb={4}>
              We value your thoughts! Let us know how we can improve your experience.
            </Text>
            <Textarea
              placeholder="Type your feedback here..."
              rows={5}
              borderRadius="12px"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onFeedbackClose} borderRadius="12px">
              Cancel
            </Button>
            <Button
              bg={brandGreen}
              color="white"
              onClick={handleFeedbackSubmit}
              isLoading={isSubmittingFeedback}
              borderRadius="12px"
              _hover={{ bg: '#1a7a45' }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}

// ── Helper: Info Row ──
function InfoItem({ icon, label, value }) {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  return (
    <HStack spacing={4} align="center">
      <Icon as={icon} boxSize={6} color="#239758" />
      <VStack align="start" spacing={0}>
        <Text
          fontSize="xs"
          fontWeight="800"
          color="gray.400"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          {label}
        </Text>
        <Text fontSize="md" fontWeight="700" color={textColor}>
          {value}
        </Text>
      </VStack>
    </HStack>
  );
}
