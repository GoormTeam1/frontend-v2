// app/news/[newsId]/page.tsx
import NewsDetailPageClient from "./NewsDetailPageClient";

interface PageProps {
  // Next.js 15부터 params가 Promise로 감싸여 옵니다.
  params: Promise<{ newsId: string }>;
}

export default async function Page({ params }: PageProps) {
  // 반드시 await로 풀어서 사용해야 경고가 사라집니다.
  const { newsId } = await params;
  return <NewsDetailPageClient newsId={newsId} />;
}
