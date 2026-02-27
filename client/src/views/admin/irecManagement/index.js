/* eslint-disable */
import React, { useState, useEffect, useMemo } from 'react';
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
} from '@chakra-ui/react';
import { MdCloudUpload, MdSync, MdSave } from 'react-icons/md';
import * as XLSX from 'xlsx';
import api from '../../../utils/axiosConfig';

export default function IrecManagement() {
  const [formData, setFormData] = useState({
    plantCode: '',
    company: '',
    country: '',
    technology: '',
    capacity: '',
    address: '',
    latitude: '',
    longitude: '',
    status: 'Active',
    commYear: '',
    commissioningDate: '',
    isRE100: false,
  });

  const [allPlants, setAllPlants] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('New Zealand');
  const [dynamicCountries, setDynamicCountries] = useState([
    'India',
    'New Zealand',
    'Pakistan',
  ]);

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'navy.800');

  useEffect(() => {
    fetchPlants();
    fetchCountries();
  }, []);

  const fetchPlants = async () => {
    try {
      const res = await api.get('/irec/all-data');
      if (res.data.success) setAllPlants(res.data.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await api.get('/irec/countries');
      if (res.data.success) setDynamicCountries(res.data.countries);
    } catch (err) {
      console.error('Country error:', err);
    }
  };

  // Logic: Sirf wo plants jo DB mein hain aur lastSyncAt null hai
  const pendingInDB = useMemo(() => {
    return allPlants.filter(
      (p) =>
        p.country?.toLowerCase() === selectedCountry?.toLowerCase() &&
        !p.lastSyncAt,
    ).length;
  }, [allPlants, selectedCountry]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const rawData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
        defval: '',
      });

      const mapped = rawData
        .map((item) => {
          const getV = (keys) => {
            const foundKey = Object.keys(item).find((k) =>
              keys.some(
                (key) =>
                  k.toLowerCase().replace(/\s/g, '') ===
                  key.toLowerCase().replace(/\s/g, ''),
              ),
            );
            return foundKey ? item[foundKey] : '';
          };

          return {
            plantCode: String(getV(['Code', 'plantCode'])).trim(),
            company: getV(['Name', 'company']),
            country: getV(['Country']) || selectedCountry,
            technology: getV(['FuelType', 'technology']),
            capacity: getV(['InstalledCapacity', 'capacity']),
            commissioningDate: getV(['CommissioningDate']),
            address: getV(['Address']),
            latitude: parseFloat(getV(['Latitude'])),
            longitude: parseFloat(getV(['Longitude'])),
            status: getV(['Status']),
            commYear: parseInt(getV(['COMMISSIONINGYEAR', 'commYear'])),
            isRE100: String(getV(['isRE100']))
              .toLowerCase()
              .includes('yes'),
          };
        })
        .filter((i) => i.plantCode && i.plantCode !== 'undefined');

      setExcelData(mapped);
      toast({
        title: `${mapped.length} Plants loaded from file`,
        status: 'info',
      });
    };
    reader.readAsBinaryString(file);
  };

  // --- STEP 1: ONLY IMPORT ---
  const handleImportData = async () => {
    setIsProcessing(true);
    try {
      const res = await api.post('/irec/save', excelData);
      if (res.data.success) {
        toast({
          title: 'Import Successful!',
          description: 'Data DB mein save ho gaya. Ab sync karein.',
          status: 'success',
        });
        setExcelData([]);
        await fetchPlants();
      }
    } catch (error) {
      toast({ title: 'Import Error', status: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  // --- STEP 2: ONLY SYNC ---
  const handleManualSync = async () => {
    setIsProcessing(true);
    try {
      const response = await api.get(
        `/irec/sync-evident?country=${selectedCountry}`,
      );
      if (response.data.success) {
        toast({
          title: 'Sync Started',
          description: `Scraping ${selectedCountry}...`,
          status: 'success',
        });
      }
    } catch (error) {
      toast({ title: 'Sync Error', status: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box pt="80px" px="20px">
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
        {/* Manual Section */}
        <Box bg={cardBg} p="30px" borderRadius="20px" boxShadow="lg">
          <Text fontSize="xl" fontWeight="700" mb="4">
            Plant Registration
          </Text>
          <VStack spacing={3}>
            <FormControl isRequired>
              <FormLabel fontSize="xs">PLANT CODE</FormLabel>
              <Input
                value={formData.plantCode}
                onChange={(e) =>
                  setFormData({ ...formData, plantCode: e.target.value })
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel fontSize="xs">COMPANY</FormLabel>
              <Input
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </FormControl>
            <Button
              colorScheme="brand"
              w="100%"
              onClick={async () => {
                await api.post('/irec/save', [formData]);
                fetchPlants();
              }}
              bg="blue.600"
              color="white"
            >
              Save Plant
            </Button>
          </VStack>
        </Box>

        {/* Bulk System */}
        <Box bg={cardBg} p="30px" borderRadius="20px" boxShadow="lg">
          <Text fontSize="xl" fontWeight="700" mb="4">
            Bulk Management System
          </Text>
          <Flex
            direction="column"
            align="center"
            border="2px dashed gray"
            p="10"
            borderRadius="15"
            position="relative"
            mb="4"
          >
            <Icon as={MdCloudUpload} w="10" h="10" color="blue.500" />
            <Text mt="2">
              {excelData.length > 0
                ? `${excelData.length} Plants Ready`
                : 'Upload Excel File'}
            </Text>
            <Input
              type="file"
              onChange={handleFileUpload}
              position="absolute"
              opacity="0"
              cursor="pointer"
              height="100%"
              width="100%"
            />
          </Flex>

          {excelData.length > 0 && (
            <Button
              leftIcon={<MdSave />}
              colorScheme="orange"
              w="100%"
              h="14"
              mb="4"
              isLoading={isProcessing}
              onClick={handleImportData}
            >
              Import to Database
            </Button>
          )}

          <Divider mb="4" />

          <VStack align="stretch" spacing={2}>
            <Select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {dynamicCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Badge colorScheme="red" p="2" textAlign="center">
              Pending to Sync: {pendingInDB}
            </Badge>
            <Button
              leftIcon={<MdSync />}
              colorScheme="teal"
              h="14"
              isLoading={isProcessing}
              onClick={handleManualSync}
              isDisabled={pendingInDB === 0}
            >
              Sync {selectedCountry} Now
            </Button>
          </VStack>
        </Box>
      </SimpleGrid>
    </Box>
  );
}
