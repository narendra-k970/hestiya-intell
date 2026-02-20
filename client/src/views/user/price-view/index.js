/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import {
  Box,
  Text,
  Flex,
  Spinner,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  Card,
  Divider,
  Badge,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';
// 1. Apna custom api instance aur default axios dono rakhen
import api from '../../../utils/axiosConfig';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 4, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

const countryCoords = {
  India: [20.5937, 78.9629],
  Nepal: [28.3949, 84.124],
  Indonesia: [-0.7893, 113.9213],
  Taiwan: [23.6978, 120.9605],
  Singapore: [1.3521, 103.8198],
  Vietnam: [14.0583, 108.2772],
  Pakistan: [30.3753, 69.3451],
  Malaysia: [4.2105, 101.9758],
  Bangladesh: [23.685, 90.3563],
  'Sri Lanka': [7.8731, 80.7718],
  Philippines: [12.8797, 121.774],
  Thailand: [15.87, 100.9925],
};

export default function MarketMapLeaflet() {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState('India');

  const bg = useColorModeValue('white', '#0B1437');
  const cardBg = useColorModeValue('white', '#111C44');
  const sidePanelBg = useColorModeValue('gray.50', '#1B254B');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.200', '#222E5F');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 2. Pricing Data hamare backend se aa raha hai -> Use 'api'
        const res = await api.get('/pricing/country-avg');
        setData(res.data.data);

        // 3. GeoJSON external source se hai -> Use 'axios' (direct)
        const geoRes = await axios.get(
          'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
        );
        setGeoData(geoRes.data);
      } catch (err) {
        console.error('Data Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const selectedInfo = data.find((d) => d._id === selectedCountry);
  const mapCenter = countryCoords[selectedCountry] || [20, 80];

  if (loading)
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="green.400" />
      </Flex>
    );

  return (
    <Box pt="80px" px="20px" bg={bg} minH="100vh">
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
            <Text fontSize="sm" color="gray.500">
              Live pricing map
            </Text>
          </Box>
          <Select
            w="300px"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            borderColor="green.400"
            borderWidth="2px"
            fontWeight="bold"
            _hover={{ borderColor: 'green.500' }}
          >
            {data.map((item) => (
              <option key={item._id} value={item._id}>
                {item._id}
              </option>
            ))}
          </Select>
        </Flex>

        <Flex direction={{ base: 'column', lg: 'row' }} gap={6}>
          <Box
            h="550px"
            flex="2"
            borderRadius="24px"
            overflow="hidden"
            border="2px solid"
            borderColor="green.500"
          >
            <MapContainer
              center={mapCenter}
              zoom={4}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <ChangeView center={mapCenter} />

              {geoData && (
                <GeoJSON
                  key={selectedCountry}
                  data={geoData}
                  style={(feature) => {
                    const countryName =
                      feature.properties?.ADMIN ||
                      feature.properties?.name ||
                      '';
                    const isSelected =
                      countryName &&
                      selectedCountry &&
                      countryName.toLowerCase() ===
                        selectedCountry.toLowerCase();

                    return {
                      fillColor: isSelected ? '#239758' : 'transparent',
                      weight: isSelected ? 2 : 0,
                      color: isSelected ? '#ADFF2F' : 'transparent',
                      fillOpacity: isSelected ? 0.3 : 0,
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
                <Badge
                  alignSelf="start"
                  colorScheme="green"
                  variant="solid"
                  px="3"
                  py="1"
                  borderRadius="full"
                >
                  Active Market
                </Badge>
                <Stat>
                  <StatLabel color="gray.500">Region</StatLabel>
                  <StatNumber fontSize="4xl" color="green.400" fontWeight="800">
                    {selectedInfo._id}
                  </StatNumber>
                </Stat>

                <Divider />

                <Stat>
                  <StatLabel color="gray.500">Avg Market Price</StatLabel>
                  <StatNumber
                    color="#239758"
                    fontSize="5xl"
                    fontWeight="900"
                    textShadow="0 0 15px rgba(173, 255, 47, 0.4)"
                  >
                    $
                    {selectedInfo.avgPrice
                      ? selectedInfo.avgPrice.toFixed(2)
                      : '0.00'}
                  </StatNumber>
                  <Text fontSize="xs" color="gray.500" mt="1">
                    USD PER I-REC UNIT
                  </Text>
                </Stat>

                <Box>
                  <Text
                    fontSize="xs"
                    fontWeight="bold"
                    color="gray.500"
                    mb="3"
                    letterSpacing="widest"
                  >
                    TECH MIX
                  </Text>
                  <Flex wrap="wrap" gap={2}>
                    {selectedInfo.types?.map((type, i) => (
                      <Badge
                        key={i}
                        bg="green.900"
                        color="green.100"
                        border="1px solid"
                        borderColor="green.600"
                        px="3"
                        py="1"
                      >
                        {type.replace(/[()]/g, '').trim()}
                      </Badge>
                    ))}
                  </Flex>
                </Box>
              </Stack>
            ) : (
              <Flex h="100%" align="center" justify="center">
                <Spinner color="green.400" />
              </Flex>
            )}
          </Box>
        </Flex>
      </Card>

      <style>{`
        .leaflet-interactive {
          filter: drop-shadow(0 0 8px #239758);
          transition: filter 0.5s ease-in-out;
        }
      `}</style>
    </Box>
  );
}
