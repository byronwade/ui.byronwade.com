# Code conventions — byronwade/ui

How code is **organized and written** in this repo. This is the structural/style companion to
the _content_ DNA in [`AGENTS.md`](../AGENTS.md) (tokens, typography, Base UI + CVA) and the shipped
rule [`registry/rules/byronwade-ui.mdc`](../registry/rules/byronwade-ui.mdc). Where AGENTS.md says
_what a component must look like_, this says _where it lives, what it's named, and how it's shaped_.

Most of these are enforced automatically — see [Enforcement](#enforcement) at the bottom.

## File organization

| Kind                          | Location                              | Example                               |
| ----------------------------- | ------------------------------------- | ------------------------------------- |
| UI primitive                  | `registry/ui/<slug>.tsx`              | `registry/ui/button.tsx`              |
| Composite / pattern           | `registry/components/<slug>.tsx`      | `registry/components/status-pill.tsx` |
| Shared helper / hook          | `registry/lib/<slug>.ts`              | `registry/lib/utils.ts`               |
| CVA variants (optional split) | `registry/ui/<slug>-variants.ts`      | `registry/ui/button-variants.ts`      |
| Example                       | `content/examples/<slug>/default.tsx` | —                                     |
| Test                          | `tests/components/<slug>.test.tsx`    | —                                     |

- **One component family per file.** A `Root` plus its sub-parts and types belong together; unrelated
  components do not.
- **Composites compose primitives.** A pattern in `registry/components/` is built from UI primitives
  and tokens, never bespoke one-off elements.

## Naming

- **Filenames are `kebab-case`** and equal the registry slug: `status-pill.tsx` → `@byronwade/status-pill`.
- **Components are `PascalCase`**, props types are `<Component>Props`, variant helpers are
  `<component>Variants`. Booleans read as adjectives (`disabled`, `loading`, `isBusy`).
- **`data-slot` values are kebab-case** and namespaced by component (`button`, `button-spinner`).

## Exports

- **Named exports at the file bottom**, grouped: `export { Button, buttonVariants }` then
  `export type { ButtonProps }`. This is the plurality across the registry and keeps a file's public
  surface in one place.
- **No `export default`** for components — named imports give consumers stable names and let one file
  expose multiple parts.

## Imports

- **Consumer paths only:** `@/components/ui/…`, `@/components/…`, `@/lib/…`. Never a relative parent
  import (`../`) — registry source is copied into downstream apps, where `../` would dangle.

## Formatting

- **Prettier owns formatting.** Config: `.prettierrc.json` → `{ "semi": false }`, double quotes,
  trailing commas (Prettier defaults otherwise). Run `npm run format`; check with `npm run check:format`.
- **No semicolons** — matches the canonical `button.tsx`.

## Comments

- **Minimal and self-documenting.** Prefer a clear name over a comment. Comment only genuinely
  non-obvious logic, or tricky public API (the JSDoc-on-hard-props style in `button.tsx`).
- **No header boilerplate** on component files, and no comments that restate the code. A comment
  earns its place by explaining _why_, not _what_.

## Components — the shape

Every `registry:ui` / `registry:component`:

1. Builds on `@base-ui/react` (primitives), with variants/sizes in a `cva()` block.
2. Carries a **`data-slot`** on every rendered part (the consumer's styling handle).
3. Accepts `className` and merges it via **`cn()`** from `@/lib/utils` (passthrough, never clobber).
4. Uses **tokens only** for color, **editorial typography** (no `font-bold` on display/section), and
   keeps accessibility + dark mode coming for free from tokens. (Full rules in `AGENTS.md`.)
5. **Long-form copy** uses `reading-ui` (docs) or `reading-prose` (essays) — never full-bleed
   `text-sm` for paragraphs users read. Body copy uses `text-foreground`; `reading-muted` for
   secondary lines inside a lane. See `AGENTS.md` and `/docs/readability`.
6. **Catalog surfaces** — Application UI vs marketing/editorial share one foundation; see
   `content/catalog-surfaces.ts`. Do not split into separate registry packages.
7. Ships with a **test** (every variant/state/interaction + `axe`) and an **example**.

When in doubt, copy the shape of `registry/ui/button.tsx` (primitive) or
`registry/components/status-pill.tsx` (composite).

## Research-backed design decisions

The research files in `design-research/` inform how new components should behave:

- **Semantic color expansion** — default to `--brand`, status, chart, and activity tokens. Add a fixed
  color family only for documented domain meaning, state, or data class.
- **Density routing** — dense operational surfaces use compact spacing, stable row heights, mono
  metadata, and token separators; editorial/marketing surfaces use reading lanes and larger rhythm.
- **Object-bound AI** — AI components attach to conversations, files, tasks, sources, tool calls,
  verification steps, or proposed changes, with visible state and review affordances.
- **Conversation provenance** — AI messages, sources, tools, embedded apps, and proposed actions expose
  `data-provenance`; show compact mono provenance labels when authorship or grounding could be unclear.
- **Record data coloring** — Twenty-style record UI keeps chrome neutral and colors the data object
  itself: tags, status, source, priority, and owner metadata. Use semantic badge/tag tones before
  adding any broader fixed palette.
- **Mono is data** — reserve `font-mono` for metrics, IDs, paths, filenames, model/tool names,
  parameters, logs, timestamps, and keyboard hints. Body copy and labels stay sans.
- **Depth is `edge`** — framed surfaces use the inset `edge` hairline with rounded clipping, not drop
  shadows or outline borders.

## Readability (long-form copy)

byronwade/ui splits **UI chrome** from **reading surfaces**. This is enforced in the shipped AI rule
and foundation utilities — not optional polish.

| Lane  | Utility                             | When                                             |
| ----- | ----------------------------------- | ------------------------------------------------ |
| UI    | `font-sans` + `text-sm`/`text-base` | Dashboards, forms, tables, nav                   |
| Docs  | `reading-ui`                        | Guides, help, release notes (65ch, 16px, 1.6 lh) |
| Essay | `reading-prose`                     | Articles, manifestos (65ch, 18px serif, 1.7 lh)  |

Cap measure at **80ch** (WCAG); target **65ch**. Left-align body; no Bionic Reading or e-ink
simulation. Prose guide: `app/(docs)/docs/readability/page.tsx` (published at `/docs/readability`).

## Enforcement

| Concern                                            | Enforced by                                                     |
| -------------------------------------------------- | --------------------------------------------------------------- |
| Formatting (semicolons, quotes, spacing)           | `prettier --check` (`npm run check:format`)                     |
| Filenames, import paths, exports, `data-slot`      | `npm run check:conventions` (in `validate`)                     |
| Tokens / no raw color / typography                 | `npm run lint:on-system`                                        |
| Registry integrity, examples, rule coverage, tests | `check:registry`, `check:examples`, `check:rule`, `check:tests` |

`npm run validate` runs the structural + registry gates; `npm run test:ci` runs tests + coverage.
Both run in CI on every push and PR. Some `check:conventions` rules (`data-slot`, `export default`)
are **ratcheted** — reported but not yet CI-failing — until existing components are brought into
conformance, then promoted to hard-fail.

## Adding a component

Follow the checklist in [`AGENTS.md`](../AGENTS.md#adding-a-new-component-checklist), or invoke the
`component-author` agent which scaffolds all of it to-spec. Review on-system conformance with the
`design-dna-reviewer` agent before merging.
