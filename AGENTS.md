<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — Meridian

Design site for Byron Wade. The design language is **Meridian** — see `docs/meridian.md`.

## Stack

- Next.js 16 App Router + Turbopack
- React 19 + React Compiler
- Tailwind CSS v4 + Geist Sans / Geist Mono
- TypeScript, ESLint

## Design laws (short)

1. Tokens only — no raw color in components
2. One accent: `--brand` (steel-teal arc); success/ring/selected derive from it
3. Hierarchy from size + tracking, not bold display weight
4. Mono for data (IDs, counts, timestamps, prices, model/tool names)
5. Depth defaults to none + `edge`; use `depth-soft` / `depth-raised` sparingly
6. Shape scale: controls `rounded-full`, inputs `rounded-lg`, panels `rounded-2xl`, shells `rounded-3xl`
7. AI is object-bound with `data-provenance` and activity tokens
8. Light-first cool paper — not warm cream, not dark-default
9. **Cinema** — media owns the frame; one idea per cut; scroll is the edit; theater (`bg-dock`) when earned; no overlay stickers; honor `prefers-reduced-motion`

## Where things go

- Pages → `app/`
- UI primitives → `components/ui/`
- Cinematic primitives → `components/cinematic/`
- Site chrome / sections → `components/`
- Helpers → `lib/`
- Design DNA → `docs/meridian.md`
