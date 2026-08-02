---
name: meridian-cinematic
description: Stage Meridian UI under cinematic design laws — one idea per frame, product as subject, paper/theater tiles, no scroll spectacle. Use for marketing stages, heroes, and product showcase frames.
---

# Meridian cinematic

Aesthetic list: **cinematic design**. Laws live in `lib/design/recipes.ts` → `cinematicLaws`.

## Laws (frozen)

1. Photograph / product is the subject — chrome recedes
2. One idea per frame — `defineCinemaFrame({ ideas: 1, … })`
3. **Full-bleed media** via `BleedImage` — never inset hero cards
4. Soft veil (`media-veil`) for legible type — no stickers on media
5. Soft warm neutrals — never pure white/black; one deep accent
6. Viewport `svh` — never `dvh`
7. Motion micro-only — no scroll choreography
8. Paper ↔ theater alternation for rhythm
9. Structured reading for long copy (`ReadingArticle`)

## Creative (encouraged)

- Which still / subject to stage
- Copy and narrative pacing
- Order of frames in a sequence
- Which proof whole to embed

## Workflow

1. Read `design.md` cinematic section.
2. Prefer `CinemaTile` + `CinemaLink` (`components/cinematic/tile.tsx`) — Apple-style stacked viewports.
3. One idea per tile. Centered sparse copy. Photograph edge-to-edge.
4. CTAs are quiet text links (“Learn more ›”), not fat button clusters.
5. Keep system docs off the film — link out to `/theme` and `/for-agents`.
6. Run `npm run check:design`.

## Anti-patterns

- Inset / rounded media cards in the hero
- Pure white or pure black fills
- Bright neon accents
- Stickers, chips, or badges on media
- Multiple competing headlines in one stage
