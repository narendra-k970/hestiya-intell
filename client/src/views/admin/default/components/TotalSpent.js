/* eslint-disable */
import {
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import LineChart from 'components/charts/LineChart';
import React, { useEffect, useState } from 'react';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { MdBarChart, MdOutlineCalendarToday } from 'react-icons/md';
import api from 'utils/axiosConfig';

export default function TotalSpent(props) {
  const { ...rest } = props;
  const [chartData, setChartData] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [loading, setLoading] = useState(true);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const iconColor = useColorModeValue('brand.500', 'white');

  useEffect(() => {
    const fetchPricingTrend = async () => {
      try {
        const res = await api.get('/pricing/country-avg'); // Aapka API endpoint
        const rawData = res.data?.data || [];

        // 1. Unique Countries ki list nikalna (X-Axis ke liye)
        const countries = [
          ...new Set(rawData.map((item) => item.country)),
        ].sort();

        // 2. Data ko organize karna (January aur February ke liye)
        const janPrices = countries.map((country) => {
          const entry = rawData.find(
            (d) => d.country === country && d.month === 'January',
          );
          return entry ? entry.avgPrice : 0;
        });

        const febPrices = countries.map((country) => {
          // Note: Agar India jaise multiple entries hain, to unka average le rahe hain
          const entries = rawData.filter(
            (d) => d.country === country && d.month === 'February',
          );
          if (entries.length > 0) {
            const sum = entries.reduce((acc, curr) => acc + curr.avgPrice, 0);
            return (sum / entries.length).toFixed(2);
          }
          return 0;
        });

        // 3. Chart Data Format
        setChartData([
          { name: 'January Price', data: janPrices },
          { name: 'February Price', data: febPrices },
        ]);

        // 4. Chart Options (Styling)
        setChartOptions({
          chart: {
            type: 'line', // Aap ise "area" ya "bar" bhi kar sakte hain comparison ke liye
            toolbar: { show: false },
            dropShadow: {
              enabled: true,
              top: 13,
              left: 0,
              blur: 10,
              opacity: 0.1,
              color: '#4318FF',
            },
          },
          colors: ['#4318FF', '#6AD2FF'], // Blue for Jan, Light Blue for Feb
          stroke: { curve: 'smooth', width: 3 },
          xaxis: {
            categories: countries,
            labels: {
              style: { colors: '#A3AED0', fontSize: '10px', fontWeight: '500' },
            },
          },
          grid: { show: false },
          tooltip: { theme: 'dark' },
          legend: { show: true, position: 'top', horizontalAlign: 'right' },
        });
      } catch (err) {
        console.error('Error building chart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPricingTrend();
  }, []);

  if (loading)
    return (
      <Flex justify="center" align="center" h="300px">
        <Spinner color="brand.500" />
      </Flex>
    );

  return (
    <Card
      justifyContent="center"
      align="center"
      direction="column"
      w="100%"
      mb="0px"
      {...rest}
    >
      <Flex justify="space-between" ps="0px" pe="20px" pt="5px">
        <Flex align="center" w="100%">
          <Button
            bg={boxBg}
            fontSize="sm"
            fontWeight="500"
            color="secondaryGray.600"
            borderRadius="7px"
          >
            <Icon as={MdOutlineCalendarToday} me="4px" />
            Price Comparison: Jan vs Feb
          </Button>
          <Button ms="auto" bg={boxBg} w="37px" h="37px" borderRadius="10px">
            <Icon as={MdBarChart} color={iconColor} w="24px" h="24px" />
          </Button>
        </Flex>
      </Flex>

      <Box minH="260px" mt="20px">
        <LineChart chartData={chartData} chartOptions={chartOptions} />
      </Box>

      <Flex align="center" mt="10px">
        <Icon as={IoCheckmarkCircle} color="green.500" me="4px" />
        <Text color="green.500" fontSize="sm" fontWeight="700">
          Market analysis complete for {chartData[0]?.data.length} countries
        </Text>
      </Flex>
    </Card>
  );
}
