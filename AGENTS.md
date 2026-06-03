<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# byronwade/ui design-system registry

This repo is the **byronwade/ui design-system registry** — a standalone shadcn registry. All component source lives here in `registry/` and is edited directly in this repo.

See `README.md` for the full workflow (sync → registry:build → deploy).

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
  overriding `--brand` re-skins the whole system. Never pin those to a literal green.
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
  `edge`, `scrollbar-thin`) live in `foundation`; reuse them instead of
  re-implementing gradients/grids/shadows.

> If you add a new token, utility, or convention that consumers should follow, update
> `registry/rules/byronwade-ui.mdc` in the same change so the shipped AI rule stays in sync.

## Design conventions

- **Tokens** — The `foundation` item in `registry.json` owns all CSS variables. Brand accent follows `--brand`; override it in consuming projects to re-skin rings, charts, and success states.
- **Imports** — Registry files use consumer paths: `@/components/ui/…`, `@/components/…` (composites), `@/lib/…`.
- **Primitives** — UI components are built on `@base-ui/react` with CVA variants, `data-slot` attributes, and Tailwind v4 utilities from the foundation theme.
- **Composites** — Layout and pattern components live in `registry/components/` and compose UI primitives.
- **Shipped AI rule** — `registry/rules/byronwade-ui.mdc` is published as the `design-rules` item (`@byronwade/design-rules`). It is the consumer-facing version of the Design DNA above; keep the two aligned.

## Registry automation

This repo is organized for **automated shadcn registry publishing**. Source flows one direction:

```
registry/ + registry.json → sync → shadcn build → public/r/
```

### Maintenance commands

| Command | Purpose |
|---------|---------|
| `npm run update:registry` | Full pipeline: gen `all` → sync → build → validate |
| `npm run sync` | Copy `registry/` → app `components/` + foundation CSS |
| `npm run registry:build` | Compile `registry.json` → `public/r/*.json` |
| `npm run check:registry` | Validate manifest integrity (names, deps, files, orphans) |
| `npm run check:registry:built` | Also verify `public/r/` matches manifest |
| `npm run check:examples` | Every UI/composite has `content/examples/<slug>/default.tsx` |
| `npm run check:rule` | Rule (`byronwade-ui.mdc`) names every component + house utility; no ghost `@byronwade/*` install refs across docs; accent-DNA tokens intact |
| `npm run validate` | All non-test gates (registry + examples + rule sync + test file presence) |

### What is hand-maintained vs generated

| Path | Maintained by |
|------|---------------|
| `registry/ui/`, `registry/components/`, `registry/lib/` | **Hand-maintained** — edit component source here |
| `registry/rules/byronwade-ui.mdc` | **Hand-maintained** — shipped AI rule (`@byronwade/design-rules`); keep aligned with the Design DNA |
| `registry.json` | **Hand-maintained** — deps, metadata, foundation tokens, item structure. Exception: the `all` aggregator item is **auto-generated** by `scripts/gen-all-item.mjs` (runs in `prebuild`/`update:registry`) — never edit it by hand |
| `public/r/` | **Generated** — `shadcn build`, git-ignored, rebuilt on every deploy |
| `components/`, `lib/`, `app/foundation.generated.css` | **Generated** — `npm run sync`, git-ignored |
| `content/examples/` | **Hand-maintained** — add `default.tsx` for every new component |
| `tests/components/` | **Hand-maintained** — required for every `registry:ui`/`registry:component` |

### CI gates

| Workflow | Checks |
|----------|--------|
| `.github/workflows/registry.yml` | Manifest, examples, rule sync, `shadcn build`, built output |
| `.github/workflows/test.yml` | Test file presence, full suite, coverage thresholds |

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

| Command | What it checks |
|---------|---------------|
| `npm run check:tests` | Every `registry:ui`/`registry:component` has a `tests/components/<slug>.test.tsx` |
| `npm run test:ci` | `check:tests` + full suite + coverage thresholds (statements ≥ 99%, branches ≥ 96%, functions ≥ 100%, lines ≥ 99%) |
| `npm run test:run` | Full suite only (no coverage) — for rapid local iteration |

Both gates run automatically in CI on every push and pull request (`.github/workflows/test.yml`). A PR that drops coverage below the ratcheted thresholds or lacks a test file for a new component will fail CI.

### Workflow for new components

1. Add/edit the component in `registry/`.
2. List the component name in `registry/rules/byronwade-ui.mdc` (enforced by `check:rule`).
3. `npm run update:registry` (or `registry:build` if only rebuilding).
4. Write `tests/components/<slug>.test.tsx` covering all variants and states.
5. Run `npm run test:ci` — must be green before committing.
6. Commit.
