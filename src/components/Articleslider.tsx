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
import { jwtDecode } from "jwt-decode";
import { API_BASE_URL } from '@/config/env';

interface RecommendedArticle {
  id: number;
  title: string;
  image: string;
  category: string;
  publishedAt: string;
}

interface RecommendationResponse {
  status: number;
  message: string;
  data: RecommendedArticle[];
}

interface DecodedToken {
  sub: string;
  username?: string;
  exp: number;
}

const DEFAULT_IMAGE = "https://placehold.co/400x200?text=No+Image";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

const getUsernameFromToken = (): string | null => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (decoded.exp * 1000 > Date.now()) {
      return decoded.username || decoded.sub;
    } else {
      localStorage.removeItem("token");
      return null;
    }
  } catch {
    localStorage.removeItem("token");
    return null;
  }
};

export default function ArticleSlider() {
  const [startIdx, setStartIdx] = useState(0);
  const [articles, setArticles] = useState<RecommendedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const visibleCount = 3;

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const url = token
        ? `${API_BASE_URL}/api/recommendation/search`
        : `${API_BASE_URL}/api/recommendation/search/default`;

      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error('기사를 불러오는데 실패했습니다.');
      }

      const result: RecommendationResponse = await response.json();
      if (result.status !== 200) {
        throw new Error(result.message || '기사를 불러오는데 실패했습니다.');
      }

      setArticles(result.data);
    } catch (error) {
      console.error('기사 데이터를 불러오는데 실패했습니다:', error);
      setError(error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const name = getUsernameFromToken();
    setUsername(name);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const name = getUsernameFromToken();
      setUsername(name);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (username !== undefined) {
      fetchArticles();
    }
  }, [username]);

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
        <Text>추천 기사를 불러오는 중...</Text>
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

  if (articles.length === 0) {
    return (
      <Box textAlign="center" py={8}>
        <Text>추천할 기사가 없습니다.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Box textAlign="center" py={4}>
        <Text fontSize="2xl" fontWeight="bold">
          {username
            ? `${username}님을 위한 학습 추천 기사`
            : "로그인하고 나만의 추천 기사를 받아보세요!"}
        </Text>
      </Box>

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
                position="relative"
                _hover={{ transform: 'translateY(-4px)', transition: 'transform 0.2s' }}
              >
                <Image
                  src={article.image || DEFAULT_IMAGE}
                  alt={article.title}
                  width="100%"
                  height="200px"
                  objectFit="cover"
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
