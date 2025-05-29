"use client";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import {
  Box,
  Button,
  Flex,
  Text,
  Heading,
  useToast,
  VStack,
  Link as ChakraLink,
  Container,
  ButtonGroup,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/env";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

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
  summaryId: number;
  newsId: number;
  level: "상" | "중" | "하";
  summary: string;
}

interface ScrapItem {
  newsId: number;
}

export default function NewsDetailPageClient({ newsId }: NewsDetailPageClientProps) {
  const newsIdNumber = parseInt(newsId, 10);
  const [data, setData] = useState<NewsData | null>(null);
  const [summaries, setSummaries] = useState<SummaryData[]>([]);
  const [summaryLevel, setSummaryLevel] = useState<"상" | "중" | "하">("상");
  const [isScrapped, setIsScrapped] = useState(false);
  const [mounted, setMounted] = useState(false);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };
        const decoded = jwtDecode<{ sub: string }>(token);
        const userEmail = decoded.sub;

        const [newsRes, summaryRes, scrapRes, userRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/news/${newsIdNumber}`, { headers }),
          axios.get(`${API_BASE_URL}/api/summary/${newsIdNumber}`, { headers }),
          axios.get(`${API_BASE_URL}/api/scrabs/${userEmail}`, { headers }),
          axios.get(`${API_BASE_URL}/api/user/me`, { headers }),
        ]);

        setData(newsRes.data);
        setSummaries(summaryRes.data);

        const scrapList: ScrapItem[] = scrapRes.data?.content || [];
        const isScrappedNow = scrapList.some((item) => item.newsId === newsIdNumber);
        setIsScrapped(isScrappedNow);

        const level = userRes.data?.data?.level;
        if (["상", "중", "하"].includes(level)) {
          setSummaryLevel(level);
        }
      } catch {
        toast({
          title: "데이터를 불러오지 못했습니다.",
          status: "error",
          duration: 3000,
        });
      }
    };

    fetchAllData();
  }, [newsIdNumber, toast]);

  const getSummaryText = () => {
    const matched = summaries.find((s) => s.level === summaryLevel);
    if (!matched?.summary) return "해당 수준의 요약이 없습니다.";
    return matched.summary.replace(/\d+\.\s*/g, "").replace(/\n/g, " ").trim();
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

      if (isScrapped) {
        await axios.delete(`${API_BASE_URL}/api/scrabs`, {
          headers,
          params: {
            userEmail: decoded.sub,
            newsId: newsIdNumber,
          },
        });
        toast({ title: "스크랩이 취소되었습니다", status: "info", duration: 2000 });
      } else {
        await axios.post(
          `${API_BASE_URL}/api/scrabs`,
          {
            userEmail: decoded.sub,
            newsId: newsIdNumber,
            status: "읽고싶음",
          },
          { headers }
        );
        toast({ title: "스크랩이 완료되었습니다", status: "success", duration: 2000 });
      }

      setIsScrapped((prev) => !prev);
    } catch {
      toast({ title: "스크랩 처리 중 오류 발생", status: "error", duration: 2000 });
    }
  };

  const handleGoToQuiz = () => {
    const matched = summaries.find((s) => s.level === summaryLevel);
    if (!matched) {
      toast({ title: "선택한 난이도에 맞는 퀴즈가 없습니다.", status: "info", duration: 3000 });
      return;
    }
    router.push(`/quiz/${matched.summaryId}`);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "날짜 없음";
    const parsed = Date.parse(dateStr);
    if (isNaN(parsed)) return "날짜 없음";
    return new Date(parsed).toISOString().slice(0, 10);
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
                {formatDate(data.publishedAt)}
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

          <Flex justify="center" align="center" minH="300px">
            <Box position="relative" w="80%" pb="45%" maxW="700px">
              <Image
                src={data.image}
                alt={data.title}
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                objectFit="cover"
                borderRadius="md"
                shadow="md"
                fallbackSrc="https://via.placeholder.com/400x200?text=No+Image"
              />
            </Box>
          </Flex>

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

          <Box bg="gray.50" p={5} rounded="md">
            <Text fontSize="lg">{getSummaryText()}</Text>
          </Box>

          <Flex justify="center">
            <Button colorScheme="purple" size="lg" onClick={handleGoToQuiz}>
              학습하러 가기
            </Button>
          </Flex>
        </VStack>
      </Container>
      <Footer />
    </Box>
  );
}
