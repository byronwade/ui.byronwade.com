---
name: meridian-surface
description: Choose and apply Meridian data-surface lanes — application, marketing, mobile, desktop density remaps. Use when building a screen and deciding chrome, hit targets, or theater rules.
---

# Meridian surfaces

Density follows the **task**, not aesthetics. One component set; surfaces remap via `data-surface`.

## Lanes

| Value | Default when |
| --- | --- |
| `application` | App / admin / tools / AI workbench (default) |
| `marketing` | Landing, docs heroes, brand presence |
| `mobile` | Thumb-first native-style product UI |
| `desktop` | Compact desktop chrome / IDE-like shells |

## Apply

```tsx
import { Surface } from "@/components/surfaces/surface"

<Surface id="application" className="…">
  …
</Surface>
```

Or set `data-surface="application"` on a root element. Remaps live in `app/globals.css`.

## Rules

1. Never fork Button/Card/Table per surface — use size props + tokens.
2. Theater (`tone="theater"`, full-bleed media) is for marketing presence, not app chrome.
3. Native lanes borrow OS grammar (safe areas, 44px touch, tight toolbars) — still Meridian tokens.
4. Unsure → `application`.

## Proof

- Gallery: `/surfaces`
- Canonical whole: `components/surfaces/workbench.tsx`
