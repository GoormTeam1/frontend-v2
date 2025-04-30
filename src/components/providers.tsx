'use client';

import { ChakraProvider } from "@chakra-ui/react";
import type { ChakraProviderProps } from "@chakra-ui/react"; // 명확하게 경로 지정
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <ChakraProvider>{children}</ChakraProvider>;
}
