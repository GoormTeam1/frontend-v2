"use client";

import { Box, Heading, Flex, Button, Text, HStack, Tabs, TabList, Tab } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [formattedDate, setFormattedDate] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);

    const today = new Date();
    const dateStr = today.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
    setFormattedDate(dateStr);

    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    checkLoginStatus();
  }, []);

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
    if (pathname === "/search") return 2;
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
        {/* 왼쪽: 날짜 */}
        <Box minH="24px" flex="1">
          {isClient && formattedDate && (
            <Text fontSize="sm" color="black.700">
              {formattedDate}
            </Text>
          )}
        </Box>

        {/* 가운데: 팀명 */}
        <Box flex="1" textAlign="center">
          <Link href="/">
            <Heading size="xl" cursor="pointer">
              NeWordS
            </Heading>
          </Link>
        </Box>

        {/* 오른쪽: 로그인 / 회원가입 또는 마이페이지 */}
        <Box flex="1" textAlign="right">
          {isClient && (
            isLoggedIn ? (
              <HStack spacing={4} justify="flex-end">
                <Button
                  colorScheme="purple"
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/mypage")}
                >
                  마이페이지
                </Button>
                <Button
                  colorScheme="purple"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem("token");
                    setIsLoggedIn(false);
                    router.push("/");
                  }}
                >
                  로그아웃
                </Button>
              </HStack>
            ) : (
              <HStack spacing={2} justify="flex-end">
                <Button
                  colorScheme="purple"
                  variant="ghost"
                  size="sm"
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
              </HStack>
            )
          )}
        </Box>
      </Flex>

      {/* 네비게이션 탭 */}
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
