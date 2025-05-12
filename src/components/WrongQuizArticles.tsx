"use client";

import {
  Box,
  Text,
  Flex,
  IconButton,
  Image,
  Spinner,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/env";
import Link from "next/link";

interface WrongSummary {
  summaryId: number;
  userEmail: string;
}

interface NewsArticle {
  id: number;
  title: string;
  image: string;
  category: string;
  publishedAt: string;
  level?: "상" | "중" | "하";
  summaryId: number;
}

const DEFAULT_IMAGE = "https://via.placeholder.com/400x200?text=No+Image";

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

const getBadgeColor = (level: string) => {
  switch (level) {
    case "상":
      return "red";
    case "중":
      return "yellow";
    case "하":
      return "blue";
    default:
      return "gray";
  }
};

export default function WrongQuizArticles() {
  const [wrongSummaries, setWrongSummaries] = useState<WrongSummary[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 3;
  const toast = useToast();

  useEffect(() => {
    const fetchWrongSummaries = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        toast({
          title: "로그인 필요",
          description: "로그인 후 다시 시도해주세요.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/quiz/wrong`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: WrongSummary[] = await res.json();
        setWrongSummaries(data);
      } catch (err: any) {
        toast({
          title: "오답 데이터 오류",
          description: err.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchWrongSummaries();
  }, [toast]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const token = localStorage.getItem("token");
        const fetched: NewsArticle[] = [];

        for (const item of wrongSummaries) {
          const searchRes = await fetch(`${API_BASE_URL}/api/summary/search/${item.summaryId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!searchRes.ok) continue;
          const summaryData = await searchRes.json();
          const newsId = summaryData.newsId;
          const level = summaryData.level;

          const res = await fetch(`${API_BASE_URL}/api/news/${newsId}`);
          if (!res.ok) continue;

          const news = await res.json();
          fetched.push({ ...news, level, summaryId: item.summaryId });
        }

        setArticles(fetched);
        setStartIdx(0);
      } catch {
        toast({
          title: "뉴스 로딩 실패",
          description: "기사 정보를 불러오지 못했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (wrongSummaries.length > 0) fetchArticles();
    else setLoading(false);
  }, [wrongSummaries]);

  const handlePrev = () => setStartIdx((prev) => Math.max(prev - visibleCount, 0));
  const handleNext = () =>
    setStartIdx((prev) =>
      prev + visibleCount >= articles.length ? prev : prev + visibleCount
    );

  const visibleArticles = articles.slice(startIdx, startIdx + visibleCount);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  if (articles.length === 0) {
    return (
      <Box textAlign="center" py={12}>
        <Text color="gray.500">틀린 문제가 포함된 기사가 없습니다.</Text>
      </Box>
    );
  }

  return (
    <Box>

      <Flex align="center" justify="center">
        <IconButton
          aria-label="이전"
          icon={<ChevronLeftIcon boxSize={6} />}
          onClick={handlePrev}
          isDisabled={startIdx === 0}
          variant="ghost"
          mr={2}
        />
        <Flex gap={6}>
          {visibleArticles.map((article) => (
            <Link
              key={`${article.summaryId}-${article.level}`}
              href={`/quiz/${article.summaryId}`}
              passHref
            >
              <Box
                bg="white"
                borderRadius="md"
                boxShadow="md"
                overflow="hidden"
                minW="300px"
                maxW="300px"
                flex="1"
                cursor="pointer"
                transition="transform 0.2s"
                _hover={{ transform: "translateY(-4px)" }}
              >
                <Image
                  src={article.image || DEFAULT_IMAGE}
                  alt={article.title}
                  width="100%"
                  height="200px"
                  objectFit="cover"
                  fallbackSrc={DEFAULT_IMAGE}
                />
                <Box px={4} py={3}>
                  <Flex justify="space-between" mb={1}>
                    <Text fontSize="sm" color="gray.500">{article.category}</Text>
                    <Text fontSize="xs" color="gray.400">{formatDate(article.publishedAt)}</Text>
                  </Flex>
                  <Text fontWeight="semibold" noOfLines={3}>{article.title}</Text>
                  {article.level && (
                    <Badge mt={2} colorScheme={getBadgeColor(article.level)}>
                      {article.level}
                    </Badge>
                  )}
                </Box>
              </Box>
            </Link>
          ))}
        </Flex>
        <IconButton
          aria-label="다음"
          icon={<ChevronRightIcon boxSize={6} />}
          onClick={handleNext}
          isDisabled={startIdx + visibleCount >= articles.length}
          variant="ghost"
          ml={2}
        />
      </Flex>
    </Box>
  );
}
