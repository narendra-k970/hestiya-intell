/* eslint-disable */
import React, { useEffect, useState, useMemo } from 'react';
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
  Divider,
  Link,
  Icon,
} from '@chakra-ui/react';
import api from '../../../utils/axiosConfig';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  MdWbSunny,
  MdAir,
  MdWaterDrop,
  MdForest,
  MdPublic,
  MdFactory,
  MdOpenInNew,
} from 'react-icons/md';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';

// --- CSS Fix: Specific Z-Index for Header Overlap & Layout ---
const customStyles = `
  .leaflet-container {
    z-index: 0 !important;
  }
  .leaflet-pane {
    z-index: 0 !important;
  }
  .custom-m {
    background: none !important;
    border: none !important;
  }
  .leaflet-popup-content-wrapper {
    border-radius: 15px !important;
    padding: 5px !important;
  }
`;

const getTechConfig = (techName, isRE100Flag) => {
  const tech = String(techName || '').toLowerCase();
  const isRenewableTech =
    tech.includes('solar') ||
    tech.includes('wind') ||
    tech.includes('hydro') ||
    tech.includes('biomass') ||
    tech.includes('geothermal') ||
    tech.includes('renewable');

  const isRE =
    isRE100Flag === true ||
    String(isRE100Flag).toLowerCase() === 'true' ||
    isRenewableTech;

  if (!isRE) return { icon: MdFactory, color: '#4A5568', label: 'Non-RE' };
  if (tech.includes('solar'))
    return { icon: MdWbSunny, color: '#FFB302', label: 'Solar' };
  if (tech.includes('wind'))
    return { icon: MdAir, color: '#3182CE', label: 'Wind' };
  if (tech.includes('hydro'))
    return { icon: MdWaterDrop, color: '#00B5D8', label: 'Hydro' };
  if (tech.includes('biomass'))
    return { icon: MdForest, color: '#38A169', label: 'Biomass' };
  return { icon: MdPublic, color: '#805AD5', label: 'RE-100' };
};

