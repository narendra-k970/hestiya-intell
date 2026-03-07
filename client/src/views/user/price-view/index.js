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
  VStack,
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

// --- DATA OBJECT (Wahi jo aapne diya tha) ---
const marketOverviewData = {
  India: {
    pricing: 'Current pricing for India I-RECs is slightly declining.',
    outlook: 'Market sentiment remains cautious with limited buying activity.',
    liquidity: 'High trading activity observed in the market.',
    pStatus: 'DECLINING',
    oStatus: 'CAUTIOUS',
    lStatus: 'HIGH',
  },
  Singapore: {
    pricing: 'Current pricing for Singapore I-RECs remains stable.',
    outlook: 'Market outlook is stable with balanced demand and supply.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'STABLE',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Vietnam: {
    pricing: 'Current pricing for Vietnam I-RECs remains steady.',
    outlook: 'Market outlook remains stable with moderate interest.',
    liquidity: 'Low liquidity observed in the market.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Pakistan: {
    pricing: 'Current pricing for Pakistan I-RECs remains steady.',
    outlook: 'Market outlook is stable with limited transactions.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Malaysia: {
    pricing: 'Current pricing for Malaysia I-RECs remains stable.',
    outlook: 'Market outlook remains balanced with steady demand.',
    liquidity: 'Low liquidity observed in the market.',
    pStatus: 'STABLE',
    oStatus: 'BALANCED',
    lStatus: 'LOW',
  },
  Bangladesh: {
    pricing: 'Current pricing for Bangladesh I-RECs remains steady.',
    outlook: 'Market outlook remains stable with limited market movement.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  'Sri Lanka': {
    pricing: 'Current pricing for Sri Lanka I-RECs remains stable.',
    outlook: 'Market outlook remains stable with limited demand.',
    liquidity: 'Low liquidity observed in the market.',
    pStatus: 'STABLE',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Philippines: {
    pricing: 'Current pricing for Philippines I-RECs remains steady.',
    outlook: 'Market outlook remains stable with moderate activity.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Thailand: {
    pricing: 'Current pricing for Thailand I-RECs remains stable.',
    outlook: 'Market outlook remains stable with balanced interest.',
    liquidity: 'Low liquidity observed in the market.',
    pStatus: 'STABLE',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Taiwan: {
    pricing: 'Current pricing for Taiwan I-RECs remains steady.',
    outlook: 'Market outlook remains stable with limited transactions.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Indonesia: {
    pricing: 'Current pricing for Indonesia I-RECs shows an upward trend.',
    outlook: 'Market outlook remains bullish with increasing demand.',
    liquidity: 'Moderate trading activity observed in the market.',
    pStatus: 'UPWARD',
    oStatus: 'BULLISH',
    lStatus: 'MODERATE',
  },
  Nepal: {
    pricing: 'Current pricing for Nepal I-RECs shows a slight decline.',
    outlook: 'Market outlook remains bearish due to limited demand.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'DECLINING',
    oStatus: 'BEARISH',
    lStatus: 'LOW',
  },
  Chile: {
    pricing: 'Current pricing for Chile I-RECs remains stable.',
    outlook: 'Market outlook remains balanced with steady demand.',
    liquidity: 'Low liquidity observed in the market.',
    pStatus: 'STABLE',
    oStatus: 'BALANCED',
    lStatus: 'LOW',
  },
  Peru: {
    pricing: 'Current pricing for Peru I-RECs remains steady.',
    outlook: 'Market outlook remains stable with moderate interest.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Israel: {
    pricing: 'Current pricing for Israel I-RECs remains stable.',
    outlook: 'Market outlook remains stable with balanced demand.',
    liquidity: 'Low liquidity observed in the market.',
    pStatus: 'STABLE',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Turkey: {
    pricing: 'Current pricing for Turkey I-RECs remains steady.',
    outlook: 'Market outlook remains stable with moderate demand.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Kazakhstan: {
    pricing: 'Current pricing for Kazakhstan I-RECs remains stable.',
    outlook: 'Market outlook remains stable with limited activity.',
    liquidity: 'Low liquidity observed in the market.',
    pStatus: 'STABLE',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
  Uzbekistan: {
    pricing: 'Current pricing for Uzbekistan I-RECs remains steady.',
    outlook: 'Market outlook remains stable with balanced demand.',
    liquidity: 'Low trading activity observed in the market.',
    pStatus: 'STEADY',
    oStatus: 'STABLE',
    lStatus: 'LOW',
  },
};

function ChangeView({ selectedCountry, geoData }) {
  const map = useMap();
  useEffect(() => {
    if (geoData && selectedCountry) {
      const feature = geoData.features.find((f) => {
        const geoName = (f.properties?.name || '').toLowerCase();
        const selName = selectedCountry.toLowerCase().replace(/-/g, ' ');
        return (
          geoName === selName ||
          (selName === 'kazakhstan' && geoName === 'kazakstan') ||
          (selName === 'uae' && geoName === 'united arab emirates')
        );
      });
      if (feature) {
        const geoJsonLayer = L.geoJson(feature);
        map.flyToBounds(geoJsonLayer.getBounds(), {
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
  const [selectedMonth, setSelectedMonth] = useState('January');

  const bg = useColorModeValue('#F4F7FE', '#0B1437');
  const cardBg = useColorModeValue('white', '#111C44');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', '#222E5F');
  const sidePanelBg = useColorModeValue('gray.50', '#1B254B');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [res, geoRes] = await Promise.all([
          api.get('/pricing/country-avg'),
          axios.get(
            'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
          ),
        ]);
        setData(res.data.data || []);
        setGeoData(geoRes.data);
      } catch (err) {
        console.error('Fetch Error:', err);
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

  const selectedInfo = useMemo(() => {
    const filtered = data.filter(
      (item) =>
        (item.country || '').toLowerCase().trim() ===
          selectedCountry.toLowerCase() && item.month === selectedMonth,
    );
    if (filtered.length === 0) return null;
    return {
      avgPrice:
        filtered.reduce(
          (acc, curr) => acc + parseFloat(curr.avgPrice || 0),
          0,
        ) / filtered.length,
      count: filtered.length,
      technologies: [
        ...new Set(filtered.map((item) => item.Technology || 'Solar/Wind')),
      ],
    };
  }, [data, selectedCountry, selectedMonth]);

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
        <Spinner size="xl" color="green.400" />
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
        {/* RESPONSIVE HEADER & FILTERS */}
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
              I-REC Price Analytics
            </Text>
            <HStack color="gray.500" spacing={1}>
              <Icon as={MdFilterList} />
              <Text fontSize="xs">Satellite Territorial Map</Text>
            </HStack>
          </Box>
          <Stack
            direction={{ base: 'column', sm: 'row' }}
            spacing={3}
            w={{ base: '100%', md: 'auto' }}
          >
            <Select
              w={{ base: '100%', sm: '140px' }}
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
              w={{ base: '100%', sm: '180px' }}
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
          {/* MAP BOX - ADJUSTED HEIGHT FOR MOBILE */}
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
                  key={`${selectedCountry}-${selectedMonth}`}
                  data={geoData}
                  style={(f) => {
                    const geoName = (f.properties?.name || '').toLowerCase();
                    const isMatch =
                      geoName ===
                      selectedCountry.toLowerCase().replace(/-/g, ' ');
                    return {
                      fillColor: isMatch ? '#239758' : 'transparent',
                      weight: isMatch ? 2 : 0.1,
                      color: isMatch ? '#ADFF2F' : 'rgba(255,255,255,0.05)',
                      fillOpacity: isMatch ? 0.6 : 0,
                    };
                  }}
                />
              )}
            </MapContainer>
          </Box>

          {/* SIDE INFO PANEL */}
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
                    colorScheme="green"
                    px="3"
                    py="0.5"
                    borderRadius="full"
                    fontSize="2xs"
                  >
                    Live Market
                  </Badge>
                  <HStack spacing={1} color="gray.500">
                    <Icon as={MdCalendarToday} boxSize={3} />
                    <Text fontSize="2xs" fontWeight="bold">
                      {selectedMonth} 2026
                    </Text>
                  </HStack>
                </Flex>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Selected Region
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
                  <Text fontSize="xs" color="gray.500">
                    Average Rate
                  </Text>
                  {/* RESPONSIVE FONT SIZE FOR PRICE */}
                  <Text
                    color="#239758"
                    fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
                    fontWeight="900"
                    lineHeight="1"
                  >
                    ${selectedInfo.avgPrice.toFixed(2)}
                  </Text>
                  <Text fontSize="2xs" color="gray.400" mt={1}>
                    Based on {selectedInfo.count} points
                  </Text>
                </Box>
                <Box>
                  <Text
                    fontSize="2xs"
                    fontWeight="bold"
                    color="gray.500"
                    mb="2"
                  >
                    AVAILABLE TECHNOLOGIES
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
                        <HStack>
                          <Icon as={MdBolt} color="green.400" boxSize={3} />
                          <Text
                            fontSize="xs"
                            fontWeight="700"
                            color={textColor}
                          >
                            {tech}
                          </Text>
                        </HStack>
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
                  No Data Found
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>

        {/* RESPONSIVE MARKET OVERVIEW CARDS */}
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
      p={{ base: '15px', md: '25px' }}
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
