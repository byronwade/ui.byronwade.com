# byronwade/ui

A personal master design system, published as a **namespaced [shadcn](https://ui.shadcn.com) registry**.
Token-driven components with a single warm-green brand accent that you re-skin from one CSS variable.
Install components into any Next.js + Tailwind v4 project with the shadcn CLI — you own the copied code.

> **`<REGISTRY_URL>`** — wherever this README says `<REGISTRY_URL>`, substitute the registry's deployed
> base URL. After you deploy this repo to Vercel that's the assigned deployment URL (e.g.
> `https://byronwade-ui.vercel.app`, or whatever Vercel gives you / your custom domain). It is **not**
> baked into the published components — it lives only in each consuming project's `components.json`.

> **Scope: greenfield projects.** The install flow below assumes a **new** project, because the foundation
> base is installed via `shadcn init` so it owns `:root`. Dropping the system into an **existing** project
> that already has its own theme is *not* a clean `init`/`add`: `init` against foundation would overwrite
> that project's `globals.css`, and merely `add`-ing components onto a different base leaves `--ring` /
> `--chart-1` pinned to that base's values (shadcn keeps an existing base's standard tokens), so the
> brand-follows-`--brand` behavior won't hold. For an existing project, **manually merge** the token blocks
> from `registry.json`'s `foundation` item (the `cssVars` light/dark/theme values) into that project's
> `globals.css`, then `add` components. Verified flows in this repo cover the greenfield path only.

## What's in it

**Foundation (install first, via `init`)**
- `foundation` — complete, self-contained token base (`extends: none`): neutrals + brand/success/warning/dock/chart/sidebar tokens + radius scale, light & dark. `--ring`, `--chart-1`, and `--success` are derived from `var(--brand)`, so overriding one variable re-skins charts, rings, active states, and status.

**Libraries**
- `utils` — `cn()` (clsx + tailwind-merge)
- `identity` — deterministic animal-name + OKLCH gradient from a seed string

**UI primitives** (forms, overlays, feedback, data display)
- Forms: `button`, `input`, `textarea`, `label`, `select`, `checkbox`, `switch`, `radio-group`, `toggle`, `toggle-group`, `input-group`
- Overlays: `tooltip`, `popover`, `dropdown-menu`, `dialog`, `sheet`, `hover-card`, `command`, `navigation-menu`
- Feedback: `alert`, `progress`, `skeleton`, `sonner`
- Data display: `badge`, `card`, `tabs`, `accordion`, `avatar`, `separator`, `breadcrumb`, `table`, `aspect-ratio`, `scroll-area`, `collapsible`, `chart`
- House UI: `status-dot`, `gauge`, `gradient-avatar`, `activity-grid`, `filter-pill`, `segmented-control`

**Bloom** (morphing surfaces)
- `bloom` · `bloom-flow` · `bloom-dock`

**Composites & patterns**
- Layouts: `hero-section`, `centered-focal`, `split-with-rail`, `timeline-rail`
- Patterns: `page-header`, `metric-stat`, `stat-card`, `empty-state`, `status-pill`
- House: `detail-header`, `section`, `event-timeline`

**AI rule**
- `design-rules` — a drop-in rule that keeps your AI agent on-system. See
  [Keep your AI on-system](#keep-your-ai-on-system-do-this-once).

## Using it in a project

The components rely on the foundation's tokens and custom Tailwind v4 utilities (`stroke-success`,
`bg-warning`, `rounded-4xl`, …). `foundation` is therefore a **base** you install with `init` so it owns
`:root` — not a component you add on top of another base.

**1. Initialize the project against the foundation base:**
```bash
npx shadcn@latest init <REGISTRY_URL>/r/foundation.json
```
This writes the full token layer (light/dark `:root`, the `@theme` mappings) into your `globals.css` and
creates `components.json`. (In a brand-new app, run `create-next-app` with `--tailwind` first.)

**2. Register the `@byronwade` namespace** in your project's `components.json`:
```jsonc
{
  // ...existing config...
  "registries": {
    "@byronwade": "<REGISTRY_URL>/r/{name}.json"
  }
}
```

**3. Add components by name** — transitive dependencies resolve automatically:
```bash
npx shadcn@latest add @byronwade/gauge
npx shadcn@latest add @byronwade/timeline-rail @byronwade/metric-stat @byronwade/gradient-avatar
npx shadcn@latest add @byronwade/sheet @byronwade/command @byronwade/bloom-dock
```
`add @byronwade/gauge` pulls `status-dot` + `utils`; `add @byronwade/gradient-avatar` pulls `identity`; etc.

**Or install the entire catalog in one command** via the `all` aggregator item:
```bash
npx shadcn@latest add @byronwade/all
```
`all` is a files-less `registry:block` whose `registryDependencies` list every component, so a single
`add` pulls the whole system (deps resolved automatically). It is **auto-generated** from `registry.json`
by `scripts/gen-all-item.mjs` (wired into `prebuild` and `update:registry`), so it never drifts from the
component set — never edit it by hand.

> shadcn's generic `add --all` flag adds all items from the *default* shadcn/ui registry, **not** a custom
> namespace. Use `@byronwade/all` to grab everything from this registry.

## Keep your AI on-system (do this once)

