/* eslint-disable */
import React, { useState } from 'react';
import {
  Box,
  Flex,
  Icon,
  Input,
  Text,
  useToast,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { MdCloudUpload, MdHistory } from 'react-icons/md';
import * as XLSX from 'xlsx';
import api from '../../../utils/axiosConfig';

export default function MarketPricingUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const toast = useToast();

  const textColor = useColorModeValue('navy.700', 'white');
  const secondaryColor = useColorModeValue('gray.600', 'secondaryGray.600');
  const cardBg = useColorModeValue('white', 'navy.800');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const uploadHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];

        // Ye excel ke headers ko keys bana deta hai (e.g., Technology, Rate, etc.)
        const rawData = XLSX.utils.sheet_to_json(ws);

        // API Call to Backend
        const res = await api.post('/pricing/upload-market', rawData);

        if (res.data.success) {
          toast({
            title: 'Upload Success',
            description: `${res.data.count} records synced with Technology mapping.`,
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (err) {
        console.error('Upload Error:', err);
        toast({
          title: 'Error',
          description:
            err.response?.data?.message ||
            'Upload fail ho gaya. Excel headers (Technology, Rate, Country, Month) check karein.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsUploading(false);
        // Clear input so same file can be uploaded again
        e.target.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Box pt={{ base: '130px', md: '80px' }} px="20px">
      <VStack spacing="20px" align="stretch">
        <Box bg={cardBg} p="30px" borderRadius="20px" boxShadow="sm">
          <Flex direction="column" align="center">
            <Icon
              as={MdHistory}
              w="40px"
              h="40px"
              color="brand.500"
              mb="10px"
            />
            <Text fontSize="2xl" fontWeight="700" color={textColor}>
              Market Pricing History
            </Text>
            <Text fontSize="sm" color={secondaryColor} mb="10px">
              Please ensure Excel has 'Technology' column instead of 'Type'
            </Text>

            <Flex
              mt="20px"
              direction="column"
              align="center"
              justify="center"
              border="2px dashed"
              borderColor={isUploading ? 'brand.500' : borderColor}
              p="80px"
              borderRadius="15px"
              w="100%"
              bg={isUploading ? uploadHoverBg : 'transparent'}
              position="relative"
              transition="all 0.3s ease"
              _hover={{ bg: isUploading ? uploadHoverBg : 'gray.50' }}
            >
              <Icon as={MdCloudUpload} w="60px" h="60px" color="brand.500" />
              <Text
                my="15px"
                fontWeight="500"
                color={secondaryColor}
                textAlign="center"
              >
                {isUploading
                  ? 'Processing Technology Data & Syncing...'
                  : 'Click or Drag Excel file here'}
              </Text>

              <Input
                type="file"
                accept=".csv, .xlsx"
                onChange={handleFileUpload}
                position="absolute"
                width="100%"
                height="100%"
                opacity="0"
                cursor={isUploading ? 'not-allowed' : 'pointer'}
                disabled={isUploading}
              />
            </Flex>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
}
