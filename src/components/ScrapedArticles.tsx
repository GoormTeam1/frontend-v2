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
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { API_BASE_URL } from "@/config/env";

interface ScrapedItem {
  userEmail: string;
  newsId: number;
  status: string;
}

interface NewsArticle {
  id: number;
  title: string;
  image: string;
  category: string;
  publishedAt: string;
}

const DEFAULT_IMAGE = "https://via.placeholder.com/400x200?text=No+Image";

// ✅ 안전한 날짜 포맷 함수
const formatDate = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00Z`);
  if (isNaN(date.getTime())) return "날짜 오류";

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
};

export default function ScrapedArticlesSlider() {
  const [scraps, setScraps] = useState<ScrapedItem[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [startIdx, setStartIdx] = useState(0);
  const visibleCount = 3;
  const toast = useToast();

  useEffect(() => {
    const fetchScrapData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = jwtDecode<{ sub: string }>(token);
        const email = decoded.sub;

        const res = await fetch(`${API_BASE_URL}/api/scrabs/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("스크랩 목록 불러오기 실패");

        const data = await res.json();
        setScraps(data.content || []);
      } catch (error) {
        const message = error instanceof Error ? error.message : "스크랩 목록을 불러오지 못했습니다.";
        toast({
          title: "스크랩 데이터 오류",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
      }
    };

    fetchScrapData();
  }, [toast]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const results = await Promise.all(
          scraps.map((item) =>
            fetch(`${API_BASE_URL}/api/news/${item.newsId}`).then((res) => res.json())
          )
        );
        setArticles(results);
      } catch (error) {
        const message = error instanceof Error ? error.message : "기사 데이터를 불러오지 못했습니다.";
        toast({
          title: "기사 정보 오류",
          description: message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (scraps.length > 0) {
      fetchArticles();
    } else {
      setLoading(false);
    }
  }, [scraps, toast]);

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
        <Text color="gray.500">스크랩한 기사가 없습니다.</Text>
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
                _hover={{ transform: "translateY(-4px)", transition: "transform 0.2s" }}
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
                  <Text fontWeight="semibold" noOfLines={3}>
                    {article.title}
                  </Text>
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
