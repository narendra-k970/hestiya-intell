/* eslint-disable */
import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Box,
  Text,
  Flex,
  Spinner,
  Select,
  Card,
  Divider,
  Badge,
  Stack,
  useColorModeValue,
  Icon,
  HStack,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  MdCalendarToday,
  MdPublic,
  MdFilterList,
  MdBolt,
} from 'react-icons/md';
import api from '../../../utils/axiosConfig';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

const getMonthOrder = (month) => {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return months.indexOf(month);
};

function ChangeView({ selectedCountry, geoData }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedCountry || !map) return;

    const selName = selectedCountry.toLowerCase().trim();

    // Manual coordinates for small islands/countries
    const manualCoords = {
      'sri lanka': { center: [7.8731, 80.7718], zoom: 8 },
      singapore: { center: [1.3521, 103.8198], zoom: 11 },
      uae: { center: [23.4241, 53.8478], zoom: 7 },
    };

    // Case A: Manual Coordinates (Sri Lanka, etc.)
    if (manualCoords[selName]) {
      const { center, zoom } = manualCoords[selName];
      map.flyTo(center, zoom, { duration: 2, animate: true });
      return;
    }

    // Case B: GeoJSON Bounds (India, etc.)
    if (geoData && geoData.features) {
      const feature = geoData.features.find((f) => {
        const name = (f.properties?.name || f.id || '').toLowerCase();
        return (
          name === selName || (selName === 'uae' && name.includes('emirates'))
        );
      });

      if (feature) {
        const geoJsonLayer = L.geoJson(feature);
        const bounds = geoJsonLayer.getBounds();
        if (bounds.isValid()) {
          map.flyToBounds(bounds, { padding: [50, 50], duration: 2 });
        }
      }
    }
  }, [selectedCountry, map, geoData]); // Dependency array is clean now

  return null;
}

