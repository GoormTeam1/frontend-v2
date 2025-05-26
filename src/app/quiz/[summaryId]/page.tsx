import QuizPageClient from "./QuizPageClient";
import { use } from "react";

// Next.js 15 App Router에서는 params가 Promise로 들어옴
export default function Page({ params }: { params: Promise<{ summaryId: string }> }) {
  const { summaryId } = use(params); // 👈 Promise 언랩
  return <QuizPageClient summaryId={summaryId} />;
}
