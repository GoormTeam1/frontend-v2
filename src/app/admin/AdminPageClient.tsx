"use client";

import {
  Box, Heading, Text, Input, Button, VStack, Image,
  useToast, Spinner, HStack, Select,
  Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalFooter, ModalBody, ModalCloseButton, useDisclosure
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/env";

interface AdItem {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  description: string;
  status: "ACTIVE" | "DEACTIVE";
  type: "QUIZ_END" | "BANNER" | null;
  startDate: string;
  endDate: string;
  orderer: string;
  viewCount: number;
  clickCount: number;
}

export default function AdminPageClient() {
  const toast = useToast();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [mounted, setMounted] = useState(false);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);

  const [newAd, setNewAd] = useState<Omit<AdItem, "id" | "viewCount" | "clickCount">>({
    title: "",
    imageUrl: "",
    linkUrl: "",
    description: "",
    status: "ACTIVE",
    type: "QUIZ_END",
    startDate: "2025-05-13 00:00:00",
    endDate: "2025-05-20 23:59:59",
    orderer: ""
  });

  const fetchAds = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("토큰 없음");

      const res = await fetch(`${API_BASE_URL}/admin/ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("광고 조회 실패");

      const data = await res.json();
      setAds(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "알 수 없는 오류";
      toast({ title: "광고 불러오기 실패", description: message, status: "error" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchAds();
    } else {
      setLoading(false);
    }
  }, [fetchAds]);

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: id, password: pw }),
      });

      if (!res.ok) throw new Error("로그인 실패");

      const data = await res.json();
      const accessToken = data?.data?.accessToken;
      if (!accessToken) throw new Error("accessToken 없음");

      localStorage.setItem("admin_token", accessToken);
      setIsAuthenticated(true);
      toast({ title: "로그인 성공", status: "success" });
      fetchAds();
    } catch (error: unknown) {
      toast({
        title: "로그인 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류",
        status: "error",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setAds([]);
  };

  const handleDeleteAd = async (id: number) => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("토큰 없음");

      await fetch(`${API_BASE_URL}/admin/ads/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      toast({ title: "광고 삭제 완료", status: "info" });
      fetchAds();
    } catch {
      toast({ title: "삭제 실패", status: "error" });
    }
  };

  const handleEditClick = (ad: AdItem) => {
    setEditTargetId(ad.id);
    setNewAd({
      title: ad.title,
      imageUrl: ad.imageUrl,
      linkUrl: ad.linkUrl,
      description: ad.description,
      status: ad.status,
      type: ad.type ?? "QUIZ_END",
      startDate: ad.startDate,
      endDate: ad.endDate,
      orderer: ad.orderer
    });
    onEditOpen();
  };

  const handleUpdateAd = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token || !editTargetId) throw new Error("잘못된 요청");

      const res = await fetch(`${API_BASE_URL}/admin/ads/${editTargetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAd),
      });

      if (!res.ok) throw new Error("수정 실패");

      toast({ title: "광고 수정 완료", status: "success" });
      fetchAds();
      onEditClose();
    } catch {
      toast({ title: "수정 실패", status: "error" });
    }
  };

  const handleAddAd = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("토큰 없음");

      const res = await fetch(`${API_BASE_URL}/admin/ads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newAd, viewCount: 0, clickCount: 0 }),
      });

      if (!res.ok) throw new Error("등록 실패");

      toast({ title: "광고 등록 완료", status: "success" });
      fetchAds();
      setNewAd({
        title: "",
        imageUrl: "",
        linkUrl: "",
        description: "",
        status: "ACTIVE",
        type: "QUIZ_END",
        startDate: "2025-05-13 00:00:00",
        endDate: "2025-05-20 23:59:59",
        orderer: ""
      });
      onAddClose();
    } catch {
      toast({ title: "광고 등록 실패", status: "error" });
    }
  };

  if (!mounted) return null;

  if (!isAuthenticated) {
    return (
      <Box maxW="400px" mx="auto" mt={20} p={6}>
        <Heading mb={6}>🔐 관리자 로그인</Heading>
        <VStack spacing={4}>
          <Input placeholder="이메일" value={id} onChange={(e) => setId(e.target.value)} />
          <Input placeholder="비밀번호" type="password" value={pw} onChange={(e) => setPw(e.target.value)} />
          <Button colorScheme="purple" width="100%" onClick={handleLogin}>로그인</Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box maxW="800px" mx="auto" mt={10} p={6}>
      <Heading mb={6}>📢 광고 관리</Heading>
      <Button onClick={handleLogout} size="sm" colorScheme="gray" mb={4}>로그아웃</Button>

      <Box mb={8}>
        <Button colorScheme="purple" onClick={onAddOpen} width="100%" size="lg" fontSize="lg" py={6}>
          광고 추가
        </Button>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={20}><Spinner size="xl" /></Box>
      ) : (
        <Box mt={10}>
          <Heading size="md" mb={4}>등록된 광고</Heading>
          {ads.map((ad) => (
            <Box key={ad.id} p={4} borderWidth="1px" borderRadius="md" mb={4}>
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight="bold">{ad.title}</Text>
                  <Text fontSize="sm" color="gray.500">{ad.description}</Text>
                  <Text fontSize="sm">기간: {ad.startDate} ~ {ad.endDate}</Text>
                  <Text fontSize="sm">상태: {ad.status}</Text>
                  <Text fontSize="sm">타입: {ad.type ?? "미지정"}</Text>
                  <Text fontSize="sm">광고주: {ad.orderer}</Text>
                  <Text fontSize="sm">조회수: {ad.viewCount} / 클릭수: {ad.clickCount}</Text>
                </Box>
                <Image src={ad.imageUrl} alt="광고 이미지" boxSize="120px" objectFit="cover" borderRadius="md" />
              </HStack>
              <HStack mt={3}>
                <Button size="sm" colorScheme="blue" onClick={() => handleEditClick(ad)}>수정</Button>
                <Button size="sm" colorScheme="red" onClick={() => handleDeleteAd(ad.id)}>삭제</Button>
              </HStack>
            </Box>
          ))}
        </Box>
      )}

      {[{ isOpen: isAddOpen, onClose: onAddClose, onSave: handleAddAd, title: "신규 광고 등록" },
        { isOpen: isEditOpen, onClose: onEditClose, onSave: handleUpdateAd, title: "광고 수정" }]
        .map(({ isOpen, onClose, onSave, title }) => (
        <Modal key={title} isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Input placeholder="제목" value={newAd.title} onChange={(e) => setNewAd({ ...newAd, title: e.target.value })} />
                <Input placeholder="이미지 URL" value={newAd.imageUrl} onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })} />
                <Input placeholder="링크 URL" value={newAd.linkUrl} onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })} />
                <Input placeholder="설명" value={newAd.description} onChange={(e) => setNewAd({ ...newAd, description: e.target.value })} />
                <Input placeholder="광고주" value={newAd.orderer} onChange={(e) => setNewAd({ ...newAd, orderer: e.target.value })} />
                <Input placeholder="시작일시" value={newAd.startDate} onChange={(e) => setNewAd({ ...newAd, startDate: e.target.value })} />
                <Input placeholder="종료일시" value={newAd.endDate} onChange={(e) => setNewAd({ ...newAd, endDate: e.target.value })} />
                <Select value={newAd.status} onChange={(e) => setNewAd({ ...newAd, status: e.target.value as "ACTIVE" | "DEACTIVE" })}>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="DEACTIVE">DEACTIVE</option>
                </Select>
                <Select value={newAd.type ?? "QUIZ_END"} onChange={(e) => setNewAd({ ...newAd, type: e.target.value as "QUIZ_END" | "BANNER" })}>
                  <option value="QUIZ_END">QUIZ_END</option>
                  <option value="BANNER">BANNER</option>
                </Select>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="purple" mr={3} onClick={onSave}>저장</Button>
              <Button variant="ghost" onClick={onClose}>닫기</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ))}
    </Box>
  );
}
