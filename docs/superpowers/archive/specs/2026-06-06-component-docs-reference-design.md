# Component Docs Reference Design

## Context

The registry already has component detail pages at `app/(docs)/docs/[slug]/page.tsx`. Those pages
render the component header, examples or authored variants, install command, and a props table when
`content/components.ts` includes `props`.

The current structure is useful, but it does not consistently show the full feature set and API for
each component in the way mature UI libraries do. Metadata is uneven across the registry: some
components have rich examples and props, some have variants, and many do not yet expose features,
exports, slots, CSS variables, source files, or related components.

This pass is a template and metadata-system upgrade first. It should make every component page
capable of showing complete reference information while populating a representative batch. A later
coverage pass can audit every registry item and fill missing metadata at scale.

## Goals

- Give every component page a predictable, scannable reference structure.
- Preserve the existing example and variant browser behavior, including deep links and search.
- Expand API coverage beyond props to include exports, slots, CSS variables, dependencies, source
  files, and related components when available.
- Allow incomplete metadata to render gracefully so the route can improve before every component is
  fully audited.
- Keep the page aligned with the design-system DNA: token-only styling, compact docs UI, accessible
  headings/tables, and no decorative card-heavy layout.

## Non-Goals

- Do not fully audit and populate every component in this pass.
- Do not replace the existing examples registry or variant browser.
- Do not introduce tabbed docs that hide API/reference content from page scanning.
- Do not split component pages into separate application and marketing docs systems.

## Selected Approach

Use a scannable reference page with progressive sections:

1. Overview
2. Features
3. Examples
4. Installation
5. API
6. Source and related components

This approach keeps all important content visible and anchorable, matches the current route model,
and can be implemented mostly by extending the shared component detail template plus
`ComponentDoc` metadata.

## Page Structure

### Overview

The page header continues to show:

- Back link to the relevant catalog surface.
- Category and surface label.
- Component name.
- Description.
- Dependency chips for registry and npm dependencies.

The install command should remain easy to find. It may stay in its existing section, but the page
should also make the install command discoverable near the top through either a compact action or
anchor link.

### Features

Add a feature checklist section after the overview. It uses authored metadata when present and a
fallback when not present.

Authored feature items should be concise and practical, for example:

- Supports controlled and uncontrolled state.
- Ships icon-only, loading, and destructive button states.
- Exposes semantic slots for trigger, content, and item.

Fallback behavior:

- If `features` exists, render it.
- Otherwise derive a small fallback from component tags, authored variant names, and example names.
- If no useful fallback exists, omit the section rather than rendering filler.

### Examples

Keep the existing rendering model:

- Components with authored `variants` render the `VariantBrowser`.
- Components without authored `variants` render all examples from `content/examples/<slug>/`.
- Example and variant blocks remain anchorable.
- Code preview remains paired with visual preview through the existing demo preview system.

The section label should communicate that examples are the feature showcase, not just a single demo.

### Installation

Keep the install command section for every registry component except special hidden/foundation pages
where the existing route intentionally differs.

The section should include:

- `npx shadcn@latest add @byronwade/<slug>`
- Registry dependency notes when `registryDeps` exists.
- Npm dependency notes when `npmDeps` exists.

### API

Expand the API section to support multiple reference groups:

- Props: existing `props` table.
- Exports: component exports and type exports.
- Slots: rendered `data-slot` handles when relevant.
- CSS variables: component-specific variables when relevant.
- Dependencies: registry and npm dependencies.

Each group is optional. If only props exist, the page should look close to the current page. If
multiple groups exist, the API section should show them as stacked subsections with clear labels.

### Source And Related

Add a final reference section for:

- Registry source file paths.
- Example source file paths.
- Related component links.

Source links should point to local docs routes or source paths where the current app can support
them. If direct source links are not available yet, render readable source path rows rather than
dead links.

## Data Model

Extend `ComponentDoc` in `content/components.ts` with optional metadata:

```ts
export type FeatureRow = {
  title: string
  description?: string
}

export type ExportRow = {
  name: string
  type: "component" | "type" | "function" | "constant"
  description: string
}

export type SlotRow = {
  name: string
  element?: string
  description: string
}

export type CssVarRow = {
  name: string
  default?: string
  description: string
}

export type SourceRow = {
  label: string
  path: string
}
```

`ComponentDoc` should gain optional fields:

```ts
features?: FeatureRow[]
exports?: ExportRow[]
slots?: SlotRow[]
cssVars?: CssVarRow[]
source?: SourceRow[]
related?: string[]
```

`related` stores component slugs so the route can resolve labels and hrefs through `bySlug`.

## Representative Metadata Batch

Populate the first batch to prove the model across different component shapes:

- `button`: strong primitive with variants, sizes, states, and exports.
- `input`: form primitive with states and accessibility usage.
- `dialog`: overlay primitive with parts and slots.
- `table`: data display primitive with slots and composition notes.
- `morph-dock`: richer composite with many examples, authored variants, and related-component
  opportunities.

The batch should be enough to validate layout, fallback behavior, table rendering, and source/related
sections without turning this into the full registry audit.

## Components And Helpers

Keep implementation small and local to docs:

- Add helper functions for deriving fallback features and source rows.
- Add reusable docs sections for feature lists and API groups if the page becomes too large.
- Reuse existing table, code block, install command, docs prose, and demo preview components.
- Keep all styling token-based and compatible with dark mode.

## Accessibility

- Use semantic headings in document order.
- Keep tables readable on narrow screens with horizontal overflow where needed.
- Preserve focus-visible styles for links and controls.
- Keep examples and variant anchors stable.
- Do not hide essential API content behind tabs.

## Testing

Add focused coverage for:

- Metadata fallback helpers.
- Rendering authored feature rows.
- Rendering optional API groups.
- Omitting empty sections.
- Resolving related component slugs.
- Existing variant browser behavior continuing to render.

Verification commands for implementation should include the relevant app/content tests first, then
broader validation when the edit scope justifies it:

- `npm run test:run -- tests/app/variant-browser.test.tsx tests/content/variants.test.ts`
- New tests added for component docs metadata/rendering.
- `npm run validate` if metadata or registry rules are touched.

## Implementation Decisions

- Source paths render as readable path rows in this pass. Do not add a source viewer route unless an
  existing source-viewing pattern is discovered during implementation.
- The representative composite batch item is `morph-dock`.
