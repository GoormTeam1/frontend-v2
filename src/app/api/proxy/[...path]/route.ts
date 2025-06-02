import { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode"; // ✅ 명시적 구조 분해 import

const BACKEND_BASE_URL = "http://10.0.2.225:8080";

// 토큰에서 이메일 추출
function getEmailFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = jwtDecode<{ sub: string }>(token);
    return payload.sub || null;
  } catch (err) {
    console.error("[✗] 토큰 디코딩 실패:", err);
    return null;
  }
}

// 공통 요청 핸들링 함수
async function handleRequest(
  req: NextRequest,
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE",
  params: { path: string[] }
) {
  const url = `${BACKEND_BASE_URL}/${params.path.join("/")}${req.nextUrl.search}`;
  const headers = new Headers();

  req.headers.forEach((value, key) => {
    headers.set(key, value);
  });

  // Authorization → X-User-Email
  const rawAuth = req.headers.get("authorization");
  const token = rawAuth?.startsWith("Bearer ") ? rawAuth.replace("Bearer ", "") : null;
  const email = getEmailFromToken(token);
  if (email) {
    headers.set("X-User-Email", email);
  }

  const body =
    ["POST", "PATCH", "PUT", "DELETE"].includes(method) ? await req.text() : undefined;

  console.log(`[${method}] 요청 URL:`, url);
  console.log(`[${method}] 요청 헤더:`, Object.fromEntries(headers.entries()));
  if (body) console.log(`[${method}] 요청 본문:`, body);

  try {
    const res = await fetch(url, {
      method,
      headers,
      body,
    });

    const resText = await res.text();

    console.log(`[${method}] 응답 상태코드:`, res.status);
    console.log(`[${method}] 응답 본문:`, resText);

    return new Response(resText, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "text/plain",
      },
    });
  } catch (err) {
    console.error(`[${method}] 프록시 처리 실패:`, err);
    return new Response(JSON.stringify({ message: "프록시 요청 실패" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// 각 HTTP 메서드별 export
export async function GET(req: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(req, "GET", context.params);
}
export async function POST(req: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(req, "POST", context.params);
}
export async function PATCH(req: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(req, "PATCH", context.params);
}
export async function PUT(req: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(req, "PUT", context.params);
}
export async function DELETE(req: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(req, "DELETE", context.params);
}
