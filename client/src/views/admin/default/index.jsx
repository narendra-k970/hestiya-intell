/* eslint-disable */
import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Spinner,
  Text,
  Progress,
} from '@chakra-ui/react';
import {
  MdAttachMoney,
  MdPublic,
  MdAnalytics,
  MdNotificationsActive,
} from 'react-icons/md'; // MdNotificationsActive add kiya

import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import api from '../../../utils/axiosConfig';

export default function UserReports() {
  // --- 1. HOOKS ---
  const location = useLocation();
  const navigate = useNavigate();
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const brandGreen = '#19944D';

  const [allPlants, setAllPlants] = useState([]);
  const [pricingData, setPricingData] = useState([]);
  const [totalVol, setTotalVol] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- 2. SEARCH QUERY LOGIC ---
  const searchQuery =
    new URLSearchParams(location.search).get('search')?.toLowerCase() || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pRes = await api.get('/pricing/country-avg');
        setPricingData(pRes.data?.data || []);
        await fetchProgressiveData();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchProgressiveData = async () => {
    setIsSyncing(true);
    try {
      const res = await api.get('/irec/all-data?limit=1000');
      const plants = res.data?.data || [];
      setAllPlants(plants);

      const v = plants.reduce(
        (s, p) =>
          s +
          (p.issuances || []).reduce(
            (is, iss) => is + parseFloat(iss.issuanceVolume || 0),
            0,
          ),
        0,
      );
      setTotalVol(v);
    } catch (e) {
      console.error(e);
    }
    setIsSyncing(false);
  };

  // --- 3. FILTERING & STATS ---
  const stats = useMemo(() => {
    const fPlants = searchQuery
      ? allPlants.filter(
          (p) =>
            (p.country || '').toLowerCase().includes(searchQuery) ||
            (p.technology || '').toLowerCase().includes(searchQuery),
        )
      : allPlants;
    const fPrices = searchQuery
      ? pricingData.filter((p) =>
          (p.country || p.Country || '').toLowerCase().includes(searchQuery),
        )
      : pricingData;

    const vSum = fPlants.reduce(
      (s, p) =>
        s +
        (p.issuances || []).reduce(
          (is, iss) => is + parseFloat(iss.issuanceVolume || 0),
          0,
        ),
      0,
    );
    const pSum = fPrices.reduce(
      (s, p) => s + parseFloat(p.avgPrice || p.Rate || 0),
      0,
    );

    return {
      avgPrice:
        fPrices.length > 0 ? (pSum / fPrices.length).toFixed(2) : '0.00',
      countries: new Set(
        fPrices.map((p) => (p.country || p.Country || '').trim()),
      ).size,
      volume: Math.round(vSum).toLocaleString(),
      count: fPlants.length,
    };
  }, [allPlants, pricingData, searchQuery]);

  // --- 4. CONDITIONAL RENDER ---
  if (loading)
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="green.500" />
      </Flex>
    );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* News Marquee Section Re-Added */}
      <Box
        bg={brandGreen}
        color="white"
        py="10px"
        borderRadius="15px"
        mb="25px"
        overflow="hidden"
        position="relative"
        zIndex="0"
        display="flex"
        alignItems="center"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
      >
        <Flex
          px="20px"
          alignItems="center"
          bg={brandGreen}
          zIndex="2"
          position="absolute"
          left="0"
          fontWeight="bold"
        >
          <Icon as={MdNotificationsActive} mr="10px" />
          <Text whiteSpace="nowrap">UPDATES:</Text>
          <Box h="20px" w="2px" bg="whiteAlpha.300" mx="15px" />
        </Flex>

        <Box
          as="marquee"
          width="100%"
          style={{ fontSize: '14px', fontWeight: '500' }}
        >
          I-REC Prices are stabilizing across Southeast Asia • Current Average
          Market Rate: ${stats.avgPrice} • Total Verified Market Volume reached{' '}
          {stats.volume} MWh • Global Renewable Energy Demand up by 15% this
          quarter.
        </Box>
      </Box>

      {searchQuery && (
        <Flex
          bg="blue.50"
          p="3"
          borderRadius="10px"
          mb="4"
          justify="space-between"
          align="center"
        >
          <Text fontWeight="bold" color="blue.700">
            🔎 Results for "{searchQuery}": {stats.count} Assets Found
          </Text>
          <Text
            cursor="pointer"
            color="blue.500"
            fontWeight="bold"
            onClick={() => navigate(location.pathname)}
          >
            Clear
          </Text>
        </Flex>
      )}

      {isSyncing && (
        <Progress
          size="xs"
          isIndeterminate
          colorScheme="green"
          mb="4"
          borderRadius="full"
        />
      )}

      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px">
        <MiniStatistics
          name="Global Average Price"
          value={`$${stats.avgPrice}`}
          startContent={
            <IconBox
              bg={boxBg}
              icon={<Icon as={MdAttachMoney} color="green.400" />}
            />
          }
        />
        <MiniStatistics
          name="Price Benchmarked Across"
          value={`${stats.countries} Countries`}
          startContent={
            <IconBox
              bg={boxBg}
              icon={<Icon as={MdPublic} color="blue.400" />}
            />
          }
        />
        <MiniStatistics
          name="Total Market Volume"
          value={`${stats.volume} MWh`}
          startContent={
            <IconBox
              bg="linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)"
              icon={<Icon as={MdAnalytics} color="white" />}
            />
          }
        />
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px">
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
    </Box>
  );
}
