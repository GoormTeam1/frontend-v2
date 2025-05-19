
import QuizPageClient from "./QuizPageClient";

export default function Page({ params }: { params: { summaryId: string } }) {
  return <QuizPageClient summaryId={params.summaryId} />;
}
