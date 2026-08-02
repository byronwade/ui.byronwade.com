# ui.byronwade.com

**Meridian** — an AI-native **theme** and surface system on [shadcn/ui](https://ui.shadcn.com).

This site showcases the theme (tokens, density, surfaces) and the toolchain that lets agents author on-brand UI. It is **not** a custom component zoo.

| For | Start here |
| --- | --- |
| Agents | [`design.md`](./design.md) · [`/for-agents`](http://localhost:3000/for-agents) |
| Theme | [`/theme`](http://localhost:3000/theme) |
| Surfaces | [`/surfaces`](http://localhost:3000/surfaces) |
| Architecture | [`docs/architecture.md`](./docs/architecture.md) |

## AI toolchain

| Kind | Path |
| --- | --- |
| Contract | `design.md` |
| Rule | `.cursor/rules/meridian.mdc` |
| Skills | `.cursor/skills/meridian-{theme,surface,compose}/` |
| Agents | `.cursor/agents/meridian-{author,reviewer}.md` |
| Discovery | `public/llms.txt` → `/llms.txt` |

Mirrored under `.claude/` for Claude Code.

## Stack

- Next.js 16 · React 19 · React Compiler
- shadcn/ui · Tailwind CSS v4 · Geist

## Getting started

```bash
npm install
npm run dev
```

## Add primitives

```bash
npx shadcn@latest add [component]
```

Theme personality lives in `app/globals.css` — override `--brand` to re-skin.
