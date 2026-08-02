<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — Meridian

Design language: **Meridian**. Full DNA: `docs/meridian.md`. Sources: `docs/sources.md`.

## Stack

- Next.js 16 + React 19 + React Compiler
- **shadcn/ui** in `components/ui/`
- Surfaces: Application · Marketing · Mobile Native · Desktop Native

## Controlled principles (short)

1. **Useful** — solve real tasks; every control earns its place (Vercel)
2. **Meaningful** — color/depth/icons have role, not decoration (Polaris Pro)
3. **Density by task** — compact for indexes; room for focus; surfaces remap via `data-surface`
4. **Predictable** — same look → same behavior; micro feedback only
5. **Parts + wholes** — tokens → shadcn atoms → workbench/surfaces as proof (Frost)
6. **Progressive disclosure** — complexity available, not required

## Composition rule

**Embody the system — don’t label influences.** Prefer one workbench (density + mono + ⌘K + object-bound AI + edge) over pages that name other brands.

Canonical composition: `components/surfaces/workbench.tsx`.

## Laws (short)

1. Build on shadcn — never fork a parallel kit
2. One accent `--brand`; tokens only; status stays semantic
3. Four surfaces via `data-surface`; Application is default
4. Cinema = styling, not spectacle
5. Mono for data; hierarchy from size + tracking
6. Depth: `edge` first; quieter chrome
7. AI is object-bound with provenance

## Where things go

| Path | Role |
| --- | --- |
| `app/globals.css` | Tokens |
| `components/ui/` | shadcn primitives |
| `components/surfaces/` | Workbench, shells, frames |
| `components/cinematic/` | Stage / media plane |
| `components/home/` | Marketing homepage |
| `app/surfaces/` | Surface gallery |
| `docs/meridian.md` | Design DNA |
| `docs/sources.md` | Designer sources |
