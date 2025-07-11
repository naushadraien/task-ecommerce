"use client";

import type React from "react";

import { ThemeProvider } from "next-themes";
import TanstackProvider from "./tanstack-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TanstackProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </TanstackProvider>
  );
}
