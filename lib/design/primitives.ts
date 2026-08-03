/**
 * Per-primitive contracts — closed ARIA + states for shadcn atoms.
 * Agents compose shadcn; they do not invent twin components.
 * Extend this table when adding a primitive — never a parallel kit.
 */

export const primitiveIds = [
  "button",
  "input",
  "badge",
  "card",
  "separator",
] as const

export type PrimitiveId = (typeof primitiveIds)[number]

export type PrimitiveContract = {
  id: PrimitiveId
  /** shadcn install / file path under components/ui */
  path: `components/ui/${string}.tsx`
  dataSlot: string
  /** Interaction / UI states this atom must support */
  states: readonly string[]
  /** Required a11y affordances */
  aria: readonly string[]
  /** Frozen interaction class bundle from experience.ts */
  interaction: "control" | "row" | "none"
  /** Notes agents must not violate */
  must: readonly string[]
  mustNot: readonly string[]
}

export const primitiveContracts = {
  button: {
    id: "button",
    path: "components/ui/button.tsx",
    dataSlot: "button",
    states: [
      "rest",
      "hover",
      "pressed",
      "focusVisible",
      "disabled",
      "destructive",
    ],
    aria: ["native button or asChild with role", "disabled", "aria-invalid"],
    interaction: "control",
    must: [
      "Use Button from @/components/ui/button",
      "motion-press for juicy press",
      "focus-visible ring (not fill alone)",
      "Icon-only: aria-label required",
    ],
    mustNot: [
      "Hand-roll <button> with ad-hoc colors",
      "Fork a second Button component",
      "Brand border as the only selected signal",
    ],
  },
  input: {
    id: "input",
    path: "components/ui/input.tsx",
    dataSlot: "input",
    states: ["rest", "hover", "focusVisible", "disabled", "invalid"],
    aria: ["associated label or aria-label", "aria-invalid", "disabled"],
    interaction: "control",
    must: [
      "radiusIntent control (rounded-lg)",
      "focus ring via ring-ring",
      "Label every field",
    ],
    mustNot: ["Elevation wells via box-shadow utilities", "Placeholder-only labeling"],
  },
  badge: {
    id: "badge",
    path: "components/ui/badge.tsx",
    dataSlot: "badge",
    states: ["rest"],
    aria: ["text content conveys meaning (not color alone)"],
    interaction: "none",
    must: ["Semantic status ≠ brand decoration", "Mono for tool/activity names"],
    mustNot: ["Use activity pastels as CTA colors"],
  },
  card: {
    id: "card",
    path: "components/ui/card.tsx",
    dataSlot: "card",
    states: ["rest"],
    aria: ["heading hierarchy inside card"],
    interaction: "none",
    must: ["edge or depth-* — never Tailwind shadow-*", "rounded-2xl panel radius"],
    mustNot: ["Nested cards for chrome"],
  },
  separator: {
    id: "separator",
    path: "components/ui/separator.tsx",
    dataSlot: "separator",
    states: ["rest"],
    aria: ["decorative unless labeling a region"],
    interaction: "none",
    must: ["Stroke before shadow for separation"],
    mustNot: ["Thick brand dividers as decoration"],
  },
} as const satisfies Record<PrimitiveId, PrimitiveContract>

export const primitiveLaws = {
  composeShadcnOnly: true,
  noTwinKits: true,
  contractsClosed: true,
  iconOnlyNeedsLabel: true,
} as const

export function getPrimitiveContract(id: PrimitiveId): PrimitiveContract {
  return primitiveContracts[id]
}
