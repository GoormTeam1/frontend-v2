"use client";

import {
  Box,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";

export default function AdBanner() {
  const [visible, setVisible] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedVisible = localStorage.getItem("ad_visible");
    const shouldShow = storedVisible === "true";
    const storedImage = localStorage.getItem("ad_image_url");
    const storedLink = localStorage.getItem("ad_link_url");

    setIsEnabled(shouldShow);
    setImageUrl(storedImage);
    setLinkUrl(storedLink);
  }, []);

  if (!isEnabled || !visible || !imageUrl) return null;

  return (
    <Box
      position="fixed"
      right="24px"
      top="160px"
      width="160px"
      height="500px"
      bg="white"
      boxShadow="lg"
      borderRadius="md"
      zIndex={999}
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      <IconButton
        aria-label="배너 닫기"
        icon={<CloseIcon />}
        size="xs"
        position="absolute"
        top="6px"
        right="6px"
        onClick={() => setVisible(false)}
        zIndex={1000}
      />

      <a href={linkUrl || "#"} target="_blank" rel="noopener noreferrer" style={{ display: "block", height: "100%" }}>
        <Image
          src={imageUrl}
          alt="광고 배너"
          width="100%"
          height="100%"
          objectFit="cover"
        />
      </a>
    </Box>
  );
}
