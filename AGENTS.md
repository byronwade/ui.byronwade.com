<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Meridian — agent entry

- **Obey the full operating manual:** [`agents.md`](./agents.md) — engineering protocol + design-contract law
- **North star:** [`docs/north-star.md`](./docs/north-star.md) — AI rule system, not a shell zoo
- **AI contract:** [`design.md`](./design.md) · **Grammar:** [`lib/design/`](./lib/design/)
- **Research specs:** [`/system`](./docs/influences.md) · **Skills:** [`/skills`](./skills/)

This file is a stub so Next.js / Claude default loaders land on Meridian.
Everything it would otherwise repeat lives in [`agents.md`](./agents.md) — load
order, skills, gates, and the working protocol. Do not restate them here.

Two rules that survive even if nothing else is read:

- Do not invent color, radius, depth, type scales, or cinema laws — import from `@/lib/design`.
- Do not invent twin components or app shells — compose shadcn + frozen presets.

```bash
npm run validate                              # every gate + lint
npx skills add byronwade/ui.byronwade.com     # install the skills
```
