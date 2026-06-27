# Cloudflare - Design System Teardown

> A full reverse-engineering of **Cloudflare's** visual and product design language, captured from
> the current **Kumo** component library (`@cloudflare/kumo`, the system Cloudflare ships today), the
> legacy open-source **cf-ui** framework, the internal **Cloudflare Design System** as described in
> Cloudflare's own engineering posts, and the public brand specification. This paper mirrors the
> Cursor, Twenty, Shopify, Atlassian, Fluent 2, Vercel, Linear, and ChatGPT teardowns. Cloudflare is
> a useful case for us because its current system, **Kumo, is built on the same stack we are**: Base
> UI primitives, Phosphor icons, a `cn()`-style class composer, and a strict token-only styling rule.
>
> **Method:** brand values are read from Cloudflare's published brand color spec and rebrand history.
> Current token values are read directly from the live `@cloudflare/kumo@2.6.0` source on the
> `cloudflare/kumo` `main` branch — specifically the generated `packages/kumo/src/styles/theme-kumo.css`
> and the package manifest. Internal design-system behavior (ten-hue/ten-luminosity scales, dark
> mode) is read from Cloudflare's own engineering blog. Legacy values are read from the open-source
> `cloudflare/cf-ui` styleguide. Captured June 2026.
>
> **Primary sources:** [`cloudflare/kumo`](https://github.com/cloudflare/kumo) and
> [kumo-ui.com](https://kumo-ui.com); [`cloudflare/cf-ui`](https://github.com/cloudflare/cf-ui) and
> the [cf-ui styleguide](https://cloudflare.github.io/cf-ui/);
> [Dark Mode for the Cloudflare Dashboard](https://blog.cloudflare.com/dark-mode/);
> [CloudFlare becomes Cloudflare](https://blog.cloudflare.com/time-for-an-update/); and the public
> Cloudflare brand color spec.

---

## 0. TL;DR - the design in one paragraph

Cloudflare's design language is **trust-infrastructure pragmatism with one loud brand mark and a
quiet product UI**. The thing everyone remembers — Cloudflare orange (`#F6821F`, Pantone 1505 C) —
is a **brand-identity color, not a product-action color**. Inside the product, Cloudflare's current
system (**Kumo**) reserves orange for the logo and brand text accent and drives interactive UI with
**blue** (`oklch(0.5772 0.2324 260)` for the action accent, blue links, blue focus/info). The rest
of the interface is an achromatic neutral ramp authored in **oklch**, layered into a named surface
hierarchy — `canvas` / `base` / `elevated` / `recessed` / `tint` / `overlay` — with a hairline
border (`kumo-line`, `kumo-hairline`) and low-alpha edge/drop shadows. Dark mode is not a second
theme but a **luminosity reversal** delivered through CSS `light-dark()`, toggled by
`data-mode="light|dark"`; off-black sits around `oklch(17%)` (≈ `#1D1D1D`), matching Cloudflare's
documented "off black" decision. Typography is **compact and operational**: 12 / 13 / 14 / 16px
(`xs`/`sm`/`base`/`lg`), 14px base, no display sizes in the product kit (those live in marketing).
Kumo is built on **Base UI + Phosphor + `clsx`/`tailwind-merge` + `motion`**, tokens are
**auto-generated and semantic-only** (`bg-kumo-base`, `text-kumo-default`, `border-kumo-line`,
`ring-kumo-hairline`), raw Tailwind colors are lint-forbidden, and there's a `fedramp` theme slot
for the compliance product. The design DNA is: **orange brand, blue action, oklch neutrals, named
surfaces, hairline depth, `light-dark()` theming, dense operational type, and a Base-UI/Phosphor
component kit with an AI-readable registry.**

---

## 1. Brand identity & philosophy

| Aspect                     | What Cloudflare does                                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company / product**      | Cloudflare runs a global connectivity cloud: CDN, DNS, DDoS/WAF security, Zero Trust/SASE, and the Workers developer platform (Workers, Pages, R2, D1, KV, Durable Objects). |
| **Design-system name**     | **Kumo** (Japanese for "cloud") is the current component library; **cf-ui** was the earlier open-source framework; an internal **Cloudflare Design System** governs brand.   |
| **Design org framing**     | Cloudflare frames its design system as shared "primitives like typography, color, layout, and icons" plus a reusable component library so every product is consistent.       |
| **Primary user context**   | Operators and developers managing zones, security posture, networks, and edge code — plus marketing/docs surfaces aimed at the same technical audience.                      |
| **Aesthetic stance**       | Reliability over flash: one strong brand orange, an otherwise neutral and accessible product UI, dense data, and explicit state.                                             |
| **Voice**                  | Plain, security-credible, slightly playful at the brand layer ("Helping build a better Internet"). Product copy is direct and operational.                                   |
| **Interaction philosophy** | Status-rich infrastructure dashboards: tables, meters, charts, command palettes, banners, and per-zone/per-product navigation, all keyboard- and screen-reader-aware.        |
| **Design DNA in one line** | Orange brand mark + blue product action + oklch neutrals + named surfaces + hairline depth + `light-dark()` theming + compact operational type.                              |

### 1.1 Cloudflare is "orange brand, blue product"

The single most important Cloudflare rule, and the one most people get wrong: **orange is not the
button color.** Cloudflare orange (`#F6821F`) belongs to the logo, the wordmark, and the brand text
accent. In the actual product, Kumo's `--text-color-kumo-brand` is pinned to `#f6821f` and used as a
brand/identity accent, while the interactive accent — `--color-kumo-brand`, links, info, and focus —
is **blue**. Cloudflare's own dark-mode writeup confirms the intent: it specifically preserves
"blue for calls-to-action" across themes. So a faithful Cloudflare UI is mostly neutral, uses orange
sparingly as identity, and uses blue for primary actions and links.

### 1.2 The 2016 rebrand set the tone

Cloudflare lowercased "CloudFlare" to "Cloudflare" and modernized the two-cloud mark in 2016. The
takeaway for the system is restraint: the brand is the orange mark and the name; everything else is
allowed to be calm. Cloudflare is a security/infrastructure company, and the UI is built to read as
trustworthy and legible rather than expressive.

### 1.3 Product surfaces

| Surface                      | Visual mode                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| **Marketing site**           | Orange-forward hero moments, large brand type, product storytelling, gradients in illustration.  |
| **Developer docs**           | Dense technical docs shell with left nav, code blocks, tables, and product-scoped sections.      |
| **Dashboard / app UI**       | The core: zones, analytics, security events, Workers, settings — compact tables, meters, charts. |
| **Workers / platform pages** | Developer-native: code, KV/R2/D1 objects, deploy/logs, Wrangler CLI affordances.                 |
| **Compliance (FedRAMP)**     | A dedicated `data-theme="fedramp"` slate variant for the government cloud.                       |

The same grammar runs through all of them: neutral surface, hairline border, blue action, orange
identity, mono/data where technical facts appear.

---

## 2. Token architecture

Cloudflare has run **three** token generations, and reading them together tells the story.

| Generation                   | Token model                                                                                             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| **cf-ui** (legacy, OSS)      | Fela CSS-in-JS constants: named colors (`tangerine`, `marine`, `charcoal`), gradients, 16×16 icon grid. |
| **Cloudflare Design System** | Internal primitives: ten hues × ten luminosity steps, dark mode via luminosity `reverse()`.             |
| **Kumo** (current, OSS)      | Tailwind-v4-style CSS custom properties, **auto-generated**, semantic-only, `light-dark()`-themed.      |

### 2.1 Kumo is the current truth

`@cloudflare/kumo@2.6.0` is the system to study. Its tokens live in
`packages/kumo/src/styles/theme-kumo.css`, which is **generated** — the human-edited source is
`packages/kumo/scripts/theme-generator/config.ts`. That means Cloudflare treats tokens as build
output, not hand-tuned CSS, exactly like a mature pipeline.

The Kumo styling contract (from the repo's `AGENTS.md`) is strict and small:

| Rule                  | Detail                                                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Semantic tokens only  | `bg-kumo-base`, `bg-kumo-elevated`, `bg-kumo-recessed`, `text-kumo-default`, `border-kumo-line`, `ring-kumo-hairline`. |
| Allowed escapes       | `bg-white`, `bg-black`, `text-white`, `text-black`, `transparent`.                                                     |
| No raw Tailwind color | `bg-blue-500`, `text-gray-*` **fail linting** — they break theming.                                                    |
| No `dark:` variants   | Tokens auto-adapt through `light-dark()`; `dark:` is redundant and forbidden.                                          |
| Compose with `cn()`   | `cn("base", cond && "extra", className)` — `clsx` + `tailwind-merge`.                                                  |

If that list reads like our own Design DNA, that is the point — see §14.

### 2.2 Token families captured from the live theme

| Token family                         | Example                                                | Role                                            |
| ------------------------------------ | ------------------------------------------------------ | ----------------------------------------------- |
| `--color-kumo-*`                     | `--color-kumo-canvas`, `--color-kumo-base`             | Surface hierarchy and semantic UI color.        |
| `--text-color-kumo-*`                | `--text-color-kumo-default`, `--text-color-kumo-brand` | Text roles: default, subtle, brand, link, etc.  |
| `--color-neutral-*`                  | `--color-neutral-900` = `oklch(21% 0.006 285.885)`     | Achromatic oklch neutral ramp (Tailwind-style). |
| `--color-kumo-neutral-*`             | `--color-kumo-neutral-25` = `oklch(98.75% 0 0)`        | Extended Kumo-specific neutral steps.           |
| `--text-*` / `--text-*--line-height` | `--text-base: 14px`                                    | Compact type scale.                             |

### 2.3 Theming model

Theme and mode are **attributes on an ancestor**, not class forks:

```html
<html data-theme="kumo" data-mode="light">
  …
</html>
<html data-theme="kumo" data-mode="dark">
  …
</html>
<html data-theme="fedramp">
  …
</html>
```

Every themed token is authored as `light-dark(<light>, <dark>)`, so a single declaration carries both
modes. `data-mode` flips the resolved side; `data-theme` swaps the whole palette (the `fedramp`
variant overrides surfaces to a slate/steel blue-gray, e.g. `--color-kumo-canvas: #5b697c`).

### 2.4 Consumption model

1. **CSS variables** for raw tokens (`theme-kumo.css`).
2. **Tailwind utilities** mapped to those variables (`bg-kumo-base`, `text-kumo-default`).
3. **Kumo React components** (`@cloudflare/kumo/<component>`), tree-shakeable.
4. **Base UI primitives** re-exported from `@cloudflare/kumo/primitives` for advanced composition.
5. **An AI/registry layer** (`registry`, `catalog`, `ai/schemas.ts`) describing components for tools.

---

## 3. Color system

### 3.1 The two-accent split

| Role                   | Token                      | Value                                               | Meaning                                 |
| ---------------------- | -------------------------- | --------------------------------------------------- | --------------------------------------- |
| **Brand identity**     | `--text-color-kumo-brand`  | `#f6821f` (fixed, both modes)                       | Cloudflare orange — logo, brand accent. |
| **Interactive action** | `--color-kumo-brand`       | `light-dark(oklch(0.5772 0.2324 260), …−10% black)` | Blue — primary action surface.          |
| **Action hover**       | `--color-kumo-brand-hover` | `oklch(48.8% 0.243 264.376)` (blue-700)             | Hover state for the blue action.        |
| **Link / info**        | `--text-color-kumo-link`   | `light-dark(blue-800, blue-400)`                    | Links and informational text are blue.  |

This is the heart of Cloudflare color discipline. Orange signals _who_ (Cloudflare); blue signals
_do_ (act, navigate, focus). Reproductions that flood buttons with orange look like Cloudflare-themed
fan art, not Cloudflare.

### 3.2 Neutral ramp (oklch, achromatic)

Cloudflare authors neutrals in **oklch** with near-zero chroma. The default text neutral carries a
whisper of hue (`oklch(21% 0.006 285.885)`), but surfaces are pure achromatic.

| Token                 | Light                      | Dark               |
| --------------------- | -------------------------- | ------------------ |
| `--color-neutral-50`  | —                          | `oklch(98.5% 0 0)` |
| `--color-neutral-100` | `oklch(97% 0 0)`           | `oklch(97% 0 0)`   |
| `--color-neutral-200` | `oklch(92.2% 0 0)`         | `oklch(92.2% 0 0)` |
| `--color-neutral-300` | `oklch(87% 0 0)`           | —                  |
| `--color-neutral-400` | `oklch(70.8% 0 0)`         | `oklch(70.8% 0 0)` |
| `--color-neutral-500` | `oklch(55.6% 0 0)`         | `oklch(55.6% 0 0)` |
| `--color-neutral-600` | —                          | `oklch(43.9% 0 0)` |
| `--color-neutral-700` | —                          | `oklch(37.1% 0 0)` |
| `--color-neutral-800` | `oklch(26.9% 0 0)`         | `oklch(26.9% 0 0)` |
| `--color-neutral-900` | `oklch(21% 0.006 285.885)` | `oklch(20.5% 0 0)` |
| `--color-neutral-950` | `oklch(14.5% 0 0)`         | —                  |

### 3.3 Surface hierarchy

Cloudflare names its layers instead of nudging gray by hand:

| Token                   | Light               | Dark                         | Role                        |
| ----------------------- | ------------------- | ---------------------------- | --------------------------- |
| `--color-kumo-canvas`   | `oklch(98.75% 0 0)` | `oklch(10% 0 0)`             | App background (deepest).   |
| `--color-kumo-base`     | `#fff`              | `oklch(17% 0 0)` ≈ `#1D1D1D` | Default card/panel surface. |
| `--color-kumo-elevated` | `oklch(98% 0 0)`    | `oklch(12% 0 0)`             | Raised surface.             |
| `--color-kumo-recessed` | `oklch(96% 0 0)`    | `oklch(15% 0 0)`             | Inset/well surface.         |
| `--color-kumo-tint`     | `oklch(97% 0 0)`    | `oklch(26.9% 0 0)`           | Subtle fill.                |
| `--color-kumo-overlay`  | `oklch(97.5% 0 0)`  | `oklch(26.9% 0 0)`           | Popover/menu fill.          |
| `--color-kumo-contrast` | `oklch(8.5% 0 0)`   | `oklch(98.5% 0 0)`           | Inverse surface.            |

Note the direction: in light mode `canvas` is _lighter_ than `base`, so the page recedes and cards
sit forward; dark mode inverts via the same tokens.

### 3.4 Text roles

| Token                           | Light         | Dark          |
| ------------------------------- | ------------- | ------------- |
| `--text-color-kumo-default`     | `neutral-900` | `neutral-100` |
| `--text-color-kumo-strong`      | `neutral-950` | `neutral-50`  |
| `--text-color-kumo-subtle`      | `neutral-500` | `neutral-400` |
| `--text-color-kumo-placeholder` | `neutral-400` | `neutral-500` |
| `--text-color-kumo-inactive`    | `neutral-300` | `neutral-600` |
| `--text-color-kumo-inverse`     | `neutral-100` | `neutral-900` |

### 3.5 Semantic status scales

Each status has a saturated token and a low-saturation `-tint` for backgrounds.

| Status  | `--color-kumo-<status>` (light)          | `-tint` (light) |
| ------- | ---------------------------------------- | --------------- |
| Info    | blue-500 `oklch(68.5% 0.169 237.323)`    | blue-100        |
| Success | emerald-600 `oklch(59.6% 0.145 163.225)` | emerald-100     |
| Warning | yellow-500 `oklch(79.5% 0.184 86.047)`   | yellow-100      |
| Danger  | red-500 `oklch(63.7% 0.237 25.331)`      | red-100         |

Banners use the same hues at reduced alpha (`--color-kumo-banner-info: …/ 0.7`).

### 3.6 Badge / data palette

For categorical data Kumo ships a fixed badge palette — **red, green, orange, purple, teal, blue,
neutral** — each with solid and subtle variants (e.g. `--color-kumo-badge-orange: oklch(81.5% 0.197 76)`,
`--color-kumo-badge-teal: oklch(54.9% 0.096 184.565)`). These are semantic data labels, not general
decoration — the same discipline Twenty and Linear apply to tags.

### 3.7 Dark mode is a luminosity reversal

Cloudflare's documented technique: build ten-hue × ten-luminosity scales where the first five steps
contrast with light text and the last five with dark text, then **`reverse()` the luminosity** to get
dark mode for free — hue and saturation (and therefore color _meaning_) are preserved. They also
chose "off black" (`#1D1D1D`, ≈ `oklch(17%)`) over pure black to reduce harshness while holding WCAG
AA. Kumo expresses the same idea declaratively through `light-dark()`.

### 3.8 Legacy cf-ui palette (for older surfaces)

cf-ui used **named** colors rather than scales: `tangerine #FF7900`, `carrot #f56500`,
`lightning #FFDB6F`, `marine #2F7BBF`, `sky #76C4E2`, `grass #9BCA3E`, `dew #85CBA8`,
`apple #BD2527`, `cherry #9F1F21`, `dawn #F16975`, plus neutrals `charcoal #333333`, `night #404041`,
`dusk #4D4D4F`, `cement #7D7D7D`, and named gradients (`skyDew`, `twilightSunset`, `sunriseLightning`).
Useful when reading old Cloudflare UI; superseded by the oklch scales in current work.

---

## 4. Typography

### 4.1 Typefaces

Cloudflare runs distinct type at each layer, and is more reserved than Vercel here.

| Layer                 | Typeface                                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Brand wordmark**    | A proprietary **custom geometric sans-serif** (slightly condensed, rounded terminals, even strokes). Not publicly distributed. |
| **Product / docs UI** | A neutral sans stack (Cloudflare serves and widely uses **Inter**; product UI reads as Inter/system sans).                     |
| **Code / data**       | A monospace stack for code blocks, IDs, hashes, regions, and CLI output (Kumo bundles **Shiki** for highlighting).             |

Kumo itself **does not define a font-family token** in `theme-kumo.css` — it inherits the host
application's font (Tailwind's default sans/mono), which in Cloudflare's apps resolves to an Inter/
system sans. This is a deliberate "don't fight the platform" choice, opposite to Vercel's "Geist
everywhere."

> Caveat: a third-party reconstruction circulating online attributes "FT Kunst Grotesk" and "Apercu
> Mono Pro" to Cloudflare. We could **not** confirm those against any Cloudflare-controlled source and
> do not treat them as canonical. See §16.

### 4.2 Type scale (Kumo)

The product scale is small and operational — there are **no display sizes** in the component kit,
because heroes live in marketing, not in the dashboard.

| Token         | Size   | Line height          |
| ------------- | ------ | -------------------- |
| `--text-xs`   | `12px` | `calc(1 / 0.75)`     |
| `--text-sm`   | `13px` | `calc(1 / 0.85)`     |
| `--text-base` | `14px` | `calc(1.25 / 0.875)` |
| `--text-lg`   | `16px` | `calc(1.25 / 1)`     |

`14px` is the base. That single fact tells you the system's posture: dense dashboards where many
rows must fit on screen, not editorial reading surfaces.

### 4.3 Typography DNA

- Compact and legible; built for tables, forms, and metadata.
- Hierarchy from size and color role (`default`/`strong`/`subtle`), not heavy weight flooding.
- Mono is a first-class data texture (code, IDs, regions, hashes, CLI).
- Brand expressiveness is confined to the marketing layer; the product stays neutral.

---

## 5. Spacing and layout

### 5.1 Spacing

Kumo does not ship a bespoke spacing scale in `theme-kumo.css`; it rides **Tailwind v4's 4px-based
spacing system** (`--spacing` = `0.25rem` default), the same 4px grammar every other system in this
set uses. The RealtimeKit UI kit, a separate Cloudflare product theming layer, makes the base unit
explicit (`--rtk-space-1: 4px`, configurable via `spacingBase`), confirming the 4px convention.

### 5.2 Layout character

Cloudflare layout feels:

- Dense and table-forward in the dashboard (zones, DNS records, security events, analytics rows).
- Organized by product navigation: account → zone/product → section → settings.
- Card-and-panel based, with `canvas` behind and `base`/`elevated` surfaces forward.
- Wider and more expressive only on marketing and some docs landing surfaces.

### 5.3 Two densities, one foundation

Like us, Cloudflare runs a dense operational lane (dashboard) and a more spacious brand/marketing
lane on a shared token base. The split is by surface, not by a forked design system.

---

## 6. Shape, radius, and forms

### 6.1 Radius

Kumo inherits **Tailwind's radius scale** (`--radius-sm`…`--radius-xl`, `rounded-md` ≈ 6px as the
common control radius) rather than redefining radii in the theme file. Cloudflare's product UI reads
as **gently rounded** — softer than Vercel's near-square 6px materials, not as pill-forward as a
consumer app. The RealtimeKit kit exposes the conceptual menu (`sharp`, `rounded`, `extra-rounded`,
`circular`), which mirrors how Cloudflare thinks about radius as a small, named set.

### 6.2 Forms and controls

Controls (`input`, `select`, `combobox`, `checkbox`, `radio`, `switch`, `field`, `input-group`,
`sensitive-input`) sit on `--color-kumo-control` (`#fff` light / `neutral-900` dark) with
`border-kumo-line` hairlines and blue focus. `sensitive-input` is a Cloudflare-specific control —
secrets/tokens are a real object in this product, so masked entry is a first-class component.

### 6.3 Border and hairline

| Token                   | Light                        | Dark          |
| ----------------------- | ---------------------------- | ------------- |
| `--color-kumo-line`     | `oklch(14.5% 0 0 / 0.1)`     | `neutral-750` |
| `--color-kumo-hairline` | `neutral-150` `oklch(93.5%)` | `neutral-800` |

The default border is **low-alpha black over the surface**, the same hairline technique Vercel and we
use. Borders, not shadows, do most of the structural work.

---

## 7. Depth, elevation, and shadows

Cloudflare keeps depth quiet and token-named — it does not hand-tune `box-shadow`.

| Token                      | Light                  | Dark                    | Role                    |
| -------------------------- | ---------------------- | ----------------------- | ----------------------- |
| `--color-kumo-shadow-edge` | `oklch(0% 0 0 / 0.12)` | `oklch(100% 0 0 / 0.1)` | Hairline edge bevel.    |
| `--color-kumo-shadow-drop` | `oklch(0% 0 0 / 0.08)` | `oklch(0% 0 0 / 0.3)`   | Drop shadow for floats. |
| `--color-kumo-tip-shadow`  | `gray-200`             | `transparent`           | Tooltip shadow.         |
| `--color-kumo-tip-stroke`  | `transparent`          | `neutral-800`           | Tooltip stroke (dark).  |

Two details worth flagging:

1. The **`shadow-edge`** token is conceptually identical to our `edge` hairline — an inset edge that
   defines a surface without a heavy drop shadow.
2. In dark mode the edge highlight becomes **white at low alpha** and tooltips swap shadow for a
   **stroke**, because shadows don't read on dark surfaces. This is the same lesson Polaris and we
   encode: dark elevation needs a different signal than light elevation.

---

## 8. Motion and focus

### 8.1 Motion

Kumo ships **`motion`** (the successor to Framer Motion) as a dependency, so animation is a real,
componentized concern (overlays, dialogs, popovers, toasts, collapsibles). The personality is
functional: enter/exit transitions on floating surfaces and state changes, not decorative movement.

### 8.2 Focus

| Token                | Light                      | Dark                         |
| -------------------- | -------------------------- | ---------------------------- |
| `--color-kumo-focus` | `neutral-950` `oklch(15%)` | `neutral-150` `oklch(93.5%)` |
| `ring-kumo-hairline` | hairline ring utility      | hairline ring utility        |

Focus is a high-contrast neutral ring (dark ring on light, light ring on dark), with blue reserved
for interactive/link semantics. Because Kumo is built on Base UI, focus management, keyboard
behavior, and ARIA come from the primitive layer rather than per-component reinvention.

---

## 9. Components and patterns

### 9.1 The Kumo component set

`@cloudflare/kumo@2.6.0` exports 50+ tree-shakeable modules:

- **Actions & inputs:** `button`, `link`, `input`, `input-group`, `sensitive-input`, `checkbox`,
  `radio`, `switch`, `select`, `combobox`, `autocomplete`, `field`, `label`, `date-picker`,
  `date-range-picker`.
- **Surfaces & layout:** `surface`, `layer-card`, `grid`, `sidebar`, `tabs`, `toolbar`, `menubar`,
  `collapsible`, `table-of-contents`, `breadcrumbs`.
- **Overlays & feedback:** `dialog`, `popover`, `tooltip`, `dropdown`, `toast`, `banner`, `loader`,
  `empty`, `command-palette`.
- **Data display:** `table`, `pagination`, `meter`, `chart` (ECharts), `badge`, `text`.
- **Developer-native:** `code` (Shiki highlighting), `clipboard-text`, `cloudflare-logo`, `flow`.

### 9.2 What the set reveals

Cloudflare components are built for **infrastructure operations**:

- `meter` and `chart` because dashboards are analytics-heavy (traffic, requests, threats).
- `sensitive-input` and `clipboard-text` because tokens, keys, and IDs are core objects.
- `command-palette` because power users navigate a huge product surface by keyboard.
- `banner` because account/zone-level state (incidents, plan limits, warnings) must be announced.
- `code` with Shiki because Workers/Wrangler/config snippets are first-class content.
- `cloudflare-logo` as a shipped component — the brand mark is a controlled, reusable element.

### 9.3 Foundation: Base UI + Phosphor

| Choice             | Detail                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------- |
| Primitives         | `@base-ui/react@^1.6.0`; 40+ primitives re-exported from `@cloudflare/kumo/primitives`. |
| Icons              | `@phosphor-icons/react` (peer dependency).                                              |
| Class composition  | `clsx` + `tailwind-merge` (a `cn()` helper).                                            |
| Code highlighting  | `shiki` + `@shikijs/langs` + `@shikijs/themes`.                                         |
| Charts (optional)  | `echarts@^6`.                                                                           |
| Schemas (optional) | `zod@^4` for the AI/registry layer.                                                     |
| `displayName`      | Required on `forwardRef` components for DevTools.                                       |

### 9.4 Legacy cf-ui

cf-ui (React + Fela + Lerna, 50+ packages, 30+ components: `Box`, `Card`, `Page`, `Table`,
`Pagination`, `Tabs`, `Modal`, `Notifications`, form controls) also open-sourced accessibility
helpers — `react-modal2`, `a11y-focus-store`, `a11y-focus-scope` — signaling that focus management
was a deliberate concern long before Kumo formalized it on Base UI.

---

## 10. Accessibility and governance

### 10.1 Accessibility

- Kumo inherits keyboard nav, focus management, and ARIA from **Base UI** primitives.
- Dark mode was built so each component was reviewed across **default / focus / hover / active**.
- Color scales are engineered for contrast (first five steps vs light text, last five vs dark text)
  and verified at **WCAG AA 4.5:1**; "off black" was chosen partly for contrast comfort.
- The legacy cf-ui shipped dedicated a11y focus libraries, establishing the lineage.

### 10.2 Governance

| Mechanism               | Effect                                                                     |
| ----------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- |
| Auto-generated tokens   | `theme-kumo.css` is generated from `config.ts`; designers edit one source. |
| Lint-enforced token use | Raw Tailwind colors and `dark:` variants fail linting.                     |
| `light-dark()` theming  | One declaration carries both modes; no parallel dark stylesheet to drift.  |
| Theme slots             | `data-theme="kumo                                                          | fedramp"` swaps palettes without touching components. |
| AI/registry + schemas   | A machine-readable registry/catalog (`zod` schemas) describes components.  |
| Figma plugin            | Token sync between design and code.                                        |

This is a genuinely mature governance model — token-as-build-output plus lint enforcement plus a
machine-readable registry.

---

## 11. AI and the agent layer

Cloudflare's AI story has two faces, and the design system touches both.

### 11.1 Kumo is built to be AI-readable

Kumo ships a **`registry`**, a **`catalog`**, and an **`ai/schemas.ts`** module, with `zod` as an
optional dependency. In other words, the component library is structured so that **agents and tools
can enumerate and reason about components and their props** — the same instinct behind our shipped
`design-rules` item. The repo's `AGENTS.md` is itself an agent-facing contract for how to style with
Kumo. This makes Cloudflare one of the few systems in this set that treats "an AI will author with
this" as a first-class requirement.

### 11.2 Cloudflare's AI products inherit the product model

Cloudflare's AI surface (Workers AI, AI Gateway, Vectorize, AutoRAG, the AI dashboards) sits inside
the existing infrastructure grammar: tables of models, usage meters, charts, code blocks, logs, and
neutral surfaces with blue action. There is no separate "AI purple" sparkle layer — AI is rendered
as one more measurable, operable product object, consistent with how mature systems keep AI
subordinate to the product model.

### 11.3 AI design rules in Cloudflare style

1. Keep AI surfaces neutral and operational: tables, meters, charts, code, logs.
2. Use blue for action/links, orange only as brand identity — even on AI pages.
3. Render model/provider/tool names and IDs in mono.
4. Treat tokens/keys as sensitive objects (`sensitive-input`, `clipboard-text`).
5. Expose state explicitly (loaders, banners, toasts) instead of ambient animation.
6. Make components machine-describable (registry/schemas) so agents can build with them.

---

## 12. Implementation architecture

### 12.1 Packages and stack

| Asset / package          | Status                   | Role                                                        |
| ------------------------ | ------------------------ | ----------------------------------------------------------- |
| `@cloudflare/kumo`       | Public npm (MIT), v2.6.0 | Current component library; Base UI + Phosphor + tokens.     |
| `cloudflare/cf-ui`       | Public OSS (legacy)      | Earlier Fela/Lerna framework; superseded.                   |
| kumo-ui.com              | Public docs              | Kumo documentation and component reference.                 |
| Cloudflare Design System | Internal                 | Brand primitives (logo, type, color, layout, icons, video). |

### 12.2 Theme scaffold (Cloudflare-like)

```css
:root,
[data-theme="kumo"] {
  /* surfaces (light) */
  --color-kumo-canvas: oklch(98.75% 0 0);
  --color-kumo-base: #fff;
  --color-kumo-elevated: oklch(98% 0 0);
  --color-kumo-recessed: oklch(96% 0 0);
  /* text */
  --text-color-kumo-default: oklch(21% 0.006 285.885);
  --text-color-kumo-subtle: oklch(55.6% 0 0);
  /* accents */
  --text-color-kumo-brand: #f6821f; /* orange = identity */
  --color-kumo-brand: oklch(0.5772 0.2324 260); /* blue = action */
  /* lines + type */
  --color-kumo-line: oklch(14.5% 0 0 / 0.1);
  --text-base: 14px;
}
```

Better still, author each value as `light-dark(<light>, <dark>)` and flip with `data-mode`, exactly
as Kumo does, so dark mode requires no second sheet.

### 12.3 Button recipe

```tsx
// Primary action = blue, not orange.
const button = {
  alignItems: "center",
  background: "var(--color-kumo-brand)",
  border: "1px solid transparent",
  borderRadius: "0.375rem", // rounded-md
  color: "var(--color-white)",
  display: "inline-flex",
  fontSize: "14px",
  height: "32px",
  justifyContent: "center",
  paddingInline: "12px",
}
```

### 12.4 Code block recipe

```tsx
const codeBlock = {
  background: "var(--color-kumo-recessed)",
  border: "1px solid var(--color-kumo-line)",
  borderRadius: "0.375rem",
  color: "var(--text-color-kumo-default)",
  fontFamily: "var(--font-mono)",
  fontSize: "13px",
  padding: "12px",
}
```

Use Shiki for highlighting and include a `clipboard-text` copy affordance.

---

## 13. Comparison with the other teardowns

| System         | Core visual idea                                                   | Accent logic                                 | Type personality                          | Layout density                        |
| -------------- | ------------------------------------------------------------------ | -------------------------------------------- | ----------------------------------------- | ------------------------------------- |
| Cursor         | Warm editorial paper + one orange accent                           | Fixed orange brand accent                    | Custom grotesque + mono + serif           | Spacious marketing, dark editor       |
| Twenty         | Notion-like neutral CRM + Radix color labels                       | Indigo accent + many Radix data colors       | Inter, compact SaaS                       | Dense CRM app                         |
| Shopify        | Merchant operations UI through Polaris                             | Shopify green + commerce status colors       | Practical admin typography                | Dense admin/product surfaces          |
| Atlassian      | Teamwork UI with mature intent tokens                              | Atlassian Blue + semantic role colors        | Atlassian Sans/Mono                       | Dense enterprise collaboration        |
| Fluent 2       | Microsoft productivity UI, product-swappable brand slots           | Web blue / Teams purple via theme slots      | Segoe UI/system                           | Very dense work UI                    |
| Vercel         | Developer-tool minimalism: Geist, monochrome, code, grid           | Blue only for focus/link                     | Geist Sans/Mono/Pixel                     | Dense dashboard, spacious marketing   |
| Linear         | Dark product-development OS                                        | Restrained indigo                            | Inter Variable + Berkeley Mono            | Dense operational workbench           |
| ChatGPT        | Quiet conversational host UI                                       | User-selected accent + semantic status       | OpenAI Sans + system                      | Conversation lane + app cards         |
| **Cloudflare** | Trust-infrastructure UI: orange brand, blue action, oklch neutrals | **Orange = identity, blue = action** (split) | Inter/system + mono; proprietary wordmark | Dense dashboard, expressive marketing |

Cloudflare is the clearest example in the set of **separating brand color from action color**. Cursor
and Shopify let their brand color _be_ the accent; Cloudflare deliberately does not. It is also the
system whose engineering choices (Base UI, Phosphor, `cn()`, token-only, `light-dark()`) line up most
closely with ours.

---

## 14. Relationship to byronwade/ui

Kumo is, of all the systems we've studied, the **closest to our own architecture** — which makes it
the most useful as both validation and contrast.

| Dimension   | Cloudflare / Kumo                                        | byronwade/ui implication                                                    |
| ----------- | -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Primitives  | Base UI + `forwardRef` + `displayName`.                  | Same primitive contract; validates our Base UI choice.                      |
| Icons       | Phosphor (peer dep).                                     | We also standardize on Phosphor via `@/lib/icons` — direct alignment.       |
| Class merge | `clsx` + `tailwind-merge` (`cn()`).                      | Identical to our `cn()` rule.                                               |
| Tokens      | Auto-generated, semantic-only, raw color lint-forbidden. | Mirrors our "tokens only, never raw color" law.                             |
| Theming     | `light-dark()` + `data-mode`/`data-theme` slots.         | We theme via tokens too; `data-theme="fedramp"` ≈ our re-skin model.        |
| Depth       | `shadow-edge` hairline + low-alpha drop.                 | Conceptually our `edge` hairline; reinforces flat-with-hairline depth.      |
| Accent      | **Two accents**: fixed orange identity + blue action.    | We keep **one** re-skinnable `--brand`; Cloudflare's split is the contrast. |
| Data color  | Fixed badge palette (red/green/orange/purple/teal/blue). | Like our fixed chart/activity exceptions — semantic, not decorative.        |
| AI          | Machine-readable registry + `AGENTS.md` + zod schemas.   | Directly parallels our shipped `design-rules` item and agent posture.       |

**What to borrow:** the `light-dark()` single-declaration theming idea; the named surface hierarchy
(`canvas`/`base`/`elevated`/`recessed`); the machine-readable component registry for agents; the
"off-black, not pure black" dark-surface choice.

**Where we stay distinct:** Cloudflare runs **two** fixed accents (orange identity + blue action) and
pins orange to a literal hex. We keep **one** re-skinnable `--brand` so a consumer re-skins the whole
system from a single variable. We also keep a **warm editorial** foundation with serif reading lanes;
Cloudflare's product type is purely neutral/operational with no editorial lane.

**What not to borrow:** the literal orange/blue values; the Inter/system "inherit the platform font"
stance (we make typography a deliberate lane decision); and the two-accent split, which would break
our single-`--brand` re-skin contract.

---

## 15. Distilled Cloudflare rules

If an AI agent wanted to produce Cloudflare-like UI, these are the rules:

1. Use **orange `#F6821F` as brand identity only** — logo, wordmark, brand text accent.
2. Use **blue for product action**: primary buttons, links, focus/info states.
3. Keep everything else an **achromatic oklch neutral** ramp.
4. Layer surfaces with named roles: `canvas` behind, `base`/`elevated` forward, `recessed` for wells.
5. Define borders as **low-alpha hairlines**; let borders, not shadows, carry structure.
6. Keep depth quiet: a `shadow-edge` bevel plus a low-alpha drop for floats only.
7. Theme with **`light-dark()`** and an ancestor `data-mode`; never write `dark:` variants.
8. Treat dark mode as a **luminosity reversal**; use **off-black (~`#1D1D1D`)**, not pure black.
9. Use a **compact type scale** (12/13/14/16px, 14px base); reserve display sizes for marketing.
10. Use **mono** for code, IDs, regions, hashes, and CLI output; bundle Shiki for code blocks.
11. Build on **Base UI primitives** and **Phosphor** icons; compose classes with **`cn()`**.
12. Use **semantic tokens only** (`bg-kumo-base`, `text-kumo-default`, `border-kumo-line`); never raw color.
13. Make tokens **build output** (generate from one config) and **lint-enforce** their use.
14. Treat secrets/keys/IDs as real objects: `sensitive-input`, `clipboard-text`.
15. Keep status and categorical color **semantic** (info/success/warning/danger + a fixed badge palette).
16. Make components **machine-describable** (registry/schemas) so agents can author with them.

---

## 16. Source notes

### 16.1 Documentation and source

- [`cloudflare/kumo`](https://github.com/cloudflare/kumo) — current component library; `main` branch
  source, `packages/kumo/src/styles/theme-kumo.css` (generated tokens),
  `packages/kumo/scripts/theme-generator/config.ts` (token source), `packages/kumo/package.json`
  (deps, exports), and the repo `AGENTS.md` (styling contract).
- [kumo-ui.com](https://kumo-ui.com) — Kumo documentation (component reference; not machine-fetchable
  at capture time).
- [`cloudflare/cf-ui`](https://github.com/cloudflare/cf-ui) and the
  [cf-ui styleguide](https://cloudflare.github.io/cf-ui/) — legacy framework, named palette, icon grid.
- [Open Sourcing CloudFlare's UI Framework](https://blog.cloudflare.com/cf-ui/) — cf-ui rationale.
- [Dark Mode for the Cloudflare Dashboard](https://blog.cloudflare.com/dark-mode/) — ten-hue/
  ten-luminosity scales, luminosity `reverse()`, off-black `#1D1D1D`, four-state component review,
  "design-system-first" governance.
- [CloudFlare becomes Cloudflare](https://blog.cloudflare.com/time-for-an-update/) — 2016 rebrand.
- [RealtimeKit Design System](https://developers.cloudflare.com/realtime/realtimekit/ui-kit/branding/design-system/)
  — a separate, configurable product theming kit (4px spacing base, shade ranges, radius menu).
  Its **defaults** (brand `#2160FD`, Inter) are RealtimeKit defaults, not Cloudflare brand values.

### 16.2 Package artifacts inspected

| Package            | Version | Notes                                                                                                                               |
| ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `@cloudflare/kumo` | `2.6.0` | MIT. Base UI ^1.6.0, Phosphor, clsx, tailwind-merge, motion, shiki, react-day-picker; optional echarts, zod. 50+ component exports. |
| `cloudflare/cf-ui` | legacy  | React + Fela + Lerna; 50+ packages; a11y focus libraries.                                                                           |

### 16.3 Token values inspected

Read from the generated `theme-kumo.css` on `cloudflare/kumo@main`. Key groups:

- `--color-kumo-*` (canvas, base, elevated, recessed, tint, overlay, contrast, control, interact, fill)
- `--text-color-kumo-*` (default, strong, subtle, placeholder, inactive, inverse, brand, link, info, success, danger, warning, badge-\*)
- `--color-neutral-*` / `--color-kumo-neutral-*` (oklch achromatic ramp)
- `--color-kumo-brand`, `--color-kumo-brand-hover` (blue action), `--text-color-kumo-brand` (`#f6821f`)
- `--color-kumo-info/success/warning/danger` + `-tint`, `--color-kumo-banner-*`, `--color-kumo-badge-*`
- `--color-kumo-line`, `--color-kumo-hairline`, `--color-kumo-focus`
- `--color-kumo-shadow-edge`, `--color-kumo-shadow-drop`, `--color-kumo-tip-shadow/stroke`
- `--text-xs/sm/base/lg` + line heights
- FedRAMP overrides (`--color-kumo-canvas/base/hairline` = slate `#5b697c` / `#c8d4e5`)

### 16.4 Caveats and values to re-check

- **Unverified third-party claim:** an online reconstruction lists "FT Kunst Grotesk" and "Apercu
  Mono Pro" plus a `#ff5e1f` brand and a "Compute blue / Storage pink / AI green / SASE teal"
  product-domain palette. None of this could be confirmed against a Cloudflare-controlled source; it
  is excluded from the canonical findings above and noted only for awareness.
- Kumo does not define font-family/radius/spacing tokens in `theme-kumo.css`; those come from the
  host Tailwind config. Exact values may vary by consuming app.
- Brand orange is reported as `#F6821F` (Pantone 1505 C); some brand references cite `#F48120`/
  `#FAAD3F`/`#404041`. Treat `#F6821F` as the canonical Kumo brand-text value.
- Likely to evolve: Kumo version/exports, exact oklch values, the `fedramp` palette, kumo-ui.com docs.
