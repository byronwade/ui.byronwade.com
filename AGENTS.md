<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# byronwade/ui design-system registry

This repo is the **byronwade/ui design-system registry**. Component source is **mirrored from SignalRoute** (the canonical repo) via `npm run mirror` — never hand-edit `registry/*` files. Edit the component in SignalRoute, then mirror here.

See `README.md` for the full workflow (mirror → registry:build → deploy).

For design-system conventions (tokens, layout archetypes, Visitors-style shell), see SignalRoute's `AGENTS.md`.

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

1. Add/edit the component in SignalRoute.
2. In this repo: `npm run mirror` then `npm run registry:build`.
3. Write `tests/components/<slug>.test.tsx` covering all variants and states.
4. Run `npm run test:ci` — must be green before committing.
5. Commit both repos.
