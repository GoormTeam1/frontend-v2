// app/quiz/[newsId]/page.tsx
import QuizPageClient from "./QuizPageClient";

interface PageProps {
  params: { newsId: string };
}

export default function Page({ params }: PageProps) {
  return <QuizPageClient newsId={params.newsId} />;
}
