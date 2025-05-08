// app/quiz/[newsId]/page.tsx

import QuizPageClient from "./QuizPageClient";

interface PageProps {
  params: { newsId: string };
}

// ✅ async 함수로 수정
export default async function Page({ params }: PageProps) {
  const { newsId } = params;
  return <QuizPageClient newsId={newsId} />;
}
