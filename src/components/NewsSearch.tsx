"use client";

import {
  Box,
  Text,
  InputGroup,
  InputLeftElement,
  Input,
  Stack,
  Button,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewsSearch() {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const toast = useToast();

  const handleSearch = () => {
    if (!keyword.trim()) {
      toast({
        title: "검색어를 입력해주세요",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    router.push(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box maxW="1000px" mx="auto" bg="purple.50" borderRadius="md" p={8}>
      <Text mb={6} fontWeight="semibold" fontSize="2xl" textAlign="center">
        뉴스 검색
      </Text>

      {/* 가운데 정렬된 입력창 */}
      <Flex justify="center" mb={6}>
        <InputGroup w="600px">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="키워드를 입력하세요"
            height="48px"
            fontSize="md"
            px={4}
            bg="white"
            w="600px"
            borderRadius="md"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </InputGroup>
      </Flex>

      {/* 카테고리 버튼 */}
      <Stack direction="row" spacing={4} justify="center">
        {["IT", "World", "Politics", "Business", "Health", "Travel"].map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            colorScheme="purple"
            bg="white"
            onClick={() => {
              setKeyword(cat);
              handleSearch();
            }}
          >
            {cat}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
