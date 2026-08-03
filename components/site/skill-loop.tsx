import Link from "next/link"
import { skillProofs } from "@/lib/site/skill-proofs"
import { designCn, radiusIntent, text, typeClass } from "@/lib/design"

type SkillLoopProps = {
  className?: string
  /** Compact row for footers / dense hubs */
  dense?: boolean
}

/** Five-skill Meridian loop — every skill links to a live site proof. */
function SkillLoop({ className, dense = false }: SkillLoopProps) {
  return (
    <ol
      data-slot="skill-loop"
      className={designCn(
        "grid gap-2",
        dense ? "sm:grid-cols-2 lg:grid-cols-5" : "md:grid-cols-2 xl:grid-cols-5",
        className,
      )}
    >
      {skillProofs.map((proof) => (
        <li key={proof.slug}>
          <Link
            href={proof.proveHref}
            className={designCn(
              "flex h-full flex-col gap-1.5 bg-card px-4 py-3.5 transition-colors edge hover:bg-muted/30",
              radiusIntent("panel"),
              dense && "px-3 py-3",
            )}
          >
            <span
              className={designCn(
                typeClass("label"),
                text("muted"),
                "text-[10px] tracking-[0.14em]",
              )}
            >
              {String(proof.step).padStart(2, "0")} · {proof.label}
            </span>
            <span className="text-sm font-medium tracking-tight text-foreground">
              {proof.proveLabel}
            </span>
            {!dense ? (
              <span className="text-sm leading-snug text-muted-foreground">
                {proof.summary}
              </span>
            ) : null}
          </Link>
        </li>
      ))}
    </ol>
  )
}

export { SkillLoop }
export type { SkillLoopProps }
