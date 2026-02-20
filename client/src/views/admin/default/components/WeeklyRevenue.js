import {
  Box,
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Badge,
  VStack,
  HStack,
  Spinner,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Divider,
} from '@chakra-ui/react';
import Card from 'components/card/Card.js';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdOutlineNewspaper, MdAccessTime, MdLaunch } from 'react-icons/md';

export default function MarketNewsFeed(props) {
  const { ...rest } = props;
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const brandColor = '#4318FF';
  const bgCard = useColorModeValue('white', 'navy.800');
  const bgItem = useColorModeValue('gray.50', 'whiteAlpha.100');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const rssUrl =
          'https://news.google.com/rss/search?q=renewable+energy+I-REC+market&hl=en-IN&gl=IN&ceid=IN:en';
        const res = await axios.get(
          `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
        );
        if (res.data?.items) setNews(res.data.items.slice(0, 8));
      } catch (err) {
        console.log('Error fetching news');
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const openNewsModal = (article) => {
    setSelectedArticle(article);
    onOpen();
  };

  return (
    <Card
      align="center"
      direction="column"
      w="100%"
      p="20px"
      bg={bgCard}
      {...rest}
    >
      <Flex align="center" w="100%" mb="20px" px="5px">
        <Icon
          as={MdOutlineNewspaper}
          color={brandColor}
          w="24px"
          h="24px"
          me="10px"
        />
        <Text me="auto" color={textColor} fontSize="lg" fontWeight="700">
          Market Update From Intelligence
        </Text>
        <Badge colorScheme="green" variant="subtle" borderRadius="full" px="2">
          LIVE
        </Badge>
      </Flex>

      <Box
        w="100%"
        h="450px"
        overflowY="auto"
        pr="5px"
        css={{
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': {
            background: brandColor,
            borderRadius: '10px',
          },
        }}
      >
        {loading ? (
          <Flex justify="center" align="center" h="100%">
            <Spinner color={brandColor} />
          </Flex>
        ) : (
          <VStack spacing="15px" align="stretch">
            {news.map((article, index) => (
              <Box
                key={index}
                p="15px"
                borderRadius="20px"
                bg={bgItem}
                cursor="pointer"
                onClick={() => openNewsModal(article)}
                _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
                transition="0.2s"
              >
                <Flex align="start">
                  <Image
                    src={
                      article.thumbnail ||
                      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100'
                    }
                    boxSize="60px"
                    borderRadius="12px"
                    objectFit="cover"
                    me="15px"
                  />
                  <VStack align="start" spacing="0" flex="1">
                    <Text fontSize="10px" fontWeight="800" color={brandColor}>
                      {article.author || 'GLOBAL UPDATE'}
                    </Text>
                    <Text
                      fontSize="sm"
                      fontWeight="700"
                      color={textColor}
                      noOfLines={2}
                    >
                      {article.title}
                    </Text>
                    <Text fontSize="10px" color="gray.400" mt="1">
                      {new Date(article.pubDate).toLocaleDateString()}
                    </Text>
                  </VStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* --- Internal Content Reader (Clean View) --- */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent borderRadius="3xl" p="4">
          <ModalHeader color={textColor} fontSize="xl" pr="10">
            {selectedArticle?.title}
          </ModalHeader>
          <ModalCloseButton borderRadius="full" m="2" />
          <ModalBody>
            <VStack align="stretch" spacing="5">
              <Image
                src={
                  selectedArticle?.thumbnail ||
                  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500'
                }
                borderRadius="2xl"
                w="100%"
                h="250px"
                objectFit="cover"
              />

              <HStack justify="space-between">
                <Badge colorScheme="purple" px="2" py="1" borderRadius="md">
                  {selectedArticle?.author || 'Market Insights'}
                </Badge>
                <HStack color="gray.500" fontSize="xs">
                  <Icon as={MdAccessTime} />
                  <Text>
                    {new Date(selectedArticle?.pubDate).toLocaleDateString()}
                  </Text>
                </HStack>
              </HStack>

              <Divider />

              <Text color={textColor} fontSize="md" lineHeight="1.6">
                {/* HTML tags hata kar clean text dikhane ke liye */}
                {selectedArticle?.content?.replace(/<[^>]*>?/gm, '') ||
                  selectedArticle?.description?.replace(/<[^>]*>?/gm, '') ||
                  'Fetching details...'}
              </Text>

              <Box
                p="4"
                bg="blue.50"
                borderRadius="xl"
                border="1px solid"
                borderColor="blue.100"
              >
                <Text fontSize="xs" color="blue.700" fontWeight="600">
                  Full intelligence reports and detailed analysis are available
                  at the primary source.
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <Flex p="4" justify="flex-end">
            <Button variant="ghost" mr="3" onClick={onClose}>
              Close
            </Button>
            <Button
              as="a"
              href={selectedArticle?.link}
              target="_blank"
              colorScheme="brandScheme"
              bg={brandColor}
              color="white"
              rightIcon={<MdLaunch />}
              _hover={{ bg: '#3311CC' }}
            >
              Continue Reading
            </Button>
          </Flex>
        </ModalContent>
      </Modal>
    </Card>
  );
}
