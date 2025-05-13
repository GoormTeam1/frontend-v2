"use client"; 

import dynamic from "next/dynamic";

// 클라이언트 컴포넌트 동적 import
const LoginPageClient = dynamic(() => import("./LoginPageClient"), {
  ssr: false,
});

export default function Page() {
  return <LoginPageClient />;
}
