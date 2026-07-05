# byronwade/ui — the app-only design doctrine

**Status:** house doctrine · **Applies to:** every component, token, doc, and example in this repo
**Companion law:** `registry/rules/byronwade-ui.mdc` (the shipped AI rule) and `AGENTS.md` (Design DNA).

> byronwade/ui is an **app-only** design system for building calm, dense, agent-native product
> interfaces. It gives agents a token-governed component language for dashboards, admin panels,
> developer tools, AI workbenches, resource lists, command centers, and object-detail workflows.

This document is the _why_ behind the rule. When the rule and this doctrine agree, follow the rule;
when you are making a judgment call the rule doesn't cover, this doctrine decides it.

---

## 1. Positioning — what this system is (and is not)

**It is:** the design language for **applications** — the surfaces operators, engineers, founders,
and their agents use every day to do real work. Dashboards, internal tools, AI workbenches, admin
panels, developer tools, data tables, file trees, kanban boards, command centers, settings screens,
billing and usage screens, logs, activity timelines, resource lists, object-detail pages, and
multi-pane shells.

**It is not:** a marketing kit. The identity is not landing pages, hero sections, bento grids,
decorative glows, "website sections," or startup-site polish. Marketing/editorial and media
components still ship, but they are **secondary** — screenshot, documentation, and demo utilities.
They do not define the homepage personality or the center of the catalog.

**Taglines** (pick per context): _"Calm app UI, enforced by agents."_ · _"The app-only design system
for agent-built products."_ · _"Dense, calm, on-system app interfaces."_ · _"Warm precision for real
application surfaces."_

## 2. Product personality

Calm infrastructure · warm precision · quiet productivity · app-native, not website-native · dense
but breathable · premium without gloss · technical but not cold · operational, trustworthy, fast ·
refined enough for founders and engineers · simple enough for agents to follow.

**Avoid:** generic SaaS landing energy · giant gradient hero cards as a default · decorative glowing
blobs · random accent borders · "purple AI sparkle" not mapped to a real state · over-rounded
toy-like controls · heavy card stacks · marketing-drama whitespace · multiple competing accent
colors · broad tag palettes without domain semantics.

## 3. Research synthesis (principles, not brand cloning)

We synthesize five systems into one house style. We borrow **behavior and discipline**, never brand
colors, token names, typefaces, logos, or trademarked identity.

- **Cursor** — warm paper neutrals, restrained accent, regular-weight headings, semantic agent
  activity colors, human warmth. Borrow the _calm editorial restraint_, not the orange or the
  marketing layout.
- **Linear** — fast, dense, keyboard-native, object-oriented. Lists, panels, issue/task/detail
  flows, command menus, sidebars, activity streams, status rows, dense metadata. Borrow the
  _operational workbench discipline_, not a dark-only identity.
- **Shopify (Polaris)** — admin-native semantics: resource lists, tables, bulk actions, filters,
  banners, badges, destructive states, confirmations, empty states, progressive disclosure. Color
  encodes **role/state/status**, never decoration.
- **Vercel (Geist)** — developer-tool precision: hairline borders, exact spacing, small control
  vocabularies, code/file/log surfaces, mono metadata, command menus, deploy/status patterns. Action
  restraint through `--brand`/semantic tokens; avoid cold monochrome as the default mood.
- **Cloudflare (Kumo)** — infrastructure-grade calm: a **named surface hierarchy**, OKLCH neutrals,
  off-black dark mode, hairline depth, compact operational type, strict semantic tokens, and
  machine-/agent-readable system rules.

**Merged house style:** tokens are the operating model; calm warm-paper OKLCH neutrals; one re-skin
accent plus fixed semantic exceptions; a named surface hierarchy of small luminosity steps;
hairline-first depth; dark mode as a reversal (not a second design); density that follows the
workflow; sans for chrome and mono for all scannable data; semantic color as intent with a strict
usage policy; and object-bound AI.

## 4. Token rules

1. **One re-skinnable `--brand`.** The accent (rings, `--chart-1`, `--success`, active/selected,
   focus) derives from `--brand`. Override that one variable to re-skin the system. Never pin those
   to a literal hue.
2. **Tokens only, never raw color.** No hex, `rgb()`, `hsl()`, named CSS colors, or arbitrary color
   values (`text-[#333]`) in components. Tone with opacity (`bg-brand/10`, `bg-success/10`), not new
   colors.
3. **No component-local palettes.** If a color need can't be met by `--brand`, a status token, a
   chart token, or an activity token, it goes through the **semantic expansion policy** in the rule —
   added centrally to `foundation`, named by meaning, and documented here and in the rule. Never
   invent a palette inside a component.
4. **Fixed semantic exceptions stay fixed:** the `--chart-2…5` ramp and the agent-activity pastels
   (`--activity-thinking/search/read/edit`) carry meaning and do not follow `--brand`.
5. **No new competing accent.** This is a warm system with a single accent. Do **not** introduce a
   cold "info blue" or a second brand hue. Neutral/informational context uses `bg-muted` /
   `text-muted-foreground` (calm-infrastructure default); genuine action/emphasis uses `--brand`;
   genuine state uses `success`/`warning`/`destructive`. _(Deliberate decision: an `--info` hue was
   considered and rejected for now — it would read as a competing accent in a warm system. If a real
   product need for a distinct informational state appears, add it via the semantic expansion policy
   with a documented warm-neutral or brand-derived value, not an arbitrary blue.)_

## 5. Surface hierarchy (named, calm, small steps)

Depth comes from **surface role + a hairline**, not shadows. The foundation already carries the
roles below; use them by name and never hand-tune a one-off gray.

