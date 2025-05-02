// src/app/news/[id]/page.tsx

interface NewsDetailPageProps {
    params: { id: string };
  }
  
  export default function NewsDetailPage({ params }: NewsDetailPageProps) {
    const { id } = params;
  
    // 🔧 mock 데이터 (id: 9999999999999999)
    const mockData = {
      id: "9999999999999999",
      title: "제목이 들어올거에요",
      press: "언론사 이름이 들어올거에요",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=800&h=400",
      content: `기사 본문이 들어올거에요`,
    };
  
    const data = id === "9999999999999999" ? mockData : null;
  
    if (!data) {
      return (
        <main className="max-w-3xl mx-auto py-20 px-4 text-center text-gray-600">
          <p>해당 기사를 찾을 수 없습니다.</p>
        </main>
      );
    }
  
    return (
      <main className="max-w-3xl mx-auto py-20 px-4">
        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <p className="text-sm text-gray-500 mb-2">{data.press}</p>
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-auto mb-6 rounded-md shadow"
        />
        <article className="text-base leading-relaxed whitespace-pre-line text-gray-800">
          {data.content}
        </article>
      </main>
    );
  }
  