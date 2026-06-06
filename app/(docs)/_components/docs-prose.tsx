import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type DocsProseProps = {
  children: ReactNode
  className?: string
  /** Docs lane (sans) or essay lane (serif). @default "ui" */
  variant?: "ui" | "prose"
}

/** Narrative body copy — 65ch reading lane with full in-flow typography. */
export function DocsProse({
  children,
  className,
  variant = "ui",
}: DocsProseProps) {
  return (
    <div
      className={cn(
        variant === "prose" ? "reading-prose" : "reading-ui",
        "text-foreground",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Hero subhead under an h1 — one readable paragraph at 16px. */
export function DocsIntro({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn("reading-ui mt-4 text-foreground text-pretty", className)}>
      {children}
    </p>
  )
}

/** Lead paragraph — slightly larger opener inside a reading lane. */
export function DocsLead({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn("reading-lead text-foreground", className)}>{children}</p>
  )
}

/** Full-width demo band — separates reading measure from wide previews. */
export function DocsDemoSection({
  children,
  className,
  label,
}: {
  children: ReactNode
  className?: string
  label?: ReactNode
}) {
  return (
    <section
      className={cn("reading-demo-break max-w-none space-y-6", className)}
    >
      {label}
      {children}
    </section>
  )
}
