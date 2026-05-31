/**
 * Flat search index for the ⌘K command palette.
 * Two kinds of entries: Section (anchor on the home page) and Component.
 */

export type SearchEntry = {
  label: string;
  kind: "Component" | "Section";
  href: string;
  /** Space-separated additional terms for fuzzy matching. */
  keywords?: string;
};

/** Slugs that have their own /components/[slug] detail page (from content/components.ts). */
const COMPONENT_SLUGS = new Set([
  // Foundation / Libraries
  "foundation",
  "utils",
  "identity",
  // UI
  "status-dot",
  "gauge",
  "gradient-avatar",
  "activity-grid",
  "filter-pill",
  "segmented-control",
  // Composites
  "timeline-rail",
  "split-with-rail",
  "hero-section",
  "metric-stat",
  "centered-focal",
  // Primitives
  "button",
  "badge",
  "card",
  "status-pill",
  // Forms
  "input",
  "textarea",
  "label",
  "select",
  "checkbox",
  "switch",
  "radio-group",
  // Overlays
  "tooltip",
  "popover",
  "dropdown-menu",
  "dialog",
  "hover-card",
  // Feedback
  "alert",
  "progress",
  "skeleton",
  "sonner",
  // Data display
  "tabs",
  "accordion",
  "avatar",
  "separator",
  "breadcrumb",
  "table",
  // Patterns
  "page-header",
  "stat-card",
  "empty-state",
  // Charts
  "chart",
  // House components
  "detail-header",
  "section",
  "event-timeline",
]);

function componentHref(slug: string, fallbackSection: string): string {
  return COMPONENT_SLUGS.has(slug)
    ? `/components/${slug}`
    : `/#${fallbackSection}`;
}

