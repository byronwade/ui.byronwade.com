# Vercel - Design System Teardown

> A full reverse-engineering of **Vercel's** visual and product design language, captured from the
> current `vercel.com` site, the public **Geist Design System** documentation, live computed CSS
> variables from `vercel.com/geist/colors`, and the official `geist` font package. This paper
> mirrors the Cursor, Twenty, Shopify, Atlassian, and Fluent 2 teardowns, but Vercel is a special
> case: its design system is both a public developer-tool aesthetic and an internal product system
> for the Vercel dashboard, Next.js ecosystem, v0, AI SDK, deployment workflows, and marketing pages.
>
> **Method:** foundations and usage guidance below are read from the live Vercel Design and Geist
> docs at `vercel.com/design`, `vercel.com/geist/introduction`, `vercel.com/geist/colors`,
> `vercel.com/geist/typography`, `vercel.com/geist/materials`, `vercel.com/geist/grid`,
> `vercel.com/geist/button`, and `vercel.com/font`. Exact token values are read from the rendered
> `:root` CSS variables on the live Geist site and from the current `geist@1.7.2` npm package.
> Captured June 2026.
>
> **Primary sources:** [Vercel Design](https://vercel.com/design),
> [Geist Design System](https://vercel.com/geist/introduction),
> [Geist Colors](https://vercel.com/geist/colors),
> [Geist Typography](https://vercel.com/geist/typography),
> [Geist Materials](https://vercel.com/geist/materials),
> [Geist Grid](https://vercel.com/geist/grid),
> [Geist Button](https://vercel.com/geist/button), [Geist Font](https://vercel.com/font), and the
> official `geist` npm package.

---

## 0. TL;DR - the design in one paragraph

Vercel's design language is **developer-tool minimalism with extreme craft discipline**. It is
mostly black, white, gray, borders, code, and silence. The product UI runs on **Geist**, a typeface
family Vercel created with Basement Studio: Geist Sans for interface and marketing text, Geist Mono
for code and technical metadata, and Geist Pixel for selective display moments. The live Geist site
uses a stark light surface (`--ds-background-100: hsla(0, 0%, 100%, 1)`) with near-black primary text
(`--ds-gray-1000: hsla(0, 0%, 9%, 1)`), a secondary page background
(`--ds-background-200: hsla(0, 0%, 98%, 1)`), low-alpha borders (`--ds-gray-alpha-200:
#00000014`), and a blue focus/link color (`--ds-blue-700: hsla(212, 100%, 48%, 1)`). Spacing is a
strict **4px scale** (`--geist-space: 4px`, then 8 / 12 / 16 / 24 / 32 / 40 / 64 / 96 / 128 / 192 /
256px). Radius is small (`--geist-radius: 6px`, `--geist-marketing-radius: 8px`) with pills reserved
for specific marketing buttons. Materials encode radii, fills, strokes, and shadows into named
surface roles: base, small, medium, large, tooltip, menu, modal, fullscreen. Components are direct
and developer-native: Button, Badge, Browser, Code, Code Block, Command Menu, Deployment Status,
File Tree, Grid, Input, Keyboard Input, Modal, Table, Tabs, Toast. The design DNA is simple:
**monochrome first, Geist everywhere, hairline borders, tiny radii, precise spacing, code as a
first-class visual object, and blue only when interaction or focus needs it.**

---

## 1. Brand identity & philosophy

| Aspect                     | What Vercel does                                                                                                                                                      |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company / product**      | Vercel builds the Frontend Cloud: infrastructure and developer experience for building, deploying, scaling, and securing modern web applications.                     |
| **Design-system name**     | **Geist** - Vercel's design system for building consistent web experiences.                                                                                           |
| **Design org framing**     | Vercel's design team says it "designs systems and systemizes designs" and acts as steward of the Vercel Brand and Geist Design System.                                |
| **Primary user context**   | Developers shipping sites, frameworks, functions, deployments, previews, AI apps, dashboards, docs, and infrastructure workflows.                                     |
| **Aesthetic stance**       | Reduction as premium signal: black/white/gray, code-first typography, hairline borders, grid structure, very little ornament.                                         |
| **Voice**                  | Short, technical, shipping-oriented. "What will you ship next?" "The Frontend Cloud." "Build, scale, and secure..."                                                   |
| **Interaction philosophy** | Fast, keyboard-friendly, status-rich developer tools: command menus, deployment cards, code snippets, copy buttons, file trees, tabs, toasts, and contextual actions. |
| **Design DNA in one line** | Geist type + monochrome surfaces + blue focus/link utility + exact spacing + code-native components + crafted marketing grids.                                        |

### 1.1 Vercel is not "blue SaaS"

The most important Vercel rule: **do not overuse blue**.

Vercel has blue tokens and uses blue for links, focus rings, and some ecosystem marks, but the
brand's dominant surface is black and white. Primary CTAs often become black fills on light surfaces
or white fills on dark surfaces. The Vercel triangle is black or white. The dashboard aesthetic is
driven by text, spacing, borders, and code, not a bright brand color flood.

### 1.2 Geist is both product system and brand signal

The Geist docs identify the system as:

| Resource     | Role                                                          |
| ------------ | ------------------------------------------------------------- |
| Brand Assets | Official brand marks and usage.                               |
| Icons        | Icon set tailored for developer tools.                        |
| Components   | Building blocks for React applications.                       |
| Colors       | High contrast, accessible color system.                       |
| Grid         | A major part of the current Vercel aesthetic.                 |
| Typeface     | Geist Sans and Geist Mono, designed for developers/designers. |

This is why Vercel is easier to reproduce than many brands but harder to fake. The visible style is
minimal, but the system is not empty. It is full of exact micro-decisions.

### 1.3 Product surfaces

| Surface                       | Visual mode                                                                                    |
| ----------------------------- | ---------------------------------------------------------------------------------------------- |
| **Marketing site**            | Large white/black polarity, full-width grids, dramatic whitespace, code/product demos.         |
| **Geist docs**                | Dense docs shell, left nav, component demos, live tokens, light/dark theme switcher.           |
| **Dashboard / app UI**        | Compact developer operations UI: projects, deployments, logs, domains, usage, teams, settings. |
| **Next.js / framework pages** | Vercel minimalism plus framework-specific marks and docs/code patterns.                        |
| **v0 / AI surfaces**          | Chat/prompt surfaces, generated UI previews, deployment handoff, code-oriented output.         |
| **AI SDK**                    | Technical landing/docs surfaces with code examples, model lists, tool-call and streaming UI.   |

The same grammar runs through all of them: border, type, code, metadata, status.

---

## 2. Token architecture

Vercel's rendered CSS exposes two overlapping token families:

| Token family       | Example                                         | Role                                                                  |
| ------------------ | ----------------------------------------------- | --------------------------------------------------------------------- |
| `--ds-*`           | `--ds-gray-1000`, `--ds-shadow-menu`            | Current design-system tokens for color, focus, shadows, motion.       |
| `--geist-*`        | `--geist-space-4x`, `--geist-form-height`       | Longstanding Geist spacing, form, layout, and legacy semantic tokens. |
| `--font-*`         | `--font-sans`, `--font-mono`                    | Typeface stacks and font-weight values.                               |
| Tailwind utilities | `text-heading-72`, `text-copy-14`, `material-*` | Public consumption surface in docs and component examples.            |

The live Geist page had **451 root CSS variables** at capture time. The important part is not the
raw count; it is that Vercel's UI is tokenized down to focus rings, shadows, material surfaces,
motion timings, and page widths.

### 2.1 Foundation tokens captured from the live site

| Token                       | Value                                                               |
| --------------------------- | ------------------------------------------------------------------- |
| `--ds-background-100`       | `hsla(0, 0%, 100%, 1)`                                              |
| `--ds-background-200`       | `hsla(0, 0%, 98%, 1)`                                               |
| `--ds-gray-1000`            | `hsla(0, 0%, 9%, 1)`                                                |
| `--ds-gray-900`             | `hsla(0, 0%, 30%, 1)`                                               |
| `--ds-gray-700`             | `hsla(0, 0%, 56%, 1)`                                               |
| `--ds-gray-alpha-200`       | `#00000014`                                                         |
| `--ds-blue-700`             | `hsla(212, 100%, 48%, 1)`                                           |
| `--ds-focus-ring`           | `0 0 0 2px hsla(0, 0%, 100%, 1), 0 0 0 4px hsla(212, 100%, 48%, 1)` |
| `--ds-page-width`           | `1400px`                                                            |
| `--geist-page-width`        | `1200px`                                                            |
| `--geist-page-margin`       | `24px`                                                              |
| `--geist-radius`            | `6px`                                                               |
| `--geist-marketing-radius`  | `8px`                                                               |
| `--geist-form-height`       | `40px`                                                              |
| `--geist-form-small-height` | `32px`                                                              |
| `--geist-form-large-height` | `48px`                                                              |

### 2.2 Consumption model

Geist docs say typography styles are consumed as Tailwind classes. Component examples likewise show
utility-first implementation patterns. That makes Geist more like a **design-system-backed Tailwind
language** than a public npm component library.

The practical consumption layers are:

1. **CSS variables** for raw tokens.
2. **Tailwind classes** for typography, spacing, grid, states, and layout.
3. **Geist components** documented at `vercel.com/geist/*`.
4. **Internal React components** for Vercel product surfaces.
5. **Public font package** for Geist Sans, Mono, and Pixel.

### 2.3 Public package reality

The official font package is public:

```json
{
  "name": "geist",
  "version": "1.7.2",
  "description": "Geist is a new font family for Vercel, created by Vercel in collaboration with Basement Studio.",
  "license": "SIL OPEN FONT LICENSE",
  "peerDependencies": {
    "next": ">=13.2.0"
  }
}
```

The current official Geist component library is documented publicly but not published as
`@vercel/geist` on npm. Third-party or old community packages exist, but they are not canonical for
this paper.

---

## 3. Color system

### 3.1 Color scale grammar

The Geist color docs state there are **10 color scales**, and P3 colors are used on supported
browsers and displays:

1. Backgrounds
2. Gray
3. Gray alpha
4. Blue
5. Red
6. Amber
7. Green
8. Teal
9. Purple
10. Pink

The numeric color grammar is:

| Range        | Role                               |
| ------------ | ---------------------------------- |
| Background 1 | Default page/component background. |
| Background 2 | Secondary background.              |
| Colors 1-3   | Component backgrounds.             |
| Colors 4-6   | Borders: default, hover, active.   |
| Colors 7-8   | High contrast backgrounds.         |
| Colors 9-10  | Accessible text and icons.         |

This is the key Geist color rule: each scale is not merely a palette. The steps have UI jobs.

### 3.2 Background and gray tokens

| Token                 | Value                  | Role                                     |
| --------------------- | ---------------------- | ---------------------------------------- |
| `--ds-background-100` | `hsla(0, 0%, 100%, 1)` | Default background.                      |
| `--ds-background-200` | `hsla(0, 0%, 98%, 1)`  | Secondary background.                    |
| `--ds-gray-100`       | `hsla(0, 0%, 95%, 1)`  | Very light component background.         |
| `--ds-gray-200`       | `hsla(0, 0%, 92%, 1)`  | Light hover/background.                  |
| `--ds-gray-300`       | `hsla(0, 0%, 90%, 1)`  | Light active/background.                 |
| `--ds-gray-500`       | `hsla(0, 0%, 79%, 1)`  | Mid-light border or disabled foreground. |
| `--ds-gray-700`       | `hsla(0, 0%, 56%, 1)`  | Muted text/icon.                         |
| `--ds-gray-900`       | `hsla(0, 0%, 30%, 1)`  | Strong secondary text.                   |
| `--ds-gray-1000`      | `hsla(0, 0%, 9%, 1)`   | Primary text / dark fill.                |

Note the top end: Vercel's primary text is not pure black in the `--ds-*` scale. It is `9%`
lightness. Legacy variables still expose `--geist-foreground: #000`, but the current design-system
gray scale is more nuanced.

### 3.3 Alpha gray tokens

| Token                  | Value       |
| ---------------------- | ----------- |
| `--ds-gray-alpha-100`  | `#0000000d` |
| `--ds-gray-alpha-200`  | `#00000014` |
| `--ds-gray-alpha-300`  | `#0000001a` |
| `--ds-gray-alpha-500`  | `#00000036` |
| `--ds-gray-alpha-700`  | `#00000070` |
| `--ds-gray-alpha-1000` | `#000000e8` |

These values explain Vercel's hairline border quality. A large amount of the interface is simply
black with very low alpha, layered over white or `98%` background.

### 3.4 Blue

| Token            | Value                     | Role                                   |
| ---------------- | ------------------------- | -------------------------------------- |
| `--ds-blue-100`  | `hsla(212, 100%, 97%, 1)` | Pale blue background.                  |
| `--ds-blue-400`  | `hsla(209, 100%, 90%, 1)` | Soft blue component surface.           |
| `--ds-blue-600`  | `hsla(208, 100%, 66%, 1)` | Mid blue accent.                       |
| `--ds-blue-700`  | `hsla(212, 100%, 48%, 1)` | Focus/link blue; `--geist-link-color`. |
| `--ds-blue-800`  | `hsla(212, 100%, 41%, 1)` | Darker interactive blue.               |
| `--ds-blue-1000` | `hsla(211, 100%, 15%, 1)` | Deep blue background or text on tint.  |

The captured focus color is `--ds-focus-color: hsla(212, 100%, 48%, 1)`, the same hue as
`--ds-blue-700`.

### 3.5 Status and accent scales

| Scale  | Light token/value                       | Strong token/value                     |
| ------ | --------------------------------------- | -------------------------------------- |
| Red    | `--ds-red-100: hsla(0,100%,97%,1)`      | `--ds-red-700: hsla(358,75%,59%,1)`    |
| Amber  | `--ds-amber-100: hsla(39,100%,95%,1)`   | `--ds-amber-700: hsla(39,100%,57%,1)`  |
| Green  | `--ds-green-100: hsla(120,60%,96%,1)`   | `--ds-green-700: hsla(131,41%,46%,1)`  |
| Teal   | `--ds-teal-100: hsla(169,70%,96%,1)`    | `--ds-teal-700: hsla(173,80%,36%,1)`   |
| Purple | `--ds-purple-100: hsla(276,100%,97%,1)` | `--ds-purple-700: hsla(272,51%,54%,1)` |
| Pink   | `--ds-pink-100: hsla(330,100%,96%,1)`   | `--ds-pink-700: hsla(336,80%,58%,1)`   |

Use these for semantic status, charts, labels, and product-specific accents. Do not let them become
general decoration.

### 3.6 Legacy semantic colors

The live page still exposes several `--geist-*` semantic colors:

| Token                      | Value     |
| -------------------------- | --------- |
| `--geist-success`          | `#0070f3` |
| `--geist-success-light`    | `#3291ff` |
| `--geist-success-dark`     | `#0761d1` |
| `--geist-error`            | `#e00`    |
| `--geist-error-light`      | `#ff1a1a` |
| `--geist-error-dark`       | `#c50000` |
| `--geist-warning`          | `#f5a623` |
| `--geist-warning-dark`     | `#ab570a` |
| `--geist-violet`           | `#7928ca` |
| `--geist-highlight-pink`   | `#ff0080` |
| `--geist-highlight-purple` | `#f81ce5` |
| `--geist-highlight-yellow` | `#fff500` |

These are useful when analyzing old Vercel surfaces, but the current Geist docs emphasize the
`--ds-*` scale grammar.

---

## 4. Typography

### 4.1 Typeface

Vercel's official font page says Geist was developed by Vercel for developers and designers. The
font package states it was created in collaboration with **Basement Studio**.

| Family      | Role                                                                                |
| ----------- | ----------------------------------------------------------------------------------- |
| Geist Sans  | Main UI, marketing copy, headings, labels, dashboard text.                          |
| Geist Mono  | Code editors, diagrams, terminals, logs, identifiers, snippets, technical metadata. |
| Geist Pixel | Decorative display moments: headlines, logos, special visual moments.               |

The font page lists:

- **9 weights**
- **652 glyphs**
- **9 stylistic sets**
- **32 languages**
- Cap height **710**
- X-height **530**
- Baseline **0**
- Descender **-150**

### 4.2 Official package exports

`geist@1.7.2` exports:

```ts
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel"
```

The variable font exports use:

```ts
GeistSans: weight "100 900", variable "--font-geist-sans"
GeistMono: weight "100 900", variable "--font-geist-mono"
```

Geist Pixel variants use weight `500` and variables:

| Export               | CSS variable                  |
| -------------------- | ----------------------------- |
| `GeistPixelSquare`   | `--font-geist-pixel-square`   |
| `GeistPixelGrid`     | `--font-geist-pixel-grid`     |
| `GeistPixelCircle`   | `--font-geist-pixel-circle`   |
| `GeistPixelTriangle` | `--font-geist-pixel-triangle` |
| `GeistPixelLine`     | `--font-geist-pixel-line`     |

### 4.3 Live font stacks

The rendered Geist site exposes:

```css
--font-sans:
  "Geist", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
  "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
  sans-serif;

--font-mono:
  "Geist Mono", Menlo, Monaco, Lucida Console, Liberation Mono,
  DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
```

The body computed style on the Geist page was:

```css
font-family:
  Geist,
  Inter,
  -apple-system,
  "system-ui",
  "Segoe UI",
  Roboto,
  Oxygen,
  Ubuntu,
  Cantarell,
  "Fira Sans",
  "Droid Sans",
  "Helvetica Neue",
  sans-serif;
color: rgb(23, 23, 23);
background: rgb(255, 255, 255);
```

### 4.4 Typography classes

The Geist typography docs say styles are consumed as Tailwind classes that pre-set
`font-size`, `line-height`, `letter-spacing`, and `font-weight`.

#### Headings

| Class             | Usage from docs                                        |
| ----------------- | ------------------------------------------------------ |
| `text-heading-72` | Marketing heroes.                                      |
| `text-heading-64` | Large heading.                                         |
| `text-heading-56` | Large heading.                                         |
| `text-heading-48` | Large heading.                                         |
| `text-heading-40` | Section heading.                                       |
| `text-heading-32` | Marketing subheadings, paragraphs, dashboard headings. |
| `text-heading-24` | Smaller section heading.                               |
| `text-heading-20` | Compact heading.                                       |
| `text-heading-16` | Compact UI heading.                                    |
| `text-heading-14` | Small heading.                                         |

#### Buttons

| Class            | Usage                              |
| ---------------- | ---------------------------------- |
| `text-button-16` | Largest button.                    |
| `text-button-14` | Default button.                    |
| `text-button-12` | Tiny button inside an input field. |

#### Labels

| Class                | Usage                                               |
| -------------------- | --------------------------------------------------- |
| `text-label-20`      | Marketing text.                                     |
| `text-label-18`      | Larger label.                                       |
| `text-label-16`      | Titles where strong differentiation is needed.      |
| `text-label-14`      | Most common label style; used in many menus.        |
| `text-label-14-mono` | Mono pairing with larger text.                      |
| `text-label-13`      | Secondary line next to labels; tabular for numbers. |
| `text-label-13-mono` | Smaller mono pairing with Label 14.                 |
| `text-label-12`      | Tertiary text in busy views; caps in calendars.     |
| `text-label-12-mono` | Tiny mono label.                                    |

#### Copy

| Class               | Usage                                            |
| ------------------- | ------------------------------------------------ |
| `text-copy-24`      | Hero copy on marketing pages.                    |
| `text-copy-20`      | Hero copy on marketing pages.                    |
| `text-copy-18`      | Marketing and large quotes.                      |
| `text-copy-16`      | Larger views like modals where text can breathe. |
| `text-copy-14`      | Most common copy style.                          |
| `text-copy-13`      | Secondary text and compact views.                |
| `text-copy-13-mono` | Inline code mentions.                            |

### 4.5 Typography DNA

Vercel type is:

- Tight but readable.
- Developer-native, with mono used often.
- Heavier on medium/semibold than editorial systems.
- Precise in class naming.
- Comfortable using very large hero sizes, but only in broad marketing layouts.
- Compact in dashboard and docs surfaces.

---

## 5. Spacing and layout

### 5.1 Geist spacing scale

| Token               | Value   |
| ------------------- | ------- |
| `--geist-space`     | `4px`   |
| `--geist-space-2x`  | `8px`   |
| `--geist-space-3x`  | `12px`  |
| `--geist-space-4x`  | `16px`  |
| `--geist-space-6x`  | `24px`  |
| `--geist-space-8x`  | `32px`  |
| `--geist-space-10x` | `40px`  |
| `--geist-space-16x` | `64px`  |
| `--geist-space-24x` | `96px`  |
| `--geist-space-32x` | `128px` |
| `--geist-space-48x` | `192px` |
| `--geist-space-64x` | `256px` |

There are matching negative versions for controlled bleed and offset:

```css
--geist-space-negative: -4px;
--geist-space-2x-negative: -8px;
--geist-space-4x-negative: -16px;
--geist-space-8x-negative: -32px;
--geist-space-16x-negative: -64px;
--geist-space-24x-negative: -96px;
--geist-space-48x-negative: -192px;
```

### 5.2 Gap tokens

| Token                 | Value  |
| --------------------- | ------ |
| `--geist-gap-quarter` | `8px`  |
| `--geist-gap-half`    | `12px` |
| `--geist-gap`         | `24px` |
| `--geist-gap-double`  | `48px` |
| `--geist-gap-section` | `32px` |

The live CSS also exposes negative gap tokens for precise layout offsets:

```css
--geist-gap-quarter-negative: -8px;
--geist-gap-half-negative: -12px;
--geist-gap-negative: -24px;
--geist-gap-double-negative: -48px;
```

### 5.3 Page widths

| Token                            | Value                           |
| -------------------------------- | ------------------------------- |
| `--geist-page-width`             | `1200px`                        |
| `--geist-page-margin`            | `24px`                          |
| `--geist-page-width-with-margin` | `calc(1200px + calc(2 * 24px))` |
| `--ds-page-width`                | `1400px`                        |
| `--ds-page-width-with-margin`    | `calc(1400px + calc(2 * 24px))` |

Vercel uses both older Geist layout tokens and newer `--ds-*` layout tokens. Marketing and docs
surfaces can be wider than dense dashboard surfaces.

### 5.4 Layout character

Vercel layout feels:

- Wide on marketing pages.
- Compact in app/dashboards.
- Strongly aligned to borders and grid lines.
- Structured around horizontal rows, cards, tables, command areas, and code blocks.
- Sparse in color but not sparse in structure.

---

## 6. Grid

The Geist Grid docs call grid "a huge part of the new Vercel aesthetic." It is not just CSS Grid.
It is a visible guide system.

### 6.1 Grid behavior

Documented examples include:

- A non-responsive grid with no cells.
- A basic grid with auto-flowing cells.
- Solid cells that occlude guide lines.
- Responsive grids with `rows` and `columns` at all three breakpoints.
- Guide clipping on specific cells.
- Hidden row guides.
- Hidden column guides.
- Overlaying cells.
- Dashed grid with cross.
- Dashed grid page.

### 6.2 Best practices

The docs define the grid's intended use:

| Rule                                                         | Meaning                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Use visible Grid for two-dimensional cell-and-guide layouts. | Marketing pages, docs landing pages, and feature breakdowns. |
| Use plain Tailwind grid for ordinary card/list layouts.      | Do not overuse visible guides.                               |
| Do not deeply nest Grid.                                     | Guide overlap creates visual noise and breaks cell math.     |
| Set rows and columns at breakpoints.                         | Cells should reflow predictably.                             |
| Mark guide lines decorative.                                 | Semantics live in cell content, not the guide lines.         |

### 6.3 Replication rule

If you add a Vercel-like marketing section, a visible grid is acceptable when the grid itself is
part of the brand expression. If you are just laying out cards, use a plain grid and keep the visual
chrome quiet.

---

## 7. Shape, radius, and forms

### 7.1 Radius

| Token                      | Value |
| -------------------------- | ----- |
| `--geist-radius`           | `6px` |
| `--geist-marketing-radius` | `8px` |

The materials docs further encode radius by surface:

| Material              | Radius |
| --------------------- | ------ |
| `material-base`       | 6px    |
| `material-small`      | 6px    |
| `material-medium`     | 12px   |
| `material-large`      | 12px   |
| `material-tooltip`    | 6px    |
| `material-menu`       | 12px   |
| `material-modal`      | 12px   |
| `material-fullscreen` | 16px   |

Vercel is not a rounded-card system by default. Radius appears in controls and surfaces, but
straight borders and squared grid cells are part of the identity.

### 7.2 Form sizing

| Token                            | Value     |
| -------------------------------- | --------- |
| `--geist-form-small-height`      | `32px`    |
| `--geist-form-height`            | `40px`    |
| `--geist-form-large-height`      | `48px`    |
| `--geist-form-small-font`        | `.875rem` |
| `--geist-form-font`              | `.875rem` |
| `--geist-form-large-font`        | `1rem`    |
| `--geist-form-small-line-height` | `.875rem` |
| `--geist-form-line-height`       | `1.25rem` |
| `--geist-form-large-line-height` | `1.5rem`  |

This explains the Vercel control feel: form elements are compact, exact, and suited to dense
developer dashboards.

### 7.3 Button shapes

The button docs define:

- Default size is medium.
- Icon-only buttons require `svgOnly` and `aria-label`.
- Rounded buttons combine `shape="rounded"` and `shadow`, often on marketing pages.
- Loading state should use `loading`.
- Disabled variants exist.
- `ButtonLink` is used for links with button props.
- `CustomButton` can override foreground, background, and border across normal, hover, and active
  states.

Important warning from the docs: **default `Button` is primary**. Pass `type="secondary"` for
supporting actions and `type="error"` for destructive confirmations. The docs explicitly say
`primary`, `success`, `ghost`, and `violet` are not valid `type` values.

---

## 8. Materials, elevation, and shadows

### 8.1 Material classes

Geist Materials are "presets for radii, fills, strokes, and shadows."

| Material              | Layer    | Usage                                 |
| --------------------- | -------- | ------------------------------------- |
| `material-base`       | On page  | Everyday use; radius 6px.             |
| `material-small`      | On page  | Slightly raised; radius 6px.          |
| `material-medium`     | On page  | Further raised; radius 12px.          |
| `material-large`      | On page  | Further raised; radius 12px.          |
| `material-tooltip`    | Floating | Lightest floating shadow; radius 6px. |
| `material-menu`       | Floating | Lift from page; radius 12px.          |
| `material-modal`      | Floating | Further lift; radius 12px.            |
| `material-fullscreen` | Floating | Biggest lift; radius 16px.            |

The key guidance: use Material instead of hand-rolling radii, fills, strokes, and shadows.

### 8.2 Shadow tokens

| Token                 | Value                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `--ds-shadow-xs`      | `0px 1px 2px #0000000a`                                                                                                             |
| `--ds-shadow-small`   | `0px 2px 2px #0000000a`                                                                                                             |
| `--ds-shadow-medium`  | `0px 2px 2px #0000000a, 0px 8px 8px -8px #0000000a`                                                                                 |
| `--ds-shadow-large`   | `0px 2px 2px #0000000a, 0px 8px 16px -4px #0000000a`                                                                                |
| `--ds-shadow-xl`      | `0px 1px 1px #00000005, 0px 4px 8px -4px #0000000a, 0px 16px 24px -8px #0000000f`                                                   |
| `--ds-shadow-2xl`     | `0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f`                                                  |
| `--ds-shadow-menu`    | `0 0 0 1px #00000014, 0px 1px 1px #00000005, 0px 4px 8px -4px #0000000a, 0px 16px 24px -8px #0000000f, 0 0 0 1px hsla(0,0%,98%,1)`  |
| `--ds-shadow-modal`   | `0 0 0 1px #00000014, 0px 1px 1px #00000005, 0px 8px 16px -4px #0000000a, 0px 24px 32px -8px #0000000f, 0 0 0 1px hsla(0,0%,98%,1)` |
| `--ds-shadow-tooltip` | `0 0 0 1px #00000014, 0px 1px 1px #00000005, 0px 4px 8px #0000000a, 0 0 0 1px hsla(0,0%,98%,1)`                                     |

These shadows are very low alpha. Vercel uses elevation as structure, not drama.

### 8.3 Material best practices

The docs state:

- Pick material based on where the element sits in the layered hierarchy.
- Do not stack two Materials on the same element.
- Align elevation with the element's `z-index` band.
- Favor the lowest elevation that still reads as elevated.
- Material is decorative chrome; semantics belong on the role-bearing wrapper.
- Do not rely on shadow alone to communicate elevation.
- Test materials in both themes.

This is a mature design-system rule: surface style is a named material decision, not arbitrary
`box-shadow` tuning.

---

## 9. Motion and focus

### 9.1 Motion tokens

| Token                           | Value                                |
| ------------------------------- | ------------------------------------ |
| `--default-transition-duration` | `.15s`                               |
| `--ease-in`                     | `cubic-bezier(.4, 0, 1, 1)`          |
| `--ease-out`                    | `cubic-bezier(0, 0, .2, 1)`          |
| `--ease-in-out`                 | `cubic-bezier(.4, 0, .2, 1)`         |
| `--ds-motion-popover-duration`  | `.2s`                                |
| `--ds-motion-popover-timing`    | `cubic-bezier(.175, .885, .32, 1.1)` |
| `--ds-motion-overlay-duration`  | `.3s`                                |
| `--ds-motion-overlay-timing`    | `cubic-bezier(.175, .885, .32, 1.1)` |
| `--ds-motion-overlay-scale`     | `.96`                                |

Vercel motion is fast, slightly springy for overlays/popovers, and otherwise understated.

### 9.2 Focus tokens

| Token                     | Value                                                         |
| ------------------------- | ------------------------------------------------------------- |
| `--ds-focus-color`        | `hsla(212, 100%, 48%, 1)`                                     |
| `--ds-focus-ring`         | `0 0 0 2px hsla(0,0%,100%,1), 0 0 0 4px hsla(212,100%,48%,1)` |
| `--ds-focus-border`       | `0 0 0 1px #00000057, 0px 0px 0px 4px #00000029`              |
| `--ds-focus-ring-outline` | `2px solid hsla(212, 100%, 48%, 1)`                           |

The focus ring is one of the few places Vercel becomes visibly blue. That is correct: the color is
serving interaction, not decoration.

---

## 10. Components and patterns

The Geist component list is large and developer-specific. It includes:

- Avatar
- Badge
- Banner
- Book
- Breadcrumbs
- Browser
- Button
- Calendar
- Card
- Checkbox
- Choicebox
- Clearable Input
- Code
- Code Block
- Collapse
- Combobox
- Command Menu
- Context Card
- Context Menu
- Copy Button
- Deployment Status
- Description
- Destructive Action Modal
- Dots Menu
- Drawer
- Empty State
- Entity
- Error
- Error Card
- Feedback
- Fieldset
- File Tree
- Gauge
- Grid
- Input
- Keyboard Input
- Label
- Load More Button
- Loading Dots
- Menu
- MiddleTruncate
- Modal
- Multi Select
- Note
- Pagination
- Phone
- Pill
- Progress
- Project Banner
- Radio
- Relative Time Card
- Scroller
- Search Input
- Select
- Separator
- Sheet
- Show more
- Skeleton
- Slider
- Snippet
- Spinner
- Split Button
- Status Dot
- Switch
- Table
- Tabs
- Text With Copy Button
- Textarea
- Theme Switcher
- Toast
- Toggle
- Tooltip
- Video

### 10.1 What the component list reveals

Vercel components are built for:

- Deployment operations.
- Developer documentation.
- Code display and copy.
- Project/entity navigation.
- Technical metadata.
- Command-driven workflows.
- Dense settings forms.
- Status-heavy infrastructure UI.

This is not a general consumer app kit. It is a kit for people building and operating software.

### 10.2 Button rules

The button docs are unusually opinionated about copy and accessibility:

| Rule                        | Meaning                                                                 |
| --------------------------- | ----------------------------------------------------------------------- |
| `Button` for mutation       | Deploy, save, delete, invite, rotate.                                   |
| `ButtonLink` for navigation | Use link semantics when URL changes.                                    |
| `type="secondary"`          | Supporting action.                                                      |
| `type="error"`              | Destructive confirmation.                                               |
| `typeName="submit"`         | HTML submit type lives on `typeName`, not visual `type`.                |
| `loading` prop              | Preserve focusability and announce busy state.                          |
| Disabled with tooltip       | Explain why the action is unavailable.                                  |
| Title Case labels           | Use action-specific labels like `Deploy Project`, not vague `Submit`.   |
| Icon-only accessibility     | Require `svgOnly` and an `aria-label` that names the action and target. |

### 10.3 Developer-native components

Several components are highly Vercel-specific:

| Component             | Why it matters                                                   |
| --------------------- | ---------------------------------------------------------------- |
| `Browser`             | Product demos and web previews are first-class visual objects.   |
| `Code` / `Code Block` | Code is a design primitive, not an afterthought.                 |
| `Deployment Status`   | Vercel's core workflow has a dedicated component.                |
| `File Tree`           | Framework/app structure is part of the interface.                |
| `Keyboard Input`      | Keyboard shortcuts are part of product literacy.                 |
| `Command Menu`        | Search and command execution are central developer affordances.  |
| `MiddleTruncate`      | Long hashes, URLs, branches, and paths require specialized text. |
| `Status Dot`          | Infrastructure state needs compact, repeated status indicators.  |

---

## 11. Accessibility and product copy

### 11.1 Accessibility

Vercel's docs repeatedly encode accessibility into component guidance:

- Icon-only buttons require `aria-label`.
- Do not set `aria-label` on a button that already has visible text.
- Loading buttons should remain focusable and announce busy state.
- Grid guides are decorative and should be `aria-hidden`.
- Focus rings must be visible.
- Materials should not rely on shadow alone.
- Disabled actions should explain why they are disabled.
- Tab order should match reading order when grid cells are tappable.

This is one of the strongest signals that Geist is not just a visual style. It is an interaction
and semantics system.

### 11.2 Copy style

Button copy rules reveal the broader voice:

| Rule                            | Example                           |
| ------------------------------- | --------------------------------- |
| Use Title Case labels           | `Deploy Project`, `Invite Member` |
| Name the specific action        | `Rotate Key`, not `Submit`        |
| Destructive copy is verb + noun | `Delete Project`                  |
| Toast copy mirrors action       | `Project deleted`                 |
| Mode switches append "Instead"  | `Use a Recovery Code Instead`     |

Vercel copy is brief but exact. It speaks like an operations console, not a marketing assistant.

---

## 12. AI, v0, and the modern Vercel layer

Vercel's current product universe includes v0 and AI SDK. The design system has to support AI-native
surfaces without abandoning its developer-tool grammar.

### 12.1 AI SDK surface

The AI SDK product page frames the AI SDK as a unified TypeScript SDK for:

- Streaming
- Multi-model support
- Provider-agnostic capabilities
- AI SDK Core
- AI SDK UI
- Tool calling
- Error handling
- Framework-agnostic apps

The visual implication: AI surfaces should be code-first, model/provider aware, and explicit about
state.

### 12.2 v0 surface

Vercel docs describe v0 as a pair programmer that generates code and UI from natural language. That
requires a product surface that can hold:

- Prompt input.
- Generated UI preview.
- Code artifacts.
- Deployment handoff.
- Iteration history.
- Model/tool execution.
- Error and recovery states.

The correct Vercel treatment is not a magical gradient chat UI. It is a precise developer tool:
white/black surfaces, bordered panels, Geist type, code blocks, file trees, copy buttons, deploy
actions, and visible state.

### 12.3 AI design rules in Vercel style

1. Keep the prompt surface neutral and compact.
2. Use code blocks and file trees as first-class output.
3. Put deploy/apply/copy actions in clear button rows.
4. Use status dots, loading dots, progress, and toasts for state.
5. Use blue for focus, links, or active generated affordances; do not wash the UI in blue.
6. Preserve provenance: show files, snippets, model/provider names, timestamps, and errors.
7. Let the generated UI preview sit inside a Browser or framed surface.
8. Treat destructive generated actions like ordinary destructive actions: explicit confirmation.

---

## 13. Implementation architecture

### 13.1 Public assets

| Asset / package  | Status                                              | Role                                                  |
| ---------------- | --------------------------------------------------- | ----------------------------------------------------- |
| `geist@1.7.2`    | Public npm                                          | Official Geist Sans, Mono, and Pixel font package.    |
| Geist docs       | Public web docs                                     | Foundation/component guidance and component examples. |
| Brand assets     | Public web docs                                     | Logo and trademark guidance.                          |
| Geist components | Public docs, not public `@vercel/geist` npm package | Current system component reference.                   |

### 13.2 Next.js font usage

The official package provides Next font exports:

```tsx
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

For Tailwind v4:

```css
@theme {
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}
```

### 13.3 Vercel-like token scaffold

```css
:root {
  --ds-background-100: hsla(0, 0%, 100%, 1);
  --ds-background-200: hsla(0, 0%, 98%, 1);
  --ds-gray-1000: hsla(0, 0%, 9%, 1);
  --ds-gray-900: hsla(0, 0%, 30%, 1);
  --ds-gray-700: hsla(0, 0%, 56%, 1);
  --ds-gray-alpha-200: #00000014;
  --ds-blue-700: hsla(212, 100%, 48%, 1);
  --ds-focus-ring:
    0 0 0 2px hsla(0, 0%, 100%, 1), 0 0 0 4px hsla(212, 100%, 48%, 1);
  --geist-space: 4px;
  --geist-space-2x: 8px;
  --geist-space-3x: 12px;
  --geist-space-4x: 16px;
  --geist-space-6x: 24px;
  --geist-radius: 6px;
  --geist-form-height: 40px;
}
```

### 13.4 Button recipe

```tsx
const button = {
  alignItems: "center",
  background: "var(--ds-gray-1000)",
  border: "1px solid var(--ds-gray-1000)",
  borderRadius: "9999px",
  color: "var(--ds-background-100)",
  display: "inline-flex",
  fontFamily: "var(--font-sans)",
  fontSize: "14px",
  fontWeight: "500",
  height: "40px",
  justifyContent: "center",
  paddingInline: "16px",
  transition: "background .15s ease, border-color .15s ease, color .15s ease",
}
```

Use this pill style mostly for marketing CTAs. Dashboard buttons should often use smaller radius
and the documented `Button` variants.

### 13.5 Card/material recipe

```tsx
const materialBase = {
  background: "var(--ds-background-100)",
  borderRadius: "6px",
  boxShadow: "var(--ds-shadow-border)",
}

const materialMenu = {
  background: "var(--ds-background-100)",
  borderRadius: "12px",
  boxShadow: "var(--ds-shadow-menu)",
}
```

Do not combine multiple material shadows on one element.

### 13.6 Code block recipe

```tsx
const codeBlock = {
  background: "var(--ds-background-200)",
  border: "1px solid var(--ds-gray-alpha-200)",
  borderRadius: "var(--geist-radius)",
  color: "var(--ds-gray-1000)",
  fontFamily: "var(--font-mono)",
  fontSize: "13px",
  overflow: "auto",
  padding: "var(--geist-space-4x)",
}
```

Code blocks should include copy affordances and language/context labels when useful.

---

## 14. Comparison with the other teardowns

| System     | Core visual idea                                                 | Accent logic                                | Type personality                | Layout density                      |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------- | ------------------------------- | ----------------------------------- |
| Cursor     | Warm editorial paper + one orange accent                         | Fixed orange brand accent                   | Custom grotesque + mono + serif | Spacious marketing, dark editor     |
| Twenty     | Notion-like neutral CRM + Radix color labels                     | Indigo accent + many Radix data colors      | Inter, compact SaaS             | Dense CRM app                       |
| Shopify    | Merchant operations UI through Polaris                           | Shopify green + commerce status colors      | Practical admin typography      | Dense admin/product surfaces        |
| Atlassian  | Teamwork UI with mature intent tokens                            | Atlassian Blue + semantic role colors       | Atlassian Sans/Mono             | Dense enterprise collaboration      |
| Fluent 2   | Microsoft productivity UI with product-swappable brand slots     | Web blue / Teams purple through theme slots | Segoe UI/system                 | Very dense work UI                  |
| **Vercel** | Developer-tool minimalism: Geist, monochrome, code, grid, border | Blue only for focus/link utility            | Geist Sans/Mono/Pixel           | Dense dashboard, spacious marketing |

Vercel is the most reductionist of the group. Cursor is warm and editorial; Vercel is colder,
sharper, and more infrastructure-native. Atlassian and Fluent are enterprise systems with broad
semantic token sets. Vercel is narrower, but the narrowness is the brand.

---

## 15. Distilled Vercel rules

If an AI agent wanted to produce Vercel-like UI, these are the rules:

1. Use **Geist Sans** for UI and marketing text.
2. Use **Geist Mono** for code, paths, IDs, regions, hashes, timestamps, and command text.
3. Keep the default palette monochrome: white, `98%` gray, near-black, and low-alpha borders.
4. Use blue mostly for links, focus, active affordances, and selected technical states.
5. Use the **4px spacing base** and the Geist scale: 4 / 8 / 12 / 16 / 24 / 32 / 40 / 64 / 96px.
6. Use compact form heights: 32px small, 40px default, 48px large.
7. Keep normal surface radius around 6px and marketing radius around 8px.
8. Use pill buttons selectively for marketing CTAs, not every control.
9. Use Material classes or equivalent named surface roles instead of custom shadow stacks.
10. Use visible grid lines only when the grid is part of the design expression.
11. Treat code blocks, file trees, deployment statuses, and command menus as first-class UI.
12. Prefer exact action copy: `Deploy Project`, `Invite Member`, `Delete Project`.
13. Preserve focus rings and keyboard access.
14. Use `aria-label` for icon-only buttons; avoid overriding visible labels with `aria-label`.
15. Keep AI/v0 surfaces developer-native: prompt, preview, code, files, deploy, status.

---

## 16. Source notes

### 16.1 Documentation

- [Vercel Design](https://vercel.com/design) - design team, brand resources, and Geist stewardship.
- [Geist Design System](https://vercel.com/geist/introduction) - system introduction and component
  index.
- [Geist Colors](https://vercel.com/geist/colors) - color scale roles, P3 support, backgrounds,
  component backgrounds, borders, high contrast, text/icons.
- [Geist Typography](https://vercel.com/geist/typography) - Tailwind typography class taxonomy.
- [Geist Materials](https://vercel.com/geist/materials) - radii, fills, strokes, shadows, material
  hierarchy, accessibility guidance.
- [Geist Grid](https://vercel.com/geist/grid) - visible grid component and guide behavior.
- [Geist Button](https://vercel.com/geist/button) - button variants, accessibility, and copy rules.
- [Geist Font](https://vercel.com/font) - font family description, metrics, installation, and usage.
- [Vercel AI SDK](https://vercel.com/ai-sdk) and [AI SDK docs](https://vercel.com/docs/ai-sdk) -
  current AI product surface context.
- [v0 docs](https://vercel.com/docs/v0) - v0 product context.

### 16.2 Package artifacts inspected

| Package               | Version       | Notes                                                                |
| --------------------- | ------------- | -------------------------------------------------------------------- |
| `geist`               | `1.7.2`       | Official Geist Sans, Mono, and Pixel font package.                   |
| `@vercel/geist`       | not published | Checked npm; no canonical current component package under this name. |
| `@vercel/geist-icons` | not published | Checked npm; no canonical package under this name.                   |

### 16.3 Live CSS values inspected

Captured from `getComputedStyle(document.documentElement)` on `https://vercel.com/geist/colors`.
Key groups:

- `--ds-background-*`
- `--ds-gray-*`
- `--ds-gray-alpha-*`
- `--ds-blue-*`
- `--ds-red-*`
- `--ds-amber-*`
- `--ds-green-*`
- `--ds-teal-*`
- `--ds-purple-*`
- `--ds-pink-*`
- `--ds-focus-*`
- `--ds-shadow-*`
- `--ds-motion-*`
- `--geist-space-*`
- `--geist-gap-*`
- `--geist-form-*`
- `--font-sans`
- `--font-mono`

### 16.4 Values to re-check if updating later

These are likely to evolve:

- Geist docs component list.
- `--ds-*` token names and values.
- Dark theme values.
- Font package version.
- v0 and AI SDK visual treatment.
- Any future public Geist component package.
