import QuizPageClient from "./QuizPageClient";

interface PageProps {
  params: { summaryId: string };  // ✅ 변경됨
}

export default function Page({ params }: PageProps) {
  const { summaryId } = params;
  return <QuizPageClient summaryId={summaryId} />; // ✅ 변경됨
}
