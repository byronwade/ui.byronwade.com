"use client"

// Shared, token-only gallery chrome reused by the catalog (browse-gallery) and
// the templates gallery (gallery): a removable active-filter chip and the
// app-vs-marketing surface badge. Depth is `edge`, never raised.
import { X } from "@/lib/icons"

import { cn } from "@/lib/utils"
import {
  surfaceShortLabel,
  type CatalogSurface,
} from "@/content/catalog-surfaces"

/** A removable active-filter chip (Mobbin's "Hero ✕"). */
function ActivePill({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex h-8 items-center gap-1 rounded-full edge bg-muted pl-3 pr-1.5 text-sm font-medium">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        className="grid size-5 place-items-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <X className="size-3.5" />
      </button>
    </span>
  )
}

/** App vs marketing surface badge. */
function SurfaceBadge({ surface }: { surface: CatalogSurface }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] tracking-wide uppercase",
        surface === "marketing"
          ? "bg-brand/10 text-brand"
          : "bg-muted text-muted-foreground",
      )}
    >
      {surfaceShortLabel(surface)}
    </span>
  )
}

export { ActivePill, SurfaceBadge }
