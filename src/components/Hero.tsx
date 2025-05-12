import { Box, Heading, Text, Button, Stack, Image, SimpleGrid, Icon } from "@chakra-ui/react";
import Link from "next/link";
import { FaNewspaper, FaBookOpen, FaGraduationCap } from "react-icons/fa";

export default function Hero() {
  return (
    <Box
      as="section"
      minH={{ base: "40vh", md: "33vh" }}
      display="flex"
      alignItems="center"
      justifyContent="center"
      maxW="1000px"
      mx="auto"
      w="100%"
      textAlign="center"
      px={{ base: 6, md: 12 }}
      py={4}
      bgGradient="linear(to-br, purple.50, pink.50, purple.100)"
      position="relative"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at top right, purple.200, transparent 70%)"
        opacity={0.3}
        zIndex={0}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at bottom left, pink.200, transparent 70%)"
        opacity={0.3}
        zIndex={0}
      />
      <Stack spacing={6} align="center" position="relative" zIndex={1}>
        <Stack spacing={3}>
          <Heading
            as="h1"
            size="lg"
            fontWeight="bold"
            lineHeight="short"
            color="gray.800"
          >
            뉴스로 영어를, 영어로 세상을 읽다.
          </Heading>

          <Text fontSize={{ base: "md", md: "lg" }} color="black" maxW="2xl">
            AI가 요약한 최신 영어 뉴스와 핵심 단어로, 매일 10분 영어 학습을 시작하세요.
          </Text>
        </Stack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} w="full" maxW="2xl">
          <FeatureCard
            icon={FaNewspaper}
            title="Daily News"
            description="Stay updated with the latest news while improving your English"
          />
          <FeatureCard
            icon={FaBookOpen}
            title="Vocabulary Builder"
            description="Learn key words and phrases from real-world context"
          />
          <FeatureCard
            icon={FaGraduationCap}
            title="Smart Learning"
            description="Personalized learning path based on your level"
          />
        </SimpleGrid>

      </Stack>
    </Box>
  );
}

function FeatureCard({ icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <Box
      p={4}
      bg="white"
      rounded="lg"
      shadow="sm"
      _hover={{ transform: "translateY(-2px)", shadow: "md" }}
      transition="all 0.2s"
    >
      <Icon as={icon} w={6} h={6} color="blue.500" mb={2} />
      <Heading as="h3" size="sm" mb={1} color="gray.800">
        {title}
      </Heading>
      <Text fontSize="sm" color="gray.600">{description}</Text>
    </Box>
  );
}