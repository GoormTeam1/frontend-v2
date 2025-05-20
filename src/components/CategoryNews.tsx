"use client";

import {
  Box,
  Container,
  Image,
  Text,
  Flex,
  Spinner,
  useToast,
  Button,
  ButtonGroup,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { API_BASE_URL } from "@/config/env";
import Link from "next/link";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  category: string;
  image?: string;
  sourceLink?: string;
  publishedAt?: string;
  createAt?: string;
}

interface NewsResponse {
  content: NewsArticle[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  first: boolean;
  number: number;
  size: number;
}

type SortOrder = "latest" | "oldest";

const CATEGORIES = [
  { id: "us", label: "US" },
  { id: "world", label: "World" },
  { id: "politics", label: "Politics" },
  { id: "business", label: "Business" },
  { id: "health", label: "Health" },
  { id: "entertainment", label: "Entertainment" },
  { id: "style", label: "Style" },
  { id: "travel", label: "Travel" },
  { id: "sports", label: "Sports" },
  { id: "science", label: "Science" },
  { id: "climate", label: "Climate" },
  { id: "weather", label: "Weather" },
];

const ITEMS_PER_PAGE = 6;

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function CategoryNews() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0].id);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("latest");
  const [currentTabPage, setCurrentTabPage] = useState(0);
  const toast = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_BASE_URL}/api/news/category/${selectedCategory}?page=${currentPage}&size=9&sort=publishedAt,${sortOrder === "latest" ? "desc" : "asc"}`
        );

        if (!response.ok) throw new Error("카테고리 뉴스를 불러오는데 실패했습니다.");

        const data: NewsResponse = await response.json();
        setArticles(data.content || []);
        setTotalPages(data.totalPages);
      } catch {
        toast({
          title: "데이터를 불러오는데 실패했습니다",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryNews();
  }, [selectedCategory, currentPage, sortOrder, toast]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as SortOrder);
    setCurrentPage(0);
  };

  const handleCategoryChange = (index: number) => {
    const categoryIndex = currentTabPage * ITEMS_PER_PAGE + index;
    setSelectedCategory(CATEGORIES[categoryIndex].id);
    setCurrentPage(0);
  };

  const handleTabPageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentTabPage > 0) {
      setCurrentTabPage(currentTabPage - 1);
    } else if (direction === "next" && currentTabPage < Math.ceil(CATEGORIES.length / ITEMS_PER_PAGE) - 1) {
      setCurrentTabPage(currentTabPage + 1);
    }
  };

  const visibleCategories = CATEGORIES.slice(
    currentTabPage * ITEMS_PER_PAGE,
    (currentTabPage + 1) * ITEMS_PER_PAGE
  );

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = "https://placehold.co/400x200?text=No+Image";
  };

  if (!mounted) return null;

  return (
    <Container maxW="1000px" py={8} mt={20}>
      <Tabs
        variant="soft-rounded"
        colorScheme="purple"
        onChange={handleCategoryChange}
        defaultIndex={0}
      >
        <Flex justify="center" align="center" mb={6}>
          <IconButton
            aria-label="Previous categories"
            icon={<ChevronLeftIcon />}
            onClick={() => handleTabPageChange("prev")}
            isDisabled={currentTabPage === 0}
            mr={2}
          />
          <TabList flexWrap="nowrap" gap={2} overflow="hidden">
            {visibleCategories.map((category) => (
              <Tab
                key={category.id}
                whiteSpace="nowrap"
                _selected={{ bg: "purple.500", color: "white" }}
              >
                {category.label}
              </Tab>
            ))}
          </TabList>
          <IconButton
            aria-label="Next categories"
            icon={<ChevronRightIcon />}
            onClick={() => handleTabPageChange("next")}
            isDisabled={currentTabPage >= Math.ceil(CATEGORIES.length / ITEMS_PER_PAGE) - 1}
            ml={2}
          />
        </Flex>

        <TabPanels>
          {visibleCategories.map((category) => (
            <TabPanel key={category.id} p={0}>
              <Flex justify="space-between" align="center" mb={6}>
                <Text fontSize="3xl" fontWeight="bold" p={6}>
                  {category.label} News
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

              {loading ? (
                <Flex justify="center" align="center" minH="400px">
                  <Spinner size="xl" color="purple.500" />
                </Flex>
              ) : articles.length === 0 ? (
                <Box textAlign="center" py={12}>
                  <Text fontSize="lg" color="gray.500">
                    해당 카테고리의 뉴스가 없습니다.
                  </Text>
                </Box>
              ) : (
                <>
                  <Box>
                    {articles.map((article) => (
                      <Link href={`/news/${article.id}`} key={article.id}>
                        <Box
                          mb={4}
                          bg="white"
                          borderRadius="md"
                          overflow="hidden"
                          boxShadow="md"
                          _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s" }}
                        >
                          <Flex p={4}>
                            <Image
                              src={article.image || "https://placehold.co/400x200?text=No+Image"}
                              alt={article.title}
                              width="250px"
                              height="200px"
                              objectFit="cover"
                              onError={handleImageError}
                            />
                            <Box p={4} flex="1">
                              <Flex direction="column" height="100%" justify="space-between">
                                <Box>
                                  <Text fontSize="xl" color="gray.500" mb={1}>
                                    {article.category}
                                  </Text>
                                  <Text fontWeight="semibold" fontSize="xl" noOfLines={2}>
                                    {article.title}
                                  </Text>
                                </Box>
                                <Text fontSize="md" color="gray.500">
                                  {formatDate(article.publishedAt)}
                                </Text>
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>
                      </Link>
                    ))}
                  </Box>

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
                        {[...Array(totalPages)].map((_, idx) => (
                          <Button
                            key={idx}
                            onClick={() => handlePageChange(idx)}
                            colorScheme={currentPage === idx ? "purple" : "gray"}
                            variant={currentPage === idx ? "solid" : "outline"}
                          >
                            {idx + 1}
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
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Container>
  );
}
