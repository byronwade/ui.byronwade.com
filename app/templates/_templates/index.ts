// Metadata source of truth for the starter-template gallery.
// Plain data only (no component imports) so it is safe to import from the
// gallery (server), the inspector (client), the nav, and the search index.
// The slug -> Component map lives in ./components (imported by /preview).
//
// Templates differ from layout archetypes: archetypes are abstract *structural*
// patterns ("the table", "the rail"), templates are complete, content-filled
// *starter screens* you can ship — a real product page with real copy and data.

export type TemplateSlug = "pricing" | "dashboard" | "settings";

export interface TemplateMeta {
  slug: TemplateSlug;
  name: string;
  /** One-line description shown on the gallery card and inspector. */
  tagline: string;
  /** What kind of screen this is — the gallery's category facet + card tag. */
  category: string;
  /** Display price — these are paid, full templates. */
  price: string;
  /** Registry items composed by this template (promotion-ready manifest). */
  uses: string[];
}

export const templates: TemplateMeta[] = [
  {
    slug: "pricing",
    name: "Pricing",
    tagline:
      "A three-tier marketing pricing page with a featured plan, a full comparison table, and an FAQ.",
    category: "Marketing",
    price: "$49",
    uses: ["Card", "Badge", "Button", "SegmentedControl", "Table", "Separator"],
  },
  {
    slug: "dashboard",
    name: "Dashboard",
    tagline:
      "A complete analytics overview shell — sidebar, top bar, KPI row, a hero chart, and a recent-activity table.",
    category: "Dashboard",
    price: "$59",
    uses: ["Chart", "MetricStat", "Card", "Table", "Badge", "StatusDot", "Avatar", "Button"],
  },
  {
    slug: "settings",
    name: "Settings",
    tagline:
      "An account settings page with a sticky section rail, profile and notification controls, billing, and a danger zone.",
    category: "Application",
    price: "$39",
    uses: ["Section", "SettingRow", "Switch", "Select", "Input", "Label", "Avatar", "Button", "Badge"],
  },
];

export function getTemplate(slug: string): TemplateMeta | undefined {
  return templates.find((t) => t.slug === slug);
}
