/* eslint-disable */
import React from 'react';
import {
  Box,
  Text,
  useColorModeValue,
  SimpleGrid,
  Flex,
  Badge,
  Icon,
  VStack,
  Avatar,
  HStack,
  Divider,
} from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MdLocationOn, MdVerified, MdLanguage } from 'react-icons/md';

// Custom Minimalist Marker Icon
const customIcon = new L.DivIcon({
  className: 'custom-marker',
  html: `<div style="
    background-color:#422AFB; 
    width:14px; 
    height:14px; 
    border-radius:50%; 
    border:3px solid white; 
    box-shadow: 0 0 12px rgba(66, 42, 251, 0.5);
    cursor: pointer;
  "></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

export default function CompanyMapView() {
  // Theme-based values (Hooks called at top level)
  const cardBg = useColorModeValue('white', 'navy.800');
  const textColor = useColorModeValue('navy.700', 'white');
  const subTextColor = useColorModeValue(
    'secondaryGray.600',
    'secondaryGray.500',
  );
  const priceBoxBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const mapStyle = useColorModeValue(
    'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  );

  const dummyCompanies = [
    {
      id: 1,
      name: 'Hestiya Solar Mumbai',
      lat: 19.076,
      lng: 72.8777,
      location: 'Mumbai, India',
      price: '₹450',
      status: 'Premium',
    },
    {
      id: 2,
      name: 'Nordic Wind Power',
      lat: 59.3293,
      lng: 18.0686,
      location: 'Stockholm, Sweden',
      price: '$620',
      status: 'Verified',
    },
    {
      id: 3,
      name: 'Sahara Energy',
      lat: 30.0444,
      lng: 31.2357,
      location: 'Cairo, Egypt',
      price: '€380',
      status: 'Verified',
    },
    {
      id: 4,
      name: 'Amazonas Bio',
      lat: -3.119,
      lng: -60.0217,
      location: 'Manaus, Brazil',
      price: '$410',
      status: 'Verified',
    },
    {
      id: 5,
      name: 'Tokyo Renewables',
      lat: 35.6762,
      lng: 139.6503,
      location: 'Tokyo, Japan',
      price: '¥12k',
      status: 'Premium',
    },
    {
      id: 6,
      name: 'NY Clean Energy',
      lat: 40.7128,
      lng: -74.006,
      location: 'New York, USA',
      price: '$550',
      status: 'Verified',
    },
  ];

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <SimpleGrid columns={{ base: 1 }} gap="20px">
        <Box
          bg={cardBg}
          p="20px"
          borderRadius="30px"
          boxShadow="0px 18px 40px rgba(112, 144, 176, 0.12)"
        >
          {/* Header */}
          <Flex align="center" justify="space-between" mb="20px" px="10px">
            <VStack align="start" spacing={0}>
              <HStack>
                <Icon as={MdLanguage} color="brand.500" h="20px" w="20px" />
                <Text color={textColor} fontSize="20px" fontWeight="800">
                  Global Asset Explorer
                </Text>
              </HStack>
              <Text color="secondaryGray.600" fontSize="sm">
                Real-time marketplace distribution
              </Text>
            </VStack>
            <Badge
              colorScheme="brand"
              borderRadius="full"
              px="3"
              variant="subtle"
            >
              Global View
            </Badge>
          </Flex>

          {/* Map Container */}
          <Box h="620px" borderRadius="24px" overflow="hidden">
            <MapContainer
              center={[25, 10]}
              zoom={2.5}
              minZoom={2}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url={mapStyle} attribution="&copy; CartoDB" />

              {dummyCompanies.map((company) => (
                <Marker
                  key={company.id}
                  position={[company.lat, company.lng]}
                  icon={customIcon}
                  eventHandlers={{
                    mouseover: (e) => e.target.openPopup(),
                    mouseout: (e) => e.target.closePopup(),
                  }}
                >
                  <Popup closeButton={false} autoPan={false}>
                    <Box borderRadius="20px" overflow="hidden">
                      {/* Header with Avatar & Name */}
                      <Flex
                        bgGradient="linear(to-br, brand.400, brand.700)"
                        p="12px"
                        align="center"
                        gap="10px"
                      >
                        <Avatar
                          h="32px"
                          w="32px"
                          border="2px solid white"
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&bg=fff&color=422AFB&bold=true`}
                        />
                        <VStack align="start" spacing={-1}>
                          <HStack spacing={1}>
                            <Text
                              fontWeight="800"
                              color="white"
                              fontSize="xs"
                              noOfLines={1}
                            >
                              {company.name}
                            </Text>
                            <Icon
                              as={MdVerified}
                              color="blue.200"
                              w="10px"
                              h="10px"
                            />
                          </HStack>
                          <Text
                            color="whiteAlpha.800"
                            fontSize="9px"
                            fontWeight="600"
                            letterSpacing="0.3px"
                          >
                            {company.status.toUpperCase()} PARTNER
                          </Text>
                        </VStack>
                      </Flex>

                      {/* Info Section */}
                      <VStack p="12px" align="start" spacing={3} bg={cardBg}>
                        <HStack spacing={1}>
                          <Icon
                            as={MdLocationOn}
                            color="red.400"
                            w="14px"
                            h="14px"
                          />
                          <Text
                            fontSize="10px"
                            fontWeight="700"
                            color={subTextColor}
                          >
                            {company.location}
                          </Text>
                        </HStack>

                        <Flex
                          w="100%"
                          bg={priceBoxBg}
                          p="8px 12px"
                          borderRadius="12px"
                          justify="space-between"
                          align="center"
                        >
                          <Box>
                            <Text
                              fontSize="8px"
                              fontWeight="800"
                              color="gray.400"
                              mb="-2px"
                            >
                              UNIT PRICE
                            </Text>
                            <Text
                              fontSize="md"
                              fontWeight="900"
                              color="green.500"
                            >
                              {company.price}
                            </Text>
                          </Box>
                          <Badge
                            colorScheme="brand"
                            variant="subtle"
                            borderRadius="6px"
                            fontSize="9px"
                          >
                            iREC: 0
                          </Badge>
                        </Flex>

                        <Divider
                          borderColor={useColorModeValue(
                            'gray.100',
                            'whiteAlpha.100',
                          )}
                        />

                        <Text
                          fontSize="9px"
                          color="gray.400"
                          textAlign="center"
                          w="100%"
                        >
                          Hestiya Security Verified
                        </Text>
                      </VStack>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
