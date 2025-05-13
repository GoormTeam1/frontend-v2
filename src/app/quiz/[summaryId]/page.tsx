'use client';

import { use } from 'react';
import QuizPageClient from './QuizPageClient';

export default function Page(props: { params: Promise<{ summaryId: string }> }) {
  const { summaryId } = use(props.params);  // ✅ Promise 해제

  return <QuizPageClient summaryId={summaryId} />;
}
