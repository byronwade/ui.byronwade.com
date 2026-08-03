# Meridian — absorb checklist

> Before pasting influence research (Cursor.com, Framer, Linear marketing, …) into UI, fill this table.  
> Absorb **discipline**, never brand chrome. See [`influences.md`](./influences.md).

## Template

| Take (structure / behavior) | Leave (brand / spectacle) | Meridian encoding |
| --- | --- | --- |
| e.g. hairline depth | e.g. Cursor Orange CTA system | `edge` / `depth-*` |
| e.g. activity pastels scoped to agent UI | e.g. pastels as system accents | `activityRoles` + `ActivityLegend` |
| e.g. scarce primary CTA | e.g. second accent fill | `--brand` sparingly / `theater-ink` |

## Rules

1. **One accent** — anything brand-colored resolves to `--brand` (OKLCH presets in `lib/design/knobs.ts` only).  
2. **Lane laws** — application forbids gradient spotlight / collage; marketing forbids floating chat + scroll spectacle (`laneLaws`).  
3. **Shell rhythm** — spacing / sizing / type via `data-surface`, not off-scale pixels.  
4. **Interactive proofs** — use `defineInteractiveProof` (idle + selected; agent ⇒ `activityLegend: true`).  
5. **Gates** — `npm run check:design && check:shell && check:proofs && check:typeset && check:experience && check:contrast`.

## Do not open a UI PR until

- [ ] Absorb table filled (or “no new influence”)  
- [ ] Tokens / recipes updated if grammar changed  
- [ ] Live proof on `/theme` or `/surfaces` if interaction changed  
