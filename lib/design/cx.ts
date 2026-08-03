import { cn } from "@/lib/utils"
import {
  type ActivityRole,
  type ColorRole,
  type DepthToken,
  type RadiusToken,
  type TypeRole,
  depthFor,
  radiusFor,
} from "@/lib/design/grammar"

/** Static maps so Tailwind can see every class (no string interpolation). */
const bgSolid: Record<ColorRole, string> = {
  background: "bg-background",
  foreground: "bg-foreground",
  card: "bg-card",
  popover: "bg-popover",
  primary: "bg-primary",
  secondary: "bg-secondary",
  muted: "bg-muted",
  accent: "bg-accent",
  destructive: "bg-destructive",
  warning: "bg-warning",
  success: "bg-success",
  brand: "bg-brand",
  "brand-muted": "bg-brand-muted",
  border: "bg-border",
  input: "bg-input",
  ring: "bg-ring",
  dock: "bg-dock",
  "dock-muted": "bg-dock-muted",
  sidebar: "bg-sidebar",
}

const bgWash: Partial<
  Record<ColorRole, Record<10 | 15 | 25 | 30 | 40 | 50, string>>
> = {
  brand: {
    10: "bg-brand/10",
    15: "bg-brand/15",
    25: "bg-brand/25",
    30: "bg-brand/30",
    40: "bg-brand/40",
    50: "bg-brand/50",
  },
  muted: {
    10: "bg-muted/10",
    15: "bg-muted/15",
    25: "bg-muted/25",
    30: "bg-muted/30",
    40: "bg-muted/40",
    50: "bg-muted/50",
  },
  destructive: {
    10: "bg-destructive/10",
    15: "bg-destructive/15",
    25: "bg-destructive/25",
    30: "bg-destructive/30",
    40: "bg-destructive/40",
    50: "bg-destructive/50",
  },
}

const textSolid: Record<ColorRole, string> = {
  background: "text-background",
  foreground: "text-foreground",
  card: "text-card-foreground",
  popover: "text-popover-foreground",
  primary: "text-primary",
  secondary: "text-secondary-foreground",
  muted: "text-muted-foreground",
  accent: "text-accent-foreground",
  destructive: "text-destructive",
  warning: "text-warning-foreground",
  success: "text-success-foreground",
  brand: "text-brand",
  "brand-muted": "text-brand-muted",
  border: "text-border",
  input: "text-input",
  ring: "text-ring",
  dock: "text-dock-foreground",
  "dock-muted": "text-dock-muted",
  sidebar: "text-sidebar-foreground",
}

const activityMap: Record<ActivityRole, string> = {
  thinking: "bg-activity-thinking",
  search: "bg-activity-search",
  read: "bg-activity-read",
  edit: "bg-activity-edit",
}

/** Background utility from a closed color role. */
export function bg(role: ColorRole, opacity?: 10 | 15 | 25 | 30 | 40 | 50) {
  if (opacity != null) {
    const wash = bgWash[role]?.[opacity]
    if (!wash) {
      throw new Error(
        `design: bg(${role}, ${opacity}) is not in the closed wash set`,
      )
    }
    return wash
  }
  return bgSolid[role]
}

/** Text utility from a closed color role. */
export function text(role: ColorRole) {
  return textSolid[role]
}

export function depth(token: DepthToken) {
  return token
}

export function radius(token: RadiusToken) {
  return token
}

export function radiusIntent(intent: keyof typeof radiusFor) {
  return radiusFor[intent]
}

export function depthIntent(intent: keyof typeof depthFor) {
  return depthFor[intent]
}

export function activity(role: ActivityRole) {
  return activityMap[role]
}

/**
 * Opinionated type recipes — frozen treatment.
 * Body / label / data follow shell rhythm vars under `data-surface`.
 */
export function typeClass(role: TypeRole) {
  switch (role) {
    case "display":
      return "font-medium tracking-[-0.045em] leading-[0.95]"
    case "title":
      return "font-medium tracking-[-0.035em]"
    case "body":
      return "type-ui"
    case "label":
      return "type-label text-muted-foreground"
    case "data":
      return "type-meta text-muted-foreground"
    case "reading-ui":
      return "reading-ui"
    case "reading-prose":
      return "reading-prose"
  }
}

/** Shell chrome type — ui / row / meta / label via surface CSS vars. */
export function shellType(role: "ui" | "row" | "meta" | "label") {
  switch (role) {
    case "ui":
      return "type-ui"
    case "row":
      return "type-row"
    case "meta":
      return "type-meta"
    case "label":
      return "type-label"
  }
}

/** Compose only grammar-backed classes (+ free layout utilities). */
export function designCn(
  ...parts: Array<string | false | null | undefined>
) {
  return cn(...parts)
}
