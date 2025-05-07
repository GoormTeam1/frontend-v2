import "../styles/globals.css";
import { Inter } from "next/font/google";
//import Header from "../components/Header";
//import Footer from "../components/Footer";
import Providers from "../components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "NeWordS",
  description: "영문 뉴스 기반 AI 영어 학습 웹 애플리케이션",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
