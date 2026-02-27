/* eslint-disable */
import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
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
  RadioGroup,
  Radio,
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

// 1. Coordinates Definition
const countryCoords = {
  India: [20.5937, 78.9629],
  Nepal: [28.3949, 84.124],
  Indonesia: [-0.7893, 113.9213],
  Taiwan: [23.6978, 120.9605],
  Thailand: [15.87, 100.9925],
  Vietnam: [14.0583, 108.2772],
  Pakistan: [30.3753, 69.3451],
  Malaysia: [4.2105, 101.9758],
  Bangladesh: [23.685, 90.3563],
  'Sri Lanka': [7.8731, 80.7718],
  'Sri-Lanka': [7.8731, 80.7718],
  Philippines: [12.8797, 121.774],
  Israel: [31.0461, 34.8516],
  kazakhstan: [48.0196, 66.9237],
  Kazakistan: [48.0196, 66.9237],
  Singapore: [1.3521, 103.8198],
  China: [35.8617, 104.1954],
  Turkey: [38.9637, 35.2433],
  UAE: [23.4241, 53.8478],
  'Saudi Arabia': [23.8859, 45.0792],
  Uzbekistan: [41.3775, 64.5853],
  Cambodia: [12.5657, 104.991],
  Japan: [36.2048, 138.2529],
  'South Korea': [35.9078, 127.7669],
  Laos: [19.8563, 102.4955],
};

const formatTechName = (name) => {
  if (!name) return null;
  return name.replace(/[()]/g, '').trim();
};

// 2. Map View Controller
function ChangeView({ center, country }) {
  const map = useMap();
  useEffect(() => {
    if (center && country) {
      let zoomLevel = 4;
      const safeName = String(country);
      if (safeName === 'Singapore') zoomLevel = 12;
      else if (safeName === 'Israel') zoomLevel = 7;
      else if (safeName.includes('Sri')) zoomLevel = 7;
      map.flyTo(center, zoomLevel, { duration: 1.5 });
    }
  }, [center, country, map]);
  return null;
}

