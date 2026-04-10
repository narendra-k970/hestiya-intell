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
} from 'react-icons/md';
import api from '../../../utils/axiosConfig';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandGreen = '#239758';
  const borderColor = useColorModeValue('gray.100', 'whiteAlpha.100');

  useEffect(() => {
    const fetchProfile = async () => {
      // 1. Check karein ki localStorage mein token hai ya nahi
      const token = localStorage.getItem('token');

      if (!token) {
        // Agar token hi nahi hai, toh seedha error set karein ya login par bhejein
        setError('No active session found. Please login.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // 2. Profile fetch karein
        // Note: Humara axiosConfig ka request interceptor apne aap headers mein token daal dega
        const response = await api.get('/user/profile');

        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch (err) {
        // Agar refresh par backend 401 deta hai, toh axiosConfig khud logout kar dega
        // Lekin yahan hum generic error UI dikhane ke liye catch karte hain
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
        <Text mt={4} fontWeight="bold">
          {error}
        </Text>
        <Button
          mt={4}
          size="sm"
          colorScheme="green"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Flex>
    );

  return (
    <Box
      pt={{ base: '130px', md: '110px' }}
      px={{ base: '20px', md: '30px' }}
      w="100%"
    >
      {/* Top Header - No Box, Direct on Page */}
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
          <VStack align="start" spacing={1}>
            <Text
              fontSize={{ base: '24px', md: '32px' }}
              fontWeight="800"
              color={textColor}
              lineHeight="1"
            >
              {user?.firstName} {user?.lastName}
            </Text>
            <HStack spacing={3} mt={2}>
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
      </Flex>

      <Divider mb="40px" borderColor={borderColor} />

      {/* Details Grid - Full Width */}
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        spacingX={10}
        spacingY={12}
      >
        <InfoItem
          icon={MdPerson}
          label="Full Name"
          value={`${user?.firstName} ${user?.lastName}`}
        />
        <InfoItem icon={MdEmail} label="Registered Email" value={user?.email} />
        <InfoItem
          icon={MdPhone}
          label="Contact Number"
          value={user?.phone || user?.phoneNumber || 'Not Linked'}
        />
        <InfoItem
          icon={MdBusiness}
          label="Organization"
          value={user?.companyName || 'Private User'}
        />
        <InfoItem
          icon={MdLayers}
          label="Active Subscription"
          value={user?.plan || 'Basic Analytics'}
        />
        <InfoItem
          icon={MdVerified}
          label="Account Status"
          value={
            user?.isEmailVerified ? 'Active & Verified' : 'Verification Needed'
          }
        />
        <InfoItem
          icon={MdLocationOn}
          label="Region"
          value={user?.country || 'Global'}
        />
      </SimpleGrid>
    </Box>
  );
}

// Helper Component for Info Rows - No Box, Minimalist
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
