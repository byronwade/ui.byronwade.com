import type { ReactNode } from "react"
import { designCn, getShellRhythm } from "@/lib/design"
import type { SurfaceId } from "@/lib/surfaces"

type SurfaceProps = {
  id: SurfaceId
  children: ReactNode
  className?: string
}

/**
 * Marks a composition with a Meridian surface lane (`data-surface`).
 * Remaps control / row / pad / gap / type CSS vars via shell rhythm.
 */
function Surface({ id, children, className }: SurfaceProps) {
  const rhythm = getShellRhythm(id)
  return (
    <div
      data-surface={id}
      data-slot="surface"
      data-shell={rhythm.label.toLowerCase()}
      className={designCn(className)}
    >
      {children}
    </div>
  )
}

export { Surface }
export type { SurfaceProps }
