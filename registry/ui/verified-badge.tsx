import { BadgeCheck, Music } from "lucide-react"

import { cn } from "@/lib/utils"

type VerifiedBadgeSize = "sm" | "md"
type VerifiedBadgeVariant = "default" | "artist"

const sizes: Record<VerifiedBadgeSize, string> = {
  sm: "size-3.5",
  md: "size-4",
}

const icons: Record<VerifiedBadgeVariant, typeof BadgeCheck> = {
  default: BadgeCheck,
  artist: Music,
}

type VerifiedBadgeProps = {
  size?: VerifiedBadgeSize
  variant?: VerifiedBadgeVariant
  /** Accessible label announced to assistive tech. */
  title?: string
  className?: string
}

/** Inline "verified" check shown next to channel/author names (YouTube-style). */
function VerifiedBadge({
  size = "sm",
  variant = "default",
  title = "Verified",
  className,
}: VerifiedBadgeProps) {
  const Icon = icons[variant]
  return (
    <span
      data-slot="verified-badge"
      role="img"
      aria-label={title}
      className={cn(
        "inline-flex shrink-0 text-muted-foreground",
        sizes[size],
        className,
      )}
    >
      <Icon aria-hidden className="size-full" />
    </span>
  )
}

export { VerifiedBadge }
export type { VerifiedBadgeProps }
