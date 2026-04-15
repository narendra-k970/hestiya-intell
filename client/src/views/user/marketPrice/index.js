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
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import {
  MdWbSunny,
  MdAir,
  MdWaterDrop,
  MdForest,
  MdPublic,
  MdOpenInNew,
  MdSync,
  MdRestartAlt,
} from 'react-icons/md';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import api from '../../../utils/axiosConfig';
import 'leaflet/dist/leaflet.css';

const BRAND_GREEN = '#048E3D';

const customStyles = `
  .leaflet-container :focus { outline: none !important; }
  .leaflet-marker-icon:focus { outline: none !important; }
  .leaflet-container { z-index: 1 !important; border-radius: 18px; outline: none !important; }
  .custom-m { background: none !important; border: none !important; outline: none !important; }
  .marker-cluster div {
    background-color: ${BRAND_GREEN} !important; color: white !important; 
    font-weight: 700 !important; border-radius: 50% !important; 
    width: 32px !important; height: 32px !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    font-size: 11px;
  }
  .leaflet-popup-content-wrapper { padding: 0 !important; overflow: hidden; border-radius: 12px !important; }
  .leaflet-popup-content { margin: 0 !important; width: 200px !important; }
  @keyframes spin { 100% { transform: rotate(360deg); } }
  .spin-icon { animation: spin 2s linear infinite; }
`;

const getTechConfig = (techName) => {
  const tech = String(techName || '').toLowerCase();
  if (tech.includes('solar')) return { icon: MdWbSunny, color: '#F6AD55' };
  if (tech.includes('wind')) return { icon: MdAir, color: '#4299E1' };
  if (tech.includes('hydro')) return { icon: MdWaterDrop, color: '#3182CE' };
  if (tech.includes('biomass')) return { icon: MdForest, color: BRAND_GREEN };
  return { icon: MdPublic, color: '#A0AEC0' };
};

