<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — Meridian

Design site for Byron Wade. Design language: **Meridian** (`docs/meridian.md`).

## Stack

- Next.js 16 App Router + Turbopack
- React 19 + React Compiler
- **shadcn/ui** (Radix Nova) — all UI primitives
- Tailwind CSS v4 + Geist Sans / Geist Mono
- TypeScript, ESLint

## Design laws (short)

1. Build on shadcn components in `components/ui/`
2. Tokens only — one accent `--brand` (steel-teal)
3. Hierarchy from size + tracking
4. Mono for data
5. Depth defaults to none + `edge`
6. AI is object-bound
7. **Cinema = styling, not spectacle** — full-bleed stages, simple CSS fades only, no scroll choreography

## Where things go

- Pages → `app/`
- shadcn primitives → `components/ui/`
- Cinematic layout helpers → `components/cinematic/`
- Site sections → `components/home/`, `components/`
- Helpers → `lib/`
- Design DNA → `docs/meridian.md`
