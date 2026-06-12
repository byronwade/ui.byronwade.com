import Link from "next/link"
import { ArrowLeft, ArrowRight } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { guides, type Guide } from "@/content/guides"

function PagerCard({ guide, dir }: { guide: Guide; dir: "prev" | "next" }) {
  const isNext = dir === "next"
  return (
    <Link
      href={guide.href}
      className={cn(
        "edge group flex flex-col gap-1 overflow-hidden rounded-xl bg-card p-4 transition-colors hover:bg-accent/50",
        isNext && "items-start sm:items-end sm:text-right",
      )}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1.5 font-mono text-[11px] tracking-wider text-muted-foreground uppercase",
          isNext && "sm:flex-row-reverse",
        )}
      >
        {isNext ? (
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        ) : (
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
        )}
        {isNext ? "Next" : "Previous"}
      </span>
      <span className="text-sm font-medium text-foreground">{guide.label}</span>
      <span className="line-clamp-2 text-[13px] text-muted-foreground">
        {guide.description}
      </span>
    </Link>
  )
}

/**
 * Sequential Previous / Next footer for the Get Started guides, derived from the
 * canonical `guides` order so every page links to its real neighbours — no more
 * hand-maintained per-page footers. Pass the current page's href or slug.
 */
export function GuidePager({ current }: { current: string }) {
  const i = guides.findIndex((g) => g.href === current || g.slug === current)
  const prev = i > 0 ? guides[i - 1] : null
  const next = i >= 0 && i < guides.length - 1 ? guides[i + 1] : null
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Guide pagination"
      className="mt-12 grid gap-3 border-t border-border pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <PagerCard guide={prev} dir="prev" />
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? <PagerCard guide={next} dir="next" /> : null}
    </nav>
  )
}
