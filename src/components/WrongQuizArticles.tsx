// src/components/WrongQuizArticles.tsx
"use client";

import {
  Box,
  Grid,
  Image,
  Text,
  Flex,
  Spinner,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/env";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

interface WrongSummary {
  summaryId: number;
}

interface NewsArticle {
  id: number;
  title: string;
  image: string;
  category: string;
  publishedAt: string;
}

const DEFAULT_IMAGE = "https://via.placeholder.com/400x200?text=No+Image";

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
};

export default function WrongQuizArticles() {
  const [wrongSummaries, setWrongSummaries] = useState<WrongSummary[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchWrongSummaries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("토큰이 없습니다");

        const res = await fetch(`${API_BASE_URL}/api/quiz/wrong`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ summaryId: 1 }), // 실제 사용 시 동적으로 처리 필요
        });

        if (!res.ok) throw new Error("틀린 퀴즈 정보 로딩 실패");

        const data: WrongSummary[] = await res.json();
        setWrongSummaries(data);
      } catch (err: any) {
        toast({
          title: "오답 데이터 로딩 실패",
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
        const fetched = await Promise.all(
          wrongSummaries.map((item) =>
            fetch(`${API_BASE_URL}/api/summary/${item.summaryId}`)
              .then((res) => res.json())
              .then((summary) =>
                fetch(`${API_BASE_URL}/api/news/${summary.newsId}`).then((res) => res.json())
              )
          )
        );
        setArticles(fetched);
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
  }, [wrongSummaries, toast]);

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
      <Text fontSize="2xl" fontWeight="bold" mb={6} pl={36}>
        오답 기사
      </Text>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {articles.map((article) => (
          <Link key={article.id} href={`/news/${article.id}`} passHref>
            <Box
              bg="white"
              borderRadius="md"
              boxShadow="md"
              overflow="hidden"
              cursor="pointer"
              _hover={{ transform: "translateY(-4px)", transition: "0.2s" }}
            >
              <Image
                src={article.image || DEFAULT_IMAGE}
                alt={article.title}
                width="100%"
                height="200px"
                objectFit="cover"
              />
              <Box p={4}>
                <Flex justify="space-between" mb={2}>
                  <Badge colorScheme="purple">{article.category}</Badge>
                  <Text fontSize="xs" color="gray.400">{formatDate(article.publishedAt)}</Text>
                </Flex>
                <Text fontWeight="semibold" noOfLines={2}>{article.title}</Text>
              </Box>
            </Box>
          </Link>
        ))}
      </Grid>
    </Box>
  );
}
