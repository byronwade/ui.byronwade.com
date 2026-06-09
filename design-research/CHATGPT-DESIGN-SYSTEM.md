# ChatGPT / OpenAI Apps SDK UI - Design System Teardown

> A research teardown of the public-facing **ChatGPT design language** and the newer
> **OpenAI Apps SDK UI** package. Unlike Shopify Polaris, Atlassian Design System, Fluent 2, or
> Vercel Geist, ChatGPT does not expose a complete public internal product design system for the main
> ChatGPT web/mobile app. The most concrete public evidence is split across OpenAI's brand
> guidelines, ChatGPT Help Center documentation for theme/accent controls, the OpenAI Apps SDK
> product launch, and the published `@openai/apps-sdk-ui` package for building native-feeling apps
> inside ChatGPT.
>
> **Method:** official OpenAI brand guidance was read from `openai.com/brand`; ChatGPT visual
> settings were read from the OpenAI Help Center article on visual experience; platform intent was
> read from OpenAI's Apps in ChatGPT announcement and Apps SDK Help Center article; implementation
> evidence was inspected from the public `openai/apps-sdk-ui` GitHub repository and the published
> `@openai/apps-sdk-ui@0.2.2` npm package. Package artifacts inspected locally: `package.json`,
> `dist/es/styles/variables-primitive.css`, `variables-semantic.css`, `variables-components.css`,
> `base.css`, and `dist/es/lib/theme.js`. Captured June 2026.
>
> **Primary sources:** [OpenAI Design Guidelines](https://openai.com/brand/),
> [ChatGPT visual experience Help Center](https://help.openai.com/en/articles/11958281-updating-your-visual-experience-on-chatgpt),
> [Introducing apps in ChatGPT](https://openai.com/index/introducing-apps-in-chatgpt/),
> [Build with the Apps SDK](https://help.openai.com/en/articles/12515353-build-with-the-apps-sdk),
> [openai/apps-sdk-ui GitHub](https://github.com/openai/apps-sdk-ui),
> [Apps SDK UI Storybook/docs](https://openai.github.io/apps-sdk-ui/).

---

## 0. TL;DR - the design in one paragraph

ChatGPT's design language is **conversational, neutral, rounded, and host-first**. The product UI is
not trying to feel like a dashboard, CRM, issue tracker, or commerce admin. Its central object is the
conversation: messages, composer, generated artifacts, files, tools, apps, code, voice, and
transient reasoning/status. The OpenAI brand layer adds geometric precision with human warmth:
OpenAI Sans, circular forms, wide whitespace, black/white restraint, and a logo philosophy that
balances fluid human-centered circles with technical right angles. The Apps SDK UI package makes the
product language concrete for embedded apps: Tailwind 4 tokens, Radix primitives, semantic color
roles, light/dark `data-theme`, component variables, 4px spacing, rounded controls, restrained
shadows, and chat-specific tokens such as `--chat-max-width: 800px`,
`--composer-radius: var(--radius-4xl)`, and `--user-message-background-color`. The design DNA is:
**make every interface feel subordinate to the conversation, keep the surface quiet, use semantic
status color sparingly, treat the composer as the core control, and make third-party UI feel native
inside ChatGPT rather than like an iframe pasted into a chat.**

---

## 1. Brand identity & philosophy

| Aspect                     | What ChatGPT / OpenAI does                                                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Company / product**      | OpenAI builds ChatGPT, API products, agents, apps, and developer tools.                                                                      |
| **Primary user context**   | Conversational task work: asking, writing, coding, searching, creating, analyzing, planning, browsing apps/tools, and acting through agents. |
| **Aesthetic stance**       | Neutral, round, calm, restrained, lightweight, high whitespace, low ornament.                                                                |
| **Brand philosophy**       | Human warmth plus technical precision. OpenAI describes the Blossom as circles plus right angles, capturing humanity and technology.         |
| **Design-system evidence** | Public brand docs and the Apps SDK UI package; the main ChatGPT internal system is not fully public.                                         |
| **Product framing**        | ChatGPT is both assistant and platform: Apps SDK lets developers build logic and interface that run inside ChatGPT.                          |
| **Design DNA in one line** | Conversation-first UI + rounded neutral surfaces + semantic app tokens + theme/accent personalization + native embedded app constraints.     |

### 1.1 The system is host-first

ChatGPT is not just a screen with components. It is a host environment. Every component competes with
the conversation itself, so the system's most important rule is **do not overtake the thread**.

That explains several public patterns:

- Chat surfaces are width-constrained instead of dashboard-wide.
- The composer is large, rounded, persistent, and visually elevated.
- Assistant/user messages remain the primary reading surface.
- App UI appears inside the conversation and must feel contextually attached to the response.
- The Apps SDK UI package exposes chat-specific component tokens instead of only generic app tokens.

### 1.2 OpenAI brand: geometry with warmth

OpenAI's brand page says the wordmark is built with OpenAI Sans and that the Blossom symbol combines
fluid, warm circles with right angles that introduce technical structure. This is visible in the
product language: rounded controls, circular affordances, simple monochrome, and minimal decorative
effects.

| Brand rule                                                                          | Design-system implication                                                  |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| OpenAI Sans has rounded, approachable character.                                    | UI should feel warm and low-friction, not mechanical.                      |
| Logo/wordmark must not be distorted, textured, recolored, or used in busy contexts. | Brand application is strict and quiet. Avoid ornamental logo treatment.    |
| Blossom needs open space.                                                           | The system values breath, isolation, and clarity around important objects. |
| Typography includes tabular figures and case-sensitive punctuation.                 | The brand needs both friendly copy and precise technical/product data.     |

### 1.3 ChatGPT visual personalization

The Help Center confirms that ChatGPT supports:

| Setting                        | Meaning                                                                                        |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| **Theme**                      | System, dark, or light appearance, set per device/platform.                                    |
| **Accent color**               | Applies to elements such as user conversation bubbles, the Voice button, and highlighted text. |
| **Platform-specific settings** | Web, iOS, and Android visual settings do not necessarily sync across platforms.                |

This matters: ChatGPT has moved from a single fixed green accent toward **user-controlled accent
color**. The design system therefore needs to support accent substitution without breaking
readability, focus, message ownership, or tool/app affordances.

---

## 2. Product context

| Surface                   | Visual/interaction need                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| **Chat thread**           | Long reading lane, source/code/media blocks, message actions, streaming states.                          |
| **Composer**              | Always-visible intent capture, attachments/tools/voice/model selection, rounded high-affordance control. |
| **Sidebar/history**       | Dense but quiet navigation, conversation titles, projects, GPTs/apps/connectors.                         |
| **Canvas/artifacts/code** | Split or expanded work surfaces that still attach to the conversation.                                   |
| **Voice**                 | Accent-aware, modal/spatial, lower text density, high immediacy.                                         |
| **Apps in ChatGPT**       | Third-party interactive UI rendered inside the thread, governed by host trust and visual consistency.    |
| **Developer docs / SDK**  | Technical precision, examples, code, setup paths, component library.                                     |

### 2.1 ChatGPT is now an app platform

OpenAI's Apps in ChatGPT announcement says the Apps SDK builds on MCP and lets ChatGPT connect to
external tools and data. The Help Center says the SDK lets developers design both the logic and the
interface of an app that runs inside ChatGPT.

This shifts the design problem:

1. ChatGPT must remain a trusted conversation host.
2. Apps must be visually useful without looking like ads.
3. App UI must work inside constrained conversational space.
4. ChatGPT needs a consistent visual grammar for third-party embedded experiences.
5. Higher design/functionality standards affect app directory and conversation prominence.

The existence of `@openai/apps-sdk-ui` is the public proof that OpenAI is turning ChatGPT's design
language into a reusable app-building system.

---

## 3. Token architecture

The Apps SDK UI package describes itself as a lightweight, accessible design system for building
ChatGPT apps. It provides Tailwind-integrated tokens, a curated React component library, Radix-based
accessible primitives, dark mode utilities, responsive layouts, and ChatGPT-optimized behavior.

### 3.1 Package architecture

| Layer                   | Evidence                                                                                                                                                   |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primitive variables** | `variables-primitive.css`: gray scale, color ramps, alpha mixes, shadow geometry.                                                                          |
| **Semantic variables**  | `variables-semantic.css`: text, background, border, ring, role, typography, control, shadow tokens.                                                        |
| **Component variables** | `variables-components.css`: alert, avatar, badge, button, input, chat, code block, dialog, menu, modal, popover, radio, segmented control, slider, switch. |
| **Runtime theme**       | `theme.js`: reads/writes `data-theme` and `color-scheme` for `light` / `dark`.                                                                             |
| **Provider**            | `AppsSDKUIProvider` configures router link behavior for components such as buttons and text links.                                                         |
| **Stack**               | React 18/19, Tailwind 4, Radix UI, TypeScript, Storybook, Vite.                                                                                            |

### 3.2 Primitive color model

The package uses neutral and semantic ramps:

| Ramp           | Representative values                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------------------- |
| **Gray light** | `--gray-0: #ffffff`, `--gray-100: #ededed`, `--gray-500: #5d5d5d`, `--gray-1000: #0d0d0d`                                 |
| **Gray dark**  | Same token names invert under `[data-theme="dark"]`, so `--gray-0` becomes `#0d0d0d` and `--gray-1000` becomes `#ffffff`. |
| **Green**      | `--green-400: #04b84c`, `--green-500: #00a240`, plus alpha variants.                                                      |
| **Red**        | `--red-400: #fa423e`, `--red-500: #e02e2a`, plus alpha variants.                                                          |
| **Orange**     | `--orange-400: #fb6a22`, `--orange-500: #e25507`.                                                                         |
| **Yellow**     | `--yellow-400: #ffc300`, `--yellow-600: #ba8e00`.                                                                         |
| **Purple**     | `--purple-400: #924ff7`, `--purple-500: #8046d9`.                                                                         |
| **Blue**       | `--blue-400: #0285ff`, `--blue-500: #0169cc`.                                                                             |

The color ramps use `color-mix(in oklab, ...)` alpha variables. This is a modern color-system move:
instead of maintaining many one-off translucent colors, the package derives alpha states from
semantic ramps and the active theme.

### 3.3 Semantic role grammar

Apps SDK UI uses semantic variants that map to UI roles:

| Role          | Token examples                                                                           |
| ------------- | ---------------------------------------------------------------------------------------- |
| **Primary**   | `--color-background-primary-solid`, `--color-text-primary-solid`, `--color-ring-primary` |
| **Secondary** | `--color-background-secondary-soft`, `--color-text-secondary-outline`                    |
| **Info**      | blue soft/solid/outline/ghost backgrounds, borders, text, rings                          |
| **Warning**   | orange role tokens                                                                       |
| **Caution**   | yellow role tokens                                                                       |
| **Danger**    | red role tokens; danger ring uses red instead of neutral ring                            |
| **Success**   | green role tokens                                                                        |
| **Discovery** | purple role tokens                                                                       |
| **Disabled**  | alpha background/border/text tokens                                                      |

This resembles Atlassian and Shopify more than Vercel: roles are explicit, and component variants
consume role tokens instead of raw color classes.

### 3.4 Tailwind 4 integration

The package README instructs consumers to import:

```css
@import "tailwindcss";
@import "@openai/apps-sdk-ui/css";
@source "../node_modules/@openai/apps-sdk-ui";
```

This is strategically close to byronwade/ui's registry model:

- design tokens live in CSS;
- utilities are generated through Tailwind;
- component classes stay semantic;
- source scanning includes the package so Tailwind can emit the right utilities.

---

## 4. Color system

### 4.1 Neutral first, accent second

The public OpenAI brand site is mostly monochrome and spatial. Apps SDK UI follows that same product
logic: gray and alpha surfaces dominate, while role colors exist for state and meaning.

| Token                              | Meaning                                                |
| ---------------------------------- | ------------------------------------------------------ |
| `--color-text`                     | Main text, mapped to `--gray-1000`.                    |
| `--color-text-inverse`             | Text on inverted/solid surfaces, mapped to `--gray-0`. |
| `--color-text-secondary`           | Muted text, mapped to `--gray-500` in light theme.     |
| `--color-text-tertiary`            | Lower-emphasis metadata, mapped to `--gray-400`.       |
| `--color-ring`                     | Default focus/active ring, mapped to blue.             |
| `--color-background-primary-soft`  | Low-emphasis gray fill.                                |
| `--color-background-primary-solid` | Dark neutral primary fill.                             |
| `--color-border-primary-outline`   | Alpha border for outline controls.                     |

### 4.2 Theme inversion

The Apps SDK UI model inverts gray tokens under `[data-theme="dark"]`. This means a semantic token
such as `--color-text: var(--gray-1000)` can remain stable while the primitive ramp flips.

This is a clean model for embedded ChatGPT apps because third-party UI can inherit light/dark context
without branching every component.

### 4.3 Accent personalization

ChatGPT's product Help Center says accent color affects conversation bubbles, the Voice button, and
highlighted text. Apps SDK UI's package does not expose that exact user accent system as a public
ChatGPT host contract in the inspected package, but its semantic ring/role structure is compatible
with accent substitution.

Practical inference:

- ChatGPT must separate **user preference accent** from **semantic status color**.
- User bubbles can be accent-driven.
- Success/danger/warning/info/discovery should not collapse into the user accent.
- Voice can be accent-forward because it is a major mode switch.

---

## 5. Typography

### 5.1 Brand typography

OpenAI's brand page says OpenAI Sans is built for geometric precision, rounded approachability, and
clarity. It includes Light, Regular, Medium, Semibold, Bold, italics, ligatures, tabular figures, and
case-sensitive punctuation.

### 5.2 Product/package typography

Apps SDK UI uses system font stacks rather than shipping OpenAI Sans publicly through the component
package:

| Token          | Value                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------- |
| `--font-sans`  | `ui-sans-serif, -apple-system, system-ui, "Segoe UI", "Noto Sans", "Helvetica", "Arial", ...` |
| `--font-mono`  | `ui-monospace, "SFMono-Regular", "SF Mono", "Menlo", "Monaco", "Consolas", ...`               |
| `--font-serif` | `initial`                                                                                     |

This is a pragmatic choice for embedded app UI: use platform-native sans and mono so app widgets feel
native across web/mobile contexts.

### 5.3 Type scale

| Token             | Size / line height           |
| ----------------- | ---------------------------- |
| `--font-text-lg`  | `18px / 29px`                |
| `--font-text-md`  | `16px / 24px`                |
| `--font-text-sm`  | `14px / 20px`                |
| `--font-text-xs`  | `12px / 18px`, wide tracking |
| `--font-text-2xs` | `10px / 14px`, wide tracking |
| `--font-text-3xs` | `8px / 12px`, wide tracking  |

The system has a strong small-text ladder because embedded app UI often needs metadata, badges,
captions, compact menus, and source-like labels inside a narrow chat surface.

### 5.4 Typography philosophy

ChatGPT does not need heavy headings everywhere. The primary reading object is generated prose, so
the UI chrome should stay small, calm, and secondary. Apps SDK UI reinforces this with:

- text sizes down to 8px for indicators;
- 14px as a common component size;
- medium/semibold weights for controls and badges;
- mono only for code/data contexts.

---

## 6. Spacing and layout

### 6.1 Base spacing

Apps SDK UI uses:

```css
--spacing: 0.25rem; /* 4px */
```

This gives the package a standard Tailwind-like 4px rhythm. Component tokens derive gutters from it:

| Token                  | Value  |
| ---------------------- | ------ |
| `--control-gutter-2xs` | `6px`  |
| `--control-gutter-xs`  | `8px`  |
| `--control-gutter-sm`  | `10px` |
| `--control-gutter-md`  | `12px` |
| `--control-gutter-lg`  | `14px` |
| `--control-gutter-xl`  | `16px` |

### 6.2 Control sizing

| Token                | Size   |
| -------------------- | ------ |
| `--control-size-3xs` | `22px` |
| `--control-size-2xs` | `24px` |
| `--control-size-xs`  | `26px` |
| `--control-size-sm`  | `28px` |
| `--control-size-md`  | `32px` |
| `--control-size-lg`  | `36px` |
| `--control-size-xl`  | `40px` |
| `--control-size-2xl` | `44px` |
| `--control-size-3xl` | `48px` |

This is a very chat-native scale: compact enough for embedded cards, but with 44/48px touch-capable
levels when needed.

### 6.3 Chat layout tokens

| Token                         | Value / role                    |
| ----------------------------- | ------------------------------- |
| `--chat-max-width`            | `800px`                         |
| `--chat-gutter`               | `20px`                          |
| `--thread-gutter`             | `16px`                          |
| `--composer-gutter`           | `12px`                          |
| `--composer-compact-gutter`   | `8px`                           |
| `--chat-background-color`     | `var(--color-surface)`          |
| `--composer-background-color` | `var(--color-surface-elevated)` |

The 800px max width is the most important layout signal. ChatGPT is a reading/conversation product,
not a full-width dashboard.

---

## 7. Shape and depth

### 7.1 Radius scale

| Token           | Value    |
| --------------- | -------- |
| `--radius-2xs`  | `2px`    |
| `--radius-xs`   | `4px`    |
| `--radius-sm`   | `6px`    |
| `--radius-md`   | `8px`    |
| `--radius-lg`   | `10px`   |
| `--radius-xl`   | `12px`   |
| `--radius-2xl`  | `16px`   |
| `--radius-3xl`  | `20px`   |
| `--radius-4xl`  | `24px`   |
| `--radius-full` | `9999px` |

Component mappings:

| Component | Radius                         |
| --------- | ------------------------------ |
| Composer  | `--radius-4xl` / 24px          |
| Alert     | `--radius-xl` / 12px           |
| Badge     | `--radius-xs` to `--radius-sm` |
| Menu      | `--radius-xl`                  |
| Popover   | `--radius-xl`                  |
| Avatar    | `--radius-full`                |

ChatGPT's signature shape is not a sharp enterprise rectangle. It is large-radius, pill-adjacent,
and conversational.

### 7.2 Shadows and elevation

Apps SDK UI defines hairline and elevation levels:

| Token                            | Meaning                                            |
| -------------------------------- | -------------------------------------------------- |
| `--shadow-hairline`              | 0-offset outline using theme-aware hairline color. |
| `--shadow-100`                   | Low elevation.                                     |
| `--shadow-200`                   | Medium elevation.                                  |
| `--shadow-300`                   | Higher elevation.                                  |
| `--shadow-400`                   | Highest elevation in the package.                  |
| `--shadow-*-strong` / `stronger` | Stronger alpha variants.                           |

In light theme, shadow alpha levels are low (`0.08` to `0.12`). In dark theme, they become stronger
(`0.2` to `0.36` for some levels). This is similar to Vercel/Linear restraint with a more
componentized chat-app token model.

### 7.3 Depth philosophy

Depth is used for:

- composer separation;
- menus/popovers/dialogs;
- cards embedded in assistant responses;
- segmented-control thumbs;
- switch thumbs;
- app UI surfaces that must stand apart from the thread.

Depth should not be used to make every message look like a card.

---

## 8. Motion

The package evidence exposes animation-oriented hooks more clearly than a public motion-token scale:

| Hook / utility           | Design implication                                                 |
| ------------------------ | ------------------------------------------------------------------ |
| `useAnimatedScrollTo`    | Smooth thread navigation and reveal.                               |
| `useAutoGrowTextarea`    | Composer grows with input without layout shock.                    |
| `useCharactersPerSecond` | Streaming text pacing / typing behavior.                           |
| `useSimulatedProgress`   | Progress UI for async tool/app actions.                            |
| `useTrailingValue`       | Delayed state transitions, likely for loading/streaming stability. |
| `useEscCloseStack`       | Layered modal/menu escape behavior.                                |

ChatGPT's motion personality is **streaming and progressive**, not decorative. The most important
motion is state revelation: tokens appear, messages stream, tools run, files upload, progress
advances, and UI adapts around the composer.

---

## 9. Components and patterns

### 9.1 Public Apps SDK UI components

The repository README and package exports show a curated React library. Public examples include:

| Component / pattern     | Role                                                        |
| ----------------------- | ----------------------------------------------------------- |
| `Badge`                 | Semantic inline status.                                     |
| `Button` / `ButtonLink` | Actions, links, app affordances.                            |
| `Icon`                  | Consistent iconography for embedded UI.                     |
| `AppsSDKUIProvider`     | Router/link integration.                                    |
| `TextLink`              | Inline/standalone navigation.                               |
| Chat/card examples      | Reservation cards, metadata grids, call/directions actions. |

The component variables reveal a broader set: Alert, Avatar, AvatarGroup, Badge, Button, Input,
Link, Chat, CodeBlock, Dialog, Menu, Modal, Popover, RadioGroup, SegmentedControl, SelectControl,
Slider, and Switch.

### 9.2 Product-specific patterns

| Pattern                       | Why it matters                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------- |
| **Composer**                  | Main product control; high-radius, elevated, expandable.                          |
| **User message bubble**       | Accent-aware ownership marker.                                                    |
| **Assistant response**        | Primary reading lane; should remain unboxed unless content type requires framing. |
| **Code block**                | Dedicated syntax colors and gray background; critical for developer/product work. |
| **Embedded app card**         | Must be compact, native-feeling, and action-oriented.                             |
| **Metadata grid**             | Used in examples for reservation details; strong fit for app outputs.             |
| **Modal/dialog/popover/menu** | Needed for embedded app interactions without leaving ChatGPT.                     |
| **Source list**               | Chat-specific source/reference pattern tied to responses.                         |

### 9.3 What the package is not

Apps SDK UI is not a full enterprise design system like Atlassian or Fluent. It is a focused system
for building native-feeling app widgets inside ChatGPT. That focus is a strength: it avoids
inventing every possible enterprise component and concentrates on cards, controls, chat, menus,
forms, and embedded app affordances.

---

## 10. Accessibility and governance

### 10.1 Accessibility

The Apps SDK UI README explicitly calls the components accessible and says they are built on Radix
primitives. The package also includes:

- keyboard-oriented close stack behavior;
- focus/ring semantic tokens;
- light/dark theme switching with `color-scheme`;
- component states for disabled/invalid/focus/hover/active;
- semantic role colors for success/danger/warning/info/discovery;
- React Testing Library / Vitest in the package tooling.

### 10.2 Governance

OpenAI's app platform adds governance beyond component quality:

| Governance layer                   | Evidence / implication                                         |
| ---------------------------------- | -------------------------------------------------------------- |
| **Brand rules**                    | OpenAI/ChatGPT marks cannot be modified or misused.            |
| **Usage policies**                 | Apps must follow OpenAI usage policies.                        |
| **Audience suitability**           | Apps must be appropriate for all audiences.                    |
| **Privacy**                        | App developers must provide a clear privacy policy.            |
| **Design/functionality standards** | Higher quality apps may be featured more prominently.          |
| **Directory review**               | Apps can be submitted for ChatGPT app directory consideration. |

The design system is therefore tied to trust. A visually polished app is not enough; it must be safe,
clear, privacy-aware, and native to the host.

---

## 11. AI and agent layer

ChatGPT is the AI surface, so the AI layer is not an add-on. The key distinction is between:

| Layer                  | Visual treatment                                                  |
| ---------------------- | ----------------------------------------------------------------- |
| **Assistant response** | Reading-first prose/code/media.                                   |
| **Tool/app execution** | Progress, status, and embedded UI that explain what is happening. |
| **User intent**        | Composer and user bubbles, now accent-aware.                      |
| **Agentic work**       | Step/progress/status UI, file/tool outputs, safety confirmations. |
| **Third-party app UI** | Must remain visually native and subordinate to the conversation.  |

The biggest design risk is confusing app suggestions, app cards, or monetized opportunities with
assistant recommendations. The product model needs clear provenance: what came from ChatGPT, what
came from a tool, what came from an app, and what action the user is about to take.

---

## 12. Implementation model

| Dimension  | Evidence                                                           |
| ---------- | ------------------------------------------------------------------ | ------------------------ |
| Package    | `@openai/apps-sdk-ui@0.2.2`                                        |
| License    | MIT                                                                |
| Runtime    | React 18/19                                                        |
| Styling    | Tailwind 4 plus imported package CSS                               |
| Primitives | Radix UI                                                           |
| Theme      | `data-theme="light"                                                | "dark"`and`color-scheme` |
| Tokens     | CSS custom properties in primitive, semantic, and component layers |
| Build      | Vite, TypeScript, Storybook                                        |
| Testing    | Vitest, Testing Library, Happy DOM                                 |
| Docs       | Storybook at `openai.github.io/apps-sdk-ui`                        |

This implementation model is close to modern registry systems: CSS variables, Tailwind utilities,
React components, accessible primitives, and package-scanned class generation.

---

## 13. Replication rules

If reproducing a ChatGPT-like design language:

1. **Start with the conversation.** UI exists around the thread and composer, not the reverse.
2. **Use neutral surfaces first.** Let text, spacing, and state carry hierarchy before color.
3. **Keep the composer visually primary.** Large radius, clear surface, responsive growth, tool
   affordances, and strong focus behavior.
4. **Use large radii, but not soft toy UI.** Radius should feel conversational and precise.
5. **Keep app widgets compact.** Use cards only for bounded app outputs, not for every message.
6. **Separate user accent from semantic state.** Accent can mark user ownership or mode, while
   success/danger/warning/info stay semantic.
7. **Make app UI feel native.** Use host typography, controls, spacing, and theme; avoid importing a
   third-party brand surface wholesale.
8. **Use progressive state motion.** Streaming, progress, loading, and reveal matter more than
   decorative animation.
9. **Treat provenance as UI.** Show what is assistant text, user input, tool output, app UI, and
   user-confirmed action.
10. **Use source/code patterns carefully.** Code blocks and references need dedicated readable
    surfaces without overwhelming the chat.

---

## 14. byronwade/ui comparison

| Dimension     | ChatGPT / Apps SDK UI                                                | byronwade/ui implication                                                                           |
| ------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Token model   | CSS variables split into primitive, semantic, component layers.      | Strongly aligned with `foundation` + component tokens.                                             |
| Styling stack | Tailwind 4, React, Radix primitives.                                 | Very close to byronwade/ui's Tailwind v4 + primitive composition direction, though we use Base UI. |
| Accent        | ChatGPT supports user-selected accent for bubbles, Voice, highlight. | Supports our one `--brand` rule and suggests exposing accent as a preview/user preference axis.    |
| Surface model | Conversation-first, 800px chat width, rounded composer.              | Useful reference for docs/chat/agent surfaces; do not turn app dashboards into chat.               |
| Radius        | 2px to 24px plus full; composer uses 24px.                           | Our radius scale can support this; use high radius only for composer/pill/chat affordances.        |
| Shadows       | Hairline plus 100-400 elevation levels.                              | Aligns with our new shadow preview axis; keep shadows optional and semantic.                       |
| Components    | Focused app widget controls, not broad enterprise tables.            | Useful for agent/app components, not a replacement for registry-wide admin components.             |
| AI            | AI is the product environment.                                       | Reinforces object-bound agent UI and provenance states.                                            |
| Typography    | OpenAI Sans for brand; system sans/mono in package.                  | Aligns with our sans/mono lane split; no need to chase OpenAI Sans.                                |
| Governance    | Design quality, privacy, policies, app directory review.             | Reinforces shipped rules and validation gates for AI-authored components.                          |

### 14.1 What byronwade/ui should borrow

1. **Chat-specific tokens.** Consider formal `conversation`, `composer`, `message`, `source-list`,
   and `tool-output` tokens/components instead of styling each agent surface ad hoc.
2. **Provenance states.** Make it visually clear whether content is user, assistant, tool, app,
   source, or action confirmation.
3. **Accent personalization as preview context.** Our one `--brand` model maps well to ChatGPT's
   accent setting. We can demonstrate user accent without breaking semantic status colors.
4. **Focused embedded cards.** Use cards for bounded app/tool results, not generic nested card
   layouts.
5. **Composer as a first-class component.** We already have message-composer patterns; ChatGPT
   supports making composer density, attachment states, voice, and tool mode more formal.
6. **Theme-aware elevation.** The Apps SDK UI hairline/elevation approach supports our new
   shadow-toggle direction.

### 14.2 What byronwade/ui should not copy

1. **Do not make every surface chat-like.** Application components such as Resource List and Data
   Table still need operational density.
2. **Do not copy OpenAI brand assets.** OpenAI's marks and OpenAI Sans are brand-controlled.
3. **Do not use generic AI purple.** ChatGPT's public package uses `discovery` purple, but our
   agent-activity tokens are already more semantically specific.
4. **Do not hide provenance.** Embedded app UI must be clearly identified and accountable.
5. **Do not let accent override status.** User accent should not recolor danger/success/warning.

---

## 15. Source notes and caveats

| Source                                  | What it proves                                                                                          | Caveat                                                                              |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| OpenAI Design Guidelines                | Brand philosophy, OpenAI Sans, logo rules, Blossom philosophy.                                          | Brand docs are not a full product design system.                                    |
| ChatGPT visual experience Help Center   | Theme and accent personalization exist in ChatGPT.                                                      | Help Center wording can lag or contain copy quirks; use only for feature existence. |
| Apps in ChatGPT announcement            | ChatGPT is becoming a host platform for apps built on MCP.                                              | Product/platform details can change quickly.                                        |
| Build with Apps SDK Help Center         | Developers can design logic and interface inside ChatGPT; higher design/functionality standards matter. | Apps SDK is preview/current-state sensitive.                                        |
| `openai/apps-sdk-ui` GitHub             | Public design-system package description and usage model.                                               | It targets apps inside ChatGPT, not necessarily the entire internal ChatGPT UI.     |
| `@openai/apps-sdk-ui@0.2.2` npm package | Exact token/component implementation evidence.                                                          | Package may evolve quickly; captured June 2026.                                     |

## 16. Final synthesis

ChatGPT's public design-system story is less like Vercel Geist and more like a **host operating
system for conversational software**. The main product design is quiet because the assistant response
must remain readable. The Apps SDK UI package exists because third-party apps need a way to be
interactive without visually breaking the thread. The strongest lesson for byronwade/ui is not the
exact gray ramp or radius values; it is the architecture: **conversation primitives, composer
primitives, provenance states, semantic roles, theme-aware elevation, and accent personalization
without semantic color drift.**
