"use client";

import {
  Box,
  Image,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";
import { API_BASE_URL } from "@/config/env";

interface AdData {
  id: number;
  imageUrl: string;
  linkUrl: string;
  title: string;
}

const DEFAULT_BANNER_IMAGE = "https://placehold.co/160x500?text=Banner+Ad";

export default function AdBanner() {
  const [ad, setAd] = useState<AdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClosed, setIsClosed] = useState(false);
  const [hasViewed, setHasViewed] = useState(false); // ✅ 중복 조회 방지

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/admin/ads`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        const validAds = data.filter(
          (item: any) => item.status === "ACTIVE" && item.type === "BANNER"
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

        setHasViewed(false); // ✅ 새로운 광고에 대해 초기화
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
        const token = localStorage.getItem("token");
        if (!token) return;

        await fetch(`${API_BASE_URL}/admin/ads/${ad.id}/view`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setHasViewed(true); // ✅ 중복 방지
      } catch {
        // silently fail
      }
    };

    increaseViewCount();
  }, [ad, hasViewed]);

  const handleClick = async () => {
    if (!ad) return;

    try {
      const token = localStorage.getItem("token");
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
    setIsClosed(true);
  };

  if (loading || isClosed || !ad) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top="50%"
      right="20px"
      transform="translateY(-50%)"
      w="160px"
      h="500px"
      borderRadius="md"
      overflow="hidden"
      boxShadow="xl"
      zIndex={9999}
      bg="white"
    >
      <IconButton
        aria-label="광고 닫기"
        icon={<CloseIcon />}
        size="sm"
        position="absolute"
        top="4px"
        right="4px"
        zIndex={10}
        onClick={handleClose}
        bg="white"
        _hover={{ bg: "gray.100" }}
      />
      <Box
        w="100%"
        h="100%"
        onClick={handleClick}
        cursor="pointer"
      >
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          fallbackSrc={DEFAULT_BANNER_IMAGE}
          objectFit="cover"
          w="100%"
          h="100%"
        />
      </Box>
    </Box>
  );
}
