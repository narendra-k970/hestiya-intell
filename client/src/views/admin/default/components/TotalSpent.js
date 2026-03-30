/* eslint-disable */
import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Spinner,
  Select,
  HStack,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import BarChart from 'components/charts/BarChart';
import React, { useEffect, useState, useMemo } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { MdOutlineCalendarToday } from 'react-icons/md';
import api from 'utils/axiosConfig';

const SOFT_GREEN = '#48BB78';
const LIGHT_GREEN_TOWER = '#C6F6D5';

export default function TotalSpent(props) {
  const { ...rest } = props;
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');

  const monthOrder = useMemo(
    () => [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    [],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/pricing/country-avg');
        const data = res.data?.data || [];

        // Console check for Debugging (Check Taiwan price here)
        console.log('Raw API Data:', data);

        setRawData(data);

        // Logic: Latest aur Previous month set karna
        const availableMonths = [...new Set(data.map((d) => d.month))].sort(
          (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b),
        );

        if (availableMonths.length >= 2) {
          // Default selection: Last month se pehla wala (e.g. Feb if March is latest)
          setSelectedMonth(availableMonths[availableMonths.length - 2]);
        } else if (availableMonths.length === 1) {
          setSelectedMonth(availableMonths[0]);
        }
      } catch (err) {
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [monthOrder]);

  const currentMonthName = useMemo(() => {
    if (rawData.length === 0) return '';
    const available = [...new Set(rawData.map((d) => d.month))];
    return available
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .pop();
  }, [rawData, monthOrder]);

  const comparisonOptions = useMemo(
    () =>
      [...new Set(rawData.map((d) => d.month))]
        .filter((m) => m !== currentMonthName)
        .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)),
    [rawData, currentMonthName, monthOrder],
  );

  const { chartData, chartOptions, countriesCount } = useMemo(() => {
    const countries = [...new Set(rawData.map((item) => item.country))].sort();

    // Taiwan Fix: Map exact numeric values
    const dataSelected = countries.map((c) => {
      const found = rawData.find(
        (d) => d.country === c && d.month === selectedMonth,
      );
      return found ? parseFloat(found.avgPrice) : 0;
    });

    const dataCurrent = countries.map((c) => {
      const found = rawData.find(
        (d) => d.country === c && d.month === currentMonthName,
      );
      return found ? parseFloat(found.avgPrice) : 0;
    });

    const options = {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        animations: { enabled: true, speed: 600 },
      },
      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '60%',
          dataLabels: { position: 'top' },
        },
      },
      colors: [LIGHT_GREEN_TOWER, SOFT_GREEN],
      dataLabels: {
        enabled: true,
        formatter: (val) => (val > 0 ? `$${val.toFixed(2)}` : ''),
        offsetY: -20,
        style: { fontSize: '10px', colors: [textColor], fontWeight: 'bold' },
      },
      xaxis: {
        categories: countries,
        labels: {
          style: { colors: '#A3AED0', fontSize: '11px', fontWeight: '600' },
          rotate: -45,
          trim: true,
        },
      },
      yaxis: {
        labels: {
          formatter: (v) => `$${v.toFixed(0)}`,
          style: { colors: '#A3AED0' },
        },
        forceNiceScale: true,
      },
      legend: { show: true, position: 'top', horizontalAlign: 'right' },
      tooltip: {
        theme: 'dark',
        y: { formatter: (val) => `$${val.toFixed(2)}` },
      },
    };

    return {
      chartData: [
        { name: `${selectedMonth}`, data: dataSelected },
        { name: `${currentMonthName} (Latest)`, data: dataCurrent },
      ],
      chartOptions: options,
      countriesCount: countries.length,
    };
  }, [rawData, selectedMonth, currentMonthName, textColor]);

  if (loading)
    return (
      <Flex justify="center" align="center" h="400px">
        <Spinner color={SOFT_GREEN} size="xl" />
      </Flex>
    );

  return (
    <Card
      p="20px"
      alignItems="center"
      flexDirection="column"
      w="100%"
      {...rest}
    >
      <Flex justify="space-between" align="center" w="100%" mb="20px">
        <VStack align="start" spacing="2px">
          <Text color={textColor} fontSize="xl" fontWeight="700">
            Detailed Pricing Sync
          </Text>
          <HStack spacing="5px">
            <Icon as={MdOutlineCalendarToday} color={SOFT_GREEN} />
            <Text color="secondaryGray.600" fontSize="sm" fontWeight="500">
              Live DB Data: {currentMonthName}
            </Text>
          </HStack>
        </VStack>

        <HStack>
          <Text fontSize="sm" fontWeight="bold" color="gray.500">
            Compare with:
          </Text>
          <Select
            size="sm"
            variant="outline"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            borderColor={SOFT_GREEN}
            focusBorderColor={SOFT_GREEN}
            borderRadius="8px"
            maxW="140px"
          >
            {comparisonOptions.map((m) => (
              <option key={m} value={m} style={{ color: 'black' }}>
                {m}
              </option>
            ))}
          </Select>
        </HStack>
      </Flex>

      {/* Chart Section */}
      <Box w="100%" overflowX="auto" pb="20px">
        <Box
          minW={countriesCount > 4 ? `${countriesCount * 160}px` : '100%'}
          h="350px"
        >
          <BarChart
            key={`${selectedMonth}-${currentMonthName}-${rawData.length}`}
            chartData={chartData}
            chartOptions={chartOptions}
          />
        </Box>
      </Box>

      {/* Accuracy Helper: Text Info */}
      <Flex
        w="100%"
        direction="column"
        mt="10px"
        p="15px"
        bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
        borderRadius="12px"
      >
        <HStack mb="10px">
          <Icon as={IoCheckmarkCircle} color={SOFT_GREEN} />
          <Text color={textColor} fontSize="sm" fontWeight="700">
            Data Verification
          </Text>
        </HStack>
        <Text fontSize="xs" color="secondaryGray.600">
          Showing exact pricing from database for <b>{selectedMonth}</b> and{' '}
          <b>{currentMonthName}</b>. Taiwan bars are scaled to show actual price
          ($100+), while others ($2-$5) are visible via data labels.
        </Text>
      </Flex>
    </Card>
  );
}
