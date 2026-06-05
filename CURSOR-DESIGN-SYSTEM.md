# Cursor (cursor.com) — Design System Teardown

> A full reverse-engineering of Cursor's visual & product design language, captured by
> live inspection of the rendered `cursor.com` site (computed CSS custom properties,
> fonts, component styles) plus supporting research. Cursor is the AI code editor / coding
> agent by **Anysphere** (an "applied research team focused on building the future of
> software development").
>
> **Method:** tokens below are read directly from the site's resolved `:root` CSS variables
> and `getComputedStyle()` on live elements — they are the actual shipping values, not
> guesses. Captured June 2026 from the marketing site (`cursor.com`), which is built on
> **Next.js + Tailwind CSS v4** (theme tokens exposed as `--color-*`, `--spacing-*`,
> `--text-*`, etc.).

---

## 0. TL;DR — the design in one paragraph

Cursor's brand is **warm, editorial, and quietly confident**. It rejects the cold blue/black
"developer tool" cliché in favor of a **warm paper palette** (off-white `#f7f7f4`, warm gray
`#f2f1ed`) printed with a single **olive-black ink** (`#26251e`) and accented by **one hot
orange** (`#f54e00`). Type is set in a **custom geometric grotesque (CursorGothic)** for UI,
**Berkeley Mono** for code, and **EB Garamond** for editorial serif moments — and crucially,
even hero headlines stay at **regular weight (400)** with **tight tracking**, giving the site a
calm, magazine-like restraint instead of shouting in bold. Geometry is **pill-shaped**
(fully-rounded buttons) on a soft radius scale, motion is **gentle and spring-eased**, and
the whole system rides a **typographic baseline grid** where one spacing unit equals one
line of text. The _marketing-site_ product mockups (the agent task manager) reuse the same paper
tokens and add a **pastel agent-activity color set** (peach / mint / blue / purple) that maps to
what the AI is doing (thinking / searching / reading / editing). The shipping **editor itself is a
second, opposite surface — dark by default** (near-black `#181818` Anysphere chrome). And the whole
identity is the product of a **September 2025 rebrand** by foundry Kimera (typeface Cursor Gothic,
a refined Ben Barry cube logo).

---

## 1. Brand identity & philosophy

| Aspect                     | What Cursor does                                                                                                                                                                                                                                                                                                                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company**                | Anysphere — positions itself as an "applied research team focused on building the future of software development."                                                                                                                                                                                                                                                                                       |
| **Product framing**        | "Built to make you extraordinarily productive, Cursor is the best coding agent." The headline leads with the _user outcome_ (productivity), not features.                                                                                                                                                                                                                                                |
| **Voice**                  | Plain, declarative, understated-confident. Short sentences. "The new way to build software." "Stay on the frontier." "Agents turn ideas into code."                                                                                                                                                                                                                                                      |
| **Aesthetic stance**       | Anti-generic. Warm paper instead of dark-mode-by-default; a custom typeface instead of Inter; one disciplined accent instead of a rainbow. Reads like a well-art-directed print magazine for engineers.                                                                                                                                                                                                  |
| **Restraint as a signal**  | Headlines are _not bold_. Color is _mostly absent_ — a near-monochrome canvas where the single orange becomes a high-value event. This signals taste and seniority.                                                                                                                                                                                                                                      |
| **Interaction philosophy** | Autonomy-centric. Andrej Karpathy's framing (quoted on the homepage): _"The best LLM applications have an autonomy slider… In Cursor, you can do Tab completion, Cmd+K for targeted edits, or you can let it rip with the full autonomy agentic version."_ The three modes map to three UI surfaces: **Tab** = inline ghost-text, **Cmd+K** = inline command box on a selection, **Agent** = side panel. |

### 1.1 Provenance — the September 2025 rebrand

Cursor's current identity comes from a **brand refresh shipped September 2025**, executed by the
Munich type foundry **Kimera** (founder **Michael Clasen**) together with designer **Justin Jay
Wang** and Cursor's internal teams. Cursor's design lead **Ryo Lu** announced it as: _"Refined
logo. Modular grid. And our own typeface: Cursor Gothic."_ The official brand assets live at
**`cursor.com/brand`**. Key facts (all high-confidence, corroborated by the foundry's own case
study on _The Brand Identity_ and Cursor's primary channels):

- The system is **typographically led** — the custom typeface is the centerpiece, not the logo.
- It runs on a **modular grid**.
- It deliberately **diverges from tech-industry color norms** (low-saturation / blue-tinted
  palettes) by carrying a subtle **warm undertone** throughout, with the orange accent reportedly
  **derived from real power tools** the team examined — reinforcing a "power tool for developers"
  positioning with human warmth.

### 1.2 Two surfaces, opposite palettes (do not conflate)

Cursor's design language splits into **two distinct surfaces with deliberately opposite palettes**:

| Surface                              | Mode                | Palette                                                                               |
| ------------------------------------ | ------------------- | ------------------------------------------------------------------------------------- |
| **Marketing / brand** (`cursor.com`) | **Light only**      | Warm "editorial cream" — paper `#f7f7f4`, ink `#26251e`, orange `#f54e00`.            |
| **The editor / IDE** (the product)   | **Dark by default** | Near-black "Anysphere" chrome `#181818`, foreground `#d6d6dd`, pastel syntax palette. |

Everything in §§2–8 below documents the **brand/marketing** surface (verified from live computed
styles). The **editor** surface is documented separately in §12.

### 1.3 Design DNA (the rules the site obeys)

1. **Warm monochrome + one accent.** Everything is built from one ink color (`#26251e`) toned
   with opacity via `color-mix`, on a warm paper background, with a single orange accent.
2. **Opacity-derived scales, not separate color ramps.** Borders, muted text, fills, and hovers
   are all `color-mix(in oklab, #26251e N%, transparent)` — a true single-source tonal system.
3. **Custom type, regular weight.** Brand expression lives in the _typeface_, not in weight or color.
4. **Baseline grid.** Spacing is derived from the line-height unit, so vertical rhythm is intrinsic.
5. **Light only.** The marketing site ships **light mode exclusively** (`data-theme="light"`,
   `color-scheme: light`). Dark mode lives inside the _product_ (the editor), not the brand site.

---

## 2. Color system

### 2.1 Core palette (exact values, by usage frequency on the live page)

| Hex             | Role / token                                                                             | Notes                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `#26251e`       | **Ink / foreground** — `--color-theme-fg`, `--prose-headings`, button bg, logo           | Warm olive-tinted near-black. The single most-used color (≈45 references). _Not_ pure black.                                                                                                                                                                                                                                                                                              |
| `#f7f7f4`       | **Paper / editor surface** — `--color-theme-product-editor`, button text                 | Warm off-white; the canvas and the editor background.                                                                                                                                                                                                                                                                                                                                     |
| `#f2f1ed`       | **Warm gray / chrome** — `--color-theme-product-chrome`, `--color-theme-card-hex`        | The "app chrome" / card base surface, one step darker than paper.                                                                                                                                                                                                                                                                                                                         |
| `#f54e00`       | **Accent — Cursor Orange** — `--color-accent`, `--color-theme-accent`, `--color-warning` | The signature hot orange (sometimes catalogued as "International Orange"). Doubles as the warning color. Press/active state reported as `#d04200`. Reserved for primary CTAs and the wordmark; used scarcely. Appears as a soft top-edge glow and in highlights. Per the foundry, the hue was **derived from real power tools** — a "power tool for developers" signal with human warmth. |
| `#cf2d56`       | **Error / ANSI red** — `--color-error`, `--color-theme-product-ansi-red`                 | Crimson-pink red; also used for removed-line diff backgrounds.                                                                                                                                                                                                                                                                                                                            |
| `#1f8a65`       | **Success / ANSI green** — `--color-success`, `--color-theme-product-ansi-green`         | Deep teal-green; also inserted-line diff backgrounds.                                                                                                                                                                                                                                                                                                                                     |
| `#3b3a33`       | **Secondary ink** — `--color-theme-fg-02`, button hover bg/border                        | A lighter warm charcoal for hover states and secondary text.                                                                                                                                                                                                                                                                                                                              |
| `#fff` / `#000` | Pure white / black                                                                       | Used sparingly.                                                                                                                                                                                                                                                                                                                                                                           |

### 2.2 Surface ladder (the warm neutral stair)

Cursor builds depth with a tight ladder of warm grays rather than shadows:

| Token                                            | Hex                           |
| ------------------------------------------------ | ----------------------------- |
| `--color-theme-product-editor`                   | `#f7f7f4` (lightest — editor) |
| `--color-theme-card-warm-hex`                    | `#f3ede6`                     |
| `--color-theme-card-hex` / chrome                | `#f2f1ed`                     |
| `--color-theme-card-01-hex` / `card-hover-light` | `#f0efeb`                     |
| `--color-theme-card-03-hex`                      | `#e6e5e0`                     |
| `--color-theme-card-02-hex` / `card-hover-hex`   | `#ebeae5`                     |
| `--color-theme-card-04-hex`                      | `#e1e0db`                     |

Each step is only a few percent darker — a deliberately **low-contrast, paper-like** depth model.

### 2.3 Tonal system — opacity over the ink (the key trick)

Instead of separate gray ramps, Cursor derives **fg** (text/icon) and **border** tones by mixing
the ink into transparent, in **oklab** space:

```css
--color-theme-fg: #26251e; /* 100% ink */
--color-theme-fg-01: color-mix(in oklab, #26251e 1%, transparent);
--color-theme-fg-02-5: color-mix(in oklab, #26251e 2.5%, transparent);
--color-theme-fg-07-5: color-mix(in oklab, #26251e 7.5%, transparent);
--color-theme-fg-08: color-mix(in oklab, #26251e 8%, transparent);
--color-theme-fg-15: color-mix(in oklab, #26251e 15%, transparent);
--color-theme-text-mid: color-mix(in oklab, #26251e 50%, transparent);

--color-theme-border-01: color-mix(in oklab, #26251e 2.5%, transparent);
--color-theme-border-01-5: color-mix(in oklab, #26251e 5%, transparent);
--color-theme-border-02-5: color-mix(in oklab, #26251e 20%, transparent);
--color-theme-border-03: color-mix(in oklab, #26251e 60%, transparent);
```

This is the same single-source principle a good design system wants: **override the ink and the
whole UI re-tones.** Semantic neutrals follow the same pattern:

```css
--color-info: color-mix(in oklab, #26251e 60%, transparent);
--color-border-bright: color-mix(in oklab, #26251e 20%, transparent);
```

### 2.4 Semantic colors

```css
--color-accent: #f54e00;
--color-accent-bg: color-mix(in srgb, #f54e00 10%, transparent);
--color-accent-bg-strong: color-mix(in srgb, #f54e00 25%, transparent);
--color-warning: #f54e00;
--color-warning-bg: color-mix(in srgb, #f54e00 15%, transparent);
--color-error: #cf2d56;
--color-error-bg: color-mix(in srgb, #cf2d56 15%, transparent);
--color-success: #1f8a65;
--color-success-bg: color-mix(in srgb, #1f8a65 15%, transparent);
```

Note the deliberate overlap: **accent and warning are the same orange.** Cursor keeps the palette
ruthlessly small — orange carries both "this matters / brand" and "caution."

### 2.5 Agent activity ("timeline") colors — a signature detail

Inside the product, the AI agent's actions are color-coded with a **pastel set** distinct from the
brand. These map activity _type_ → hue:

| Token                       | Hex       | Meaning                                     |
| --------------------------- | --------- | ------------------------------------------- |
| `--color-timeline-thinking` | `#dfa88f` | Peach — the agent is _thinking / reasoning_ |
| `--color-timeline-grep`     | `#9fc9a2` | Mint — _searching / grepping_ the codebase  |
| `--color-timeline-read`     | `#9fbbe0` | Blue — _reading_ files                      |
| `--color-timeline-edit`     | `#c0a8dd` | Purple — _editing / writing_ code           |

These are muted, desaturated pastels that sit calmly on the warm paper — they inform without
competing with the orange accent. This is one of the most distinctive parts of Cursor's product UI.

### 2.6 Code / diff colors

```css
--color-theme-product-ansi-red: #cf2d56;
--color-theme-product-ansi-green: #1f8a65;
--color-theme-product-removed-line-background: color-mix(
  in srgb,
  #cf2d56 6%,
  transparent
);
--color-theme-product-line-inserted-line-background: color-mix(
  in srgb,
  #1f8a65 8%,
  transparent
);
```

---

## 3. Typography

### 3.1 The three typefaces

| Role                  | Token                                 | Stack                                                                                              |
| --------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **UI / sans (brand)** | `--font-sans`                         | `"CursorGothic", "CursorGothic Fallback", system-ui, Helvetica Neue, Helvetica, Arial, sans-serif` |
| **Mono / code**       | `--font-mono`, `--font-berkeley-mono` | `"berkeleyMono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, …`                         |
| **Serif (editorial)** | `--font-serif`                        | `"EB Garamond", Iowan Old Style, Palatino Linotype, …, ui-serif, Georgia, …`                       |
| **System fallback**   | `--font-system`                       | `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", …`                                      |

- **CursorGothic / "Cursor Gothic"** — a **custom proprietary geometric grotesque** (loaded as a
  Next.js font module with a paired `CursorGothic Fallback`). This is the brand's primary signature;
  the wordmark and all UI are set in it. Default font family for the whole document. **Provenance:**
  built by foundry **Kimera** on their retail typeface **Waldenburg** — which blends _Akzidenz-Grotesk's
  rationalism_ with _Univers' analogue warmth_. For Cursor Gothic, Kimera made it **slightly more
  condensed**, with **squarer shapes and higher contrast** more pronounced. A monospace extension,
  **Cursor Mono**, is in development and is intended to become the editor's primary typeface.
- **Berkeley Mono** — the premium monospace by Berkeley Graphics, used on the _marketing site_ for
  code and "engineer-y" accents (confirmed in `--font-mono`/`--font-berkeley-mono`). A deliberate,
  paid, opinionated choice (not a free mono). _(Note: inside the editor, Berkeley Mono is the current
  default but Cursor Mono is slated to replace it.)_
- **EB Garamond** — an open-source old-style serif used for editorial / long-form / quote moments,
  giving the magazine feel.

### 3.2 Weights

Only four weights are defined — and the brand leans on the lightest:

```css
--font-weight-normal: 400; /* used even for the hero H1 */
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

> **Key insight:** The hero `<h1>` renders at **font-weight 400** (regular), `letter-spacing ≈ -0.0125em`
> (tight), `line-height ≈ 1.25`. Cursor expresses hierarchy through **size + tracking + the typeface
> itself**, not through bold weights. This is the single biggest reason the site feels "designed."

### 3.3 Type scale

Cursor runs **two parallel scales**: a large **display/marketing** scale and a small **product** scale.

**Marketing / display scale** (`--text-*`):

| Token          | Size                      |
| -------------- | ------------------------- |
| `--text-sm`    | `0.875rem` (14px)         |
| `--text-md-sm` | `1.125rem` (18px)         |
| `--text-md`    | `1.375rem` (22px)         |
| `--text-xl`    | `3.25rem` (52px)          |
| `--text-lg`    | `2.25rem` (36px)          |
| `--text-2xl`   | `4.5rem` (72px) — display |

**Product UI scale** (`--text-product-*`) — small, dense, mono-friendly:

| Token                 | Size               |
| --------------------- | ------------------ |
| `--text-product-sm`   | `0.6875rem` (11px) |
| `--text-product-base` | `0.75rem` (12px)   |
| `--text-product-lg`   | `0.8125rem` (13px) |

There are also `--text-slack-*` tokens (`0.75rem`–`1rem`) — likely for chat/message-style surfaces.

### 3.4 Line-height (leading) tokens

A rich, named leading scale — note the dedicated _product_ leadings tuned for dense UI and mono:

```css
--leading-tight: 1.1 --leading-2xsnug: 1.15 --leading-xsnug: 1.2
  --leading-snug: 1.25 --leading-product-sm: 1.27273
  --leading-product-base: 1.33333 --leading-cozy: 1.4 --leading-normal: 1.5
  --leading-relaxed: 1.625 --leading-product-base-mono: 1.25rem
  /* fixed px-style leading for code */;
```

### 3.5 Letter-spacing (tracking) tokens

Tracking _tightens_ as text gets bigger (classic display typography) and _opens slightly_ for small text:

```css
--tracking-tight: -0.025em --tracking-2xl: -0.03em --tracking-xl: -0.025em
  --tracking-lg: -0.02em --tracking-md-lg: -0.0125em --tracking-md: -0.005em
  --tracking-base: 0.005em --tracking-sm: 0.01em --tracking-wide: 0.025em
  --tracking-product-sm: 0.0044em;
```

---

## 4. Spacing — a typographic baseline grid

Cursor's spacing is **not** a generic 4px/8px scale. It is derived from the **line unit**:

```css
--spacing-v1:   calc(1rem * 1.4);          /* = 1.4rem ≈ 22.4px — ONE line of text */
--spacing-v1.5: calc(1rem * 1.4 * 1.5);
--spacing-v2:   calc(1rem * 1.4 * 2);
--spacing-v2.5: calc(1rem * 1.4 * 2.5);
--spacing-v3 … --spacing-v10                /* whole multiples of the line unit */
```

…and each line unit is **subdivided into twelfths** for fine control:

```css
--spacing-v1/12: calc(1rem * 1.4 * 1 / 12);
--spacing-v2/12: calc(1rem * 1.4 * 2 / 12);
--spacing-v9/12: calc(1rem * 1.4 * 9 / 12);
/* …through v10/12, plus halves like v2.5/12 */
```

**Why it matters:** because `1.4` is the body line-height, vertical spacing snaps to the **baseline
grid** automatically — text and whitespace share the same rhythm, which is what makes the layout
feel typographically tuned rather than arbitrary. There's also a conventional t-shirt scale
(`--spacing-2xl`, etc.) for non-rhythmic needs.

---

## 5. Radius, shadows, blur

### 5.1 Radius scale (`--radius-*`)

```css
--radius-2xs: 2px --radius-sm: 0.25rem (4px) --radius-md: 8px
  --radius-lg: 0.5rem (8px) --radius-2xl: 1rem (16px);
```

Plus the **pill**: primary buttons use an effectively infinite radius (computed
`border-radius` resolves to a huge value ⇒ fully rounded capsule).

### 5.2 Shadows — almost none

Cursor barely uses shadows; depth comes from the surface ladder and hairline borders instead.

```css
--shadow-outline-theme: 0 0 0 1px color-mix(in oklab, #26251e 10%, transparent); /* hairline ring */
--shadow-flyout:
  0 0 1rem #00000005, 0 0 0.5rem #00000002; /* whisper-soft popover */
```

Both are extremely subtle — a 1px tinted outline and a near-invisible flyout shadow (alphas of
2–5/255). This is core to the flat, printed look.

### 5.3 Blur

```css
--blur-sm: 8px --blur-md: 12px --blur-lg: 16px;
```

Used for the soft, frosted backdrop behind hero product mockups.

---

## 6. Motion & animation

```css
--default-transition-duration: 0.15s
  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1)
  /* ease-in-out */ --transition-fast / --duration: 0.14s --duration-slow: 0.25s
  --ease-out: cubic-bezier(0, 0, 0.2, 1)
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
  --ease-out-spring: cubic-bezier(0.25, 1, 0.5, 1)
  /* the signature "settle" easing */ --animate-spin: spin 1s linear infinite
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite
  --animate-gallery-marquee-item-slide-up: gallery-marquee-item-slide-up 1s
  cubic-bezier(0.25, 1, 0.5, 1) both;
```

**Character:** fast (≈140–150ms) micro-interactions, with an **`ease-out-spring`** curve
(`cubic-bezier(.25, 1, .5, 1)`) for entrances/slides that gives a gentle overshoot-free "settle."
Loading uses `spin` (the agent task spinners visible in the product) and `pulse`.

---

## 7. Layout, containers, breakpoints

```css
--site-header-height: 56px --site-sticky-top: 64px --breakpoint-md: 660px
  /* note: a tighter, custom md breakpoint */ /* prose-width containers (rem) */
  --container-2xs: 18rem --container-xs: 20rem --container-sm: 24rem
  --container-md: 28rem --container-lg: 32rem --container-xl: 36rem
  --container-2xl: 42rem --container-3xl: 48rem --container-4xl: 56rem
  --container-5xl: 64rem --container-7xl: 80rem (≈1280px page max)
  --spacing-prose-wide: 96ch /* measure-based prose width */;
```

Header is a slim **56px** sticky bar. Page content maxes around **80rem (1280px)**. Prose is
constrained by character measure (`ch`), not just px — another editorial tell.

---

## 8. Components & patterns

### 8.1 Logo / wordmark

- **Mark:** a solid, geometric **cube glyph** (an isometric cube with a cursor cut into it) in
  ink color, paired with the **"CURSOR"** wordmark in geometric caps.
- **Provenance:** the cube refines **Ben Barry's original** design. In the 2025 refresh, Kimera
  **slightly rounded the corners** of both the cube and the cursor, and **offset the cursor's shape
  to create a visible gap** between cursor and cube — improving on-screen legibility at small sizes.
- **Three depth versions** (per `cursor.com/brand`):
  1. **Flat one-colour** — the _primary_ logo, for small sizes.
  2. **2.5D** — flat colour planes, for larger applications.
  3. **3D** — lighting + material effects, used for **app icons and OS integrations**.
     App icons ship in **2.5D (default), 2D, and 3D**, in **light and dark**.
- **Lockups:** **horizontal (preferred)**, **vertical**, or **separate cube / wordmark** elements.
  Logos are available in **2D (default)** and **2.5D**.
- **Implementation (web):** inline `<svg viewBox="0 0 2193 545">` using `fill="currentColor"` — so
  the header logo is **monochrome and inherits the text color** (re-colors for free on any surface).
  Rendered width ≈ 95px in the header.

### 8.2 Buttons

**Primary** (e.g. "Download", "Get started →"):

```
background:    #26251e (ink)
color:         #f7f7f4 (paper)
border:        1px solid #26251e
border-radius: pill (fully rounded)
font:          CursorGothic, weight 400
font-size:     ~13px
padding:       em-based — e.g. --button-padding-default: .89em 1.45em .91em
               (note the asymmetric top/bottom to optically center the cap-height)
```

**Secondary:**

```
--color-theme-button-sec-bg:     transparent
--color-theme-button-sec-text:   #26251e
--color-theme-button-sec-border: color-mix(in oklab, #26251e 60%, transparent)
```

**Hover:** `--color-theme-button-hover-bg / border: #3b3a33` (ink lightens slightly).

Button paddings are defined in **`em`** (`--button-padding-md-sm: .64em 1.2em .66em`) so they
scale with font size — and the **top/bottom values differ** to optically center text against the
typeface's metrics. A small but high-craft detail.

### 8.3 Cards

Cards use the warm surface ladder + hairline borders, with layered gradient fills, e.g.:

```css
--color-theme-card-03:
  linear-gradient(color-mix(in oklab, #26251e 5%, transparent) 0 100%),
  linear-gradient(#f2f1ed 0 100%);
--color-theme-card-hover-border: color-mix(in oklab, #26251e 10%, transparent);
```

Hover swaps to a slightly darker hex (`#f0efeb` → `#ebeae5`) and a slightly stronger border —
no shadow lift. Flat, paper-on-paper depth.

### 8.4 Navigation

Slim sticky header (56px): cube logo (left) · text links · "Sign in" (plain link) · "Download"
(pill button) · hamburger on small screens. Top-level IA:

> **Product** (Agents, Cloud, CLI, Review, Tab, Marketplace ↗) · **Enterprise** · **Pricing** ·
> **Resources** (Changelog, Blog, Docs, Community, Help ↗, Workshops, Forum ↗) · **Careers**

Footer groups: **Product · Resources · Company · Legal · Connect**.

### 8.5 The product UI (agent task manager)

The hero mockup shows Cursor's **agent/task dashboard** rather than a raw code editor — a sign the
product framing has shifted from "AI editor" to "coding agent." Visible patterns:

- Columns of work: **"IN PROGRESS 3" / "READY FOR REVIEW 3"** with counts.
- Task rows: spinner (`animate-spin`) + title + live status caption ("Reading docs",
  "Fetching data", "Generating plan") — the status text is set in the muted mid-ink.
- A reading/diff pane on the right with the prompt and the file being read (`Reading about-acme.md`).
- The same warm chrome (`#f2f1ed`) / editor (`#f7f7f4`) surfaces as the brand site — **product and
  marketing share one token set.**
- Agent activity is color-cued by the **timeline pastels** (§2.5).

### 8.6 Prose / docs styling

```css
--prose-headings: #26251e --prose-code: #26251e
  --prose-pre-bg: color-mix(in oklab, #26251e 2.5%, transparent)
  /* faint ink wash */
  --prose-bullets: color-mix(in oklab, #26251e 40%, transparent)
  --prose-captions: color-mix(in oklab, #26251e 60%, transparent)
  --prose-code-border-radius: 4px;
```

Docs/blog inherit the same ink-on-paper system; code blocks get a barely-there tinted background
rather than a dark block — consistent with the light-only, low-contrast brand.

---

## 9. Dark mode

The **marketing site is light-only** (`<html data-theme="light">`, `color-scheme: light`). There is
no public brand dark theme — the _brand_ surface stays consistently warm and paper-like. Dark
appearance is reserved for the **product/editor**, which **defaults to dark** and ships multiple
themes. See **§12** for the editor's dark palette and syntax colors. If you are replicating the
_brand_, treat light as the canonical mode.

---

## 10. How to replicate Cursor's look (cheat sheet)

1. **Canvas:** background `#f7f7f4`, chrome/cards `#f2f1ed`, text `#26251e`. Never pure white/black.
2. **Accent:** exactly one — `#f54e00` orange — used sparingly (top-edge glow, key highlights, warnings).
3. **Tone everything else** by mixing the ink into transparent (`color-mix(in oklab, #26251e N%, transparent)`)
   for borders/muted text instead of inventing grays.
4. **Type:** a geometric grotesque for UI (CursorGothic ≈ alternatives like a tightly-tracked
   geometric sans), Berkeley Mono for code, EB Garamond for editorial. **Keep headings at weight 400**
   with negative tracking (`-0.02em` to `-0.03em`).
5. **Spacing:** base your scale on the line unit (`1rem × 1.4`) so spacing snaps to the baseline grid.
6. **Shape:** pill buttons; soft radius (2/4/8/16px). em-based, optically-centered button padding.
7. **Depth:** no real shadows — use the warm surface ladder + 1px tinted hairline rings.
8. **Motion:** ~140ms transitions, `cubic-bezier(.25, 1, .5, 1)` spring-out for entrances.
9. **Restraint:** near-monochrome, regular weights, generous measure-constrained prose. Let the
   typeface and the single orange do the work.

---

## 11. Source tokens — quick reference dump

```css
:root {
  /* ---- Core palette ---- */
  --color-theme-fg: #26251e; /* ink */
  --color-theme-product-editor: #f7f7f4; /* paper */
  --color-theme-product-chrome: #f2f1ed; /* warm gray */
  --color-accent: #f54e00; /* orange (= warning) */
  --color-error: #cf2d56;
  --color-success: #1f8a65;
  --color-theme-fg-02: #3b3a33; /* secondary ink */

  /* ---- Agent timeline ---- */
  --color-timeline-thinking: #dfa88f; /* peach  */
  --color-timeline-grep: #9fc9a2; /* mint   */
  --color-timeline-read: #9fbbe0; /* blue   */
  --color-timeline-edit: #c0a8dd; /* purple */

  /* ---- Type ---- */
  --font-sans: "CursorGothic", "CursorGothic Fallback", system-ui, …;
  --font-mono: "berkeleyMono", ui-monospace, …;
  --font-serif: "EB Garamond", …;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* ---- Spacing (baseline grid) ---- */
  --spacing-v1: calc(1rem * 1.4); /* one line; multiples + /12 subdivisions */

  /* ---- Radius ---- */
  --radius-2xs: 2px;
  --radius-sm: 0.25rem;
  --radius-md: 8px;
  --radius-lg: 0.5rem;
  --radius-2xl: 1rem;

  /* ---- Motion ---- */
  --ease-out-spring: cubic-bezier(0.25, 1, 0.5, 1);
  --default-transition-duration: 0.15s;

  /* ---- Layout ---- */
  --site-header-height: 56px;
  --breakpoint-md: 660px;
  --container-7xl: 80rem;
}
```

---

## 12. The Cursor editor (the dark product surface)

The **IDE is a separate design surface** from the brand site — it **defaults to dark** and inverts
the palette. Values below come from the original **Anysphere** theme (Cursor's bundled editor theme;
exact hexes are from faithful community ports of the shipped theme, so treat them as
high-confidence-but-community-sourced rather than Cursor-published).

### 12.1 Editor chrome (Anysphere dark)

```
editor.background      #181818   (unified near-black across editor/activity bar/side bar/status bar)
editor.foreground      #d6d6dd   (soft off-white)
activityBar.background #181818
sideBar.background     #181818
statusBar.background   #181818
statusBar.foreground   #d6d6dd
```

A **single unified near-black** (`#181818`) for all chrome with a soft `#d6d6dd` foreground — a
low-chroma, calm dark, intentionally _not_ pure black.

### 12.2 Syntax palette (Anysphere) — pastel, mirrors the agent-timeline mood

| Token           | Hex       | Hue            |
| --------------- | --------- | -------------- |
| Comments        | `#6d6d6d` | muted gray     |
| Strings         | `#e394dc` | pink / magenta |
| Keywords        | `#83d6c5` | teal / cyan    |
| Functions       | `#efb080` | warm orange    |
| Classes / types | `#87c3ff` | light blue     |

The same **desaturated-pastel** sensibility seen in the marketing site's agent-timeline colors
(§2.5) carries into the editor's syntax highlighting — calm pastels rather than neon.

### 12.3 Built-in editor themes

- **Default Light Modern** and **Default Dark Modern** — inherited from the VS Code base.
- **Cursor Dark** — the proprietary Cursor theme (the truly Cursor-specific one).
- The original **Anysphere** theme was succeeded by **"Anysphere Modern"** around Cursor 0.47+,
  so the exact editor theme specifics evolve release-to-release.

---

## 13. Sources & confidence

This document combines **primary live inspection** of `cursor.com` (the strongest evidence — actual
computed CSS variables and element styles, captured June 2026) with a **multi-source, adversarially
verified research pass** (20 sources fetched, 25 claims triple-voted; 16 confirmed, 9 refuted).

**Primary / highest confidence (verified from the live site or Cursor's own pages):**

- All §§2–8 tokens (colors, type, spacing, radius, motion, layout, components) — read from live
  computed styles.
- `cursor.com/brand` — logo lockups, 2D/2.5D/3D versions, app-icon variants.
- `cursor.com` homepage — tagline, autonomy-slider (Karpathy) framing.
- `cursor.com/help/customization/themes`, `cursor.com/docs` — editor theme names.

**Secondary / corroborated (high confidence, not Cursor-published):**

- _The Brand Identity_ — Kimera case study: typeface lineage (Waldenburg), logo refinement, rebrand
  attribution (Kimera + Justin Jay Wang + Cursor; founder Michael Clasen).
- Ryo Lu (@ryolu\_) announcement tweet — "our own typeface: Cursor Gothic."
- Community theme ports (e.g. `hasokeric/cursor-anysphere-theme`) — editor hex values.
- Design teardowns (shadcn.io/design, VoltAgent DESIGN.md) — `#f54e00`, `#d04200`, cream tokens.

**Explicitly refuted / NOT confirmed (don't repeat these):**

- ❌ Card surfaces are pure `#ffffff` — false; the live site uses **warm off-whites** only.
- ❌ Editor uses **JetBrains Mono** — false; mono is **Berkeley Mono** (→ Cursor Mono in future).
- ❌ Marketing site has a **dark / scenic-wallpaper aesthetic** — false; it's the **light cream** canvas.
- ❌ The default editor theme is literally named **"Anysphere"** — the user-facing defaults are the
  _Modern_ themes + _Cursor Dark_.
- ❌ A specific published display type scale ("72px hero at weight 400, −2.16px tracking") — refuted
  as a verbatim claim; the _token_ `--text-2xl: 4.5rem (72px)` exists, but rendered hero size is
  responsive (≈24px at narrow widths in this capture). Use the **token scale** in §3.3 as canonical.

**Time-sensitivity:** reflects the **September 2025 Kimera rebrand** and the editor's original
Anysphere theme. Cursor Mono is still in development; editor themes evolve per release.

---

_Stack confirmed by inspection: Next.js + Tailwind CSS v4 (tokens exposed as `--color-_`,
`--spacing-_`, `--text-_`), self-hosted Next.js font modules (CursorGothic, Berkeley Mono,
EB Garamond), light-mode-only marketing site. All values above are read from the live computed
styles of `cursor.com`.\*
