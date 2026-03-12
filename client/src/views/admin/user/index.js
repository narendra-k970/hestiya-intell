/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  Spinner,
  useColorModeValue,
  Avatar,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  HStack,
  VStack,
  IconButton,
} from '@chakra-ui/react';
import {
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdPhone,
} from 'react-icons/md';
import api from '../../../utils/axiosConfig';

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');
  const brandGreen = '#239758';

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await api.get('/user/all');
        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (err) {
        console.error('Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filter Logic (Search by Name, Email, or Phone)
  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phoneNumber?.includes(searchTerm),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentItems = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading)
    return (
      <Flex h="60vh" align="center" justify="center">
        <Spinner color={brandGreen} size="xl" />
      </Flex>
    );

  return (
    <Box pt={{ base: '130px', md: '80px' }} px="20px" w="100%">
      <Flex
        justify="space-between"
        align="center"
        mb="30px"
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Box>
          <Text fontSize="24px" fontWeight="800" color={textColor}>
            User Management
          </Text>
          <Text fontSize="sm" color="gray.500" fontWeight="600">
            Total Users: {filteredUsers.length}
          </Text>
        </Box>
        <InputGroup maxW={{ base: '100%', md: '350px' }}>
          <InputLeftElement
            children={<Icon as={MdSearch} color="gray.400" />}
          />
          <Input
            placeholder="Search by name, email, or phone..."
            borderRadius="12px"
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>
      </Flex>

      <Box overflowX="auto">
        <Table variant="simple" color={textColor}>
          <Thead>
            <Tr borderBottom="2px solid" borderColor={borderColor}>
              <Th color="gray.400">USER DETAILS</Th>
              <Th color="gray.400">CONTACT</Th>
              <Th color="gray.400">COMPANY / INDUSTRY</Th>
              <Th color="gray.400">KYC STATUS</Th>
              <Th color="gray.400">JOINED DATE</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentItems.map((user) => (
              <Tr key={user._id} _hover={{ bg: hoverBg }}>
                <Td>
                  <HStack spacing={3}>
                    {/* displayPicture use kiya hai yahan */}
                    <Avatar
                      size="sm"
                      name={user.firstName}
                      src={user.displayPicture}
                      bg={brandGreen}
                    />
                    <VStack align="start" spacing={0}>
                      <Text
                        fontWeight="700"
                        fontSize="sm"
                        textTransform="capitalize"
                      >
                        {user.firstName} {user.lastName}
                      </Text>
                      <Text fontWeight="500" fontSize="xs" color="gray.500">
                        {user.email}
                      </Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <Icon as={MdPhone} boxSize={3} color="gray.400" />
                    <Text fontSize="xs" fontWeight="600">
                      {user.phoneNumber || 'N/A'}
                    </Text>
                  </HStack>
                </Td>
                <Td>
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="600" fontSize="xs">
                      {user.companyName || 'Individual'}
                    </Text>
                    <Text fontSize="10px" color="gray.400">
                      {user.industry || 'N/A'}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Badge
                    colorScheme={user.isKycCompleted ? 'green' : 'orange'}
                    borderRadius="6px"
                    px={2}
                    fontSize="10px"
                  >
                    {user.isKycCompleted ? 'Verified' : 'Pending'}
                  </Badge>
                </Td>
                <Td fontSize="xs" color="gray.500">
                  {new Date(user.createdAt).toLocaleDateString('en-GB')}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination Controls */}
      <Flex justify="center" mt="40px" gap={2} align="center">
        <IconButton
          icon={<MdChevronLeft />}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          isDisabled={currentPage === 1}
          size="sm"
          variant="outline"
        />
        <Text fontSize="xs" fontWeight="bold">
          Page {currentPage} of {totalPages || 1}
        </Text>
        <IconButton
          icon={<MdChevronRight />}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          isDisabled={currentPage === totalPages || totalPages === 0}
          size="sm"
          variant="outline"
        />
      </Flex>
    </Box>
  );
}
