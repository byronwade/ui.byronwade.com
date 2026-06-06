// Metadata source of truth for the layout archetype gallery.
// Plain data only (no component imports) so it is safe to import from the
// gallery (server), the frame (client), the docs nav, and the search index.
// The slug -> Component map lives in ./components (imported only by /preview).

export type ArchetypeSlug =
  | "cockpit"
  | "centered-tool"
  | "rich-inventory"
  | "split-rail"
  | "gauge"
  | "hero-chart"
  | "board"
  | "conversation"
  | "canvas"
  | "studio"
  | "trading-desk"
  | "service-map"

export interface ArchetypeMeta {
  slug: ArchetypeSlug
  name: string
  /** One-line description shown on the gallery card and frame. */
  tagline: string
  /** The single signature centerpiece this archetype is built around. */
  centerpiece: string
  /** Coarse grouping used by the gallery's category facet + card tag. */
  category: string
  /** Registry items composed by this archetype (promotion-ready manifest). */
  uses: string[]
}

export const archetypes: ArchetypeMeta[] = [
  {
    slug: "cockpit",
    name: "Cockpit",
    tagline:
      "A dense two-pane operations console, a scannable list rail beside a deep detail pane.",
    centerpiece: "Information density",
    category: "Application",
    uses: [
      "ScrollArea",
      "Tabs",
      "StatusDot",
      "Avatar",
      "Badge",
      "Separator",
      "InputGroup",
      "EventTimeline",
    ],
  },
  {
    slug: "centered-tool",
    name: "Centered tool",
    tagline:
      "A single focal task floated on a calm backdrop, sign-in, launcher, or confirmation.",
    centerpiece: "One decision",
    category: "Auth",
    uses: ["CenteredFocal", "InputGroup", "Button", "Separator"],
  },
  {
    slug: "rich-inventory",
    name: "Rich inventory",
    tagline:
      "A directory led by a dense, filterable table with live search and a view rail.",
    centerpiece: "The table",
    category: "Application",
    uses: [
      "Table",
      "SegmentedControl",
      "FilterPill",
      "StatusPill",
      "Avatar",
      "InputGroup",
      "Button",
      "PageHeader",
    ],
  },
  {
    slug: "split-rail",
    name: "Split + rail",
    tagline:
      "Settings and configuration with a sticky nav rail and explain-everything rows.",
    centerpiece: "The rail",
    category: "Settings",
    uses: [
      "Section",
      "SettingRow",
      "Switch",
      "Select",
      "Input",
      "SplitWithRail",
      "Button",
      "PageHeader",
    ],
  },
  {
    slug: "gauge",
    name: "Gauge",
    tagline:
      "A health page built around one ring gauge, flanked by metrics, activity, and a timeline.",
    centerpiece: "The ring gauge",
    category: "Dashboard",
    uses: [
      "ActivityRing",
      "StatCard",
      "ActivityGrid",
      "EventTimeline",
      "StatusPill",
      "PageHeader",
    ],
  },
  {
    slug: "hero-chart",
    name: "Hero-chart",
    tagline:
      "A telemetry dashboard fronted by one big chart, with a metric row and supporting table.",
    centerpiece: "The chart",
    category: "Dashboard",
    uses: ["Chart", "MetricStat", "Table", "Badge", "PageHeader"],
  },
  {
    slug: "board",
    name: "Board",
    tagline:
      "A horizontally-scrolling Kanban with WIP-limited columns and draggable issue cards.",
    centerpiece: "The columns",
    category: "Application",
    uses: [
      "Badge",
      "GradientAvatar",
      "StatusDot",
      "FilterPill",
      "InputGroup",
      "Button",
      "ScrollArea",
    ],
  },
  {
    slug: "conversation",
    name: "Conversation",
    tagline:
      "An AI assistant thread with cited answers, a history rail, and a docked composer.",
    centerpiece: "The thread",
    category: "AI",
    uses: ["GradientAvatar", "Badge", "Button", "ScrollArea", "Separator"],
  },
  {
    slug: "canvas",
    name: "Canvas",
    tagline:
      "A full-bleed spatial map with floating glass overlays, pins, and a results rail.",
    centerpiece: "The map",
    category: "Application",
    uses: [
      "InputGroup",
      "StatusPill",
      "StatusDot",
      "GradientAvatar",
      "Button",
      "Separator",
    ],
  },
  {
    slug: "studio",
    name: "Studio",
    tagline:
      "A now-playing media surface built around one big artwork, waveform, and a live queue.",
    centerpiece: "The artwork",
    category: "Media",
    uses: [
      "Button",
      "Badge",
      "StatusPill",
      "GradientAvatar",
      "ScrollArea",
      "Separator",
      "InputGroup",
    ],
  },
  {
    slug: "trading-desk",
    name: "Trading desk",
    tagline:
      "A TradingView-style terminal — top toolbar, drawing rail, full-bleed interactive chart, and collapsible side panels.",
    centerpiece: "The chart",
    category: "Application",
    uses: [
      "Sidebar",
      "ChartToolbar",
      "LightweightChart",
      "CompareSymbols",
      "AlertCreateForm",
      "OrderEntry",
      "DrawingToolbar",
      "IndicatorLegend",
      "MarketDepth",
      "TimeAndSales",
      "Watchlist",
      "SessionStatsBar",
      "ReplayControls",
      "Sparkline",
      "SymbolSearch",
    ],
  },
  {
    slug: "service-map",
    name: "Service map",
    tagline:
      "A Maple-style observability console — animated dependency graph, platform adapters, and resizable service detail panels.",
    centerpiece: "The service map",
    category: "Dashboard",
    uses: [
      "Sidebar",
      "SegmentedControl",
      "Resizable",
      "Tabs",
      "Chart",
      "Badge",
      "Button",
      "ScrollArea",
      "Select",
      "Popover",
      "Tooltip",
    ],
  },
]

export function getArchetype(slug: string): ArchetypeMeta | undefined {
  return archetypes.find((a) => a.slug === slug)
}
