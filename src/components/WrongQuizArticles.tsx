"use client";

import {
  Box,
  Text,
  Flex,
  IconButton,
  Image,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/env";
import Link from "next/link";

interface WrongQuizArticle {
  summaryId: number;
  newsId: number;
  title: string;
  image: string;
  category: string;
  publishedAt: string;
  level: "상" | "중" | "하";
  status: "learning" | "completed" | "not_learning";
}

const DEFAULT_IMAGE = "https://via.placeholder.com/400x200?text=No+Image";

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

export default function WrongQuizArticles() {
  const [articles, setArticles] = useState<WrongQuizArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 3;
  const toast = useToast();

  useEffect(() => {
    const fetchWrongArticles = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        const res = await fetch(`${API_BASE_URL}/api/quiz/wrong`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("오답 기사 목록 불러오기 실패");

        const data: WrongQuizArticle[] = await res.json();

        // 학습 중인 것만 필터링
        const learningArticles = data.filter(article => article.status === "learning");

        setArticles(learningArticles);
        setStartIdx(0);
      } catch (err: any) {
        toast({
          title: "데이터 오류",
          description: err.message || "오답 기사 데이터를 불러오지 못했습니다.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchWrongArticles();
  }, []);

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
        <Text color="gray.500">학습 중인 오답 기사가 없습니다.</Text>
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
              key={`${article.summaryId}-${article.newsId}`}
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
                    <Text fontSize="sm" fontWeight="bold" color="gray.600">
                      {article.level}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {formatDate(article.publishedAt)}
                    </Text>
                  </Flex>
                  <Text fontWeight="semibold" noOfLines={3}>{article.title}</Text>
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
