export type PropRow = { name: string; type: string; default?: string; description: string };
export type ComponentDoc = {
  slug: string;
  name: string;
  category: "Foundation" | "Libraries" | "UI" | "Composites";
  description: string;
  npmDeps?: string[];
  registryDeps?: string[];
  props?: PropRow[];
  examples: string[];
};

export const components: ComponentDoc[] = [
  {
    slug: "foundation", name: "Foundation", category: "Foundation",
    description: "Complete token base — neutrals + brand-derived accent, status/dock/chart/sidebar tokens, radius scale. Install via `shadcn init`.",
    examples: ["tokens"],
  },
  {
    slug: "utils", name: "cn()", category: "Libraries",
    description: "clsx + tailwind-merge class combiner.", npmDeps: ["clsx", "tailwind-merge"],
    examples: [],
  },
  {
    slug: "identity", name: "Anonymous identity", category: "Libraries",
    description: "Deterministic animal-name + OKLCH gradient from a seed string.",
    examples: ["names"],
  },
  {
    slug: "status-dot", name: "Status dot", category: "UI",
    description: "Atomic status indicator dot with tone + optional pulse.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      { name: "tone", type: '"success" | "warning" | "danger" | "info" | "neutral"', default: '"neutral"', description: "Color tone." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"sm"', description: "Dot size." },
      { name: "pulse", type: "boolean", default: "false", description: "Animated ping ring." },
    ],
    examples: ["tones", "pulse"],
  },
  {
    slug: "gauge", name: "Ring gauge", category: "UI",
    description: "Circular score ring with status tone and big centered number.",
    registryDeps: ["@byronwade/status-dot"],
    props: [
      { name: "value", type: "number", description: "0–100 score." },
      { name: "label", type: "string", description: "Caption under the number." },
      { name: "tone", type: "StatusTone", description: "Override the auto tone." },
      { name: "size", type: "number", default: "160", description: "Diameter in px." },
      { name: "thickness", type: "number", default: "10", description: "Ring stroke width." },
    ],
    examples: ["default", "tones"],
  },
  {
    slug: "gradient-avatar", name: "Gradient avatar", category: "UI",
    description: "Radial-gradient avatar disc derived deterministically from a seed.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils", "@byronwade/identity"],
    props: [
      { name: "seed", type: "string", description: "Any string; same seed → same gradient." },
      { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Disc size." },
    ],
    examples: ["seeds", "sizes"],
  },
  {
    slug: "activity-grid", name: "Activity grid", category: "UI",
    description: "GitHub-style grid of small circles, filled in brand where active.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      { name: "data", type: "number[]", description: "Activity counts per cell." },
      { name: "columns", type: "number", default: "26", description: "Columns in the grid." },
    ],
    examples: ["default"],
  },
  {
    slug: "filter-pill", name: "Filter pill", category: "UI",
    description: "Pill-with-chevron filter / range selector control.",
    npmDeps: ["lucide-react"], registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "segmented-control", name: "Segmented control", category: "UI",
    description: "Inline segmented toggle (Referrer · Links · Campaign style).",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "timeline-rail", name: "Timeline rail", category: "Composites",
    description: "Vertical event/timeline rail with connectors and terminal marker.",
    npmDeps: ["lucide-react"], registryDeps: ["@byronwade/foundation", "@byronwade/utils", "@byronwade/status-dot"],
    examples: ["default"],
  },
  {
    slug: "split-with-rail", name: "Split with rail", category: "Composites",
    description: "Summary column + vertical rail archetype shell.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "hero-section", name: "Hero section", category: "Composites",
    description: "Full-bleed hero composition shell.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "metric-stat", name: "Metric stat", category: "Composites",
    description: "Label + large value + delta badge metric row.",
    npmDeps: ["lucide-react"], registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "centered-focal", name: "Centered focal", category: "Composites",
    description: "One centerpiece + floating card; first-run & single-action tools.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
];

export const categories = ["Foundation", "Libraries", "UI", "Composites"] as const;
export const byCategory = (cat: string) => components.filter((c) => c.category === cat);
export const bySlug = (slug: string) => components.find((c) => c.slug === slug);
