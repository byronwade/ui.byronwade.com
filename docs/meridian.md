# Meridian — design DNA

Meridian is the design language for **ui.byronwade.com**. It merges Polaris, Vercel, Linear, Cursor, and OpenAI into one identity — staged with cinematic *styling* (Apple / Tesla / YouTube framing) on top of **shadcn/ui**.

## Foundation

**Everything builds on shadcn.** Primitives live in `components/ui/` (Button, Card, Table, Dialog, …). Meridian is tokens + composition + cinematic stage rules — not a parallel component library.

## The merge

| Source     | Take                                                     | Leave behind                         |
| ---------- | -------------------------------------------------------- | ------------------------------------ |
| Polaris    | Soft elevation, dense resource clarity, calm neutrals    | Green-as-brand, heavy admin chrome   |
| Vercel     | Typographic authority, mono for data, sparse craft       | Pure stark coldness                  |
| Linear     | Row density, selected states, keyboard-first scanning    | Purple accent, dark-only identity    |
| Cursor     | Object-bound AI, activity semantics, panel composition   | IDE darkness as the default skin     |
| OpenAI     | Conversational provenance, approachable message rhythm   | Soft chatbot cliché                  |

## Cinema — styling, not spectacle

| Source  | Take                                                            | Leave behind                         |
| ------- | --------------------------------------------------------------- | ------------------------------------ |
| Apple   | Product as the only subject. One idea per frame.                | Scroll-jacking product films         |
| Tesla   | Confident dark theater. Sparse chrome on the product.           | Animated HUD clutter                 |
| YouTube | Media owns the viewport.                                        | Autoplay / thumbnail soup            |

### Cinematic laws

9. **Media owns the frame** — full-bleed stages, not inset marketing cards.
10. **One idea per frame** — one headline, one line, one subject.
11. **Style over spectacle** — atmosphere from light, grain, veil, and type. No scroll choreography, parallax, or sticky opacity plays.
12. **Simple motion only** — short CSS fades (`animate-in fade-in`). Honor `prefers-reduced-motion`.
13. **Theater when earned** — dark `dock` stages for presence; cool paper for work.
14. **No overlay stickers** — no floating badges or promo chips on media.

## Laws

1. **Tokens only** — no raw hex in components.
2. **One accent** — `--brand` (arc). Primary, ring, success, selected derive from it.
3. **Hierarchy from size + tracking** — not bold display weight.
4. **Mono for data** — IDs, counts, timestamps, prices, model/tool names.
5. **Depth defaults to none** — `edge` first; `depth-soft` / `depth-raised` sparingly.
6. **Shape vocabulary** — prefer shadcn radii; marketing CTAs may use `rounded-full`.
7. **Object-bound AI** — provenance + activity tokens.
8. **Density by task** — compact indexes; open reading lanes.
9–14. **Cinema** — see above.

## Surfaces

| Surface           | Treatment                                   |
| ----------------- | ------------------------------------------- |
| App chrome        | shadcn + cool paper                         |
| Docs              | `reading-ui`                                |
| Essays            | `reading-prose`                             |
| Cinematic stage   | Full-bleed `bg-dock` theater or paper work  |
