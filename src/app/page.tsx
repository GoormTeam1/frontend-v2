"use client";

import { Box } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import Header from "@/src/components/Header";
import NewsSearch from "@/src/components/NewsSearch";
import ArticleSlider from "@/src/components/Articleslider";
import CategoryNews from "@/src/components/CategoryNews";
import Footer from "@/src/components/Footer";

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
