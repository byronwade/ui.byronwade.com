# `/components` → `/docs` rename + page design review

**Date:** 2026-06-01
**Scope:** Rename the docs section route from `/components` to `/docs`, plus an honest design assessment of every page.

## 1. Route rename (shipped)

`git mv app/(docs)/components → app/(docs)/docs` (history preserved). New routes:

| Old | New |
|-----|-----|
| `/components` | `/docs` |
| `/components/[slug]` | `/docs/[slug]` (60 component pages) |
| `/components/installation` | `/docs/installation` |
| `/components/theming` | `/docs/theming` |
| `/components/ai` | `/docs/ai` |

**Labeling model:** the *route and section* are **"Docs"**; **"Components" stays as the name of the catalog within Docs** (scrubbing "component" from a component registry would be absurd). This resolved every label decision without churn.

**Touched:** moved page files; `app/page.tsx`; `app/_styleguide/sections.tsx`; `content/search-index.ts`; `content/guides.ts` (+ comments); chrome (`nav-config.ts`, `dock-toolbar.tsx` regex, `breadcrumb-trail.ts` root crumb → "Docs", `app-launcher.tsx`).

**Deliberately untouched** (not the route): `@/content/components` data module, `content/components.ts`, `registry/components/`, `tests/components/`, `components/ui/`, and the `/docs/components` breadcrumb *example* content.

**Redirects:** none — user chose a hard cutover. Old `/components*` URLs will 404. Registry JSON at `/r/*.json` is unaffected.

## 2. Verification

- `npm run build` ✓ — TypeScript clean; routes resolve as `/docs*`; 60 SSG component paths generated.
- `npm run test:ci` ✓ (exit 0) — 4525 tests pass; coverage 95.48/90.95/99.61/96.83 clears configured thresholds (95/90/99/96). Rename is coverage-neutral.
- Note: AGENTS.md cites stale thresholds (99/96/100/99); the live values live in `vitest.config.ts`.

## 3. Design assessment (source-level — visual pass deferred)

The browser-automation tab session would not initialize, so true rendered review is **deferred**. Re-pair via `switch_browser` (not `select_browser`) when resuming. The system is deliberately restrained; the goal is *not* to manufacture churn.

| Page | State | Notes |
|------|-------|-------|
| `/` Home | Strong | Calm hero, single brand glow, staggered `animate-in`, pillars, AI-rules card, stat row. **Fixed:** "Enter" and "Browse components" both pointed at the same route — repurposed the second to **Install → /docs/installation** (distinct, high-value for a registry). |
| `/docs` Introduction | Strong | Clear "why it exists", install + AI callout cards, category-grouped catalog grid with counts. Consistent token use. |
| `/docs/installation` | Strong | Numbered `Step` flow, registry-first path, manual-setup `Alert`, "next: Theming" footer. |
| `/docs/theming` | Strong | One-variable re-skin story; "what follows the accent" list. Tight and on-message. |
| `/docs/ai` | Strong | Per-tool rule install table, success `Badge`, footer nav. |
| `/docs/[slug]` | Solid | Example tabs + install command + props table. Plain header by design; fine. |
| `/layouts` | Strong | Scaled `iframe` previews in cards, hover lift, use-case chips. |
| `/styleguide` | Reviewed at structure level only | Large composite; not visually assessed. Flagged for the deferred browser pass. |

### Candidate refinements for the deferred visual pass (not yet applied)
- Verify hero glow/grid intensity and CTA balance at multiple viewports.
- Confirm catalog card hover-lift and focus rings read well in dark mode.
- Sanity-check `/styleguide` section rhythm and the scaled `/layouts` iframes on small screens.

## 4. Templates section (new) + dogfood refactor

### New `/templates` section (additive — cannot regress existing pages)
Mirrors the `/layouts` architecture: starter screens (complete, content-filled product
pages) as opposed to layout archetypes (structural patterns).