This system is designed to be **AI-native**: install one rule and your AI agent (Cursor, Claude,
Copilot, Windsurf, Codex, …) will keep building and editing UI with these components and tokens —
no hardcoded colors, no reinvented components — every time it touches your project.

**The easy way — one command** (drops a Cursor rule into `.cursor/rules/byronwade-ui.mdc`):
```bash
npx shadcn@latest add @byronwade/design-rules
```
That's it. Cursor auto-applies it on every edit, so updates stay on-system.

**Any other AI tool** — point it at the same rule by referencing the installed file (or paste its
contents) into your agent's instructions file:

| Tool | Where to add it |
|------|-----------------|
| Cursor | `.cursor/rules/byronwade-ui.mdc` (installed automatically by the command above) |
| Claude Code | append to / reference from `CLAUDE.md` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Codex / AGENTS-aware tools | `AGENTS.md` |
| Windsurf | `.windsurfrules` |

The rule's content lives in this repo at `registry/rules/byronwade-ui.mdc` and is served at
`<REGISTRY_URL>/r/design-rules.json`. Re-run the command after big upgrades to pull the latest rule.

## Re-skinning the brand

The whole system follows one variable. In your project's `globals.css`, override `--brand` (and its dark
value) — rings, the primary chart line, active states, and status-success all follow:
```css
:root  { --brand: oklch(0.55 0.20 25); }   /* e.g. a red-orange */
.dark  { --brand: oklch(0.65 0.20 25); }
```
Neutrals, `--warning` (amber), `--destructive` (red), and the dark `--dock-*` tokens are independent by design.

## Developing the registry

Source of truth lives in `registry/` (`lib/`, `ui/`, `components/`) and the `registry.json` manifest.
Edit component source directly in this repo.

```bash
npm run update:registry # sync → build → validate (full pipeline)
npm run registry:build  # compiles registry.json -> public/r/*.json  (alias: npx shadcn build)
npx serve public -l 4000 # serve the built registry locally for testing
```
`public/r/` is git-ignored and regenerated by `prebuild` on every `npm run build` (and on every Vercel
deploy), so the deployed registry is always in sync with `registry.json`.

**To test a change end-to-end:** build + serve (above), then in a throwaway app point the `@byronwade`
namespace at `http://localhost:4000/r/{name}.json` and `init`/`add` against it.

### Adding a new component
1. Add the component under `registry/ui/`, `registry/components/`, or `registry/lib/`.
2. Append an item to `registry.json`, then `npm run update:registry`.
3. Add `content/examples/<slug>/default.tsx`, run `npm run gen:examples`.
4. Write `tests/components/<slug>.test.tsx` covering all variants and states.
5. Run `npm run test:ci` — must be green before committing.
6. Commit.

## Deploying

This repo is a normal Next.js app. Connect it to Vercel (or `vercel --prod`). The `prebuild` script runs
`shadcn build` before `next build`, so `public/r/*.json` is freshly generated on every deploy. Once live,
note the deployment URL and use it as `<REGISTRY_URL>` above.

## Testing

### Stack

- **Vitest** + **Testing Library** + **jsdom** — unit/component tests
- **vitest-axe** — accessibility assertions (wraps axe-core)
- **@vitest/coverage-v8** — V8 coverage instrumentation

### Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Watch mode (re-runs on file changes) |
| `npm run test:run` | One-shot run, no coverage |
| `npm run test:coverage` | One-shot run with coverage report |
| `npm run check:tests` | Gate: verify every `registry:ui`/`registry:component` has a test file |
| `npm run test:ci` | Full CI gate: `check:tests` + suite + coverage thresholds |

### Coverage gate (ratcheted thresholds)

Coverage is measured over `components/**` (all generated component files). Thresholds are configured in `vitest.config.ts` and enforced on every run:

| Metric | Threshold |
|--------|-----------|
| Statements | ≥ 95% |
| Branches | ≥ 90% |
| Functions | ≥ 99% |
| Lines | ≥ 96% |

Thresholds are ratcheted — they can only increase over time. A new component or variant that adds untested branches will trip the threshold and fail CI.

### CI

The `.github/workflows/test.yml` workflow runs `npm run check:tests` followed by `npm run test:ci` on every `push` and `pull_request`. Merges are blocked until both gates pass.

### Known limitations

**jsdom** does not implement `HTMLCanvasElement.getContext()`, so `chart.tsx` (Recharts) and `activity-grid.tsx` canvas internals are not deeply exercised. `sonner` toast interaction coverage is thinner due to portal/timer constraints in jsdom. `scroll-area` scrollbars may not mount until layout is measured. `command` (cmdk) requires local `ResizeObserver` and `scrollIntoView` stubs in tests. These components' render and variant tests still pass; only deep canvas/animation/layout branches are uncovered.

## Component layout

| Registry path | Purpose |
|---------------|---------|
| `registry/ui/` | UI primitives (buttons, inputs, overlays, …) |
| `registry/components/` | Composites and layout patterns |
| `registry/lib/` | Shared utilities (`cn`, identity helpers, …) |

Imports inside registry files use the consumer layout (`@/components/ui/…`, `@/components/…`, `@/lib/…`).
The `foundation` token layer lives entirely inside `registry.json`'s `cssVars` block — it has no source file.
