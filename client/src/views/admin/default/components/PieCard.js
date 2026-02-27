/* eslint-disable */
import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import PieChart from 'components/charts/PieChart';
import { VSeparator } from 'components/separator/Separator';
import React from 'react';

export default function Conversion(props) {
  const { chartData, chartLabels, ...rest } = props;

  // Chakra Color Mode
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardColor = useColorModeValue('white', 'navy.700');
  const cardShadow = useColorModeValue(
    '0px 18px 40px rgba(112, 144, 176, 0.12)',
    'unset',
  );

  // Dynamic Chart Options
  const pieChartOptions = {
    labels: chartLabels && chartLabels.length > 0 ? chartLabels : ['No Data'],
    colors: ['#4318FF', '#6AD2FF', '#01B574', '#FFB547', '#E31A1A'],
    chart: {
      width: '100%',
    },
    states: {
      hover: {
        filter: {
          type: 'none',
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    hover: { mode: null },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '70%',
        },
      },
    },

    fill: {
      colors: ['#4318FF', '#6AD2FF', '#01B574', '#FFB547', '#E31A1A'],
    },
    tooltip: {
      enabled: true,
      theme: 'dark',
      y: {
        formatter: (val) => `${val}%`,
      },
    },
  };

  return (
    <Card
      p="20px"
      align="center"
      direction="column"
      w="100%"
      {...rest}
      overflow="hidden"
    >
      <Flex
        px={{ base: '0px', '2xl': '10px' }}
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        mb="8px"
      >
        <Text color={textColor} fontSize="md" fontWeight="600" mt="4px">
          I-REC Distribution
        </Text>
      </Flex>
      <Box h="280px" w="100%" mt="10px">
        {' '}
        {/* h badha kar 280px kar di */}
        {chartData && chartData.length > 0 ? (
          <PieChart
            h="100%"
            w="100%"
            chartData={chartData}
            chartOptions={pieChartOptions}
          />
        ) : (
          <Flex h="100%" align="center" justify="center">
            <Text>No Data</Text>
          </Flex>
        )}
      </Box>
      {/* Legend Box - Layout Fixed to prevent overflow */}
      <Card
        bg={cardColor}
        flexDirection="row"
        boxShadow={cardShadow}
        w="100%"
        p="15px"
        px="10px"
        mt="15px"
        mx="auto"
        justifyContent="space-evenly"
        alignItems="center"
      >
        {/* Country 1 */}
        <Flex direction="column" py="5px" align="center">
          <Flex align="center">
            <Box h="8px" w="8px" bg="#4318FF" borderRadius="50%" me="4px" />
            <Text fontSize="xs" color="secondaryGray.600" fontWeight="700">
              {chartLabels?.[0] || 'N/A'}
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {chartData?.[0] ? `${chartData[0]}%` : '0%'}
          </Text>
        </Flex>

        <VSeparator />

        {/* Country 2 / Others */}
        <Flex direction="column" py="5px" align="center">
          <Flex align="center">
            <Box h="8px" w="8px" bg="#6AD2FF" borderRadius="50%" me="4px" />
            <Text fontSize="xs" color="secondaryGray.600" fontWeight="700">
              {chartLabels?.[1] || 'Others'}
            </Text>
          </Flex>
          <Text fontSize="lg" color={textColor} fontWeight="700">
            {chartData?.[1] ? `${chartData[1]}%` : '0%'}
          </Text>
        </Flex>
      </Card>
    </Card>
  );
}
