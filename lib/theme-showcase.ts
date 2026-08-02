/** Structured showcase data for /theme and marketing sections. */

export const densitySteps = [
  { token: "--control-h-xs", px: "24", use: "Desktop toolbar icons" },
  { token: "--control-h-sm", px: "28", use: "Compact chrome" },
  { token: "--control-h", px: "32", use: "Application default" },
  { token: "--control-h-md", px: "36", use: "Marketing secondary" },
  { token: "--control-h-lg", px: "40", use: "Marketing primary CTA" },
  { token: "--control-h-touch", px: "44", use: "Mobile native targets" },
] as const

export const aiStack = [
  {
    id: "design-md",
    label: "design.md",
    summary: "AI contract — MUST, bans, cinematic list, frozen vs creative.",
    href: "/design",
  },
  {
    id: "grammar",
    label: "lib/design",
    summary: "Typed grammar — closed unions agents cannot fabricate.",
    href: "/theme",
  },
  {
    id: "skills",
    label: "Skills",
    summary: "theme · surface · compose · cinematic",
    href: "/for-agents#skills",
  },
  {
    id: "agents",
    label: "Agents",
    summary: "author · reviewer — plus check:design drift lint",
    href: "/for-agents#agents",
  },
] as const
