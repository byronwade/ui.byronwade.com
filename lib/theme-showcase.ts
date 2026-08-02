/** Structured theme showcase data — for /theme and agent-facing pages. */

export const themeKnobs = [
  {
    name: "--brand",
    role: "Accent / primary / selected / success",
    swatch: "bg-brand",
  },
  {
    name: "--background",
    role: "Cool paper page",
    swatch: "bg-background edge",
  },
  {
    name: "--foreground",
    role: "Primary text",
    swatch: "bg-foreground",
  },
  {
    name: "--card",
    role: "Panel surface",
    swatch: "bg-card edge",
  },
  {
    name: "--muted",
    role: "Inset / quiet fill",
    swatch: "bg-muted",
  },
  {
    name: "--destructive",
    role: "Danger (fixed meaning)",
    swatch: "bg-destructive",
  },
  {
    name: "--warning",
    role: "Caution (fixed meaning)",
    swatch: "bg-warning",
  },
  {
    name: "--dock",
    role: "Theater / floating chrome",
    swatch: "bg-dock",
  },
] as const;

export const densitySteps = [
  { token: "--control-h-xs", px: "24", use: "Desktop toolbar icons" },
  { token: "--control-h-sm", px: "28", use: "Compact chrome" },
  { token: "--control-h", px: "32", use: "Application default" },
  { token: "--control-h-md", px: "36", use: "Marketing secondary" },
  { token: "--control-h-lg", px: "40", use: "Marketing primary CTA" },
  { token: "--control-h-touch", px: "44", use: "Mobile native targets" },
] as const;

export const activityTokens = [
  { name: "thinking", className: "bg-activity-thinking" },
  { name: "search", className: "bg-activity-search" },
  { name: "read", className: "bg-activity-read" },
  { name: "edit", className: "bg-activity-edit" },
] as const;

export const aiStack = [
  {
    id: "design-md",
    label: "design.md",
    summary: "The AI contract — MUST / MUST NOT, theme knobs, decision tree.",
    href: "/design.md",
  },
  {
    id: "skills",
    label: "Skills",
    summary: "meridian-theme · meridian-surface · meridian-compose",
    href: "/for-agents#skills",
  },
  {
    id: "agents",
    label: "Agents",
    summary: "meridian-author · meridian-reviewer",
    href: "/for-agents#agents",
  },
  {
    id: "theme",
    label: "Theme showcase",
    summary: "Live tokens, density, depth — what AIs re-skin.",
    href: "/theme",
  },
] as const;
