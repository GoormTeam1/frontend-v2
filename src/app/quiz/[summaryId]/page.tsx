import QuizPageClient from "./QuizPageClient";
import { use } from "react";

export default function Page({ params }: { params: Promise<{ summaryId: string }> }) {
  const { summaryId } = use(params); // ✅ 서버에서 Promise 언랩
  return <QuizPageClient summaryId={summaryId} />;
}
