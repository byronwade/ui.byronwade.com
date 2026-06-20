<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# byronwade/ui design-system registry

This repo is the **byronwade/ui design-system registry** — a standalone shadcn registry. All component source lives here in `registry/` and is edited directly in this repo.

See `README.md` for the full workflow (sync → registry:build → deploy).

## Design engineer principles — how we work

These govern _why_ and _how_ we build. They complement the Design DNA below, which defines what
on-system UI _looks like_. Agents and humans should internalize both.

1. **Obsess over usefulness** — Solve real problems for users and teammates. Make useful things feel
   effortless, not merely possible.
2. **Own the whole experience** — Shape the product, design the interface, ship the code. Do whatever
   the outcome needs: product, design, code, docs, support. Care about every state, edge case, word,
   and interaction — not just the happy path.
3. **Understand the constraints** — Know the user, product, code, business, and tradeoffs. Find the
   real constraint before choosing the solution.
4. **Build for everyone** — Design across skill levels, abilities, and contexts. Make complexity
   available, not required (sensible defaults, progressive disclosure, full keyboard and screen-reader
   paths).
5. **Make it excellent** — Scope small enough to do it well. Push back when clarity, craft,
   performance, or trust is at risk. Leave every surface better than you found it.
6. **Make the team better** — Be kind, direct, and low ego. Share work early and give specific
   feedback. Turn repeated feedback into better defaults, tools, and systems — this registry, the lint
   rules, examples, and shipped AI rule are that loop in code.

## Design DNA — the law for authoring components

This is the same standard we ship to consumers (see `registry/rules/byronwade-ui.mdc`, published as
`@byronwade/design-rules`). **When you create or edit a component here, build it so a downstream AI
agent following that rule would produce identical-looking code.** That means:

- **Tokens only, never raw color.** No hex, `rgb()`, `hsl()`, named colors, or arbitrary values
  (`text-[#333]`). Use semantic token utilities: `bg-background`/`text-foreground`,
  `bg-primary`/`text-primary-foreground`, `bg-brand`/`bg-brand-muted`, `bg-success`, `bg-warning`,
  `bg-destructive`/`text-destructive`, `border-border`, `bg-input`, `ring-ring`, `bg-muted`,
  `bg-secondary`, `bg-accent`, `bg-card`, `bg-popover`, `--chart-1…5`, `bg-sidebar*`, `dock-*`.
  Tone with opacity (`bg-brand/10`, `bg-success/10`) rather than introducing new colors.
- **One accent variable.** The accent (rings, `--chart-1`, `--success`, active states) is derived
  from `--brand`. Anything brand/accent/success-colored must resolve to `--brand`, so a consumer
  overriding `--brand` re-skins the whole system. Never pin those to a literal green. **Two fixed
  exceptions** stand apart on purpose and do _not_ follow `--brand`: the `--chart-2…5` ramp and the
  **agent-activity** pastels (`--activity-thinking/search/read/edit`) — a semantic palette encoding
  what an AI agent is doing, for agent composites. Use via `bg-activity-*`; they carry meaning, so
  don't repurpose them as a general accent. Add a new fixed color family only when it encodes domain
  meaning, state, or data class that `--brand`, status tokens, chart tokens, or activity tokens cannot
  express; document the allowed use cases here and in `registry/rules/byronwade-ui.mdc`.
- **Editorial typography.** Hierarchy comes from size + tight tracking + the typeface, not weight:
  display/section headings stay `font-normal`/`font-medium`, never `font-bold`. Use `font-mono` for
  data (stats, prices, timestamps, durations, counts, IDs, hashes, slugs, filenames, `kbd`, model/tool
  names, JSON/code-like parameters, agent logs), and `font-serif` (`--font-serif`) only for long-form
  prose / pull quotes — via `reading-prose` on essay surfaces, `reading-ui` on docs.
