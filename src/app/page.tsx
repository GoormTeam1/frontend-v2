"use client";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";

const articles = [
  {
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&h=200",
    press: "조선일보",
    title: "AI가 바꿀 미래 사회",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=200",
    press: "한겨레",
    title: "환경 보호, 우리가 할 수 있는 일",
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=200",
    press: "중앙일보",
    title: "스마트폰 중독, 어떻게 극복할까?",
  },
  {
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=facearea&w=400&h=200",
    press: "동아일보",
    title: "미래의 직업, 무엇이 달라질까?",
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=facearea&w=400&h=200",
    press: "매일경제",
    title: "경제 읽기, 청소년을 위한 팁",
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=facearea&w=400&h=200",
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
      {/* 제목 */}
      <Text as="h1" fontSize="2xl" fontWeight="bold" mb={8} textAlign="center">
        오늘의 학습 추천 기사
      </Text>

      {/* 카드 슬라이더 */}
      <Flex align="center" justify="center" mb={10}>
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
              overflow="hidden"
              //p={4}
              minW="220px"
              maxW="220px"
              flex="0 0 auto"
              //display="flex"
              //flexDirection="column"
              //alignItems="center"
            >
              <Image
                src={article.image}
                alt={article.title}
                width="100%"
                height="140px"
                objectFit="cover"
                mb={4}
              />
              <Text fontSize="sm" color="gray.500" mb={1} pl={8} >
                {article.press}
              </Text>
              <Text fontWeight="semibold" textAlign="center" pl={4} >
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

      {/* 뉴스 검색 영역 */}
      <Box maxW="600px" mx="auto">
        <Text mb={4} fontWeight="semibold">
          뉴스 검색
        </Text>
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input placeholder="키워드를 입력하세요" />
        </InputGroup>

        {/* 카테고리 버튼 */}
        <Stack direction="row" spacing={4} justify="center">
          {["IT", "경제", "사회", "문화", "국제", "스포츠"].map((cat) => (
            <Button key={cat} variant="outline" size="sm" colorScheme="purple">
              {cat}
            </Button>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
