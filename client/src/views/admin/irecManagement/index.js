/* eslint-disable */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  SimpleGrid,
  Text,
  useToast,
  useColorModeValue,
  VStack,
  Divider,
  Badge,
  Checkbox,
} from '@chakra-ui/react';
import { MdCloudUpload, MdSync } from 'react-icons/md';
import * as XLSX from 'xlsx';
// 1. Apna custom api instance import kiya
import api from '../../../utils/axiosConfig';

const countries = [
  'India',
  'Vietnam',
  'Turkey',
  'Brazil',
  'China',
  'Thailand',
  'UAE',
  'Bangladesh',
];
const technologies = ['Solar', 'Wind', 'Hydro', 'Biomass', 'Waste to Energy'];
const statusOptions = ['Active', 'Non-Active', 'Under Construction'];

export default function IrecManagement() {
  const [formData, setFormData] = useState({
    country: 'India',
    company: '',
    plantCode: '',
    technology: 'Solar',
    volume: '',
    status: 'Active',
    latitude: '',
    longitude: '',
    address: '',
    commYear: new Date().getFullYear(),
    commissioningDate: '',
    isRE100: false,
  });

  const [allPlants, setAllPlants] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const cardBg = useColorModeValue('white', 'navy.800');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  useEffect(() => {
    fetchPlants();
  }, []);

  // 2. Fetch function using 'api'
  const fetchPlants = async () => {
    try {
      console.log(
        '%c[DB Fetch] Starting...',
        'color: blue; font-weight: bold;',
      );
      const res = await api.get('/irec/all-data');
      if (res.data.success) {
        console.log(
          `%c[DB Fetch] Success! Found ${res.data.data.length} plants.`,
          'color: green;',
        );
        setAllPlants(res.data.data);
      }
    } catch (err) {
      console.error('[DB Fetch] Error:', err);
    }
  };

  const eligibleToSync = allPlants.filter((plant) => {
    const isNonRE =
      plant.isRE100 === false ||
      plant.isRE100 === 'false' ||
      plant.isRE100 === 0 ||
      plant.isRE100 === undefined ||
      plant.isRE100 === null;
    const lastSync = plant.lastSyncDate
      ? new Date(plant.lastSyncDate).getTime()
      : 0;
    const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000;
    const now = new Date().getTime();
    return isNonRE && now - lastSync > ONE_MONTH_MS;
  });

  // 3. Sync Handler using 'api'
  const handleSyncData = async () => {
    console.log(
      '%c[Sync] Process Started',
      'color: orange; font-weight: bold;',
    );
    setIsSyncing(true);

    try {
      const response = await api.get('/irec/sync-evident');
      console.log('[Sync] Backend Response:', response.data);

      if (response.data.success) {
        toast({
          title: 'Sync Successful',
          description: `Database updated for ${eligibleToSync.length} assets.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        await fetchPlants();
      } else {
        throw new Error(response.data.message || 'Sync was not successful');
      }
    } catch (error) {
      console.error('[Sync] Error Details:', error);
      toast({
        title: 'Sync Error',
        description:
          error.response?.data?.message ||
          'Check backend connection or scraper status.',
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSyncing(false);
      console.log(
        '%c[Sync] Process Completed',
        'color: orange; font-weight: bold;',
      );
    }
  };

  // 4. Manual Submit using 'api'
  const handleManualSubmit = async () => {
    if (!formData.company || !formData.plantCode) {
      return toast({
        title: 'Error',
        description: 'Name and Code are required',
        status: 'error',
      });
    }
    try {
      await api.post('/irec/save', formData);
      toast({ title: 'Plant Saved!', status: 'success' });
      setFormData({ ...formData, company: '', plantCode: '' }); // Clear basic fields
      fetchPlants();
    } catch (err) {
      toast({ title: 'Error Saving', status: 'error' });
    }
  };

  // 5. Excel Upload using 'api'
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(ws, { defval: '' });

        const finalData = rawData
          .map((item) => {
            const findKey = (keyName) => {
              const foundKey = Object.keys(item).find(
                (k) => k.trim().toUpperCase() === keyName.toUpperCase(),
              );
              return foundKey ? String(item[foundKey]).trim() : '';
            };
            return {
              plantCode: findKey('CODE'),
              company: findKey('NAME'),
              country: findKey('COUNTRY') || 'India',
              technology: findKey('FUEL TYPE') || 'Solar',
              volume: parseFloat(findKey('INSTALLED CAPACITY')) || 0,
              status: findKey('STATUS') || 'Active',
              address: findKey('ADDRESS'),
              latitude: parseFloat(findKey('LATITUDE')) || 0,
              longitude: parseFloat(findKey('LONGITUDE')) || 0,
              isRE100: findKey('IS_RE100').toLowerCase() === 'yes',
              lastSyncDate: null,
            };
          })
          .filter((i) => i.plantCode);

        console.log('[Upload] Parsed Data:', finalData);
        await api.post('/irec/save', finalData);
        toast({ title: 'Upload Success', status: 'success' });
        fetchPlants();
      } catch (err) {
        toast({ title: 'Import Failed', status: 'error' });
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Box pt={{ base: '130px', md: '80px' }} px="20px">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
        {/* Left: Registration Form */}
        <Box bg={cardBg} p="30px" borderRadius="20px" boxShadow={cardShadow}>
          <Text fontSize="xl" fontWeight="700" mb="20px" color={textColor}>
            Register Plant Details
          </Text>
          <VStack spacing={4} align="stretch">
            <SimpleGrid columns={2} spacing={3}>
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="700">
                  Plant Code
                </FormLabel>
                <Input
                  value={formData.plantCode}
                  onChange={(e) =>
                    setFormData({ ...formData, plantCode: e.target.value })
                  }
                />
              </FormControl>
              <FormControl display="flex" alignItems="center" pt="30px">
                <Checkbox
                  colorScheme="brand"
                  isChecked={formData.isRE100}
                  onChange={(e) =>
                    setFormData({ ...formData, isRE100: e.target.checked })
                  }
                >
                  Is India RE 100?
                </Checkbox>
              </FormControl>
            </SimpleGrid>
            <FormControl isRequired>
              <FormLabel fontSize="sm" fontWeight="700">
                Company Name
              </FormLabel>
              <Input
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </FormControl>
            <SimpleGrid columns={3} spacing={3}>
              <FormControl>
                <FormLabel fontSize="xs">Country</FormLabel>
                <Select
                  size="sm"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs">Tech</FormLabel>
                <Select
                  size="sm"
                  value={formData.technology}
                  onChange={(e) =>
                    setFormData({ ...formData, technology: e.target.value })
                  }
                >
                  {technologies.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs">Status</FormLabel>
                <Select
                  size="sm"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </SimpleGrid>
            <Button
              colorScheme="brand"
              bg="#4318FF"
              color="white"
              h="50px"
              onClick={handleManualSubmit}
            >
              Save Details
            </Button>
          </VStack>
        </Box>

        {/* Right: Bulk Sync & Upload */}
        <Box
          bg={cardBg}
          p="30px"
          borderRadius="20px"
          boxShadow={cardShadow}
          textAlign="center"
        >
          <Text fontSize="xl" fontWeight="700" mb="20px" color={textColor}>
            Bulk Upload & Automation
          </Text>
          <Flex
            direction="column"
            align="center"
            justify="center"
            border="2px dashed"
            p="40px"
            borderRadius="15px"
            position="relative"
            _hover={{ bg: 'gray.50' }}
          >
            <Icon as={MdCloudUpload} w="50px" h="50px" color="brand.500" />
            <Text my="10px" fontWeight="500">
              Upload Excel (Column: IS_RE100)
            </Text>
            <Input
              type="file"
              accept=".xlsx, .csv"
              onChange={handleFileUpload}
              position="absolute"
              width="100%"
              height="100%"
              opacity="0"
              cursor="pointer"
            />
          </Flex>
          <Divider my="30px" />
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between">
              <Text fontSize="sm" fontWeight="600">
                Pending Non-RE Updates:
              </Text>
              <Badge
                colorScheme={eligibleToSync.length > 0 ? 'orange' : 'green'}
              >
                {eligibleToSync.length} Assets
              </Badge>
            </Flex>
            <Button
              leftIcon={<MdSync />}
              colorScheme="teal"
              w="100%"
              h="55px"
              isLoading={isSyncing}
              loadingText="Syncing with Evident..."
              isDisabled={eligibleToSync.length === 0}
              onClick={handleSyncData}
            >
              Sync History
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
