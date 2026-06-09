# Linear - Design System Teardown

> A full reverse-engineering of **Linear's** visual and product design language, captured from the
> current `linear.app` site, Linear's official brand page, public Linear docs, live computed CSS
> variables from the rendered homepage, and the current public Linear SDK package. This paper mirrors
> the Cursor, Twenty, Shopify, Atlassian, Fluent 2, and Vercel teardowns, but Linear is a particularly
> focused subject: it is not trying to be a broad enterprise component library. It is an opinionated
> operating system for product development, with a visual language tuned for speed, precision,
> planning, issue triage, engineering execution, and now AI agents.
>
> **Method:** brand guidance and product framing are read from Linear's live brand and product pages.
> Exact implementation values are read from `getComputedStyle(document.documentElement)` on
> `https://linear.app/`, which exposed 633 root CSS variables at capture time. Developer ecosystem
> context is read from `@linear/sdk@86.0.0`, Linear's current public client SDK for the GraphQL API.
> Captured June 2026.
>
> **Primary sources:** [Linear](https://linear.app/), [Linear Brand](https://linear.app/brand),
> [Linear Agent docs](https://linear.app/docs/linear-agent), [MCP docs](https://linear.app/docs/mcp),
> [Linear API docs](https://linear.app/docs/graphql), and public npm package artifacts for
> `@linear/sdk@86.0.0`.

---

## 0. TL;DR - the design in one paragraph

Linear's design language is **dark, fast, precise product-development UI**. It is the opposite of a
decorative SaaS dashboard: the chrome recedes, the information becomes sharp, and motion feels like
navigation through an instrument panel. The current marketing and product surface is dark-first:
`--color-bg-primary: #08090a`, `--color-bg-marketing: #010102`, `--color-text-primary: #f7f8f8`,
with layered dark panels (`#0f1011`, `#141516`, `#191a1b`) and very quiet borders
(`rgba(255,255,255,0.05)`, `#23252a`). The brand accent is a restrained Linear indigo:
`--color-brand-bg: #5e6ad2`, with brighter interaction/link accents (`#7170ff`, `#828fff`) used
sparingly. Typography is **Inter Variable** with optical sizing and stylistic features enabled
(`"cv01","ss03"`), plus **Berkeley Mono** for code and technical text. Font weights are unusually
precise (`400`, `510`, `590`, `680`) rather than generic 500/600/700. Radii are crisp
(`4 / 6 / 8 / 12 / 16 / 24 / 32px` plus pill/circle), shadows are mostly dark and subtle, and
motion uses strong custom easings like `cubic-bezier(0.19,1,0.22,1)` and `cubic-bezier(0.23,1,0.32,1)`.
The design DNA is: **dark operational surfaces, Inter Variable, tight density, indigo as a precision
accent, keyboard-first workflows, thin borders, fast motion, and product-development objects as the
core visual language.**

---

## 1. Brand identity & philosophy

| Aspect                     | What Linear does                                                                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Company / product**      | Linear is "the system for product development" - issues, projects, planning, roadmaps, cycles, customer requests, integrations, and AI agent workflow. |
| **Company legal name**     | Linear Orbit, Inc. The current public SDK package lists `Linear Orbit, Inc` as author.                                                                 |
| **Primary user context**   | Product and engineering teams planning, prioritizing, assigning, building, reviewing, and shipping software.                                           |
| **Aesthetic stance**       | Dark, high-contrast, precise, low-friction, keyboard-native, and premium without ornamental luxury.                                                    |
| **Voice**                  | Direct and system-oriented: "The system for product development." "Streamline issues, projects, and product roadmaps."                                 |
| **Interaction philosophy** | Fast command-driven execution, dense lists, lightweight details, keyboard shortcuts, status clarity, and deep integrations.                            |
| **Design DNA in one line** | Dark product OS + restrained indigo + Inter Variable + Berkeley Mono + dense issue/project objects + fast transitions.                                 |

### 1.1 Linear's official brand colors

Linear's brand page names three core brand colors:

| Brand color       | Hex                                                       | Role                                                           |
| ----------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| **Mercury White** | `#F4F5F8`                                                 | Light brand surface, text contrast, neutral premium backdrop.  |
| **Nordic Gray**   | `#222326`                                                 | Dark brand surface, deep neutral, product chrome.              |
| **Subtle Blue**   | not shown as a simple hex in the captured brand page text | Desaturated blue used mostly as an accent and background tint. |

The shipped homepage tokens map closely to this brand logic:

- `#f7f8f8` for primary light text.
- `#08090a` / `#010102` for near-black surfaces.
- `#5e6ad2` and `#7170ff` for indigo accent.

### 1.2 Linear is not "generic dark mode"

Many products use dark mode as a theme. Linear uses dark as identity. The dark surface is not just an
inversion of a light UI. It is the product's native environment:

| Design choice             | Effect                                                                |
| ------------------------- | --------------------------------------------------------------------- |
| Very dark canvas          | Makes issues, statuses, previews, and command surfaces feel surgical. |
| Low-contrast panel ladder | Lets dense information stack without visual clutter.                  |
| Small indigo accent       | Keeps primary actions and selection states precise.                   |
| Thin borders              | Gives structure without heavy cards.                                  |
| High-quality type         | Makes the whole UI feel engineered rather than styled.                |

### 1.3 Product surfaces

| Surface               | Visual mode                                                                                   |
| --------------------- | --------------------------------------------------------------------------------------------- |
| **Marketing site**    | Dark premium storytelling, product screenshots, gradient/glow moments, precise copy.          |
| **Linear app**        | Dense issue/project workspace, list/detail panes, command menu, sidebar, editor, statuses.    |
| **Docs**              | Technical, direct, code/API-heavy; less decorative than marketing.                            |
| **API/SDK ecosystem** | GraphQL API, SDK, webhooks, integrations, MCP server docs.                                    |
| **Linear Agent / AI** | Agents read and write issues, projects, comments, and context inside the same product system. |

The design system must support both brand storytelling and a daily-use workbench. Linear's strongest
visual moments usually come from the product interface itself.

---

## 2. Token architecture

The rendered homepage exposed **633 CSS variables**. These are not all relevant to a design-system
replication, but the variable set is rich enough to reconstruct the system's foundation:

| Token group           | Examples                                                                 | Role                                      |
| --------------------- | ------------------------------------------------------------------------ | ----------------------------------------- |
| Backgrounds           | `--color-bg-primary`, `--color-bg-level-0`, `--color-bg-panel`           | Dark surface ladder.                      |
| Text / foreground     | `--color-text-primary`, `--color-fg-tertiary`                            | Text hierarchy and icon color.            |
| Borders / lines       | `--color-border-primary`, `--color-line-secondary`                       | Panel and list separation.                |
| Brand / accent        | `--color-brand-bg`, `--color-accent`, `--color-link-primary`             | Actions, links, focus, active states.     |
| Product status colors | `--color-linear-plan`, `--color-linear-build`, `--color-linear-security` | Product-area color semantics.             |
| Typography            | `--font-regular`, `--font-monospace`, `--text-regular`                   | Type families, weights, and text recipes. |
| Radius                | `--radius-4` through `--radius-32`, `--radius-rounded`                   | Surface and control shape.                |
| Shadows               | `--shadow-low`, `--shadow-medium`, `--shadow-high`                       | Dark elevation.                           |
| Easing                | `--ease-out-expo`, `--ease-out-quint`, `--ease-in-out-quart`             | Motion feel.                              |
| Editor                | `--editor-font-size`, `--editor-line-height`, `--editor-block-radius`    | Rich-text/code editing surfaces.          |

### 2.1 Captured foundation values

| Token                     | Value                    |
| ------------------------- | ------------------------ |
| `--color-bg-marketing`    | `#010102`                |
| `--color-bg-primary`      | `#08090a`                |
| `--color-bg-secondary`    | `#1c1c1f`                |
| `--color-bg-tertiary`     | `#232326`                |
| `--color-bg-quaternary`   | `#28282c`                |
| `--color-bg-level-0`      | `#08090a`                |
| `--color-bg-level-1`      | `#0f1011`                |
| `--color-bg-level-2`      | `#141516`                |
| `--color-bg-level-3`      | `#191a1b`                |
| `--color-bg-panel`        | `#0f1011`                |
| `--color-bg-translucent`  | `rgba(255,255,255,0.05)` |
| `--color-text-primary`    | `#f7f8f8`                |
| `--color-text-secondary`  | `#d0d6e0`                |
| `--color-text-tertiary`   | `#8a8f98`                |
| `--color-text-quaternary` | `#62666d`                |
| `--color-brand-bg`        | `#5e6ad2`                |
| `--color-accent`          | `#7170ff`                |
| `--color-accent-hover`    | `#828fff`                |
| `--focus-ring-color`      | `#5e69d1`                |
| `--page-padding-inline`   | `24px`                   |

### 2.2 Design-system inference

Linear does not publish a public component package like Atlassian's Atlaskit or Fluent's React
suite. The current evidence suggests the design system is internal, but the CSS variables are
semantically named enough to reveal the internal model:

1. Components consume token roles, not raw hex values.
2. Dark surface levels are named and ordered.
3. Text and foreground roles are duplicated for different consumers.
4. Accent/brand/focus are separated even though they sit in the same indigo family.
5. Editor surfaces get their own tokens.
6. Product-specific status colors exist for plan/build/security.

---

## 3. Color system

### 3.1 Dark surface ladder

Linear's surface system is a near-black ladder:

| Token                   | Value     | Role                               |
| ----------------------- | --------- | ---------------------------------- |
| `--color-bg-marketing`  | `#010102` | Deepest marketing/hero background. |
| `--color-bg-primary`    | `#08090a` | Main page/app background.          |
| `--color-bg-level-0`    | `#08090a` | Base app level.                    |
| `--color-bg-level-1`    | `#0f1011` | Raised panel or app surface.       |
| `--color-bg-level-2`    | `#141516` | Nested/secondary panel.            |
| `--color-bg-level-3`    | `#191a1b` | Higher nested surface.             |
| `--color-bg-secondary`  | `#1c1c1f` | Secondary UI fill.                 |
| `--color-bg-tertiary`   | `#232326` | Tertiary fill / selected surface.  |
| `--color-bg-quaternary` | `#28282c` | Stronger neutral fill.             |
| `--color-bg-panel`      | `#0f1011` | Panel background.                  |
| `--color-bg-tint`       | `#141516` | Tinted dark fill.                  |

The important point: Linear's dark system has many close values. The difference between
`#08090a`, `#0f1011`, and `#141516` is small, but in a dark UI those small steps carry the whole
layout.

### 3.2 Text hierarchy

| Token                     | Value     | Role                        |
| ------------------------- | --------- | --------------------------- |
| `--color-text-primary`    | `#f7f8f8` | Primary text.               |
| `--color-text-secondary`  | `#d0d6e0` | Secondary text.             |
| `--color-text-tertiary`   | `#8a8f98` | Muted metadata.             |
| `--color-text-quaternary` | `#62666d` | Low-emphasis labels.        |
| `--color-fg-primary`      | `#f7f8f8` | Primary foreground/icon.    |
| `--color-fg-secondary`    | `#d0d6e0` | Secondary foreground/icon.  |
| `--color-fg-tertiary`     | `#8a8f98` | Tertiary foreground/icon.   |
| `--color-fg-quaternary`   | `#62666d` | Quaternary foreground/icon. |

The text hierarchy is one of Linear's core design strengths. It allows dense lists to become
scannable without heavy cards.

### 3.3 Borders and lines

| Token                               | Value                    |
| ----------------------------------- | ------------------------ |
| `--color-border-primary`            | `#23252a`                |
| `--color-border-secondary`          | `#34343a`                |
| `--color-border-tertiary`           | `#3e3e44`                |
| `--color-border-translucent`        | `rgba(255,255,255,0.05)` |
| `--color-border-translucent-strong` | `rgba(255,255,255,0.08)` |
| `--color-line-primary`              | `#37393a`                |
| `--color-line-secondary`            | `#202122`                |
| `--color-line-tertiary`             | `#18191a`                |
| `--color-line-quaternary`           | `#141515`                |
| `--color-line-tint`                 | `#141516`                |
| `--border-hairline`                 | `0.5px`                  |

Linear's UI is full of lines, but few of them shout. The hairline token is important: the interface
often reads as etched rather than boxed.

### 3.4 Brand and accent

| Token                   | Value                                       | Role                                |
| ----------------------- | ------------------------------------------- | ----------------------------------- |
| `--color-brand-bg`      | `#5e6ad2`                                   | Brand fill / primary brand surface. |
| `--color-brand-text`    | `#fff`                                      | Text on brand fill.                 |
| `--color-indigo`        | `#5e6ad2`                                   | Raw indigo alias.                   |
| `--color-accent`        | `#7170ff`                                   | Brighter accent.                    |
| `--color-accent-hover`  | `#828fff`                                   | Hover/link emphasis.                |
| `--color-accent-tint`   | `#18182f`                                   | Dark indigo-tinted surface.         |
| `--focus-ring-color`    | `#5e69d1`                                   | Keyboard focus.                     |
| `--focus-ring-outline`  | `1px solid #5e69d1`                         | Focus outline.                      |
| `--color-link-primary`  | `#828fff`                                   | Link color.                         |
| `--color-link-hover`    | `#fff`                                      | Hovered link on dark.               |
| `--color-selection-bg`  | `color-mix(in lch,#5e6ad2,black 10%)`       | Selection background.               |
| `--color-selection-dim` | `color-mix(in lch,#5e6ad2,transparent 80%)` | Dim selection.                      |

Linear's indigo is not decorative. It identifies action, focus, selected state, and product
identity. The UI remains mostly neutral.

### 3.5 Product/status colors

| Token                     | Value     | Likely role                      |
| ------------------------- | --------- | -------------------------------- |
| `--color-red`             | `#eb5757` | Error / destructive.             |
| `--color-orange`          | `#fc7840` | Warning / high-signal status.    |
| `--color-yellow`          | `#f0bf00` | Caution / medium-signal status.  |
| `--color-green`           | `#27a644` | Success / healthy status.        |
| `--color-blue`            | `#4ea7fc` | Informational status.            |
| `--color-teal`            | `#00b8cc` | Secondary informational status.  |
| `--color-linear-plan`     | `#68cc58` | Product-area semantic: plan.     |
| `--color-linear-build`    | `#d4b144` | Product-area semantic: build.    |
| `--color-linear-security` | `#7a7fad` | Product-area semantic: security. |

The product-area colors are particularly revealing. Linear's color system is tied to how teams work,
not just abstract status.

---

## 4. Typography

### 4.1 Font families

The captured homepage body font:

```css
"Inter Variable", "SF Pro Display", -apple-system, "system-ui", "Segoe UI", Roboto, Oxygen, Ubuntu,
Cantarell, "Open Sans", "Helvetica Neue", sans-serif
```

The CSS variables expose:

```css
--font-regular:
  "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont,
  "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans",
  "Helvetica Neue", sans-serif;

--font-monospace: "Berkeley Mono", ui-monospace, "SF Mono", "Menlo", monospace;

--font-serif-display:
  "Tiempos Headline", ui-serif, Georgia, Cambria, "Times New Roman", Times,
  serif;
```

This mix is distinctive:

- Inter Variable for product UI precision.
- Berkeley Mono for code/terminal/editor surfaces.
- Tiempos Headline for occasional editorial/brand display.

### 4.2 OpenType and variable settings

Captured values:

```css
--font-settings: "cv01", "ss03";
--font-variations: "opsz" auto;
```

This matters. Linear is not merely using Inter. It is tuning Inter's character variants and optical
size behavior. That is part of the premium feel.

### 4.3 Font weights

| Token                    | Value |
| ------------------------ | ----- |
| `--font-weight-light`    | `300` |
| `--font-weight-normal`   | `400` |
| `--font-weight-medium`   | `510` |
| `--font-weight-semibold` | `590` |
| `--font-weight-bold`     | `680` |

The nonstandard weights are one of Linear's clearest typographic fingerprints. Instead of a blunt
500/600/700 ramp, Linear uses slightly tuned variable-font weights: 510, 590, 680.

### 4.4 Text recipe tokens

| Token            | Value                                       |
| ---------------- | ------------------------------------------- |
| `--text-tiny`    | `0.625rem /1.5 Inter Variable...`           |
| `--text-micro`   | `0.75rem /1.4 Inter Variable...`            |
| `--text-mini`    | `0.8125rem /1.5 Inter Variable...`          |
| `--text-small`   | `0.875rem /calc(21 / 14) Inter Variable...` |
| `--text-regular` | `0.9375rem /1.6 Inter Variable...`          |
| `--text-large`   | `1.0625rem /1.6 Inter Variable...`          |

Expanded values:

| Size token                | Value       |
| ------------------------- | ----------- |
| `--font-size-micro`       | `0.6875rem` |
| `--font-size-microPlus`   | `0.6875rem` |
| `--font-size-mini`        | `0.75rem`   |
| `--font-size-miniPlus`    | `0.75rem`   |
| `--font-size-small`       | `0.8125rem` |
| `--font-size-smallPlus`   | `0.8125rem` |
| `--font-size-regular`     | `0.9375rem` |
| `--font-size-regularPlus` | `0.9375rem` |
| `--font-size-large`       | `1.125rem`  |
| `--font-size-largePlus`   | `1.125rem`  |
| `--font-size-title3`      | `1.25rem`   |
| `--font-size-title2`      | `1.5rem`    |
| `--font-size-title1`      | `2.25rem`   |

### 4.5 Letter spacing and line height

| Token                           | Value           |
| ------------------------------- | --------------- |
| `--text-tiny-letter-spacing`    | `-0.015em`      |
| `--text-mini-letter-spacing`    | `-0.01em`       |
| `--text-small-letter-spacing`   | `-0.013em`      |
| `--text-regular-letter-spacing` | `-0.011em`      |
| `--text-micro-letter-spacing`   | `0`             |
| `--text-regular-line-height`    | `1.6`           |
| `--text-small-line-height`      | `calc(21 / 14)` |
| `--text-mini-line-height`       | `1.5`           |
| `--text-micro-line-height`      | `1.4`           |

Linear's type is compact and tight, but not cramped. Negative tracking on small UI text creates a
dense, engineered feel.

### 4.6 Title line-height scale

| Token                   | Value   |
| ----------------------- | ------- |
| `--title-1-line-height` | `1.4`   |
| `--title-2-line-height` | `1.33`  |
| `--title-3-line-height` | `1.33`  |
| `--title-4-line-height` | `1.125` |
| `--title-5-line-height` | `1.1`   |
| `--title-6-line-height` | `1`     |
| `--title-7-line-height` | `1.1`   |
| `--title-8-line-height` | `1.06`  |
| `--title-9-line-height` | `1`     |

The title scale lets Linear move from readable product headings to very tight marketing display
without switching systems.

---

## 5. Spacing and layout

Linear's captured CSS does not expose a simple complete spacing scale like Vercel's `--geist-space`
tokens, but it does reveal key layout defaults:

| Token                   | Value  |
| ----------------------- | ------ |
| `--page-padding-inline` | `24px` |
| `--line-number-width`   | `50px` |

The visual system strongly suggests a small-grid approach:

- 4px/6px/8px for inner gaps and control alignment.
- 12px/16px for compact panel padding.
- 24px for page horizontal padding.
- 32px+ for marketing rhythm.

### 5.1 Layout character

Linear layouts are:

- Dense and pane-based.
- Designed for persistent sidebars and split views.
- List/detail oriented.
- Keyboard and command-menu friendly.
- Status and metadata heavy.
- Conservative with whitespace inside product UI.
- More atmospheric and cinematic on marketing pages.

### 5.2 Product object layout

Linear's visual grammar is built around product-development objects:

| Object           | Typical UI treatment                                                  |
| ---------------- | --------------------------------------------------------------------- |
| Issue            | Row with identifier, title, status, assignee, priority, labels, date. |
| Project          | Card/row with status, milestone, progress, owner, roadmap context.    |
| Cycle            | Time-boxed container with progress and scoped issue list.             |
| Roadmap item     | Larger planning card with status, team, target, and description.      |
| Customer request | Triage item with company/user context and linked issue/project.       |
| Comment/update   | Rich text/editor surface with activity metadata.                      |
| Agent action     | AI-generated update or task tied to issue/project context.            |

The interface feels precise because every object has predictable metadata lanes.

---

## 6. Shape, borders, and radius

### 6.1 Radius tokens

| Token                   | Value    |
| ----------------------- | -------- |
| `--radius-4`            | `4px`    |
| `--radius-6`            | `6px`    |
| `--radius-8`            | `8px`    |
| `--radius-12`           | `12px`   |
| `--radius-16`           | `16px`   |
| `--radius-24`           | `24px`   |
| `--radius-32`           | `32px`   |
| `--radius-rounded`      | `9999px` |
| `--radius-circle`       | `50%`    |
| `--editor-block-radius` | `6px`    |

Linear's everyday radius appears to be 6-8px for product surfaces and controls, with larger radii
reserved for marketing cards, overlays, or special display surfaces. The editor block radius of 6px
is a useful clue: editing surfaces stay crisp.

### 6.2 Borders

The captured `--border-hairline: 0.5px` is significant. Linear has a crisp retina-display feel:

- Pane separators are thin.
- Borders are dark-gray, not bright.
- Translucent borders are common.
- Selected or active states rely on fill + accent, not heavy outlines.

### 6.3 Shape personality

Linear's shape language is:

- Rectangular, not pill-first.
- Small radius on product controls.
- Larger, soft cards for marketing/product screenshot framing.
- Pills for status, labels, and compact badges.
- Circles for avatars and small icons.

It is less round than Vercel marketing CTAs and less soft than modern consumer SaaS dashboards.

---

## 7. Elevation and shadows

### 7.1 Shadow tokens

| Token                | Value                                                                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--shadow-none`      | `0px 0px 0px transparent`                                                                                                                                           |
| `--shadow-tiny`      | `0px 0px 0px transparent`                                                                                                                                           |
| `--shadow-low`       | `0px 2px 4px rgba(0,0,0,0.1)`                                                                                                                                       |
| `--shadow-medium`    | `0px 4px 24px rgba(0,0,0,0.2)`                                                                                                                                      |
| `--shadow-high`      | `0px 7px 32px rgba(0,0,0,0.35)`                                                                                                                                     |
| `--shadow-stack-low` | `0px 8px 2px 0px rgba(0,0,0,0),0px 5px 2px 0px rgba(0,0,0,0.01),0px 3px 2px 0px rgba(0,0,0,0.04),0px 1px 1px 0px rgba(0,0,0,0.07),0px 0px 1px 0px rgba(0,0,0,0.08)` |

Dark UI shadows are harder to see, so Linear relies on a mix of:

- Surface color steps.
- Borders/lines.
- Shadow for overlays and cards.
- Backdrop overlays.
- Focus/accent rings for interaction.

### 7.2 Overlay and layering

Captured values:

| Token                     | Value              |
| ------------------------- | ------------------ |
| `--color-overlay-primary` | `rgba(0,0,0,0.85)` |
| `--layer-context-menu`    | `1200`             |

The explicit context-menu layer token fits Linear's command-driven UI. Menus, command palettes, and
popovers are central, not incidental.

---

## 8. Motion

### 8.1 Easing tokens

Linear exposes a broad easing palette:

| Token                 | Value                                  |
| --------------------- | -------------------------------------- |
| `--ease-out-expo`     | `cubic-bezier(0.19,1,0.22,1)`          |
| `--ease-out-quint`    | `cubic-bezier(0.23,1,0.32,1)`          |
| `--ease-out-quart`    | `cubic-bezier(0.165,0.84,0.44,1)`      |
| `--ease-out-circ`     | `cubic-bezier(0.075,0.82,0.165,1)`     |
| `--ease-in-out-quart` | `cubic-bezier(0.77,0,0.175,1)`         |
| `--ease-in-out-expo`  | `cubic-bezier(1,0,0,1)`                |
| `--ease-in-out-cubic` | `cubic-bezier(0.645,0.045,0.355,1)`    |
| `--ease-in-out-quad`  | `cubic-bezier(0.455,0.03,0.515,0.955)` |

The feel is strong and fast. Linear's motion is more assertive than Atlassian's or Fluent's, and
less playful than consumer app animation. It is tuned for "snap into place."

### 8.2 Motion principles

Linear-like motion should:

1. Make navigation feel instant.
2. Animate panes, menus, command surfaces, and cards with strong out-easing.
3. Avoid decorative loops in product UI.
4. Use longer atmospheric motion only on marketing pages.
5. Preserve reduced-motion behavior.
6. Keep list interactions stable; do not cause dense rows to jump.

---

## 9. Components and product patterns

Linear does not publish a current official component package, but the product surface implies a
clear set of primitives and composites.

### 9.1 Core product primitives

| Primitive        | Role                                                          |
| ---------------- | ------------------------------------------------------------- |
| Button           | Primary/secondary/destructive actions, compact in product UI. |
| Icon button      | Toolbar, row actions, command surfaces.                       |
| Status pill      | Issue/project/cycle state.                                    |
| Priority icon    | Issue priority in list/detail views.                          |
| Avatar           | Assignee, commenter, team member.                             |
| Label/tag        | Team, issue label, product area, customer tag.                |
| Text field       | Search, create issue, quick edit.                             |
| Rich text editor | Descriptions, comments, updates, agent context.               |
| Menu / popover   | Dense contextual command surfaces.                            |
| Toast            | Action completion and background sync.                        |
| Modal/sheet      | Creation, settings, destructive confirmation.                 |
| Sidebar item     | Workspace navigation.                                         |
| Table/list row   | Core issue/project scanning surface.                          |

### 9.2 Core composites

| Composite           | What it contains                                                        |
| ------------------- | ----------------------------------------------------------------------- |
| Issue row           | Identifier, title, priority, status, assignee, labels, due/cycle.       |
| Issue detail pane   | Header, properties, rich text description, comments, activity.          |
| Project card        | Name, lead, status, progress, target date, connected issues.            |
| Roadmap lane        | Grouped projects across product areas or time horizons.                 |
| Cycle overview      | Progress, scoped issues, team filter, health indicators.                |
| Command menu        | Search, create, navigate, assign, change status, trigger integrations.  |
| Integration card    | Provider icon, connection status, action buttons, permission details.   |
| Agent activity item | Agent identity, action summary, linked issue/project, confidence/state. |

### 9.3 Product-specific affordances

Linear-specific UI needs:

- Fast issue creation.
- Keyboard shortcuts.
- Inline status changes.
- Drag/reorder where relevant.
- Split view navigation.
- Rich editor with code/mentions/links.
- Labels and filters that do not dominate the row.
- Activity streams that keep historical context readable.
- Agent actions that remain attached to the underlying product object.

---

## 10. Accessibility and interaction

Linear's aesthetic is dense, so accessibility depends on structure:

| Concern                 | Required treatment                                                            |
| ----------------------- | ----------------------------------------------------------------------------- |
| Keyboard navigation     | Command menu, lists, menus, detail panes, and editors must be keyboard-first. |
| Focus visibility        | Use `--focus-ring-color: #5e69d1` and `--focus-ring-outline`.                 |
| Color contrast          | Use text hierarchy tokens; do not invent low-contrast gray text.              |
| Status semantics        | Pair color with text/icon.                                                    |
| Dense row click targets | Keep row actions reachable without relying only on hover.                     |
| Motion                  | Respect reduced-motion and avoid disruptive row motion.                       |
| Rich editor             | Preserve heading/list/link/code semantics.                                    |
| AI/agent actions        | Keep generated actions reviewable and attributable.                           |

### 10.1 Keyboard-first design

Linear's product reputation is tied to speed. A Linear-like product UI should support:

- Command-K style global command menu.
- Quick issue creation.
- Keyboard status changes.
- Keyboard navigation through rows.
- Escape to close menus/modals.
- Enter/Space to activate row actions.
- Slash commands or structured shortcuts inside editors.

The visual design and keyboard model are inseparable. A Linear-looking UI that is mouse-only is not
actually Linear-like.

---

## 11. API, SDK, and developer layer

Linear's current public SDK package:

```json
{
  "name": "@linear/sdk",
  "version": "86.0.0",
  "description": "The Linear Client SDK for interacting with the Linear GraphQL API",
  "author": "Linear Orbit, Inc",
  "license": "MIT",
  "type": "module",
  "engines": {
    "node": ">=18.x"
  },
  "dependencies": {
    "@graphql-typed-document-node/core": "^3.2.0"
  }
}
```

This matters for design because Linear's ecosystem is API-native:

- GraphQL API.
- Webhooks.
- SDK.
- Integrations.
- MCP support.
- Agent access to workspace context.

The product UI is designed around connected work, not isolated screens.

### 11.1 Developer-facing design implications

Developer-facing Linear surfaces should expose:

- Object IDs and slugs in mono.
- Webhook/event status.
- API errors and retry states.
- OAuth/permission descriptions.
- Integration connection state.
- Logs/activity where appropriate.
- Copy buttons for IDs, URLs, webhook secrets, and code.

Berkeley Mono is the right type choice for these details.

---

## 12. AI agent layer

Linear's current product language includes AI agents and MCP. Linear Agent docs describe an agent
that can assist with project management and product development workflows in Linear.

### 12.1 AI surface requirements

Linear-like AI surfaces should show:

- Agent identity.
- Trigger/source.
- Linked issue/project/team.
- Proposed action.
- Applied action.
- Review state.
- Comments or summaries generated by the agent.
- Errors and permission limits.
- User override controls.

### 12.2 MCP surface

Linear's MCP docs position Linear as accessible through model-context tooling. That implies a design
need for:

- Clear app authorization.
- Scope visibility.
- Connected client status.
- Action history.
- Safe handling of writes.
- Issue/project references in generated output.

### 12.3 AI design rules

1. Keep AI inside the existing issue/project model.
2. Show exactly what object the agent is acting on.
3. Use existing status, comment, update, and activity components.
4. Keep generated work reviewable before destructive changes.
5. Use indigo accent for agent focus/selection sparingly.
6. Use Berkeley Mono for IDs, tool calls, and code-like output.
7. Do not introduce a separate AI gradient language that breaks the product OS.

---

## 13. How to replicate Linear in a new product

### 13.1 Start with the dark surface ladder

```css
:root {
  --color-bg-primary: #08090a;
  --color-bg-level-1: #0f1011;
  --color-bg-level-2: #141516;
  --color-bg-level-3: #191a1b;
  --color-bg-secondary: #1c1c1f;
  --color-text-primary: #f7f8f8;
  --color-text-secondary: #d0d6e0;
  --color-text-tertiary: #8a8f98;
  --color-text-quaternary: #62666d;
  --color-border-translucent: rgba(255, 255, 255, 0.05);
  --color-brand-bg: #5e6ad2;
  --color-accent: #7170ff;
  --color-accent-hover: #828fff;
  --focus-ring-color: #5e69d1;
}
```

### 13.2 Use Linear-like type

```css
:root {
  --font-regular:
    "Inter Variable", "SF Pro Display", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
    "Helvetica Neue", sans-serif;
  --font-monospace:
    "Berkeley Mono", ui-monospace, "SF Mono", "Menlo", monospace;
  --font-weight-normal: 400;
  --font-weight-medium: 510;
  --font-weight-semibold: 590;
  --font-weight-bold: 680;
  font-feature-settings: "cv01", "ss03";
  font-variation-settings: "opsz" auto;
}
```

Use:

- `0.8125rem` or `0.875rem` for dense metadata.
- `0.9375rem / 1.6` for main body/editor text.
- Mono for code, IDs, commands, slugs, and API details.

### 13.3 Issue row recipe

```tsx
const issueRow = {
  alignItems: "center",
  background: "transparent",
  borderBottom: "0.5px solid var(--color-border-translucent)",
  color: "var(--color-text-secondary)",
  display: "grid",
  fontFamily: "var(--font-regular)",
  fontSize: "0.875rem",
  gap: "8px",
  gridTemplateColumns: "auto 1fr auto auto auto",
  minHeight: "36px",
  paddingInline: "12px",
}
```

### 13.4 Panel recipe

```tsx
const panel = {
  background: "var(--color-bg-level-1)",
  border: "1px solid var(--color-border-translucent)",
  borderRadius: "var(--radius-8)",
  boxShadow: "var(--shadow-low)",
  color: "var(--color-text-primary)",
}
```

### 13.5 Command menu recipe

```tsx
const commandMenu = {
  background: "var(--color-bg-level-2)",
  border: "1px solid var(--color-border-translucent-strong)",
  borderRadius: "var(--radius-12)",
  boxShadow: "var(--shadow-high)",
  color: "var(--color-text-primary)",
  zIndex: "var(--layer-context-menu)",
}
```

### 13.6 Button recipe

```tsx
const primaryButton = {
  background: "var(--color-brand-bg)",
  border: "1px solid color-mix(in srgb, var(--color-brand-bg), white 12%)",
  borderRadius: "var(--radius-6)",
  color: "var(--color-brand-text)",
  fontFamily: "var(--font-regular)",
  fontSize: "0.8125rem",
  fontWeight: "var(--font-weight-medium)",
  minHeight: "32px",
  paddingInline: "12px",
}
```

### 13.7 Motion recipe

```css
.linear-popover {
  transition:
    opacity 180ms var(--ease-out-quint),
    transform 180ms var(--ease-out-quint);
}
```

Keep motion quick and directional. Do not add decorative easing to list rows.

---

## 14. Comparison with the other teardowns

| System     | Core visual idea                                                 | Accent logic                                 | Type personality                               | Layout density                      |
| ---------- | ---------------------------------------------------------------- | -------------------------------------------- | ---------------------------------------------- | ----------------------------------- |
| Cursor     | Warm editorial paper + one orange accent                         | Fixed orange brand accent                    | Custom grotesque + mono + serif                | Spacious marketing, dark editor     |
| Twenty     | Notion-like neutral CRM + Radix color labels                     | Indigo accent + many Radix data colors       | Inter, compact SaaS                            | Dense CRM app                       |
| Shopify    | Merchant operations UI through Polaris                           | Shopify green + commerce status colors       | Practical admin typography                     | Dense admin/product surfaces        |
| Atlassian  | Teamwork UI with mature intent tokens                            | Atlassian Blue + semantic role colors        | Atlassian Sans/Mono                            | Dense enterprise collaboration      |
| Fluent 2   | Microsoft productivity UI with swappable brand slots             | Web blue / Teams purple through theme slots  | Segoe UI/system                                | Very dense work UI                  |
| Vercel     | Developer-tool minimalism: Geist, monochrome, code, grid, border | Blue only for focus/link utility             | Geist Sans/Mono/Pixel                          | Dense dashboard, spacious marketing |
| **Linear** | Dark product-development OS: issues, projects, cycles, agents    | Restrained indigo for action/focus/selection | Inter Variable + Berkeley Mono + tuned weights | Very dense product workbench        |

Linear and Vercel are both developer-tool systems, but they are not the same. Vercel is black/white,
web-infrastructure minimalism with code and grid. Linear is darker, more operational, more pane/list
driven, and more product-management specific. Linear's visual identity is less about a public design
system and more about the feeling of moving quickly through a deeply integrated product OS.

---

## 15. Distilled Linear rules

If an AI agent wanted to produce Linear-like UI, these are the rules:

1. Start dark: `#08090a` base, `#0f1011` panels, `#141516` nested surfaces.
2. Use `#f7f8f8`, `#d0d6e0`, `#8a8f98`, and `#62666d` for text hierarchy.
3. Use indigo sparingly: `#5e6ad2` brand, `#7170ff` accent, `#828fff` links/hover.
4. Use Inter Variable with optical sizing and `cv01` / `ss03` features.
5. Use tuned weights: 400, 510, 590, 680.
6. Use Berkeley Mono for code, IDs, commands, API details, and technical metadata.
7. Keep borders thin; use `0.5px` and translucent white on dark surfaces.
8. Use radii 4/6/8/12px for most product surfaces; reserve larger radii for overlays/marketing.
9. Keep rows dense and metadata-rich.
10. Design around issues, projects, cycles, roadmaps, comments, and activity.
11. Make keyboard navigation a first-class requirement.
12. Use strong out-easing for menus and pane transitions.
13. Treat AI agents as product actors inside issue/project workflows, not separate chat ornaments.
14. Show status through text + icon + color, never color alone.
15. Preserve the product OS feel: fast, precise, quiet, and connected.

---

## 16. Source notes

### 16.1 Documentation and live pages

- [Linear](https://linear.app/) - current marketing/product surface; live CSS token capture.
- [Linear Brand](https://linear.app/brand) - official brand colors and assets.
- [Linear Agent docs](https://linear.app/docs/linear-agent) - current AI-agent workflow context.
- [MCP docs](https://linear.app/docs/mcp) - model-context protocol integration context.
- [Linear GraphQL API docs](https://linear.app/docs/graphql) - developer/API context.

### 16.2 Package artifacts inspected

| Package       | Version  | Notes                                                               |
| ------------- | -------- | ------------------------------------------------------------------- |
| `@linear/sdk` | `86.0.0` | Public client SDK for interacting with the Linear GraphQL API.      |
| `linear`      | `1.0.5`  | Old/small package exists, not treated as canonical design evidence. |

### 16.3 Live CSS values inspected

Captured from `getComputedStyle(document.documentElement)` on `https://linear.app/`.
Key groups:

- `--color-bg-*`
- `--color-text-*`
- `--color-fg-*`
- `--color-border-*`
- `--color-line-*`
- `--color-brand-*`
- `--color-accent*`
- `--color-linear-*`
- `--font-*`
- `--text-*`
- `--title-*`
- `--radius-*`
- `--shadow-*`
- `--ease-*`
- `--editor-*`
- `--layer-*`

### 16.4 Values to re-check if updating later

These are likely to change:

- Homepage token values.
- Linear Agent and MCP product behavior.
- Public SDK version.
- Brand page color presentation.
- Any future public Linear design-system/component package.
