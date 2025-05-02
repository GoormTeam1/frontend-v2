"use client";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Text,
  Spacer,
  Heading,
  useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface NewsDetailPageProps {
  params: { newsId: string };
}

interface NewsData {
  newsId: string;
  title: string;
  press: string;
  date: string;
  originalLink: string;
  image: string;
  content: string;
}

// 목업 데이터
const mockNewsData: NewsData = {
  newsId: "9999999999999999",
  title: "'롯데·한화, 태풍의 눈 되나' 2위 삼성 밀어내고 1위 LG까지 위협…운명의 9연전, 선두권 요동친다",
  press: "노컷뉴스",
  date: "2025.05.02. 오전 10:15",
  originalLink: "https://m.sports.naver.com/kbaseball/article/079/0004020155",
  image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=800&h=400",
  content: `롯데 자이언츠 터커 데이비슨은 1일 서울 고척스카이돔에서 열린 2025 신한은행 SOL Bank KBO리그 키움 히어로즈와 팀 간 시즌 6차전 원정 맞대결에 선발 등판해 7이닝 동안 투구수 100구, 3피안타 1볼넷 6탈삼진 무실점을 기록했다.

데이비슨은 3월 두 번의 등판에서 단 1승도 거두지 못했으나, 평균자책점 2.03이라는 훌륭한 성적을 남겼다. 하지만 4월 첫 등판의 결과는 최악이었다.

NC 다이노스(6이닝 무실점)-삼성 라이온즈(5이닝 무실점)-두산 베어스(6이닝 2실점)을 상대로 3연승을 쓸어담더니, 5월 첫 등판에서도 좋은 흐름을 이어갔다.`,
};

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { newsId } = params;
  const [data, setData] = useState<NewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScrapped, setIsScrapped] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/api/news/${newsId}`);
        setData(response.data);
      } catch (err) {
        console.error("Error fetching news:", err);
        // API 호출 실패 시 목업 데이터 사용
        if (newsId === "9999999999999999") {
          setData(mockNewsData);
        } else {
          setError("기사를 불러오는데 실패했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [newsId]);

  const handleScrap = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "로그인이 필요합니다.",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (isScrapped) {
        // 스크랩 취소
        await axios.delete(`http://localhost:8081/api/scrabs/${newsId}`, { headers });
        setIsScrapped(false);
        toast({
          title: "스크랩이 취소되었습니다.",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
      } else {
        // 스크랩 추가
        await axios.post(`http://localhost:8081/api/scrabs/${newsId}`, {}, { headers });
        setIsScrapped(true);
        toast({
          title: "스크랩이 완료되었습니다.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error handling scrap:", error);
      toast({
        title: "스크랩 처리 중 오류가 발생했습니다.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <main className="max-w-3xl mx-auto py-20 px-4 text-center">
          <Text>로딩 중...</Text>
        </main>
        <Footer />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <main className="max-w-3xl mx-auto py-20 px-4 text-center text-gray-600">
          <p>{error || "해당 기사를 찾을 수 없습니다."}</p>
        </main>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <main className="max-w-3xl mx-auto py-20 px-4 flex-1">
        {/* 언론사 */}
        <Text fontSize="sm" color="gray.600" mb={2}>
          {data.press}
        </Text>

        {/* 제목 */}
        <Heading as="h1" size="xl" fontWeight="extrabold" mb={1}>
          {data.title}
        </Heading>

        {/* 날짜, 기사원문, 스크랩 */}
        <Flex
          justify="space-between"
          align="center"
          className="text-sm text-gray-500 mb-6 flex-wrap gap-2"
        >
          <Flex gap={3} align="center">
            <Text>{data.date}</Text>
            <Link href={data.originalLink} target="_blank" rel="noopener noreferrer">
              <Button size="xs" colorScheme="gray" variant="outline">
                기사원문
              </Button>
            </Link>
          </Flex>

          <Flex align="center">
            <Text fontSize="sm">스크랩</Text>
            <IconButton
              aria-label="스크랩"
              icon={isScrapped ? <FaBookmark color="yellow.400" /> : <FaRegBookmark />}
              variant="ghost"
              size="sm"
              onClick={handleScrap}
            />
          </Flex>
        </Flex>

        {/* 이미지 */}
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-auto mb-6 rounded-md shadow"
        />

        {/* 기사 내용 */}
        <article className="text-base leading-relaxed whitespace-pre-line text-gray-800 mb-10">
          {data.content}
        </article>

        {/* 학습하러 가기 */}
        <Flex justify="center">
          <Button colorScheme="purple" size="lg" px={8}>
            학습하러 가기
          </Button>
        </Flex>
      </main>
      <Footer />
    </Box>
  );
}
