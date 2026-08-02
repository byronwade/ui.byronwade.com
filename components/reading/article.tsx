import { type ReactNode } from "react"
import { cn } from "@/lib/utils"

type ReadingLane = "ui" | "prose"

type ReadingArticleProps = {
  lane?: ReadingLane
  children: ReactNode
  className?: string
  /** Optional kicker above the title */
  eyebrow?: string
  title?: string
  lead?: string
}

/**
 * Extremely structured reading surface — measure, hierarchy, calm neutrals.
 * Use for docs, essays, and long-form agent guidance.
 */
function ReadingArticle({
  lane = "prose",
  children,
  className,
  eyebrow,
  title,
  lead,
}: ReadingArticleProps) {
  return (
    <article
      data-slot="reading-article"
      data-lane={lane}
      className={cn(
        lane === "prose" ? "reading-prose" : "reading-ui",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-4 font-mono text-xs tracking-[0.18em] text-brand uppercase">
          {eyebrow}
        </p>
      ) : null}
      {title ? (
        <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-medium tracking-[-0.035em] leading-[1.15] text-foreground">
          {title}
        </h1>
      ) : null}
      {lead ? <p className="reading-lead mt-5">{lead}</p> : null}
      <div className={cn((title || lead) && "mt-8")}>{children}</div>
    </article>
  )
}

export { ReadingArticle }
export type { ReadingArticleProps, ReadingLane }
