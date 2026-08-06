# Atlas — design.md

> **AI contract.** Read before any Atlas UI work. Deep DNA: [`docs/atlas.md`](../../docs/atlas.md).  
> Drift lint: `npm run check:design` · platform: `npm run check:platform` · contrast: `npm run check:contrast`.  
> Stack: [`docs/stack.md`](../../docs/stack.md) — law book · skills · CI gates · optional MCP.

**Product:** fail-closed developer-workbench design contract.  
**Not:** Harbor ops admin, Vellum reading lanes, or Meridian full cinema.  
**Primitives:** shadcn/ui. **Icons:** Phosphor `@/lib/icons`. **Color:** OKLCH only.

## The model — strict + creative

| Zone | Locked | Free |
| --- | --- | --- |
| **Frozen** | Tokens, mono data rules, keyboard-first chrome, bans, platform skeleton | — |
| **Creative** | — | Tooling IA, command taxonomy, domain objects, copy |

## Identity

| Key | Value |
| --- | --- |
| Name | Atlas |
| Accent | `--brand` — steel ink |
| Paper | Ink / cool steel neutrals |
| Feeling | Precise, sparse, keyboard-native |
| Cinema | **Subtle** at most |
| Default patterns | Command palette · mono metadata · desktop density |
| Skills | `atlas-theme` · `atlas-compose` · `atlas-workbench` · `atlas-surface` · `atlas-a11y` |

## Hard rules

### MUST

- OKLCH semantic tokens only
- Mono for paths, hashes, tool/model names, durations, ports
- Keyboard-first: visible shortcuts; labeled icon actions
- Desktop / application density — not marketing layouts
- Object-bound AI on files / tools / runs with `data-provenance`
- `edge` / `depth-*` — never `shadow-*`
- Icons via `@/lib/icons`
- Reuse approved primitives before inventing
- Pass `npm run validate` before done

### MUST NOT

- Purple Linear pastiche or Harbor status-chip ops as default
- Full Meridian theater frames as workbench chrome
- Hover-only critical actions
- hex / rgb / hsl / lucide / twin kits
- Fork platform MCP tools or JSON keys for Atlas alone

## Material

| Intent | Treatment |
| --- | --- |
| Path / meta | `font-mono text-xs tracking-tight` |
| Selected | `bg-brand/10` |
| Palette row | Dense, keyboard highlight, mono label |
| Panel | `rounded-2xl` + `edge` |
| Focus | `ring-ring` — weight over fill |

## Compose path

1. Read this file + [`AGENTS.md`](./AGENTS.md)
2. Open `atlas-compose` / `atlas-workbench`
3. Prefer list-resource + agent-rail + palette patterns
4. Add shadcn atoms as needed
5. `npm run check:design && npm run check:contrast`
6. Optional: contract MCP `validate_ui`

## Machine endpoints

- `/atlas/design.md` · `/atlas/agents.md` · `/atlas/architecture.md` · `/atlas/llms.txt`
- Kit: `/r/atlas.contract.json`