export const searchIndex: SearchEntry[] = [
  /* ── Sections ────────────────────────────────────────────────────── */
  { kind: "Section", label: "Philosophy",       href: "/#philosophy",   keywords: "calm chrome single accent" },
  { kind: "Section", label: "Principles",       href: "/#principles",   keywords: "rules do dont status spacing radius" },
  { kind: "Section", label: "Foundations",      href: "/#foundations",  keywords: "color tokens radius elevation typography utilities" },
  { kind: "Section", label: "Primitives",       href: "/#primitives",   keywords: "button badge card filter pill segmented control status dot" },
  { kind: "Section", label: "Forms",            href: "/#forms",        keywords: "input textarea select checkbox switch radio label" },
  { kind: "Section", label: "Overlays",         href: "/#overlays",     keywords: "tooltip popover dropdown menu dialog hover card" },
  { kind: "Section", label: "Feedback",         href: "/#feedback",     keywords: "alert progress skeleton toast" },
  { kind: "Section", label: "Data display",     href: "/#data",         keywords: "tabs accordion avatar separator breadcrumb table" },
  { kind: "Section", label: "Patterns",         href: "/#patterns",     keywords: "page header metric stat stat card gauge activity grid gradient avatar empty state" },
  { kind: "Section", label: "Charts",           href: "/#charts",       keywords: "area chart bar chart recharts" },
  { kind: "Section", label: "House components", href: "/#house",        keywords: "detail header settings panel event timeline section" },
  { kind: "Section", label: "Layout archetypes",href: "/#layouts",      keywords: "hero section centered focal split with rail timeline rail layouts" },
  { kind: "Section", label: "Side by side",     href: "/#comparison",   keywords: "comparison vercel linear stripe github shopify" },

  /* ── Components: Primitives ──────────────────────────────────────── */
  { kind: "Component", label: "Button",           href: componentHref("button", "primitives"),          keywords: "variants sizes outline ghost destructive link" },
  { kind: "Component", label: "Badge",            href: componentHref("badge", "primitives"),           keywords: "secondary destructive outline ghost success warning" },
  { kind: "Component", label: "Card",             href: componentHref("card", "primitives"),            keywords: "header title description content footer" },
  { kind: "Component", label: "FilterPill",       href: componentHref("filter-pill", "primitives"),     keywords: "filter pill chevron range selector today week" },
  { kind: "Component", label: "SegmentedControl", href: componentHref("segmented-control", "primitives"), keywords: "segmented toggle referrer links campaign" },
  { kind: "Component", label: "StatusDot",        href: componentHref("status-dot", "primitives"),      keywords: "status dot success warning danger info neutral pulse" },
  { kind: "Component", label: "StatusPill",       href: componentHref("status-pill", "primitives"),     keywords: "status pill active pending failed provisioning draft" },

  /* ── Components: Forms ───────────────────────────────────────────── */
  { kind: "Component", label: "Input",            href: componentHref("input", "forms"),                keywords: "text field form" },
  { kind: "Component", label: "Textarea",         href: componentHref("textarea", "forms"),             keywords: "multiline text area" },
  { kind: "Component", label: "Select",           href: componentHref("select", "forms"),               keywords: "dropdown select trigger" },
  { kind: "Component", label: "Checkbox",         href: componentHref("checkbox", "forms"),             keywords: "check tick boolean" },
  { kind: "Component", label: "Switch",           href: componentHref("switch", "forms"),               keywords: "toggle on off boolean" },
  { kind: "Component", label: "RadioGroup",       href: componentHref("radio-group", "forms"),          keywords: "radio group option" },
  { kind: "Component", label: "Label",            href: componentHref("label", "forms"),                keywords: "form label" },

  /* ── Components: Overlays ────────────────────────────────────────── */
  { kind: "Component", label: "Tooltip",          href: componentHref("tooltip", "overlays"),           keywords: "hover hint overlay" },
  { kind: "Component", label: "Popover",          href: componentHref("popover", "overlays"),           keywords: "floating popover trigger content" },
  { kind: "Component", label: "DropdownMenu",     href: componentHref("dropdown-menu", "overlays"),     keywords: "dropdown actions menu" },
  { kind: "Component", label: "Dialog",           href: componentHref("dialog", "overlays"),            keywords: "modal dialog overlay trigger" },
  { kind: "Component", label: "HoverCard",        href: componentHref("hover-card", "overlays"),        keywords: "hover card preview" },

  /* ── Components: Feedback ────────────────────────────────────────── */
  { kind: "Component", label: "Alert",            href: componentHref("alert", "feedback"),             keywords: "notification error warning destructive" },
  { kind: "Component", label: "Progress",         href: componentHref("progress", "feedback"),          keywords: "progress bar loading value" },
  { kind: "Component", label: "Skeleton",         href: componentHref("skeleton", "feedback"),          keywords: "loading placeholder skeleton" },
  { kind: "Component", label: "Toast",            href: componentHref("sonner", "feedback"),            keywords: "sonner toast notification success error" },

  /* ── Components: Data display ────────────────────────────────────── */
  { kind: "Component", label: "Tabs",             href: componentHref("tabs", "data"),                  keywords: "tabs tablist trigger content" },
  { kind: "Component", label: "Accordion",        href: componentHref("accordion", "data"),             keywords: "accordion expand collapse faq" },
  { kind: "Component", label: "Avatar",           href: componentHref("avatar", "data"),                keywords: "avatar fallback user" },
  { kind: "Component", label: "Separator",        href: componentHref("separator", "data"),             keywords: "divider horizontal vertical" },
  { kind: "Component", label: "Breadcrumb",       href: componentHref("breadcrumb", "data"),            keywords: "breadcrumb navigation path" },
  { kind: "Component", label: "Table",            href: componentHref("table", "data"),                 keywords: "table row cell header" },

  /* ── Components: Patterns ────────────────────────────────────────── */
  { kind: "Component", label: "PageHeader",       href: componentHref("page-header", "patterns"),       keywords: "page header title description" },
  { kind: "Component", label: "MetricStat",       href: componentHref("metric-stat", "patterns"),       keywords: "metric stat label value delta badge" },
  { kind: "Component", label: "StatCard",         href: componentHref("stat-card", "patterns"),         keywords: "stat card total spend hint delta" },
  { kind: "Component", label: "Gauge",            href: componentHref("gauge", "patterns"),             keywords: "ring gauge score great needs work poor" },
  { kind: "Component", label: "ActivityGrid",     href: componentHref("activity-grid", "patterns"),     keywords: "activity grid github contributions" },
  { kind: "Component", label: "GradientAvatar",   href: componentHref("gradient-avatar", "patterns"),   keywords: "gradient avatar seed animal identity" },
  { kind: "Component", label: "EmptyState",       href: componentHref("empty-state", "patterns"),       keywords: "empty state no messages waiting icon" },

  /* ── Components: Charts ──────────────────────────────────────────── */
  { kind: "Component", label: "Area chart",       href: componentHref("chart", "charts"),               keywords: "area chart recharts line smooth" },
  { kind: "Component", label: "Bar chart",        href: componentHref("chart", "charts"),               keywords: "bar chart recharts" },

  /* ── Components: House ───────────────────────────────────────────── */
  { kind: "Component", label: "DetailHeader",     href: componentHref("detail-header", "house"),        keywords: "detail header badge meta actions" },
  { kind: "Component", label: "Section (panel)",  href: componentHref("section", "house"),              keywords: "section settings panel title description action" },
  { kind: "Component", label: "EventTimeline",    href: componentHref("event-timeline", "house"),       keywords: "event timeline tone verified pending failed" },

  /* ── Components: Layouts ─────────────────────────────────────────── */
  { kind: "Component", label: "HeroSection",      href: componentHref("hero-section", "layouts"),       keywords: "hero section full bleed chart layout" },
  { kind: "Component", label: "CenteredFocal",    href: componentHref("centered-focal", "layouts"),     keywords: "centered focal tool waiting first run" },
  { kind: "Component", label: "SplitWithRail",    href: componentHref("split-with-rail", "layouts"),    keywords: "split rail summary column archetype" },
  { kind: "Component", label: "TimelineRail",     href: componentHref("timeline-rail", "layouts"),      keywords: "timeline rail groups items connectors terminal" },

  /* ── Foundation / Libraries ──────────────────────────────────────── */
  { kind: "Component", label: "Foundation",       href: "/components/foundation",                       keywords: "tokens css variables brand radius colors" },
  { kind: "Component", label: "cn() utility",     href: "/components/utils",                            keywords: "cn clsx tailwind merge utils" },
  { kind: "Component", label: "Anonymous identity", href: "/components/identity",                       keywords: "animal name gradient identity seed deterministic" },
];