const createLeafletIcon = (techName) => {
  const config = getTechConfig(techName);
  const iconHTML = renderToStaticMarkup(
    <div
      style={{
        color: 'white',
        backgroundColor: config.color,
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
  const [geoData, setGeoData] = useState(null);

  const [reStatus, setReStatus] = useState('All');
  const [techFilter, setTechFilter] = useState('All');
  const [countryFilter, setCountryFilter] = useState('All');

  const mapRef = useRef(null);
  const bg = useColorModeValue('#F4F7FE', '#0B1437');
  const cardBg = useColorModeValue('white', '#111C44');
  const borderColor = useColorModeValue('gray.100', '#222E5F');
  const tableHeadBg = useColorModeValue('gray.50', '#1B254B');

  useEffect(() => {
    let isMounted = true;
    const fetchAllData = async () => {
      setIsSyncing(true);
      try {
        let page = 1,
          hasMore = true;

        // Loop ke bahar accumulated array ki zaroorat nahi agar hum state ko update kar rahe hain
        while (hasMore && isMounted) {
          const res = await api.get(`/irec/all-data?page=${page}&limit=1000`);

          if (res.data.success && isMounted) {
            const processed = res.data.data
              .map((p) => {
                return {
                  ...p,
                  fLat: parseFloat(p.latitude),
                  fLng: parseFloat(p.longitude),
                  isRE100_Strict: p.isRE100 === true, // Server flag
                  isPlantRE100: (() => {
                    let year = 0;
                    if (p.commYear) {
                      const m = String(p.commYear).match(/\d{4}/);
                      if (m) year = parseInt(m[0]);
                    }
                    if (year === 0 && p.commissioningDate) {
                      const m = String(p.commissioningDate).match(/\d{4}/);
                      if (m) year = parseInt(m[0]);
                    }
                    return year >= 2014;
                  })(), // Commissioning Year threshold fallback
                  totalVol: (p.issuances || []).reduce(
                    (acc, curr) => acc + (Number(curr.issuanceVolume) || 0),
                    0,
                  ),
                };
              })
              .filter((p) => !isNaN(p.fLat) && !isNaN(p.fLng));

            // DHEERE DHEERE LOAD: State ko previous data mein append karte rahein
            setAllData((prevData) => [...prevData, ...processed]);

            if (page === 1) {
              setIsInitialLoading(false);
            }

            hasMore = res.data.hasMore;
            page++;

            // OPTIONAL: Chhota sa delay taaki aankhon ko "loading" feel ho
            // await new Promise(resolve => setTimeout(resolve, 100));
          } else break;
        }
      } catch (err) {
        console.error(err);
      }
      if (isMounted) setIsSyncing(false);
    };

    fetchAllData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Ye filters ko ignore karke hamesha pure data ke top 20 dikhayega
  const filteredData = useMemo(() => {
    return allData
      .filter((p) => {
        const matchC = countryFilter === 'All' || p.country === countryFilter;

        // Match RE Status based on common logic calculated during ingest
        const matchRE =
          reStatus === 'All'
            ? true
            : reStatus === 'RE-100'
              ? p.isPlantRE100
              : !p.isPlantRE100;

        const matchT =
          techFilter === 'All'
            ? true
            : (p.technology || '')
                .toLowerCase()
                .includes(techFilter.toLowerCase());

        return matchC && matchRE && matchT;
      })
      .sort((a, b) => b.totalVol - a.totalVol);
  }, [allData, reStatus, techFilter, countryFilter]);

  // Global Leaderboard - Always fixed to top 20 globally, ignores filters
  const globalTop20 = useMemo(() => {
    return [...allData]
      .sort((a, b) => b.totalVol - a.totalVol)
      .slice(0, 20);
  }, [allData]);

  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setCountryFilter(country);
    setGeoData(null);
    if (country === 'All') {
      if (mapRef.current) mapRef.current.flyTo([20, 20], 3);
    } else {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?country=${country}&polygon_geojson=1&format=json`,
        );
        const json = await geoRes.json();
        if (json.length > 0) setGeoData(json[0].geojson);
      } catch (err) {
        console.log(err);
      }
      const countryPlants = allData.filter((p) => p.country === country);
      if (countryPlants.length > 0 && mapRef.current) {
        const bounds = L.latLngBounds(
          countryPlants.map((p) => [p.fLat, p.fLng]),
        );
        mapRef.current.flyToBounds(bounds, {
          padding: [50, 50],
          duration: 1.5,
        });
      }
    }
  };

  const clearFilters = () => {
    setReStatus('All');
    setTechFilter('All');
    setCountryFilter('All');
    setGeoData(null);
    if (mapRef.current) mapRef.current.flyTo([20, 20], 3);
  };

  if (isInitialLoading)
    return (
      <Flex justify="center" h="100vh" align="center" bg={bg}>
        <Spinner size="xl" color={BRAND_GREEN} />
      </Flex>
    );

  return (
    <Box
      pt={{ base: '150px', md: '100px' }}
      px="20px"
      bg={bg}
      minH="100vh"
      pb="40px"
    >
      <style>{customStyles}</style>

      {/* FILTER BAR WITH CLEAR ICON */}
      <Card
        bg={cardBg}
        p="12px"
        mb="20px"
        borderRadius="15px"
        border="1px solid"
        borderColor={borderColor}
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap="10px">
          <HStack spacing="2" wrap="wrap">
            {['All', 'RE-100', 'Non-RE100'].map((f) => (
              <Button
                key={f}
                size="xs"
                colorScheme="green"
                variant={reStatus === f ? 'solid' : 'outline'}
                onClick={() => setReStatus(f)}
                borderRadius="8px"
              >
                {f}
              </Button>
            ))}
            <Box w="1px" h="15px" bg="gray.300" mx="2" />
            {['Solar', 'Wind', 'Hydro', 'Biomass'].map((f) => (
              <Button
                key={f}
                size="xs"
                colorScheme="green"
                variant={techFilter === f ? 'solid' : 'ghost'}
                onClick={() => setTechFilter(f === techFilter ? 'All' : f)}
                borderRadius="8px"
              >
                {f}
              </Button>
            ))}

            {/* CLEAR FILTER BUTTON */}
            {(reStatus !== 'All' ||
              techFilter !== 'All' ||
              countryFilter !== 'All') && (
              <Tooltip label="Clear All Filters">
                <IconButton
                  icon={<MdRestartAlt />}
                  size="xs"
                  colorScheme="red"
                  variant="ghost"
                  onClick={clearFilters}
                  ml={2}
                  aria-label="Clear Filters"
                />
              </Tooltip>
            )}
          </HStack>

          <HStack spacing="3">
            <Select
              maxW="200px"
              size="xs"
              borderRadius="8px"
              value={countryFilter}
              onChange={handleCountryChange}
            >
              <option value="All">🌍 All Countries</option>
              {[...new Set(allData.map((c) => c.country))]
                .filter(Boolean)
                .sort()
                .map((c) => (
                  <option key={c} value={c} style={{ color: 'black' }}>
                    {c}
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
                <Text fontSize="10px" fontWeight="bold" color={BRAND_GREEN}>
                  {allData.length}
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
              height={{ base: '350px', md: '60vh' }}
              borderRadius="18px"
              overflow="hidden"
            >
              <MapContainer
                center={[20, 20]}
                zoom={3}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoData && (
                  <GeoJSON
                    data={geoData}
                    style={{ color: BRAND_GREEN, weight: 2, fillOpacity: 0.1 }}
                  />
                )}
                <MarkerClusterGroup maxClusterRadius={40}>
                  {filteredData.map((p) => (
                    <Marker
                      key={p._id}
                      position={[p.fLat, p.fLng]}
                      icon={createLeafletIcon(p.technology)}
                    >
                      <Popup>
                        <Box
                          p="0"
                          borderRadius="8px"
                          overflow="hidden"
                          maxW="200px"
                        >
                          {/* Header - Super Slim */}
                          <Box bg={BRAND_GREEN} px="2" py="1" color="white">
                            <Text fontWeight="800" fontSize="11px" isTruncated>
                              {p.company}
                            </Text>
                            <Text fontSize="8px" opacity="0.9" mt="-1px">
                              {p.country} • {p.technology}
                            </Text>
                          </Box>

                          {/* Body - Minimum Spacing */}
                          <Box
                            px="2"
                            py="1.5"
                            bg={useColorModeValue('white', '#111C44')}
                          >
                            <VStack align="stretch" spacing={0}>
                              {(p.issuances || []).length > 0 ? (
                                p.issuances.slice(0, 5).map((iss, i) => (
                                  <HStack
                                    key={i}
                                    justify="space-between"
                                    fontSize="9px"
                                    h="14px"
                                  >
                                    <Text color="gray.500">
                                      {iss.issuingYear || iss.year || 'N/A'}:
                                    </Text>
                                    <Text
                                      fontWeight="700"
                                      color={useColorModeValue(
                                        'gray.700',
                                        'white',
                                      )}
                                    >
                                      {Number(
                                        iss.issuanceVolume,
                                      ).toLocaleString()}
                                    </Text>
                                  </HStack>
                                ))
                              ) : (
                                <Text
                                  fontSize="9px"
                                  color="gray.400"
                                  fontStyle="italic"
                                >
                                  No data
                                </Text>
                              )}
                            </VStack>

                            {/* Footer - Minimalist */}
                            <Flex
                              mt="1"
                              pt="1"
                              borderTop="1px solid"
                              borderColor="gray.100"
                              justify="space-between"
                              align="baseline"
                            >
                              <HStack spacing={1}>
                                <Text
                                  fontSize="7px"
                                  color="gray.400"
                                  fontWeight="bold"
                                >
                                  TOTAL
                                </Text>
                                <Text
                                  fontSize="11px"
                                  fontWeight="900"
                                  color={BRAND_GREEN}
                                >
                                  {Math.round(p.totalVol).toLocaleString()}
                                </Text>
                              </HStack>

                              <Link
                                href={`https://evident.app/IREC/device-register/${p.plantCode}`}
                                isExternal
                                fontSize="8px"
                                fontWeight="bold"
                                color={BRAND_GREEN}
                                _hover={{ textDecoration: 'none' }}
                              >
                                OPEN <Icon as={MdOpenInNew} boxSize="8px" />
                              </Link>
                            </Flex>
                          </Box>
                        </Box>
                      </Popup>
                    </Marker>
                  ))}
                </MarkerClusterGroup>
              </MapContainer>
            </Box>
          </Card>
        </Box>

        {/* SIDEBAR - 10 PLANTS ONLY */}
        <Card
          bg={cardBg}
          p="15px"
          borderRadius="24px"
          height={{ base: 'auto', lg: '61vh' }}
          border="1px solid"
          borderColor={borderColor}
        >
          <Text
            fontWeight="800"
            mb="3"
            fontSize="10px"
            color="gray.400"
            letterSpacing="1px"
          >
            TOP 10 ASSETS
          </Text>
          <VStack align="stretch" spacing={2} overflowY="auto">
            {filteredData.slice(0, 10).map((p, i) => (
              <Box
                key={i}
                p="3"
                bg={bg}
                borderRadius="12px"
                cursor="pointer"
                onClick={() => mapRef.current.flyTo([p.fLat, p.fLng], 14)}
                _hover={{ border: `1px solid ${BRAND_GREEN}` }}
              >
                <Text
                  fontSize="11px"
                  fontWeight="800"
                  color={BRAND_GREEN}
                  noOfLines={1}
                >
                  {p.company}
                </Text>
                <HStack justify="space-between" mt={1}>
                  <Text fontSize="9px">{p.country}</Text>
                  <Text fontSize="10px" fontWeight="900">
                    {Math.round(p.totalVol).toLocaleString()}
                  </Text>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Card>
      </SimpleGrid>

      {/* BOTTOM TABLE - 20 PLANTS ONLY */}
      <Card
        bg={cardBg}
        p="20px"
        borderRadius="24px"
        border="1px solid"
        borderColor={borderColor}
        shadow="lg"
      >
        <Flex justify="space-between" align="center" mb="4">
          <Text fontWeight="800" fontSize="md" color={BRAND_GREEN}>
            Global Leaderboard (Overall Top 20)
          </Text>
          <Badge
            colorScheme="green"
            variant="subtle"
            px="2"
            borderRadius="full"
          >
            Worldwide Data
          </Badge>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg={tableHeadBg}>
              <Tr>
                <Th width="50px">Rank</Th>
                <Th>Asset Name</Th>
                <Th>Country</Th>
                <Th>Technology</Th>
                <Th>Status</Th>
                <Th isNumeric>Volume (MWh)</Th>
              </Tr>
            </Thead>
            <Tbody>
              {/* Yahan humne globalTop20 use kiya hai */}
              {globalTop20.map((p, idx) => (
                <Tr
                  key={p._id}
                  _hover={{
                    bg: useColorModeValue('gray.50', 'whiteAlpha.100'),
                  }}
                  cursor="pointer"
                  onClick={() => {
                    mapRef.current.flyTo([p.fLat, p.fLng], 12);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <Td fontWeight="900" color={BRAND_GREEN}>
                    #{idx + 1}
                  </Td>
                  <Td fontWeight="700" fontSize="11px">
                    {p.company}
                  </Td>
                  <Td fontSize="11px" fontWeight="500">
                    {p.country}
                  </Td>
                  <Td fontSize="10px">
                    <Badge
                      variant="solid"
                      bg={getTechConfig(p.technology).color}
                      color="white"
                      fontSize="9px"
                    >
                      {p.technology}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={p.isPlantRE100 ? 'green' : 'orange'}
                      variant="outline"
                      fontSize="9px"
                    >
                      {p.isPlantRE100 ? 'RE100' : 'NON-RE'}
                    </Badge>
                  </Td>
                  <Td
                    isNumeric
                    fontWeight="800"
                    fontSize="11px"
                    color={BRAND_GREEN}
                  >
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
