"use client";

import { SessionProvider } from "next-auth/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { StatsPreferencesProvider } from "@/hooks/useStatsPreferences";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <StatsPreferencesProvider>
            {children}
          </StatsPreferencesProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </SessionProvider>
  );
}
