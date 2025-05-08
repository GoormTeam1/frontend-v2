"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import NewsSearch from "@/components/NewsSearch";
import ArticleSlider from "@/components/Articleslider";
import CategoryNews from "@/components/CategoryNews";
import Footer from "@/components/Footer";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header />
      <Box as="main" p={8} maxW="1200px" mx="auto">
        <ArticleSlider />
        <Box mt={20}>
          <NewsSearch />
        </Box>
        <CategoryNews />
      </Box>
      <Footer />
    </>
  );
}
