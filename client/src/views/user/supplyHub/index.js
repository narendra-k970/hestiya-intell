/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Box, Flex, Text, useColorModeValue, SimpleGrid, Icon, Badge, Center, Progress, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Spinner, Select } from '@chakra-ui/react';
import { MdLocationOn, MdDateRange, MdPeople, MdRecycling, MdFactory } from 'react-icons/md';
import Chart from 'react-apexcharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../../utils/axiosConfig';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const formatVal = (val) => (val === undefined || val === null || val === '') ? 'N/A' : val;
const safeChartVal = (val) => (typeof val === 'number' && !isNaN(val)) ? val : 0;

const Marquee = ({ buyers }) => {
  if (!buyers || buyers.length === 0) return null;
  return (
    <Box overflow="hidden" whiteSpace="nowrap" w="100%" position="relative">
      <Flex w="max-content" animation="scroll 20s linear infinite">
        {buyers.concat(buyers).map((buyer, idx) => (
          <Badge key={idx} mx="10px" px="15px" py="8px" borderRadius="full" colorScheme="blue" variant="subtle" fontSize="sm">
            {buyer}
          </Badge>
        ))}
      </Flex>
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}
      </style>
    </Box>
  );
};

export default function SupplyHub() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  const brandGreen = useColorModeValue('#048E3D', '#048E3D');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');
  const brandBg = useColorModeValue('green.50', 'rgba(4, 142, 61, 0.2)');
  const border = useColorModeValue('gray.200', 'whiteAlpha.100');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/company-profile');
        if (res.data.success) {
          const publicProfiles = res.data.data.filter(p => p.dataStatus === 'Live' || p.dataStatus === 'Verified');
          setCompanies(publicProfiles);
          if (publicProfiles.length > 0) {
            setSelectedCompany(publicProfiles[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="brand.500" />
      </Flex>
    );
  }

  const company = selectedCompany;

  if (!company) {
    return <Box pt="100px" px="20px"><Text>No companies found.</Text></Box>;
  }

  const ghgOptions = {
    chart: { type: 'area', toolbar: { show: false }, sparkline: { enabled: true } },
    stroke: { curve: 'smooth', width: 2 },
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.9, stops: [0, 90, 100] } },
    colors: [brandGreen],
    dataLabels: { enabled: false },
    tooltip: { enabled: false }
  };
  const ghgSeries = [{ name: 'Emissions', data: [300000, 320000, 310000, 350000, 400000, 420000, safeChartVal(company.emissions?.scope1_Plus_2_tCO2e)] }];

  const getRadialOptions = (color, label) => ({
    chart: { type: 'radialBar', sparkline: { enabled: true } },
    plotOptions: {
      radialBar: {
        hollow: { size: '65%' },
        track: { background: '#edf2f7' },
        dataLabels: {
          name: { show: false },
          value: { offsetY: 8, fontSize: '18px', fontWeight: 'bold', color: '#1a202c', show: true, formatter: (val) => val }
        }
      }
    },
    stroke: { lineCap: 'round' },
    colors: [color],
    labels: [label]
  });

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }} px={{ base: '10px', md: '20px' }} pb="40px" w="100%">
      
      {/* HEADER: TITLE & DROPDOWN */}
      <Flex justify="space-between" align={{ base: 'flex-start', md: 'center' }} direction={{ base: 'column', md: 'row' }} mb="30px" gap="20px">
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>Facility Explorer</Text>
          <Text fontSize="sm" color="gray.500">View detailed metrics for verified facilities.</Text>
        </Box>
        <Box w={{ base: '100%', md: '350px' }}>
          <Select 
            value={company._id} 
            onChange={(e) => {
              const comp = companies.find(c => c._id === e.target.value);
              setSelectedCompany(comp);
            }}
            bg={cardBg}
            size="md"
            borderRadius="8px"
            borderColor={border}
            _hover={{ borderColor: 'brand.500' }}
            _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #319795' }}
            fontWeight="bold"
            color={textColor}
          >
            {companies.map(c => (
              <option key={c._id} value={c._id}>{c.basicInfo?.companyName || 'Unnamed Facility'}</option>
            ))}
          </Select>
        </Box>
      </Flex>

      {/* TOP SECTION: Left Details, Right Map */}
      <Flex gap="20px" direction={{ base: 'column', lg: 'row' }} w="100%" align="stretch" mb="30px">
        
        <Box flex="1" minW={0} w="100%">
          <Text fontSize="3xl" fontWeight="bold" color={textColor} mb="20px">{company.basicInfo?.companyName}</Text>
          {company.notes && !company.notes.includes('Already researched') && (
            <Box bg={useColorModeValue('yellow.50', 'rgba(236, 201, 75, 0.1)')} p="15px" borderRadius="10px" mb="20px" border="1px solid" borderColor={useColorModeValue('yellow.200', 'transparent')}>
              <Text fontSize="sm" color={useColorModeValue('yellow.800', 'yellow.200')} fontWeight="600">
                <strong>Notes:</strong> {company.notes}
              </Text>
            </Box>
          )}

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
            <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm">
              <Flex align="center" mb="10px">
                <Icon as={MdLocationOn} color="gray.400" mr="5px" />
                <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide">LOCATION</Text>
              </Flex>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>{company.location?.hqState || 'N/A'}</Text>
            </Box>
            <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm">
              <Flex align="center" mb="10px">
                <Icon as={MdDateRange} color="gray.400" mr="5px" />
                <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide">ESTABLISHED</Text>
              </Flex>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>{formatVal(company.basicInfo?.yearFounded)}</Text>
            </Box>
            <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm">
              <Flex align="center" mb="10px">
                <Icon as={MdPeople} color="gray.400" mr="5px" />
                <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide">EMPLOYEES</Text>
              </Flex>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>{formatVal(company.basicInfo?.numEmployees)}</Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box w={{ base: '100%', lg: '500px' }} flexShrink={0}>
          <Box bg={cardBg} borderRadius="15px" overflow="hidden" h="100%" minH="300px" boxShadow="sm">
            <MapContainer 
              key={company._id}
              center={[company.location?.coordinates?.latitude || 22.5937, company.location?.coordinates?.longitude || 78.9629]}
              zoom={company.location?.coordinates?.latitude ? 12 : 5} 
              style={{ height: '100%', width: '100%', minHeight: '300px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {company.location?.coordinates?.latitude && company.location?.coordinates?.longitude && (
                <Marker position={[company.location.coordinates.latitude, company.location.coordinates.longitude]}>
                  <Popup>
                    <Text fontWeight="bold">{company.basicInfo?.companyName}</Text>
                    <Text fontSize="xs">{company.location?.city}, {company.location?.country}</Text>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </Box>
        </Box>
      </Flex>

      {/* BOTTOM SECTION: Full Width Panels */}
      <Box w="100%">
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing="20px" mb="20px">
          <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm">
            <Flex justify="space-between" align="center" mb="10px">
              <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide">GHG EMISSION OVERVIEW</Text>
              <Badge colorScheme={typeof company.emissions?.scope1_Plus_2_tCO2e === 'string' ? 'gray' : 'green'} bg={typeof company.emissions?.scope1_Plus_2_tCO2e === 'string' ? 'gray.100' : brandBg} color={typeof company.emissions?.scope1_Plus_2_tCO2e === 'string' ? 'gray.600' : brandGreen} px="2" py="1" borderRadius="md">
                Total Emissions: {formatVal(company.emissions?.scope1_Plus_2_tCO2e)}
              </Badge>
            </Flex>
            <Box h="200px">
              <Chart options={ghgOptions} series={ghgSeries} type="area" height="100%" width="100%" />
            </Box>
          </Box>

          <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm" display="flex" flexDirection="column" justifyContent="center">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide" textAlign="center" mb="20px">WORKFORCE DIVERSITY</Text>
            {typeof company.workforce?.malePercentage === 'number' && typeof company.workforce?.femalePercentage === 'number' ? (
              <>
                <Flex justify="space-between" mb="5px">
                  <Text fontWeight="bold" fontSize="sm">{formatVal(company.workforce?.malePercentage)}%</Text>
                  <Text fontWeight="bold" fontSize="sm">{formatVal(company.workforce?.femalePercentage)}%</Text>
                </Flex>
                <Flex h="15px" borderRadius="full" overflow="hidden" mb="10px">
                  <Box w={`${safeChartVal(company.workforce?.malePercentage)}%`} bg="#3182ce" />
                  <Box w={`${safeChartVal(company.workforce?.femalePercentage)}%`} bg="#d53f8c" />
                </Flex>
                <Flex justify="space-between">
                  <Text fontSize="2xl">👨🏻‍💼</Text>
                  <Text fontSize="2xl">👩🏻‍💼</Text>
                </Flex>
              </>
            ) : (
              <Center flexDirection="column" h="100%">
                <Icon as={MdPeople} color="gray.300" w="40px" h="40px" mb="10px" />
                <Text fontSize="xl" fontWeight="bold" color={textColor}>{formatVal(company.basicInfo?.numEmployees)}</Text>
                <Text fontSize="xs" color="gray.400">Total Workforce</Text>
              </Center>
            )}
          </Box>

          <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm" display="flex" flexDirection="column" justifyContent="center">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide" mb="20px">CLIMATE TARGETS</Text>
            <Flex align="center" mb="20px">
              <Center w="40px" h="40px" bg="green.50" borderRadius="md" mr="15px">
                <Icon as={MdRecycling} color={brandGreen} w="24px" h="24px" />
              </Center>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">RENEWABLE ENERGY TARGET</Text>
                <Text fontWeight="bold" color={textColor} fontSize="sm">{company.goalsAndActions?.renewableEnergyTarget || 'N/A'}</Text>
              </Box>
            </Flex>
            <Flex align="center">
              <Center w="40px" h="40px" bg="orange.50" borderRadius="md" mr="15px">
                <Icon as={MdFactory} color="orange.500" w="24px" h="24px" />
              </Center>
              <Box>
                <Text fontSize="xs" color="gray.500" fontWeight="bold">COAL PHASE-OUT STATUS</Text>
                <Text fontWeight="bold" color={textColor} fontSize="sm">{company.goalsAndActions?.coalPhaseOutStatus || 'N/A'}</Text>
              </Box>
            </Flex>
          </Box>
        </SimpleGrid>

        <Flex direction={{ base: 'column', md: 'row' }} gap="20px" mb="20px" align="stretch">
          <Box bg={cardBg} p="15px" borderRadius="15px" boxShadow="sm" w={{ base: '100%', md: '150px' }} flexShrink={0} textAlign="center" display="flex" flexDirection="column" justifyContent="center">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide">SUSTAINABLE</Text>
            {typeof company.supplyChain?.sustainableMaterialsPercentage === 'string' ? (
              <Text mt="15px" fontWeight="bold" color="gray.500">{company.supplyChain.sustainableMaterialsPercentage}</Text>
            ) : (
              <Chart options={getRadialOptions(brandGreen, 'Sustainable')} series={[safeChartVal(company.supplyChain?.sustainableMaterialsPercentage)]} type="radialBar" height={150} />
            )}
          </Box>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, xl: 5 }} spacing="15px" flex="1">
            {[
              { val: company.resources?.solarCapacity_MWp, label: 'SOLAR CAPACITY (MWp)' },
              { val: company.resources?.waste?.totalGenerated_MT, label: 'TOTAL WASTE (MT)' },
              { val: company.resources?.totalEnergy_TJ, label: 'TOTAL ENERGY (TJ)' },
              { val: company.resources?.totalWater_KL, label: 'TOTAL WATER (KL)' },
              { val: company.emissions?.energyCarbonIntensity, label: 'ENERGY CARBON INTENSITY' }
            ].map((kpi, idx) => (
              <Box key={idx} bg={cardBg} p="20px 15px" borderRadius="15px" boxShadow="sm" textAlign="center" display="flex" flexDirection="column" justifyContent="center">
                <Text fontSize={{base: "xl", lg: "2xl"}} fontWeight="bold" color={typeof kpi.val === 'string' ? 'gray.500' : textColor} mb="5px" wordBreak="break-word">{formatVal(kpi.val)}</Text>
                <Text fontSize="10px" color="gray.500" fontWeight="bold" textTransform="uppercase">{kpi.label}</Text>
              </Box>
            ))}
          </SimpleGrid>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing="20px" mb="20px">
          <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm" textAlign="center">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide">RENEWABLE %</Text>
            {typeof company.resources?.rePercentage === 'string' ? (
              <Text mt="30px" fontWeight="bold" color="gray.500">{company.resources.rePercentage}</Text>
            ) : (
              <Chart options={getRadialOptions(brandGreen, 'RE')} series={[safeChartVal(company.resources?.rePercentage)]} type="radialBar" height={150} />
            )}
          </Box>
          <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm" textAlign="center">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide">ESG SCORE</Text>
            {typeof company.scores?.esgScore === 'string' ? (
              <Text mt="30px" fontWeight="bold" color="gray.500">{company.scores.esgScore}</Text>
            ) : (
              <Chart options={getRadialOptions('#3182ce', 'ESG')} series={[safeChartVal(company.scores?.esgScore)]} type="radialBar" height={150} />
            )}
          </Box>
          
          <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm" display="flex" flexDirection="column" justifyContent="center">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide" textAlign="center" mb="15px">COMMITMENTS</Text>
            <SimpleGrid columns={2} spacing="15px">
              <Flex align="center"><Box w="10px" h="10px" borderRadius="full" bg={company.certifications?.re100Member === 'Yes' ? 'green.500' : 'gray.300'} mr="10px"/> <Text fontWeight="bold">RE100</Text></Flex>
              <Flex align="center"><Box w="10px" h="10px" borderRadius="full" bg={company.certifications?.sbtiStatus === 'Committed' || company.certifications?.sbtiStatus === 'Certified' ? 'green.500' : 'red.500'} mr="10px"/> <Text fontWeight="bold">SBTi</Text></Flex>
              <Flex align="center"><Box w="10px" h="10px" borderRadius="full" bg={company.certifications?.gots === 'Certified' ? 'green.500' : 'gray.300'} mr="10px"/> <Text fontWeight="bold">GOTS</Text></Flex>
              <Flex align="center"><Box w="10px" h="10px" borderRadius="full" bg={company.certifications?.iso14001 === 'Certified' ? 'green.500' : 'gray.300'} mr="10px"/> <Text fontWeight="bold">ISO14001</Text></Flex>
            </SimpleGrid>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px" mb="20px">
          <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide" mb="10px">PRIMARY RAW MATERIAL</Text>
            <Text fontWeight="bold" color={textColor}>{company.supplyChain?.primaryRawMaterial?.join(', ') || 'N/A'}</Text>
          </Box>
          <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm">
            <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide" mb="10px">FABRIC SOURCING GEOGRAPHY</Text>
            <Text fontWeight="bold" color={textColor}>{company.supplyChain?.fabricSourcingGeography || 'N/A'}</Text>
          </Box>
        </SimpleGrid>

        <Box bg={cardBg} p="20px" borderRadius="15px" boxShadow="sm" mb="20px">
          <Text fontSize="xs" fontWeight="bold" color="gray.500" letterSpacing="wide" mb="15px">MAJOR BUYERS</Text>
          <Marquee buyers={company.supplyChain?.majorBuyers || []} />
        </Box>

        <Box bg={cardBg} p="30px" borderRadius="15px" boxShadow="sm" mb="40px">
          <Text fontSize="md" fontWeight="bold" color={textColor} mb="20px" borderBottom="1px solid" borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')} pb="15px">
            FABRIC EMISSIONS & SOURCING ANALYSIS
          </Text>
          <Accordion allowToggle>
            {[
              { title: 'Cotton Fabric', vs: 'Organic Cotton' },
              { title: 'Polyester Fabric', vs: 'Recycled Polyester (rPET)' },
              { title: 'Viscose', vs: 'TENCEL Lyocell' },
              { title: 'Denim', vs: 'Recycled/Organic Denim' },
              { title: 'Trims', vs: 'Recycled Trims' }
            ].map((item, idx) => (
              <AccordionItem key={idx} border="1px solid" borderColor={useColorModeValue('gray.200', 'whiteAlpha.200')} bg="transparent" mb="15px" borderRadius="lg" overflow="hidden">
                <h2>
                  <AccordionButton p="15px 20px" _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}>
                    <Flex flex="1" textAlign="left" align="center" gap="15px">
                      <Text fontWeight="700" fontSize="md" color={textColor}>{item.title}</Text>
                      <Text color="gray.400" fontWeight="bold" fontSize="sm">VS</Text>
                      <Text fontWeight="700" fontSize="md" color={textColor}>{item.vs}</Text>
                    </Flex>
                    <AccordionIcon color="gray.400" />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={5} pt={5} px={6} color={useColorModeValue('gray.600', 'gray.300')} borderTop="1px solid" borderColor={useColorModeValue('gray.100', 'whiteAlpha.100')} bg={useColorModeValue('white', 'navy.800')}>
                  <SimpleGrid columns={{base: 1, md: 2}} spacing="30px">
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color="gray.500" mb="15px" textTransform="uppercase">{item.title} Impact (per kg)</Text>
                      
                      <Flex justify="space-between" mb="5px"><Text fontSize="xs" fontWeight="bold">Carbon Footprint</Text><Text fontSize="xs" fontWeight="bold">2.5 kg CO₂e</Text></Flex>
                      <Progress value={80} size="sm" colorScheme="red" borderRadius="md" mb="15px" bg={useColorModeValue('red.50', 'whiteAlpha.100')} />

                      <Flex justify="space-between" mb="5px"><Text fontSize="xs" fontWeight="bold">Water Consumption</Text><Text fontSize="xs" fontWeight="bold">2,100 L</Text></Flex>
                      <Progress value={90} size="sm" colorScheme="blue" borderRadius="md" bg={useColorModeValue('blue.50', 'whiteAlpha.100')} />
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="bold" color={brandGreen} mb="15px" textTransform="uppercase">{item.vs} Impact (per kg)</Text>
                      
                      <Flex justify="space-between" mb="5px"><Text fontSize="xs" fontWeight="bold">Carbon Footprint</Text><Text fontSize="xs" fontWeight="bold" color={brandGreen}>1.1 kg CO₂e</Text></Flex>
                      <Progress value={35} size="sm" colorScheme="green" borderRadius="md" mb="15px" bg={useColorModeValue('green.50', 'whiteAlpha.100')} />

                      <Flex justify="space-between" mb="5px"><Text fontSize="xs" fontWeight="bold">Water Consumption</Text><Text fontSize="xs" fontWeight="bold" color="teal.500">180 L</Text></Flex>
                      <Progress value={15} size="sm" colorScheme="teal" borderRadius="md" bg={useColorModeValue('teal.50', 'whiteAlpha.100')} />
                    </Box>
                  </SimpleGrid>
                  <Flex mt="20px" p="15px" bg={useColorModeValue('green.50', 'rgba(4, 142, 61, 0.1)')} borderRadius="md" align="center" border="1px solid" borderColor={useColorModeValue('green.100', 'transparent')}>
                    <Icon as={MdRecycling} color={brandGreen} mr="10px" w="20px" h="20px" />
                    <Text fontSize="sm" color={useColorModeValue('green.800', 'green.200')} fontWeight="bold">
                      Switching to {item.vs} reduces emissions by approx. 56% and water usage by 91%.
                    </Text>
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      </Box>
    </Box>
  );
}
