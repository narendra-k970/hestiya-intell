/* eslint-disable */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Box,
  Flex,
  Text,
  Spinner,
  useColorModeValue,
  Badge,
  VStack,
  SimpleGrid,
  Button,
  HStack,
  Card,
  Table,
  Tbody,
  Tr,
  Td,
  Thead,
  Th,
  Link,
  Icon,
  Select,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {
  MdWbSunny,
  MdAir,
  MdWaterDrop,
  MdForest,
  MdPublic,
  MdOpenInNew,
  MdSync,
} from 'react-icons/md';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import api from '../../../utils/axiosConfig';
import 'leaflet/dist/leaflet.css';

const BRAND_GREEN = '#048E3D';

const customStyles = `
  .leaflet-container { 
    z-index: 1 !important; 
    font-family: 'Inter', sans-serif !important; 
    border-radius: 18px; 
  }
  .custom-m { background: none !important; border: none !important; }
  
  .marker-cluster-small div, .marker-cluster-medium div, .marker-cluster-large div {
    background-color: ${BRAND_GREEN} !important; color: white !important; 
    font-weight: 700 !important; border-radius: 50% !important; 
    font-size: 11px !important; display: flex !important;
    align-items: center !important; justify-content: center !important;
    width: 32px !important; height: 32px !important;
  }
  .marker-cluster-small, .marker-cluster-medium, .marker-cluster-large {
    background-color: rgba(4, 142, 61, 0.2) !important; border-radius: 50% !important;
  }

  .leaflet-popup-content-wrapper { 
    border-radius: 12px !important; 
    min-width: 260px !important; 
    box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
  }
  .leaflet-popup-content { margin: 15px !important; }

  @keyframes spin { 100% { transform: rotate(360deg); } }
  .spin-icon { animation: spin 2s linear infinite; }
`;

const countryCoordinates = {
  India: [20.5937, 78.9629],
  'Sri Lanka': [7.8731, 80.7718],
  Vietnam: [14.0583, 108.2772],
  Thailand: [15.87, 100.9925],
  Brazil: [-14.235, -51.9253],
  Turkey: [38.9637, 35.2433],
  China: [35.8617, 104.1954],
  'United Arab Emirates': [23.4241, 53.8478],
};

const getTechConfig = (techName) => {
  const tech = String(techName || '').toLowerCase();
  if (tech.includes('solar')) return { icon: MdWbSunny, color: '#F6AD55' };
  if (tech.includes('wind')) return { icon: MdAir, color: '#4299E1' };
  if (tech.includes('hydro')) return { icon: MdWaterDrop, color: '#3182CE' };
  if (tech.includes('biomass')) return { icon: MdForest, color: BRAND_GREEN };
  return { icon: MdPublic, color: BRAND_GREEN };
};