export default function MarketMapLeaflet() {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [energyFilter, setEnergyFilter] = useState('ALL');

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
  useEffect(() => {
    if (data.length > 0) {
      console.log('Sample Data item:', data[0]);
      console.log('IsRE100 Type:', typeof data[0].isRE100);
      console.log('IsRE100 Value:', JSON.stringify(data[0].isRE100));
    }
  }, [data]);
  const allMonths = useMemo(() => {
    const months = [...new Set(data.map((item) => item.month))].filter(Boolean);
    return months.length > 0 ? months : ['January'];
  }, [data]);

  const allCountries = useMemo(() => {
    const countries = [...new Set(data.map((item) => item.country))]
      .filter(Boolean)
      .sort();
    return countries.length > 0 ? countries : Object.keys(countryCoords);
  }, [data]);

  const selectedInfo = useMemo(() => {
    const filtered = data.filter((item) => {
      const itemCountry = (item.Country || item.country || '')
        .toLowerCase()
        .trim();
      const itemMonth = (item.Month || item.month || '').trim();

      const matchC = itemCountry === selectedCountry.toLowerCase();
      const matchM = itemMonth === selectedMonth;

      return matchC && matchM; // Sirf Country aur Month match hona chahiye
    });

    if (filtered.length === 0) return null;

    const totalRate = filtered.reduce(
      (acc, curr) => acc + parseFloat(curr.Rate || curr.avgPrice || 0),
      0,
    );

    return {
      avgPrice: totalRate / filtered.length,
      count: filtered.length,
      technologies: [
        ...new Set(filtered.map((item) => item.Technology || 'Solar/Wind')),
      ],
    };
  }, [data, selectedCountry, selectedMonth]);

  const mapCenter = useMemo(() => {
    return countryCoords[selectedCountry] || [20.5937, 78.9629];
  }, [selectedCountry]);

  if (loading)
    return (
      <Flex justify="center" align="center" h="100vh" bg={bg}>
        <Spinner size="xl" color="green.400" />
      </Flex>
    );

  return (
    <Box pt={{ base: '130px', md: '110px' }} px="20px" bg={bg} minH="100vh">
      <Card
        p="25px"
        borderRadius="24px"
        bg={cardBg}
        border="1px solid"
        borderColor={borderColor}
        boxShadow="xl"
      >
        <Flex
          justify="space-between"
          mb="25px"
          align="center"
          wrap="wrap"
          gap={4}
        >
          <Box>
            <Text fontSize="2xl" fontWeight="700" color={textColor}>
              Market Analytics
            </Text>
            <HStack color="gray.500" spacing={1}>
              <Icon as={MdFilterList} />
              <Text fontSize="sm">Satellite Territorial Map</Text>
            </HStack>
          </Box>

          <HStack spacing={4} wrap="wrap">
            <Select
              w="150px"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              borderRadius="12px"
            >
              {allMonths.map((m) => (
                <option key={m} value={m} style={{ color: 'black' }}>
                  {m}
                </option>
              ))}
            </Select>
            {/* <RadioGroup onChange={setEnergyFilter} value={energyFilter}>
              <HStack
                bg={sidePanelBg}
                p={2}
                px={4}
                borderRadius="12px"
                border="1px solid"
                borderColor={borderColor}
              >
                <Radio value="ALL" colorScheme="green">
                  <Text fontSize="xs" fontWeight="bold">
                    ALL
                  </Text>
                </Radio>
                <Radio value="RE" colorScheme="green">
                  <Text fontSize="xs" fontWeight="bold">
                    RE100
                  </Text>
                </Radio>
                <Radio value="NON-RE" colorScheme="green">
                  <Text fontSize="xs" fontWeight="bold">
                    Non-RE
                  </Text>
                </Radio>
              </HStack>
            </RadioGroup> */}
            <Select
              w="200px"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              borderColor="green.400"
              borderWidth="2px"
              borderRadius="12px"
            >
              {allCountries.map((c) => (
                <option key={c} value={c} style={{ color: 'black' }}>
                  {c}
                </option>
              ))}
            </Select>
          </HStack>
        </Flex>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          <Box
            h="550px"
            flex="2"
            borderRadius="24px"
            overflow="hidden"
            border="2px solid"
            borderColor="green.500"
            position="relative"
            zIndex={0}
          >
            <MapContainer
              center={mapCenter}
              zoom={4}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <ChangeView center={mapCenter} country={selectedCountry} />
              {geoData && (
                <GeoJSON
                  key={`${selectedCountry}-${selectedMonth}-${energyFilter}`}
                  data={geoData}
                  style={(f) => {
                    const geoName = (f.properties?.name || '').toLowerCase();
                    const selName = (selectedCountry || '')
                      .toLowerCase()
                      .replace(/-/g, ' ');
                    const isMatch =
                      geoName === selName ||
                      (selName === 'kazakhstan' && geoName === 'kazakstan');
                    return {
                      fillColor: isMatch ? '#239758' : 'transparent',
                      weight: isMatch ? 3 : 0.2,
                      color: isMatch ? '#ADFF2F' : 'rgba(255,255,255,0.1)',
                      fillOpacity: isMatch ? 0.7 : 0,
                    };
                  }}
                />
              )}
            </MapContainer>
          </Box>

          <Box
            flex="1"
            bg={sidePanelBg}
            p="30px"
            borderRadius="24px"
            border="1px solid"
            borderColor={borderColor}
          >
            {selectedInfo ? (
              <Stack spacing={6}>
                <Flex justify="space-between" align="center">
                  <Badge colorScheme="green" px="3" py="1" borderRadius="full">
                    Live Market
                  </Badge>
                  <HStack spacing={1} color="gray.500">
                    <Icon as={MdCalendarToday} boxSize={3} />
                    <Text fontSize="xs" fontWeight="bold">
                      {selectedMonth} 2026
                    </Text>
                  </HStack>
                </Flex>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Selected Region
                  </Text>
                  <Text fontSize="4xl" color="green.400" fontWeight="800">
                    {selectedCountry}
                  </Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Average Rate
                  </Text>
                  <Text color="#239758" fontSize="6xl" fontWeight="900">
                    ${selectedInfo.avgPrice.toFixed(2)}
                  </Text>
                  <Text fontSize="xs" color="gray.400">
                    Based on {selectedInfo.count} points
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" fontWeight="bold" color="gray.500" mb="3">
                    AVAILABLE TECHNOLOGIES
                  </Text>
                  <Stack spacing={2}>
                    {selectedInfo.technologies.map((techName, i) => (
                      <Flex
                        key={i}
                        p="10px 15px"
                        bg={cardBg}
                        borderRadius="12px"
                        border="1px solid"
                        borderColor="green.100"
                        align="center"
                      >
                        <HStack>
                          <Icon as={MdBolt} color="green.400" />
                          <Text
                            fontSize="sm"
                            fontWeight="700"
                            color={textColor}
                          >
                            {techName}
                          </Text>
                        </HStack>
                      </Flex>
                    ))}
                  </Stack>
                </Box>
              </Stack>
            ) : (
              <Flex h="100%" align="center" justify="center" direction="column">
                <Icon as={MdPublic} boxSize={12} color="gray.300" mb={4} />
                <Text fontWeight="bold" color="gray.500">
                  No Data Points Found
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>

        {/* Sentiment Cards Section */}
        {selectedInfo && (
          <Box mt="30px">
            <Divider mb="25px" borderColor={borderColor} />
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <SentimentCard
                title="Pricing Trend"
                status="STEADY"
                color="blue.400"
                desc={`Current pricing for ${selectedCountry} is steady.`}
              />
              <SentimentCard
                title="Market Outlook"
                status="BULLISH"
                color="green.400"
                desc="Strategic accumulation of I-RECs observed."
              />
              <SentimentCard
                title="Liquidity"
                status="HIGH"
                color="orange.400"
                desc="High market liquidity observed."
              />
            </SimpleGrid>
          </Box>
        )}
      </Card>
    </Box>
  );
}

function SentimentCard({ title, status, color, desc }) {
  const textColor = useColorModeValue('gray.800', 'white');
  const sidePanelBg = useColorModeValue('gray.50', '#1B254B');
  const borderColor = useColorModeValue('gray.200', '#222E5F');
  return (
    <Box
      p="25px"
      borderRadius="20px"
      bg={sidePanelBg}
      border="1px solid"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      <Box position="absolute" top="0" left="0" w="4px" h="100%" bg={color} />
      <HStack mb="12px" justify="space-between">
        <Text fontSize="xs" fontWeight="bold" color="gray.500">
          {title}
        </Text>
        <Badge colorScheme={color.split('.')[0]} variant="subtle">
          {status}
        </Badge>
      </HStack>
      <Text fontSize="sm" color="gray.500" lineHeight="tall">
        {desc}
      </Text>
    </Box>
  );
}
