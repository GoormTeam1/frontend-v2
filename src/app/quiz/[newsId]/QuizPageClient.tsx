"use client";

import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import {
  Box,
  Button,
  Input,
  Text,
  Heading,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";

interface QuizPageClientProps {
  newsId: string;
}

interface QuizData {
  id: number;
  title: string;
  question: string;
  translated: string;
  correctAnswer: string;
  options: string[];
}

const mockQuiz: QuizData = {
  id: 99999999,
  title: "Washington State Lawmakers Vote to Limit Rent Increases",
  translated:
    "워싱턴 주 의원들은 연간 주거용 임대료 인상을 최대 10%로 제한하는 법안을 통과시켜...",
  question:
    "Washington State lawmakers passed a bill to cap annual residential rent increases at no more than 10 percent, making it the third state to adopt statewide rent ____.",
  correctAnswer: "control",
  options: ["control", "regulation", "management", "restriction"],
};

export default function QuizPageClient({ newsId }: QuizPageClientProps) {
  const newsIdNumber = parseInt(newsId, 10);
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answer, setAnswer] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchQuiz = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8082/api/quiz/${newsIdNumber}`);
      setQuiz(res.data);
    } catch (err) {
      console.warn("퀴즈 API 호출 실패, mock 데이터 사용");
      if (newsIdNumber === 99999999) setQuiz(mockQuiz);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [newsId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (showAnswer) {
          handleNextQuiz();
        } else if (answer.trim()) {
          handleSubmit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showAnswer, answer]);

  useEffect(() => {
    if (!isLoading && !showAnswer && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, showAnswer]);

  const handleSubmit = () => {
    if (!quiz) return;
    const trimmedAnswer = answer.trim().toLowerCase();
    const correct = quiz.correctAnswer.toLowerCase();
    const isRight = trimmedAnswer === correct;

    if (isRight) {
      toast({ title: "정답입니다!", status: "success", duration: 2000, isClosable: true });
      setShowAnswer(true);
    } else {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);

      toast({
        title: newWrongCount >= 2 ? "오답입니다." : "오답입니다. 다시 시도해보세요.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      if (newWrongCount >= 2) setShowAnswer(true);
    }
  };

  const handleNextQuiz = () => {
    setAnswer("");
    setWrongCount(0);
    setShowAnswer(false);
    fetchQuiz();
  };

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Flex justify="center" align="center" py={20} flex="1">
          <Text>퀴즈를 불러오는 중입니다...</Text>
        </Flex>
        <Footer />
      </Box>
    );
  }

  if (!quiz) {
    return (
      <Box minH="100vh" display="flex" flexDirection="column">
        <Header />
        <Flex justify="center" align="center" py={20} flex="1">
          <Text>퀴즈를 불러오는데 실패했습니다.</Text>
        </Flex>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Header />
      <Box maxW="4xl" mx="auto" px={4} py={20} flex="1">
        <Text fontSize="2xl" fontWeight="semibold" mb={6}>
          {quiz.question}
        </Text>
        <Text fontSize="xl" color="gray.600" mb={12}>
          {quiz.translated}
        </Text>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Input
            ref={inputRef}
            placeholder="빈칸을 채워주세요."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            mb={6}
            isDisabled={showAnswer}
            size="lg"
            fontSize="lg"
          />
          <Flex justify="center">
            <Button type="submit" colorScheme="purple" isDisabled={showAnswer} mb={6} size="lg" px={8}>
              제출
            </Button>
          </Flex>
        </form>

        {showAnswer && (
          <Box mt={8} p={6} bg="gray.50" borderRadius="md">
            <Text fontSize="lg" fontWeight="bold" color="green.500" mb={6}>
              정답: {quiz.correctAnswer}
            </Text>
            <Flex justify="center">
              <Button onClick={handleNextQuiz} colorScheme="purple" variant="outline" size="lg" px={8}>
                다음 문제
              </Button>
            </Flex>
          </Box>
        )}
      </Box>
      <Footer />
    </Box>
  );
}
