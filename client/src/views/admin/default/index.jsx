/* eslint-disable */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {
  MdAttachMoney,
  MdPublic,
  MdAnalytics,
  MdNotificationsActive,
} from 'react-icons/md';

// Components
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import TotalSpent from 'views/admin/default/components/TotalSpent';
import WeeklyRevenue from 'views/admin/default/components/WeeklyRevenue';
import api from '../../../utils/axiosConfig';

export default function UserReports() {
  const [stats, setStats] = useState({
    avgPrice: '0.00',
    pricingCountries: 0,
    totalVolume: '0',
  });

  const [loading, setLoading] = useState(true);
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const marqueeBg = useColorModeValue('brand.500', 'navy.700');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [irecRes, priceRes] = await Promise.all([
          api.get('/irec/all-data'),
          api.get('/pricing/country-avg'),
        ]);

        const plants = irecRes.data?.data || [];
        const pricing = priceRes.data?.data || [];

        let totalVol = 0;
        plants.forEach((plant) => {
          if (plant.issuances && Array.isArray(plant.issuances)) {
            plant.issuances.forEach((issue) => {
              totalVol += parseFloat(issue.issuanceVolume || 0);
            });
          }
        });

        const priceCountrySet = new Set();
        let totalPriceSum = 0;
        pricing.forEach((p) => {
          const countryName = p.country || p.Country;
          if (countryName) priceCountrySet.add(countryName.trim());
          totalPriceSum += parseFloat(p.avgPrice || p.Rate || 0);
        });

        const finalAvgPrice =
          pricing.length > 0
            ? (totalPriceSum / pricing.length).toFixed(2)
            : '0.00';

        setStats({
          avgPrice: finalAvgPrice,
          pricingCountries: priceCountrySet.size,
          totalVolume: Math.round(totalVol).toLocaleString(),
        });
      } catch (err) {
        console.error('Data Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* --- NEW NEWS MARQUEE SECTION --- */}
      <Box
        bg={marqueeBg}
        color="white"
        py="10px"
        borderRadius="15px"
        mb="25px"
        overflow="hidden"
        position="relative"
        display="flex"
        alignItems="center"
        boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
      >
        <Flex
          px="20px"
          alignItems="center"
          bg={marqueeBg}
          zIndex="2"
          position="absolute"
          left="0"
          fontWeight="bold"
        >
          <Icon as={MdNotificationsActive} mr="10px" />
          <Text whiteSpace="nowrap">MARKET UPDATES:</Text>
          <Box h="20px" w="2px" bg="whiteAlpha.400" mx="15px" />
        </Flex>

        <Box
          as="marquee"
          width="100%"
          style={{ fontSize: '14px', fontWeight: '500' }}
        >
          I-REC Prices are stabilizing across Southeast Asia • New Solar
          Projects registered in Vietnam and Thailand • Global Renewable Energy
          Demand up by 15% this quarter • Current Average Market Rate: $
          {stats.avgPrice} • Total Verified Market Volume reached{' '}
          {stats.totalVolume} MWh • Corporate RE100 targets driving demand in
          2026.
        </Box>
      </Box>

      {/* 3 Main Precision Tabs */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="20px" mb="20px">
        <MiniStatistics
          name="Average Price"
          value={`$${stats.avgPrice}`}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color="green.400" />
              }
            />
          }
        />
        <MiniStatistics
          name="Pricing Markets"
          value={stats.pricingCountries}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPublic} color="blue.400" />}
            />
          }
        />
        <MiniStatistics
          name="Total Market Volume"
          value={`${stats.totalVolume} MWh`}
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg="linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)"
              icon={<Icon w="28px" h="28px" as={MdAnalytics} color="white" />}
            />
          }
        />
      </SimpleGrid>

      {/* Graphs Section */}
      <SimpleGrid columns={{ base: 1, md: 2, xl: 2 }} gap="20px" mb="20px">
        <TotalSpent />
        <WeeklyRevenue />
      </SimpleGrid>
    </Box>
  );
}
