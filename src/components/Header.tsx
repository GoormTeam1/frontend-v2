// components/Header.tsx
"use client";

import { Box, Heading, Flex, Button, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Header() {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
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
    <Box as="header" bg="white.100" p={12} position="relative" borderBottom="2px solid" borderColor="purple.500" maxW="1000px" mx="auto" w="100%">
      <Flex align="center" justify="space-between">
        {/* 왼쪽: 날짜 */}
        <Box>
          {formattedDate && (
            <Text fontSize="sm" color="black.700">
              {formattedDate}
            </Text>
          )}
        </Box>

        {/* 오른쪽: 로그인 / 회원가입 */}
        <Box>
          <Button colorScheme="purple" variant="ghost" size="sm" mr={2}>
            로그인
          </Button>
          <Button colorScheme="purple" size="sm">
            회원가입
          </Button>
        </Box>
      </Flex>

      {/* 가운데: 팀명 (절대 중앙 정렬) */}
      <Box position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)">
        <Heading size="md" textAlign="center">
          Goorm Team1
        </Heading>
      </Box>
    </Box>
  );
}
