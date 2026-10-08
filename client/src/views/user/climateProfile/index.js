import React, { useState, useEffect } from 'react';
import { Box, SimpleGrid, Text, useColorModeValue, Flex, Image, Button, Badge } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/axiosConfig';

export default function ClimateProfileOverview() {
  const navigate = useNavigate();
  const [avgEsg, setAvgEsg] = useState(null);

  useEffect(() => {
    const fetchCompaniesAndCalculateEsg = async () => {
      try {
        const res = await api.get('/company-profile');
        if (res.data.success && res.data.data) {
          const companies = res.data.data;
          
          let totalEsg = 0;
          let count = 0;
          
          companies.forEach(company => {
            const score = company.scores?.esgScore;
            // Sirf wahi score lo jo "Not Disclosed" ya "N/A" na ho, balki ek valid number ho
            if (score && score !== 'Not Disclosed' && score !== 'N/A' && !isNaN(Number(score))) {
              totalEsg += Number(score);
              count++;
            }
          });
          
          if (count > 0) {
            setAvgEsg((totalEsg / count).toFixed(1)); // 1 decimal point tak average
          }
        }
      } catch (err) {
        console.error("Failed to fetch ESG data", err);
      }
    };
    
    fetchCompaniesAndCalculateEsg();
  }, []);
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const border = useColorModeValue('gray.200', 'whiteAlpha.200');

  const brands = [
    {
      id: 1,
      name: 'H&M Group',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg',
      summary: 'H&M Group is a global fashion brand committed to leading the change towards a circular and climate-positive fashion industry. Explore their supply chain, emission metrics, and sustainability goals.',
      route: '/user/suppliers'
    }
  ];

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Box mb="40px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>Climate Profiles</Text>
        <Text fontSize="md" color="gray.500" mt="2px">Explore sustainability data and supplier emissions for major brands.</Text>
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="20px">
        {brands.map(brand => (
          <Box 
            key={brand.id} 
            bg={cardBg} 
            p="25px" 
            borderRadius="15px" 
            border="1px solid" 
            borderColor={border}
            boxShadow="sm"
            position="relative"
            transition="transform 0.2s, box-shadow 0.2s"
            _hover={{ transform: 'translateY(-5px)', boxShadow: 'md' }}
          >
            {avgEsg && (
              <Badge 
                colorScheme="blue" 
                position="absolute" 
                top="10px" 
                left="10px"
                fontSize="11px"
                px="2"
                py="1"
                borderRadius="md"
              >
                ESG: {avgEsg}
              </Badge>
            )}
            <Flex justify="center" align="center" h="100px" mb="20px" bg="white" borderRadius="10px" p="10px" border="1px solid" borderColor="gray.100">
              <Image src={brand.logo} alt={brand.name} maxH="100%" maxW="100%" objectFit="contain" />
            </Flex>
            <Text fontSize="xl" fontWeight="bold" color={textColor} mb="10px">{brand.name}</Text>
            <Text fontSize="sm" color="gray.500" mb="25px" minH="60px">
              {brand.summary}
            </Text>
            <Button 
              colorScheme="green" 
              w="100%" 
              onClick={() => navigate(brand.route)}
            >
              View Suppliers
            </Button>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}


