"use client";

import {
  Box, Heading, Text, Input, Button, VStack, Image,
  useToast, Spinner, HStack, Select
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/env";

interface AdItem {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  description: string;
  status: "ACTIVE" | "DEACTIVE";
  startDate: string;
  endDate: string;
  orderer: string;
  viewCount: number;
  clickCount: number;
}

export default function AdminPage() {
  const toast = useToast();
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [mounted, setMounted] = useState(false);

  const [newAd, setNewAd] = useState<Omit<AdItem, "id" | "viewCount" | "clickCount">>({
    title: "",
    imageUrl: "",
    linkUrl: "",
    description: "",
    status: "ACTIVE",
    startDate: "2025-05-13 00:00:00",
    endDate: "2025-05-20 23:59:59",
    orderer: ""
  });

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchAds();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAds = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) throw new Error("토큰 없음");

      const res = await fetch(`${API_BASE_URL}/admin/ads`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("광고 조회 실패");

      const data = await res.json();
      setAds(data);
    } catch {
      toast({ title: "광고 불러오기 실패", status: "error" });
    } finally {
      setLoading(false);
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
        body: JSON.stringify({ ...newAd, viewCount: 0, clickCount: 0 })
      });

      if (!res.ok) throw new Error("광고 등록 실패");
      toast({ title: "광고 등록 완료", status: "success" });
      fetchAds();
    } catch {
      toast({ title: "광고 등록 실패", status: "error" });
    }
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
      if (!accessToken) throw new Error("accessToken이 응답에 없습니다.");

      localStorage.setItem("admin_token", accessToken);
      setIsAuthenticated(true);
      toast({ title: "로그인 성공", status: "success" });
      fetchAds();
    } catch (err: any) {
      toast({ title: "로그인 실패", description: err.message, status: "error" });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    setAds([]);
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

      {loading ? (
        <Box textAlign="center" mt={20}><Spinner size="xl" /></Box>
      ) : (
        <>
          <VStack spacing={4} align="stretch">
            <Heading size="md">신규 광고 등록</Heading>
            <Input placeholder="제목" value={newAd.title} onChange={(e) => setNewAd({ ...newAd, title: e.target.value })} />
            <Input placeholder="광고 이미지 URL" value={newAd.imageUrl} onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })} />
            <Input placeholder="광고 링크 URL" value={newAd.linkUrl} onChange={(e) => setNewAd({ ...newAd, linkUrl: e.target.value })} />
            <Input placeholder="광고 설명" value={newAd.description} onChange={(e) => setNewAd({ ...newAd, description: e.target.value })} />
            <Input placeholder="광고주" value={newAd.orderer} onChange={(e) => setNewAd({ ...newAd, orderer: e.target.value })} />
            <Select value={newAd.status} onChange={(e) => setNewAd({ ...newAd, status: e.target.value as "ACTIVE" | "DEACTIVE" })}>
              <option value="ACTIVE">ACTIVE</option>
              <option value="DEACTIVE">DEACTIVE</option>
            </Select>
            <Button colorScheme="purple" onClick={handleAddAd}>광고 추가</Button>
          </VStack>

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
                    <Text fontSize="sm">광고주: {ad.orderer}</Text>
                    <Text fontSize="sm">조회수: {ad.viewCount} / 클릭수: {ad.clickCount}</Text>
                  </Box>
                  <Image src={ad.imageUrl} alt="광고 이미지" boxSize="120px" objectFit="cover" borderRadius="md" />
                </HStack>
                <HStack mt={3}>
                  <Button size="sm" colorScheme="blue">수정</Button>
                  <Button size="sm" colorScheme="red" onClick={() => handleDeleteAd(ad.id)}>삭제</Button>
                </HStack>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
