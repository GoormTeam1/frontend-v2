"use client";
import { Box, Flex, Image, Text, Button, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const articles = [
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=200",
    press: "조선일보",
    title: "AI가 바꿀 미래 사회",
  },
  {
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=200",
    press: "한겨레",
    title: "환경 보호, 우리가 할 수 있는 일",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=200",
    press: "중앙일보",
    title: "스마트폰 중독, 어떻게 극복할까?",
  },
  {
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=facearea&w=400&h=200",
    press: "동아일보",
    title: "미래의 직업, 무엇이 달라질까?",
  },
  {
    image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=facearea&w=400&h=200",
    press: "매일경제",
    title: "경제 읽기, 청소년을 위한 팁",
  },
  {
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=200",
    press: "서울신문",
    title: "도시와 자연의 공존",
  },
];

export default function Home() {
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 4;

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIdx((prev) => Math.min(prev + 1, articles.length - visibleCount));
  };

  const visibleArticles = articles.slice(startIdx, startIdx + visibleCount);

  return (
    <Box p={8}>
      <Text as="h1" fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
        오늘의 학습 추천 기사
      </Text>
      <Flex align="center" justify="center">
        <IconButton
          aria-label="이전"
          icon={<ChevronLeftIcon boxSize={6} />}
          onClick={handlePrev}
          isDisabled={startIdx === 0}
          variant="ghost"
          mr={2}
        />
        <Flex gap={4} flexWrap="nowrap" justify="center">
          {visibleArticles.map((article, idx) => (
            <Box
              key={idx}
              bg="white"
              borderRadius="md"
              boxShadow="md"
              p={4}
              minW="220px"
              maxW="220px"
              flex="0 0 auto"
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Image
                src={article.image}
                alt={article.title}
                borderRadius="md"
                boxSize="120px"
                objectFit="cover"
                mb={3}
              />
              <Text fontSize="sm" color="gray.500" mb={1}>
                {article.press}
              </Text>
              <Text fontWeight="semibold" textAlign="center">
                {article.title}
              </Text>
            </Box>
          ))}
        </Flex>
        <IconButton
          aria-label="다음"
          icon={<ChevronRightIcon boxSize={6} />}
          onClick={handleNext}
          isDisabled={startIdx >= articles.length - visibleCount}
          variant="ghost"
          ml={2}
        />
      </Flex>
    </Box>
  );
}
