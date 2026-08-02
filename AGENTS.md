<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — Meridian

Design language: **Meridian**. Full DNA: `docs/meridian.md`.

## Stack

- Next.js 16 + React 19 + React Compiler
- **shadcn/ui** (Radix Nova) in `components/ui/`
- Tailwind CSS v4 · Geist Sans / Mono
- Surfaces: Application · Marketing · Mobile Native · Desktop Native

## Laws (short)

1. Build on shadcn — never fork a parallel kit
2. One accent `--brand`; tokens only
3. Four surfaces via `data-surface` — same components, remapped density
4. Web Application is the default lane
5. Marketing may use theater; apps almost never do
6. Cinema = styling, not spectacle (no scroll choreography / blend jank)
7. Mono for data; hierarchy from size + tracking
8. Depth: `edge` first

## Where things go

| Path | Role |
| --- | --- |
| `components/ui/` | shadcn primitives |
| `components/surfaces/` | Surface shells & frames |
| `components/cinematic/` | Stage / media plane |
| `app/surfaces/` | Live surface gallery |
| `docs/meridian.md` | Design DNA |
