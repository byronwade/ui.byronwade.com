---
name: meridian-cinematic
description: Stage Meridian UI under cinematic design laws — one idea per frame, product as subject, paper/theater tiles, no scroll spectacle. Use for marketing stages, heroes, and product showcase frames.
---

# Meridian cinematic

Aesthetic list: **cinematic design**. Laws live in `lib/design/recipes.ts` → `cinematicLaws`.

## Laws (frozen)

1. Product / workbench is the subject — chrome recedes
2. One idea per frame — `defineCinemaFrame({ ideas: 1, … })`
3. Full-bleed media — not inset cards
4. No overlay stickers on media
5. Viewport `svh` — never `dvh`
6. Motion micro-only — no scroll choreography
7. Paper ↔ theater alternation for rhythm
8. Type weight medium-max

## Creative (encouraged)

- What the subject *is* (domain)
- Copy and narrative pacing
- Order of frames in a sequence
- Which proof whole to embed (workbench, shell, …)

## Workflow

1. Read `design.md` cinematic section.
2. Import `defineCinemaFrame` from `@/lib/design`.
3. Use `Stage` + optional `MediaPlane` from `components/cinematic/`.
4. Keep application chrome on `tone="paper"`; earn `theater`.
5. Run `npm run check:design`.

## Anti-patterns

- Scroll-jacking / pinned storyboards
- Stickers, chips, or badges on media
- Multiple competing headlines in one stage
- Naming other brands in the frame