const createLeafletIcon = (techName, isRE100) => {
  const config = getTechConfig(techName, isRE100);
  const iconHTML = renderToStaticMarkup(
    <div
      style={{
        color: 'white',
        backgroundColor: config.color,
        borderRadius: '50%',
        width: '26px',
        height: '26px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
      }}
    >
      <config.icon size={16} />
    </div>,
  );
  return L.divIcon({
    html: iconHTML,
    className: 'custom-m',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};

export default function UserMarketDashboard() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const bg = useColorModeValue('#F4F7FE', '#0B1437');
  const cardBg = useColorModeValue('white', '#111C44');
  const textColor = useColorModeValue('gray.800', 'white');
  const borderColor = useColorModeValue('gray.100', '#222E5F');

  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        const res = await api.get(`/irec/all-data?page=${page}&limit=400`);
        if (res.data.success) {
          const processed = res.data.data
            .map((p) => {
              const config = getTechConfig(p.technology, p.isRE100);
              return {
                ...p,
                fLat: parseFloat(p.latitude),
                fLng: parseFloat(p.longitude),
                isRE: config.label !== 'Non-RE',
                totalVol: (p.issuances || []).reduce(
                  (acc, curr) => acc + (Number(curr.issuanceVolume) || 0),
                  0,
                ),
              };
            })
            .filter((p) => !isNaN(p.fLat) && !isNaN(p.fLng));

          setAllData((prev) => [...prev, ...processed]);
          if (page === 1) setLoading(false);
          if (res.data.hasMore) fetchData(page + 1);
        }
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let data = [...allData];
    if (activeFilter === 'RE-100') data = data.filter((p) => p.isRE);
    else if (activeFilter === 'Non-RE100') data = data.filter((p) => !p.isRE);
    else if (activeFilter !== 'All')
      data = data.filter((p) =>
        (p.technology || '').toLowerCase().includes(activeFilter.toLowerCase()),
      );
    return data.sort((a, b) => b.totalVol - a.totalVol);
  }, [allData, activeFilter]);

  const globalTopProducers = useMemo(() => {
    return [...allData].sort((a, b) => b.totalVol - a.totalVol).slice(0, 15);
  }, [allData]);

  if (loading)
    return (
      <Flex justify="center" h="100vh" align="center" bg={bg}>
        <Spinner size="xl" color="blue.500" />
      </Flex>
    );

  return (
    <Box pt="80px" px="20px" bg={bg} minH="100vh" pb="40px" position="relative">
      <style>{customStyles}</style>

      {/* --- Filters --- */}
      <Card
        bg={cardBg}
        p="15px"
        mb="20px"
        borderRadius="20px"
        border="1px solid"
        borderColor={borderColor}
      >
        <HStack spacing="3" wrap="wrap">
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
              colorScheme="blue"
              onClick={() => setActiveFilter(f)}
              borderRadius="8px"
            >
              {f}
            </Button>
          ))}
        </HStack>
      </Card>

      <SimpleGrid columns={{ base: 1, lg: 4 }} spacing="20px" mb="20px">
        {/* --- Map --- */}
        <Box gridColumn={{ lg: 'span 3' }} position="relative" zIndex={0}>
          <Card
            bg={cardBg}
            p="10px"
            borderRadius="24px"
            border="1px solid"
            borderColor={borderColor}
          >
            <Box height="70vh" borderRadius="20px" overflow="hidden">
              <MapContainer
                center={[15, 20]}
                zoom={3}
                style={{ height: '100%', width: '100%' }}
                preferCanvas={true}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {filteredData.map((plant) => (
                  <Marker
                    key={plant._id}
                    position={[plant.fLat, plant.fLng]}
                    icon={createLeafletIcon(plant.technology, plant.isRE100)}
                    eventHandlers={{ mouseover: (e) => e.target.openPopup() }}
                  >
                    <Popup maxWidth={280} autoPan={false} closeButton={false}>
                      <VStack align="stretch" spacing={2} p={1}>
                        <Link
                          href={`https://evident.app/IREC/device-register/${plant.plantCode}`}
                          isExternal
                          fontWeight="bold"
                          fontSize="md"
                          color="blue.600"
                          display="flex"
                          alignItems="center"
                        >
                          {plant.plantCode}{' '}
                          <Icon as={MdOpenInNew} ml={2} boxSize={4} />
                        </Link>

                        <HStack spacing={2}>
                          <Badge colorScheme={plant.isRE ? 'green' : 'gray'}>
                            {plant.isRE ? 'RE-100' : 'Non-RE'}
                          </Badge>
                          <Text fontSize="xs" fontWeight="600" color="gray.600">
                            {plant.technology}
                          </Text>
                        </HStack>

                        <Divider />

                        {/* --- Issuance History Table in Popup --- */}
                        <Text
                          fontWeight="bold"
                          fontSize="9px"
                          color="gray.400"
                          letterSpacing="wider"
                        >
                          ISSUANCE HISTORY
                        </Text>
                        <Box
                          maxH="120px"
                          overflowY="auto"
                          border="1px solid"
                          borderColor="gray.50"
                          borderRadius="md"
                        >
                          <Table size="xs" variant="simple">
                            <Tbody>
                              {(plant.issuances || [])
                                .sort((a, b) => b.issuingYear - a.issuingYear)
                                .map((v, i) => (
                                  <Tr key={i}>
                                    <Td p={1} fontSize="10px">
                                      {v.issuingYear}
                                    </Td>
                                    <Td
                                      p={1}
                                      fontSize="10px"
                                      isNumeric
                                      fontWeight="bold"
                                      color="blue.700"
                                    >
                                      {Math.round(
                                        v.issuanceVolume || 0,
                                      ).toLocaleString()}
                                    </Td>
                                  </Tr>
                                ))}
                            </Tbody>
                          </Table>
                        </Box>

                        <Flex
                          justify="space-between"
                          bg="blue.50"
                          p={2}
                          borderRadius="md"
                          align="center"
                        >
                          <Text
                            fontWeight="bold"
                            fontSize="xs"
                            color="blue.700"
                          >
                            Total Lifecycle:
                          </Text>
                          <Text
                            fontWeight="extrabold"
                            fontSize="xs"
                            color="blue.900"
                          >
                            {Math.round(plant.totalVol).toLocaleString()} MWh
                          </Text>
                        </Flex>
                      </VStack>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          </Card>
        </Box>

        {/* --- Sidebar (Top 15 Global Always) --- */}
        <Card
          bg={cardBg}
          p="20px"
          borderRadius="24px"
          height="73vh"
          overflowY="auto"
          border="1px solid"
          borderColor={borderColor}
        >
          <Text fontWeight="bold" mb="4" fontSize="sm" color={textColor}>
            Global Leaders (Top 15)
          </Text>
          <VStack align="stretch" spacing={3}>
            {globalTopProducers.map((p, i) => (
              <Box
                key={i}
                p="3"
                bg={bg}
                borderRadius="xl"
                borderLeft="4px solid"
                borderColor={getTechConfig(p.technology, p.isRE100).color}
              >
                <Text fontSize="xs" fontWeight="bold" noOfLines={1}>
                  {p.plantCode}
                </Text>
                <Text fontSize="10px" color="gray.500">
                  {p.country}
                </Text>
                <Text fontSize="xs" fontWeight="bold" color="blue.600">
                  {Math.round(p.totalVol).toLocaleString()} MWh
                </Text>
              </Box>
            ))}
          </VStack>
        </Card>
      </SimpleGrid>

      {/* --- Bottom Table (Top 10 by Technology) --- */}
      <Card
        bg={cardBg}
        p="20px"
        borderRadius="24px"
        border="1px solid"
        borderColor={borderColor}
      >
        <Text fontWeight="bold" mb="4" fontSize="lg" color={textColor}>
          Market Leaders: {activeFilter}
        </Text>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead bg={bg}>
              <Tr>
                <Th>Rank</Th>
                <Th>Plant Code</Th>
                <Th>Country</Th>
                <Th>Technology</Th>
                <Th isNumeric>Volume (MWh)</Th>
                <Th>Certification</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.slice(0, 10).map((p, idx) => (
                <Tr
                  key={p._id}
                  _hover={{
                    bg: useColorModeValue('gray.50', 'whiteAlpha.100'),
                  }}
                >
                  <Td fontWeight="bold" color="blue.500">
                    #{idx + 1}
                  </Td>
                  <Td>
                    <Link
                      href={`https://evident.app/IREC/device-register/${p.plantCode}`}
                      isExternal
                      fontWeight="bold"
                      color="blue.600"
                    >
                      {p.plantCode}
                    </Link>
                  </Td>
                  <Td>{p.country}</Td>
                  <Td>{p.technology}</Td>
                  <Td isNumeric fontWeight="bold">
                    {Math.round(p.totalVol).toLocaleString()}
                  </Td>
                  <Td>
                    <Badge colorScheme={p.isRE ? 'green' : 'gray'}>
                      {p.isRE ? 'RE-100' : 'NON-RE'}
                    </Badge>
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