- **Readability lanes (evidence-backed).** Web reading on emissive screens is not e-ink. The system
  splits **UI chrome** from **reading surfaces** — never one type treatment for both.

  | Surface                        | Treatment                                                     |
  | ------------------------------ | ------------------------------------------------------------- |
  | Dashboards, forms, nav, tables | `font-sans`, `text-sm`/`text-base`, body tight tracking       |
  | Docs, help, release notes      | `reading-ui` — 65ch, 16px sans, 1.6 lh, `letter-spacing: 0`   |
  | Essays, articles, manifestos   | `reading-prose` — 65ch, 18px serif, 1.7 lh, 1.5em `p + p` gap |
  | Width only                     | `reading-measure` (65ch cap; never exceed **80ch**)           |
  | Lead paragraph                 | `reading-lead` inside a reading lane                          |
  | Secondary copy in prose        | `reading-muted` (not `text-muted-foreground` on body)         |
  | Demo band below prose          | `reading-demo-break` or `DocsDemoSection`                     |

  Left-align body copy. Token contrast only. No Bionic Reading, no e-ink sepia simulation, no
  full-bleed `text-sm` for paragraphs users read. `marketing-layout` `article` and `docs-marketing`
  variants bake in `reading-prose` / `reading-ui`. Full rationale: `/docs/readability`.

- **Icons are Phosphor, duotone by default, from one barrel.** Every icon resolves to
  `@/lib/icons` — never import `lucide-react`, `@phosphor-icons/react`, `react-icons`, or any other
  icon package directly, and never hand-roll an icon `<svg>`. The barrel re-exports Phosphor under its
  exact catalog names (`CaretDown`, `MagnifyingGlass`, `Gear`, `Trash`, `DotsThree`, `House`,
  `Envelope`, `Warning`, …) wrapped so the **duotone** weight is the default — it owns the icon weight
  the way `--brand` owns the accent. Pass `weight="bold" | "fill" | "regular" | "thin" | "light"` at a
  call site only when a state needs it; don't set `weight="duotone"` (it's already the default). Color
  comes from tokens via `currentColor` (`text-brand`, `text-muted-foreground`), size from the scale
  (`size-4`, `size-5`). Type icon props with `Icon`/`IconProps` from `@/lib/icons`. Full reference:
  `/docs/icons`.
- **Base UI + CVA + `data-slot`.** Primitives build on `@base-ui/react`. Variants/sizes live in a
  `cva(...)` block (see `registry/ui/button.tsx`), each part carries a `data-slot` attribute, and the
  radius scale (`rounded-sm`…`rounded-4xl`, all from `--radius`) is used instead of pixel radii.
- **`cn()` + `className` passthrough.** Always merge with `cn()` from `@/lib/utils` and accept a
  `className` prop so callers extend without clobbering base styles.
- **Composites compose primitives.** Patterns in `registry/components/` are built from UI primitives
  and tokens (e.g. `status-pill` = `status-dot` + token chip), never bespoke one-off elements.
- **Accessibility & dark mode are non-optional.** Preserve labels, `aria-*`, keyboard behavior, and
  `focus-visible:ring-ring`. Dark mode must come for free from tokens — never branch on a hardcoded
  color.
- **House utilities** (`bg-grid`, `glow-brand`, `text-gradient(-brand)`, `mask-fade-x`, `full-bleed`,
  `edge`, `depth-none`, `depth-soft`, `depth-raised`, `depth-100`…`depth-600`, `depth-inset-100`,
  `depth-inset-200`, `scrollbar-thin`, `reading-measure`, `reading-ui`, `reading-prose`,
  `reading-lead`, `reading-muted`, `reading-demo-break`) live in `foundation`; reuse them instead of
  re-implementing gradients/grids/shadows or one-off measure rules.
- **Depth follows Shopify Polaris, but defaults to none.** Surfaces use rounded corners +
  `overflow-hidden` + the inset `edge` hairline by default. When explicit depth is needed, use only
  the Polaris-compatible depth utilities (`depth-soft` = `shadow-100` + bevel, `depth-raised` =
  `shadow-300` + bevel; deeper overlays can use `depth-400` or `depth-600`). Dark mode keeps the
  Polaris elevation scale but uses a darker bevel so shadows do not read as white glow. Never use
  Tailwind `shadow-*` utilities or custom box-shadows in components.
