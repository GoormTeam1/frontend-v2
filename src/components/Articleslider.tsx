"use client";
import {
  Box,
  Flex,
  Image,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { API_BASE_URL } from '@/config/env';

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  image: string;
  sourceLink: string;
  publishedAt: string;
  createAt: string;
}

interface NewsResponse {
  content: NewsArticle[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
  sort: Array<{
    property: string;
    direction: string;
  }>;
  numberOfElements: number;
  empty: boolean;
}

// 기본 이미지 URL
const DEFAULT_IMAGE = "https://via.placeholder.com/400x200?text=No+Image";

// 날짜 포맷팅 함수
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export default function ArticleSlider() {
  const [startIdx, setStartIdx] = useState(0);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const visibleCount = 3;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/news`);
        if (!response.ok) {
          throw new Error('API 요청 실패');
        }
        const data: NewsResponse = await response.json();
        console.log('API 응답:', data);
        setArticles(data.content);
      } catch (error) {
        console.error('뉴스 데이터를 불러오는데 실패했습니다:', error);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handlePrev = () => {
    setStartIdx((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setStartIdx((prev) => Math.min(prev + 1, articles.length - visibleCount));
  };

  const visibleArticles = articles.slice(startIdx, startIdx + visibleCount);

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Text>로딩 중...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={8}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Text as="h1" fontSize="2xl" fontWeight="bold" mb={8} textAlign="center">
        오늘의 학습 추천 기사
      </Text>
      <Flex align="center" justify="center" mb={16}>
        <IconButton
          aria-label="이전"
          icon={<ChevronLeftIcon boxSize={6} />}
          onClick={handlePrev}
          isDisabled={startIdx === 0}
          variant="ghost"
          mr={2}
        />
        <Flex gap={6} flexWrap="nowrap" justify="center" w="100%">
          {visibleArticles.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`} passHref>
              <Box
                bg="white"
                borderRadius="md"
                boxShadow="md"
                overflow="hidden"
                minW="300px"
                maxW="300px"
                flex="1"
                cursor="pointer"
                _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}
              >
                <Image
                  src={article.image || DEFAULT_IMAGE}
                  alt={article.title}
                  width="100%"
                  height="200px"
                  objectFit="cover"
                  mb={4}
                  fallbackSrc={DEFAULT_IMAGE}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = DEFAULT_IMAGE;
                  }}
                />
                <Flex direction="column" px={4} mb={6}>
                  <Flex justify="space-between" align="center" mb={2}>
                    <Text fontSize="sm" color="gray.500" fontWeight="medium">
                      {article.category}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {formatDate(article.publishedAt)}
                    </Text>
                  </Flex>
                  <Text fontWeight="semibold" noOfLines={3} fontSize="md">
                    {article.title}
                  </Text>
                </Flex>
              </Box>
            </Link>
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