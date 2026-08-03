/**
 * Agent-activity pastel strip — scoped to object-bound AI chrome only.
 * Absorb: Cursor timeline pills; never used as system CTA colors.
 */
import { activity, activityRoles, designCn, radiusIntent } from "@/lib/design"
import type { ActivityRole } from "@/lib/design"
import { cn } from "@/lib/utils"

type ActivityLegendProps = {
  active?: ActivityRole
  className?: string
  /** Compact rail header vs fuller inspector. */
  dense?: boolean
}

function ActivityLegend({
  active,
  className,
  dense = true,
}: ActivityLegendProps) {
  return (
    <ul
      data-slot="activity-legend"
      aria-label="Agent activity stages"
      className={cn("flex flex-wrap gap-1", className)}
    >
      {activityRoles.map((role) => {
        const on = active === role
        return (
          <li key={role}>
            <span
              className={designCn(
                "inline-flex items-center border-transparent font-mono uppercase text-foreground",
                radiusIntent("pill"),
                activity(role),
                dense
                  ? "h-4 px-1.5 text-[9px] tracking-[0.08em]"
                  : "h-5 px-2 text-[10px] tracking-[0.1em]",
                on && "ring-1 ring-ring/40",
              )}
            >
              {role}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

export { ActivityLegend }
export type { ActivityLegendProps }
