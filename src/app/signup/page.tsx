"use client";

import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const categories = ["정치", "경제", "사회", "국제", "문화", "연예", "스포츠", "IT/과학", "생활/건강"];
const levels = ["초급", "중급", "고급"];

export default function SignupPage() {
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [level, setLevel] = useState("");

  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const isValidPassword = (pw: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+~]).{8,}$/.test(pw);

  const checkEmail = async () => {
    if (!email) {
      toast({
        title: "이메일 확인",
        description: "이메일을 입력해주세요.",
        status: "warning",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (email === "test@used.com") {
      setIsEmailAvailable(false);
      setIsEmailChecked(false);
      toast({
        title: "❌ 이미 사용 중인 이메일입니다.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setIsEmailAvailable(true);
      setIsEmailChecked(true);
      toast({
        title: "✅ 사용 가능한 이메일입니다.",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        toast({
          title: "모든 항목을 입력해주세요.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (!isEmailChecked || !isEmailAvailable) {
        toast({
          title: "이메일 중복 확인을 해주세요.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (!isValidPassword(password)) {
        toast({
          title: "비밀번호는 영문+숫자+특수문자 포함, 8자 이상이어야 합니다.",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "비밀번호가 일치하지 않습니다.",
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setStep(2);
    } else {
      if (!gender || !age || !level || selectedCategories.length === 0) {
        toast({
          title: "모든 항목을 입력해주세요. (관심 분야는 1개 이상 선택)",
          status: "warning",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        await axios.post("http://localhost:8081/api/user/signup", {
          name,
          email,
          password,
          gender,
          age: Number(age),
          categories: selectedCategories,
          level,
        });

        toast({
          title: "회원가입이 완료되었습니다!",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);

        router.push("/login");
      } catch (error: any) {
        const msg = error.response?.data?.message || "회원가입 중 오류가 발생했습니다.";
        toast({
          title: "회원가입 실패",
          description: msg,
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Flex minH="calc(100vh - 4rem)" justify="center" align="center" bg="purple.50" py={12}>
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="white"
        p={10}
        rounded="md"
        shadow="lg"
        maxW="lg"
        w="full"
      >
        <Stack spacing={6}>
          <Heading size="lg" textAlign="center" color="purple.700">
            회원가입
          </Heading>

          {step === 1 ? (
            <>
              <FormControl isRequired>
                <FormLabel>이름</FormLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>이메일</FormLabel>
                <Flex gap={2}>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailAvailable(false);
                      setIsEmailChecked(false);
                    }}
                  />
                  <Button colorScheme="green" onClick={checkEmail}>
                    중복 확인
                  </Button>
                </Flex>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>비밀번호</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>비밀번호 확인</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>

              <Button type="submit" colorScheme="purple" size="lg">
                다음
              </Button>
            </>
          ) : (
            <>
              <Text textAlign="center" fontSize="sm" color="gray.600">
                추천 기사를 위해 아래 정보를 입력해주세요
              </Text>

              <FormControl isRequired>
                <FormLabel>성별</FormLabel>
                <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">선택</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>나이</FormLabel>
                <Input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </FormControl>

              <FormControl>
                <FormLabel>관심 분야 (1개 이상)</FormLabel>
                <Stack spacing={2}>
                  {categories.map((cat) => (
                    <Checkbox
                      key={cat}
                      isChecked={selectedCategories.includes(cat)}
                      onChange={() => {
                        if (selectedCategories.includes(cat)) {
                          setSelectedCategories((prev) => prev.filter((c) => c !== cat));
                        } else {
                          setSelectedCategories((prev) => [...prev, cat]);
                        }
                      }}
                    >
                      {cat}
                    </Checkbox>
                  ))}
                </Stack>
              </FormControl>


              <FormControl isRequired>
                <FormLabel>영어 학습 난이도</FormLabel>
                <RadioGroup value={level} onChange={setLevel}>
                  <Stack direction="row" spacing={4}>
                    {levels.map((lvl) => (
                      <Radio key={lvl} value={lvl} colorScheme="purple">
                        {lvl}
                      </Radio>
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>

              <Flex justify="space-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  이전
                </Button>
                <Button type="submit" colorScheme="purple">
                  가입 완료
                </Button>
              </Flex>
            </>
          )}
        </Stack>
      </Box>
    </Flex>
  );
}
