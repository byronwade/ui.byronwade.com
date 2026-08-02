# ui.byronwade.com

**Meridian** — cinematic design theme for AIs, on [shadcn/ui](https://ui.shadcn.com).

Not a custom component zoo. **TypeScript grammar** freezes tokens; agents stay creative in composition and content.

| For | Start here |
| --- | --- |
| Agents | [`design.md`](./design.md) · [`lib/design/`](./lib/design/) · [`/for-agents`](http://localhost:3000/for-agents) |
| Skills | [`/skills`](http://localhost:3000/skills) · [`skills/`](./skills/) |
| Theme | [`/theme`](http://localhost:3000/theme) |
| Surfaces | [`/surfaces`](http://localhost:3000/surfaces) |

## Frozen vs creative

| Frozen | Creative |
| --- | --- |
| Color, radius, depth, surface, cinema laws | Copy, IA, domain, frame sequence |
| Enforced by types + `npm run check:design` | Encouraged |

## Toolchain

| Kind | Path |
| --- | --- |
| Contract | `design.md` |
| Grammar | `lib/design/*` |
| Lint | `npm run check:design` |
| Skills | `skills/meridian-*` (canonical; mirrored to `.cursor` / `.claude`) |
| Agents | `.cursor/agents/meridian-*` |

## Install skills (skills.sh)

```bash
npx skills add byronwade/ui.byronwade.com
npx skills add byronwade/ui.byronwade.com --skill meridian-theme
```

Listing on [skills.sh](https://skills.sh) is next — the `skills/` layout is already registry-ready.

## Scripts

```bash
npm run dev
npm run check:design
npm run build
```