const createLeafletIcon = (techName) => {
  const config = getTechConfig(techName);
  const iconHTML = renderToStaticMarkup(
    <div
      style={{
        color: 'white',
        backgroundColor: config.color || BRAND_GREEN,
        borderRadius: '50%',
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}
    >
      <config.icon size={14} />
    </div>,
  );
  return L.divIcon({
    html: iconHTML,
    className: 'custom-m',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function UserMarketDashboard() {
  const [allData, setAllData] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');
  const mapRef = useRef(null);

  const bg = useColorModeValue('#F4F7FE', '#0B1437');
  const cardBg = useColorModeValue('white', '#111C44');
  const tableHeadBg = useColorModeValue('gray.50', '#1B254B');
  const borderColor = useColorModeValue('gray.100', '#222E5F');
  const textColor = useColorModeValue('gray.700', 'white');

  useEffect(() => {
    let isMounted = true;
    const fetchInChunks = async () => {
      setIsSyncing(true);
      try {
        let page = 1;
        let hasMore = true;
        while (hasMore && page <= 25) {
          const res = await api.get(`/irec/all-data?page=${page}&limit=1000`);
          if (res.data.success && isMounted) {
            const processed = res.data.data
              .map((p) => ({
                ...p,
                fLat: parseFloat(p.latitude),
                fLng: parseFloat(p.longitude),
                isRE: /solar|wind|hydro|biomass|renewable/.test(
                  String(p.technology).toLowerCase(),
                ),
                totalVol: (p.issuances || []).reduce(
                  (acc, curr) => acc + (Number(curr.issuanceVolume) || 0),
                  0,
                ),
              }))
              .filter((p) => !isNaN(p.fLat) && !isNaN(p.fLng));
            setAllData((prev) => [...prev, ...processed]);
            if (page === 1) setIsInitialLoading(false);
            hasMore = res.data.hasMore;
            page++;
          } else break;
        }
      } catch (err) {
        console.error(err);
      }
      if (isMounted) setIsSyncing(false);
    };
    fetchInChunks();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setCountryFilter(country);
    if (mapRef.current) {
      if (country === 'All') {
        mapRef.current.setView([20, 30], 3);
      } else if (countryCoordinates[country]) {
        mapRef.current.flyTo(countryCoordinates[country], 5, { duration: 1.5 });
      } else {
        const firstP = allData.find((p) => p.country === country);
        if (firstP)
          mapRef.current.flyTo([firstP.fLat, firstP.fLng], 5, {
            duration: 1.5,
          });
      }
    }
  };

  const countries = useMemo(() => {
    const list = [...new Set(allData.map((item) => item.country))]
      .filter(Boolean)
      .sort();
    return ['All', ...list];
  }, [allData]);

  const filteredData = useMemo(() => {
    let data = [...allData];
    if (activeFilter === 'RE-100') data = data.filter((p) => p.isRE);
    else if (activeFilter === 'Non-RE100') data = data.filter((p) => !p.isRE);
    else if (activeFilter !== 'All')
      data = data.filter((p) =>
        (p.technology || '').toLowerCase().includes(activeFilter.toLowerCase()),
      );
    if (countryFilter !== 'All')
      data = data.filter((p) => p.country === countryFilter);
    return data.sort((a, b) => b.totalVol - a.totalVol);
  }, [allData, activeFilter, countryFilter]);

  const top10Leaders = useMemo(
    () => [...allData].sort((a, b) => b.totalVol - a.totalVol).slice(0, 10),
    [allData],
  );

  if (isInitialLoading)
    return (
      <Flex justify="center" h="100vh" align="center" bg={bg}>
        <Spinner size="xl" color={BRAND_GREEN} />
      </Flex>
    );

  return (
    <Box
      // ISKO DHYAN SE DEKHO: Pt ko thoda aur badhaya hai aur zIndex remove kiya hai
      pt={{ base: '150px', md: '100px' }}
      px={{ base: '10px', md: '20px' }}
      bg={bg}
      minH="100vh"
      pb="40px"
      color={textColor}
      overflow="visible"
    >
      <style>{customStyles}</style>

      {/* --- Filter Card --- */}
      <Card
        bg={cardBg}
        p="12px"
        mb="20px"
        borderRadius="15px"
        border="1px solid"
        borderColor={borderColor}
        shadow="sm"
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap="15px">
          <HStack
            spacing="2"
            wrap="wrap"
            justify={{ base: 'center', md: 'start' }}
          >
            {[
              'All',
              'RE-100',
              'Non-RE100',
              'Solar',
              'Wind',
              'Hydro',
              'Biomass',
            ].map((f) => (
              <Button
                key={f}
                size="xs"
                variant={activeFilter === f ? 'solid' : 'outline'}
                bg={activeFilter === f ? BRAND_GREEN : 'transparent'}
                color={activeFilter === f ? 'white' : BRAND_GREEN}
                borderColor={BRAND_GREEN}
                onClick={() => setActiveFilter(f)}
                borderRadius="8px"
              >
                {f}
              </Button>
            ))}
          </HStack>

          <HStack
            spacing="3"
            w={{ base: '100%', md: 'auto' }}
            justify="flex-end"
          >
            <Select
              maxW={{ base: '140px', md: '200px' }}
              size="xs"
              borderRadius="8px"
              value={countryFilter}
              onChange={handleCountryChange}
              borderColor={borderColor}
            >
              {countries.map((c) => (
                <option key={c} value={c} style={{ color: 'black' }}>
                  {c === 'All' ? '🌐 All Countries' : c}
                </option>
              ))}
            </Select>
            {isSyncing && (
              <HStack spacing={1}>
                <Icon
                  as={MdSync}
                  className="spin-icon"
                  color={BRAND_GREEN}
                  boxSize="14px"
                />
                <Text
                  fontSize="10px"
                  fontWeight="bold"
                  color={BRAND_GREEN}
                  display={{ base: 'none', sm: 'block' }}
                >
                  {allData.length} Records
                </Text>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Card>

      <SimpleGrid columns={{ base: 1, lg: 4 }} spacing="20px" mb="20px">
        <Box gridColumn={{ lg: 'span 3' }}>
          <Card
            bg={cardBg}
            p="6px"
            borderRadius="24px"
            border="1px solid"
            borderColor={borderColor}
          >
            <Box
              height={{ base: '350px', md: '68vh' }}
              borderRadius="18px"
              overflow="hidden"
            >
              <MapContainer
                center={[20, 77]}
                zoom={4}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MarkerClusterGroup
                  showCoverageOnHover={false}
                  maxClusterRadius={45}
                >
                  {filteredData.map((plant) => (
                    <Marker
                      key={plant._id}
                      position={[plant.fLat, plant.fLng]}
                      icon={createLeafletIcon(plant.technology)}
                    >
                      <Popup>
                        <VStack align="stretch" spacing={3}>
                          <Box>
                            <Text
                              fontWeight="800"
                              fontSize="13px"
                              color={BRAND_GREEN}
                              lineHeight="1.2"
                            >
                              {plant.company || 'Unnamed Device'}
                            </Text>
                            <Text
                              fontSize="10px"
                              color="gray.500"
                              mt={1}
                              fontWeight="bold"
                            >
                              Code: {plant.plantCode}
                            </Text>
                          </Box>
                          <Link
                            href={`https://evident.app/IREC/device-register/${plant.plantCode}`}
                            isExternal
                            color={BRAND_GREEN}
                            fontSize="10px"
                            fontWeight="bold"
                            borderBottom="1px solid"
                            borderColor="green.100"
                            pb={1}
                          >
                            VIEW ON EVIDENT <Icon as={MdOpenInNew} />
                          </Link>
                          <Flex
                            justify="space-between"
                            align="center"
                            pt={1}
                            borderTop="1px dashed #ddd"
                          >
                            <Text fontSize="11px" fontWeight="bold">
                              Total MWh:
                            </Text>
                            <Text
                              fontSize="12px"
                              fontWeight="900"
                              color={BRAND_GREEN}
                            >
                              {Math.round(plant.totalVol).toLocaleString()}
                            </Text>
                          </Flex>
                        </VStack>
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              </MapContainer>
            </Box>
          </Card>
        </Box>

        <Card
          bg={cardBg}
          p="15px"
          borderRadius="24px"
          height={{ base: 'auto', lg: '69vh' }}
          border="1px solid"
          borderColor={borderColor}
        >
          <Text
            fontWeight="800"
            mb="4"
            fontSize="10px"
            color="gray.400"
            letterSpacing="1px"
          >
            GLOBAL LEADERS
          </Text>
          <VStack
            align="stretch"
            spacing={3}
            overflowY={{ base: 'visible', lg: 'auto' }}
          >
            {top10Leaders.map((p, i) => (
              <Box
                key={i}
                p="3"
                bg={bg}
                borderRadius="12px"
                cursor="pointer"
                onClick={() => mapRef.current.flyTo([p.fLat, p.fLng], 12)}
                _hover={{ border: `1px solid ${BRAND_GREEN}` }}
              >
                <Text
                  fontSize="11px"
                  fontWeight="800"
                  color={BRAND_GREEN}
                  noOfLines={1}
                >
                  {p.company || p.plantCode}
                </Text>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="10px" color="gray.500" fontWeight="bold">
                    {p.country}
                  </Text>
                  <Text fontSize="11px" fontWeight="900" color={textColor}>
                    {Math.round(p.totalVol).toLocaleString()} MWh
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Card>
      </SimpleGrid>

      <Card
        bg={cardBg}
        p={{ base: '15px', md: '20px' }}
        borderRadius="24px"
        border="1px solid"
        borderColor={borderColor}
        shadow="lg"
      >
        <Text fontWeight="800" fontSize="md" mb="4" color={BRAND_GREEN}>
          Global Asset Directory
        </Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg={tableHeadBg}>
              <Tr>
                <Th fontSize="10px">Rank</Th>
                <Th fontSize="10px">Asset Name</Th>
                <Th fontSize="10px">Country</Th>
                <Th fontSize="10px">Technology</Th>
                <Th isNumeric fontSize="10px">
                  I-REC Volume
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.slice(0, 30).map((p, idx) => (
                <Tr
                  key={p._id}
                  cursor="pointer"
                  onClick={() => {
                    mapRef.current.flyTo([p.fLat, p.fLng], 12);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Td fontWeight="900" color={BRAND_GREEN}>
                    #{idx + 1}
                  </Td>
                  <Td>
                    <Text fontWeight="700" fontSize="11px">
                      {p.company || 'N/A'}
                    </Text>
                  </Td>
                  <Td fontSize="11px">{p.country}</Td>
                  <Td fontSize="10px">
                    <Badge
                      variant="outline"
                      colorScheme="green"
                      color={BRAND_GREEN}
                      borderColor={BRAND_GREEN}
                    >
                      {p.technology}
                    </Badge>
                  </Td>
                  <Td isNumeric fontWeight="800" fontSize="11px">
                    {Math.round(p.totalVol).toLocaleString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Card>
    </Box>
  );
}
