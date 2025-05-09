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
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";

const allCategories = [
  "US", "World", "Pollitics", "Business", "Heallth", "Entertainment",
  "Style", "Travel", "Sports", "Science", "Climate", "Weather"
];

export default function NewsSearch() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
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

  const start = page * 6;
  const end = start + 6;
  const visibleCategories = allCategories.slice(start, end);

  return (
    <Box maxW="1000px" mx="auto" bg="purple.50" borderRadius="md" p={8}>
      <Text mb={6} fontWeight="semibold" fontSize="2xl" textAlign="center">
        뉴스 검색
      </Text>

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

      {/* 카테고리 버튼들 + 페이지 이동 */}
      <Flex justify="center" align="center" gap={2}>
        <IconButton
          aria-label="이전 카테고리"
          icon={<ChevronLeftIcon />}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          isDisabled={page === 0}
          variant="outline"
          size="sm"
        />
        <Stack direction="row" spacing={2}>
          {visibleCategories.map((cat) => (
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
        <IconButton
          aria-label="다음 카테고리"
          icon={<ChevronRightIcon />}
          onClick={() => setPage((p) => (p + 1) < Math.ceil(allCategories.length / 6) ? p + 1 : p)}
          isDisabled={end >= allCategories.length}
          variant="outline"
          size="sm"
        />
      </Flex>
    </Box>
  );
}