- **Two surfaces** — Application UI vs marketing/editorial share one foundation; route by surface
  (`content/catalog-surfaces.ts`), don't split registry packages.
- **Density routes by task.** Dense operational UI (tables, dashboards, admin indexes, command
  palettes, kanban/gantt, file trees) uses compact spacing, stable row heights, and mono metadata.
  Product/editorial surfaces get more breathing room through the reading lanes and marketing layout
  primitives.
- **Object-bound AI.** AI components must attach to a product object or action — conversation, task,
  source, file, issue, verification step, tool call, or model event — and show state/source/review
  affordances. OpenAI-style conversational surfaces expose provenance (`user`, `assistant`, `tool`,
  `source`, `app`, `action`) through `data-provenance` and visible mono metadata where helpful. Use
  `bg-activity-*` only to encode what the agent is doing, not as decoration.
- **Comparison-informed components.** Tables/indexes inherit Shopify/Linear density; command palettes
  inherit Vercel/Linear keyboard-first scanning; kanban/gantt inherit Linear/Atlassian planning
  clarity; record/tag inputs inherit Twenty's neutral chrome and semantic data coloring; file-tree/editor
  surfaces inherit Vercel/Cursor object framing; AI timelines and verification components inherit
  Cursor/Linear object-bound state.

> If you add a new token, utility, or convention that consumers should follow, update
> `registry/rules/byronwade-ui.mdc` in the same change so the shipped AI rule stays in sync.

## Design conventions

- **Tokens** — The `foundation` item in `registry.json` owns all CSS variables. Brand accent follows `--brand`; override it in consuming projects to re-skin rings, charts, and success states.
- **Imports** — Registry files use consumer paths: `@/components/ui/…`, `@/components/…` (composites), `@/lib/…`.
- **Primitives** — UI components are built on `@base-ui/react` with CVA variants, `data-slot` attributes, and Tailwind v4 utilities from the foundation theme.
- **Composites** — Layout and pattern components live in `registry/components/` and compose UI primitives.
- **Readability** — Long-form copy uses `reading-ui` or `reading-prose` (65ch, evidence-backed). UI
  chrome stays `font-sans` + compact sizes. See `app/(docs)/docs/readability/page.tsx` and the
  **Readability — two lanes** section in the shipped AI rule.
- **Shipped AI rule** — `registry/rules/byronwade-ui.mdc` is published as the `design-rules` item (`@byronwade/design-rules`). It is the consumer-facing version of the Design DNA above; keep the two aligned.

## Code conventions

The Design DNA above governs what a component _looks like_; **`docs/CONVENTIONS.md`** governs how the
code is _organized and written_ — file location, kebab-case naming, named exports at the file bottom,
consumer-only imports, Prettier (`semi: false`), `data-slot` presence, and minimal/self-documenting
comments. It is mirrored for editors in `.cursor/rules/byronwade-conventions.mdc` and enforced by
`npm run check:conventions` (structural) + `npm run check:format` (Prettier). Read it before authoring.

Two agents back this up: **`component-author`** scaffolds a new component fully to-spec (source +
registry item + example + test + rule line), and **`design-dna-reviewer`** audits a diff against the
DNA and conventions before merging. Both live in `.claude/agents/`.

## Registry automation

This repo is organized for **automated shadcn registry publishing**. Source flows one direction:

```
registry/ + registry.json → sync → shadcn build → public/r/
```

### Maintenance commands