- `app/templates/_templates/index.ts` — `TemplateMeta` + list + `getTemplate` (import-safe data).
- `app/templates/_templates/components.tsx` — slug → component map.
- Three templates, each distinct from its nearest archetype, branded ("Helio"), real data:
  - **Pricing** (`pricing.tsx`) — net-new: 3 tiers w/ featured plan, live monthly/annual toggle, comparison `Table`, FAQ, CTA band.
  - **Dashboard** (`dashboard.tsx`) — full **app shell** (sidebar + top bar), distinct from hero-chart's centered report. KPI strip, hero area chart, orders `Table` + activity feed.
  - **Settings** (`settings.tsx`) — personal **account** page w/ sticky in-page TOC + danger zone, distinct from split-rail's workspace admin console. Heavy `Section`/`SettingRow` dogfood.
- `app/templates/{layout,page,[slug]/page}.tsx` — section shell, gallery, inspector (reskin bar + viewport switcher reused near-verbatim from `/layouts`).
- `/preview/[slug]` extended to merge archetype + template maps/params/metadata (one shared re-skin pipeline; `dynamicParams = false` kept; no slug collisions).
- Nav dock gains a **Templates** item (`AppWindow` icon); `content/search-index.ts` gains a Templates gallery entry + one per template.

### Dogfood refactor of docs pages (surgical, per AGENTS.md "compose primitives")
- **Props `<table>` → `Table` primitive** (`/docs/[slug]`) — the clean, non-regressive win; rows gain hover states for free.
- **Intro callouts → `Card`** (`/docs`) — the two `bg-brand/5` callouts now compose `Card`/`CardHeader`/`CardContent`, **brand tint preserved** (`className="border-brand/20 bg-brand/5"`), not flattened.
- **Deliberately left** (conversion would *regress*, not improve): the catalog grid's interactive `<Link>` cards (Card has no hover-lift/focus-ring), and the home page's glassy `bg-card/60 backdrop-blur` cards over the hero glow. Home is also outside the "docs pages" the request targeted. These are candidates for the visual pass, not blind edits.

### Verification (this phase)
- `npm run build` ✓ — routes include `/templates`, `/templates/[slug]`; TypeScript clean.
- `npm run test:ci` ✓ (exit 0) — 4525 tests pass; coverage-neutral (app pages add no registry items, so no test-gate change).
- Runtime smoke test — `/docs`, `/docs/[slug]`, `/templates`, `/templates/[slug]`, and the `/preview/<slug>` routes that actually render the template components all return **200** (no render crashes).

### Visual review (browser finally connected — partial pass)
Drove a fresh Chrome instance ("Laptop") after the original kept failing. Confirmed by screenshot:
- **Templates gallery** — nav dock shows Home · Docs · Components · Layouts · Templates (Templates active); all three live previews render.
- **Pricing** — brand-gradient headline, featured "Pro" card lifts with glow + ring + dark CTA, annual pricing active, brand-green checks. ✓
- **Dashboard** — sidebar app shell with active indicator, KPI deltas, brand-green hero chart, orders table w/ status dots, activity feed. ✓
- **Settings** — sticky TOC, gradient avatar, switch rows, danger zone. ✓ **Bug found + fixed:** the Timezone `Select` showed the raw value `pt` instead of "Pacific (US & Canada)" — Base UI `Select.Value` needs an `items` map on the Root; added it (now renders the label).
- **`/docs` intro** — breadcrumb reads "Docs"; the two callouts render correctly as `Card`s with the brand tint preserved (no layout regression).

Not yet eyeballed (extension disconnected mid-pass): the props `Table` on a `/docs/[slug]` page (built + smoke-tested 200; low risk) and an explicit dark-mode sweep (token-based, so dark mode derives for free). Resume when the extension reconnects.

## 5. Mobbin-style gallery redesign (Templates + Layouts)

Both galleries now share one clean, filterable shell (`app/_components/gallery.tsx`, client) modeled on Mobbin, with our tokens.

