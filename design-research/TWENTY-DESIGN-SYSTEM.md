# Twenty (twenty.com) — Design System Teardown

> A full reverse-engineering of **Twenty's** visual & product design language — the open-source
> CRM ("the open alternative to Salesforce, designed for AI") by **twentyhq**. Unlike a closed
> marketing site, Twenty is **fully open source (AGPL-3.0)**, so this teardown is read directly from
> the **actual shipping source code** in `github.com/twentyhq/twenty` — the TypeScript theme
> constants, component primitives, and package manifests. These are the real values the product
> compiles, not inferred guesses.
>
> **Method:** tokens below are read directly from the design-system package at
> `packages/twenty-ui/src/theme/constants/*.ts` (color, typography, spacing, radius, shadow,
> animation), plus component source under `packages/twenty-ui*/src/`, the `@radix-ui/colors`
> dependency they build on, and the live marketing site (`twenty.com`). Captured June 2026.
> **Stack:** React + Recoil + **Emotion** CSS-in-JS (mid-migration to **Linaria** zero-runtime +
> CSS variables), an **Nx monorepo**, NestJS + GraphQL backend. Tokens are **TypeScript objects**,
> not CSS custom properties — captured faithfully in that form.

---

## 0. TL;DR — the design in one paragraph

Twenty's design is **calm, neutral, and Notion-like**: a near-monochrome gray product surface
carrying a **single indigo-blue accent** (`#3e63dd`), built almost entirely **on top of Radix
Colors' wide-gamut `display-p3` scales** rather than a hand-rolled palette. Type is **Inter** at just
**three weights** (400 / 500 / 600) on a compact scale, hierarchy coming from size and a tight `1.1`
heading leading rather than heavy weights. Geometry sits on a strict **4px spacing grid**
(`spacing(n) → n*4px`) with **small radii** (2 / 4 / 8px, jumping to 20 / 40 / pill for chips and
capsules). Unlike Cursor's shadow-free paper look, Twenty uses **real — but soft — layered box
shadows** for popovers and modals. Its single most distinctive product detail is a **27-color Radix
tag palette** (each label = Radix step-11 text on a step-3 tint) used to color-code CRM records —
the spiritual cousin of Airtable/Notion's colorful labels. And crucially, where Cursor's _brand_ is
light-only, **Twenty ships first-class light AND dark themes** as equal, mirror-image token sets. The
whole system is the product of a **Paris-based, design-led founding team** (YC S23) building a CRM
that "feels like Notion" — restrained chrome, vivid data.

---

## 1. Brand identity & philosophy

| Aspect                     | What Twenty does                                                                                                                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Company**                | **Twenty** (entity "twentyhq"), a **Paris, France** team. Founded **2023** by **Charles Bochet**, **Thomas des Francs**, and **Félix Malfait**. **Thomas des Francs leads design**; Bochet & Malfait lead engineering. **Y Combinator S23**.           |
| **Product framing**        | "**The #1 Open Source CRM**" / "the open alternative to Salesforce, **designed for AI**." Current homepage hero: _"Build your Enterprise CRM at AI Speed."_ Framed as a developer-owned, no-lock-in, customizable CRM platform.                        |
| **Origin story**           | Malfait complained about Salesforce on Hacker News ~7 years prior and was told "one day, someone will do better." Twenty is that answer — an open-source Salesforce challenger. Launched on HN as "Twenty.com (YC S23) – Open-source CRM" (July 2023). |
| **Voice**                  | Plain, technical, developer-empathetic, confident-without-hyperbole. "Stop fighting custom. Start building, with Twenty." "Stop settling for trade-offs." Leads with developer control and openness.                                                   |
| **Aesthetic stance**       | **Notion-like minimalism** with **Airtable/Linear structured-data** sensibility. Clean white (or near-black) canvas, whitespace-heavy, dashboard-forward. Complexity lives in information architecture, not ornament. "Built to feel like Notion."     |
| **Design DNA in one line** | Neutral gray chrome + one indigo accent + a big colorful Radix tag palette for data, set in Inter on a 4px grid, shipped in symmetric light/dark.                                                                                                      |
| **License / openness**     | **AGPL-3.0** (copyleft even when run as a hosted service) — the openness _is_ part of the brand. TypeScript throughout, 300+ contributors, tens of thousands of GitHub stars.                                                                          |

### 1.1 Provenance — design-led, Radix-founded