| Command                        | Purpose                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run update:registry`      | Full pipeline: gen `all` → sync → build → validate                                                                                          |
| `npm run sync`                 | Copy `registry/` → app `components/` + foundation CSS                                                                                       |
| `npm run registry:build`       | Compile `registry.json` → `public/r/*.json`                                                                                                 |
| `npm run check:registry`       | Validate manifest integrity (names, deps, files, orphans)                                                                                   |
| `npm run check:registry:built` | Also verify `public/r/` matches manifest                                                                                                    |
| `npm run check:examples`       | Every UI/composite has `content/examples/<slug>/default.tsx`                                                                                |
| `npm run check:rule`           | Rule (`byronwade-ui.mdc`) names every component + house utility; no ghost `@byronwade/*` install refs across docs; accent-DNA tokens intact |
| `npm run validate`             | All non-test gates (registry + examples + rule sync + test file presence)                                                                   |

### What is hand-maintained vs generated

| Path                                                    | Maintained by                                                                                                                                                                                                                    |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `registry/ui/`, `registry/components/`, `registry/lib/` | **Hand-maintained** — edit component source here                                                                                                                                                                                 |
| `registry/rules/byronwade-ui.mdc`                       | **Hand-maintained** — shipped AI rule (`@byronwade/design-rules`); keep aligned with the Design DNA                                                                                                                              |
| `registry.json`                                         | **Hand-maintained** — deps, metadata, foundation tokens, item structure. Exception: the `all` aggregator item is **auto-generated** by `scripts/gen-all-item.mjs` (runs in `prebuild`/`update:registry`) — never edit it by hand |
| `public/r/`                                             | **Generated** — `shadcn build`, git-ignored, rebuilt on every deploy                                                                                                                                                             |
| `components/`, `lib/`, `app/foundation.generated.css`   | **Generated** — `npm run sync`, git-ignored                                                                                                                                                                                      |
| `content/examples/`                                     | **Hand-maintained** — add `default.tsx` for every new component                                                                                                                                                                  |
| `tests/components/`                                     | **Hand-maintained** — required for every `registry:ui`/`registry:component`                                                                                                                                                      |

### CI gates

| Workflow                         | Checks                                                      |
| -------------------------------- | ----------------------------------------------------------- |
| `.github/workflows/registry.yml` | Manifest, examples, rule sync, `shadcn build`, built output |
| `.github/workflows/test.yml`     | Test file presence, full suite, coverage thresholds         |

### Adding a new component (checklist)

1. Add the component source under `registry/ui/`, `registry/components/`, or `registry/lib/`.
2. Append item to `registry.json` (type, files, deps, registryDependencies).
3. Add the component name to the relevant list in `registry/rules/byronwade-ui.mdc` (enforced by `check:rule`).
4. `npm run update:registry`.
5. Add `content/examples/<slug>/default.tsx`, run `npm run gen:examples`.
6. Add `tests/components/<slug>.test.tsx` covering all variants/states/interactions + axe.
7. `npm run test:ci` — must be green before committing.
8. Commit.

## Testing is mandatory and enforced

Every `registry:ui` and `registry:component` item must have a test file at `tests/components/<slug>.test.tsx`. Tests must cover:

- Default render (component mounts without crashing)
- Every variant, size, and visual state exposed by props
- All interactive behaviors (clicks, keyboard, callbacks)
- Accessibility via `axe` (vitest-axe)

**Adding a component or variant is not done until tests are written and `npm run test:ci` is green.**

### Gates

| Command               | What it checks                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check:tests` | Every `registry:ui`/`registry:component` has a `tests/components/<slug>.test.tsx`                                                         |
| `npm run test:ci`     | `check:tests` + full suite + coverage thresholds (statements ≥ 95%, branches ≥ 90%, functions ≥ 99%, lines ≥ 96%; see `vitest.config.ts`) |
| `npm run test:run`    | Full suite only (no coverage) — for rapid local iteration                                                                                 |

Both gates run automatically in CI on every push and pull request (`.github/workflows/test.yml`). A PR that drops coverage below the ratcheted thresholds or lacks a test file for a new component will fail CI.

### Workflow for new components

1. Add/edit the component in `registry/`.
2. List the component name in `registry/rules/byronwade-ui.mdc` (enforced by `check:rule`).
3. `npm run update:registry` (or `registry:build` if only rebuilding).
4. Write `tests/components/<slug>.test.tsx` covering all variants and states.
5. Run `npm run test:ci` — must be green before committing.
6. Commit.
