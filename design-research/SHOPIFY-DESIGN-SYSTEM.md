# Shopify (Polaris) — Design System Teardown

> A full reverse-engineering of **Shopify Polaris**, the design system for the Shopify admin and
> Shopify app experiences. This paper mirrors the structure of the Cursor and Twenty teardowns, but
> Shopify is a different kind of subject: Polaris is not a marketing-site aesthetic or a small
> product UI kit. It is a mature, merchant-facing operating system for commerce software, with
> public docs, public Figma resources, a token package, an icon package, a deprecated React package,
> and a newer Web Components direction.
>
> **Method:** tokens below are read from the public Polaris documentation and the archived
> `Shopify/polaris-react` monorepo source: `polaris-tokens/src/colors.ts`,
> `polaris-tokens/src/size.ts`, `polaris-tokens/src/themes/base/*.ts`,
> `polaris-tokens/src/themes/dark.ts`, `polaris-react/src/components/Button/Button.module.css`,
> `polaris-react/package.json`, and `polaris-icons/package.json`. The current platform direction is
> checked against Shopify's Web Components documentation and the repository README. Captured June 2026.
>
> **Important current-state note:** `@shopify/polaris` / Polaris React is now explicitly
> **deprecated**. The public GitHub repository says Shopify released **Polaris Web Components on
> October 1, 2025** and encourages app developers to adopt them for new development. The old React
> package remains the richest public source for tokens and component implementation details, but
> Web Components are the future-facing app surface.
>
> **Primary sources:** [Polaris React docs](https://polaris-react.shopify.com/getting-started),
> [Polaris color tokens](https://polaris-react.shopify.com/design/colors/color-tokens),
> [Polaris palettes and roles](https://polaris-react.shopify.com/design/colors/palettes-and-roles),
> [Polaris typography](https://polaris-react.shopify.com/design/typography),
> [Polaris motion](https://polaris-react.shopify.com/design/motion),
> [Polaris depth](https://polaris-react.shopify.com/design/depth),
> [Polaris icons](https://polaris-react.shopify.com/design/icons),
> [Shopify Polaris Web Components](https://shopify.dev/docs/api/app-home/web-components),
> [Shopify/polaris-react GitHub](https://github.com/Shopify/polaris-react).

---

## 0. TL;DR — the design in one paragraph

Shopify Polaris is **pragmatic, merchant-first, tactile enterprise UI**. Its visual system is not
trying to be editorial like Cursor or Notion-like like Twenty. It is built for people running a
business all day: products, orders, customers, fulfillment, payments, risk, inventory, analytics,
discounts, and apps embedded inside the Shopify admin. The palette is a huge, perceptually balanced
set of **12 color hues × 16 shades**, built with **HSLuv lightness** so role swaps preserve contrast.
But the actual admin chrome is mostly neutral: soft grays, white cards, dark text, tactical blue
focus, and dark tactile primary buttons. The distinctive Polaris move is a **semantic role grammar**
rather than a brand-color grammar: tokens are named by element (`bg`, `bg-surface`, `bg-fill`,
`text`, `border`, `icon`), role (`brand`, `success`, `warning`, `critical`, `magic`, `nav`, `input`,
etc.), prominence, and state (`hover`, `active`, `selected`, `disabled`). Typography is Inter with
unusual Shopify weights (`450 / 550 / 650 / 700`), compact UI scales, tabular numbers, and mono for
code. Geometry is an exact **size-token ladder** from `0.66px` through `128px`, with radius, width,
height, spacing, line-height, and border width all pulling from the same source. Depth is deliberate:
beveled buttons, inset press states, modal shadows, and a dark top/nav frame. The system's core
philosophy is: **make apps feel native to the Shopify admin, reduce merchant confusion, and encode
commerce status clearly without decorative color.**

---

## 1. Brand identity & philosophy

| Aspect                       | What Shopify Polaris does                                                                                                                                                                                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company / product**        | Shopify is a commerce platform; Polaris is the design system for the **Shopify admin** and apps that live inside it.                                                                                                                                          |
| **User**                     | The user is a **merchant**, not a generic SaaS operator. They are managing orders, inventory, fulfillment, marketing, payments, and risk.                                                                                                                     |
| **Product framing**          | Polaris exists so Shopify-built and partner-built app experiences feel **native to Shopify admin**. The Web Components docs describe it as a library for displaying data, collecting input, and triggering API calls while following Shopify's design system. |
| **Voice**                    | Functional, instructive, and normative: "Do" / "Don't" guidance is everywhere. It teaches designers and app developers when a role should be used, not just what a component looks like.                                                                      |
| **Aesthetic stance**         | Clean business software with tactile affordances. Neutral admin chrome, strong information hierarchy, restrained role color, and button depth that makes primary actions feel pressable.                                                                      |
| **Primary design challenge** | Shopify is a high-complexity admin. Polaris must make thousands of merchant workflows predictable across first-party admin screens and third-party apps.                                                                                                      |
| **Design DNA in one line**   | Neutral surfaces + role/state color grammar + tactile controls + compact Inter typography + strict tokenization.                                                                                                                                              |

### 1.1 The system is about native admin behavior, not visual novelty

Cursor's design language is brand-led. Twenty's is source-code/product-led. Polaris is
**platform-led**. The point is not to make every app look "Shopify branded" in a marketing sense;
the point is to make every app behave like part of the Shopify admin.

That explains several Polaris choices:

- The docs focus heavily on **roles and usage rules**, not just values.
- Color tokens describe UI intent rather than hue ownership.
- Specialty roles such as `nav`, `input`, `avatar`, `checkbox`, `radio-button`, `video-thumbnail`,
  and `scrollbar` exist because platform surfaces need stricter semantics than a generic app kit.
- Components encode app-admin patterns directly: `Page`, `Card`, `IndexTable`, `ResourceList`,
  `Banner`, `Badge`, `ChoiceList`, `TextField`, `Popover`, `Modal`, and now Web Component equivalents.

### 1.2 Current platform split — React is historical, Web Components are current

The public repository now redirects to `Shopify/polaris-react` and marks **Polaris React
deprecated**. The README states that on **October 1, 2025**, Shopify released **Polaris Web
Components** for app development and recommends app developers adopt Web Components for new work.

| Surface                                        | Status in 2026              | Notes                                                                                                                                                               |
| ---------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Polaris Web Components**                     | **Future-facing**           | Loaded from `https://cdn.shopify.com/shopifycloud/polaris.js`; types available through `@shopify/polaris-types`. Works across frameworks and server-rendered sites. |
| **Polaris React (`@shopify/polaris`)**         | **Deprecated / historical** | Still the richest public implementation source. NPM latest observed: `13.9.5`; repo package source shows `13.10.1`.                                                 |
| **Polaris tokens (`@shopify/polaris-tokens`)** | **Design-token authority**  | NPM latest observed: `9.4.2`; source lives in `polaris-tokens`.                                                                                                     |
| **Polaris icons (`@shopify/polaris-icons`)**   | **Icon authority**          | NPM latest observed in source package: `9.3.1`.                                                                                                                     |
| **Polaris docs / Figma**                       | **Design guidance**         | Docs point designers to Figma community resources for components, styles, and icons.                                                                                |

This matters when using the system today: the **design language** is Polaris; the **new app delivery
primitive** is Web Components; the **best public implementation evidence** still lives in the React
monorepo and token package.

### 1.3 Design DNA — the rules the system obeys

1. **Semantic roles over literal colors.** Do not pick "green" because something feels positive.
   Use `success` when the merchant needs confirmation that something is OK.
2. **Element-role-prominence-state naming.** Tokens read like UI grammar:
   `color-bg-surface-secondary-hover`, `color-text-critical`, `color-border-focus`,
   `color-nav-bg-surface-selected`.
3. **Neutral admin by default.** The baseline admin is gray/white/dark text. Color is mostly status,
   selection, attention, or specialty.
4. **HSLuv palette underneath.** The docs state the global palette uses HSLuv lightness so shades
   stay perceptually uniform and contrast-preserving across hues.
5. **Tactile interactive depth.** Buttons have bevels and inset press states. Depth is used to
   communicate interactivity and focus, not decoration.
6. **Merchant clarity beats expression.** `magic` is only for AI/automation. `nav` is only for the
   admin menu. `input` is only for form-like controls. These constraints prevent semantic drift.
7. **Accessibility is part of role design.** Input colors are reserved for forms to preserve WCAG
   contrast and recognizability. Focus uses a dedicated blue `border-focus` token.

---

## 2. Color system

### 2.1 Foundation — 12 hues × 16 shades

The raw palette in `polaris-tokens/src/colors.ts` defines 16-step scales for the main hues:

| Hue                                                | Scale example / role                                                                |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `gray`                                             | The neutral admin foundation, from `gray1` white to `gray16` near-black.            |
| `blue`                                             | Focus, links, and informational / brand-adjacent accents. `blue13` is focus border. |
| `green`                                            | Success.                                                                            |
| `orange` / `yellow`                                | Caution and warning.                                                                |
| `red`                                              | Critical / destructive / error.                                                     |
| `purple`                                           | Magic / AI / automation.                                                            |
| `teal`, `cyan`, `azure`, `lime`, `magenta`, `rose` | Additional semantic and visualization hues.                                         |

Representative exact values from source:

| Token      | Value                    | Use / meaning                                                |
| ---------- | ------------------------ | ------------------------------------------------------------ |
| `gray1`    | `rgba(255, 255, 255, 1)` | White surface.                                               |
| `gray6`    | `rgba(241, 241, 241, 1)` | Default light admin background (`color-bg`).                 |
| `gray15`   | `rgba(48, 48, 48, 1)`    | Default text and brand-fill button background in light mode. |
| `gray16`   | `rgba(26, 26, 26, 1)`    | Darkest neutral; dark-mode background and inverse surfaces.  |
| `blue13`   | `rgba(0, 91, 211, 1)`    | Focus border (`color-border-focus`).                         |
| `green12`  | `rgba(4, 123, 93, 1)`    | Success fill.                                                |
| `red12`    | `rgba(199, 10, 36, 1)`   | Critical fill.                                               |
| `purple12` | `rgba(128, 81, 255, 1)`  | Magic fill.                                                  |
| `orange9`  | `rgba(255, 184, 0, 1)`   | Warning/caution family.                                      |

The important part is not the hex table; it is the **contrast model**. Polaris docs state the palette
is built with HSLuv lightness so comparable shade numbers across hues have comparable contrast
behavior. This lets a token recipe swap `red12` for `green12` or `purple12` without destroying
legibility.

### 2.2 Neutral admin surface ladder

The default light theme maps neutrals like this:

```ts
'color-bg': { value: colors.gray[6] }          // rgba(241,241,241,1)
'color-bg-surface': { value: colors.gray[1] }  // white card/surface
'color-bg-fill-brand': { value: colors.gray[15] }
'color-text': { value: colors.gray[15] }
'color-border-focus': { value: colors.blue[13] }
```

This is the core Shopify admin look:

- Page background: very light gray.
- Cards and main surfaces: white.
- Text: dark gray, not pure black.
- Primary action: dark neutral button, not green.
- Focus: saturated Shopify blue.

That is a crucial distinction from many app kits. Shopify's primary action color is not the Shopify
green brand. It is a dark tactile admin button. Green is success, not "primary."

### 2.3 Semantic role grammar

The docs define color tokens as a structure:

```txt
color + element + role + prominence + state
```

Elements:

| Element      | Meaning                                                 |
| ------------ | ------------------------------------------------------- |
| `bg`         | Page or broad background.                               |
| `bg-surface` | Cards, panels, menus, sections.                         |
| `bg-fill`    | Smaller filled elements such as buttons, badges, chips. |
| `text`       | Text color.                                             |
| `border`     | Borders and focus outlines.                             |
| `icon`       | Icon color.                                             |

States:

| State      | Purpose                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `hover`    | Pointer hover feedback.                                                 |
| `active`   | Pressed / active interaction.                                           |
| `selected` | Chosen item, selected row, selected option.                             |
| `disabled` | Intentionally de-emphasized, not required to meet normal WCAG contrast. |

Roles:

| Role          | Official intent                                                   |
| ------------- | ----------------------------------------------------------------- |
| `default`     | Baseline admin experience and neutral messaging.                  |
| `brand`       | Main actions where a primary path needs emphasis.                 |
| `info`        | Helpful information, tips, promotions, incentives.                |
| `success`     | Confirmation that an action completed or a status is OK.          |
| `caution`     | Stalled, incomplete, or not-started states that are not errors.   |
| `warning`     | Strong non-blocking attention; may require merchant intervention. |
| `critical`    | Highest importance: blocked, impossible, error, immediate action. |
| `magic`       | AI / automation / Shopify Magic / Sidekick-style affordances.     |
| `emphasis`    | Selection and focus inside editors, such as the theme editor.     |
| `transparent` | Low visual affordance for repetitive small controls.              |
| `inverse`     | Dark framing surfaces such as the admin top bar.                  |

Specialized roles:

| Role                        | Restriction                                        |
| --------------------------- | -------------------------------------------------- |
| `input`                     | Reserved for form elements and form-like controls. |
| `nav`                       | Reserved for Shopify admin menu navigation.        |
| `avatar`                    | Reserved for generated avatar fills.               |
| `checkbox` / `radio-button` | Reserved for control-specific states.              |
| `scrollbar`                 | Reserved for scrollbar affordances.                |

### 2.4 The most distinctive color rule: no decorative role theft

Polaris is unusually explicit about when **not** to use a role:

- Do not use multiple `brand` roles in one area, because it confuses which action is primary.
- Do not use `info` for urgent statuses; use `warning` or `critical`.
- Do not use `success` for offers or enticements.
- Do not use `caution` for announcements.
- Do not use `warning` for "coming soon."
- Do not use `magic` as a generic pop of color.
- Do not use `nav` tokens for tabs or regular links.
- Do not use `input` colors outside form-like controls.

That is Polaris' strongest design-system muscle: color is not only visual; it is **policy**.

### 2.5 Dark theme

`polaris-tokens/src/themes/dark.ts` overrides the base theme with dark mappings:

```ts
'color-scheme': { value: 'dark' }
'color-bg': { value: colors.gray[16] }
'color-bg-surface': { value: colors.gray[15] }
'color-bg-fill': { value: colors.gray[15] }
'color-icon': { value: colors.gray[8] }
'color-icon-secondary': { value: colors.gray[11] }
'color-text': { value: colors.gray[8] }
'color-text-secondary': { value: colors.gray[11] }
'color-bg-fill-brand': { value: colors.gray[1] }
'color-text-brand-on-bg-fill': { value: colors.gray[15] }
```

The dark theme is not just inverted CSS. It remaps fills, icons, disabled states, transparent fills,
selected states, brand fills, and bevel shadows. Primary buttons become light-on-dark where needed:
`color-bg-fill-brand` becomes `gray1`, while `color-text-brand-on-bg-fill` becomes `gray15`.

### 2.6 Specialty: magic = AI/automation, not purple decoration

Polaris has a dedicated `magic` role:

```ts
'color-bg-fill-magic': { value: colors.purple[12] }
```

The docs say `magic` is for artificial intelligence or automation that saves merchants time, such as
Sidekick or Shopify Magic indicators. It should not be used simply to make a card stand out.

This is the 2026 Shopify equivalent of Cursor's agent-activity colors and Twenty's tag palette: an
AI-specific semantic layer. But Shopify's version is stricter. It is not a general product accent; it
is an explicit concept token.

---

## 3. Typography

### 3.1 Typeface stack

`polaris-tokens/src/themes/base/font.ts` defines:

```ts
'font-family-sans':
  "'Inter', -apple-system, BlinkMacSystemFont, 'San Francisco', 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif"

'font-family-mono':
  "ui-monospace, SFMono-Regular, 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace"
```

Polaris is an Inter system, but with robust Apple/system fallbacks. It is not typographically
proprietary like Cursor and not intentionally austere like Twenty. It is a platform UI stack:
predictable, legible, available everywhere.

### 3.2 Unusual weight scale

Source weights:

| Token                  | Value |
| ---------------------- | ----- |
| `font-weight-regular`  | `450` |
| `font-weight-medium`   | `550` |
| `font-weight-semibold` | `650` |
| `font-weight-bold`     | `700` |

This is a subtle but important Polaris detail. The "regular" weight is slightly heavier than the
common 400, and medium/semibold are also offset. On dense admin surfaces, that gives UI text more
presence without relying on large type.

### 3.3 Type scale

Raw font sizes come from the size ladder:

| Font token       | Size   |
| ---------------- | ------ |
| `font-size-275`  | `11px` |
| `font-size-300`  | `12px` |
| `font-size-325`  | `13px` |
| `font-size-350`  | `14px` |
| `font-size-400`  | `16px` |
| `font-size-450`  | `18px` |
| `font-size-500`  | `20px` |
| `font-size-550`  | `22px` |
| `font-size-600`  | `24px` |
| `font-size-750`  | `30px` |
| `font-size-800`  | `32px` |
| `font-size-900`  | `36px` |
| `font-size-1000` | `40px` |

Text variants:

| Variant       | Size   | Weight | Tracking  | Line-height |
| ------------- | ------ | ------ | --------- | ----------- |
| `heading-3xl` | `36px` | `700`  | `-0.54px` | `48px`      |
| `heading-2xl` | `30px` | `700`  | `-0.3px`  | `40px`      |
| `heading-xl`  | `24px` | `700`  | `-0.2px`  | `32px`      |
| `heading-lg`  | `20px` | `650`  | `-0.2px`  | `24px`      |
| `heading-md`  | `14px` | `650`  | `0px`     | `20px`      |
| `heading-sm`  | `13px` | `650`  | `0px`     | `20px`      |
| `heading-xs`  | `12px` | `650`  | `0px`     | `16px`      |
| `body-lg`     | `14px` | `450`  | `0px`     | `20px`      |
| `body-md`     | `13px` | `450`  | `0px`     | `20px`      |
| `body-sm`     | `12px` | `450`  | `0px`     | `16px`      |
| `body-xs`     | `11px` | `450`  | `0px`     | `12px`      |

### 3.4 Type behavior

The typography docs are more behavioral than ornamental:

- Use weight, size, color, and positioning together to define hierarchy.
- Do not rely only on color.
- Use mono for code.
- Use tabular numbers for repeated numbers and currency amounts.
- Do not reinterpret known typographic interaction patterns.

Polaris is designed for repeated scanning: prices, order counts, quantities, IDs, customer names,
inventory numbers, fulfillment states. That is why tabular numbers and compact variants matter.

---

## 4. Size, spacing, radius, width, height

### 4.1 The master size ladder

`polaris-tokens/src/size.ts` is the primitive that feeds spacing, radius, font size, line-height,
height, width, and border width:

| Token  | Value    |
| ------ | -------- |
| `0`    | `0px`    |
| `0165` | `0.66px` |
| `025`  | `1px`    |
| `050`  | `2px`    |
| `100`  | `4px`    |
| `150`  | `6px`    |
| `200`  | `8px`    |
| `275`  | `11px`   |
| `300`  | `12px`   |
| `325`  | `13px`   |
| `350`  | `14px`   |
| `400`  | `16px`   |
| `450`  | `18px`   |
| `500`  | `20px`   |
| `550`  | `22px`   |
| `600`  | `24px`   |
| `700`  | `28px`   |
| `750`  | `30px`   |
| `800`  | `32px`   |
| `900`  | `36px`   |
| `1000` | `40px`   |
| `1200` | `48px`   |
| `1600` | `64px`   |
| `2000` | `80px`   |
| `2400` | `96px`   |
| `2800` | `112px`  |
| `3200` | `128px`  |

This is tighter than a generic 4px-only system. It keeps micro values (`0.66`, `1`, `2`, `6`, `11`,
`13`, `14`, `18`, `22`, `30`) because admin UI needs precise optical sizing, not just layout blocks.

### 4.2 Spacing tokens

Spacing pulls from the size ladder:

```ts
'space-025': '1px'
'space-050': '2px'
'space-100': '4px'
'space-150': '6px'
'space-200': '8px'
'space-300': '12px'
'space-400': '16px'
'space-500': '20px'
'space-600': '24px'
'space-800': '32px'
'space-1000': '40px'
'space-1200': '48px'
'space-1600': '64px'
'space-2000': '80px'
'space-2400': '96px'
'space-2800': '112px'
'space-3200': '128px'
```

Component aliases:

```ts
'space-button-group-gap': var(--p-space-200)  // 8px
'space-card-gap': var(--p-space-400)          // 16px
'space-card-padding': var(--p-space-400)      // 16px
'space-table-cell-padding': var(--p-space-150) // 6px
```

The `6px` table-cell padding is telling: Polaris is optimized for dense tables and forms, not roomy
marketing layouts.

### 4.3 Radius

Radius tokens:

| Token                | Value    |
| -------------------- | -------- |
| `border-radius-0`    | `0px`    |
| `border-radius-050`  | `2px`    |
| `border-radius-100`  | `4px`    |
| `border-radius-150`  | `6px`    |
| `border-radius-200`  | `8px`    |
| `border-radius-300`  | `12px`   |
| `border-radius-400`  | `16px`   |
| `border-radius-500`  | `20px`   |
| `border-radius-750`  | `30px`   |
| `border-radius-full` | `9999px` |

Default buttons use `border-radius-200` (`8px`). The system is softer than Twenty's 2/4/8 product
chrome, but nowhere near a pill-only identity. It is tactile and friendly, not bubbly.

### 4.4 Border width

| Token               | Value    |
| ------------------- | -------- |
| `border-width-0165` | `0.66px` |
| `border-width-025`  | `1px`    |
| `border-width-050`  | `2px`    |
| `border-width-100`  | `4px`    |

The `0.66px` token is a high-DPI hairline trick. Shopify uses exact micro-widths where they help
buttons and dividers feel less heavy.

---

## 5. Depth, shadows, and tactility

### 5.1 Elevation scale

Polaris depth tokens:

```ts
'shadow-0': 'none'
'shadow-100': '0px 1px 0px 0px rgba(26, 26, 26, 0.07)'
'shadow-200': '0px 3px 1px -1px rgba(26, 26, 26, 0.07)'
'shadow-300': '0px 4px 6px -2px rgba(26, 26, 26, 0.20)'
'shadow-400': '0px 8px 16px -4px rgba(26, 26, 26, 0.22)'
'shadow-500': '0px 12px 20px -8px rgba(26, 26, 26, 0.24)'
'shadow-600': '0px 20px 20px -8px rgba(26, 26, 26, 0.28)'
```

The docs frame depth as hierarchy, interactivity, and focus:

- Use depth tactically.
- Do not overuse it.
- Do not give static elements unnecessary depth.
- Apply intuitive press-depth changes to interactive controls.
- Do not rely only on depth for focus because not all merchants perceive it equally.

### 5.2 Button bevels — the signature tactile detail

Button-specific shadows are more opinionated than the general elevation scale:

```ts
'shadow-button':
  '0px -1px 0px 0px #b5b5b5 inset,
   0px 0px 0px 1px rgba(0, 0, 0, 0.1) inset,
   0px 0.5px 0px 1.5px #FFF inset'

'shadow-button-primary':
  '0px -1px 0px 1px rgba(0, 0, 0, 0.8) inset,
   0px 0px 0px 1px rgba(48, 48, 48, 1) inset,
   0px 0.5px 0px 1.5px rgba(255, 255, 255, 0.25) inset'

'shadow-button-primary-inset':
  '0px 3px 0px 0px rgb(0, 0, 0) inset'
```

This is the "Shopify admin button" in one snippet: visually neutral, physically pressable,
old-fashioned in the best way. It feels more like a business tool than a modern flat-design app.

### 5.3 Dark bevel adjustment

The dark theme overrides `shadow-bevel-100` to use low-alpha light lines:

```ts
'shadow-bevel-100':
  '1px 0px 0px 0px rgba(204, 204, 204, 0.08) inset,
   -1px 0px 0px 0px rgba(204, 204, 204, 0.08) inset,
   0px -1px 0px 0px rgba(204, 204, 204, 0.08) inset,
   0px 1px 0px 0px rgba(204, 204, 204, 0.16) inset'
```

Again, dark mode is not a simple inversion. The bevels are tuned so surfaces remain dimensional on
near-black chrome.

---

## 6. Motion

### 6.1 Philosophy

The motion docs define three qualities:

| Quality        | Meaning                                                                  |
| -------------- | ------------------------------------------------------------------------ |
| **Purposeful** | Motion helps merchants understand the interface and action outcomes.     |
| **Responsive** | Motion reacts to merchant interaction with immediate feedback.           |
| **Snappy**     | Motion is quick and subtle, starting rapidly and slowing toward the end. |

Polaris explicitly says motion should not be decorative, elaborate, abrupt, instant, or distracting.

### 6.2 Motion tokens

Durations:

| Token                  | Value    |
| ---------------------- | -------- |
| `motion-duration-0`    | `0ms`    |
| `motion-duration-50`   | `50ms`   |
| `motion-duration-100`  | `100ms`  |
| `motion-duration-150`  | `150ms`  |
| `motion-duration-200`  | `200ms`  |
| `motion-duration-250`  | `250ms`  |
| `motion-duration-300`  | `300ms`  |
| `motion-duration-350`  | `350ms`  |
| `motion-duration-400`  | `400ms`  |
| `motion-duration-450`  | `450ms`  |
| `motion-duration-500`  | `500ms`  |
| `motion-duration-5000` | `5000ms` |

Timing functions:

| Token                | Value                               | Description from source                                      |
| -------------------- | ----------------------------------- | ------------------------------------------------------------ |
| `motion-ease`        | `cubic-bezier(0.25, 0.1, 0.25, 1)`  | Default user interaction: quick response, controlled finish. |
| `motion-ease-in`     | `cubic-bezier(0.42, 0, 1, 1)`       | Starts slowly, finishes fast; use sparingly.                 |
| `motion-ease-out`    | `cubic-bezier(0.19, 0.91, 0.38, 1)` | Starts fast, finishes slowly; use sparingly.                 |
| `motion-ease-in-out` | `cubic-bezier(0.42, 0, 0.58, 1)`    | Good default for system-triggered transitions.               |
| `motion-linear`      | `cubic-bezier(0, 0, 1, 1)`          | Continuous mechanical motion such as spinners.               |

Keyframes:

| Token          | Use                                   |
| -------------- | ------------------------------------- |
| `bounce`       | Confirmation / lively micro feedback. |
| `fade-in`      | Appearance.                           |
| `pulse`        | Attention indicator.                  |
| `spin`         | Loader/spinner.                       |
| `appear-above` | Overlay appearing from below.         |
| `appear-below` | Overlay appearing from above.         |

The motion system is larger than Twenty's tiny duration set, but still utilitarian. It is not
Cursor's editorial spring language; it is feedback-oriented admin motion.

---

## 7. Layout, breakpoints, and stacking

### 7.1 Breakpoints

Base breakpoints:

| Token            | Value    |
| ---------------- | -------- |
| `breakpoints-xs` | `0px`    |
| `breakpoints-sm` | `490px`  |
| `breakpoints-md` | `768px`  |
| `breakpoints-lg` | `1040px` |
| `breakpoints-xl` | `1440px` |

This is a conventional app breakpoint ladder with a small `sm` at 490px and desktop/application
breaks at 768/1040/1440.

### 7.2 Width and height

Width and height tokens reuse the master size scale:

```ts
'width-800': size[800]   // 32px
'height-800': size[800] // 32px
```

That shared source matters for components like buttons:

```css
.sizeSlim,
.sizeMedium {
  min-height: var(--p-height-800);
  min-width: var(--p-width-800);
}

@media (--p-breakpoints-md-up) {
  min-height: var(--p-height-700);
  min-width: var(--p-width-700);
}
```

Polaris buttons are actually taller on smaller/mobile contexts and slightly more compact at
medium-up breakpoints: touch first, density second.

### 7.3 Z-index

Z-index tokens:

| Token        | Value  |
| ------------ | ------ |
| `z-index-0`  | `auto` |
| `z-index-1`  | `100`  |
| `z-index-2`  | `400`  |
| `z-index-3`  | `510`  |
| `z-index-4`  | `512`  |
| `z-index-5`  | `513`  |
| `z-index-6`  | `514`  |
| `z-index-7`  | `515`  |
| `z-index-8`  | `516`  |
| `z-index-9`  | `517`  |
| `z-index-10` | `518`  |
| `z-index-11` | `519`  |
| `z-index-12` | `520`  |

The odd `510` to `520` compression suggests historical layering constraints: enough slots for
overlays, popovers, top bars, modals, toasts, and tooltips without the unbounded max-int approach
used by some systems.

---

## 8. Components & patterns

### 8.1 Button

The React button CSS is a concise summary of Polaris component architecture:

```css
.Button {
  --pc-button-gap: var(--p-space-050);
  --pc-button-bg: transparent;
  --pc-button-bg_hover: var(--pc-button-bg);
  --pc-button-bg_active: var(--pc-button-bg);
  --pc-button-bg_pressed: var(--pc-button-bg_active);
  --pc-button-bg_disabled: var(--p-color-bg-fill-disabled);
  all: unset;
  display: inline-flex;
  align-items: center;
  gap: var(--pc-button-gap);
  padding: var(--pc-button-padding-block) var(--pc-button-padding-inline);
  border-radius: var(--p-border-radius-200);
  box-shadow: var(--pc-button-box-shadow);
}
```

Variants:

| Variant           | Behavior                                                               |
| ----------------- | ---------------------------------------------------------------------- |
| `primary`         | Dark/brand fill, button gradient, primary bevel shadow, inverted text. |
| `secondary`       | Filled neutral button with bevel and active inset.                     |
| `tertiary`        | Transparent/ghost affordance with hover/active fills.                  |
| `plain`           | Link-like button using link text tokens and underline on interaction.  |
| `monochromePlain` | Plain action with current-color icon handling.                         |

Tones:

| Tone       | Behavior                                            |
| ---------- | --------------------------------------------------- |
| `success`  | Green text/fill tokens for positive actions.        |
| `critical` | Red text/fill tokens for destructive/error actions. |

Sizes:

| Size              | Mobile/touch behavior                 | Medium-up behavior |
| ----------------- | ------------------------------------- | ------------------ |
| `micro`           | `min-height: 28px`, `min-width: 28px` | `24px`             |
| `slim` / `medium` | `32px`                                | `28px`             |
| `large`           | `36px`                                | `32px`             |

Focus:

```css
outline: var(--p-border-width-050) solid var(--p-color-border-focus);
outline-offset: var(--p-space-025);
```

This is very Shopify: focus is not a generic browser ring. It is a specific `2px` blue outline with
a `1px` offset.

### 8.2 Card and Page

The admin mental model is page → sections → cards → controls/tables. Tokens encode that:

```ts
'space-card-gap': var(--p-space-400)
'space-card-padding': var(--p-space-400)
'color-bg': gray6
'color-bg-surface': gray1
```

Cards are not decorative. They are the main grouping primitive for merchant work.

### 8.3 Tables, IndexTable, ResourceList

Polaris exists for commerce admin workloads, so lists and tables are central:

- Products
- Orders
- Customers
- Inventory
- Discounts
- Fulfillment and payment statuses
- App-specific resource lists

The `space-table-cell-padding` alias (`6px`) tells you Polaris expects dense, repeated row content.
The component set historically includes `IndexTable`, `ResourceList`, filters, pagination, bulk
actions, and badges/status indicators.

### 8.4 Badge and Banner

Badges and banners are where role color becomes product meaning:

- `success`: completed, OK.
- `caution`: incomplete or not started.
- `warning`: needs attention, in progress, pending.
- `critical`: blocked, impossible, error.
- `info`: helpful information or incentives.
- `magic`: AI/automation.

The design rule is not "make status chips colorful." It is "choose the role that matches the
merchant's required response."

### 8.5 Navigation

The `nav` role is specialized and reserved for the Shopify admin menu:

```ts
'color-nav-bg': colors.gray[7]
'color-nav-bg-surface': colors.blackAlpha[3]
'color-nav-bg-surface-hover': colors.gray[6]
'color-nav-bg-surface-active': colors.gray[3]
'color-nav-bg-surface-selected': colors.gray[3]
```

The docs explicitly say not to use nav colors for tabs or ordinary links. That prevents every
navigation-looking thing in an app from impersonating the Shopify admin's actual frame.

### 8.6 Inputs

`input` colors are also specialized. The docs say the input role is reserved for form elements and
form-like controls, and ensures WCAG contrast and consistent form recognition across the admin.

This matters in Shopify because forms are mission-critical: product data, prices, shipping zones,
taxes, inventory, customer data, payment settings. A merchant must recognize editable fields
instantly.

### 8.7 Icons

Polaris icons are simple, consistent, and universal:

- Simple shapes over detail.
- Reused visual parts across icons.
- Recognizable metaphors over novelty.
- Avoid culturally specific or outdated metaphors when they may not translate.

The icon package is `@shopify/polaris-icons`; source package metadata exposes SVG builds and React
exports. Icons are not Tabler or Lucide; they are Shopify's own set, licensed under the Polaris
design guidelines agreement.

### 8.8 Web Components component map

Shopify's current Web Components docs group components into platform categories:

| Category             | Examples                                                                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Actions              | Button, Clickable, Link, Menu, Button group, Clickable chip.                                                                                                                       |
| Feedback and status  | Badge, Banner, Spinner.                                                                                                                                                            |
| Forms                | Checkbox, Select, Switch, Choice list, Color field, Date field, Drop zone, Email field, Money field, Number field, Password field, Search field, Text area, Text field, URL field. |
| Layout and structure | Box, Divider, Grid, Page, Section, Stack, Table, Query container, Ordered/Unordered list.                                                                                          |
| Overlays             | Dialogs, contextual layers, menus, and similar focused surfaces.                                                                                                                   |

This confirms the future direction: Polaris is becoming a framework-neutral admin UI substrate, not
just a React component library.

---

## 9. Accessibility

Polaris accessibility is encoded into usage guidance as much as tokens:

| Area                | Accessibility behavior                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Color roles**     | Roles communicate meaning consistently so merchants do not need to infer status from arbitrary hue.                |
| **HSLuv palette**   | Perceptual shade consistency helps preserve contrast ratios across hue substitutions.                              |
| **Focus**           | Dedicated `color-border-focus` blue and 2px focus outline.                                                         |
| **Inputs**          | Specialized input role keeps form controls recognizable and contrast-safe.                                         |
| **Disabled states** | Docs explicitly note disabled states are intentionally de-emphasized and do not need to meet normal WCAG contrast. |
| **Typography**      | Do not rely only on color for hierarchy; use weight, size, positioning, and color together.                        |
| **Depth**           | Do not rely only on depth for focus because not all merchants perceive depth the same way.                         |
| **Icons**           | Prefer universal, recognizable symbols; avoid niche or culturally specific metaphors.                              |

The system is not just "accessible components." It is **semantic consistency as accessibility**.

---

## 10. Implementation architecture

### 10.1 Token package

`@shopify/polaris-tokens` exports:

- `metaThemes`
- `metaThemeDefault`
- `createVar`
- `createVarName`
- `getThemeVarNames`
- `getMediaConditions`
- `toPx`, `toPxs`, `toRem`
- token group types for border, breakpoint, color, font, height, motion, shadow, space, width,
  z-index

Internally, themes are built from `metaThemeBase` plus partial overrides:

```ts
export function createMetaTheme(metaThemePartial) {
  return deepmerge(metaThemeBase, metaThemePartial)
}
```

The creation utility also converts px values to rems for configured token groups, so the public CSS
variables resolve as `--p-*` custom properties.

### 10.2 Theme class names

The token utility creates theme classes like:

```ts
createThemeClassName("light") // p-theme-light
createThemeClassName("dark") // p-theme-dark
```

This is a CSS-variable theme system: components consume `var(--p-color-...)`, not imported JS color
objects at runtime.

### 10.3 React package stack

The deprecated React package source still shows the historical implementation stack:

| Package               | Source fact                                                         |
| --------------------- | ------------------------------------------------------------------- |
| `@shopify/polaris`    | "Shopify's admin product component library."                        |
| React peer deps       | React 18 / React DOM 18.                                            |
| Tokens                | Depends on `@shopify/polaris-tokens`.                               |
| Icons                 | Depends on `@shopify/polaris-icons`.                                |
| Styling               | CSS modules and SCSS/CSS, PostCSS, custom media, custom properties. |
| Storybook             | Storybook 8 for component development.                              |
| Accessibility testing | Storybook a11y and `axe-playwright` in dev dependencies.            |

### 10.4 License caution

The repository README says source code is under a custom license based on MIT, but with restrictions:
Polaris usage is restricted to applications that integrate or interoperate with Shopify software or
services, and icons/images have their own Polaris design guidelines license. That is more restrictive
than Twenty's AGPL/open-source framing and matters if someone intends to reuse Polaris outside the
Shopify ecosystem.

---

## 11. How to replicate the Shopify Polaris look

1. **Start from neutral admin surfaces.** Use `gray6` page backgrounds, white cards, and dark gray
   text. Do not make Shopify UI green by default.
2. **Use dark tactile primary buttons.** Primary buttons should feel pressable through bevels,
   inset shadows, and active press states.
3. **Use role tokens, not hue tokens.** Choose `success`, `warning`, `critical`, `magic`, `info`,
   `nav`, or `input` based on meaning and context.
4. **Reserve role color.** Multiple brand actions, decorative magic cards, or red non-errors are
   anti-Polaris.
5. **Build on the size ladder.** Use 4/6/8/12/16/20/24/32px spacing, with precise micro values for
   borders and dense table cells.
6. **Use Inter at Shopify weights.** `450` body, `550` medium, `650` semibold, `700` large headings.
7. **Use tabular numbers.** Currency, quantities, inventory counts, and repeated metrics must align.
8. **Make focus obvious.** Use a dedicated 2px blue focus outline with a 1px offset.
9. **Keep motion snappy and explanatory.** Use 100-250ms for most interaction, `ease` or `ease-out`,
   and avoid animation for spectacle.
10. **Make app UI feel native.** The final test is not "does this look like a nice SaaS app?" It is
    "would a merchant believe this belongs inside Shopify admin?"

---

## 12. Comparison with Cursor and Twenty

| Dimension                  | Cursor                                     | Twenty                                         | Shopify Polaris                                                               |
| -------------------------- | ------------------------------------------ | ---------------------------------------------- | ----------------------------------------------------------------------------- |
| Primary surface            | AI coding brand + editor                   | Open-source CRM product                        | Commerce admin platform                                                       |
| Visual signature           | Warm paper, custom type, orange accent     | Neutral Radix UI, indigo accent, colorful tags | Neutral admin, semantic status roles, tactile controls                        |
| Color model                | One ink + orange accent + agent pastels    | Radix P3 hues + custom gray + 27-color tags    | HSLuv 12 hues × 16 shades + role/state grammar                                |
| Typography                 | CursorGothic + Berkeley Mono + EB Garamond | Inter, 400/500/600                             | Inter, 450/550/650/700                                                        |
| Depth                      | Mostly flat / paper                        | Soft popover/modal shadows                     | Beveled buttons, inset press, tactical overlay shadows                        |
| Motion                     | Editorial spring feel                      | Tiny functional durations                      | Purposeful/responsive/snappy tokenized motion                                 |
| Dark mode                  | Product/editor dark, brand light           | Equal product light/dark themes                | Admin/web components support theme mapping; React tokens include dark partial |
| Distinctive semantic layer | Agent activity colors                      | Record tag palette                             | Merchant status roles + magic AI role + nav/input specialty roles             |
| System purpose             | Signal taste and AI productivity           | Make CRM feel calm and open                    | Make commerce workflows native, clear, and safe                               |

---

## 13. The distilled Polaris rules

1. **Every color must answer "what merchant meaning does this carry?"**
2. **Primary action is not brand decoration; it is the intended next action.**
3. **Use `magic` only when AI/automation is the concept.**
4. **Use `critical` only for blocked/error/impossible states.**
5. **Use `warning` for attention/intervention, not construction notices.**
6. **Use `caution` for incomplete or stalled, not announcements.**
7. **Use `success` for OK/completed, not promotions.**
8. **Use `nav` only for the Shopify admin menu.**
9. **Use `input` only for form-like controls.**
10. **Make buttons physically understandable.**
11. **Use focus outlines that are impossible to miss.**
12. **Prefer compact, scannable admin density over spacious marketing composition.**
13. **If building new Shopify apps, use Polaris Web Components unless there is a strong legacy reason
    to stay on React Polaris.**

---

## 14. Source notes

- `Shopify/polaris-react` README: repository archived January 6, 2026; React library deprecated;
  Web Components released October 1, 2025; monorepo contains documentation, VS Code extension,
  icons, React package, tokens, docs site, and stylelint rules.
- Polaris React docs: Polaris is the design system for the Shopify admin; docs link to Figma
  component, style, and icon libraries; GitHub repo is the open-source monorepo.
- Shopify Web Components docs: Polaris Web Components are loaded through
  `https://cdn.shopify.com/shopifycloud/polaris.js`; TypeScript types are available through
  `@shopify/polaris-types`.
- Polaris color docs: tokens abstract color values for large-scale admin changes; semantic token
  structure is element + role + prominence + state; specialty tokens must not be used outside their
  concept.
- Polaris palette docs: global palette has 12 colors with 16 shades and is built with HSLuv
  lightness for perceptual uniformity and contrast consistency.
- Polaris typography docs: hierarchy should come from weight, size, color, and positioning; mono is
  for code; tabular number styles are for numbers and currency.
- Polaris depth docs: depth communicates hierarchy, interactivity, and focus; do not overuse it or
  put depth on static elements.
- Polaris motion docs: motion should be purposeful, responsive, and snappy.
- Source token files: `colors.ts`, `size.ts`, `themes/base/font.ts`, `themes/base/text.ts`,
  `themes/base/space.ts`, `themes/base/border.ts`, `themes/base/shadow.ts`,
  `themes/base/motion.ts`, `themes/base/breakpoints.ts`, `themes/base/zIndex.ts`,
  `themes/base/color.ts`, `themes/dark.ts`.
