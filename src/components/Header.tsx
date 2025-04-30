// components/Header.tsx
"use client";

import { Box, Heading, Flex, Button, Text, Spacer } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Header() {
  const [formattedDate, setFormattedDate] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date();
    const dateStr = today.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    setFormattedDate(dateStr);
  }, []);

  return (
    <Box as="header" p="4" bg="blue.100">
      <Flex align="center">
        {/* 팀명 */}
        <Heading size="md">Goorm Team1</Heading>
        
        {/* 날짜 표시 */}
        {formattedDate && (
          <Text ml={8} fontSize="md" color="gray.600">
            {formattedDate}
          </Text>
        )}
        
        <Spacer />
        
        {/* 로그인/회원가입 버튼 */}
        <Button
          colorScheme="blue"
          variant="outline"
          size="sm"
          mr={2}
        >
          로그인
        </Button>
        <Button
          colorScheme="blue"
          size="sm"
        >
          회원가입
        </Button>
      </Flex>
    </Box>
  );
}
