"use client"

import * as React from "react"
import { flushSync } from "react-dom"
import { useTheme } from "@wrksz/themes/client"
import { Moon, Sun } from "@/lib/icons"

import { cn } from "@/lib/utils"

const EASE = "cubic-bezier(.22,1,.36,1)"

type ViewTransitionLike = {
  ready: Promise<void>
  finished?: Promise<void>
  skipTransition?: () => void
}

/**
 * Theme toggle that blooms the incoming theme from the button via an expanding
 * clip-path circle (View Transitions API), falling back to an instant swap when
 * unsupported or when the user prefers reduced motion.
 */
export function ThemeToggleButton({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const vtRef = React.useRef<ViewTransitionLike | null>(null)

  const toggle = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const next = resolvedTheme === "dark" ? "light" : "dark"
      const doc = document as Document & {
        startViewTransition?: (cb: () => void) => ViewTransitionLike
      }
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches
      if (!doc.startViewTransition || reduce) {
        setTheme(next)
        return
      }
      vtRef.current?.skipTransition?.()
      const rect = e.currentTarget.getBoundingClientRect()
      const x = rect.left + rect.width / 2
      const y = rect.top + rect.height / 2
      const r = Math.hypot(
        Math.max(x, innerWidth - x),
        Math.max(y, innerHeight - y),
      )
      const transition = doc.startViewTransition(() =>
        flushSync(() => setTheme(next)),
      )
      vtRef.current = transition
      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${r}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 480,
              easing: EASE,
              pseudoElement: "::view-transition-new(root)",
            },
          )
        })
        .catch(() => {})
      Promise.resolve(transition.finished)
        .catch(() => {})
        .finally(() => {
          if (vtRef.current === transition) vtRef.current = null
        })
    },
    [resolvedTheme, setTheme],
  )

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <Sun className="size-4 dark:hidden" strokeWidth={2} />
      <Moon className="hidden size-4 dark:block" strokeWidth={2} />
    </button>
  )
}
