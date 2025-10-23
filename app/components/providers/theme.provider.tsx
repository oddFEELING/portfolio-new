import type React from "react";
import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

// ~ ======= Types ======= ~
export type Theme = "light" | "dark" | "system";

export type ThemeProvider = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

// ~ ======= Zustand store ======= ~
export const useTheme = create<ThemeProvider>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "bellefull-theme",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// ~ ======= Props ======= ~
type ThemeProviderProps = {
  children: React.ReactNode;
};

// ~ ======= Provider ======= ~
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
