import type { SurfaceId } from "@/lib/design/grammar"

export type { SurfaceId }

export const surfaces = [
  {
    id: "application" as const,
    label: "Application",
    platform: "Web",
    summary:
      "Operate data-rich work — indexes, forms, detail, object-bound AI. Density follows the task.",
    density: "compact · 32px controls · 40px rows",
  },
  {
    id: "marketing" as const,
    label: "Marketing",
    platform: "Web",
    summary:
      "Present the product — brand, staged frames, docs. Theater when the subject earns it.",
    density: "comfortable · 36–40px CTAs",
  },
  {
    id: "mobile" as const,
    label: "Mobile Native",
    platform: "Native",
    summary:
      "Thumb-first product UI — 44px targets, bottom bar, safe areas. Same tokens, larger hit areas.",
    density: "touch · 44px controls · 52px rows",
  },
  {
    id: "desktop" as const,
    label: "Desktop Native",
    platform: "Native",
    summary:
      "Keyboard + pointer productivity — compact toolbars, menus, status. Quiet chrome.",
    density: "compact chrome · 28px toolbars",
  },
] as const satisfies ReadonlyArray<{
  id: SurfaceId
  label: string
  platform: string
  summary: string
  density: string
}>