| Role                       | Token / classes                | Job                                                         |
| -------------------------- | ------------------------------ | ----------------------------------------------------------- |
| **Canvas / page**          | `bg-background`                | The deepest app surface; everything sits on it.             |
| **Base / card / panel**    | `bg-card edge`                 | The default working surface — cards, panels, lists, shells. |
| **Recessed / inset**       | `bg-muted/30 edge`             | Wells, frame surrounds, code/log insets, secondary lanes.   |
| **Tint / selected**        | `bg-brand/10` (or `/8`)        | Selected/active state — the only resting brand fill.        |
| **Hover**                  | `bg-muted/30`                  | Row and ghost-control hover.                                |
| **Overlay / popover**      | `bg-popover` + `depth-raised`  | Floating chrome that leaves the plane (menus, popovers).    |
| **Floating chrome (only)** | `bg-dock text-dock-foreground` | Global nav/command/search launchers and morph chrome only.  |

**Depth model:** `edge` (inset hairline) is the baseline for every resting surface — no border, no
shadow. Reach for `depth-soft` / `depth-raised` (and `depth-400`/`depth-600`) **only** on genuinely
floating overlays. Never use Tailwind `shadow-*` or custom box-shadows in components.

**Dark mode** is the same token names with reversed luminosity: off-black canvas (not pure `#000`),
the same surface ladder re-tuned, and a dark-calibrated `edge` bevel so hairlines don't read as white
glow. Never fork behavior with one-off `dark:` color overrides — tokens make dark mode automatic.

## 6. Color semantics — every color has a job

| Token                          | Meaning                                                                 |
| ------------------------------ | ----------------------------------------------------------------------- |
| **brand**                      | Primary action, selected/active, focus/ring, one key emphasis per view. |
| **success**                    | Real success / verified / healthy state (derives from `--brand`).       |
| **warning**                    | Caution / needs intervention.                                           |
| **destructive**                | Error, removal, blocked, danger, irreversible.                          |
| **activity-\***                | What an AI agent is _doing_: thinking / search / read / edit.           |
| **chart-1…5**                  | Stable data-series identity only.                                       |
| **muted / secondary / accent** | Neutral context, quiet fills, informational (the "info" lane).          |

If a color isn't answering "what should the user do / what state is this / what data class is this,"
it is decoration — remove it. Convert decorative eyebrows, section labels, and ornamental icons to
`text-muted-foreground` or a `bg-muted/40` chip.

## 7. Density & typography

- **Density routes by task.** Dense operational UI (tables, admin indexes, dashboards, command
  centers, kanban, gantt, file trees) uses compact spacing, **stable row heights** (36–40px), tight
  cell padding, clear token separators, and mono metadata — no decorative color fields. Comfortable
  product surfaces (settings, detail pages, empty states) get visible grouping and calm actions.
- **Control heights:** `h-6`/`h-8`/`h-9` for app chrome; `h-10` is a hero CTA only (rare in app UI).
- **Typography lanes:** `font-sans` for all UI chrome; **`font-mono` for all scannable data** — IDs,
  timestamps, durations, counts, prices, slugs, tool/model names, filenames, hashes, logs, code,
  JSON-like parameters, technical labels. `font-serif` is for long-form docs/essay prose only
  (`reading-prose`), never app chrome.
- **Headings are restrained** — size + tight tracking + typeface carry hierarchy, never `font-bold`
  on display/section headings.

## 8. Object-bound AI

Every agent state attaches to a product object or action — a task, source, file, tool call, change,
verification step, workflow, issue, message, or model event. Show state explicitly (pending, running,
succeeded, failed, needs approval, reverted), expose provenance (`data-provenance`), keep tool/model
names and parameters in mono, and gate destructive/irreversible actions behind an approval
affordance. AI is embedded in product work — never a separate "purple sparkle" layer. Use
`bg-activity-*` only to encode what the agent is doing, not as decoration.

## 9. Approved vs disallowed patterns

**Approved**

- A dashboard: `app-shell` (`dashboard`/`sidebar`/`command-center`) + `metric`/`stat-card` row +
  `data-table` + `event-timeline`, all `bg-card edge`, mono metrics, one brand emphasis.
- A resource index: `index-filters` + `index-table`/`resource-list` + `bulk-action-bar`, stable
  rows, status via `badge`/`status-pill`, destructive bulk action in `bg-destructive/10`.
- An object-detail page: `detail-header` + property/key-value list (mono values) + `tabs` +
  `event-timeline`/`verification-progress`.
- An AI workbench: `ai-conversation` + `ai-message` + `ai-tool`/`ai-reasoning` + `ai-confirmation`
  for approvals, activity colored only by `activity-*`.
- A deploy/log surface: `file-tree` + `ai-code-block`/log panel + deployment/status rows, all mono
  paths/versions, `edge` panels.

**Disallowed**

- A full-bleed gradient hero as the primary example of a component.
- `glow-brand`, `text-gradient-brand`, big brand fills, or `bg-brand/5` panels used decoratively in
  app chrome.
- New accent/tag colors for variety; role-less color; brand borders on resting cards/inputs.
- Shadows as the depth model; over-rounded controls; marketing whitespace in dense views.
- AI panels that don't show state, provenance, or a review affordance.

## 10. Visual QA — every app screen must pass

1. Would this belong inside a serious production app?
2. Can a user scan it quickly?
3. Does every color have a semantic job?
4. Is the primary action obvious without brand-color flooding?
5. Does the layout work for repeated daily use?
6. Are empty / loading / error / disabled states designed?
7. Is metadata mono?
8. Are headings restrained?
9. Is depth mostly `edge` / hairline?
10. Could an AI agent reproduce the pattern without inventing new styles?

If any answer is "no," refine before shipping.
