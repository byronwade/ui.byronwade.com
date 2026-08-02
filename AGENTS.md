<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — Meridian

Design language: **Meridian**. Full DNA: `docs/meridian.md`.

## Stack

- Next.js 16 + React 19 + React Compiler
- **shadcn/ui** in `components/ui/`
- Surfaces: Application · Marketing · Mobile Native · Desktop Native

## Composition rule

**Embody the merge — don’t label it.** Prefer one workbench (density + mono + ⌘K + object-bound AI + edge) over pages that list Polaris / Linear / Vercel / Cursor / OpenAI.

Canonical composition: `components/surfaces/workbench.tsx`.

## Laws (short)

1. Build on shadcn — never fork a parallel kit
2. One accent `--brand`; tokens only
3. Four surfaces via `data-surface`
4. Web Application is the default lane
5. Cinema = styling, not spectacle
6. Mono for data; hierarchy from size + tracking
7. Depth: `edge` first
8. AI is object-bound with provenance

## Where things go

| Path | Role |
| --- | --- |
| `components/ui/` | shadcn primitives |
| `components/surfaces/` | Workbench, shells, frames |
| `components/cinematic/` | Stage / media plane |
| `components/home/` | Marketing homepage |
| `app/surfaces/` | Surface gallery |
| `docs/meridian.md` | Design DNA |
