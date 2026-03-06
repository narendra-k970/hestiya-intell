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
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
import api from 'utils/axiosConfig';

// SOFTER PROFESSIONAL GREEN
const SOFT_GREEN = '#48BB78';
const LIGHT_GREEN_TOWER = '#C6F6D5';

export default function TotalSpent(props) {
  const { ...rest } = props;
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('February'); // Default to latest

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const iconColor = SOFT_GREEN;

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

  const availableMonths = useMemo(
    () => [...new Set(rawData.map((d) => d.month))],
    [rawData],
  );

  // Logic to find Previous Month automatically
  const prevMonth = useMemo(() => {
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
    const idx = monthOrder.indexOf(selectedMonth);
    return idx > 0 ? monthOrder[idx - 1] : monthOrder[0];
  }, [selectedMonth]);

  const { chartData, chartOptions, countriesCount } = useMemo(() => {
    const countries = [...new Set(rawData.map((item) => item.country))].sort();

    // Previous Month Data
    const dataPrev = countries.map((c) =>
      (
        rawData.find((d) => d.country === c && d.month === prevMonth)
          ?.avgPrice || 0
      ).toFixed(2),
    );
    // Selected (Current) Month Data
    const dataCurr = countries.map((c) =>
      (
        rawData.find((d) => d.country === c && d.month === selectedMonth)
          ?.avgPrice || 0
      ).toFixed(2),
    );

    const options = {
      chart: { type: 'bar', toolbar: { show: false }, stacked: false },
      plotOptions: {
        bar: {
          borderRadius: 5,
          columnWidth: '50%',
          dataLabels: { position: 'top' },
        },
      },
      colors: [LIGHT_GREEN_TOWER, SOFT_GREEN],
      dataLabels: {
        enabled: true,
        formatter: (val) => (val > 0 ? `$${val}` : ''),
        offsetY: -20,
        style: { fontSize: '10px', colors: ['#718096'] },
      },
      xaxis: {
        categories: countries,
        labels: {
          style: { colors: '#A3AED0', fontSize: '11px', fontWeight: '600' },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        show: true,
        labels: {
          style: { colors: '#A3AED0', fontSize: '10px' },
          formatter: (v) => `$${v}`,
        },
      },
      grid: { borderColor: 'rgba(163, 174, 208, 0.1)', strokeDashArray: 5 },
      tooltip: { theme: 'dark' },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        labels: { colors: '#A3AED0' },
      },
    };

    return {
      chartData: [
        { name: `Prev (${prevMonth})`, data: dataPrev },
        { name: `Current (${selectedMonth})`, data: dataCurr },
      ],
      chartOptions: options,
      countriesCount: countries.length,
    };
  }, [rawData, selectedMonth, prevMonth]);

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
            Pricing Trends
          </Text>
          <HStack spacing="5px">
            <Icon as={MdOutlineCalendarToday} color={SOFT_GREEN} />
            <Text color="secondaryGray.600" fontSize="xs" fontWeight="500">
              Monthly Comparison
            </Text>
          </HStack>
        </VStack>

        <HStack>
          <Text fontSize="xs" fontWeight="bold" color="gray.500">
            Month:
          </Text>
          <Select
            size="sm"
            variant="outline"
            borderRadius="8px"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            borderColor={SOFT_GREEN}
            _hover={{ borderColor: SOFT_GREEN }}
            maxW="130px"
          >
            {availableMonths.map((m) => (
              <option key={m} value={m} style={{ color: 'black' }}>
                {m}
              </option>
            ))}
          </Select>
        </HStack>
      </Flex>

      {/* Container for Chart - No Vertical Scroll */}
      <Box
        w="100%"
        overflowX="auto"
        overflowY="hidden"
        pb="5px"
        css={{
          '&::-webkit-scrollbar': { height: '5px' },
          '&::-webkit-scrollbar-thumb': {
            background: '#E2E8F0',
            borderRadius: '10px',
          },
          '&::-webkit-scrollbar-thumb:hover': { background: SOFT_GREEN },
        }}
      >
        <Box
          minW={countriesCount > 6 ? `${countriesCount * 110}px` : '100%'}
          h="280px"
        >
          <BarChart chartData={chartData} chartOptions={chartOptions} />
        </Box>
      </Box>

      <Flex w="100%" align="center" mt="10px">
        <Icon as={IoCheckmarkCircle} color={SOFT_GREEN} me="5px" />
        <Text color={SOFT_GREEN} fontSize="xs" fontWeight="700">
          Comparing {selectedMonth} with {prevMonth}.
        </Text>
      </Flex>
    </Card>
  );
}
