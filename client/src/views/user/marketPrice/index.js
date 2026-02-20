/* eslint-disable */
import React, { useEffect, useState } from 'react';
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
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Divider,
} from '@chakra-ui/react';
// 1. Apna custom api instance import kiya
import api from '../../../utils/axiosConfig';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import {
  MdWbSunny,
  MdAir,
  MdWaterDrop,
  MdForest,
  MdTrendingUp,
  MdChevronLeft,
  MdChevronRight,
  MdFactory,
} from 'react-icons/md';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import 'leaflet/dist/leaflet.css';

// --- CONFIG: Color and Icon Logic ---
const getTechConfig = (techName, isRE100) => {
  const tech = String(techName || '').toLowerCase();
  const isRE = isRE100 === true || String(isRE100).toLowerCase() === 'true';

  let color = '#718096';
  let icon = MdFactory;

  if (isRE) {
    if (tech.includes('solar')) {
      icon = MdWbSunny;
      color = '#E69138';
    } else if (tech.includes('wind')) {
      icon = MdAir;
      color = '#3D85C6';
    } else if (tech.includes('hydro')) {
      icon = MdWaterDrop;
      color = '#00C2FF';
    } else if (tech.includes('biomass')) {
      icon = MdForest;
      color = '#6AA84F';
    } else {
      icon = MdTrendingUp;
      color = '#05CD99';
    }
  }

  return { icon, color, isRE };
};

