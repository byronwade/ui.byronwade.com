"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@/lib/icons";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/**
 * The server has no theme to resolve, so the icon and label are only correct
 * after mount. Rendering the resolved state during SSR hydrates mismatched
 * markup — React logs it and, more visibly, leaves the wrong icon in the
 * header until the next paint.
 */
const noopSubscribe = () => () => {};

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  /* false on the server and on the hydrating render, true afterwards. */
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );

  const dark = mounted && resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={
        mounted
          ? dark
            ? "Switch to light mode"
            : "Switch to dark mode"
          : "Toggle theme"
      }
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

export { ThemeToggle };
