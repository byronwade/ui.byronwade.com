# Mobile docs navigation — hamburger + MorphDock panel

**Date:** 2026-06-03 · **Status:** Approved, building

## Problem
The docs sidebar (`app/(docs)/layout.tsx` `<aside class="hidden … lg:block">` → `SiteNav`)
is inaccessible below `lg`. Mobile/tablet users can't navigate the docs.

## Design (approved)
A `DocsNavDock` app component (docs chrome, not a registry item) rendered in the docs
layout, `fixed bottom-4 left-4 z-50 lg:hidden`. It's a **MorphDock**:
- A single hamburger item (icon-only, `expandable={false}`) toggles a controlled `open`.
- Blooms the docs nav as the panel: `placement="top"`, `origin="start"`,
  default **`tone="dock"`** (dark) so the pill + panel match the floating primary
  `NavDock` chrome, `panelTitle="Documentation"`, fixed `panelHeight` → the body
  scrolls (`overflow-auto`), `panelWidth ≈ 264`.
- Instead of reusing the light-theme `SiteNav`, it renders the same data
  (`guides` + `categories`/`byCategory`) with **dock tokens** — uppercase section
  labels (`text-dock-foreground/50`) + `dock-active` rows — mirroring `NavDock`'s
  search-panel styling, so the open panel reads as the same component.
- Auto-closes on navigation (pathname change), Esc, and click-away (MorphDock built-ins).
- Desktop `<aside>` (light `SiteNav`) unchanged.

## Decisions
- Reuse MorphDock (dogfoods our morph component, matches floating-chrome aesthetic).
- Show below `lg` (exactly when the aside hides).
- **`tone="dock"`** to match the primary `NavDock` (the light `surface` tone read as a
  different, mismatched component); dock-styled links instead of the light `SiteNav`.

## Testing
App-chrome component (not a registry item) → no per-component test mandate; verified
by rendering the docs at a mobile width. `npm run test:ci` stays green (no registry change).

## Out of scope
Replacing the desktop sidebar; changing `SiteNav` content.
