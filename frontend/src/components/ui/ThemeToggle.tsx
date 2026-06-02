"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evita problemas de hidratación en SSR
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10" />
    );
  }

  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 active:scale-95 text-white transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-secondary-container"
      aria-label="Alternar tema"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400 rotate-0 scale-100 transition-all duration-500" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-300 rotate-0 scale-100 transition-all duration-500" />
        )}
      </div>
    </button>
  );
}
