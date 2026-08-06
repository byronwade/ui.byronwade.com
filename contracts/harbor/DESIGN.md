# Harbor — design.md

> **AI contract.** Read before any Harbor UI work. Deep DNA: [`docs/harbor.md`](../../docs/harbor.md).  
> Drift lint: `npm run check:design` · platform: `npm run check:platform` · contrast: `npm run check:contrast`.  
> Stack: [`docs/stack.md`](../../docs/stack.md) — law book · skills · CI gates · optional MCP.

**Product:** fail-closed ops-admin design contract.  
**Not:** Meridian cinema, Atlas workbench, or Vellum reading lanes.  
**Primitives:** shadcn/ui. **Icons:** Phosphor `@/lib/icons`. **Color:** OKLCH only.

## The model — strict + creative

| Zone | Locked | Free |
| --- | --- | --- |
| **Frozen** | Tokens, radii, depth, status semantics, density, bans, platform skeleton | — |
| **Creative** | — | Domain objects, IA, copy, which recipe/primitive to compose |

## Identity

| Key | Value |
| --- | --- |
| Name | Harbor |
| Accent | `--brand` — harbor green (ops) |
| Paper | Cool quiet paper |
| Feeling | Calm, trustworthy, scannable |
| Cinema | **None** |
| Default recipe | `list-resource` |
| Skills | `harbor-theme` · `harbor-compose` · `harbor-ops` · `harbor-surface` · `harbor-a11y` |

## Hard rules

### MUST

- OKLCH semantic tokens only
- One accent → `--brand`; selected = `bg-brand/10`
- Semantic status chips (warning / destructive / success) — never status-as-brand
- Dense indexes with stable row height + mono IDs
- `edge` / `depth-*` — never Tailwind `shadow-*`
- Icons via `@/lib/icons`
- Own empty / loading / error on resource surfaces
- Reuse approved primitives before inventing components
- Pass `npm run validate` before done

### MUST NOT

- Full-bleed cinema, theater tone, overlay stickers
- hex / rgb / hsl / arbitrary color utilities
- `lucide-react` or direct Phosphor imports
- Twin Button/Card/shell kits
- Marketing card grids as the primary index
- Fork MCP tools / filenames / JSON keys for Harbor alone

## Material

| Intent | Treatment |
| --- | --- |
| Index row | Compact, mono meta, hover `bg-muted/30`, selected `bg-brand/10` |
| Status | Chip + semantic token — not brand fill |
| Panel | `rounded-2xl` + `edge` |
| Control | `rounded-lg`, h-8/h-9 |
| Floating | `depth-soft` / `depth-raised` only when earned |

## Compose path

1. Read this file + [`AGENTS.md`](./AGENTS.md)
2. Open `harbor-compose` / `harbor-ops` skill
3. Prefer recipes: list-resource → object-detail → edit-record
4. `npx shadcn@latest add …` for missing atoms
5. `npm run check:design && npm run check:contrast`
6. Optional: contract MCP `validate_ui`

## Machine endpoints

- `/harbor/design.md` · `/harbor/agents.md` · `/harbor/architecture.md` · `/harbor/llms.txt`
- Kit: `/r/harbor.contract.json`