export default function MarketMapLeaflet() {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [reFilter, setReFilter] = useState('All');
  const [selectedVintage, setSelectedVintage] = useState('');

  const bg = useColorModeValue('#F4F7FE', '#0B1437');
  const cardBg = useColorModeValue('white', '#111C44');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', '#222E5F');
  const sidePanelBg = useColorModeValue('gray.50', '#1B254B');
  const currentMonthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
  }).format(new Date());
  const [selectedMonth, setSelectedMonth] = useState(currentMonthName);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [res, geoRes] = await Promise.all([
          api.get('/pricing/country-avg'), // New Optimized API
          axios.get(
            'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
          ),
        ]);
        setData(res.data.data || []);
        console.log(res.data.data);
        setGeoData(geoRes.data);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const allMonths = useMemo(
    () => [...new Set(data.map((item) => item.month))].filter(Boolean),
    [data],
  );
  const allCountries = useMemo(
    () => [...new Set(data.map((item) => item.country))].filter(Boolean).sort(),
    [data],
  );

  // Unified Filter Logic for RE and Non-RE
  const selectedInfo = useMemo(() => {
    const selCountry = selectedCountry.toLowerCase().trim();

    // 1. Current Month Filtered Data
    const filtered = data.filter((item) => {
      return (
        (item.country || '').toLowerCase().trim() === selCountry &&
        item.month === selectedMonth &&
        (reFilter === 'All' || item.isRE100 === reFilter)
      );
    });

    if (filtered.length === 0) return null;

    // 2. Market Average (All Vintages)
    const currentPrice =
      filtered.reduce((acc, curr) => acc + (curr.avgPrice || 0), 0) /
      filtered.length;

    // 3. Vintage Specific Logic
    const availableVintages = [...new Set(filtered.map((item) => item.vintage))]
      .filter(Boolean)
      .sort();

    // Auto-select first vintage if none selected or selection invalid
    const activeVintage =
      selectedVintage && availableVintages.includes(selectedVintage)
        ? selectedVintage
        : availableVintages[0] || '';

    const vintageEntries = filtered.filter((f) => f.vintage === activeVintage);
    const vintageAvgPrice =
      vintageEntries.length > 0
        ? vintageEntries.reduce((acc, curr) => acc + (curr.avgPrice || 0), 0) /
          vintageEntries.length
        : 0;

    // 4. Premium vs Discount Calculation
    const priceDiffPercent =
      currentPrice > 0
        ? ((vintageAvgPrice - currentPrice) / currentPrice) * 100
        : 0;

    // 5. Monthly Comparison Logic (Previous Month)
    const prevMonthIdx = getMonthOrder(selectedMonth);
    const prevMonthName =
      prevMonthIdx > 0
        ? [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ][prevMonthIdx - 1]
        : null;

    const prevFiltered = data.filter((item) => {
      return (
        (item.country || '').toLowerCase().trim() === selCountry &&
        item.month === prevMonthName &&
        (reFilter === 'All' || item.isRE100 === reFilter)
      );
    });

    const prevPrice =
      prevFiltered.length > 0
        ? prevFiltered.reduce((acc, curr) => acc + (curr.avgPrice || 0), 0) /
          prevFiltered.length
        : currentPrice;

    const trendDiff = currentPrice - prevPrice;

    return {
      avgPrice: currentPrice,
      vintageAvgPrice,
      activeVintage,
      availableVintages,
      priceDiffPercent,
      totalRecords: filtered.reduce((acc, curr) => acc + (curr.count || 0), 0),
      pStatus:
        trendDiff > 0.05
          ? 'UPWARD'
          : trendDiff < -0.05
            ? 'DECLINING'
            : 'STEADY',
      pricingDesc: `Market price is ${trendDiff > 0.05 ? 'upward' : trendDiff < -0.05 ? 'declining' : 'stable'} compared to ${prevMonthName || 'last month'}.`,
      oStatus: trendDiff >= 0 ? 'BULLISH' : 'CAUTIOUS',
      lStatus: filtered.length > 5 ? 'HIGH' : 'MODERATE',
      technologies: [
        ...new Set(
          filtered.flatMap((item) => {
            const raw = item.Technology || item.technology || 'I-REC';
            return raw.replace(/[()]/g, '').split('/');
          }),
        ),
      ].filter(Boolean),
    };
  }, [data, selectedCountry, selectedMonth, reFilter, selectedVintage]);

  if (loading)
    return (
      <Flex justify="center" align="center" h="100vh" bg={bg}>
        <Spinner size="xl" color="green.400" thickness="4px" />
      </Flex>
    );

  return (
    <Box
      pt={{ base: '100px', md: '110px' }}
      px={{ base: '10px', md: '20px' }}
      bg={bg}
      minH="100vh"
    >
      <Card
        p={{ base: '15px', md: '25px' }}
        borderRadius="24px"
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        boxShadow="xl"
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          mb="25px"
          align={{ base: 'start', md: 'center' }}
          gap={4}
        >
          <Box>
            <Text
              fontSize={{ base: 'xl', md: '2xl' }}
              fontWeight="700"
              color={textColor}
            >
              Hestiya Market Intelligence
            </Text>
            <HStack color="gray.500" spacing={1}>
              <Icon as={MdFilterList} />
              <Text fontSize="xs">Global I-REC Analytics</Text>
            </HStack>
          </Box>

          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={3}
            w={{ base: '100%', md: 'auto' }}
          >
            <Select
              size="sm"
              value={reFilter}
              onChange={(e) => setReFilter(e.target.value)}
              borderRadius="10px"
              fontWeight="600"
              borderColor="green.400"
              border="2px solid"
            >
              <option value="All">All Types</option>
              <option value="Yes">RE100 Only</option>
              <option value="No">Non-RE Only</option>
            </Select>

            <Select
              size="sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              borderRadius="10px"
            >
              {allMonths.map((m) => (
                <option key={m} value={m} style={{ color: 'black' }}>
                  {m}
                </option>
              ))}
            </Select>

            <Select
              size="sm"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              borderColor="green.400"
              borderWidth="2px"
              borderRadius="10px"
            >
              {allCountries.map((c) => (
                <option key={c} value={c} style={{ color: 'black' }}>
                  {c}
                </option>
              ))}
            </Select>
          </Stack>
        </Flex>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          {/* Map Section */}
          <Box
            h={{ base: '350px', md: '550px' }}
            flex="2"
            borderRadius="24px"
            overflow="hidden"
            border="2px solid"
            borderColor="green.500"
            position="relative"
            zIndex={0}
          >
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={3}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
              // Isko true rakhein taaki map responsive rahe
              scrollWheelZoom={true}
            >
              {/* WAPAS PURANA SATELLITE MAP URL */}
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

              <ChangeView selectedCountry={selectedCountry} geoData={geoData} />

              {geoData && (
                <GeoJSON
                  key={`geo-${selectedCountry}`} // Static key ya stable key use karein
                  data={geoData}
                  style={(f) => {
                    const geoName = (
                      f.properties?.name ||
                      f.id ||
                      ''
                    ).toLowerCase();
                    const selName = selectedCountry.toLowerCase().trim();

                    // Improved Matching Logic
                    const isMatch =
                      geoName === selName ||
                      (selName === 'sri lanka' &&
                        (geoName.includes('sri lanka') || f.id === 'LKA')) ||
                      (selName === 'uae' &&
                        (geoName.includes('emirates') || f.id === 'ARE'));

                    return {
                      fillColor: isMatch
                        ? reFilter === 'No'
                          ? '#3182CE'
                          : '#239758'
                        : 'transparent',
                      weight: isMatch ? 2 : 0.1,
                      color: isMatch ? '#ADFF2F' : 'rgba(255,255,255,0.2)',
                      fillOpacity: isMatch ? 0.6 : 0,
                    };
                  }}
                />
              )}
            </MapContainer>
          </Box>

          {/* Side Info Panel */}
          <Box
            flex="1"
            bg={sidePanelBg}
            p={{ base: '20px', md: '20px' }}
            borderRadius="24px"
            border="1px solid"
            borderColor={borderColor}
          >
            {selectedInfo ? (
              <Stack spacing={5}>
                <Flex justify="space-between" align="center">
                  <Badge
                    colorScheme={
                      reFilter === 'Yes'
                        ? 'green'
                        : reFilter === 'No'
                          ? 'blue'
                          : 'gray'
                    }
                    px="3"
                    py="0.5"
                    borderRadius="full"
                    fontSize="2xs"
                  >
                    {reFilter === 'All'
                      ? 'Live Market'
                      : reFilter === 'Yes'
                        ? 'RE100 Certified'
                        : 'Non-RE Market'}
                  </Badge>

                  <HStack spacing={1} color="gray.500">
                    <Icon as={MdCalendarToday} boxSize={3} />
                    <Text fontSize="2xs" fontWeight="bold">
                      {selectedMonth} {selectedInfo.activeVintage}
                    </Text>
                  </HStack>
                </Flex>

                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Region
                  </Text>
                  <Text
                    fontSize={{ base: '2xl', md: '4xl' }}
                    color="green.400"
                    fontWeight="800"
                  >
                    {selectedCountry}
                  </Text>
                </Box>

                <Divider />

                {/* Section 1: Market Average Price */}
                <Box>
                  <Text fontSize="xs" color="gray.500" mb={0}>
                    Market Average (All Vintages)
                  </Text>
                  <Text
                    color={useColorModeValue('gray.700', 'white')}
                    fontSize={{ base: '2xl', md: '2xl' }}
                    fontWeight="700"
                    lineHeight="1"
                  >
                    ${selectedInfo.avgPrice.toFixed(2)}
                  </Text>
                  <Text fontSize="2xs" color="gray.400" mt={1}>
                    Based on {selectedInfo.totalRecords} Suppliers
                  </Text>
                </Box>

                {/* Section 2: Vintage Specific Card */}
                <Box
                  p={2}
                  bg={useColorModeValue('white', 'whiteAlpha.50')}
                  borderRadius="20px"
                  border="1px solid"
                  borderColor="green.100"
                  boxShadow="sm"
                >
                  <Flex justify="space-between" align="center" mb={3}>
                    <Text fontSize="xs" fontWeight="bold" color="gray.600">
                      VINTAGE RATE
                    </Text>
                    <Select
                      size="xs"
                      w="100px"
                      borderRadius="8px"
                      bg={useColorModeValue('gray.50', 'navy.800')}
                      value={selectedInfo.activeVintage}
                      onChange={(e) => setSelectedVintage(e.target.value)}
                    >
                      {selectedInfo.availableVintages.map((v) => (
                        <option key={v} value={v} style={{ color: 'black' }}>
                          {v}
                        </option>
                      ))}
                    </Select>
                  </Flex>

                  <HStack align="baseline" spacing={2} mb={1}>
                    <Text fontSize="3xl" fontWeight="900" color="green.500">
                      ${selectedInfo.vintageAvgPrice.toFixed(2)}
                    </Text>
                  </HStack>
                  <Text fontSize="2xs" color="gray.400" fontWeight="bold">
                    USD/MWh
                  </Text>
                </Box>

                {/* Section 3: Technologies */}
                <Box>
                  <Text
                    fontSize="2xs"
                    fontWeight="bold"
                    color="gray.500"
                    mb="2"
                  >
                    TECHNOLOGIES
                  </Text>
                  <SimpleGrid columns={{ base: 1, sm: 2, lg: 1 }} spacing={2}>
                    {selectedInfo.technologies.map((tech, i) => (
                      <Flex
                        key={i}
                        p="8px 12px"
                        bg={cardBg}
                        borderRadius="10px"
                        border="1px solid"
                        borderColor="green.100"
                        align="center"
                      >
                        <Icon
                          as={MdBolt}
                          color="green.400"
                          boxSize={3}
                          mr={2}
                        />
                        <Text fontSize="xs" fontWeight="700" color={textColor}>
                          {tech}
                        </Text>
                      </Flex>
                    ))}
                  </SimpleGrid>
                </Box>
              </Stack>
            ) : (
              <Flex
                h="300px"
                align="center"
                justify="center"
                direction="column"
              >
                <Icon as={MdPublic} boxSize={10} color="gray.300" mb={3} />
                <Text fontSize="sm" fontWeight="bold" color="gray.500">
                  No Market Data Available
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>

        {selectedInfo && (
          <Box mt="30px">
            <Divider mb="25px" borderColor={borderColor} />
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              spacing={{ base: 4, md: 6 }}
            >
              <SentimentCard
                title="Pricing Trend"
                status={selectedInfo.pStatus}
                color={
                  selectedInfo.pStatus === 'UPWARD'
                    ? 'green.400'
                    : selectedInfo.pStatus === 'DECLINING'
                      ? 'red.400'
                      : 'blue.400'
                }
                desc={selectedInfo.pricingDesc}
              />
              <SentimentCard
                title="Market Outlook"
                status={selectedInfo.oStatus}
                color={
                  selectedInfo.oStatus === 'BULLISH'
                    ? 'green.400'
                    : 'orange.400'
                }
                desc={`The market outlook for ${selectedCountry} is ${selectedInfo.oStatus.toLowerCase()} based on current trends.`}
              />
              <SentimentCard
                title="Liquidity"
                status={selectedInfo.lStatus}
                color={
                  selectedInfo.lStatus === 'HIGH' ? 'purple.400' : 'gray.400'
                }
                desc={`${selectedInfo.lStatus} trading activity observed with ${selectedInfo.totalRecords} active records.`}
              />
            </SimpleGrid>
          </Box>
        )}
      </Card>
    </Box>
  );
}

function SentimentCard({ title, status, color, desc }) {
  const sidePanelBg = useColorModeValue('gray.50', '#1B254B');
  const borderColor = useColorModeValue('gray.200', '#222E5F');
  return (
    <Box
      p="20px"
      borderRadius="20px"
      bg={sidePanelBg}
      border="1px solid"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" top="0" left="0" w="4px" h="100%" bg={color} />
      <HStack mb="10px" justify="space-between">
        <Text fontSize="2xs" fontWeight="bold" color="gray.500">
          {title}
        </Text>
        <Badge
          colorScheme={color.split('.')[0]}
          variant="subtle"
          fontSize="2xs"
        >
          {status}
        </Badge>
      </HStack>
      <Text fontSize="xs" color="gray.500" lineHeight="short">
        {desc}
      </Text>
    </Box>
  );
}
