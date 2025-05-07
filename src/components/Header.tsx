"use client";

import { Box, Heading, Flex, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [formattedDate, setFormattedDate] = useState("");
  const [isClient, setIsClient] = useState(false); // 👈 추가

  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // 👈 클라이언트 렌더링 시작됨을 표시

    const today = new Date();
    const dateStr = today.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    setFormattedDate(dateStr);
  }, []);

  return (
    <Box
      as="header"
      bg="white.100"
      p={12}
      position="relative"
      borderBottom="2px solid"
      borderColor="purple.500"
      maxW="1000px"
      mx="auto"
      w="100%"
    >
      <Flex align="center" justify="space-between">
        {/* 왼쪽: 날짜 */}
        <Box>
          {isClient && formattedDate && ( // 👈 서버에서는 렌더링 안 함
            <Text fontSize="sm" color="black.700">
              {formattedDate}
            </Text>
          )}
        </Box>

        {/* 오른쪽: 로그인 / 회원가입 */}
        <Box>
          <Button
            colorScheme="purple"
            variant="ghost"
            size="sm"
            mr={2}
            onClick={() => router.push("/login")}
          >
            로그인
          </Button>
          <Button
            colorScheme="purple"
            size="sm"
            onClick={() => router.push("/signup")}
          >
            회원가입
          </Button>
        </Box>
      </Flex>

      {/* 가운데: 팀명 (절대 중앙 정렬) */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Link href="/">
          <Heading size="xl" textAlign="center" cursor="pointer">
            NeWordS
          </Heading>
        </Link>
      </Box>
    </Box>
  );
}