- **Filter bar:** Category + Component facets (FilterPill triggers + DropdownMenu checkbox items, `closeOnClick={false}` so the menu stays open while multi-selecting), removable active pills, "Clear all", a live count ("Showing N templates"), and a Featured / A–Z sort. **Functional** client-side filtering (verified: Category→Marketing filters to 1 template).
- **Cards:** preview-first (scaled iframe) + a seeded `GradientAvatar` mark + name + category. Minimal — tagline and component-chip rows dropped per the chosen direction.
- **Paid markers:** template cards show a price badge ($49/$59/$39); layouts have none (free patterns). Added `price` to `TemplateMeta`; renamed its `kind`→`category`. Added a `category` field to all 10 archetypes.
- **Distinct-from-Mobbin tweaks (user-selected):** a reveal-on-hover **"Inspect →"** affordance over each preview, and the **category rendered as a bordered token chip** rather than plain gray text. (Declined: brand-tinted chrome, faux browser top-bar.)

Verified by screenshot at multiple states: Templates + Layouts galleries, an open Category dropdown, an active filter, and the hover affordance. `npm run build` ✓ and `npm run test:ci` ✓ (4525 tests, coverage-neutral).

> Port note: the dev server hops ports (3000/3004…) because several of the user's Next apps run simultaneously — find it via the dev log, don't assume 3000.

## 6. Morphing search + theme reveal (SignalRoute technique)

**Navigation-morph search** (`app/_components/chrome/nav-dock.tsx`). The nav dock *is* the morph container: collapsed it's the nav pill; the ⌕ button or ⌘K blooms the same `--dock`-toned capsule — in place, centered, growing down — into a Spotlight panel (query field + live grouped, keyboard-navigable results + hints footer), then morphs back. Ported verbatim from SignalRoute's launcher: a fixed SLOT reserves the collapsed footprint; an absolute `overflow-hidden` container animates inline `width`/`height`/`border-radius` (explicit `cubic-bezier(.22,1,.36,1)` — a Tailwind `transition-[width,height]` class drops height); compact↔panel cross-fade with delays; a reflow seeds the "from" box; a `ResizeObserver` follows the panel's live height as results filter; `prefers-reduced-motion` → instant; Esc/click-away/⌘K. The old `CommandDialog` modal + `command-palette.tsx`/`search-button.tsx` were retired (the morph replaces them); the `open-command-palette` event still opens it.

**Theme-toggle reveal** (`nav-dock.tsx` + `app/globals.css`). The dock's theme toggle drives the swap through the **View Transitions API** and animates `::view-transition-new(root)` with an expanding `clip-path` circle anchored at the button's center — the incoming theme blooms outward from the trigger, same morph language. `flushSync` applies the theme inside the transition; feature-detected + reduced-motion fall back to an instant swap; globals.css disables the default cross-fade and stacks the incoming snapshot on top.

Verified by screenshot: search open (bloom) → type "gauge" (filters to 3, panel shrinks via the height-follow) → Esc (morphs back to nav); theme toggled light↔dark (reveal fires). `npm run build` ✓ and `npm run test:ci` ✓ (4525 tests, coverage-neutral).

## 7. Launcher → cross-product switcher

`app/_components/chrome/app-launcher.tsx` already had SignalRoute's morph; repurposed its panel from a component-category "Browse" grid into an **all-products switcher**. Header `byronwade · All products`; the current site (`byronwade/ui · Design system`) is pinned on top with a brand-tinted **Current** badge; a **Switch to** list then links out to every product — **byronwade.com** (brand "B" tile, "Main site"), **GoodMarks** (goodmarks.io), **SignalRoute** (getsignalroute.com), **Fakebase** (fakebase.byronwade.com), **Dits** (dits.byronwade.com), **Wormhole** (wormhole.byronwade.com) — each `target="_blank"` with its domain + an external-link arrow; GitHub + theme toggle stay in the footer. The `PRODUCTS` array is the single source of truth. Verified by screenshot. `npm run build` ✓ / `npm run test:ci` ✓ (4525 tests).

## 8. Follow-ups
- Resume visual pass via `switch_browser` once the extension cooperates — verify the 3 templates at desktop/tablet/mobile in light + dark, and the docs-page Card/Table refactor.
- Consider converting the deferred glassy home/catalog cards to `Card` *with* their bespoke classes once visually verifiable.
- A 4th template (Auth/sign-in) is a natural addition; centered-tool already demonstrates the split sign-in pattern.
- If external links to `/components*` exist, reconsider redirects (currently none).
