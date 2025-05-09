"use client";

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
  ButtonGroup,
  IconButton,
} from "@chakra-ui/react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface NewsDetailPageClientProps {
  newsId: string;
}

interface NewsData {
  id: number;
  title: string;
  fullText: string;
  sourceLink?: string;
  image: string;
  category: string;
  publishedAt: string;
  createdAt: string;
}

interface SummaryData {
  id: number;
  newsId: number;
  level: "상" | "중" | "하";
  summary: string;
}

export default function NewsDetailPageClient({ newsId }: NewsDetailPageClientProps) {
  const newsIdNumber = parseInt(newsId, 10);
  const [data, setData] = useState<NewsData | null>(null);
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [summaryLevel, setSummaryLevel] = useState<"상" | "중" | "하">("상");
  const [isScrapped, setIsScrapped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toast = useToast();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/news/${newsIdNumber}`);
        setData(res.data);
      } catch {
        toast({ title: "기사를 불러오지 못했습니다.", status: "error", duration: 3000 });
      }
    };

    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast({ title: "로그인이 필요합니다.", status: "warning", duration: 3000 });
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        const res = await axios.get(`${API_BASE_URL}/api/summary/${newsIdNumber}`, { headers });
        setSummaries(res.data);
      } catch {
        toast({ title: "요약 데이터를 불러오지 못했습니다.", status: "error", duration: 3000 });
      }
    };

    fetchNews();
    fetchSummaries();
  }, [newsIdNumber, toast]);

  const getSummaryText = () => {
    const matched = summaries.find((s) => s.level === summaryLevel);
    if (!matched?.summary) return "해당 수준의 요약이 없습니다.";
    return matched.summary
      .replace(/\d+\.\s*/g, "") // 번호 제거
      .replace(/\n/g, " ")      // 줄바꿈 제거
      .trim();                  // 양쪽 공백 제거
  };

  const handleScrap = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({ title: "로그인이 필요합니다.", status: "warning", duration: 2000 });
      return;
    }

    try {
      const decoded = jwtDecode<{ sub: string }>(token);
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const body = {
        userEmail: decoded.sub,
        newsId: newsIdNumber,
        status: isScrapped ? "읽기싫음" : "읽고싶음",
      };

      await axios.post(`${API_BASE_URL}/api/scrabs`, body, { headers });
      setIsScrapped(!isScrapped);

      toast({
        title: isScrapped ? "스크랩이 취소되었습니다" : "스크랩이 완료되었습니다",
        status: isScrapped ? "info" : "success",
        duration: 2000,
      });
    } catch {
      toast({ title: "스크랩 처리 중 오류 발생", status: "error", duration: 2000 });
    }
  };

  if (!mounted || !data) return null;

  return (
    <Box minH="100vh">
      <Header />
      <Container maxW="4xl" py={20}>
        <VStack align="stretch" spacing={6}>
          <Heading as="h1" size="xl">{data.title}</Heading>

          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <Text fontSize="sm" color="gray.600">
                {new Date(data.publishedAt).toISOString().slice(0, 10)}
              </Text>
              {data.sourceLink && (
                <ChakraLink href={data.sourceLink} isExternal>
                  <Button size="xs" variant="outline">기사원문</Button>
                </ChakraLink>
              )}
            </Flex>
            <Flex align="center" gap={2}>
              <Text fontSize="sm" color="gray.700">스크랩하기</Text>
              <IconButton
                aria-label="스크랩"
                icon={isScrapped ? <FaBookmark /> : <FaRegBookmark />}
                onClick={handleScrap}
                variant="solid"
                size="sm"
                colorScheme={isScrapped ? "yellow" : "gray"}
              />
            </Flex>
          </Flex>

          <Image src={data.image} alt={data.title} borderRadius="md" shadow="md" />

          <ButtonGroup isAttached variant="outline" justifyContent="start">
            {["상", "중", "하"].map((level) => (
              <Button
                key={level}
                onClick={() => setSummaryLevel(level as "상" | "중" | "하")}
                colorScheme={summaryLevel === level ? "purple" : "gray"}
              >
                {level}
              </Button>
            ))}
          </ButtonGroup>

          <Box bg="gray.50" p={4} rounded="md">
            <Text fontSize="md">{getSummaryText()}</Text>
          </Box>

          <Flex justify="center">
            <Link href={`/quiz/${data.id}?level=${summaryLevel}`} passHref>
              <Button colorScheme="purple" size="lg">학습하러 가기</Button>
            </Link>
          </Flex>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}
