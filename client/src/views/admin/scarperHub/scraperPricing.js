import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  Icon,
  Spinner,
  Card,
  Stack,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  VStack,
} from '@chakra-ui/react';
import {
  MdRefresh,
  MdCheckCircle,
  MdErrorOutline,
  MdPublic,
  MdVisibility,
} from 'react-icons/md';
import api from '../../../utils/axiosConfig';

export default function MarketScraperHub() {
  const [loading, setLoading] = useState(false);
  const [pendingData, setPendingData] = useState([]);
  const [stats, setStats] = useState({ total: 0, lastScan: 'Never' });
  const toast = useToast();

  // Colors
  const cardBg = useColorModeValue('white', '#111C44');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  // 1. Fetch existing pending data on load
  useEffect(() => {
    fetchPendingData();
  }, []);

  const fetchPendingData = async () => {
    try {
      const res = await api.get('/pricing/pending-prices');
      setPendingData(res.data.data || []);
      setStats({
        total: res.data.data.length,
        lastScan: new Date().toLocaleTimeString(),
      });
    } catch (err) {
      console.error('Fetch Error', err);
    }
  };

  // 2. Trigger Scraper
  const handleStartScraping = async () => {
    setLoading(true);
    try {
      const res = await api.post('/pricing/run-scraper');
      setPendingData(res.data.data);
      toast({
        title: 'Scraping Successful',
        description: `${res.data.data.length} new rates found.`,
        status: 'success',
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: 'Scraper Failed',
        description: err.message,
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. Approve and Push to Main Pricing Table
  const approveAll = async () => {
    try {
      await api.post('/pricing/approve-all-pending');
      setPendingData([]);
      toast({
        title: 'Success',
        description: 'All rates published to Live Map!',
        status: 'success',
      });
    } catch (err) {
      toast({ title: 'Approval Failed', status: 'error' });
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px' }} px="20px">
      <VStack spacing="25px" align="stretch">
        {/* Header Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px">
          <StatCard
            title="Pending Review"
            value={pendingData.length}
            icon={MdVisibility}
            color="orange.400"
          />
          <StatCard
            title="Last Scan"
            value={stats.lastScan}
            icon={MdRefresh}
            color="blue.400"
          />
          <StatCard
            title="Global Markets"
            value="Active"
            icon={MdPublic}
            color="green.400"
          />
        </SimpleGrid>

        {/* Control Center */}
        <Card
          p="30px"
          borderRadius="20px"
          bg={cardBg}
          border="1px solid"
          borderColor={borderColor}
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align="center"
          >
            <Box mb={{ base: '20px', md: '0' }}>
              <Text fontSize="2xl" fontWeight="700" color={textColor}>
                Market Scraper Hub
              </Text>
              <Text fontSize="sm" color="gray.500">
                Auto-detect I-REC prices from STX, T-RECs and Public Indices
              </Text>
            </Box>
            <Stack direction="row" spacing={4}>
              <Button
                leftIcon={<MdRefresh />}
                colorScheme="green"
                variant="solid"
                onClick={handleStartScraping}
                isLoading={loading}
                loadingText="Searching Markets..."
              >
                Start Live Scan
              </Button>
              {pendingData.length > 0 && (
                <Button
                  leftIcon={<MdCheckCircle />}
                  colorScheme="blue"
                  onClick={approveAll}
                >
                  Approve All
                </Button>
              )}
            </Stack>
          </Flex>

          <Divider my="25px" />

          {/* Data Display */}
          {loading ? (
            <Flex justify="center" align="center" direction="column" py="50px">
              <Spinner size="xl" thickness="4px" color="green.500" mb="20px" />
              <Text fontWeight="600" color="gray.500">
                AI is analyzing global energy registries...
              </Text>
            </Flex>
          ) : pendingData.length > 0 ? (
            <Box overflowX="auto">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Market / Country</Th>
                    <Th>Estimated Rate</Th>
                    <Th>Confidence</Th>
                    <Th>Source</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pendingData.map((item, idx) => (
                    <Tr key={idx}>
                      <Td fontWeight="bold">{item.Country}</Td>
                      <Td color="green.500" fontWeight="bold">
                        ${item.Rate.toFixed(2)}
                      </Td>
                      <Td>
                        <Badge colorScheme="green" variant="subtle">
                          High
                        </Badge>
                      </Td>
                      <Td fontSize="xs">{item.Source || 'STX Group'}</Td>
                      <Td>
                        <Badge colorScheme="orange">Awaiting Approval</Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Flex
              justify="center"
              align="center"
              direction="column"
              py="50px"
              opacity="0.6"
            >
              <Icon as={MdErrorOutline} w="50px" h="50px" color="gray.300" />
              <Text mt="10px">
                No new market data in staging. Run a scan to find updates.
              </Text>
            </Flex>
          )}
        </Card>
      </VStack>
    </Box>
  );
}

// Reusable Stat Card
function StatCard({ title, value, icon, color }) {
  const cardBg = useColorModeValue('white', '#111C44');
  return (
    <Card p="20px" borderRadius="15px" bg={cardBg} boxShadow="sm">
      <Flex align="center">
        <Icon as={icon} w="40px" h="40px" color={color} mr="15px" />
        <Stat>
          <StatLabel color="gray.500" fontSize="xs">
            {title}
          </StatLabel>
          <StatNumber fontSize="lg">{value}</StatNumber>
        </Stat>
      </Flex>
    </Card>
  );
}
