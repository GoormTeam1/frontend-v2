import { Box, VStack, Text, Heading, Badge, HStack, Button, Input, Select, useToast, Grid, GridItem, Checkbox, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";

interface UserProfileProps {
  name: string;
  email: string;
  gender: string;
  birthDate: string;
  interests: string[];
  englishLevel: "상" | "중" | "하";
  onUpdate?: (data: Omit<UserProfileProps, "onUpdate">) => void;
}

const INTEREST_OPTIONS = [
  "US", "World", "Pollitics", "Business", "Heallth", "Entertainment", "Style", "Travel", "Sports", "Science", "Climate", "Weather"
];


const UserProfile = ({
  name: initialName,
  email: initialEmail,
  gender: initialGender,
  birthDate: initialBirthDate,
  interests: initialInterests,
  englishLevel: initialEnglishLevel,
  onUpdate,
}: UserProfileProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [gender, setGender] = useState(initialGender);
  const [birthDate, setBirthDate] = useState(initialBirthDate);
  const [interests, setInterests] = useState(initialInterests);
  const [englishLevel, setEnglishLevel] = useState(initialEnglishLevel);
  const toast = useToast();

  const handleInterestChange = (interest: string) => {
    setInterests(prev => {
      if (prev.includes(interest)) {
        // 최소 1개는 선택되어야 함
        if (prev.length === 1) {
          toast({
            title: "최소 1개의 관심분야를 선택해야 합니다.",
            status: "warning",
            duration: 2000,
            isClosable: true,
          });
          return prev;
        }
        return prev.filter(i => i !== interest);
      }
      return [...prev, interest];
    });
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        name,
        email,
        gender,
        birthDate,
        interests,
        englishLevel,
      });
      toast({
        title: "프로필이 업데이트되었습니다.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(initialName);
    setEmail(initialEmail);
    setGender(initialGender);
    setBirthDate(initialBirthDate);
    setInterests(initialInterests);
    setEnglishLevel(initialEnglishLevel);
    setIsEditing(false);
  };

  return (
    <Box
      mt={10}
      p={8}
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      maxW="900px"
      mx="auto"
    >
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between" align="center">
          <Box>
            <Heading size="lg">반가워요 {name}님! </Heading>
            <Text fontSize="sm" color="gray.500"> {email}</Text> 
          </Box>
          {!isEditing ? (
            <Button colorScheme="gray" onClick={() => setIsEditing(true)}>
              수정하기
            </Button>
          ) : (
            <HStack>
              <Button colorScheme="purple" onClick={handleSave}>
                저장
              </Button>
              <Button onClick={handleCancel}>
                취소
              </Button>
            </HStack>
          )}
        </HStack>

        <Grid templateColumns="repeat(2, 1fr)" gap={8}>
          {/* 관심 분야 섹션 */}
          <GridItem
            colSpan={{ base: 2, md: 1 }}
            bg="purple.50"
            p={6}
            borderRadius="lg"
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md" color="purple.700">
                관심 분야
              </Heading>
              {isEditing ? (
                <SimpleGrid columns={2} spacing={3}>
                  {INTEREST_OPTIONS.map((interest) => (
                    <Checkbox
                      key={interest}
                      isChecked={interests.includes(interest)}
                      onChange={() => handleInterestChange(interest)}
                      colorScheme="purple"
                      size="lg"
                    >
                      {interest}
                    </Checkbox>
                  ))}
                </SimpleGrid>
              ) : (
                <HStack spacing={2} flexWrap="wrap">
                  {interests.map((interest) => (
                    <Badge
                      key={interest}
                      colorScheme="purple"
                      fontSize="md"
                      px={3}
                      py={1}
                    >
                      {interest}
                    </Badge>
                  ))}
                </HStack>
              )}
            </VStack>
          </GridItem>

          {/* 영어 학습 난이도 섹션 */}
          <GridItem
            colSpan={{ base: 2, md: 1 }}
            bg="blue.50"
            p={6}
            borderRadius="lg"
          >
            <VStack align="stretch" spacing={4}>
              <Heading size="md" color="blue.700">
                영어 학습 난이도
              </Heading>
              {isEditing ? (
                <Select
                  value={englishLevel}
                  onChange={(e) => setEnglishLevel(e.target.value as "상" | "중" | "하")}
                >
                  <option value="상">상</option>
                  <option value="중">중</option>
                  <option value="하">하</option>
                </Select>
              ) : (
                <Badge
                  colorScheme={
                    englishLevel === "상"
                      ? "red"
                      : englishLevel === "중"
                      ? "yellow"
                      : "green"
                  }
                  fontSize="xl"
                  px={4}
                  py={2}
                  textAlign="center"
                >
                  {englishLevel}
                </Badge>
              )}
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Box>
  );
};

export default UserProfile; 