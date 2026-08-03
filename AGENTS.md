<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Meridian — agent entry

**Obey the full operating manual:** [`agents.md`](./agents.md)  
**AI contract:** [`design.md`](./design.md) · **Grammar:** [`lib/design/`](./lib/design/)  
**Research specs:** [`/system`](./docs/influences.md) · **Skills:** [`/skills`](./skills/)

This file is a stub so Next.js / Claude default loaders land on Meridian.  
Do not invent color, radius, depth, or cinema laws — import from `@/lib/design`.

## Load order (must)

1. `design.md` + `lib/design/`
2. Relevant skill under `skills/meridian-*`
3. Surface proof (`Workbench` / `ComposerShell`) when composing product UI
4. `npm run check:design` + `check:shell` + `check:contrast` before done

## Skill loop

| Skill | Prove on site |
| --- | --- |
| `meridian-theme` | `/theme` |
| `meridian-surface` | `/surfaces` |
| `meridian-compose` | `/surfaces#proofs` |
| `meridian-cinematic` | `/` home film |
| `meridian-a11y` | `/theme#contrast` |

Install: `npx skills add byronwade/ui.byronwade.com`
