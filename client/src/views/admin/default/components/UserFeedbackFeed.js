import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Avatar,
  useColorModeValue,
  Icon,
  Spinner,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import { MdFeedback } from 'react-icons/md';
import api from '../../../../utils/axiosConfig';

export default function UserFeedbackFeed(props) {
  const { ...rest } = props;
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bgCard = useColorModeValue('white', 'navy.800');
  const bubbleBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const brandGreen = '#19944D';

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get('/user/feedback/all');
        if (res.data?.success) {
          setFeedbacks(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch feedback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <Card align="center" direction="column" w="100%" p="20px" bg={bgCard} {...rest}>
      <Flex align="center" w="100%" mb="20px" px="5px">
        <Icon as={MdFeedback} color={brandGreen} w="24px" h="24px" me="10px" />
        <Text me="auto" color={textColor} fontSize="lg" fontWeight="700">
          User Feedback Wall
        </Text>
      </Flex>

      <Box
        w="100%"
        h="450px"
        overflowY="auto"
        pr="5px"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            background: brandGreen,
            borderRadius: '10px',
          },
        }}
      >
        {loading ? (
          <Flex h="100%" align="center" justify="center">
            <Spinner color={brandGreen} />
          </Flex>
        ) : feedbacks.length === 0 ? (
          <Flex h="100%" align="center" justify="center">
            <Text color="gray.500">No feedback available yet.</Text>
          </Flex>
        ) : (
          <VStack spacing={4} align="stretch">
            {feedbacks.map((fb) => (
              <Box key={fb._id} p="15px" bg={bubbleBg} borderRadius="16px" boxShadow="sm">
                <HStack spacing={4} align="start" mb={2}>
                  <Avatar name={fb.name} size="sm" bg={brandGreen} color="white" />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="700" color={textColor}>
                      {fb.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </Text>
                  </VStack>
                </HStack>
                <Text fontSize="md" color={textColor} mt={2} pl="45px" lineHeight="1.6" fontStyle="italic">
                  "{fb.message}"
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Card>
  );
}
