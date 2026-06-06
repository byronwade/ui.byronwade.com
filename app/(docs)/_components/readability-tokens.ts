/* Evidence-backed decisions encoded in byronwade/ui foundation. */

export type DesignDecision = {
  step: string
  title: string
  because: string
  weChose: string
  source: string
  href: string
}

/** Why byronwade/ui took this road — research → decision → utility. */
export const DESIGN_DECISIONS: DesignDecision[] = [
  {
    step: "01",
    title: "Two lanes, not one typeface",
    because:
      "Bernard et al. found no objective speed difference between serif and sans on screens at 12pt — but Wallace et al. showed up to 35% speed variation between fonts per individual. Voice matters; a single global body font does not.",
    weChose:
      "UI lane (`font-sans`, compact tracking) for chrome. Reading lanes (`reading-ui`, `reading-prose`) for copy meant to be read.",
    source: "Bernard 2003 · Wallace TOCHI 2022",
    href: "http://shaunwallace.org/files/Readability__TOCHI.pdf",
  },
  {
    step: "02",
    title: "65 characters, not full bleed",
    because:
      "Dyson & Haselgrove measured best comprehension at ~55 CPL; typographic consensus sits at 50–75. WCAG caps at 80ch for accessibility.",
    weChose:
      "`reading-measure`, `reading-ui`, and `reading-prose` all cap at 65ch — inside the sweet spot with headroom below the WCAG ceiling.",
    source: "Dyson & Haselgrove 2001 · WCAG 1.4.8",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S1071581901904586",
  },
  {
    step: "03",
    title: "1.6–1.7 line height, not browser default",
    because:
      "Browsers default to ~1.2. WCAG requires ≥1.5× within paragraphs; wider measure needs more vertical rhythm to track the next line.",
    weChose:
      "Foundation body at 1.6. `reading-ui` at 1.6 (16px sans). `reading-prose` at 1.7 (18px serif).",
    source: "WCAG 2.2 SC 1.4.8",
    href: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html",
  },
  {
    step: "04",
    title: "18px serif for essays, 16px sans for docs",
    because:
      "10pt anti-aliased Arial read slowest in Bernard’s display study; 12pt+ performed best. Long-form editorial voice benefits from serif warmth without claiming serif is faster.",
    weChose:
      "`reading-prose` ships 1.125rem EB Garamond. `reading-ui` ships 1rem Geist Sans for neutral docs.",
    source: "Bernard et al. 2003",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S1071581903001216",
  },
  {
    step: "05",
    title: "Reset tracking on reading surfaces",
    because:
      "Foundation applies `-0.006em` on body for crisp UI density. Negative tracking on long measures increases fatigue.",
    weChose:
      "`letter-spacing: 0` on both reading utilities — UI tightness stays in dashboards, not in paragraphs.",
    source: "WCAG 1.4.8 spacing guidance",
    href: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html",
  },
  {
    step: "06",
    title: "Token contrast, not paper cosplay",
    because:
      "E-ink palettes (sepia, 16-gray ramps) look flat on emissive LCD/OLED. Readable web text needs semantic foreground on background at ≥4.5:1.",
    weChose:
      "Warm paper neutrals via `--foreground` / `--background` tokens. No e-ink simulation utilities.",
    source: "WCAG 2.2 SC 1.4.3",
    href: "https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html",
  },
  {
    step: "07",
    title: "No readability hacks",
    because:
      "Bionic Reading showed no significant speed benefit in controlled studies (Acta Psychologica 2024; Readwise n≈2,000).",
    weChose:
      "No bold-first-word patterns, no faux-ink filters — measure and rhythm only.",
    source: "Bernard, Acta Psychologica 2024",
    href: "https://www.sciencedirect.com/science/article/pii/S0001691824001811",
  },
]

export type ReadingLane = {
  id: "ui" | "docs" | "essay"
  label: string
  utility: string
  spec: string
  className: string
}

export const READING_LANES: ReadingLane[] = [
  {
    id: "ui",
    label: "UI lane",
    utility: "font-sans · text-sm",
    spec: "Dashboards, forms, tables — compact, scannable",
    className: "text-sm leading-normal tracking-tight",
  },
  {
    id: "docs",
    label: "Docs lane",
    utility: "reading-ui",
    spec: "65ch · 16px sans · 1.6 lh · 1.5em paragraph gap",
    className: "reading-ui",
  },
  {
    id: "essay",
    label: "Essay lane",
    utility: "reading-prose",
    spec: "65ch · 18px serif · 1.7 lh · 1.5em paragraph gap",
    className: "reading-prose",
  },
]

export const SAMPLE_PARAGRAPH =
  "Calm software should still be readable software. When someone sits down to read — not scan a dashboard, but actually read — the measure, size, and rhythm matter more than the accent color. That is why we ship reading utilities in foundation instead of leaving every product to rediscover the same research."

export const SAMPLE_FOLLOWUP =
  "The UI lane stays tight for density. The reading lanes open up: sixty-five characters wide, generous line height, neutral tracking, token contrast. Same palette, different job."

export const MEASURE_PRESETS = [
  { label: "Narrow · 45ch", ch: 45 },
  { label: "Optimal · 65ch", ch: 65 },
  { label: "WCAG max · 80ch", ch: 80 },
] as const

export const LINE_HEIGHTS = [1.4, 1.5, 1.6, 1.7, 1.85] as const
export const FONT_SIZES = [16, 17, 18, 20, 22] as const

export const RESEARCH_SOURCES = [
  {
    label: "The Readability Consortium",
    href: "https://thereadabilityconsortium.org/",
    note: "Adobe · Google · UCF",
  },
  {
    label: "Wallace et al., TOCHI 2022",
    href: "http://shaunwallace.org/files/Readability__TOCHI.pdf",
    note: "35% personal font speed range",
  },
  {
    label: "Dyson & Haselgrove, 2001",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S1071581901904586",
    note: "55 CPL optimal",
  },
  {
    label: "Bernard et al., 2003",
    href: "https://www.sciencedirect.com/science/article/abs/pii/S1071581903001216",
    note: "Display type size baseline",
  },
  {
    label: "WCAG 2.2 SC 1.4.8",
    href: "https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html",
    note: "80ch · 1.5× lh · paragraph spacing",
  },
]
