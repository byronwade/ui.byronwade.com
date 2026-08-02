<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — Meridian (cinematic · typed)

**Before UI work:** [`design.md`](./design.md) → [`lib/design/`](./lib/design/).  
Architecture: [`docs/architecture.md`](./docs/architecture.md).

Theme showcase for AIs. Aesthetic: **cinematic design** — soft warm neutrals, one deep accent, full-bleed media, structured reading.

## Frozen vs creative

- **Frozen:** neutrals, one accent, radius, depth, surface, cinema laws, bans
- **Creative:** copy, IA, domain, frame sequence, which shadcn wholes

## Laws (short)

1. Obey `design.md` + `@/lib/design`
2. Soft neutrals — never pure white/black; one deep `--brand`
3. Full-bleed via `BleedImage`; reading via `ReadingArticle`
4. Cinema: one idea/frame, `svh`, no stickers
5. shadcn only; icons from `@/lib/icons` (Phosphor); `data-surface` for density
6. Pass `npm run check:design`
