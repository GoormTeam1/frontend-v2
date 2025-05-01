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

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/api/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      router.push("/");
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
    <Flex
      direction="column"
      justify="center"
      align="center"
      minH="calc(100vh - 64px)" // Footer 고려
      bg="purple.50"
      pt={12}
      pb={4}
    >
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
  );
}
