"use client";

import {
  Box,
  Text,
  Select,
  Image,
  Stack,
  Button,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";

const scrapedArticles = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=facearea&w=400&h=200",
    press: "중앙일보",
    title: "경제 위기, 어떻게 대응할까?",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=200",
    press: "조선일보",
    title: "AI의 윤리적 문제",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=200",
    press: "한겨레",
    title: "기후 변화의 징후들",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=facearea&w=400&h=200",
    press: "서울신문",
    title: "청년 일자리 대책",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=200",
    press: "매일경제",
    title: "가상화폐 규제 동향",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=200",
    press: "동아일보",
    title: "스마트시티의 미래",
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=200",
    press: "국제신문",
    title: "국제 정세의 흐름",
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=200",
    press: "문화일보",
    title: "예술 교육의 중요성",
  },
];

export default function ScrapList() {
  const [sortOrder, setSortOrder] = useState("latest");

  const sortedArticles = [...scrapedArticles].sort((a, b) => {
    return sortOrder === "latest" ? b.id - a.id : a.id - b.id;
  });

  return (
    <Box maxW="1000px" mx="auto" mt={20} px={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          내가 스크랩한 기사
        </Text>
        <Select
          w="150px"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </Select>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={10}>
        {sortedArticles.slice(0, 8).map((article) => (
          <Box
            key={article.id}
            bg="white"
            borderRadius="md"
            boxShadow="md"
            overflow="hidden"
            minW="220px"
            maxW="220px"
            flex="0 0 auto"
          >
            <Image
              src={article.image}
              alt={article.title}
              width="100%"
              height="140px"
              objectFit="cover"
              mb={4}
            />
            <Text fontSize="sm" color="gray.500" mx={4} mb={1}>
              {article.press}
            </Text>
            <Text fontWeight="semibold" mx={4} mb={6}>
              {article.title}
            </Text>
          </Box>
        ))}
      </SimpleGrid>

      <Flex justify="center" gap={2}>
        {[1, 2, 3, 4, 5].map((num) => (
          <Button key={num} size="sm" variant="outline">
            {num}
          </Button>
        ))}
      </Flex>
    </Box>
  );
}
