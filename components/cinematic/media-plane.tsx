import { cn } from "@/lib/utils"

type MediaPlaneProps = {
  className?: string
}

/**
 * Soft atmospheric wash when a photograph isn’t used —
 * warm dock base + quiet brand glow. Never bright.
 */
function MediaPlane({ className }: MediaPlaneProps) {
  return (
    <div
      aria-hidden
      data-slot="media-plane"
      className={cn(
        "pointer-events-none absolute inset-0",
        "bg-[radial-gradient(ellipse_90%_70%_at_50%_20%,color-mix(in_oklch,var(--brand)_14%,transparent),transparent_68%),radial-gradient(ellipse_70%_50%_at_80%_90%,color-mix(in_oklch,var(--foreground)_6%,transparent),transparent_60%)]",
        className,
      )}
    />
  )
}

export { MediaPlane }
export type { MediaPlaneProps }
