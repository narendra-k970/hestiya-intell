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

  // Default comparison month (purana month)
  const [selectedMonth, setSelectedMonth] = useState('January');

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/pricing/country-avg');
        setRawData(res.data?.data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 1. Sabse Latest Month nikalna
  const currentMonthName = useMemo(() => {
    if (rawData.length === 0) return '';
    const monthOrder = [
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
    ];
    const available = [...new Set(rawData.map((d) => d.month))];
    return available
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .pop();
  }, [rawData]);

  // 2. Dropdown ke liye months (Current month ko filter kar diya)
  const comparisonOptions = useMemo(
    () =>
      [...new Set(rawData.map((d) => d.month))].filter(
        (m) => m !== currentMonthName,
      ),
    [rawData, currentMonthName],
  );

  // 3. Chart Logic
  const { chartData, chartOptions, countriesCount } = useMemo(() => {
    const countries = [...new Set(rawData.map((item) => item.country))].sort();

    const dataSelected = countries.map((c) =>
      Number(
        rawData.find((d) => d.country === c && d.month === selectedMonth)
          ?.avgPrice || 0,
      ).toFixed(2),
    );

    const dataCurrent = countries.map((c) =>
      Number(
        rawData.find((d) => d.country === c && d.month === currentMonthName)
          ?.avgPrice || 0,
      ).toFixed(2),
    );

    const options = {
      chart: { type: 'bar', toolbar: { show: false } },
      plotOptions: {
        bar: { borderRadius: 4, columnWidth: '60%' },
      },
      colors: [LIGHT_GREEN_TOWER, SOFT_GREEN],
      dataLabels: {
        enabled: true,
        formatter: (val) => (val > 0 ? `$${val}` : ''),
        style: { fontSize: '9px' },
        offsetY: -20,
      },
      xaxis: {
        categories: countries,
        labels: {
          style: { colors: '#A3AED0', fontSize: '11px', fontWeight: '600' },
        },
      },
      yaxis: {
        labels: { formatter: (v) => `$${v}`, style: { colors: '#A3AED0' } },
      },
      legend: { show: true, position: 'top', horizontalAlign: 'right' },
      tooltip: { theme: 'dark' },
    };

    return {
      chartData: [
        { name: `${selectedMonth} (Selected)`, data: dataSelected },
        { name: `${currentMonthName} (Latest)`, data: dataCurrent },
      ],
      chartOptions: options,
      countriesCount: countries.length,
    };
  }, [rawData, selectedMonth, currentMonthName]);

  if (loading)
    return (
      <Flex justify="center" align="center" h="300px">
        <Spinner color={SOFT_GREEN} />
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
          <Text color={textColor} fontSize="lg" fontWeight="700">
            Pricing Comparison
          </Text>
          <HStack spacing="5px">
            <Icon as={MdOutlineCalendarToday} color={SOFT_GREEN} />
            <Text color="secondaryGray.600" fontSize="xs" fontWeight="500">
              Comparing with Latest Data ({currentMonthName})
            </Text>
          </HStack>
        </VStack>

        <HStack>
          <Text fontSize="xs" fontWeight="bold" color="gray.500">
            Base Month:
          </Text>
          <Select
            size="sm"
            variant="outline"
            borderRadius="8px"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            borderColor={SOFT_GREEN}
            maxW="130px"
          >
            {comparisonOptions.map((m) => (
              <option key={m} value={m} style={{ color: 'black' }}>
                {m}
              </option>
            ))}
          </Select>
        </HStack>
      </Flex>

      <Box w="100%" overflowX="auto" pb="5px">
        <Box
          minW={countriesCount > 6 ? `${countriesCount * 120}px` : '100%'}
          h="280px"
        >
          <BarChart chartData={chartData} chartOptions={chartOptions} />
        </Box>
      </Box>

      <Flex w="100%" align="center" mt="10px">
        <Icon as={IoCheckmarkCircle} color={SOFT_GREEN} me="5px" />
        <Text color={SOFT_GREEN} fontSize="xs" fontWeight="700">
          Showing how prices changed from {selectedMonth} to {currentMonthName}.
        </Text>
      </Flex>
    </Card>
  );
}
