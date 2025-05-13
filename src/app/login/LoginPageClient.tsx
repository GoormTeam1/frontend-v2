"use client";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "@/components/Footer";
import { API_BASE_URL } from '@/config/env';

export default function LoginPageClient() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/user/login`,
        { email, password }
      );

      const accessToken = response.data.data?.accessToken;
      console.log("로그인 응답 토큰:", accessToken);

      if (accessToken) {
        localStorage.setItem("token", accessToken);
        router.push("/");
      } else {
        throw new Error("accessToken이 응답에 없습니다.");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "이메일 또는 비밀번호가 올바르지 않습니다.";
      toast({
        title: "로그인 실패",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="purple.50">
      <Flex flex="1" justify="center" align="center" pt={12} pb={4}>
        <Box
          as="form"
          onSubmit={handleSubmit}
          bg="white"
          p={10}
          borderRadius="lg"
          boxShadow="lg"
          w="full"
          maxW="lg"
        >
          <Stack spacing={6}>
            <Heading size="xl" textAlign="center" color="purple.600">
              환영합니다!
            </Heading>
            <Text fontSize="md" textAlign="center" color="gray.500">
              로그인하여 서비스를 이용하세요
            </Text>

            <FormControl isRequired>
              <FormLabel>이메일</FormLabel>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>비밀번호</FormLabel>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
              />
              <Text fontSize="xs" color="gray.400" mt={1}>
                8자 이상, 영문/숫자/특수문자 포함
              </Text>
            </FormControl>

            <Button type="submit" colorScheme="purple" size="lg">
              로그인
            </Button>

            <Text fontSize="sm" textAlign="center" color="gray.600">
              아직 회원이 아니신가요?{" "}
              <Button
                variant="link"
                colorScheme="purple"
                onClick={() => router.push("/signup")}
                fontWeight="bold"
              >
                회원가입
              </Button>
            </Text>
          </Stack>
        </Box>
      </Flex>

      <Footer />
    </Box>
  );
}