const createLeafletIcon = (techName, isRE100) => {
  const config = getTechConfig(techName, isRE100);
  const iconHTML = renderToStaticMarkup(
    <div
      style={{
        color: 'white',
        backgroundColor: config.color,
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid white',
        boxShadow: '0 0 5px rgba(0,0,0,0.3)',
      }}
    >
      <config.icon size={12} />
    </div>,
  );
  return L.divIcon({
    html: iconHTML,
    className: 'custom-m',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

export default function UserMarketDashboard() {
  const [allData, setAllData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const bg = useColorModeValue('#F4F7FE', '#0B1437');
  const cardBg = useColorModeValue('white', '#111C44');
  const borderColor = useColorModeValue('gray.100', '#222E5F');

  useEffect(() => {
    // 2. Updated API call to use 'api' and short endpoint
    api
      .get('/irec/all-data')
      .then((res) => {
        if (res.data.success) {
          const processed = res.data.data.map((p) => {
            const lat = parseFloat(p.latitude) || 20 + Math.random() * 5;
            const lng = parseFloat(p.longitude) || 75 + Math.random() * 8;
            const tech = p.technology || 'Wind';
            const isRE =
              p.isRE100 === true || String(p.isRE100).toLowerCase() === 'true';

            return {
              ...p,
              fLat: lat,
              fLng: lng,
              fTech: tech,
              isRE: isRE,
              code: p.plantCode || 'N/A',
              totalVol: (p.issuances || []).reduce(
                (acc, curr) => acc + (Number(curr.issuanceVolume) || 0),
                0,
              ),
            };
          });
          setAllData(processed);
          setDisplayData(processed);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching map data:', err);
        setLoading(false);
      });
  }, []);

  const handleFilter = (f) => {
    setActiveFilter(f);
    setCurrentPage(1);
    if (f === 'All') setDisplayData(allData);
    else if (f === 'RE100') setDisplayData(allData.filter((p) => p.isRE));
    else if (f === 'Non-RE100') setDisplayData(allData.filter((p) => !p.isRE));
    else
      setDisplayData(
        allData.filter((p) => p.fTech.toLowerCase().includes(f.toLowerCase())),
      );
  };

  const currentRecords = displayData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );
  const totalPages = Math.ceil(displayData.length / recordsPerPage);

  if (loading)
    return (
      <Flex justify="center" h="100vh" align="center">
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <Box pt="80px" px="20px" bg={bg} minH="100vh" pb="40px">
      <Card
        bg={cardBg}
        p="15px"
        mb="20px"
        borderRadius="20px"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack align="start" spacing={3}>
          <HStack spacing="3" wrap="wrap">
            {['All', 'RE100', 'Non-RE100'].map((f) => (
              <Button
                key={f}
                size="xs"
                variant={activeFilter === f ? 'solid' : 'outline'}
                colorScheme={
                  f === 'Non-RE100' ? 'red' : f === 'RE100' ? 'green' : 'blue'
                }
                onClick={() => handleFilter(f)}
              >
                {f}
              </Button>
            ))}
          </HStack>
          <HStack spacing="3" wrap="wrap">
            {['Solar', 'Wind', 'Hydro', 'Biomass'].map((f) => (
              <Button
                key={f}
                size="xs"
                variant={activeFilter === f ? 'solid' : 'ghost'}
                colorScheme="teal"
                onClick={() => handleFilter(f)}
              >
                {f}
              </Button>
            ))}
          </HStack>
        </VStack>
      </Card>

      <SimpleGrid columns={{ base: 1, lg: 4 }} spacing="20px" mb="20px">
        <Box gridColumn={{ lg: 'span 3' }}>
          <Card bg={cardBg} p="10px" borderRadius="24px">
            <Box height="65vh" borderRadius="20px" overflow="hidden">
              <MapContainer
                center={[22, 78]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {displayData.map((plant, idx) => (
                  <Marker
                    key={idx}
                    position={[plant.fLat, plant.fLng]}
                    icon={createLeafletIcon(plant.fTech, plant.isRE)}
                  >
                    <Tooltip sticky direction="top" opacity={1}>
                      <VStack align="stretch" spacing={2} p={1} minW="180px">
                        <Text
                          fontWeight="bold"
                          fontSize="xs"
                          borderBottom="1px solid #ddd"
                          pb={1}
                        >
                          {plant.code}
                        </Text>
                        <Text fontSize="10px">
                          <b>Tech:</b> {plant.fTech}
                        </Text>
                        <Box mt={1}>
                          <Text
                            fontWeight="bold"
                            fontSize="9px"
                            mb={1}
                            color="gray.600"
                          >
                            Issuance History:
                          </Text>
                          <Table size="xs" variant="unstyled">
                            <Thead borderBottom="1px solid #eee">
                              <Tr>
                                <Th fontSize="8px" p={1}>
                                  Year
                                </Th>
                                <Th fontSize="8px" p={1} isNumeric>
                                  Volume
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {plant.issuances?.length > 0 ? (
                                plant.issuances
                                  .sort((a, b) => b.issuingYear - a.issuingYear)
                                  .map((v, i) => (
                                    <Tr key={i}>
                                      <Td fontSize="9px" p={1}>
                                        {v.issuingYear}
                                      </Td>
                                      <Td fontSize="9px" p={1} isNumeric>
                                        {v.issuanceVolume?.toLocaleString()}
                                      </Td>
                                    </Tr>
                                  ))
                              ) : (
                                <Tr>
                                  <Td
                                    colSpan={2}
                                    fontSize="9px"
                                    textAlign="center"
                                    p={1}
                                  >
                                    No Data
                                  </Td>
                                </Tr>
                              )}
                            </Tbody>
                          </Table>
                          <Divider my={1} />
                          <Flex justify="space-between" align="center">
                            <Text fontWeight="bold" fontSize="9px">
                              Total:
                            </Text>
                            <Text
                              fontWeight="bold"
                              fontSize="10px"
                              color="blue.600"
                            >
                              {Math.round(plant.totalVol).toLocaleString()} MWh
                            </Text>
                          </Flex>
                        </Box>
                      </VStack>
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </Box>
          </Card>
        </Box>

        <Card
          bg={cardBg}
          p="20px"
          borderRadius="24px"
          height="68vh"
          overflowY="auto"
        >
          <Text fontWeight="bold" mb="4" fontSize="sm">
            Issuance Ranking
          </Text>
          <VStack align="stretch" spacing={2}>
            {displayData
              .sort((a, b) => b.totalVol - a.totalVol)
              .slice(0, 50)
              .map((p, i) => (
                <Box
                  key={i}
                  p="2"
                  bg={bg}
                  borderRadius="md"
                  borderLeft="4px solid"
                  borderColor={getTechConfig(p.fTech, p.isRE).color}
                >
                  <Text fontSize="10px" fontWeight="bold" noOfLines={1}>
                    {p.code}
                  </Text>
                  <Text fontSize="10px" color="blue.600">
                    {Math.round(p.totalVol).toLocaleString()} MWh
                  </Text>
                </Box>
              ))}
          </VStack>
        </Card>
      </SimpleGrid>

      <Card bg={cardBg} p="20px" borderRadius="24px">
        <Flex justify="space-between" mb="4">
          <Text fontWeight="bold">Asset List ({displayData.length})</Text>
          <HStack>
            <IconButton
              icon={<MdChevronLeft />}
              size="xs"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              isDisabled={currentPage === 1}
            />
            <Text fontSize="xs">
              Page {currentPage} of {totalPages || 1}
            </Text>
            <IconButton
              icon={<MdChevronRight />}
              size="xs"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              isDisabled={currentPage === totalPages}
            />
          </HStack>
        </Flex>
        <TableContainer>
          <Table variant="simple" size="sm">
            <Thead bg={bg}>
              <Tr>
                <Th>Plant</Th>
                <Th>Category</Th>
                <Th>Tech</Th>
                <Th isNumeric>Total Vol</Th>
              </Tr>
            </Thead>
            <Tbody>
              {currentRecords.map((p, idx) => (
                <Tr key={idx} _hover={{ bg: bg }}>
                  <Td fontWeight="bold" fontSize="xs">
                    {p.code}
                  </Td>
                  <Td>
                    <Badge
                      fontSize="9px"
                      colorScheme={p.isRE ? 'green' : 'gray'}
                    >
                      {p.isRE ? 'RE100' : 'NON-RE'}
                    </Badge>
                  </Td>
                  <Td fontSize="xs">{p.fTech}</Td>
                  <Td isNumeric fontSize="xs" fontWeight="bold">
                    {Math.round(p.totalVol).toLocaleString()}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}
