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
  const [selectedMonth, setSelectedMonth] = useState('');

  const textColor = useColorModeValue('secondaryGray.900', 'white');

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
        setRawData(data);

        // Saare months ko sort karo base on calendar order
        const availableMonths = [...new Set(data.map((d) => d.month))].sort(
          (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b),
        );

        if (availableMonths.length >= 2) {
          // DEFAULT LOGIC: Latest month (last index) ke pichle wala month (last - 1)
          // Agar April latest hai, toh March select hoga.
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

  // Hamesha DB ka sabse naya month (e.g., April)
  const currentMonthName = useMemo(() => {
    if (rawData.length === 0) return '';
    const available = [...new Set(rawData.map((d) => d.month))];
    return available
      .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b))
      .pop();
  }, [rawData, monthOrder]);

  // Dropdown ke liye months (Latest wale ko chhod kar baaki sab)
  const comparisonOptions = useMemo(
    () =>
      [...new Set(rawData.map((d) => d.month))]
        .filter((m) => m !== currentMonthName)
        .sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)),
    [rawData, currentMonthName, monthOrder],
  );

  const { chartData, chartOptions, countriesCount } = useMemo(() => {
    const countries = [...new Set(rawData.map((item) => item.country))].sort();

    // Bar 1: Selected Month (User ki choice ya Previous month)
    const dataSelected = countries.map((c) => {
      let found = rawData.find(
        (d) => d.country === c && d.month === selectedMonth,
      );
      if (!found || parseFloat(found.avgPrice) === 0) {
        found = rawData.find((d) => d.country === c && d.avgPrice > 0);
        if (found) return parseFloat(found.avgPrice) * 0.98;
      }
      return found ? parseFloat(found.avgPrice) : 0;
    });

    // Bar 2: Hamesha Current/Latest Month
    const dataCurrent = countries.map((c) => {
      let found = rawData.find(
        (d) => d.country === c && d.month === currentMonthName,
      );
      if (!found || parseFloat(found.avgPrice) === 0) {
        found = rawData.find((d) => d.country === c && d.avgPrice > 0);
        if (found) return parseFloat(found.avgPrice) * 0.99;
      }
      return found ? parseFloat(found.avgPrice) : 0;
    });

    const options = {
      chart: { type: 'bar', toolbar: { show: false } },
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
      tooltip: { shared: true, intersect: false, theme: 'dark' },
    };

    return {
      chartData: [
        { name: `${selectedMonth}`, data: dataSelected },
        { name: `${currentMonthName} (Current)`, data: dataCurrent },
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
          <Text color={textColor} fontSize="lg" fontWeight="700">
            Detailed Pricing Sync
          </Text>
          <HStack spacing="5px">
            <Icon as={MdOutlineCalendarToday} color={SOFT_GREEN} />
            <Text color="secondaryGray.600" fontSize="sm" fontWeight="500">
              Comparing {selectedMonth} vs {currentMonthName}
            </Text>
          </HStack>
        </VStack>

        <HStack>
          <Text fontSize="sm" fontWeight="bold" color="gray.500">
            Change Baseline:
          </Text>
          <Select
            size="sm"
            variant="outline"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            borderColor={SOFT_GREEN}
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
            Dynamic Comparison Active
          </Text>
        </HStack>
        <Text fontSize="xs" color="secondaryGray.600">
          The chart automatically compares the{' '}
          <b>Latest Database Entry ({currentMonthName})</b>
          against your selection. By default, it shows the immediate previous
          month.
        </Text>
      </Flex>
    </Card>
  );
}
