"use client"

import { Moon, Sun } from "@/lib/icons"
import { useTheme } from "@wrksz/themes/client"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex size-9 items-center justify-center rounded-full edge text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </button>
  )
}
