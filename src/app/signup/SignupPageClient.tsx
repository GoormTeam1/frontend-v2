"use client";

import {
  Box, Button, Checkbox, Flex, FormControl, FormLabel, Heading,
  Input, Radio, RadioGroup, Stack, Text, useToast, Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Footer from "../../components/Footer";
import { API_BASE_URL } from "@/config/env";

const categoryOptions = [
  { label: "경제", value: "business" },
  { label: "문화", value: "entertainment" },
  { label: "과학", value: "science" },
  { label: "세계", value: "world" },
  { label: "정치", value: "politics" },
  { label: "건강", value: "health" },
  { label: "기후", value: "climate" },
  { label: "날씨", value: "weather" },
  { label: "여행", value: "travel" },
  { label: "스타일", value: "style" },
  { label: "스포츠", value: "sports" },
  { label: "미국", value: "us" },
];

const levels = ["상", "중", "하"];

export default function SignupPageClient() {
  const router = useRouter();
  const toast = useToast();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [level, setLevel] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);

  const isValidPassword = (pw: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+~]).{8,}$/.test(pw);

  const checkEmail = async () => {
    if (!email) {
      toast({ title: "이메일을 입력해주세요.", status: "warning" });
      return;
    }

    if (email === "test@used.com") {
      setIsEmailAvailable(false);
      setIsEmailChecked(false);
      toast({ title: "❌ 이미 사용 중인 이메일입니다.", status: "error" });
    } else {
      setIsEmailAvailable(true);
      setIsEmailChecked(true);
      toast({ title: "✅ 사용 가능한 이메일입니다.", status: "success" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (!name || !email || !password || !confirmPassword) {
        toast({ title: "모든 항목을 입력해주세요.", status: "warning" });
        return;
      }
      if (!isEmailChecked || !isEmailAvailable) {
        toast({ title: "이메일 중복 확인을 해주세요.", status: "warning" });
        return;
      }
      if (!isValidPassword(password)) {
        toast({ title: "비밀번호 조건 불충족", description: "영문+숫자+특수문자 포함, 8자 이상", status: "warning" });
        return;
      }
      if (password !== confirmPassword) {
        toast({ title: "비밀번호 불일치", status: "error" });
        return;
      }
      setStep(2);
    } else {
      if (!gender || !birthDate || !level || selectedCategories.length === 0) {
        toast({ title: "모든 항목을 입력해주세요.", status: "warning" });
        return;
      }

      try {
        const payload = {
          email,
          password,
          username: name,
          gender, // "남자" 또는 "여자"
          level,
          birthDate: new Date(birthDate).toISOString(),
          categoryList: selectedCategories,
        };

        console.log("✅ 회원가입 payload:", payload);

        await axios.post(`${API_BASE_URL}/api/user/signup`, payload, {
          headers: { "Content-Type": "application/json" },
        });

        toast({ title: "회원가입 완료!", status: "success" });
        setTimeout(() => router.push("/login"), 2000);
      } catch (err: any) {
        const msg = err.response?.data?.message || "회원가입 중 오류 발생";
        toast({ title: "회원가입 실패", description: msg, status: "error" });
      }
    }
  };

  return (
    <Box minH="100vh" bg="purple.50" display="flex" flexDirection="column">
      <Flex flex="1" justify="center" align="center" py={12}>
        <Box as="form" onSubmit={handleSubmit} bg="white" p={10} rounded="md" shadow="lg" maxW="lg" w="full">
          <Stack spacing={6}>
            <Heading size="lg" textAlign="center" color="purple.700">회원가입</Heading>

            {step === 1 ? (
              <>
                <FormControl isRequired><FormLabel>이름</FormLabel>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </FormControl>
                <FormControl isRequired><FormLabel>이메일</FormLabel>
                  <Flex gap={2}>
                    <Input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setIsEmailChecked(false); setIsEmailAvailable(false); }} />
                    <Button colorScheme="green" onClick={checkEmail}>중복 확인</Button>
                  </Flex>
                </FormControl>
                <FormControl isRequired><FormLabel>비밀번호</FormLabel>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </FormControl>
                <FormControl isRequired><FormLabel>비밀번호 확인</FormLabel>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </FormControl>
                <Button type="submit" colorScheme="purple" size="lg">다음</Button>
              </>
            ) : (
              <>
                <Text textAlign="center" fontSize="sm" color="gray.600">추천 기사를 위해 아래 정보를 입력해주세요</Text>
                <FormControl isRequired><FormLabel>성별</FormLabel>
                  <Select value={gender} onChange={(e) => setGender(e.target.value)}>
                    <option value="">선택</option>
                    <option value="남자">남자</option>
                    <option value="여자">여자</option>
                  </Select>
                </FormControl>
                <FormControl isRequired><FormLabel>생년월일</FormLabel>
                  <Input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </FormControl>
                <FormControl><FormLabel>관심 분야 (1개 이상)</FormLabel>
                  <Stack spacing={2}>
                    {categoryOptions.map((cat) => (
                      <Checkbox
                        key={cat.value}
                        isChecked={selectedCategories.includes(cat.value)}
                        onChange={() =>
                          setSelectedCategories((prev) =>
                            prev.includes(cat.value)
                              ? prev.filter((c) => c !== cat.value)
                              : [...prev, cat.value]
                          )
                        }
                      >
                        {cat.label}
                      </Checkbox>
                    ))}
                  </Stack>
                </FormControl>
                <FormControl isRequired><FormLabel>영어 학습 난이도</FormLabel>
                  <RadioGroup value={level} onChange={setLevel}>
                    <Stack direction="row" spacing={4}>
                      {levels.map((lvl) => (
                        <Radio key={lvl} value={lvl} colorScheme="purple">{lvl}</Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>
                <Flex justify="space-between">
                  <Button variant="outline" onClick={() => setStep(1)}>이전</Button>
                  <Button type="submit" colorScheme="purple">가입 완료</Button>
                </Flex>
              </>
            )}
          </Stack>
        </Box>
      </Flex>
      <Footer />
    </Box>
  );
}
