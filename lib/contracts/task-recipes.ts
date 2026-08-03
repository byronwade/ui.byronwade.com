/**
 * Task recipes — few intents agents should prefer over freeform layout.
 * Bound to Meridian grammar; other contracts will fork this table.
 */

export type TaskRecipeId =
  | "list-resource"
  | "edit-record"
  | "object-detail"
  | "agent-rail"
  | "settings-form"
  | "empty-recovery"

export type TaskRecipe = {
  id: TaskRecipeId
  title: string
  intent: string
  surface: "application" | "desktop" | "marketing"
  compose: readonly string[]
  must: readonly string[]
  never: readonly string[]
}

export const taskRecipes: readonly TaskRecipe[] = [
  {
    id: "list-resource",
    title: "List resource",
    intent: "Scanable index of domain objects with filter + row actions.",
    surface: "application",
    compose: ["table or dense list", "toolbar", "empty/loading/error"],
    must: [
      "stable row height",
      "mono metadata",
      "owns empty + loading + error",
      "selected = bg-brand/10",
    ],
    never: ["marketing cards for rows", "raw hex", "shadow-*"],
  },
  {
    id: "edit-record",
    title: "Edit record",
    intent: "Form to create/update one object with clear save path.",
    surface: "application",
    compose: ["form fields", "primary save", "destructive optional"],
    must: [
      "labels on every field",
      "validation inline",
      "h-8/h-9 controls",
      "rounded-lg inputs",
    ],
    never: ["hero CTA height on every button", "serif body in forms"],
  },
  {
    id: "object-detail",
    title: "Object detail",
    intent: "One product object with meta, actions, related lists.",
    surface: "application",
    compose: ["header", "sections", "optional agent rail"],
    must: ["title → description → meta", "edge panels", "object-bound AI"],
    never: ["detached promo chips", "second accent color"],
  },
  {
    id: "agent-rail",
    title: "Agent rail",
    intent: "AI attached to an object — outcome first, trace disclosed.",
    surface: "application",
    compose: ["outcome", "trace details", "activity legend", "provenance"],
    must: [
      "data-provenance",
      "outcome-then-trace",
      "bg-activity-* for agent verbs only",
      "mono tool/model names",
    ],
    never: ["activity colors as brand", "hidden errors"],
  },
  {
    id: "settings-form",
    title: "Settings form",
    intent: "Workspace or user preferences in calm chrome.",
    surface: "application",
    compose: ["sectioned form", "save bar"],
    must: ["grouped sections", "quiet destructive", "focus rings"],
    never: ["theater tone for settings", "dense mono walls of copy"],
  },
  {
    id: "empty-recovery",
    title: "Empty recovery",
    intent: "Empty/error states that teach the next action.",
    surface: "application",
    compose: ["message", "one primary action"],
    must: ["role=alert on errors", "one clear CTA", "no shame copy"],
    never: ["illustration zoo", "multiple competing CTAs"],
  },
] as const

export function getTaskRecipe(id: TaskRecipeId): TaskRecipe | undefined {
  return taskRecipes.find((r) => r.id === id)
}
