'use client';

import {
  Box,
  Grid,
  Image,
  Text,
  Flex,
  Spinner,
  useToast,
  Button,
  ButtonGroup,
  Badge,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface ScrapedArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  image: string;
  sourceLink: string;
  publishedAt: string;
  scrapedAt: string;
}

interface ScrapedArticlesResponse {
  content: ScrapedArticle[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
}

export default function ScrapedArticles() {
  const [articles, setArticles] = useState<ScrapedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchScrapedArticles = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast({
            title: "로그인이 필요합니다",
            status: "warning",
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        const response = await fetch(
          `http://172.16.24.156:8082/api/news/scraps?page=${currentPage}&size=6`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("스크랩한 기사를 불러오는데 실패했습니다.");
        }

        const data: ScrapedArticlesResponse = await response.json();
        setArticles(data.content || []);
        setTotalPages(data.totalPages);
      } catch (error) {
        toast({
          title: "스크랩한 기사 불러오기 실패",
          description: "잠시 후 다시 시도해주세요.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScrapedArticles();
  }, [currentPage, toast]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnscrap = async (articleId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `http://172.16.24.156:8082/api/news/scraps/${articleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("스크랩 취소에 실패했습니다.");
      }

      // 스크랩 취소 후 목록 새로고침
      setArticles(articles.filter(article => article.id !== articleId));
      
      toast({
        title: "스크랩이 취소되었습니다",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "스크랩 취소 실패",
        description: "잠시 후 다시 시도해주세요.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="200px">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        스크랩한 기사
      </Text>

      {articles.length === 0 ? (
        <Box textAlign="center" py={12} bg="gray.50" borderRadius="md">
          <Text fontSize="lg" color="gray.500">
            아직 스크랩한 기사가 없습니다.
          </Text>
        </Box>
      ) : (
        <>
          <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={8}>
            {articles.map((article) => (
              <Box
                key={article.id}
                bg="white"
                borderRadius="md"
                overflow="hidden"
                boxShadow="md"
                position="relative"
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
                    <Badge colorScheme="purple">{article.category}</Badge>
                    <Text fontSize="xs" color="gray.400">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </Text>
                  </Flex>
                  <Text
                    fontWeight="semibold"
                    noOfLines={3}
                    mb={2}
                    as="a"
                    href={article.sourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    _hover={{ color: "purple.500" }}
                  >
                    {article.title}
                  </Text>
                  <Button
                    size="sm"
                    colorScheme="purple"
                    variant="outline"
                    width="100%"
                    onClick={() => handleUnscrap(article.id)}
                  >
                    스크랩 취소
                  </Button>
                </Box>
              </Box>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Flex justify="center" mt={8}>
              <ButtonGroup spacing={2}>
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  isDisabled={currentPage === 0}
                  variant="outline"
                  colorScheme="purple"
                >
                  이전
                </Button>
                {[...Array(totalPages)].map((_, index) => (
                  <Button
                    key={index}
                    onClick={() => handlePageChange(index)}
                    colorScheme={currentPage === index ? "purple" : "gray"}
                    variant={currentPage === index ? "solid" : "outline"}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  isDisabled={currentPage === totalPages - 1}
                  variant="outline"
                  colorScheme="purple"
                >
                  다음
                </Button>
              </ButtonGroup>
            </Flex>
          )}
        </>
      )}
    </Box>
  );
} 