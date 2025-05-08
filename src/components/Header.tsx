"use client";

import { Box, Heading, Flex, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  sub: string;          // e.g. email or id
  nickname?: string;    // 백엔드에서 claim 으로 넣어줬다면
  exp: number;
}

export default function Header() {
  const [formattedDate, setFormattedDate] = useState("");
  const [user, setUser] = useState<DecodedToken | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 1) 날짜 세팅
    const today = new Date();
    const dateStr = today.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    setFormattedDate(dateStr);

    // 2) 클라이언트 환경인지 확인 후 로컬스토리지 접근
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // 만료 시간(exp)이 밀리초 단위인지 확인 후 비교
      if (decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        localStorage.removeItem("token");
      }
    } catch (e) {
      console.error("Invalid token:", e);
      localStorage.removeItem("token");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

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
          {formattedDate && (
            <Text fontSize="sm" color="black.700">
              {formattedDate}
            </Text>
          )}
        </Box>

        {/* 오른쪽: 로그인 상태 */}
        <Box>
          {user ? (
            <Flex align="center">
              <Text fontSize="sm" mr={3}>
                {user.nickname ?? user.sub}님 환영합니다!
              </Text>
              <Button
                size="sm"
                colorScheme="purple"
                variant="outline"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </Flex>
          ) : (
            <>
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
            </>
          )}
        </Box>
      </Flex>

      {/* 가운데: 팀명 */}
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
