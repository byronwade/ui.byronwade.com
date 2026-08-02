<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — Meridian (cinematic · typed)

**Before UI work:** [`design.md`](./design.md) → [`lib/design/`](./lib/design/).  
Architecture: [`docs/architecture.md`](./docs/architecture.md).

Theme showcase for AIs. Aesthetic: **cinematic design**. Enforcement: TypeScript grammar + `npm run check:design`.

## Frozen vs creative

- **Frozen:** color, radius, depth, surface, cinema laws, bans (`lib/design/grammar.ts`)
- **Creative:** copy, IA, domain, frame sequence, which shadcn wholes

## Stack

- Next.js 16 + React 19 + React Compiler
- shadcn/ui · tokens in `app/globals.css`
- Grammar in `lib/design/`

## Toolchain

| Kind | Path |
| --- | --- |
| Contract | `design.md` |
| Grammar | `lib/design/*` |
| Lint | `npm run check:design` |
| Rule | `.cursor/rules/meridian.mdc` |
| Skills | theme · surface · compose · **cinematic** |
| Agents | author · reviewer |

## Laws (short)

1. Obey `design.md` + import `@/lib/design` for structure
2. Cinematic: one idea/frame, product subject, `svh`, no stickers
3. Tokens only; one `--brand`
4. shadcn only — no parallel kit
5. `data-surface` for density
6. Object-bound AI; pass `check:design`
