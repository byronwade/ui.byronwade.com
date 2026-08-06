---
name: atlas-a11y
description: Accessibility and contrast checklist for Atlas.
---

# Atlas a11y

Accessibility checklist for Atlas.

## Rules

1. WCAG AA body contrast — `npm run check:contrast` includes `atlas` skin.
2. Labels on every field; `aria-*` preserved on primitives.
3. Keyboard path for every critical action.
4. Focus visible: `ring-ring` / focus-visible styles.
5. Do not rely on color alone for status — pair with text/chip labels.
6. Streaming UI (Vellum) must not trap focus or jump scroll unexpectedly.

## Done

- Contrast gate green for atlas
- Keyboard + labels verified on new surfaces
