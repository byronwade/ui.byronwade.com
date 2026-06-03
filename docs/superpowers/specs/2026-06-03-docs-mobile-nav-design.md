# Mobile docs navigation — hamburger + MorphDock panel

**Date:** 2026-06-03 · **Status:** Approved, building

## Problem
The docs sidebar (`app/(docs)/layout.tsx` `<aside class="hidden … lg:block">` → `SiteNav`)
is inaccessible below `lg`. Mobile/tablet users can't navigate the docs.

## Design (approved)
A `DocsNavDock` app component (docs chrome, not a registry item) rendered in the docs
layout, `fixed bottom-4 left-4 z-50 lg:hidden`. It's a **MorphDock**:
- A single hamburger item (icon-only, `expandable={false}`) toggles a controlled `open`.
- Blooms **`SiteNav`** as the panel: `placement="top"`, `origin="start"`,
  `tone="surface"` (so SiteNav's foreground/muted text reads on the light panel),
  `panelTitle="Documentation"`, fixed `panelHeight` → the body scrolls (`overflow-auto`),
  `panelWidth ≈ 264`.
- Auto-closes on navigation (pathname change), Esc, and click-away (MorphDock built-ins).
- Desktop `<aside>` unchanged.

## Decisions
- Reuse MorphDock (dogfoods our morph component, matches floating-chrome aesthetic).
- Show below `lg` (exactly when the aside hides).
- `tone="surface"` for legibility of the ported light-theme `SiteNav`.

## Testing
App-chrome component (not a registry item) → no per-component test mandate; verified
by rendering the docs at a mobile width. `npm run test:ci` stays green (no registry change).

## Out of scope
Replacing the desktop sidebar; changing `SiteNav` content.
