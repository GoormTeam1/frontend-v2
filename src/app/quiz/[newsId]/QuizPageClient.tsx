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
import { useRouter } from "next/navigation";


interface QuizPageClientProps {
  newsId: string;
}

interface QuizData {
  newsId: number | null;
  sentenceIndex: number;
  sentenceText: string;
  translateText: string;
  blankText: string;
  blankWord: string;
}

export default function QuizPageClient({ newsId }: QuizPageClientProps) {
  const newsIdNumber = parseInt(newsId, 10);
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [quizList, setQuizList] = useState<QuizData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [canRevealAnswer, setCanRevealAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quiz = quizList[currentIndex];

  const handlePrevQuiz = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setAnswer("");
      setWrongCount(0);
      setShowAnswer(false);
      setCanRevealAnswer(false);
    }
  };

  const fetchQuizList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://172.16.24.156:8083/api/quiz/${newsIdNumber}`);
      setQuizList(res.data.sort((a: QuizData, b: QuizData) => a.sentenceIndex - b.sentenceIndex));
      setCurrentIndex(0);
    } catch (err) {
      console.warn("퀴즈 API 호출 실패");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizList();
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
    const correct = quiz.blankWord.toLowerCase();
    const isRight = trimmedAnswer === correct;

    if (isRight) {
      toast({ title: "정답입니다!", status: "success", duration: 2000, isClosable: true });
      setShowAnswer(true);
    } else {
      const newWrongCount = wrongCount + 1;
      setWrongCount(newWrongCount);

      toast({
        title: "오답입니다. 다시 시도해보세요.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });

      if (newWrongCount >= 2) {
        setCanRevealAnswer(true); // 자동 정답 공개는 하지 않음
      }
    }
  };

  const handleNextQuiz = () => {
    setAnswer("");
    setWrongCount(0);
    setShowAnswer(false);
    setCanRevealAnswer(false);

    if (currentIndex < quizList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast({
        title: "모든 문제를 완료했습니다!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
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
        <Heading size="lg" mb={6}>
          문장 {quiz.sentenceIndex + 1} / {quizList.length}
        </Heading>
        <Text fontSize="2xl" fontWeight="semibold" mb={6}>
          {quiz.blankText}
        </Text>
        <Text fontSize="xl" color="gray.600" mb={12}>
          {quiz.translateText}
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
            <Button
              type="submit"
              colorScheme="purple"
              isDisabled={showAnswer}
              mb={6}
              size="lg"
              px={8}
            >
              제출
            </Button>
          </Flex>
        </form>

        {/* 정답 보기 버튼 */}
        {canRevealAnswer && !showAnswer && (
          <Flex justify="center" mt={4}>
            <Button
              onClick={() => setShowAnswer(true)}
              colorScheme="gray"
              variant="outline"
              size="md"
            >
              정답 보기
            </Button>
          </Flex>
        )}

        {/* 정답 표시 + 다음 문제 */}
        {showAnswer && (
          <Box mt={8} p={6} bg="gray.50" borderRadius="md">
            <Text fontSize="lg" fontWeight="bold" color="green.500" mb={6}>
              정답: {quiz.blankWord}
            </Text>
            <Flex justify="center" gap={4}>
              {currentIndex > 0 && (
                <Button
                  onClick={handlePrevQuiz}
                  colorScheme="gray"
                  variant="outline"
                  size="lg"
                  px={8}
                >
                  이전 문제
                </Button>
              )}
              {currentIndex < quizList.length - 1 ? (
                <Button
                  onClick={handleNextQuiz}
                  colorScheme="purple"
                  variant="outline"
                  size="lg"
                  px={8}
                >
                  다음 문제
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/")}
                  colorScheme="green"
                  size="lg"
                  px={8}
                >
                  홈으로 돌아가기
                </Button>
              )}
            </Flex>
          </Box>
        )}
      </Box>
    </Box>
  );
}