Twenty's identity is not a foundry rebrand (contrast Cursor's Kimera commission). It is an
**engineering-and-design house style** that grew with the open-source codebase, led internally by
co-founder **Thomas des Francs**. The defining technical decision is that the **color foundation is
delegated to [Radix Colors](https://www.radix-ui.com/colors)** — Twenty imports `@radix-ui/colors`
and consumes its full perceptual scales wholesale (see §2). This buys them, for free: a 12-step
perceptual ramp per hue, automatic light/dark pairs, alpha variants, and — notably — **`display-p3`
wide-gamut** values. So Twenty's "brand palette" is really _Radix's_ palette, **curated and
semantically mapped**, with one hue (**indigo**) elevated to "the accent."

### 1.2 Two themes, mirror-image palettes (NOT two opposite surfaces)

Where Cursor splits into _two opposite surfaces_ (light brand vs dark editor), Twenty's split is
simpler and more conventional: **one product, two equal themes.**

| Surface                           | Mode                 | Palette                                                                                  |
| --------------------------------- | -------------------- | ---------------------------------------------------------------------------------------- |
| **Marketing site** (`twenty.com`) | **Light** (primary)  | Clean white, dark-charcoal text, subtle blue/gray accents, Inter.                        |
| **The app / CRM** (the product)   | **Light _and_ Dark** | Two full token sets (`THEME_LIGHT` / `THEME_DARK`) — user-switchable, equal first-class. |

The light and dark themes are **structurally identical** — every constant has a `*Light.ts` and a
`*Dark.ts` twin (`GrayScaleLight`/`GrayScaleDark`, `BackgroundLight`/`BackgroundDark`, etc.), merged
through a shared `ThemeCommon`. Dark mode is not an afterthought; it is a co-equal compiled theme.

### 1.3 Design DNA (the rules the system obeys)

1. **Radix-Colors-native.** Don't invent grays or hues — map **Radix `display-p3` scales** to
   semantic roles. The 12-step structure (1–2 backgrounds, 3–5 component fills, 6–8 borders,
   9–10 solid, 11–12 text) is the grammar.
2. **Neutral chrome, one accent.** The UI is built from a gray ladder; **indigo** is the lone accent
   (`accent.*` = Radix indigo). Color enters mainly through **record tags**, not chrome.
3. **4px everything.** `spacing(n)` returns `n × 4px`. The whole layout snaps to a 4px grid.
4. **Inter, three weights.** 400 / 500 / 600 only. No bold display weights; hierarchy from size +
   tight leading.
5. **Symmetric light/dark.** Every token has a light and dark twin. Theming is a swap, not a patch.
6. **Soft real depth.** Subtle layered shadows (not Cursor's zero-shadow paper) for popovers/modals.

---

## 2. Color system

### 2.1 The foundation — Radix Colors in `display-p3`

The single most important fact about Twenty's color: **it is Radix Colors.** The palette file imports
the P3 variants of Radix's scales and re-exports them under friendlier names.

`packages/twenty-ui/src/theme/constants/MainColorsLight.ts`:

```ts
import * as RadixColors from "@radix-ui/colors"
export const MAIN_COLORS_LIGHT = {
  // Reds
  red: RadixColors.redP3.red9,
  ruby: RadixColors.rubyP3.ruby9,
  crimson: RadixColors.crimsonP3.crimson9,
  tomato: RadixColors.tomatoP3.tomato9,
  // Oranges & Yellows
  orange: RadixColors.orangeP3.orange9,
  amber: RadixColors.amberP3.amber9,
  yellow: RadixColors.yellowP3.yellow9,
  // Greens
  lime: RadixColors.limeP3.lime9,
  grass: RadixColors.grassP3.grass9,
  green: RadixColors.greenP3.green9,
  jade: RadixColors.jadeP3.jade9,
  mint: RadixColors.mintP3.mint9,
  // Cyans & Blues
  turquoise: RadixColors.tealP3.teal9,
  cyan: RadixColors.cyanP3.cyan9,
  sky: RadixColors.skyP3.sky9,
  blue: RadixColors.indigoP3.indigo9, // ← "blue" is Radix INDIGO, not Radix blue
  // Purples & Pinks
  iris: RadixColors.irisP3.iris9,
  violet: RadixColors.violetP3.violet9,
  purple: RadixColors.purpleP3.purple9,
  plum: RadixColors.plumP3.plum9,
  pink: RadixColors.pinkP3.pink9,
  // Earth tones & Neutrals
  bronze: RadixColors.bronzeP3.bronze9,
  gold: RadixColors.goldP3.gold9,
  brown: RadixColors.brownP3.brown9,
  gray: GRAY_SCALE_LIGHT.gray9,
}
```

> **Key insight #1:** Twenty's "**blue**" is Radix **indigo** (`indigoP3.indigo9`), not Radix's own
> `blue`. So the signature accent reads as a slightly violet, trustworthy indigo rather than a pure
> cyan-blue.
>
> **Key insight #2:** every named color resolves to the Radix **step 9** (the most saturated "solid"
> step). The full 1–12 ramps for each hue live in `SecondaryColorsLight.ts` as `red1…red12`,
> `blue1…blue12`, etc.

**Resolved hex (sRGB) for the key step-9 colors** (P3 source in parentheses — these are the actual
strings shipped, since the repo uses the P3 scales):

| Semantic name      | Radix source         | sRGB hex  | `display-p3` (shipped)                |
| ------------------ | -------------------- | --------- | ------------------------------------- |
| **blue / accent**  | `indigoP3.indigo9`   | `#3e63dd` | `color(display-p3 0.276 0.384 0.837)` |
| **red**            | `redP3.red9`         | `#e5484d` | `color(display-p3 0.83 0.329 0.324)`  |
| **green**          | `greenP3.green9`     | `#30a46c` | `color(display-p3 0.332 0.634 0.442)` |
| **grass**          | `grassP3.grass9`     | `#46a758` | `color(display-p3 0.38 0.647 0.378)`  |
| **orange**         | `orangeP3.orange9`   | `#f76b15` | `color(display-p3 0.9 0.45 0.2)`      |
| **yellow**         | `yellowP3.yellow9`   | `#ffe629` | `color(display-p3 1 0.92 0.22)`       |
| **amber**          | `amberP3.amber9`     | `#ffc53d` | `color(display-p3 1 0.77 0.26)`       |
| **tomato**         | `tomatoP3.tomato9`   | `#e54d2e` | `color(display-p3 0.831 0.345 0.231)` |
| **crimson**        | `crimsonP3.crimson9` | `#e93d82` | `color(display-p3 0.843 0.298 0.507)` |
| **purple**         | `purpleP3.purple9`   | `#8e4ec6` | `color(display-p3 0.523 0.318 0.751)` |
| **violet**         | `violetP3.violet9`   | `#6e56cf` | `color(display-p3 0.417 0.341 0.784)` |
| **teal/turquoise** | `tealP3.teal9`       | `#12a594` | `color(display-p3 0.297 0.637 0.581)` |

The full Radix hue set Twenty exposes (each as a 12-step ramp): **gray, mauve, slate, sage, olive,
sand, tomato, red, ruby, crimson, pink, plum, purple, violet, iris, cyan, turquoise (teal), sky,
blue (indigo), jade, green, grass, mint, lime, bronze, gold, brown, orange, amber, yellow** — ~30
hues × 12 steps available to the theme.

### 2.2 Grayscale — a custom P3 ramp (the one place they don't use Radix gray)

The neutral chrome is the one scale Twenty hand-authors (in `display-p3`), giving precise control of
the product's "paper." `GrayScaleLight.ts`:

```ts
export const GRAY_SCALE_LIGHT = {
  gray1: "color(display-p3 1 1 1)", // pure white
  gray2: "color(display-p3 0.988 0.988 0.988)",
  gray3: "color(display-p3 0.976 0.976 0.976)",
  gray4: "color(display-p3 0.945 0.945 0.945)",
  gray5: "color(display-p3 0.922 0.922 0.922)",
  gray6: "color(display-p3 0.839 0.839 0.839)",
  gray7: "color(display-p3 0.8 0.8 0.8)",
  gray8: "color(display-p3 0.702 0.702 0.702)",
  gray9: "color(display-p3 0.6 0.6 0.6)",
  gray10: "color(display-p3 0.514 0.514 0.514)",
  gray11: "color(display-p3 0.4 0.4 0.4)",
  gray12: "color(display-p3 0.2 0.2 0.2)", // darkest text (NOT pure black)
}
```

`GrayScaleDark.ts` — the inverted twin (note it is **not** a simple numeric mirror; the dark ramp is
hand-tuned for emissive screens):

```ts
export const GRAY_SCALE_DARK = {
  gray1: "color(display-p3 0.09 0.09 0.09)", // near-black canvas (NOT pure black)
  gray2: "color(display-p3 0.106 0.106 0.106)",
  gray3: "color(display-p3 0.098 0.098 0.098)",
  gray4: "color(display-p3 0.114 0.114 0.114)",
  gray5: "color(display-p3 0.133 0.133 0.133)",
  gray6: "color(display-p3 0.282 0.282 0.282)",
  gray7: "color(display-p3 0.298 0.298 0.298)",
  gray8: "color(display-p3 0.4 0.4 0.4)",
  gray9: "color(display-p3 0.506 0.506 0.506)",
  gray10: "color(display-p3 0.482 0.482 0.482)",
  gray11: "color(display-p3 0.702 0.702 0.702)",
  gray12: "color(display-p3 0.922 0.922 0.922)", // lightest text (NOT pure white)
}
```

There are also **alpha** variants (`GrayScaleLightAlpha` / `GrayScaleDarkAlpha`) used for shadows and
translucent overlays, and `TransparentColors*` for tinted glass fills.

> **Like Cursor, Twenty avoids pure black/white for the canvas and text** — `gray1`/`gray12` cap at
> P3 white and `0.2` ink in light mode, and `0.09`/`0.922` in dark. Soft, never harsh.

### 2.3 Semantic background ladder

`BackgroundLight.ts` / `BackgroundDark.ts` map the gray ramp to surface roles:

```ts
// BACKGROUND_LIGHT
primary:            gray1,   // main canvas (white)
secondary:          gray2,
tertiary:           gray4,
quaternary:         gray5,
invertedPrimary:    gray12,  // dark chip on light
invertedSecondary:  gray11,
danger:             red3,
transparent: {
  primary:   whiteP3A.whiteA7,   secondary: whiteP3A.whiteA6,
  strong:    gray7(alpha),       medium:    gray5(alpha),
  light:     gray2(alpha),       lighter:   gray1(alpha),
  danger:    red3(alpha),        blue:      blue3(alpha),
  orange:    orange3(alpha),     success:   green3(alpha),
},
overlayPrimary:   gray11(alpha), overlaySecondary: gray9(alpha), overlayTertiary: gray4(alpha),
radialGradient:   'radial-gradient(50% 62.62% at 50% 0%, gray9 0%, gray10 100%)',
radialGradientHover: 'radial-gradient(76.32% 95.59% at 50% 0%, gray10 0%, gray11 100%)',
primaryInverted:  gray12, primaryInvertedHover: gray11,
```

In **dark**, the same keys point at the dark ramp, and the transparent overlays swap white→black
(`blackP3A.blackA7/A6`), with `overlayPrimary: '#000000b8'`. The `radialGradient` (used on primary
buttons / inverted surfaces) is identical in structure across themes.

### 2.4 Accent (indigo) — the one brand color

`AccentLight.ts` / `AccentDark.ts`:

```ts
export const ACCENT_LIGHT = {
  primary:     COLOR_LIGHT.blue5,   // indigo5 — a light indigo wash (selected/active fills)
  secondary:   COLOR_LIGHT.blue5,
  tertiary:    COLOR_LIGHT.blue3,
  quaternary:  COLOR_LIGHT.blue2,
  accent3570:  COLOR_LIGHT.blue8,
  accent4060:  COLOR_LIGHT.blue8,
  accent1:  indigoP3.indigo1,  …  accent12: indigoP3.indigo12,  // full indigo ramp
};
```

The full indigo 1–12 ramp is exposed as `accent1…accent12` for hovers, focus rings, links, and
selected rows. `THEME_COMMON.buttons.secondaryTextColor` is `ACCENT_DARK.accent11` — i.e. the indigo
step-11 is the "linky" secondary-button text. The **solid brand indigo is `indigo9 = #3e63dd`**.

### 2.5 The tag palette — Twenty's signature detail (the "colorful data" layer)

This is Twenty's equivalent of Cursor's agent-timeline pastels — but far bigger and central to the
product. CRM records (statuses, labels, select fields) are color-coded from a **27-color tag
palette**, each defined as **Radix step-11 text on a step-3 background** for guaranteed contrast.
`TagLight.ts`:

```ts
export const TAG_LIGHT = {
  text: {
    // Radix step 11 — readable colored text
    gray: gray11,
    mauve: mauve11,
    slate: slate11,
    sage: sage11,
    olive: olive11,
    sand: sand11,
    tomato: tomato11,
    red: red11,
    ruby: ruby11,
    crimson: crimson11,
    pink: pink11,
    plum: plum11,
    purple: purple11,
    violet: violet11,
    iris: iris11,
    cyan: cyan11,
    turquoise: turquoise11,
    sky: sky11,
    blue: blue11,
    jade: jade11,
    green: green11,
    grass: grass11,
    mint: mint11,
    lime: lime11,
    bronze: bronze11,
    gold: gold11,
    brown: brown11,
    orange: orange11,
    amber: amber11,
    yellow: yellow11,
  },
  background: {
    /* same 27 keys → Radix step 3 (soft tint) */
  },
}
```

This **step-11-on-step-3** recipe is the Radix-idiomatic "low-contrast tinted chip," and it's used
everywhere records carry a category. It is the visual signature that makes Twenty read as
"Airtable/Notion-colorful" while the chrome stays neutral.

### 2.6 Borders

`BorderCommon.ts` (shared radius) + `BorderLight.ts`:

```ts
// BORDER_LIGHT.color
strong:             gray6,
medium:             gray5,
light:              gray4,
secondaryInverted:  gray11,
inverted:           gray12,
danger:             red5,
blue:               blue7,             // indigo7 focus/active borders
transparentStrong:  gray4(alpha),
```

Borders are hairline gray steps (4/5/6) — quiet separators, with `blue` (indigo7) reserved for focus
and `danger` (red5) for errors.

### 2.7 Code / syntax

There are dedicated `CodeLight.ts` / `CodeDark.ts` constants for inline code and code blocks (plus
`SnackBarLight/Dark` for toasts and `IllustrationIcon*` for empty-state art), all following the same
Radix-mapped, theme-paired pattern.

---

## 3. Typography

### 3.1 The typeface — Inter, full stop

`FontCommon.ts`:

```ts
export const FONT_COMMON = {
  size: {
    xxs: "0.625rem", // 10px
    xs: "0.85rem", // ~13.6px
    sm: "0.92rem", // ~14.7px
    md: "1rem", // 16px (base)
    lg: "1.23rem", // ~19.7px
    xl: "1.54rem", // ~24.6px
    xxl: "1.85rem", // ~29.6px
  },
  weight: { regular: 400, medium: 500, semiBold: 600 },
  family: "Inter, sans-serif",
}
```

- **One UI typeface: Inter.** No custom proprietary face (contrast Cursor's CursorGothic), no serif
  editorial lane, no separate marketing display font in the design system. The marketing site
  (`twenty.com`) reads as the same modern sans (Inter or near-twin). This is a deliberately
  un-precious, "get out of the way" type choice — fitting the Notion-like, data-first product.
- **Three weights only:** `regular 400`, `medium 500`, `semiBold 600`. **No 700 bold.** Like Cursor,
  hierarchy is expressed through **size and weight-500/600**, never heavy display bold.
- **Mono:** code surfaces use a monospace via the `Code*` constants / component styles (system mono
  stack); there is no premium paid mono à la Cursor's Berkeley Mono.

### 3.2 Type scale — compact, ratio ≈ 1.25

The scale is **dense and product-oriented** (10 → ~30px), not a sprawling display scale. The biggest
in-app token is `xxl` ≈ 29.6px; large marketing headlines are set ad-hoc above the token scale on
the website. Steps climb by roughly a **1.25 ratio** (`0.625 → 0.85 → 0.92 → 1 → 1.23 → 1.54 → 1.85`
rem). Note the unusual fractional rem sizes (`0.85`, `0.92`, `1.23`, `1.54`, `1.85`) — hand-tuned
rather than a clean modular scale.

### 3.3 Line-height (leading)

`Text.ts`:

```ts
export const TEXT = {
  lineHeight: { lg: 1.5, md: 1.1 },
  iconSizeMedium: 16,
  iconSizeSmall: 14,
  iconStrikeLight: 1.6,
  iconStrikeMedium: 2,
  iconStrikeBold: 2.5,
}
```

Only two leadings: **`md: 1.1`** (tight — headings, single-line UI, table cells) and **`lg: 1.5`**
(comfortable — body / multi-line copy). The tight `1.1` default is what gives the dense, table-heavy
CRM its compact rhythm.

### 3.4 Letter-spacing

Twenty does **not** ship a tracking-token scale (contrast Cursor's nine `--tracking-*` tokens). Inter
is used at its default metrics; tracking is left to the typeface. One less knob — consistent with the
"neutral, un-fussy" stance.

---

## 4. Spacing — a strict 4px grid (function-based)

Twenty's spacing is the simplest possible system: a **4px base unit exposed as a function**.
`ThemeCommon.ts`:

```ts
spacingMultiplicator: 4,
spacing: (...args: number[]) =>
  args.map((m) => `${m * 4}px`).join(' '),
betweenSiblingsGap: '2px',
```

- **`spacing(n)` → `n × 4px`.** `spacing(2)` = `8px`; `spacing(2, 4)` = `'8px 16px'` (multi-arg for
  shorthand padding/margin). The entire layout is multiples of **4px**.
- **`betweenSiblingsGap: 2px`** — a tiny, fixed 2px gap between adjacent siblings (e.g. stacked rows,
  button groups), a recurring micro-rhythm.

This is a **modular 4px grid** — pragmatic and conventional — versus Cursor's typographic
**baseline grid** (`1rem × 1.4` line unit subdivided into twelfths). Twenty optimizes for dense data
tables; Cursor optimizes for editorial vertical rhythm. Different problems, different grids.

Layout-scale spacing constants also live in `ThemeCommon`:

```ts
sidePanelWidth: '500px',
table: { horizontalCellMargin: '8px', checkboxColumnWidth: '32px', horizontalCellPadding: '8px' },
```

---

## 5. Radius, shadows, blur

### 5.1 Radius scale

`BorderCommon.ts`:

```ts
radius: {
  xs:     '2px',
  sm:     '4px',
  md:     '8px',
  xl:     '20px',    // note: NO "lg" — jumps 8 → 20
  xxl:    '40px',
  pill:   '999px',
  rounded:'100%',
},
```

Small, tight radii for chrome (`2 / 4 / 8px`), then a deliberate jump to **`xl: 20px`** and
**`xxl: 40px`** for pill-ish chips, search bars, and large capsules, plus `pill: 999px` (fully
rounded) and `rounded: 100%` (circles — avatars, icon buttons). The missing `lg` step (8 → 20) is a
real quirk of the scale.

### 5.2 Shadows — **real, layered, but soft** (the Cursor contrast)

Unlike Cursor (which uses essentially no shadows), Twenty builds genuine elevation with **multi-layer
box-shadows tinted with the gray-alpha ramp**. `BoxShadowLight.ts`:

```ts
export const BOX_SHADOW_LIGHT = {
  color: GRAY_SCALE_LIGHT_ALPHA.gray2,
  light: `0px 2px 4px 0px ${grayA2}, 0px 0px 4px 0px ${grayA5}`,
  strong: `2px 4px 16px 0px ${grayA7}, 0px 2px 4px 0px ${grayA5}`,
  underline: `0px 1px 0px 0px ${grayA9}`, // bottom hairline (inputs)
  superHeavy: `0px 0px 8px 0px ${grayA7}, 0px 8px 64px -16px ${grayA10}, 0px 24px 56px -16px ${grayA5}`,
}
```

Four named elevations: **`light`** (cards, hover lift), **`strong`** (popovers, dropdowns),
**`underline`** (a 1px bottom shadow for inputs/cells), and **`superHeavy`** (modals, command menu —
a 3-layer soft spread). `BoxShadowDark.ts` recreates the same four with **black alphas** via an
`RGBA('#000000', a)` helper (e.g. `light` = `rgba(0,0,0,.04)` + `rgba(0,0,0,.08)`; `strong` =
`.16` + `.08`). Depth is present but **gentle** — soft, low-alpha, never a hard drop shadow.

### 5.3 Blur

Dedicated `BlurLight.ts` / `BlurDark.ts` constants provide backdrop-blur values for glass surfaces
(overlays, the command menu, floating panels) — paired per theme like everything else.

---

## 6. Motion & animation

`Animation.ts` — refreshingly tiny:

```ts
export const ANIMATION = {
  duration: {
    instant: 0.075, // 75ms — micro toggles
    fast: 0.15, // 150ms — default UI transitions
    normal: 0.3, // 300ms — panels, modals
    slow: 1.5, // 1500ms — loaders, deliberate emphasis
  },
}
```

Plus a one-off in `ThemeCommon`: `clickableElementBackgroundTransition: 'background 0.1s ease'` — the
universal 100ms background fade on hoverable/clickable elements.

**Character:** fast and unfussy. `fast: 0.15s` is the workhorse (same ballpark as Cursor's ~0.14s),
`instant: 0.075s` for toggles, `normal: 0.3s` for larger surface changes, `slow: 1.5s` for loaders.
There is **no custom easing-token scale** — Twenty leans on simple `ease` defaults rather than
Cursor's signature spring `cubic-bezier(.25, 1, .5, 1)`. Motion is functional, not expressive.

---

## 7. Layout, containers, breakpoints

Key layout constants (`ThemeCommon.ts` + component conventions):

```ts
sidePanelWidth: '500px',                 // the record side panel
table: {
  horizontalCellMargin:  '8px',
  horizontalCellPadding: '8px',
  checkboxColumnWidth:   '32px',          // record-table select column
},
lastLayerZIndex: 2147483647,             // max int32 — the top stacking layer (tooltips/menus)
```

- **`sidePanelWidth: 500px`** — the slide-in record detail panel, a core CRM pattern.
- **Record-table metrics** are first-class tokens (8px cell padding/margin, 32px checkbox column) —
  unsurprising for a spreadsheet-grade data product.
- **`lastLayerZIndex: 2147483647`** (max 32-bit int) guarantees the topmost overlay layer.
- Responsive behavior is handled in-component via a `useIsMobile()` hook rather than a published
  breakpoint-token scale (contrast Cursor's explicit `--breakpoint-md: 660px` + container ladder).

---

## 8. Components & patterns

### 8.1 Button

`packages/twenty-ui-deprecated/src/input/button/components/Button/Button.tsx` — the shipping button.
Its prop matrix:

```ts
export type ButtonSize = "medium" | "small"
export type ButtonPosition = "standalone" | "left" | "middle" | "right" // for button GROUPS
export type ButtonVariant = "primary" | "secondary" | "tertiary"
export type ButtonAccent = "default" | "blue" | "danger"
// plus: inverted, fullWidth, soon, focus, disabled, isLoading, Icon, hotkeys, justify…
```

- **3 variants** (`primary` solid / `secondary` outlined / `tertiary` ghost) ×
  **3 accents** (`default` gray / `blue` indigo / `danger` red) × **2 sizes** (`medium`/`small`).
- **`position`** (`standalone | left | middle | right`) drives **segmented button groups** —
  middle/edge buttons share borders and selectively round corners, a Linear-like grouped control.
- **`soon`** renders a "Soon" badge (feature-flag affordance); **`hotkeys`** wires keyboard shortcuts
  into the button itself; **`inverted`** flips it for dark-on-light vs light-on-dark surfaces.
- Styling is computed in `computeButtonDynamicStyles(variant, accent, inverted, disabled, focus)` —
  a function returning `{ background, borderColor, boxShadow, color, hoverBackground,
activeBackground }`, resolved from theme tokens. Primary buttons use the inverted gray (`gray12`)
  background with the `radialGradient` for a subtle sheen.

> **Migration tell:** this file is authored with **`@linaria/react` `styled`** and pulls
> `themeCssVariables` from `@ui/theme-constants` — evidence Twenty is migrating its CSS-in-JS from
> **Emotion (runtime)** to **Linaria (zero-runtime) + CSS variables**. The presence of both
> `twenty-ui` (current) and `twenty-ui-deprecated` packages, plus a `@new-ui/theme` import alias in
> the constants, confirms an in-flight design-system refactor.

### 8.2 Tags / Chips — the data-coloring workhorse

The `Tag` component consumes `TAG_LIGHT`/`TAG_DARK` (§2.5): a rounded chip with **Radix step-11 text
on step-3 background**, in any of 27 colors. Used for record statuses, select/multi-select field
values, labels, and filters. This is the most-seen colored element in the product.

### 8.3 IconButton & icons — Tabler

Icons are **[Tabler Icons](https://tabler.io/icons)** via **`@tabler/icons-react ^3.31.0`** (declared
in `packages/twenty-ui/package.json`). `Icon.ts` standardizes sizing/stroke:

```ts
export const ICON = {
  size: { sm: 14, md: 16, lg: 20, xl: 24 },
  stroke: { sm: 1.6, md: 2, lg: 2.5 },
}
```

A consistent **2px stroke at 16px** is the default — Tabler's clean outline style matches the neutral
chrome. `IconButton` (square, `rounded`/`md` radius) is the icon-only action primitive. There are
also `AnimatedButton` and `MainButton` variants.

### 8.4 Record table & views

The defining product surface: a **spreadsheet-grade record table** (and Kanban/board views) with the
8px cell metrics and 32px checkbox column from §7. Real-time, inline-editable cells, sortable
columns, filter chips — the Airtable/Notion-database mental model the brand leans on.

### 8.5 Modal & overlays

`Modal.ts` size tokens:

```ts
size: {
  sm: { width: '300px' },
  md: { width: '400px' },
  lg: { width: '53%' },
  xl: { width: '1200px', height: '800px' },
  fullscreen: { width: '100dvw', height: '100dvh' },
},
```

Note `lg` is a **percentage** (`53%`) while others are fixed — and `fullscreen` uses dynamic viewport
units (`dvw`/`dvh`). Overlays sit under `superHeavy` shadow + backdrop blur.

### 8.6 Snackbar / toasts

`SnackBarLight.ts`/`SnackBarDark.ts` define toast tokens (success/error/info) — again Radix-mapped
and theme-paired.

---

## 9. Dark mode

Dark mode is **co-equal, not an afterthought** — the opposite of Cursor, whose _brand_ is light-only.
Twenty ships **`THEME_LIGHT` and `THEME_DARK`** as parallel objects, each composed from a shared
`THEME_COMMON` plus the theme-specific halves:

```ts
// ThemeLight.ts (ThemeDark.ts is the structural mirror)
export const THEME_LIGHT = {
  ...THEME_COMMON,
  accent: ACCENT_LIGHT,
  background: BACKGROUND_LIGHT,
  blur: BLUR_LIGHT,
  border: BORDER_LIGHT,
  boxShadow: BOX_SHADOW_LIGHT,
  font: FONT_LIGHT,
  name: "light",
  snackBar: SNACK_BAR_LIGHT,
  tag: TAG_LIGHT,
  code: CODE_LIGHT,
  IllustrationIcon: ILLUSTRATION_ICON_LIGHT,
  grayScale: GRAY_SCALE_LIGHT,
  color: COLOR_LIGHT,
}
```

Every constant has a `*Light`/`*Dark` twin. The **accent indigo `indigo9 = #3e63dd` is identical in
both themes** (Radix keeps step-9 hue constant light↔dark); what flips is the gray ramp, backgrounds,
borders, shadows (gray-alpha → black-alpha), and the tag/code/snackbar mappings. Dark canvas is
`gray1 = display-p3 0.09` (near-black, not pure black); dark text tops out at `gray12 = 0.922`
(off-white). Result: a calm, low-chroma dark that mirrors the light theme's structure exactly.

---

## 10. How to replicate Twenty's look (cheat sheet)

1. **Adopt Radix Colors (P3).** Install `@radix-ui/colors`, use the `*P3` scales. Map step **9** =
   "the solid color," **11** = colored text, **3** = soft tint, **6–8** = borders, **1–2** =
   backgrounds. Don't hand-mix hues.
2. **Pick indigo as the one accent.** `indigo9 = #3e63dd` for the brand/active color; expose the full
   `indigo1…12` ramp for hovers/focus/links. Everything else stays neutral gray.
3. **Hand-author a 12-step gray** in `display-p3` for chrome (white→`0.2` ink in light; `0.09`→`0.922`
   in dark). Never pure black/white.
4. **Type: Inter, weights 400/500/600 only.** Compact scale (~10→30px), leading `1.1` for
   dense/heading and `1.5` for body. No bold, no tracking tokens.
5. **Spacing: a 4px grid via `spacing(n) → n*4px`.** Add a fixed `2px` sibling gap for stacked rows.
6. **Radius:** `2 / 4 / 8px` for chrome, `20 / 40 / 999px` for chips & capsules, `100%` for avatars.
7. **Shadows: soft and layered**, tinted with gray-alpha (light) / black-alpha (dark). Four tiers:
   `light`, `strong`, `underline` (1px bottom), `superHeavy` (modals).
8. **Motion:** `0.075 / 0.15 / 0.3 / 1.5s`, plain `ease`, plus a universal `background 0.1s ease` on
   clickables. No fancy spring.
9. **Color the DATA, not the chrome.** A 27-color tag palette (step-11 on step-3) carries all the
   personality; the UI itself stays gray + one indigo.
10. **Ship light AND dark** as structural twins, not a patch — every token paired.

---

## 11. Source tokens — quick reference dump

```ts
// ---- Accent (the one brand color) ----
blue / accent  = RadixColors.indigoP3.indigo9   // #3e63dd / color(display-p3 0.276 0.384 0.837)
accent ramp    = indigo1 … indigo12             // hovers, focus, links, selected rows

// ---- Grayscale (light, display-p3) ----
gray1  = 1 1 1 (white)      gray9  = 0.6
gray2  = 0.988              gray10 = 0.514
gray3  = 0.976              gray11 = 0.4
gray4  = 0.945              gray12 = 0.2 (ink)
gray5  = 0.922  gray6 = 0.839  gray7 = 0.8  gray8 = 0.702
// Grayscale (dark): gray1 = 0.09 (canvas) … gray12 = 0.922 (text)

// ---- Semantic step-9 colors (sRGB) ----
red #e5484d   orange #f76b15   yellow #ffe629   amber #ffc53d
green #30a46c   grass #46a758   teal #12a594   tomato #e54d2e
crimson #e93d82   purple #8e4ec6   violet #6e56cf

// ---- Background roles (light) ----
primary=gray1  secondary=gray2  tertiary=gray4  quaternary=gray5  invertedPrimary=gray12

// ---- Border (light) ----
strong=gray6  medium=gray5  light=gray4  blue=indigo7  danger=red5  inverted=gray12

// ---- Typography ----
family: 'Inter, sans-serif'
size:   xxs .625 / xs .85 / sm .92 / md 1 / lg 1.23 / xl 1.54 / xxl 1.85 (rem)
weight: regular 400 / medium 500 / semiBold 600
lineHeight: md 1.1 / lg 1.5

// ---- Spacing ----
spacing(n) => `${n*4}px`   // 4px grid
betweenSiblingsGap: 2px

// ---- Radius ----
xs 2 / sm 4 / md 8 / xl 20 / xxl 40 / pill 999 / rounded 100%   (note: no "lg")

// ---- Shadow (light) ----
light:      0 2 4 grayA2, 0 0 4 grayA5
strong:     2 4 16 grayA7, 0 2 4 grayA5
underline:  0 1 0 grayA9
superHeavy: 0 0 8 grayA7, 0 8 64 -16 grayA10, 0 24 56 -16 grayA5

// ---- Motion ----
duration: instant .075 / fast .15 / normal .3 / slow 1.5 (s)
clickableElementBackgroundTransition: 'background 0.1s ease'

// ---- Layout ----
sidePanelWidth: 500px
table: { cellPadding 8px, cellMargin 8px, checkboxCol 32px }
lastLayerZIndex: 2147483647
modal: sm 300 / md 400 / lg 53% / xl 1200×800 / fullscreen 100dvw×100dvh

// ---- Icons ----
@tabler/icons-react   size sm14/md16/lg20/xl24   stroke sm1.6/md2/lg2.5
```

---

## 12. Product-specific surfaces & architecture notes

- **Record table / database views** are the heart of the product (table, Kanban/board), styled with
  the 8px cell metrics and the 27-color tag palette. Real-time, inline-editable, Airtable-like.
- **The 500px side panel** (record detail) is a defining navigational pattern.
- **Command menu / search** uses `superHeavy` shadow + backdrop blur + `lastLayerZIndex`.
- **"Designed for AI":** the current positioning adds a native **MCP server** and AI-agent affordances
  on top of the same neutral design system (no separate "agent palette" the way Cursor has timeline
  pastels — Twenty reuses the tag/Radix system).
- **Theming refactor in flight:** three coexisting layers — `twenty-ui` (current), `twenty-ui-deprecated`
  (still shipping components like Button), and a `@new-ui/theme` alias inside the constants — plus a
  visible migration from **Emotion → Linaria zero-runtime + CSS variables** (`themeCssVariables`).
  Treat exact file locations as version-sensitive.
- **Build/stack:** React + Recoil (state) + Emotion/Linaria (styling), Nx monorepo, NestJS + GraphQL
  backend, AGPL-3.0.

---

## 13. Accessibility, governance, and AI layer

Twenty's open-source nature makes its governance different from the closed systems in this research
set. The design system is not only a brand artifact; it is part of an AGPL-licensed product that
contributors can inspect and modify.

| Area                     | What Twenty does / should preserve                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------- |
| **Accessibility**        | Inter, Radix color scales, and high-contrast semantic surfaces give a strong foundation.          |
| **Dark mode**            | Light/dark themes are parallel, not an afterthought.                                              |
| **Data color**           | The 27-color tag palette makes records scannable, but labels need text/icons, not color alone.    |
| **Tables/views**         | Inline editing and dense CRM tables need keyboard paths, visible focus, and stable row metrics.   |
| **Open-source review**   | Token values and component behavior can be audited directly in source.                            |
| **Migration governance** | Emotion, Linaria, deprecated UI, and new UI theme layers must stay synchronized during refactors. |

### 13.1 AI layer

Twenty's current positioning says the product is "designed for AI" and includes MCP/agent
affordances, but its design system does not introduce a separate AI visual language. That is a
different choice from Cursor's agent activity palette.

The correct Twenty-like AI treatment is:

1. Keep the neutral CRM surface.
2. Use existing records, tables, side panels, comments, and tags.
3. Use the Radix/tag palette for data semantics, not decorative AI glow.
4. Make AI actions auditable through record history and linked objects.
5. Preserve the open-source product's pragmatic tone.

This is a good fit for CRM: AI should feel like a workflow layer over accounts, contacts, companies,
opportunities, and tasks, not like a separate assistant UI floating outside the data model.

---

## 14. Comparison to byronwade/ui

Twenty and byronwade/ui share several structural ideas: tokenized foundations, restrained UI, and a
strong separation between app chrome and readable content. They diverge most in color governance.

| Dimension          | Twenty                                                              | byronwade/ui                                                                                  |
| ------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Foundation**     | Radix Colors in `display-p3`, plus custom gray/background mappings. | Self-contained OKLCH foundation with semantic tokens and one re-skinnable `--brand`.          |
| **Accent**         | Indigo is the lone brand accent; tags use many Radix hues.          | `--brand` drives accent/ring/chart-1/success; chart ramp and activity pastels are exceptions. |
| **Data color**     | 27-color tag palette is central to CRM scanning.                    | Data color is semantic: success/destructive/chart/activity tokens, not arbitrary tag hues.    |
| **Typography**     | Inter, compact scale, pragmatic product UI.                         | Editorial DNA: sans for UI, mono for data, serif only for prose/quotes.                       |
| **Depth**          | Soft shadows for popovers/modals.                                   | Flat surfaces with `edge` inset hairline; no drop-shadow-led depth.                           |
| **Implementation** | Emotion/Linaria migration in an Nx product monorepo.                | shadcn registry; Base UI primitives, CVA variants, `data-slot`, token-only styling.           |

What byronwade/ui should borrow: Twenty's discipline around data density and open, inspectable
token contracts. What it should avoid: broad decorative tag palettes unless each color carries a
clear semantic role.

---

## 15. Sources & confidence

This teardown is **source-of-truth**: the values come from reading Twenty's **actual repository**
(the strongest possible evidence — the code that compiles into the product), not live CSS inspection
or third-party write-ups. Captured June 2026 from `github.com/twentyhq/twenty` (default branch).

**Primary / highest confidence — read directly from repo files:**

- `packages/twenty-ui/src/theme/constants/GrayScaleLight.ts`, `GrayScaleDark.ts` — gray ramps (P3).
- `…/MainColorsLight.ts`, `SecondaryColorsLight.ts` — Radix-Colors mapping; "blue" = indigo.
- `…/ColorsLight.ts`, `ColorsDark.ts` — palette composition.
- `…/AccentLight.ts`, `AccentDark.ts` — indigo accent ramp.
- `…/BackgroundLight.ts`, `BackgroundDark.ts` — surface roles, overlays, gradients.
- `…/BorderCommon.ts`, `BorderLight.ts` — radius scale + border colors.
- `…/BoxShadowLight.ts`, `BoxShadowDark.ts` — the four shadow tiers.
- `…/FontCommon.ts`, `Text.ts`, `FontLight.ts` — Inter, sizes, weights, line-heights, font colors.
- `…/Animation.ts` — duration tokens.
- `…/ThemeCommon.ts` — `spacing()`, `betweenSiblingsGap`, table metrics, `sidePanelWidth`, z-index.
- `…/TagLight.ts` — the 27-color tag palette (step-11 on step-3).
- `…/Modal.ts`, `Icon.ts`, `ThemeLight.ts` — modal sizes, icon sizing, theme composition.
- `packages/twenty-ui-deprecated/src/input/button/components/Button/Button.tsx` — button prop matrix.
- `packages/twenty-ui/package.json` — `@tabler/icons-react ^3.31.0`.
- `@radix-ui/colors` (`src/light.ts`, `src/dark.ts`) — resolved sRGB/P3 hex for step-9 colors
  (e.g. `indigo9 #3e63dd`, `red9 #e5484d`, `green9 #30a46c`, `orange9 #f76b15`, `yellow9 #ffe629`).

**Secondary / corroborated (high confidence, not from the repo):**

- Founding team, YC S23, Paris, AGPL-3.0, $5M seed (Runa Capital, Nov 2024):
  [Y Combinator](https://www.ycombinator.com/companies/twenty),
  [TechCrunch](https://techcrunch.com/2024/11/18/twenty-is-building-an-open-source-alternative-to-salesforce/),
  [Launch HN](https://news.ycombinator.com/item?id=36791434),
  [itsfoss](https://itsfoss.com/news/twenty-open-source-salesforce-alternative/).
- "Notion-style UI," Airtable/Linear mental model, "designed for AI":
  [twenty.com](https://twenty.com/), [GitHub repo](https://github.com/twentyhq/twenty).
- Marketing-site aesthetic (light, Inter, Notion-like minimalism, dark CTA buttons): live
  `twenty.com` inspection.

**Notes / caveats (version-sensitivity, not refutations):**

- ⚠️ Twenty is **mid-refactor**: `twenty-ui` vs `twenty-ui-deprecated` vs `@new-ui/theme`, and an
  **Emotion → Linaria** styling migration. Exact file paths and the runtime styling mechanism evolve
  per release — the **token values** are stable, the **plumbing** is moving.
- ⚠️ `ACCENT_*.primary` resolves to **indigo5** (a light wash) while the **solid brand indigo is
  indigo9 (`#3e63dd`)** — don't confuse the selected-fill accent with the brand color.
- ⚠️ The repo uses **`display-p3`** strings; the sRGB hexes in this doc are the Radix-published
  fallbacks for the same steps (handy for non-P3 contexts), not separate values.
- ⚠️ No published `--breakpoint-*` or tracking-token scales — responsiveness is `useIsMobile()`-driven
  and tracking is left to Inter's defaults.

**Contrast with Cursor (the companion teardown):** Twenty is **Radix-Colors-native** (Cursor
hand-rolls a single-ink `color-mix` system); **Inter** (Cursor ships a custom CursorGothic + Berkeley
Mono + EB Garamond); **4px modular grid** (Cursor a typographic baseline grid); **real soft shadows**
(Cursor essentially none); **first-class dark mode** (Cursor's brand is light-only); and a **27-color
data-tag palette** as its signature (Cursor's is a 4-color agent-timeline set). Both share: no pure
black/white, ~150ms default motion, restraint in weight (no 700 bold), and one disciplined accent.

---

_Stack confirmed by source: React + Recoil + Emotion (→ Linaria zero-runtime) CSS-in-JS, Nx monorepo,
`@radix-ui/colors` (display-p3) color foundation, Inter type, `@tabler/icons-react` icons, AGPL-3.0.
All token values above are read directly from `github.com/twentyhq/twenty`._
