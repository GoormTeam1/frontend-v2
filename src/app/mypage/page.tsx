"use client";

import {
  Box,
  Container,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '@/config/env';
import Header from "@/components/Header";
import UserProfile from "../../components/UserProfile";
import ScrapedArticles from "@/components/ScrapedArticles";
import WrongQuizArticles from "@/components/WrongQuizArticles";
import Footer from "@/components/Footer";

type UserData = {
  name: string;
  email: string;
  gender: string;
  birthDate: string;
  interests: string[];
  englishLevel: "상" | "중" | "하";
};

export default function MyPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const toast = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("로그인 토큰이 없습니다.");

        const response = await fetch(`${API_BASE_URL}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          throw new Error("서버가 JSON이 아닌 응답을 반환했습니다.");
        }

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "회원 정보 조회 실패");
        }

        const raw = result.data;

        setUserData({
          name: raw.userName,
          email: raw.email,
          gender: raw.gender,
          birthDate: raw.birthDate.slice(0, 10),
          interests: raw.categoryList,
          englishLevel: raw.level as "상" | "중" | "하",
        });
      } catch (error: any) {
        toast({
          title: "에러 발생",
          description: error.message || "회원 정보를 불러오지 못했습니다.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserData();
  }, []);

  const handleProfileUpdate = async (updatedData: UserData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("로그인 토큰이 없습니다.");

      const interestRes = await fetch(`${API_BASE_URL}/api/user/interests`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoryList: updatedData.interests }),
      });

      if (!interestRes.ok) {
        const errorData = await interestRes.json();
        throw new Error(errorData.message || "관심사 업데이트 실패");
      }

      const levelRes = await fetch(`${API_BASE_URL}/api/user/level`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ level: updatedData.englishLevel }),
      });

      if (!levelRes.ok) {
        const errorData = await levelRes.json();
        throw new Error(errorData.message || "레벨 업데이트 실패");
      }

      toast({
        title: "업데이트 성공",
        description: "회원 정보가 성공적으로 수정되었습니다.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setUserData(updatedData);
    } catch (error: any) {
      toast({
        title: "업데이트 실패",
        description: error.message || "프로필 업데이트 중 오류가 발생했습니다.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Header />
      <Box bg="gray.50" minH="100vh">
        <Container maxW="container.xl" py={12}>
          <Box mb={12}>
            <Heading
              as="h1"
              size="xl"
              mb={8}
              color="gray.800"
              fontFamily="serif"
              textAlign="center"
            >
              My Learning Dashboard
            </Heading>
            {userData && (
              <Box
                bg="white"
                rounded="xl"
                shadow="sm"
                p={8}
                maxW="4xl"
                mx="auto"
              >
                <UserProfile {...userData} onUpdate={handleProfileUpdate} />
              </Box>
            )}
          </Box>

          <Box mb={12}>
            <Heading
              as="h2"
              size="lg"
              mb={6}
              color="gray.800"
              fontFamily="serif"
              textAlign="center"
            >
              My Learning Progress
            </Heading>

            {/* 스크랩한 기사 박스 */}
            <Box
              bg="white"
              rounded="xl"
              shadow="sm"
              p={6}
              mb={10}
              w="100%"
            >
              <Heading as="h3" size="md" mb={4} color="gray.700">
                Saved Articles
              </Heading>
              <ScrapedArticles />
            </Box>

            {/* 오답 기사 박스 */}
            <Box
              bg="white"
              rounded="xl"
              shadow="sm"
              p={6}
              w="100%"
            >
              <Heading as="h3" size="md" mb={4} color="gray.700">
                Quiz History
              </Heading>
              <WrongQuizArticles />
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}
