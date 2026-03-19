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

// Market Sentiment Data
const marketOverviewData = {
  India: {
    pricing: 'Current pricing for India I-RECs is slightly declining.',
    outlook: 'Market sentiment remains cautious.',
    liquidity: 'High trading activity.',
    pStatus: 'DECLINING',
    oStatus: 'CAUTIOUS',
    lStatus: 'HIGH',
  },
  Singapore: {
    pricing: 'Current pricing for Singapore I-RECs remains stable.',
    outlook: 'Market outlook is stable.',
    liquidity: 'Low trading activity.',
    pStatus: 'STABLE',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Vietnam: {
    pricing: 'Current pricing for Vietnam I-RECs remains steady.',
    outlook: 'Market outlook remains stable.',
    liquidity: 'Low liquidity.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Pakistan: {
    pricing: 'Current pricing for Pakistan I-RECs remains steady.',
    outlook: 'Market outlook is stable.',
    liquidity: 'Low trading activity.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Malaysia: {
    pricing: 'Current pricing for Malaysia I-RECs remains stable.',
    outlook: 'Market outlook remains balanced.',
    liquidity: 'Low liquidity.',
    pStatus: 'STABLE',
    oStatus: 'BALANCED',
    lStatus: 'LOW',
  },
  Bangladesh: {
    pricing: 'Current pricing for Bangladesh I-RECs remains steady.',
    outlook: 'Market outlook remains stable.',
    liquidity: 'Low trading activity.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  'Sri Lanka': {
    pricing: 'Current pricing for Sri Lanka I-RECs remains stable.',
    outlook: 'Market outlook remains stable.',
    liquidity: 'Low liquidity.',
    pStatus: 'STABLE',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Philippines: {
    pricing: 'Current pricing for Philippines I-RECs remains steady.',
    outlook: 'Market outlook remains stable.',
    liquidity: 'Low trading activity.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Thailand: {
    pricing: 'Current pricing for Thailand I-RECs remains stable.',
    outlook: 'Market outlook remains stable.',
    liquidity: 'Low liquidity.',
    pStatus: 'STABLE',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Taiwan: {
    pricing: 'Current pricing for Taiwan I-RECs remains steady.',
    outlook: 'Market outlook remains stable.',
    liquidity: 'Low trading activity.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Indonesia: {
    pricing: 'Current pricing for Indonesia I-RECs shows an upward trend.',
    outlook: 'Market outlook remains bullish.',
    liquidity: 'Moderate trading activity.',
    pStatus: 'UPWARD',
    oStatus: 'BULLISH',
    lStatus: 'MODERATE',
  },
  Nepal: {
    pricing: 'Current pricing for Nepal I-RECs shows a slight decline.',
    outlook: 'Market outlook remains bearish.',
    liquidity: 'Low trading activity.',
    pStatus: 'DECLINING',
    oStatus: 'BEARISH',
    lStatus: 'LOW',
  },
};

function ChangeView({ selectedCountry, geoData }) {
  const map = useMap();
  useEffect(() => {
    if (geoData && selectedCountry) {
      const selName = selectedCountry.toLowerCase().trim();
      if (selName === 'singapore') {
        map.setView([1.3521, 103.8198], 11, { animate: true });
        return;
      }
      const feature = geoData.features.find((f) => {
        const geoName = (f.properties?.name || '').toLowerCase();
        return (
          geoName === selName ||
          (selName === 'uae' && geoName === 'united arab emirates') ||
          (selName === 'sri lanka' && geoName === 'sri lanka')
        );
      });
      if (feature) {
        map.flyToBounds(L.geoJson(feature).getBounds(), {
          padding: [30, 30],
          duration: 1.5,
        });
      }
    }
  }, [selectedCountry, geoData, map]);
  return null;
}

export default function MarketMapLeaflet() {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedMonth, setSelectedMonth] = useState('February'); // Default to February as per your Postman data
  const [reFilter, setReFilter] = useState('All');

  const bg = useColorModeValue('#F4F7FE', '#0B1437');
  const cardBg = useColorModeValue('white', '#111C44');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', '#222E5F');
  const sidePanelBg = useColorModeValue('gray.50', '#1B254B');

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
    const filtered = data.filter((item) => {
      const itemCountry = (item.country || '').toLowerCase().trim();
      const selCountry = selectedCountry.toLowerCase().trim();
      const itemMonth = item.month || '';

      const basicMatch =
        itemCountry === selCountry && itemMonth === selectedMonth;
      if (!basicMatch) return false;

      if (reFilter === 'All') return true;
      // Matching Postman output: "Yes" or "No"
      return item.isRE100 === reFilter;
    });

    if (filtered.length === 0) return null;

    // Aggregate average price if multiple entries exist for a filter
    const totalRate = filtered.reduce(
      (acc, curr) => acc + (curr.avgPrice || 0),
      0,
    );
    const totalCount = filtered.reduce(
      (acc, curr) => acc + (curr.count || 0),
      0,
    );

    return {
      avgPrice: totalRate / filtered.length,
      totalRecords: totalCount,
      vintages: [...new Set(filtered.map((item) => item.vintage))]
        .filter(Boolean)
        .sort(),
      technologies: [
        ...new Set(
          filtered.flatMap((item) => {
            // 1. Agar field 'technology' ya 'Technology' (Case sensitive) dono mein se koi bhi ho
            const techRaw = item.technology || item.Technology || 'I-REC';

            // 2. Cleaning: Brackets, Quotes aur extra spaces hatao
            // Yeh regex "(Wind/Solar)" ko "Wind/Solar" bana dega
            const cleanTech = techRaw.replace(/[()]/g, '').trim();

            // 3. Agar string ke andar "/" hai (jaise Wind/Solar), toh unhe alag-alag karke array bana do
            return cleanTech.includes('/') ? cleanTech.split('/') : cleanTech;
          }),
        ),
      ].filter(Boolean), // Empty values filter karne ke liye
    };
  }, [data, selectedCountry, selectedMonth, reFilter]);

  const currentOverview = useMemo(
    () =>
      marketOverviewData[selectedCountry] || {
        pricing: `Current pricing for ${selectedCountry} remains steady.`,
        outlook: 'Market outlook remains stable.',
        liquidity: 'Low trading activity observed.',
        pStatus: 'STEADY',
        oStatus: 'STABLE',
        lStatus: 'LOW',
      },
    [selectedCountry],
  );

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
            >
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <ChangeView selectedCountry={selectedCountry} geoData={geoData} />
              {geoData && (
                <GeoJSON
                  key={`${selectedCountry}-${selectedMonth}-${reFilter}`}
                  data={geoData}
                  style={(f) => {
                    const isMatch =
                      (f.properties?.name || '').toLowerCase() ===
                      selectedCountry.toLowerCase().trim();
                    return {
                      fillColor: isMatch
                        ? reFilter === 'No'
                          ? '#3182CE'
                          : '#239758'
                        : 'transparent',
                      weight: isMatch ? 2 : 0.1,
                      color: isMatch ? '#ADFF2F' : 'rgba(255,255,255,0.05)',
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
            p={{ base: '20px', md: '30px' }}
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

                  {/* Existing Calendar Feature */}
                  <HStack spacing={1} color="gray.500">
                    <Icon as={MdCalendarToday} boxSize={3} />
                    <Text fontSize="2xs" fontWeight="bold">
                      {selectedMonth} {selectedInfo.vintages[0] || '2026'}
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

                <Box>
                  {/* Label aur Vintage Badge */}
                  <HStack spacing={2} mb={1}>
                    <Text fontSize="xs" color="gray.500">
                      Average Rate
                    </Text>
                    {selectedInfo.vintages.length > 0 && (
                      <Badge
                        colorScheme="purple"
                        fontSize="10px"
                        variant="solid"
                        borderRadius="full"
                        px={2}
                      >
                        Vintage: {selectedInfo.vintages.join(', ')}
                      </Badge>
                    )}
                  </HStack>

                  <Text
                    color="#239758"
                    fontSize={{ base: '4xl', md: '6xl' }}
                    fontWeight="900"
                    lineHeight="1"
                  >
                    ${selectedInfo.avgPrice.toFixed(2)}
                  </Text>

                  <Text fontSize="2xs" color="gray.400" mt={1}>
                    Based on {selectedInfo.totalRecords} Suppliers
                  </Text>
                </Box>

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
                h="200px"
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
                status={currentOverview.pStatus}
                color={
                  currentOverview.pStatus === 'UPWARD'
                    ? 'green.400'
                    : currentOverview.pStatus === 'DECLINING'
                      ? 'red.400'
                      : 'blue.400'
                }
                desc={currentOverview.pricing}
              />
              <SentimentCard
                title="Market Outlook"
                status={currentOverview.oStatus}
                color={
                  currentOverview.oStatus === 'BULLISH'
                    ? 'green.400'
                    : currentOverview.oStatus === 'BEARISH'
                      ? 'red.400'
                      : 'orange.400'
                }
                desc={currentOverview.outlook}
              />
              <SentimentCard
                title="Liquidity"
                status={currentOverview.lStatus}
                color={
                  currentOverview.lStatus === 'HIGH' ? 'purple.400' : 'gray.400'
                }
                desc={currentOverview.liquidity}
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
