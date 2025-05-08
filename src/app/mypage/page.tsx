"use client";

import { Box, Container, Heading, useToast } from "@chakra-ui/react";
import UserProfile from "../../components/UserProfile";
import Header from "@/components/Header";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '@/config/env';

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          birthDate: raw.birthDate.slice(0, 10), // YYYY-MM-DD
          interests: [], // 서버 응답에 없으므로 일단 빈 배열
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

  const handleProfileUpdate = (updatedData: UserData) => {
    // TODO: API 호출로 실제 데이터 업데이트
    setUserData(updatedData);
  };

  return (
    <>
      <Header />
      <Container maxW="container.xl" py={8}>
        <Box mb={8}>
          <Heading as="h1" size="lg" mb={6} pl={36}>
            마이페이지
          </Heading>
          {userData && (
            <UserProfile {...userData} onUpdate={handleProfileUpdate} />
          )}
        </Box>
      </Container>
    </>
  );
}
