"use client";

import Header from "../components/Header";
import Footer from "../components/Footer";

import {
  Box,
} from "@chakra-ui/react";


import ArticleSlider from "../components/Articleslider";
import NewsSearch from "../components/NewsSearch";
import Scrapnews from "../components/Scrapnews"

export default function Home() {
  return (
    <>
      <Header />
      <Box as="main" p={8} maxW="1200px" mx="auto">
        <ArticleSlider />
        <Box mt={20}>
          <NewsSearch />
        </Box>
        <Scrapnews />
      </Box>
      <Footer />
    </>
  );
}
