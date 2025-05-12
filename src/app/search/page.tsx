"use client";

import {
  Box,
  Container,
  Grid,
  Image,
  Text,
  Flex,
  Spinner,
  useToast,
  Button,
  ButtonGroup,
  Select,
  HStack,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NewsSearch from "@/components/NewsSearch";
import { API_BASE_URL } from '@/config/env';
import Link from "next/link";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  image: string;
  sourceLink: string;
  publishedAt: string;
  createAt: string;
}

interface SearchResponse {
  content: NewsArticle[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
}

type SortOrder = "latest" | "oldest";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const toast = useToast();

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!keyword) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/news/search?keyword=${encodeURIComponent(keyword)}&page=${currentPage}&size=9&sort=publishedAt,${sortOrder === "latest" ? "desc" : "asc"}`
        );

        if (!response.ok) {
          throw new Error("검색 결과를 불러오는데 실패했습니다.");
        }

        const data: SearchResponse = await response.json();
        setArticles(data.content || []);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast({
          title: "검색 중 오류가 발생했습니다",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [keyword, currentPage, sortOrder]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as SortOrder);
    setCurrentPage(0);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(0, currentPage - halfVisiblePages);
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    buttons.push(
      <Button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        isDisabled={currentPage === 0}
        variant="outline"
        colorScheme="purple"
      >
        이전
      </Button>
    );

    if (startPage > 0) {
      buttons.push(
        <Button key="first" onClick={() => handlePageChange(0)} variant="outline" colorScheme="purple">
          1
        </Button>
      );
      if (startPage > 1) {
        buttons.push(<Text key="first-ellipsis" mx={2}>...</Text>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          colorScheme={currentPage === i ? "purple" : "gray"}
          variant={currentPage === i ? "solid" : "outline"}
        >
          {i + 1}
        </Button>
      );
    }

    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        buttons.push(<Text key="last-ellipsis" mx={2}>...</Text>);
      }
      buttons.push(
        <Button key="last" onClick={() => handlePageChange(totalPages - 1)} variant="outline" colorScheme="purple">
          {totalPages}
        </Button>
      );
    }

    buttons.push(
      <Button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages - 1}
        variant="outline"
        colorScheme="purple"
      >
        다음
      </Button>
    );

    return buttons;
  };

  if (loading) {
    return (
      <>
        <Header />
        <Flex justify="center" align="center" minH="60vh">
          <Spinner size="xl" color="purple.500" />
        </Flex>
      </>
    );
  }

  return (
    <>
      <Header />
      <NewsSearch />
      <Container maxW="1000px" py={8}>
        <Flex justify="space-between" align="center" mb={6}>
          <Text fontSize="2xl" fontWeight="bold">
            "{keyword}" 검색 결과
          </Text>
          <Select
            value={sortOrder}
            onChange={handleSortChange}
            width="150px"
            size="md"
            variant="filled"
            bg="white"
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
          </Select>
        </Flex>

        {articles.length === 0 ? (
          <Box textAlign="center" py={12}>
            <Text fontSize="lg" color="gray.500">
              검색 결과가 없습니다.
            </Text>
          </Box>
        ) : (
          <>
            <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
              {articles.map((article) => (
                <Link key={article.id} href={`/news/${article.id}`}>
                  <Box
                    bg="white"
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow="md"
                    _hover={{ transform: "translateY(-4px)", transition: "transform 0.2s" }}
                  >
                    <Image
                      src={article.image}
                      alt={article.title}
                      width="100%"
                      height="200px"
                      objectFit="cover"
                    />
                    <Box p={4}>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm" color="gray.500">{article.category}</Text>
                        <Text fontSize="xs" color="gray.400">{new Date(article.publishedAt).toLocaleDateString()}</Text>
                      </Flex>
                      <Text fontWeight="semibold" noOfLines={3}>{article.title}</Text>
                    </Box>
                  </Box>
                </Link>
              ))}
            </Grid>

            {totalPages > 1 && (
              <Flex justify="center" mt={8}>
                <ButtonGroup spacing={2}>
                  {renderPaginationButtons()}
                </ButtonGroup>
              </Flex>
            )}
          </>
        )}
      </Container>
    </>
  );
}
