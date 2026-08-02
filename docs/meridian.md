# Meridian — design DNA

Meridian is the design language for **ui.byronwade.com**. It is not a skin of Polaris, Vercel, Linear, Cursor, or OpenAI. It is a deliberate merge of what each does best — with a single identity that none of them own alone.

## The merge

| Source     | Take                                                     | Leave behind                         |
| ---------- | -------------------------------------------------------- | ------------------------------------ |
| Polaris    | Soft elevation, dense resource clarity, calm neutrals    | Green-as-brand, heavy admin chrome   |
| Vercel     | Typographic authority, mono for data, sparse craft       | Pure stark coldness                  |
| Linear     | Row density, selected states, keyboard-first scanning    | Purple accent, dark-only identity    |
| Cursor     | Object-bound AI, activity semantics, panel composition   | IDE darkness as the default skin     |
| OpenAI     | Conversational provenance, approachable message rhythm   | Soft chatbot cliché                  |

## What Meridian is

**Operational editorial.** Product density you can scan for hours, with the typographic confidence of a carefully set essay. Light-first. Cool paper, not warm cream. One accent — **arc**, a steel-teal that is neither Linear purple nor Polaris green. Depth is Polaris-shaped but defaults to none. AI attaches to objects, never floats as decoration.

## Laws

1. **Tokens only** — no raw hex in components; use semantic utilities.
2. **One accent** — `--brand` (arc). Rings, charts, success, and selected states derive from it.
3. **Hierarchy from size + tracking** — not bold weight on display type.
4. **Mono for data** — IDs, counts, timestamps, prices, model names, tool params.
5. **Depth defaults to none** — corners + edge hairline first; `depth-soft` / `depth-raised` only when elevation is earned.
6. **Fixed shape vocabulary** — controls `rounded-full`; inputs `rounded-lg`; panels `rounded-2xl`; shells `rounded-3xl`.
7. **Object-bound AI** — every agent surface names a product object and shows state/provenance.
8. **Density by task** — indexes and tables stay compact; reading surfaces open up.

## Surfaces

| Surface              | Treatment                                      |
| -------------------- | ---------------------------------------------- |
| App chrome / tables  | `font-sans`, compact, tight tracking           |
| Docs / help          | `reading-ui` — 65ch, 16px, 1.6 lh               |
| Essays / manifesto   | `reading-prose` — 65ch, 18px, 1.7 lh            |
| Floating chrome      | `bg-dock text-dock-foreground` only            |

## Why this is not a pastiche

Anyone can stack “Linear rows + Vercel type + Polaris cards.” Meridian binds them with one accent variable, one depth model, one shape scale, and a light-first paper that none of the five treat as primary. The site should feel inevitable — not referential.
