import React, { useState, useEffect } from 'react';
import { 
  Box, SimpleGrid, Text, useColorModeValue, Flex, Button, Center, Spinner, IconButton, Icon,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Input, Textarea, useDisclosure, useToast, Badge
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';
import api from '../../../utils/axiosConfig';

export default function SupplierList() {
  const navigate = useNavigate();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const border = useColorModeValue('gray.200', 'whiteAlpha.200');
  const toast = useToast();

  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [claimData, setClaimData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    missingDataInfo: '',
    missingDataFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/company-profile');
        if (res.data.success) {
          const publicProfiles = res.data.data
            .sort((a, b) => a.basicInfo?.companyName?.localeCompare(b.basicInfo?.companyName));
          setBrands(publicProfiles);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const openClaimModal = (company) => {
    setSelectedCompany(company);
    setClaimData({
      userName: '',
      userEmail: '',
      userPhone: '',
      missingDataInfo: '',
      missingDataFile: null
    });
    onOpen();
  };

  const submitClaim = async () => {
    if (!claimData.userName || !claimData.userEmail || !claimData.userPhone) {
      toast({ title: 'Please fill name, email and phone number', status: 'warning' });
      return;
    }
    
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('companyId', selectedCompany._id);
    formData.append('companyName', selectedCompany.basicInfo?.companyName);
    formData.append('userName', claimData.userName);
    formData.append('userEmail', claimData.userEmail);
    formData.append('userPhone', claimData.userPhone);
    formData.append('missingDataInfo', claimData.missingDataInfo);
    if (claimData.missingDataFile) {
      formData.append('missingDataFile', claimData.missingDataFile);
    }

    try {
      await api.post('/company-profile/claim', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast({ title: 'Profile Claim Submitted', description: "We will review your request and get back to you.", status: 'success' });
      onClose();
    } catch (err) {
      toast({ title: 'Submission Failed', description: err.response?.data?.message || 'Error', status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center h="100vh" pt="80px">
        <Spinner size="xl" color="green.500" />
      </Center>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex align="center" mb="30px">
        <IconButton 
          icon={<Icon as={MdArrowBack} boxSize={5} />} 
          onClick={() => navigate('/user/climate-profile')}
          variant="ghost"
          mr="10px"
          aria-label="Back to Brands"
        />
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color={textColor}>H&M Group Suppliers</Text>
          <Text fontSize="sm" color="gray.500" mt="2px">Select a supplier to view their climate dashboard.</Text>
        </Box>
      </Flex>

      {brands.length === 0 ? (
        <Center h="50vh"><Text>No company profiles found.</Text></Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 3, lg: 4, xl: 5 }} spacing="15px">
          {brands.map(brand => {
            const name = brand.basicInfo?.companyName || 'Unknown Company';
            return (
              <Box 
                key={brand._id} 
                bg={cardBg} 
                p="20px" 
                borderRadius="12px" 
                border="1px solid" 
                borderColor={border}
                boxShadow="sm"
                transition="transform 0.2s, box-shadow 0.2s"
                _hover={{ transform: 'translateY(-3px)', boxShadow: 'md' }}
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                position="relative"
              >
                {brand.scores?.esgScore && brand.scores.esgScore !== 'N/A' && (
                  <Badge 
                    colorScheme={brand.scores.esgScore === 'Not Disclosed' ? 'gray' : 'blue'} 
                    position="absolute" 
                    top="8px" 
                    left="8px"
                    fontSize="10px"
                    px="2"
                    py="1"
                    borderRadius="md"
                    textTransform="uppercase"
                    maxW="110px"
                    isTruncated
                  >
                    ESG: {brand.scores.esgScore === 'Not Disclosed' ? 'N/D' : brand.scores.esgScore}
                  </Badge>
                )}
                
                <Button 
                  size="xs" 
                  position="absolute" 
                  top="5px" 
                  right="5px" 
                  colorScheme="teal" 
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); openClaimModal(brand); }}
                >
                  Claim Profile
                </Button>

                <Text fontSize="lg" fontWeight="bold" color={textColor} mb="15px" mt="20px" noOfLines={2} textAlign="center">{name}</Text>
                
                <Button 
                  colorScheme="green" 
                  w="100%" 
                  size="sm"
                  mt="10px"
                  onClick={() => navigate('/user/company-profile', { state: { companyId: brand._id } })}
                >
                  View Details
                </Button>
              </Box>
            );
          })}
        </SimpleGrid>
      )}

      {/* Claim Profile Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="15px">
          <ModalHeader>Claim Profile - {selectedCompany?.basicInfo?.companyName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="gray.500" mb={4}>
              Provide your details and any missing information. We will verify and update your company's profile.
            </Text>
            
            <FormControl isRequired mb={3}>
              <FormLabel>Name</FormLabel>
              <Input placeholder="Enter your name" value={claimData.userName} onChange={(e) => setClaimData({...claimData, userName: e.target.value})} />
            </FormControl>

            <FormControl isRequired mb={3}>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="Enter your official email" value={claimData.userEmail} onChange={(e) => setClaimData({...claimData, userEmail: e.target.value})} />
            </FormControl>

            <FormControl isRequired mb={3}>
              <FormLabel>Phone Number</FormLabel>
              <Input placeholder="Enter your phone number" value={claimData.userPhone} onChange={(e) => setClaimData({...claimData, userPhone: e.target.value})} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>What data is missing or incorrect?</FormLabel>
              <Textarea placeholder="Describe the missing data..." value={claimData.missingDataInfo} onChange={(e) => setClaimData({...claimData, missingDataInfo: e.target.value})} />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Upload Supporting File (Optional)</FormLabel>
              <Input type="file" p={1} onChange={(e) => setClaimData({...claimData, missingDataFile: e.target.files[0]})} />
              <Text fontSize="xs" color="gray.500" mt={1}>
                You can upload your ESG certificate, GHG report, or other relevant documents.
              </Text>
            </FormControl>

          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Cancel</Button>
            <Button colorScheme="green" onClick={submitClaim} isLoading={isSubmitting}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}
