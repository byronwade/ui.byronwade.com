# Fluent 2 - Design System Teardown

> A full reverse-engineering of **Microsoft Fluent 2**, captured from the current
> `fluent2.microsoft.design` documentation and public Fluent UI packages. This paper mirrors the
> Cursor, Twenty, Shopify, and Atlassian design-system teardowns, but Fluent 2 is a different kind
> of subject: it is not a single product's UI kit. It is Microsoft's cross-product interaction
> language for Microsoft 365, Teams, Windows-adjacent web surfaces, Copilot experiences, React apps,
> and standards-based Web Components.
>
> **Method:** system guidance below is read from the live Fluent 2 documentation at
> `fluent2.microsoft.design`. Exact implementation values are read from current npm package
> artifacts: `@fluentui/react-components@9.74.1`, `@fluentui/tokens@1.0.0-alpha.23`,
> `@fluentui/web-components@2.6.1`, and `@fluentui/react-icons@2.0.328`. Captured June 2026.
>
> **Primary sources:** [Fluent 2](https://fluent2.microsoft.design/), public Fluent UI npm
> packages under the `@fluentui/*` scope, and the [Microsoft Fluent UI
> repository](https://github.com/microsoft/fluentui).

---

## 0. TL;DR - the design in one paragraph

Fluent 2 is **Microsoft productivity UI made systematic**: neutral, compact, accessible, adaptive,
and deeply tokenized. Its center is not a flashy brand surface. Its center is a reliable app
surface: white or dark-neutral canvases, `#242424` foreground text, quiet strokes, soft two-layer
shadows, and a product-specific brand slot. On the web theme, that brand is Microsoft blue
(`colorBrandBackground: #0f6cbd`); on Teams, the same slot becomes Teams purple
(`#5b5fc7`). Typography is **Segoe UI first**, with a compact body default of **14px / 20px**,
weights 400 / 500 / 600 / 700, and a pragmatic display ramp up to **68px / 92px**. Spacing is
small and operational: `2, 4, 6, 8, 10, 12, 16, 20, 24, 32px`, split into horizontal and vertical
tokens. Radius runs from `2px` to `40px` plus a `10000px` circular token. Motion is fast and useful
(`50-500ms`) with named easing curves. The React system is built from converged v9 packages,
`FluentProvider`, Griffel CSS-in-JS, token CSS variables, and slot-based components; the Web
Components package carries the same language into framework-agnostic custom elements. Fluent 2's
design DNA is simple: **ship dense work surfaces, choose semantic tokens, let products swap brand
themes, and make accessibility a default behavior rather than a final audit.**

---

## 1. Brand identity & philosophy

| Aspect                     | What Fluent 2 does                                                                                                                                                           |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Parent brand**           | Microsoft. Fluent 2 is the product design system behind Microsoft app experiences, especially Microsoft 365 and Teams-era productivity UI.                                   |
| **Design-system role**     | A cross-product system for designers and developers building Microsoft-style app surfaces across React, Web Components, and product-specific themes.                         |
| **Primary user context**   | Work: writing, meeting, planning, messaging, editing, searching, configuring, reviewing, approving, and now collaborating with Copilot.                                      |
| **Aesthetic stance**       | Professional, quiet, app-first. Fluent 2 is not minimal for its own sake; it is restrained so dense tools remain scannable.                                                  |
| **Interaction philosophy** | Components expose familiar Microsoft affordances: command bars, menus, buttons, dialogs, lists, tables, fields, cards, tooltips, popovers, and structured keyboard flows.    |
| **Core technical stance**  | Theme tokens are the source of truth. Products swap brand values while keeping alias token names stable. React components consume tokens through `FluentProvider` + Griffel. |
| **Design DNA in one line** | Neutral productivity chrome + product-swappable brand + dense type + small spacing + accessible components + fast, restrained motion.                                        |

### 1.1 Fluent is a family, not one skin

Fluent 2 is easiest to misunderstand if you treat it as "Microsoft blue UI." The implementation
proves the opposite. The same alias token API can produce:

| Theme             | Primary brand slot              | Background slot                    | Foreground slot                    |
| ----------------- | ------------------------------- | ---------------------------------- | ---------------------------------- |
| `webLightTheme`   | `colorBrandBackground: #0f6cbd` | `colorNeutralBackground1: #ffffff` | `colorNeutralForeground1: #242424` |
| `webDarkTheme`    | `colorBrandBackground: #115ea3` | `colorNeutralBackground1: #292929` | `colorNeutralForeground1: #ffffff` |
| `teamsLightTheme` | `colorBrandBackground: #5b5fc7` | `colorNeutralBackground1: #ffffff` | `colorNeutralForeground1: #242424` |
| `teamsDarkTheme`  | `colorBrandBackground: #4f52b2` | `colorNeutralBackground1: #292929` | `colorNeutralForeground1: #ffffff` |

That means Fluent's actual product language is the alias layer: `colorBrandBackground`,
`colorNeutralForeground1`, `colorNeutralStroke1`, `colorStatusSuccessBackground1`, etc. Blue and
purple are theme instances, not hardcoded component decisions.

### 1.2 Provenance - Fluent UI v9 and "converged" React

The current React package identifies itself as the **"Suite package for converged React
components."** In practice, "converged" means the v9 component library consolidates Microsoft UI
patterns into composable React packages under the `@fluentui/react-*` scope. The suite package
`@fluentui/react-components` pulls together packages such as:

- `@fluentui/react-button`
- `@fluentui/react-input`
- `@fluentui/react-combobox`
- `@fluentui/react-dialog`
- `@fluentui/react-menu`
- `@fluentui/react-popover`
- `@fluentui/react-table`
- `@fluentui/react-tabs`
- `@fluentui/react-tooltip`
- `@fluentui/react-toast`
- `@fluentui/react-motion`
- `@fluentui/react-nav`
- `@fluentui/react-color-picker`

The important distinction from older Microsoft UI systems is that Fluent 2 is not simply a CSS
stylesheet. It is a tokenized theme model, a React component architecture, an icon package, a Web
Components package, design guidance, and accessibility practices moving together.

### 1.3 Design DNA - the rules the system obeys

1. **Use alias tokens, not raw palette values.** Components should say `colorNeutralForeground1`,
   `colorBrandBackground`, or `colorStatusDangerBackground1`, not "blue 80" or `#0f6cbd`.
2. **Brand is a slot.** The product can be Web blue, Teams purple, or another Microsoft brand, but
   component behavior stays stable.
3. **Neutral surfaces do the work.** Most UI is white, near-white, dark gray, strokes, and text.
   Brand color is reserved for primary actions, links, selected states, and product identity.
4. **Density is intentional.** The default body style is 14px / 20px, and most spacing tokens are
   under 16px. Fluent is optimized for apps that fit a lot of work on screen.
5. **State is explicit.** Hover, pressed, selected, disabled, inverted, on-brand, accessible, and
   focus states have named tokens.
6. **Depth is functional.** Shadows appear as elevation tokens (`shadow2` through `shadow64`) for
   menus, dialogs, cards, and overlays, not as general decoration.
7. **Accessibility is structural.** Components ship with ARIA behavior, keyboard navigation, focus
   visuals, and contrast-oriented token roles.

---

## 2. Token architecture

Fluent's token model is layered:

| Layer                     | Example                                                                  | Role                                                                      |
| ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| **Global palette values** | `grey[14]`, `brand[80]`, `white`, `blackAlpha[40]`                       | Raw values used by the token pipeline.                                    |
| **Theme generation**      | `createLightTheme(brandWeb)`, `createDarkTheme(brandWeb)`                | Converts a brand ramp into a full theme.                                  |
| **Alias tokens**          | `colorNeutralForeground1`, `colorBrandBackground`, `colorNeutralStroke1` | Stable semantic API consumed by components.                               |
| **CSS variable exports**  | `tokens.colorBrandBackground -> var(--colorBrandBackground)`             | Runtime consumption surface for styling.                                  |
| **Typography utilities**  | `typographyStyles.body1`, `typographyStyles.title1`                      | Reusable type recipes from token references.                              |
| **Component slots**       | Button icon, root, content; Input root, input; Dialog surface, backdrop  | Component-level structure styled by tokens and Griffel-generated classes. |

### 2.1 The exported `tokens` object

`@fluentui/tokens` exports a large `tokens` object where every token maps to a CSS custom property:

```ts
tokens.colorNeutralForeground1 // "var(--colorNeutralForeground1)"
tokens.colorBrandBackground // "var(--colorBrandBackground)"
tokens.borderRadiusMedium // "var(--borderRadiusMedium)"
tokens.fontSizeBase300 // "var(--fontSizeBase300)"
tokens.spacingHorizontalM // "var(--spacingHorizontalM)"
tokens.shadow16 // "var(--shadow16)"
tokens.durationNormal // "var(--durationNormal)"
tokens.curveEasyEase // "var(--curveEasyEase)"
```

This design is important. Components do not need to know whether the current app is web light,
web dark, Teams light, Teams dark, high contrast, or custom branded. They read the same variable
names and let the provider install the values.

### 2.2 Theme families

The package currently exports:

```ts
teamsDarkTheme
teamsDarkV21Theme
teamsHighContrastTheme
teamsLightTheme
teamsLightV21Theme
webDarkTheme
webLightTheme
```

The presence of Teams-specific v2.1 themes and high contrast is a signal: Fluent is built for
Microsoft's real product matrix, not only for a single "default web" demonstration.

### 2.3 Theme application

In React, a Fluent app typically wraps UI in `FluentProvider`:

```tsx
import { FluentProvider, webLightTheme } from "@fluentui/react-components"

export function App() {
  return <FluentProvider theme={webLightTheme}>{/* app UI */}</FluentProvider>
}
```

The provider installs CSS variables and shared context. Descendant components consume those variables
through Griffel-generated styles and the exported token references.

---

## 3. Color system

### 3.1 Neutral foundation

The web light theme's most important neutral values:

| Token                        | Value     | Use                                     |
| ---------------------------- | --------- | --------------------------------------- |
| `colorNeutralBackground1`    | `#ffffff` | Primary app canvas / component surface. |
| `colorNeutralBackground2`    | `#fafafa` | Subtle secondary surface.               |
| `colorNeutralForeground1`    | `#242424` | Primary text.                           |
| `colorNeutralForeground2`    | `#424242` | Secondary text.                         |
| `colorNeutralStroke1`        | `#d1d1d1` | Default border.                         |
| `colorNeutralCardBackground` | `#fafafa` | Card surface.                           |

The web dark theme mirrors the roles:

| Token                     | Value     | Use                       |
| ------------------------- | --------- | ------------------------- |
| `colorNeutralBackground1` | `#292929` | Primary dark app canvas.  |
| `colorNeutralBackground2` | `#1f1f1f` | Secondary dark surface.   |
| `colorNeutralForeground1` | `#ffffff` | Primary dark text.        |
| `colorNeutralForeground2` | `#d6d6d6` | Secondary dark text.      |
| `colorNeutralStroke1`     | `#666666` | Default dark-mode border. |

Fluent's neutral design is high-utility. White and near-white surfaces give dense Microsoft apps
clarity; dark mode swaps the surface stack rather than trying to invert one-off colors.

### 3.2 Brand color

The web brand ramp resolves into these common interactive aliases:

| Token                           | Web light value | Web dark value | Role                     |
| ------------------------------- | --------------- | -------------- | ------------------------ |
| `colorBrandBackground`          | `#0f6cbd`       | `#115ea3`      | Primary filled action.   |
| `colorBrandBackgroundHover`     | `#115ea3`       | `#0f6cbd`      | Hovered brand action.    |
| `colorBrandBackgroundPressed`   | `#0c3b5e`       | `#0c3b5e`      | Pressed brand action.    |
| `colorBrandForeground1`         | `#0f6cbd`       | `#479ef5`      | Brand foreground / icon. |
| `colorBrandForegroundLink`      | brand semantic  | brand semantic | Link color.              |
| `colorNeutralForegroundOnBrand` | `#ffffff`       | `#ffffff`      | Text over brand fill.    |

The Teams brand theme uses the same aliases with Teams purple:

| Token                   | Teams light value | Teams dark value |
| ----------------------- | ----------------- | ---------------- |
| `colorBrandBackground`  | `#5b5fc7`         | `#4f52b2`        |
| `colorBrandForeground1` | `#5b5fc7`         | `#7f85f5`        |

This is the core Fluent move: component code keeps the token, product identity changes through the
theme.

### 3.3 Status colors

Status is not a random badge palette. Fluent uses named status tokens:

| Status  | Light background token/value             | Dark background token/value              |
| ------- | ---------------------------------------- | ---------------------------------------- |
| Success | `colorStatusSuccessBackground1: #f1faf1` | `colorStatusSuccessBackground1: #052505` |
| Warning | `colorStatusWarningBackground1: #fff9f5` | `colorStatusWarningBackground1: #4a1e04` |
| Danger  | `colorStatusDangerBackground1: #fdf3f4`  | `colorStatusDangerBackground1: #3b0509`  |

The token types expose richer status sets:

- `colorStatusSuccessBackground1/2/3`
- `colorStatusSuccessForeground1/2/3/Inverted`
- `colorStatusSuccessBorderActive/1/2`
- Equivalent warning and danger groups.

### 3.4 Palette colors and people colors

Fluent also exports broader palette groups for non-status categorization:

- Red
- Green
- Dark orange
- Yellow
- Berry
- Marigold
- Light green
- Blue
- Royal blue
- Cornflower
- Navy
- Lavender
- Purple
- Grape
- Lilac
- Plum
- Pink
- Magenta
- Cranberry
- Pumpkin
- Peach
- Gold
- Brass
- Brown
- Forest
- Seafoam
- Dark green
- Light teal
- Teal
- Steel
- Mink
- Platinum
- Anchor
- Beige

These palettes are for avatars, tags, charts, and categorical UI. They are not a license to paint
primary UI with arbitrary color. Primary app chrome should still run through neutral, brand, and
status aliases.

### 3.5 Focus colors

Focus is explicit:

| Token               | Light value | Dark value |
| ------------------- | ----------- | ---------- |
| `colorStrokeFocus1` | `#ffffff`   | `#000000`  |
| `colorStrokeFocus2` | `#000000`   | `#ffffff`  |

The two-token focus ring lets Fluent create a visible dual-ring treatment across mixed light,
dark, brand, and image-adjacent surfaces.

---

## 4. Typography

### 4.1 Font families

The web theme exposes:

```ts
fontFamilyBase: "'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif"

fontFamilyMonospace: "Consolas, 'Courier New', Courier, monospace"

fontFamilyNumeric: "Bahnschrift, 'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif"
```

Teams changes the base stack slightly:

```ts
;(-apple - system,
  BlinkMacSystemFont,
  "Segoe UI",
  system - ui,
  "Apple Color Emoji",
  "Segoe UI Emoji",
  sans - serif)
```

The key signal is that Fluent is not chasing a boutique brand typeface. It uses platform-native
Microsoft typography: Segoe UI, system fallbacks, and practical numeric and monospace stacks.

### 4.2 Size and line-height ramp

| Token              | Size | Line-height token    | Line height |
| ------------------ | ---- | -------------------- | ----------- |
| `fontSizeBase100`  | 10px | `lineHeightBase100`  | 14px        |
| `fontSizeBase200`  | 12px | `lineHeightBase200`  | 16px        |
| `fontSizeBase300`  | 14px | `lineHeightBase300`  | 20px        |
| `fontSizeBase400`  | 16px | `lineHeightBase400`  | 22px        |
| `fontSizeBase500`  | 20px | `lineHeightBase500`  | 28px        |
| `fontSizeBase600`  | 24px | `lineHeightBase600`  | 32px        |
| `fontSizeHero700`  | 28px | `lineHeightHero700`  | 36px        |
| `fontSizeHero800`  | 32px | `lineHeightHero800`  | 40px        |
| `fontSizeHero900`  | 40px | `lineHeightHero900`  | 52px        |
| `fontSizeHero1000` | 68px | `lineHeightHero1000` | 92px        |

Fluent's center of gravity is `fontSizeBase300: 14px` and `lineHeightBase300: 20px`. That is the
default `body1` style and explains the compact Microsoft app feeling.

### 4.3 Weights

| Token                | Value |
| -------------------- | ----- |
| `fontWeightRegular`  | 400   |
| `fontWeightMedium`   | 500   |
| `fontWeightSemibold` | 600   |
| `fontWeightBold`     | 700   |

Fluent uses semibold more openly than Cursor or this repo's editorial design DNA. That is correct
for Microsoft surfaces: labels, section headers, command emphasis, and dialog titles benefit from a
clear operational hierarchy.

### 4.4 Typography styles

The exported `typographyStyles` recipes include:

| Style            | Font size | Weight | Line height |
| ---------------- | --------- | ------ | ----------- |
| `caption2`       | 10px      | 400    | 14px        |
| `caption2Strong` | 10px      | 600    | 14px        |
| `caption1`       | 12px      | 400    | 16px        |
| `caption1Strong` | 12px      | 600    | 16px        |
| `body1`          | 14px      | 400    | 20px        |
| `body1Strong`    | 14px      | 600    | 20px        |
| `body1Stronger`  | 14px      | 700    | 20px        |
| `body2`          | 16px      | 400    | 22px        |
| `subtitle2`      | 16px      | 600    | 22px        |
| `subtitle1`      | 20px      | 600    | 28px        |
| `title3`         | 24px      | 600    | 32px        |
| `title2`         | 28px      | 600    | 36px        |
| `title1`         | 32px      | 600    | 40px        |
| `largeTitle`     | 40px      | 600    | 52px        |
| `display`        | 68px      | 600    | 92px        |

The type system is intentionally boring in the best way: small, predictable, legible, and easy to
map to product surfaces.

---

## 5. Spacing and layout

### 5.1 Spacing scale

Fluent uses one internal scale, then exports horizontal and vertical aliases:

| Internal key | Value  |
| ------------ | ------ |
| `none`       | `0`    |
| `xxs`        | `2px`  |
| `xs`         | `4px`  |
| `sNudge`     | `6px`  |
| `s`          | `8px`  |
| `mNudge`     | `10px` |
| `m`          | `12px` |
| `l`          | `16px` |
| `xl`         | `20px` |
| `xxl`        | `24px` |
| `xxxl`       | `32px` |

Exported tokens:

```ts
spacingHorizontalXXS // 2px
spacingHorizontalXS // 4px
spacingHorizontalSNudge // 6px
spacingHorizontalS // 8px
spacingHorizontalMNudge // 10px
spacingHorizontalM // 12px
spacingHorizontalL // 16px
spacingHorizontalXL // 20px
spacingHorizontalXXL // 24px
spacingHorizontalXXXL // 32px
```

The vertical tokens mirror this exact set.

### 5.2 Why the nudge tokens matter

`6px` and `10px` are deliberate. Fluent needs buttons, inputs, list rows, menu items, icon gaps, and
field chrome to align optically, not only mathematically. Nudge tokens let components avoid awkward
"too tight at 4px, too loose at 8px" compromises while staying in the system.

### 5.3 Layout character

Fluent layouts tend to be:

- Compact, not airy.
- Left-aligned for work surfaces.
- Organized around lists, grids, cards, panes, command bars, and forms.
- Built from small repeated gaps rather than large editorial whitespace.
- Responsive through component behavior and app shell patterns, not through dramatic marketing
  breakpoints.

This differs sharply from landing-page systems. Fluent's spacing is for recurring daily work.

---

## 6. Shape, stroke, and radius

### 6.1 Radius tokens

| Token                  | Value     |
| ---------------------- | --------- |
| `borderRadiusNone`     | `0`       |
| `borderRadiusSmall`    | `2px`     |
| `borderRadiusMedium`   | `4px`     |
| `borderRadiusLarge`    | `6px`     |
| `borderRadiusXLarge`   | `8px`     |
| `borderRadius2XLarge`  | `12px`    |
| `borderRadius3XLarge`  | `16px`    |
| `borderRadius4XLarge`  | `24px`    |
| `borderRadius5XLarge`  | `32px`    |
| `borderRadius6XLarge`  | `40px`    |
| `borderRadiusCircular` | `10000px` |

The everyday Fluent radius is small: `4px` for normal controls, `6-8px` for larger surfaces, and
fully circular values for pills, avatars, and round icon buttons.

### 6.2 Stroke tokens

Common stroke aliases include:

- `colorNeutralStroke1`
- `colorNeutralStroke1Hover`
- `colorNeutralStroke1Pressed`
- `colorNeutralStroke1Selected`
- `colorNeutralStroke2`
- `colorNeutralStroke3`
- `colorNeutralStroke4`
- `colorNeutralStrokeSubtle`
- `colorNeutralStrokeAccessible`
- `colorBrandStroke1`
- `colorBrandStroke2`
- `colorStrokeFocus1`
- `colorStrokeFocus2`

The "accessible" stroke token is worth calling out. Fluent distinguishes between decorative strokes
and strokes that must carry state information with enough contrast.

### 6.3 Shape personality

Fluent 2 is softer than classic Windows UI but not bubbly. The system's default control geometry
feels like:

- Buttons: small radius, crisp box, sometimes pill for special cases.
- Inputs: rectangular with subtle radius and visible stroke.
- Cards: lightly rounded, shadow or stroke depending on elevation.
- Avatars/personas: circular.
- Tags/badges: pill or rounded rectangle depending on component.

This is Microsoft's broad-product compromise: approachable without becoming playful.

---

## 7. Elevation and depth

### 7.1 Shadow tokens

Fluent shadow tokens are generated from ambient and key shadow colors:

| Token      | Formula in light theme                                   |
| ---------- | -------------------------------------------------------- |
| `shadow2`  | `0 0 2px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.14)`   |
| `shadow4`  | `0 0 2px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.14)`   |
| `shadow8`  | `0 0 2px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.14)`   |
| `shadow16` | `0 0 2px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.14)`  |
| `shadow28` | `0 0 8px rgba(0,0,0,0.12), 0 14px 28px rgba(0,0,0,0.14)` |
| `shadow64` | `0 0 8px rgba(0,0,0,0.12), 0 32px 64px rgba(0,0,0,0.14)` |

Dark mode uses stronger shadow colors:

```ts
colorNeutralShadowAmbient: rgba(0, 0, 0, 0.24)
colorNeutralShadowKey: rgba(0, 0, 0, 0.28)
```

Brand shadows also exist:

```ts
shadow2Brand
shadow4Brand
shadow8Brand
shadow16Brand
shadow28Brand
shadow64Brand
```

### 7.2 Elevation usage

| Surface type              | Likely depth token      | Rationale                                |
| ------------------------- | ----------------------- | ---------------------------------------- |
| Flat app canvas           | No shadow               | Work surface should stay calm.           |
| Card / subtle container   | Stroke or `shadow2`     | Slight separation.                       |
| Hovered or raised card    | `shadow4` / `shadow8`   | Indicates interactivity or layer change. |
| Popover / menu            | `shadow16`              | Floating layer above page.               |
| Dialog / panel / teaching | `shadow28` / `shadow64` | Stronger modal hierarchy.                |

Fluent depth is utilitarian. It explains stack order and interaction context.

---

## 8. Motion

### 8.1 Duration tokens

| Token               | Value   |
| ------------------- | ------- |
| `durationUltraFast` | `50ms`  |
| `durationFaster`    | `100ms` |
| `durationFast`      | `150ms` |
| `durationNormal`    | `200ms` |
| `durationGentle`    | `250ms` |
| `durationSlow`      | `300ms` |
| `durationSlower`    | `400ms` |
| `durationUltraSlow` | `500ms` |

This is an app-motion scale. Most interactions should land between 100ms and 250ms. Longer values
are reserved for larger overlays, teaching moments, or transitions that need comprehension.

### 8.2 Curve tokens

| Token                | Value                         | Feel                        |
| -------------------- | ----------------------------- | --------------------------- |
| `curveAccelerateMax` | `cubic-bezier(0.9,0.1,1,0.2)` | Fast exit.                  |
| `curveAccelerateMid` | `cubic-bezier(1,0,1,1)`       | Strong acceleration.        |
| `curveAccelerateMin` | `cubic-bezier(0.8,0,0.78,1)`  | Mild acceleration.          |
| `curveDecelerateMax` | `cubic-bezier(0.1,0.9,0.2,1)` | Strong entrance.            |
| `curveDecelerateMid` | `cubic-bezier(0,0,0,1)`       | Direct deceleration.        |
| `curveDecelerateMin` | `cubic-bezier(0.33,0,0.1,1)`  | Mild entrance.              |
| `curveEasyEaseMax`   | `cubic-bezier(0.8,0,0.2,1)`   | Larger expressive movement. |
| `curveEasyEase`      | `cubic-bezier(0.33,0,0.67,1)` | General smooth transition.  |
| `curveLinear`        | `cubic-bezier(0,0,1,1)`       | Constant speed.             |

### 8.3 Motion personality

Fluent motion should feel:

- Fast enough for repeated work.
- Clear enough to explain where surfaces came from.
- Calm enough not to distract in enterprise applications.
- Respectful of accessibility preferences such as reduced motion.

Motion in Fluent is not cinematic. It is state communication.

---

## 9. Components and primitives

### 9.1 React architecture

The main React package:

```json
{
  "name": "@fluentui/react-components",
  "version": "9.74.1",
  "description": "Suite package for converged React components",
  "sideEffects": false
}
```

Key architectural dependencies:

- `@griffel/react` for CSS-in-JS styling.
- `@fluentui/react-provider` for theme context.
- `@fluentui/react-tabster` for keyboard focus and navigation infrastructure.
- `@fluentui/react-utilities` for shared component utilities.
- Many component packages under `@fluentui/react-*`.

The React component pattern is usually:

1. A public component receives props.
2. A state hook normalizes props and slots.
3. A styles hook applies Griffel classes.
4. A render function outputs slot structure.

This gives Fluent components predictable slot composition while preserving accessibility behavior.

### 9.2 Web Components architecture

The Web Components package:

```json
{
  "name": "@fluentui/web-components",
  "version": "2.6.1",
  "description": "A library of Fluent Web Components"
}
```

It depends on FAST foundations:

- `@microsoft/fast-colors`
- `@microsoft/fast-element`
- `@microsoft/fast-foundation`
- `@microsoft/fast-web-utilities`

This matters because Fluent 2 is not React-only. The design language can be carried into standards
based components for non-React applications.

### 9.3 Button behavior

Fluent buttons are a good compressed summary of the whole system.

Expected appearances include:

- Primary: brand-filled, white text, used for the main action.
- Secondary/default: neutral surface and stroke, used for common actions.
- Subtle: transparent or low-chrome, used in command bars or dense surfaces.
- Transparent: icon or text actions that should not compete with content.

Expected states:

- Rest
- Hover
- Pressed
- Focus-visible
- Disabled
- Selected / checked where applicable

The implementation should choose tokens like:

```ts
tokens.colorBrandBackground
tokens.colorBrandBackgroundHover
tokens.colorBrandBackgroundPressed
tokens.colorNeutralForegroundOnBrand
tokens.colorNeutralStroke1
tokens.colorSubtleBackgroundHover
tokens.borderRadiusMedium
tokens.spacingHorizontalM
```

The point is not a "blue button." The point is a token-backed action grammar.

### 9.4 Data-heavy components

Fluent includes packages for tables, lists, trees, menus, overflow, virtualizer, nav, and search.
That tells you what the system is optimized for: applications where information density, keyboard
navigation, and predictable scanning matter.

Important work-surface components:

- `Table`
- `DataGrid`-style table patterns through table packages and app composition
- `List`
- `Tree`
- `Menu`
- `Toolbar`
- `Nav`
- `Breadcrumb`
- `Overflow`
- `SearchBox`
- `Combobox`
- `Select`
- `TagPicker`
- `Dialog`
- `Drawer`
- `Popover`
- `TeachingPopover`

### 9.5 Icons

`@fluentui/react-icons@2.0.328` provides Fluent icon components. The icon system's practical role:

- Keep Microsoft surfaces visually consistent.
- Provide regular and filled variants.
- Support common sizes and accessible labels through component usage.
- Avoid ad hoc SVG drawing in application code.

In Fluent UI, icon buttons should use the icon package unless a product-specific glyph is required.

---

## 10. Accessibility and inclusive design

Fluent's accessibility posture is embedded in naming and architecture:

| Mechanism                         | Why it matters                                                                |
| --------------------------------- | ----------------------------------------------------------------------------- |
| Focus tokens                      | Dual focus colors adapt across light/dark and mixed surfaces.                 |
| `react-tabster`                   | Keyboard navigation is treated as infrastructure, not a one-off behavior.     |
| Semantic component packages       | Dialogs, menus, comboboxes, popovers, tabs, and tooltips carry ARIA patterns. |
| High contrast theme               | `teamsHighContrastTheme` exists as a first-class export.                      |
| `colorNeutralStrokeAccessible`    | Some strokes must carry state with contrast, not merely decoration.           |
| Disabled foreground/background    | Disabled states have named foreground and background tokens.                  |
| Inverted and on-brand foregrounds | Text-on-fill and text-on-dark are explicit token roles.                       |

### 10.1 Accessibility replication rules

If you are building a Fluent-like component:

1. Use native elements first.
2. Preserve focus-visible treatment.
3. Ensure hover is never the only state indicator.
4. Use `aria-*` only when semantic HTML is insufficient.
5. Make disabled state programmatic and visual.
6. Keep text contrast controlled by token roles.
7. Support keyboard activation and escape/arrow behavior for overlays and menus.
8. Respect reduced-motion settings.

---

## 11. Implementation architecture

### 11.1 Package map

| Package                      | Version          | Role                                            |
| ---------------------------- | ---------------- | ----------------------------------------------- |
| `@fluentui/react-components` | `9.74.1`         | Converged React component suite.                |
| `@fluentui/tokens`           | `1.0.0-alpha.23` | Theme tokens, global values, and theme objects. |
| `@fluentui/web-components`   | `2.6.1`          | Fluent Web Components built on FAST.            |
| `@fluentui/react-icons`      | `2.0.328`        | Fluent React icon set.                          |

### 11.2 Styling stack

The React package uses Griffel:

```json
"@griffel/react": "^1.5.32"
```

Griffel gives Fluent:

- Atomic CSS generation.
- Theming through CSS variables.
- Build-time extraction support through package metadata.
- Component-scoped style hooks without global CSS leakage.

### 11.3 Provider and themes

The provider model keeps app theme concerns above components:

```tsx
import {
  Button,
  FluentProvider,
  teamsLightTheme,
  webLightTheme,
} from "@fluentui/react-components"

export function ProductSurface({ product }: { product: "web" | "teams" }) {
  const theme = product === "teams" ? teamsLightTheme : webLightTheme

  return (
    <FluentProvider theme={theme}>
      <Button appearance="primary">Continue</Button>
    </FluentProvider>
  )
}
```

The button should not change implementation. The theme does the brand work.

### 11.4 Custom brand themes

Because theme generation accepts a brand ramp, a product can provide a custom `BrandVariants` map:

```ts
type Brands =
  | 10
  | 20
  | 30
  | 40
  | 50
  | 60
  | 70
  | 80
  | 90
  | 100
  | 110
  | 120
  | 130
  | 140
  | 150
  | 160
type BrandVariants = Record<Brands, string>
```

That sixteen-step ramp is the basis for producing brand foregrounds, backgrounds, links, strokes,
and selected states across light and dark modes.

---

## 12. Copilot and AI layer

Fluent 2 now sits under Microsoft Copilot-era UI. The important design implication is that AI is not
treated as a separate neon product style. It is layered onto the same productivity surfaces.

### 12.1 AI surface pattern

A Fluent-like Copilot surface generally needs:

- A neutral chat or panel canvas.
- Strong input affordance.
- Clear source/citation cards.
- Suggested prompt chips.
- Streaming/progress states.
- Human-readable status messaging.
- Explicit destructive-action confirmation.
- Review-before-apply flows.

### 12.2 Visual treatment

The most Fluent-compatible AI visual treatment is:

- Neutral background first.
- Brand or accent only for primary actions and active affordances.
- Subtle elevation for generated cards, references, or popovers.
- Compact typography for prompts and source metadata.
- Icons from the Fluent icon set.
- Status tokens for success, warning, and danger.

Avoid making Copilot surfaces into a separate purple-gradient world unless the product brand
explicitly requires it. Fluent's strength is coherence across work contexts.

### 12.3 AI interaction rules

1. **Show state.** Loading, generating, applying, reviewing, failed, and completed states need
   distinct UI.
2. **Keep control visible.** Users need stop, retry, edit, copy, apply, and dismiss affordances.
3. **Cite when content comes from documents or web sources.**
4. **Do not hide risk.** Destructive generated actions require confirmation.
5. **Use compact suggestions.** Prompt chips should be helpful, not marketing copy.
6. **Preserve app context.** AI panels should feel attached to the document, meeting, file, issue,
   or workflow they operate on.

---

## 13. How to replicate Fluent 2 in a new product

### 13.1 Start with the theme contract

Define aliases first:

```ts
const fluentLikeTheme = {
  colorNeutralBackground1: "#ffffff",
  colorNeutralBackground2: "#fafafa",
  colorNeutralForeground1: "#242424",
  colorNeutralForeground2: "#424242",
  colorNeutralStroke1: "#d1d1d1",
  colorBrandBackground: "#0f6cbd",
  colorBrandBackgroundHover: "#115ea3",
  colorBrandBackgroundPressed: "#0c3b5e",
  colorNeutralForegroundOnBrand: "#ffffff",
  borderRadiusMedium: "4px",
  spacingHorizontalM: "12px",
  spacingVerticalM: "12px",
  fontSizeBase300: "14px",
  lineHeightBase300: "20px",
}
```

Then build components against aliases, not literals.

### 13.2 Use the right typography defaults

For app chrome:

```css
font-family:
  "Segoe UI",
  "Segoe UI Web (West European)",
  -apple-system,
  BlinkMacSystemFont,
  Roboto,
  "Helvetica Neue",
  sans-serif;
font-size: 14px;
line-height: 20px;
font-weight: 400;
```

For labels and section titles, use semibold sparingly:

```css
font-weight: 600;
```

For code:

```css
font-family: Consolas, "Courier New", Courier, monospace;
```

For numbers:

```css
font-family:
  Bahnschrift,
  "Segoe UI",
  "Segoe UI Web (West European)",
  -apple-system,
  BlinkMacSystemFont,
  Roboto,
  "Helvetica Neue",
  sans-serif;
```

### 13.3 Use compact spacing

Use:

```txt
2 / 4 / 6 / 8 / 10 / 12 / 16 / 20 / 24 / 32px
```

Typical mappings:

| Use case              | Token size |
| --------------------- | ---------- |
| Icon-text gap         | 4-8px      |
| Button horizontal pad | 12px       |
| Button vertical pad   | 6-8px      |
| Field internal gap    | 8-12px     |
| Menu item gap         | 8-12px     |
| Card padding          | 12-16px    |
| Panel padding         | 16-24px    |
| Page section gap      | 24-32px    |

### 13.4 Component recipe: Fluent-like button

```tsx
import { tokens } from "@fluentui/react-components"

const primaryButton = {
  alignItems: "center",
  backgroundColor: tokens.colorBrandBackground,
  borderColor: tokens.colorBrandBackground,
  borderRadius: tokens.borderRadiusMedium,
  color: tokens.colorNeutralForegroundOnBrand,
  columnGap: tokens.spacingHorizontalXS,
  display: "inline-flex",
  fontFamily: tokens.fontFamilyBase,
  fontSize: tokens.fontSizeBase300,
  fontWeight: tokens.fontWeightSemibold,
  lineHeight: tokens.lineHeightBase300,
  minHeight: "32px",
  paddingInline: tokens.spacingHorizontalM,
  transitionDuration: tokens.durationFaster,
  transitionTimingFunction: tokens.curveEasyEase,
}
```

The above is not a full Fluent implementation, but the decisions match the system: semantic brand
fill, semibold 14px text, medium radius, compact spacing, and fast motion.

### 13.5 Component recipe: Fluent-like card

```tsx
const card = {
  backgroundColor: tokens.colorNeutralCardBackground,
  borderColor: tokens.colorNeutralStroke1,
  borderRadius: tokens.borderRadiusXLarge,
  boxShadow: tokens.shadow2,
  color: tokens.colorNeutralForeground1,
  padding: tokens.spacingVerticalL,
}
```

Cards should not be decorative slabs. They should group work, selections, files, people, or content
summaries.

### 13.6 Component recipe: Fluent-like field

```tsx
const inputRoot = {
  alignItems: "center",
  backgroundColor: tokens.colorNeutralBackground1,
  borderColor: tokens.colorNeutralStroke1,
  borderRadius: tokens.borderRadiusMedium,
  color: tokens.colorNeutralForeground1,
  display: "inline-flex",
  minHeight: "32px",
  paddingInline: tokens.spacingHorizontalM,
}
```

Fields should preserve visible labels, helper text, validation text, and keyboard focus.

---

## 14. Comparison with the other teardowns

| System       | Core visual idea                                                | Accent logic                                                 | Type personality                          | Layout density                       |
| ------------ | --------------------------------------------------------------- | ------------------------------------------------------------ | ----------------------------------------- | ------------------------------------ |
| Cursor       | Warm editorial paper + one orange accent                        | One fixed orange brand accent                                | Custom grotesque + mono + editorial serif | Spacious marketing, dark IDE product |
| Twenty       | Notion-like neutral CRM + Radix color labels                    | One indigo accent + many Radix tag colors                    | Inter, compact, open-source SaaS          | Dense CRM app                        |
| Shopify      | Commerce admin/product language through Polaris                 | Shopify green plus commerce-status semantics                 | Practical admin typography                | Dense merchant operations            |
| Atlassian    | Teamwork UI with intent-based tokens and collaboration patterns | Atlassian Blue plus semantic intent roles                    | Atlassian Sans/Mono                       | Dense enterprise collaboration       |
| **Fluent 2** | Microsoft productivity surfaces with product-swappable branding | Brand slot changes per product: Web blue, Teams purple, etc. | Segoe UI/system, compact and pragmatic    | Very dense work UI                   |

Fluent 2 is closest to Atlassian in maturity and enterprise scope, but its brand strategy is more
federated. Atlassian has Atlassian Blue as a strong umbrella; Fluent has Microsoft-wide neutral
grammar plus product-specific brand ramps.

---

## 15. Distilled Fluent 2 rules

If an AI agent wanted to produce Fluent-like UI, these are the rules:

1. Use **Segoe UI/system typography**, not Inter by default.
2. Use **14px / 20px** as the main body/UI text style.
3. Use weights **400, 500, 600, 700**; use semibold for labels, headers, and important controls.
4. Build the surface from **neutral aliases**: foreground, background, stroke, card, disabled,
   overlay.
5. Treat brand color as a **theme slot**, not a hardcoded blue.
6. Use **semantic status tokens** for success, warning, and danger.
7. Keep spacing compact: **2, 4, 6, 8, 10, 12, 16, 20, 24, 32px**.
8. Use small everyday radii: **4px** default, **6-8px** for larger surfaces, circular for avatars
   and pills.
9. Use two-layer shadows from `shadow2` through `shadow64`; do not invent glow effects.
10. Motion should be fast: **100-250ms** for most UI, named curves for entrances/exits.
11. Buttons, inputs, menus, dialogs, popovers, tabs, and tables must support keyboard behavior.
12. Focus rings must be visible on light, dark, brand, and mixed surfaces.
13. Use Fluent icons instead of custom SVGs when a standard symbol exists.
14. Use `FluentProvider` and theme objects in React; do not pass colors component by component.
15. Keep AI/Copilot UI inside the same system: neutral panels, source cards, compact suggestions,
    visible state, explicit apply/retry/dismiss controls.

---

## 16. Source notes

### 16.1 Documentation

- [Fluent 2](https://fluent2.microsoft.design/) - live design-system documentation.
- [Microsoft Fluent UI GitHub](https://github.com/microsoft/fluentui) - source repository for
  Fluent UI packages.

### 16.2 Package artifacts inspected

| Package                      | Version          | Notes                                                                    |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------ |
| `@fluentui/react-components` | `9.74.1`         | Converged React component suite; package dependency map inspected.       |
| `@fluentui/tokens`           | `1.0.0-alpha.23` | Token files inspected for color, spacing, type, radius, shadows, motion. |
| `@fluentui/web-components`   | `2.6.1`          | FAST-based Web Components package metadata inspected.                    |
| `@fluentui/react-icons`      | `2.0.328`        | React icon package version verified.                                     |

### 16.3 Exact token files inspected

- `@fluentui/tokens/lib/global/fonts.js`
- `@fluentui/tokens/lib/global/spacings.js`
- `@fluentui/tokens/lib/global/borderRadius.js`
- `@fluentui/tokens/lib/global/durations.js`
- `@fluentui/tokens/lib/global/curves.js`
- `@fluentui/tokens/lib/utils/shadows.js`
- `@fluentui/tokens/lib/alias/lightColor.js`
- `@fluentui/tokens/lib/alias/darkColor.js`
- `@fluentui/tokens/lib/themes/web/lightTheme.js`
- `@fluentui/tokens/lib/themes/web/darkTheme.js`
- `@fluentui/tokens/dist/index.d.ts`

### 16.4 Values to re-check if updating later

These are package-derived and may change:

- Current package versions.
- `webLightTheme` and `webDarkTheme` alias values.
- `teamsLightTheme` and `teamsDarkTheme` brand values.
- Typography ramp.
- Component package list inside `@fluentui/react-components`.
- Web Components package architecture as Fluent's FAST relationship evolves.
