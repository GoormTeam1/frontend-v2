"use client";

import { Box, Container, Heading, useToast } from "@chakra-ui/react";
import UserProfile from "../../components/UserProfile";
import Header from "@/src/components/Header";
import { useState } from "react";

type UserData = {
  name: string;
  email: string;
  gender: string;
  birthDate: string;
  interests: string[];
  englishLevel: "상" | "중" | "하";
};

export default function MyPage() {
  const [userData, setUserData] = useState<UserData>({
    name: "홍길동",
    email: "hong@example.com",
    gender: "남성",
    birthDate: "1990-01-01",
    interests: ["경제", "과학", "정치"],
    englishLevel: "중",
  });

  const toast = useToast();

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
          <UserProfile {...userData} onUpdate={handleProfileUpdate} />
        </Box>
      </Container>
    </>
  );
}
