# Meridian — design DNA

Meridian is the design language for **ui.byronwade.com**. It is not a skin of Polaris, Vercel, Linear, Cursor, or OpenAI. It is a deliberate merge of what each does best — with a single identity that none of them own alone — staged with the cinematic craft of Apple, Tesla, and YouTube.

## The merge

| Source     | Take                                                     | Leave behind                         |
| ---------- | -------------------------------------------------------- | ------------------------------------ |
| Polaris    | Soft elevation, dense resource clarity, calm neutrals    | Green-as-brand, heavy admin chrome   |
| Vercel     | Typographic authority, mono for data, sparse craft       | Pure stark coldness                  |
| Linear     | Row density, selected states, keyboard-first scanning    | Purple accent, dark-only identity    |
| Cursor     | Object-bound AI, activity semantics, panel composition   | IDE darkness as the default skin     |
| OpenAI     | Conversational provenance, approachable message rhythm   | Soft chatbot cliché                  |

## Cinema — the sixth pillar

Meridian surfaces are not styleguide grids. They are **frames**.

| Source  | Take                                                              | Leave behind                    |
| ------- | ----------------------------------------------------------------- | ------------------------------- |
| Apple   | Product as the only subject. Scroll reveals one idea per frame.   | Glossy gadget fetish            |
| Tesla   | Confident dark theater. UI is sparse overlay on the product.      | Gamer HUD clutter               |
| YouTube | Media owns the viewport. Everything else is chrome around it.     | Autoplay noise / thumbnail soup |

### Cinematic laws

9. **Media owns the frame** — heroes and feature stages are full-bleed planes, not inset cards.
10. **One idea per frame** — a stage has one headline, one supporting line, one subject.
11. **Scroll is the cut** — motion reveals and scales subjects; it never decorates idle UI.
12. **Theater when earned** — dark `dock` stages for product moments; cool paper for operational work.
13. **No overlay stickers** — no floating badges, promo chips, or callout boxes on media.
14. **Respect stillness** — honor `prefers-reduced-motion`; meaning remains without motion.

## What Meridian is

**Operational editorial, staged like film.** Product density you can scan for hours, with the typographic confidence of a carefully set essay — introduced in full-bleed frames the way Apple reveals a product or YouTube fills the screen with media. Light-first for work. Dark theater for presence. One accent — **arc**, a steel-teal. Depth is Polaris-shaped but defaults to none. AI attaches to objects, never floats as decoration.

## Laws

1. **Tokens only** — no raw hex in components; use semantic utilities.
2. **One accent** — `--brand` (arc). Rings, charts, success, and selected states derive from it.
3. **Hierarchy from size + tracking** — not bold weight on display type.
4. **Mono for data** — IDs, counts, timestamps, prices, model names, tool params.
5. **Depth defaults to none** — corners + edge hairline first; `depth-soft` / `depth-raised` only when elevation is earned.
6. **Fixed shape vocabulary** — controls `rounded-full`; inputs `rounded-lg`; panels `rounded-2xl`; shells `rounded-3xl`.
7. **Object-bound AI** — every agent surface names a product object and shows state/provenance.
8. **Density by task** — indexes and tables stay compact; reading surfaces open up.
9. **Media owns the frame** — see Cinema above.
10. **One idea per frame**
11. **Scroll is the cut**
12. **Theater when earned**
13. **No overlay stickers**
14. **Respect stillness**

## Surfaces

| Surface              | Treatment                                      |
| -------------------- | ---------------------------------------------- |
| App chrome / tables  | `font-sans`, compact, tight tracking           |
| Docs / help          | `reading-ui` — 65ch, 16px, 1.6 lh               |
| Essays / manifesto   | `reading-prose` — 65ch, 18px, 1.7 lh            |
| Floating chrome      | `bg-dock text-dock-foreground` only            |
| Cinematic stage      | Full-bleed; `bg-dock` theater or paper work    |

## Why this is not a pastiche

Anyone can stack “Linear rows + Vercel type + Polaris cards” or slap a parallax hero on a docs site. Meridian binds operational systems with one accent, one depth model, one shape scale — and stages them with cinematic discipline so the site feels inevitable, not referential.
