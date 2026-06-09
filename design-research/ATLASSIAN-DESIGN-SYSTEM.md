# Atlassian Design System — Design System Teardown

> A full reverse-engineering of the **Atlassian Design System (ADS)**, captured from the current
> `atlassian.design` documentation and public Atlaskit packages. This paper mirrors the Cursor,
> Twenty, and Shopify teardowns, but Atlassian is a particularly mature design-system subject: ADS is
> not only a React component library, and not only a token set. It is an end-to-end product language
> for Jira, Confluence, Trello-adjacent collaboration workflows, Marketplace apps, and Atlassian's
> emerging AI/Rovo surfaces.
>
> **Method:** foundations and usage guidance below are read from the live Atlassian Design System
> docs at `atlassian.design/design-system`, `foundations/color`, `foundations/spacing`,
> `foundations/typography`, `foundations/motion`, `foundations/elevation`, and
> `foundations/tokens/use-tokens-in-code`. Exact values are read from current npm package artifacts:
> `@atlaskit/tokens@13.2.0`, `@atlaskit/primitives@19.0.2`, `@atlaskit/button@23.11.8`, and
> `@atlaskit/icon@35.4.0`. Captured June 2026.
>
> **Primary sources:** [Atlassian Design System](https://atlassian.design/design-system),
> [Color](https://atlassian.design/foundations/color),
> [Spacing](https://atlassian.design/foundations/spacing),
> [Typography](https://atlassian.design/foundations/typography),
> [Motion](https://atlassian.design/foundations/motion),
> [Elevation](https://atlassian.design/foundations/elevation),
> [Use tokens in code](https://atlassian.design/foundations/tokens/use-tokens-in-code/),
> [Button](https://atlassian.design/components/button),
> [Primitives](https://atlassian.design/components/primitives/overview), public npm packages under
> the `@atlaskit/*` scope.

---

## 0. TL;DR — the design in one paragraph

Atlassian's design system is **structured teamwork UI**: calm, dense, tokenized, and optimized for
complex collaborative products rather than expressive brand pages. Its visual identity is anchored
by **Atlassian Blue** (`#1868DB`) but the system is not blue everywhere. The UI runs on neutral
surfaces (`#FFFFFF`, `#F8F8F8`, `#292A2E`) plus a semantic color grammar for status, action, and
accent: `brand`, `information`, `success`, `warning`, `danger`, `discovery`, `accent`, `inverse`,
and `input`. Its new typography system uses **Atlassian Sans** and **Atlassian Mono**, with heading
tokens at a distinctive **653** weight, body at 400, and code at `0.875em/1`. Spacing is an **8px
base system** where `space.100 = 8px`, but the scale includes small intermediate tokens (`2 / 4 /
6px`) and negative values for controlled layout bleed. Depth is not decorative; ADS defines
**sunken, default, raised, overlay, and overflow** elevations, with dark mode relying more on surface
color than shadow. Components are implemented through Atlaskit packages, powered by tokens and
Compiled CSS, with `@atlaskit/primitives` providing low-level token-backed layout (`Box`, `Inline`,
`Stack`, `Flex`, `Grid`, `Bleed`, `Text`, `Pressable`, `Anchor`). The design DNA is simple:
**choose intent first, then token; compose from primitives; preserve accessibility; and make complex
teamwork software feel coherent across products.**

---

## 1. Brand identity & philosophy

| Aspect                     | What Atlassian does                                                                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company / products**     | Atlassian builds collaboration software: Jira, Confluence, Trello, Bitbucket, Loom, Compass, Jira Service Management, and AI/Rovo experiences.                                   |
| **Design-system role**     | ADS is the shared product language for shipping Atlassian interfaces with "quality foundations, flexible components, and powerful tools."                                        |
| **Primary user context**   | Teams planning, tracking, writing, reviewing, supporting, and shipping work. The system must support dense project management, knowledge work, and app extensibility.            |
| **Voice**                  | Practical, governance-heavy, and craft-specific. Docs route designers, developers, and content designers into separate getting-started paths.                                    |
| **Aesthetic stance**       | Modern enterprise UI: neutral surfaces, highly legible text, blue brand actions, semantic status colors, subtle elevation, and lots of composable structure.                     |
| **Core technical stance**  | Tokens are the source of truth. Components consume CSS variables through `@atlaskit/tokens`; lint rules, Babel plugin, codemods, and package metadata enforce correct migration. |
| **Design DNA in one line** | Atlassian Blue + neutral productivity surfaces + intent-based tokens + composable primitives + dense collaboration patterns.                                                     |

### 1.1 A system for many products, not one app

Cursor can be read as one product with a brand surface and an editor surface. Twenty can be read as
one open-source CRM. Atlassian is different: ADS has to work across a **portfolio**. Jira boards,
Confluence pages, admin screens, service queues, docs, AI suggestions, Marketplace apps, and
cross-product navigation all need to feel related without collapsing into a single layout.

That explains the system's emphasis on:

- **Foundations**: tokens, accessibility, content, spacing, grid, color, typography, motion,
  iconography, illustrations, logos, elevation, border, radius.
- **Components**: buttons, forms, images, labels, layout, loading, messaging, navigation, overlays,
  primitives, status indicators, text/data display.
- **Patterns**: combinations of foundations and components that solve product-level workflows.
- **Tools**: linting, Babel transforms, codemods, Figma libraries, and developer utilities.

ADS is as much a **governance system** as it is a visual language.

### 1.2 Current-state signals from the docs

The current design-system homepage surfaces several important signals:

- The system headline is "Explore our design system" and the product promise is to ship Atlassian
  interfaces using **foundations, components, and tools**.
- The site calls out **Rovo and AI design patterns** as a featured area.
- The "What's new" area notes that the **typography system reached General Availability**.
- The docs mention an **Atlassian UI refresh** and a refreshed typography system.
- Motion is explicitly in **Early Access**, with limited token coverage and a feature flag:
  `platform-dst-motion-uplift`.

So the system in 2026 is not static. Typography has just become broadly available, motion is still
rolling out, and AI/Rovo patterns are becoming first-class.

### 1.3 Design DNA — the rules ADS obeys

1. **Use tokens by intent.** Instead of choosing a raw green, choose `color.icon.success` or
   `color.text.success` because the UI is communicating a favorable outcome.
2. **Color roles are semantic.** `danger` is for serious errors; `warning` is for caution before
   mistakes; `discovery` is for new/onboarding information; `accent` is non-semantic and swappable.
3. **Accent is not status.** The color docs explicitly warn not to use accent color when the color
   has semantic meaning.
4. **Surface and shadow must match.** Raised surfaces pair with raised shadows; overlay surfaces pair
   with overlay shadows.
5. **Spacing encodes relationship.** Proximity, similarity, hierarchy, rhythm, and optical
   adjustment are all part of the spacing guidance.
6. **Typography is structural and accessible.** Headings are not just visual weight; they are
   section structure and screen-reader navigation.
7. **Use primitives for composition.** Low-level primitives are token-backed escape valves for
   complex layouts that are not a one-to-one component.
8. **Migration is enforced.** Babel plugins, ESLint rules, Stylelint rules, and codemods are part of
   the design system, not optional tooling.

---

## 2. Token architecture

### 2.1 Package model

The core packages inspected:

| Package                | Version inspected | Role                                                                 |
| ---------------------- | ----------------- | -------------------------------------------------------------------- |
| `@atlaskit/tokens`     | `13.2.0`          | Design-token runtime, raw artifacts, themes, Babel plugin, SSR utils |
| `@atlaskit/primitives` | `19.0.2`          | Token-backed low-level layout and composition components             |
| `@atlaskit/button`     | `23.11.8`         | Button, loading button, icon button, split button, button group      |
| `@atlaskit/icon`       | `35.4.0`          | Atlassian icon component and icon package                            |

All inspected packages list `Atlassian Pty Ltd` as author, use `Apache-2.0`, and point to the public
Atlassian frontend mirror at `bitbucket.org/atlassian/atlassian-frontend-mirror`.

### 2.2 Theme files

`@atlaskit/tokens` exposes raw theme artifacts:

| Artifact                                                         | Purpose                             |
| ---------------------------------------------------------------- | ----------------------------------- |
| `atlassian-light`                                                | Current light color/elevation theme |
| `atlassian-dark`                                                 | Current dark color/elevation theme  |
| `atlassian-light-increased-contrast`                             | Light high-contrast variant         |
| `atlassian-dark-increased-contrast`                              | Dark high-contrast variant          |
| `atlassian-light-brand-refresh` / `atlassian-dark-brand-refresh` | Brand-refresh variants              |
| `atlassian-light-future` / `atlassian-dark-future`               | Future variants                     |
| `atlassian-legacy-light` / `atlassian-legacy-dark`               | Legacy variants                     |
| `atlassian-spacing`                                              | Space tokens                        |
| `atlassian-typography`                                           | Font tokens                         |
| `atlassian-shape`                                                | Radius and border tokens            |
| `atlassian-motion`                                               | Motion tokens                       |

This is a mature migration architecture: current, legacy, future, increased-contrast, and
brand-refresh can all coexist.

### 2.3 How tokens are used in code

The docs recommend the `token()` function rather than manually writing CSS variables:

```ts
import { token } from "@atlaskit/tokens"

token("color.background.neutral") // var(--ds-background-neutral)
token("space.200") // var(--ds-space-200)
token("font.body") // var(--ds-font-body)
```

The runtime theme is mounted on the document using attributes like:

```html
<html
  data-theme="light:light dark:dark spacing:spacing typography:typography"
  data-color-mode="light"
></html>
```

The `@atlaskit/tokens/babel-plugin` rewrites `token()` calls at build time and auto-inserts default
fallbacks from the light theme when needed. Example from the docs:

```ts
token('space.200')
// Babel output:
var(--ds-space-200, 1rem)
```

The important design-system lesson: ADS treats **correct token usage as code quality**. ESLint,
Stylelint, codemods, and Babel transforms all participate in keeping design decisions consistent.

### 2.4 Internal generated names vs public names

The generated raw token artifacts often include `.[default]` in names, for example:

```txt
color.background.brand.bold.[default]
color.text.danger.[default]
font.body.[default]
border.width.[default]
```

Public usage generally omits the default marker:

```ts
token("color.background.brand.bold")
token("color.text.danger")
token("font.body")
token("border.width")
```

That split matters when reading package artifacts: the public API is cleaner than the generated
internal representation.

---

## 3. Color system

### 3.1 Color anatomy

ADS color docs divide color into three categories:

| Category             | Meaning                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **Saturated colors** | Carry meaning, highlight UI, or associate related UI.                                        |
| **Neutral colors**   | Used for most backgrounds, text, and shapes; usually non-semantic except disabled/structure. |
| **Alpha colors**     | Transparent colors that adapt to backgrounds and elevations.                                 |

For most Atlassian app experiences, colors are applied with design tokens. Token names start with
`color`, then the property (`background`, `border`, `icon`, `text`, etc.), followed by role,
emphasis, and state modifiers.

Example grammar:

```txt
color.background.danger.bold.hovered
```

This means:

- property: `background`
- role: `danger`
- emphasis: `bold`
- state: `hovered`

### 3.2 Roles

| Role          | Meaning                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------- |
| `neutral`     | Default text and secondary UI, such as secondary buttons or navigation elements.         |
| `brand`       | Primary actions or elements that communicate the Atlassian brand.                        |
| `information` | Informative UI or in-progress communication.                                             |
| `success`     | Favorable outcome, such as a success message.                                            |
| `warning`     | Caution to prevent a mistake or error.                                                   |
| `danger`      | Danger or serious error states.                                                          |
| `discovery`   | Something new, onboarding, or new feature information.                                   |
| `accent`      | Colors with no specific semantic meaning; one accent should be exchangeable for another. |
| `inverse`     | UI elements that sit on bold emphasis backgrounds.                                       |
| `input`       | Form fields.                                                                             |

The crucial ADS rule is that `accent` is **non-semantic**. If the color means "success," "danger,"
or "warning," it is not an accent.

### 3.3 Emphasis and interaction states

Emphasis levels range from subtle to bold. Bolder colors have more contrast against the default
surface and should attract more attention.

Interaction states include:

- `hovered`
- `pressed`
- `selected`
- `focused`
- `disabled`

ADS notes that icons do not have dedicated hovered/pressed icon tokens; instead, the recommended
state treatment is a subtle neutral background around the icon.

### 3.4 Palette values

The raw palette uses named ramps. Representative values:

| Ramp            | Values                                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Blue**        | `Blue100 #E9F2FE`, `Blue300 #8FB8F6`, `Blue500 #4688EC`, `Blue700 #1868DB`, `Blue800 #1558BC`, `Blue900 #123263`, `Blue1000 #1C2B42`                                            |
| **Neutral**     | `Neutral0 #FFFFFF`, `Neutral100 #F8F8F8`, `Neutral300 #DDDEE1`, `Neutral700 #6B6E76`, `Neutral800 #505258`, `Neutral1000 #292A2E`, `Neutral1100 #1E1F21`, `Neutral1200 #000000` |
| **DarkNeutral** | `DarkNeutral-100 #111213`, `DarkNeutral0 #18191A`, `DarkNeutral300 #303134`, `DarkNeutral700 #96999E`, `DarkNeutral1000 #CECFD2`, `DarkNeutral1100 #E2E3E4`                     |
| **Red**         | `Red100 #FFECEB`, `Red300 #FD9891`, `Red700 #C9372C`, `Red800 #AE2E24`, `Red900 #5D1F1A`                                                                                        |
| **Orange**      | `Orange100 #FFF5DB`, `Orange300 #FBC828`, `Orange400 #FCA700`, `Orange800 #9E4C00`, `Orange900 #693200`                                                                         |
| **Green**       | `Green100 #DCFFF1`, `Green400 #4BCE97`, `Green700 #1F845A`, `Green800 #216E4E`, `Green900 #164B35`                                                                              |
| **Purple**      | `Purple100 #F8EEFE`, `Purple300 #D8A0F7`, `Purple700 #964AC0`, `Purple800 #803FA5`, `Purple900 #48245D`                                                                         |
| **Teal**        | `Teal100 #E7F9FF`, `Teal400 #6CC3E0`, `Teal700 #227D9B`, `Teal800 #206A83`, `Teal900 #164555`                                                                                   |
| **Magenta**     | `Magenta100 #FFECF8`, `Magenta400 #E774BB`, `Magenta700 #AE4787`, `Magenta800 #943D73`, `Magenta900 #50253F`                                                                    |
| **Lime**        | `Lime100 #EFFFD6`, `Lime300 #B3DF72`, `Lime700 #5B7F24`, `Lime800 #4C6B1F`, `Lime900 #37471F`                                                                                   |

### 3.5 Core light semantic values

Representative light-theme token values:

| Public token             | Generated artifact token           | Value     |
| ------------------------ | ---------------------------------- | --------- |
| `color.text`             | `color.text.[default]`             | `#292A2E` |
| `color.text.subtle`      | same                               | `#505258` |
| `color.text.subtlest`    | same                               | `#6B6E76` |
| `color.text.brand`       | same                               | `#1868DB` |
| `color.text.danger`      | `color.text.danger.[default]`      | `#AE2E24` |
| `color.text.warning`     | `color.text.warning.[default]`     | `#9E4C00` |
| `color.text.success`     | `color.text.success.[default]`     | `#4C6B1F` |
| `color.text.discovery`   | `color.text.discovery.[default]`   | `#803FA5` |
| `color.text.information` | `color.text.information.[default]` | `#1558BC` |
| `color.text.inverse`     | same                               | `#FFFFFF` |
| `color.border.focused`   | same                               | `#4688EC` |

Representative background values:

| Token                                 | Value       |
| ------------------------------------- | ----------- |
| `color.background.brand.bold`         | `#1868DB`   |
| `color.background.brand.bold.hovered` | `#1558BC`   |
| `color.background.brand.bold.pressed` | `#144794`   |
| `color.background.selected`           | `#E9F2FE`   |
| `color.background.selected.hovered`   | `#CFE1FD`   |
| `color.background.selected.bold`      | `#1868DB`   |
| `color.background.neutral`            | `#0515240F` |
| `color.background.neutral.hovered`    | `#0B120E24` |
| `color.background.neutral.pressed`    | `#080F214A` |
| `color.background.neutral.bold`       | `#292A2E`   |
| `color.background.danger`             | `#FFECEB`   |
| `color.background.danger.bold`        | `#C9372C`   |
| `color.background.warning`            | `#FFF5DB`   |
| `color.background.warning.bold`       | `#FBC828`   |
| `color.background.success`            | `#EFFFD6`   |
| `color.background.success.bold`       | `#5B7F24`   |
| `color.background.discovery`          | `#F8EEFE`   |
| `color.background.discovery.bold`     | `#964AC0`   |

### 3.6 Dark mode

The color docs state that design tokens support light and dark themes, and each color token maps to a
different value depending on the theme. Representative dark-theme values:

| Token                      | Dark value |
| -------------------------- | ---------- |
| `color.text.subtle`        | `#A9ABAF`  |
| `color.text.subtlest`      | `#96999E`  |
| `color.text.brand`         | `#669DF1`  |
| `color.border.focused`     | `#8FB8F6`  |
| `elevation.surface.sunken` | `#18191A`  |

The key behavior is not only inverted text. ADS elevation guidance says dark mode relies more on
different surface colors because shadows are harder to perceive on dark backgrounds.

### 3.7 Accessibility in color

ADS color docs target WCAG AA:

- 3:1 for UI essential to understanding the experience and text 24px or larger.
- 4.5:1 for text smaller than 24px.

There are special `warning.inverse` tokens because bold warning backgrounds are yellow and require
careful contrast handling.

---

## 4. Typography

### 4.1 Typography refresh

The current docs say Atlassian's app suite has moved to a refreshed typography system using:

- **Atlassian Sans** for app UI.
- **Atlassian Mono** for code.
- **Charlie Sans** for brand/marketing expression, with downloads restricted to authenticated users.

The docs also note that typography tokens use `rem` units conceptually for accessibility and
responsiveness; the inspected generated raw token artifacts show resolved pixel `font` shorthand
values.

### 4.2 Principles

ADS typography principles:

| Principle                             | Meaning                                                               |
| ------------------------------------- | --------------------------------------------------------------------- |
| **Optimize for readability**          | Help readers understand communication easily regardless of ability.   |
| **Create visual harmony**             | Use hierarchy and space to simplify complex information.              |
| **Contextualize for different users** | Account for preferences, operating systems, and application contexts. |

### 4.3 App type tokens

Representative exact values from `atlassian-typography`:

| Token                  | Value                                        |
| ---------------------- | -------------------------------------------- |
| `font.heading.xxlarge` | `normal 653 32px/36px "Atlassian Sans", ...` |
| `font.heading.xlarge`  | `normal 653 28px/32px "Atlassian Sans", ...` |
| `font.heading.large`   | `normal 653 24px/28px "Atlassian Sans", ...` |
| `font.heading.medium`  | `normal 653 20px/24px "Atlassian Sans", ...` |
| `font.heading.small`   | `normal 653 16px/20px "Atlassian Sans", ...` |
| `font.heading.xsmall`  | `normal 653 14px/20px "Atlassian Sans", ...` |
| `font.heading.xxsmall` | `normal 653 12px/16px "Atlassian Sans", ...` |
| `font.body.large`      | `normal 400 16px/24px "Atlassian Sans", ...` |
| `font.body`            | `normal 400 14px/20px "Atlassian Sans", ...` |
| `font.body.small`      | `normal 400 12px/16px "Atlassian Sans", ...` |
| `font.code`            | `normal 400 0.875em/1 "Atlassian Mono", ...` |

Metric tokens:

| Token                | Value                                        |
| -------------------- | -------------------------------------------- |
| `font.metric.large`  | `normal 653 28px/32px "Atlassian Sans", ...` |
| `font.metric.medium` | `normal 653 24px/28px "Atlassian Sans", ...` |
| `font.metric.small`  | `normal 653 16px/20px "Atlassian Sans", ...` |

Weight tokens:

| Token                  | Value |
| ---------------------- | ----- |
| `font.weight.regular`  | `400` |
| `font.weight.medium`   | `500` |
| `font.weight.semibold` | `600` |
| `font.weight.bold`     | `653` |

The `653` weight is one of the most distinctive ADS details. It is not conventional CSS "700 bold";
it is a tuned Atlassian heading weight for the refreshed typeface.

### 4.4 Heading semantics

The docs explicitly connect heading styles to accessibility:

- Use headings to introduce content sections.
- Use heading styles rather than ad hoc bold/size changes.
- Heading levels help screen-reader navigation.
- Use one `h1` per page.
- Do not skip heading levels.

This is a key difference from brand-only typography systems. ADS treats typography as information
architecture, not just visual hierarchy.

---

## 5. Spacing and layout

### 5.1 8px base unit

ADS spacing is built around an **8px base unit**:

| Token        | Multiplier | REM        | Pixels |
| ------------ | ---------- | ---------- | ------ |
| `space.0`    | `0x`       | `0rem`     | `0px`  |
| `space.025`  | `0.25x`    | `0.125rem` | `2px`  |
| `space.050`  | `0.5x`     | `0.25rem`  | `4px`  |
| `space.075`  | `0.75x`    | `0.375rem` | `6px`  |
| `space.100`  | `1x`       | `0.5rem`   | `8px`  |
| `space.150`  | `1.5x`     | `0.75rem`  | `12px` |
| `space.200`  | `2x`       | `1rem`     | `16px` |
| `space.250`  | `2.5x`     | `1.25rem`  | `20px` |
| `space.300`  | `3x`       | `1.5rem`   | `24px` |
| `space.400`  | `4x`       | `2rem`     | `32px` |
| `space.500`  | `5x`       | `2.5rem`   | `40px` |
| `space.600`  | `6x`       | `3rem`     | `48px` |
| `space.800`  | `8x`       | `4rem`     | `64px` |
| `space.1000` | `10x`      | `5rem`     | `80px` |

Negative values exist in code from `space.negative.025` to `space.negative.400` (`-2px` to `-32px`).
Docs recommend using the `Bleed` primitive before reaching for raw negative spacing.

### 5.2 Usage ranges

| Range  | Tokens                                         | Use                                                                                                |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Small  | `space.0` to `space.100` (`0px` to `8px`)      | Small/compact UI: icon-text gaps, badges, icon buttons, table cells, button groups, input padding. |
| Medium | `space.150` to `space.300` (`12px` to `24px`)  | Larger components: buttons, avatars with content, cards, less-dense component spacing.             |
| Large  | `space.400` to `space.1000` (`32px` to `80px`) | Page layout, large alignment, top-of-page spacing, large content structures.                       |

### 5.3 Layout principles

ADS spacing docs are strongly Gestalt-driven:

- **Group by similarity**: consistent spacing helps users recognize related elements.
- **Group by proximity**: closer objects are understood as related.
- **Create order and hierarchy**: use scale and whitespace to rank importance.
- **Introduce visual rhythm**: repeated spacing supports scanning; varied spacing guides attention.
- **Use optical adjustment**: tokens are a foundation, but visual balance may require judgment.

This makes spacing a meaning system, not just a grid.

### 5.4 Breakpoints and grid

`@atlaskit/primitives` exposes an internal breakpoint config:

| Breakpoint | Meaning        | Min        | Max         | Grid margin          |
| ---------- | -------------- | ---------- | ----------- | -------------------- |
| `xxs`      | mobile         | `0rem`     | `29.99rem`  | `space.200` (`16px`) |
| `xs`       | phablet        | `30rem`    | `47.99rem`  | `space.200` (`16px`) |
| `sm`       | tablet         | `48rem`    | `63.99rem`  | `space.300` (`24px`) |
| `md`       | laptop desktop | `64rem`    | `89.99rem`  | `space.400` (`32px`) |
| `lg`       | monitor        | `90rem`    | `110.49rem` | `space.400` (`32px`) |
| `xl`       | large high-res | `110.5rem` | none        | `space.500` (`40px`) |

The max values use `-0.01rem` to avoid overlapping media queries and fractional-pixel gaps.

---

## 6. Shape, border, and radius

Shape tokens from `atlassian-shape`:

| Token                   | Value    |
| ----------------------- | -------- |
| `radius.xsmall`         | `2px`    |
| `radius.small`          | `4px`    |
| `radius.medium`         | `6px`    |
| `radius.large`          | `8px`    |
| `radius.xlarge`         | `12px`   |
| `radius.xxlarge`        | `16px`   |
| `radius.full`           | `9999px` |
| `radius.tile`           | `25%`    |
| `border.width`          | `1px`    |
| `border.width.selected` | `2px`    |
| `border.width.focused`  | `2px`    |

ADS radius is moderate: softer than old enterprise 2px chrome, but less pill-driven than Cursor's
brand surface. The scale supports Jira cards, buttons, badges, modals, tiles, and focus rings
without making the UI feel playful.

---

## 7. Elevation

### 7.1 Elevation model

ADS defines four core elevation levels plus overflow:

| Elevation    | Use                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------ |
| **Sunken**   | Lowest surface; backdrop/well where content sits, such as Kanban board columns.            |
| **Default**  | Baseline flat surface, such as a Confluence page.                                          |
| **Raised**   | Slight lift for movable cards, such as Jira/Trello cards, or occasional emphasis.          |
| **Overlay**  | UI above other UI: modals, dialogs, dropdowns, floating toolbars, floating action buttons. |
| **Overflow** | Shadow indicating clipped scrollable content.                                              |

### 7.2 Exact surface and shadow values

Representative light values:

| Token                      | Value                                                 |
| -------------------------- | ----------------------------------------------------- |
| `elevation.surface.sunken` | `#F8F8F8`                                             |
| `elevation.shadow.raised`  | `0 1px 1px #1E1F21 @ 0.25`, `0 0 1px #1E1F21 @ 0.31`  |
| `elevation.shadow.overlay` | `0 8px 12px #1E1F21 @ 0.15`, `0 0 1px #1E1F21 @ 0.31` |

Representative dark values:

| Token                      | Value                                                                         |
| -------------------------- | ----------------------------------------------------------------------------- |
| `elevation.surface.sunken` | `#18191A`                                                                     |
| `elevation.shadow.raised`  | low-alpha dark shadow layers using `#01040475`                                |
| `elevation.shadow.overlay` | includes a light perimeter layer (`#BDBDBD` at `0.12`) plus dark depth layers |

### 7.3 Elevation rules

- Use `elevation.surface` as the default body/content surface.
- Pair raised surface with raised shadow.
- Pair overlay surface with overlay shadow.
- Do not use sunken surfaces on raised or overlay elevations.
- Do not use raised elevation merely to group content when border or whitespace is enough.
- Dragged UI should use overlay elevation while being moved.
- For scrollable content, use a border by default and overflow shadows when a border might be
  missed.

The important distinction: `elevation.surface.sunken` is opaque and darkens in both light and dark
modes; `color.background.neutral` is transparent and adapts differently on dark elevated surfaces.

---

## 8. Motion

### 8.1 Current status

Motion is in **Early Access**. The docs say a limited set of motion tokens has been released to a
small number of components and is behind the feature flag:

```txt
platform-dst-motion-uplift
```

This should be treated as a system in rollout, not a fully universal motion language yet.

### 8.2 Motion principles

| Principle      | Meaning                                                                   |
| -------------- | ------------------------------------------------------------------------- |
| **Human**      | Subtle, rhythmic, organic, warm rather than mechanical.                   |
| **Clarity**    | Motion clarifies; it is not decoration.                                   |
| **Accessible** | Motion respects reduced-motion settings and offers low/no-motion options. |
| **Performant** | Motion should reinforce speed and momentum, never slow teams down.        |

### 8.3 Durations

| Token                     | Value   | Use                                                        |
| ------------------------- | ------- | ---------------------------------------------------------- |
| `motion.duration.instant` | `0ms`   | Instant feedback, selected/focus states.                   |
| `motion.duration.xxshort` | `50ms`  | Very fast interaction feedback.                            |
| `motion.duration.xshort`  | `100ms` | Short exits / small interaction changes.                   |
| `motion.duration.short`   | `150ms` | Button hover/pressed, popup enter, avatar appear.          |
| `motion.duration.medium`  | `200ms` | Modal/flag exit.                                           |
| `motion.duration.long`    | `250ms` | Modal/flag enter.                                          |
| `motion.duration.xlong`   | `400ms` | Large transitions such as panels and full-screen overlays. |
| `motion.duration.xxlong`  | `600ms` | Extra-large/expressive transitions.                        |

Docs summarize the ranges as:

- Interactions: `50-150ms`.
- Transitions: `150-400ms`.

### 8.4 Easing curves and semantic bundles

Documented curves:

| Curve              | Value                            | Best for                                    |
| ------------------ | -------------------------------- | ------------------------------------------- |
| Ease-out bold      | `cubic-bezier(0, 0.4, 0, 1)`     | Panels or flags entering.                   |
| Ease-in-out bold   | `cubic-bezier(0.4, 0, 0, 1)`     | Scaling modals or repositioning.            |
| Ease-in practical  | `cubic-bezier(0.6, 0, 0.8, 0.6)` | Exit transitions.                           |
| Ease-out practical | `cubic-bezier(0.4, 1, 0.6, 1)`   | Popups and everyday hover/background fades. |

Representative semantic motion tokens:

| Token                       | Value                                                                    |
| --------------------------- | ------------------------------------------------------------------------ |
| `motion.modal.enter`        | `250ms`, `cubic-bezier(0.4, 0, 0, 1)`, `ScaleIn95to100`                  |
| `motion.modal.exit`         | `200ms`, `cubic-bezier(0.6, 0, 0.8, 0.6)`, `ScaleOut100to95`             |
| `motion.popup.enter.bottom` | `150ms`, `cubic-bezier(0.4, 1, 0.6, 1)`, `SlideInBottom8px + FadeIn`     |
| `motion.popup.exit.bottom`  | `100ms`, `cubic-bezier(0.6, 0, 0.8, 0.6)`, `SlideOutBottom8px + FadeOut` |
| `motion.avatar.hovered`     | `250ms`, spring-like `linear(...)`, `transform`                          |

Motion token names are semantic bundles: a token like `motion.popup.enter` packages duration,
easing, and motion properties so designers and engineers choose by intent.

---

## 9. Components and primitives

### 9.1 Component catalog shape

The component docs reveal a broad product-system catalog:

| Category              | Examples                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| Forms and input       | Button, Icon button, Link button, Split button, Calendar, Checkbox, Dropdown menu, Text field, Toggle   |
| Images and icons      | Avatar, Avatar group, Icon, Image, Object, Logo, Tile                                                   |
| Labels                | Badge, Lozenge, Tag, Tag group                                                                          |
| Layout and structure  | Page, Page header                                                                                       |
| Loading               | Progress bar, Skeleton, Spinner                                                                         |
| Messaging             | Banner, Empty state, Flag, Inline message, Modal dialog, Spotlight, Section message                     |
| Navigation            | Breadcrumbs, Link, Menu, Navigation system, Pagination, Tabs                                            |
| Overlays and layering | Blanket, Drawer, Inline dialog, Popup, Tooltip                                                          |
| Primitives            | Box, Inline, Stack, Flex, Grid, Bleed, XCSS, Responsive, Text, MetricText, Pressable, Anchor, Focusable |
| Status indicators     | Progress indicator, Progress tracker                                                                    |
| Text and data display | Code, Dynamic table, Heading, and related display components                                            |

The system is tuned for product UI, not marketing composition.

### 9.2 Button

`@atlaskit/button` describes a button as triggering an event or action and letting users know what
will happen next.

Inspected package constants:

```ts
buttonAppearances = [
  "default",
  "primary",
  "subtle",
  "warning",
  "danger",
  "discovery",
]

buttonSpacing = ["default", "compact"]
```

That appearance set mirrors ADS color roles: primary/brand, neutral default, low-emphasis subtle,
warning, danger, and discovery.

Button-related entry points include:

- `button`
- `standard-button`
- `default-button`
- `loading-button`
- `icon-button`
- `icon-link`
- `link`
- `split-button`
- `button-group`
- `custom-theme-button`

The shape is broader than a single primitive because Atlassian product screens need many action
forms: inline links, icon-only toolbar actions, split menu actions, loading states, and grouped
controls.

### 9.3 Primitives

`@atlaskit/primitives` package description: token-backed low-level building blocks.

Primary primitives:

| Primitive         | Purpose                                    |
| ----------------- | ------------------------------------------ |
| `Box`             | Generic token-backed container.            |
| `Inline`          | Horizontal layout.                         |
| `Stack`           | Vertical layout.                           |
| `Flex`            | Flexible layout.                           |
| `Grid`            | Grid layout.                               |
| `Bleed`           | Controlled negative whitespace / breakout. |
| `Text`            | Typography token application.              |
| `MetricText`      | Numeric/metric text.                       |
| `Pressable`       | Accessible interactive surface.            |
| `Anchor`          | Link surface.                              |
| `Focusable`       | Focus management primitive.                |
| `XCSS`            | Token-constrained styling API.             |
| `SurfaceProvider` | Tracks elevation/surface context.          |

Primitives are the "escape hatch with guardrails": they allow composition beyond the fixed
component catalog while keeping token usage, surfaces, and responsive behavior consistent.

### 9.4 Layers

`@atlaskit/primitives` exposes layer constants:

```ts
card: 100
navigation: 200
dialog: 300
layer: 400
blanket: 500
modal: 510
flag: 600
spotlight: 700
tooltip: 800
```

This gives the overlay stack a product-specific order: navigation, dialogs, blankets, modals,
flags, spotlights, tooltips.

### 9.5 Icons

`@atlaskit/icon@35.4.0` describes icons as symbols for commands, devices, directories, or common
actions. The docs emphasize iconography as a foundation alongside typography and color. In the
current system, icons are part of the same semantic color grammar:

- `color.icon`
- `color.icon.subtle`
- `color.icon.brand`
- `color.icon.success`
- `color.icon.warning`
- `color.icon.danger`
- `color.icon.discovery`
- `color.icon.accent.*`

The icon system is intended to be universal and product legible, not decorative.

---

## 10. Accessibility and governance

ADS accessibility is distributed across foundations and tooling:

| Area          | Accessibility / governance behavior                                                      |
| ------------- | ---------------------------------------------------------------------------------------- |
| Color         | WCAG AA contrast targets; inverse warning tokens for yellow bold backgrounds.            |
| Typography    | Heading hierarchy guidance; one `h1`; do not skip heading levels; rem-based token model. |
| Motion        | Honors reduced-motion settings; motion should aid comprehension without discomfort.      |
| Spacing       | Proximity and grouping reduce cognitive load and improve scannability.                   |
| Elevation     | Do not rely only on depth; use correct surface/shadow pairing and scroll indicators.     |
| Tokens        | Lint rules detect unsafe, deprecated, and missing token usage.                           |
| Build tooling | Babel plugin inserts fallbacks and improves runtime performance.                         |
| Migration     | Codemods remove old fallbacks and migrate raw values to tokens.                          |

The strongest Atlassian lesson is that a mature design system includes **enforcement mechanisms**.
Documentation alone is not enough.

---

## 11. Implementation architecture

### 11.1 CSS variables and themes

ADS themes mount CSS custom properties with the `--ds-*` prefix:

```css
var(--ds-text, #292a2e)
var(--ds-space-200, 1rem)
var(--ds-font-body, normal 400 14px/20px "Atlassian Sans", ...)
```

Theme activation is attribute-driven:

```html
data-theme="light:light dark:dark spacing:spacing typography:typography"
data-color-mode="light"
```

### 11.2 Babel and fallback strategy

The docs recommend using `token()` without explicit fallbacks. The Babel plugin can automatically
add light-theme fallbacks:

```ts
token("space.200")
// var(--ds-space-200, 1rem)
```

Fallbacks were important during migration, but the docs now recommend removing explicit fallbacks
once themes are enabled because they increase critical CSS and simplify less.

### 11.3 Linting and codemods

Recommended tooling includes:

- `@atlaskit/design-system/ensure-design-token-usage`
- `@atlaskit/design-system/no-unsafe-design-token-usage`
- `@atlaskit/design-system/no-deprecated-design-token-usage`
- `@atlaskit/tokens/babel-plugin`
- `@atlaskit/codemod-cli`

This is a technical governance stack. The system can warn, transform, and migrate code.

### 11.4 Styling stack

The inspected packages use:

- React component packages under `@atlaskit/*`.
- Compiled CSS output (`**/*.compiled.css` side effects).
- `@atlaskit/tokens` for CSS variables and token mapping.
- `@atlaskit/primitives` for token-backed layout.
- Package metadata with design-system website pages, status, and category information.

---

## 12. Atlassian's AI/Rovo layer

The ADS homepage currently features **Rovo and AI design patterns**, described as patterns for the
future of teamwork. This is the system's equivalent of:

- Cursor's agent activity colors.
- Shopify's `magic` role.
- Twenty's product-data tag palette.

Atlassian's AI expression is likely to be more pattern-driven than token-only because AI surfaces
must explain intent, provenance, automation, suggestions, and trust in complex collaborative
workflows. The design system already has the right ingredients:

- `discovery` for new/onboarding concepts.
- `information` for in-progress or informative UI.
- motion principles around clarity and comprehension.
- typography rules for structured explanation.
- primitives for composing new patterns before component APIs stabilize.

The paper's inference: ADS will treat AI as **teamwork context**, not as a decorative purple sparkle.
That matches Atlassian's product strategy around Rovo and "the future of teamwork."

---

## 13. How to replicate the Atlassian look

1. **Start neutral.** Use white/default surfaces, `#F8F8F8` sunken areas, and `#292A2E` text.
2. **Use Atlassian Blue deliberately.** `#1868DB` is primary/brand, not a background wash for every
   component.
3. **Use the role grammar.** Choose `brand`, `information`, `success`, `warning`, `danger`,
   `discovery`, `accent`, `inverse`, or `input` based on meaning.
4. **Never use accent for semantic status.** If it means something, use a semantic role.
5. **Use Atlassian Sans and Mono.** Headings at weight `653`; body at `400`; code in Atlassian Mono.
6. **Respect the 8px base.** Use `space.100 = 8px`, with `2/4/6px` only for compact UI details.
7. **Use surface/shadow pairs.** Raised surface with raised shadow; overlay surface with overlay
   shadow.
8. **Prefer primitives for custom layout.** `Box`, `Stack`, `Inline`, `Flex`, `Grid`, `Bleed`,
   `Text`, `Pressable`, and `Anchor` keep custom UI inside the system.
9. **Keep motion purposeful.** 50-150ms for interactions, 150-400ms for transitions, reduced-motion
   support always.
10. **Make complex pages scannable.** Group by proximity and similarity; use whitespace and
    hierarchy to reduce cognitive effort.
11. **Use linting and Babel tooling.** ADS is meant to be enforced in code, not copied by eye.

---

## 14. Comparison with Cursor, Twenty, and Shopify

| Dimension         | Cursor                                     | Twenty                                    | Shopify Polaris                        | Atlassian ADS                                               |
| ----------------- | ------------------------------------------ | ----------------------------------------- | -------------------------------------- | ----------------------------------------------------------- |
| Primary surface   | AI coding editor + marketing               | Open-source CRM                           | Commerce admin platform                | Collaboration/productivity portfolio                        |
| Visual signature  | Warm paper, custom type, orange accent     | Neutral Radix UI + indigo + colorful tags | Merchant admin roles + tactile buttons | Atlassian Blue + neutral surfaces + semantic roles          |
| Token model       | CSS variables, warm ink and orange         | TS theme constants + Radix P3             | HSLuv palette + role/state grammar     | `@atlaskit/tokens`, CSS vars, theme artifacts, Babel plugin |
| Typography        | CursorGothic / Berkeley Mono / EB Garamond | Inter 400/500/600                         | Inter 450/550/650/700                  | Atlassian Sans / Mono, heading weight 653                   |
| Spacing           | Typographic baseline grid                  | 4px function                              | Exact size ladder                      | 8px base with 2/4/6px small tokens                          |
| Depth             | Mostly flat paper                          | Soft layered shadows                      | Beveled tactile controls               | Surface/shadow elevation system                             |
| Dark mode         | Product dark, brand light                  | Equal product light/dark                  | Theme-mapped admin                     | Light/dark/increased-contrast/legacy/future themes          |
| AI semantic layer | Agent activity colors                      | CRM data tags                             | `magic` role                           | Rovo/AI patterns + discovery/information semantics          |
| Governance        | Brand rules                                | Open-source code as source                | Native Shopify app constraints         | Lint, Babel, codemods, primitives, tokens                   |

---

## 15. The distilled ADS rules

1. **Choose meaning before color.**
2. **Use `brand` for primary Atlassian action, not generic emphasis.**
3. **Use `danger` only for serious error or danger.**
4. **Use `warning` to prevent mistakes.**
5. **Use `discovery` for new/onboarding concepts.**
6. **Use `accent` only when the hue has no semantic meaning.**
7. **Use `input` for form fields.**
8. **Use `font.heading.*`, `font.body`, and `font.code` rather than ad hoc type styles.**
9. **Keep heading levels semantic.**
10. **Use `space.*` tokens, not raw pixels.**
11. **Reach for `Bleed` before negative spacing.**
12. **Pair elevation surfaces with their matching shadows.**
13. **Use overlay elevation for dragged/floating UI.**
14. **Respect reduced motion.**
15. **Compose custom UI from primitives and XCSS instead of unbounded CSS.**
16. **Run token linting and Babel transforms; ADS is a coded system, not just a visual reference.**

---

## 16. Source notes

- `atlassian.design/design-system`: ADS positions itself around foundations, components, patterns,
  and tools; highlights Rovo/AI patterns and the typography GA update.
- `foundations/color`: documents saturated, neutral, and alpha color categories; role/emphasis/state
  token grammar; WCAG AA contrast targets; light/dark color themes.
- `foundations/spacing`: documents the 8px base unit, `space.100 = 8px`, values from `0px` to
  `80px`, negative spacing, and layout grouping principles.
- `foundations/typography`: documents Atlassian Sans, Atlassian Mono, Charlie Sans for brand,
  refreshed app typography, rem rationale, and heading semantics.
- `foundations/motion`: documents Early Access status, feature flag `platform-dst-motion-uplift`,
  principles, duration ranges, easing curves, and semantic motion tokens.
- `foundations/elevation`: documents sunken/default/raised/overlay/overflow elevations, dark-mode
  elevation behavior, and matching surface/shadow pairings.
- `foundations/tokens/use-tokens-in-code`: documents `setGlobalTheme`, `data-theme`,
  `data-color-mode`, the `token()` API, Babel plugin behavior, fallback migration, linting, and
  codemods.
- `@atlaskit/tokens@13.2.0`: source for exact raw theme values, palette values, typography,
  spacing, shape, and motion artifacts.
- `@atlaskit/primitives@19.0.2`: source for primitives, breakpoints, layer constants, and
  token-backed composition model.
- `@atlaskit/button@23.11.8`: source for button appearances and entry points.
- `@atlaskit/icon@35.4.0`: source for icon package metadata and implementation status.
