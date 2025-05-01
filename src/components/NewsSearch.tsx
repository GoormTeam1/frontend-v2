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
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export default function NewsSearch() {
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
          />
        </InputGroup>
      </Flex>

      {/* 카테고리 버튼 */}
      <Stack direction="row" spacing={4} justify="center">
        {["IT", "경제", "사회", "문화", "국제", "스포츠"].map((cat) => (
          <Button
            key={cat}
            variant="outline"
            size="sm"
            colorScheme="purple"
            bg="white"
          >
            {cat}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
