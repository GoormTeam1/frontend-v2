"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  useToast,
  VStack,
  Image,
  Link as ChakraLink,
  Container,
} from "@chakra-ui/react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from '@/config/env';

interface NewsDetailPageClientProps {
  newsId: string;
}

interface NewsData {
  id: number;
  title: string;
  fullText: string;
  summary: string;
  source?: string;
  image: string;
  category: string;
  publishedAt: string;
  createdAt: string;
}

const mockNewsData: NewsData = {
  id: 99999999,
  title: "인공지능 기술의 혁신적 발전, 새로운 시대를 열다",
  fullText: "...",
  summary: "...",
  source: "https://example.com/ai-news",
  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  category: "기술",
  publishedAt: "2024-05-02T16:30:00Z",
  createdAt: "2024-05-02T16:30:00Z",
};

export default function NewsDetailPageClient({ newsId }: NewsDetailPageClientProps) {
  const newsIdNumber = parseInt(newsId, 10);
  const [data, setData] = useState<NewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrapped, setIsScrapped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toast = useToast();

  useEffect(() => {
    setMounted(true); // ✅ 클라이언트에서만 렌더링 활성화
  }, []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/news/${newsIdNumber}`);
        setData(res.data);
      } catch (err) {
        if (newsIdNumber === 99999999) {
          setData(mockNewsData);
        } else {
          setError("기사를 불러오지 못했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [newsIdNumber]);

  const handleScrap = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "로그인이 필요합니다.", status: "warning", duration: 2000 });
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (isScrapped) {
        await axios.delete(`${API_BASE_URL}/api/scrabs/${newsIdNumber}`, { headers });
        setIsScrapped(false);
        toast({ title: "스크랩 취소됨", status: "info", duration: 2000 });
      } else {
        await axios.post(`${API_BASE_URL}/api/scrabs/${newsIdNumber}`, {}, { headers });
        setIsScrapped(true);
        toast({ title: "스크랩 완료", status: "success", duration: 2000 });
      }
    } catch {
      toast({ title: "스크랩 실패", status: "error", duration: 2000 });
    }
  };

  if (!mounted) return null; // ✅ hydration mismatch 방지

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Flex flex="1" justify="center" align="center" py={20}>
          <Text>로딩 중...</Text>
        </Flex>
        <Footer />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Flex flex="1" justify="center" align="center" py={20}>
          <Text>{error || "기사를 찾을 수 없습니다."}</Text>
        </Flex>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Container maxW="4xl" py={20} flex="1">
        <VStack align="stretch" spacing={6}>
          <Heading as="h1" size="xl" fontWeight="extrabold">{data.title}</Heading>
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600">
              {new Date(data.publishedAt).toISOString().slice(0, 10)}
            </Text>
            {data.source && (
              <ChakraLink href={data.source} isExternal>
                <Button size="xs" colorScheme="gray" variant="outline">기사원문</Button>
              </ChakraLink>
            )}
          </Flex>
          <Image src={data.image} alt={data.title} borderRadius="md" shadow="md" />
          <Text whiteSpace="pre-line" color="gray.800" fontSize="md">{data.fullText}</Text>
          <Flex justify="center">
            <Link href={`/quiz/${data.id}`} passHref>
              <Button colorScheme="purple" size="lg" px={8}>학습하러 가기</Button>
            </Link>
          </Flex>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}
