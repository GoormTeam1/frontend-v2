"use client";

import {
  Box,
  Button,
  Image,
  Text,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/env";

interface AdData {
  id: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

interface InterstitialAdProps {
  onClose: () => void;
}

export default function InterstitialAd({ onClose }: InterstitialAdProps) {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasViewed, setHasViewed] = useState(false); // ✅ 조회수 중복 방지

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/admin/ads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("광고 데이터 조회 실패");

        const data = await res.json();

        const validAds = data.filter(
          (item: any) => item.status === "ACTIVE" && item.type === "QUIZ_END"
        );
        if (validAds.length === 0) return;

        const randomIndex = Math.floor(Math.random() * validAds.length);
        const selected = validAds[randomIndex];

        setAd({
          id: selected.id,
          imageUrl: selected.imageUrl,
          linkUrl: selected.linkUrl,
          title: selected.title,
        });

        setHasViewed(false); // ✅ 새로운 광고 들어올 때 초기화
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, []);

  // ✅ ad가 설정되고 hasViewed === false일 때만 조회수 증가
  useEffect(() => {
    const increaseViewCount = async () => {
      if (!ad || hasViewed) return;

      try {
        const token = localStorage.getItem("admin_token");
        if (!token) return;

        await fetch(`${API_BASE_URL}/admin/ads/${ad.id}/view`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasViewed(true);
      } catch {
        // silently fail
      }
    };

    increaseViewCount();
  }, [ad, hasViewed]);

  useEffect(() => {
    if (!ad) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          setCanClose(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [ad]);

  const handleAdClick = async () => {
    if (!ad) return;

    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;

      await fetch(`${API_BASE_URL}/admin/ads/${ad.id}/click`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // silently fail
    }

    window.open(ad.linkUrl, "_blank");
  };

  const handleClose = () => {
    setAd(null);
    onClose();
  };

  if (loading) {
    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        width="100vw"
        height="100vh"
        bg="rgba(0, 0, 0, 0.6)"
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="white" />
      </Box>
    );
  }

  if (!ad) return null;

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bg="rgba(0, 0, 0, 0.6)"
      zIndex={9999}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg="white"
        borderRadius="lg"
        p={6}
        maxW="400px"
        textAlign="center"
        boxShadow="2xl"
      >
        <Text fontSize="lg" mb={2}>광고를 시청해 주세요</Text>
        <Text fontSize="sm" color="gray.500" mb={4}>
          {secondsLeft > 0
            ? `${secondsLeft}초 후에 닫을 수 있습니다`
            : "이제 닫을 수 있습니다"}
        </Text>

        <Image
          src={ad.imageUrl}
          alt={ad.title}
          maxH="300px"
          objectFit="contain"
          mx="auto"
          mb={4}
          borderRadius="md"
        />

        <VStack spacing={3}>
          <Button
            colorScheme="purple"
            onClick={handleAdClick}
            isDisabled={!canClose}
          >
            광고 페이지로 이동
          </Button>
          <Button
            variant="outline"
            onClick={handleClose}
            isDisabled={!canClose}
          >
            닫기
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
