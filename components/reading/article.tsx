import { type ReactNode } from "react"

import { typesetClass, type TypesetPreset } from "@/lib/design"
import { cn } from "@/lib/utils"

type ReadingLane = "ui" | "prose"

type ReadingArticleProps = {
  lane?: ReadingLane
  /** Prefer lane; preset overrides when set. */
  preset?: TypesetPreset
  children: ReactNode
  className?: string
  /** Optional kicker above the title */
  eyebrow?: string
  title?: string
  lead?: string
}

function laneToPreset(lane: ReadingLane): TypesetPreset {
  return lane === "prose" ? "reading" : "docs"
}

/**
 * Structured reading surface — shadcn/typeset owns size / leading / flow.
 * Use for docs, essays, and long-form agent guidance.
 */
function ReadingArticle({
  lane = "prose",
  preset,
  children,
  className,
  eyebrow,
  title,
  lead,
}: ReadingArticleProps) {
  const typesetPreset = preset ?? laneToPreset(lane)

  return (
    <article
      data-slot="reading-article"
      data-lane={lane}
      data-typeset={typesetPreset}
      className={cn(typesetClass(typesetPreset), className)}
    >
      {eyebrow ? (
        <p
          className="not-typeset mb-4 font-mono text-xs tracking-[0.18em] text-brand uppercase"
          data-not-typeset
        >
          {eyebrow}
        </p>
      ) : null}
      {title ? <h1>{title}</h1> : null}
      {lead ? <p className="reading-lead mt-5">{lead}</p> : null}
      <div className={cn((title || lead) && "mt-8")}>{children}</div>
    </article>
  )
}

export { ReadingArticle }
export type { ReadingArticleProps, ReadingLane }
