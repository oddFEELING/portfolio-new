import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type React from "react";
import { Toaster } from "../ui/sonner";

// ~ ======= Providers ======= ~
import NuqsProvider from "./nuqs.provider";
import { PostHogProvider } from "./posthog.provider";
import QueryProvider from "./query.provider";
import ThemeProvider from "./theme.provider";

type AppProviderProps = {
  children: React.ReactNode;
};

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <PostHogProvider>
    <NuqsProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster closeButton position="top-right" richColors />
        </ThemeProvider>
      </QueryProvider>
    </NuqsProvider>
  </PostHogProvider>
);

export default AppProvider;
