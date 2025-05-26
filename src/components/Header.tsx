"use client";

import {
  Box, Flex, Button, Text, Tabs, TabList, Tab,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";

interface DecodedToken {
  sub: string;
  username?: string;
  exp: number;
}

export default function Header() {
  const [formattedDate, setFormattedDate] = useState("");
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);

    const today = new Date();
    const dateStr = today.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    setFormattedDate(dateStr);

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
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
    router.refresh();
  };

  const handleTabChange = (index: number) => {
    switch (index) {
      case 0:
        router.push("/");
        break;
      case 1:
        router.push("/mypage");
        break;
      case 2:
        router.push("/search?keyword=it");
        break;
    }
  };

  const getTabIndex = () => {
    if (pathname === "/") return 0;
    if (pathname === "/mypage") return 1;
    if (pathname.startsWith("/search")) return 2;
    return 0;
  };

  return (
    <Box
      as="header"
      bg="white.100"
      position="relative"
      borderBottom="2px solid"
      borderColor="purple.500"
      maxW="1000px"
      mx="auto"
      w="100%"
    >
      <Flex align="center" justify="space-between" p={4} mt={8}>
        <Box>
          {mounted && formattedDate && (
            <Text fontSize="sm" color="black.700">
              {formattedDate}
            </Text>
          )}
        </Box>

        <Box flex="1" display="flex" justifyContent="center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="NeWordS Logo"
              width={100}
              height={1}
              style={{ cursor: "pointer" }}
            />
          </Link>
        </Box>

        <Box>
          {mounted && user ? (
            <Flex align="center">
              <Text fontSize="sm" mr={3}>
                {user.username ?? user.sub}님 환영합니다!
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
            mounted && (
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
            )
          )}
        </Box>
      </Flex>

      <Tabs
        index={getTabIndex()}
        onChange={handleTabChange}
        variant="enclosed"
        colorScheme="purple"
        align="center"
        mt={4}
        mb={0.4}
      >
        <TabList>
          <Tab>Home</Tab>
          <Tab>나의 학습내역</Tab>
          <Tab>뉴스 검색</Tab>
        </TabList>
      </Tabs>
    </Box>
  );
}
