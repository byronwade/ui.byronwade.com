# Vellum — design.md

> **AI contract.** Read before any Vellum UI work. Deep DNA: [`docs/vellum.md`](../../docs/vellum.md).  
> Drift lint: `npm run check:design` · platform: `npm run check:platform` · contrast: `npm run check:contrast`.  
> Stack: [`docs/stack.md`](../../docs/stack.md) — law book · skills · CI gates · optional MCP.

**Product:** fail-closed reading-first design contract for docs, help, and measured prose.  
**Not:** Harbor ops indexes, Atlas workbench chrome, or Meridian cinema heroes.  
**Primitives:** shadcn/ui + typeset presets. **Icons:** Phosphor `@/lib/icons`. **Color:** OKLCH only.

## The model — strict + creative

| Zone | Locked | Free |
| --- | --- | --- |
| **Frozen** | Measure, typeset presets, reading lanes, bans, platform skeleton | — |
| **Creative** | — | Editorial IA, essay structure, help taxonomy, copy |

## Identity

| Key | Value |
| --- | --- |
| Name | Vellum |
| Accent | `--brand` — bronze mist |
| Paper | Mist reading ground |
| Feeling | Quiet scholarship, human, calm |
| Cinema | **Subtle** at most |
| Default | `reading-ui` / `reading-prose` / typeset presets |
| Skills | `vellum-theme` · `vellum-compose` · `vellum-reading` · `vellum-surface` · `vellum-a11y` |

## Hard rules

### MUST

- OKLCH semantic tokens only
- Long-form in `reading-ui` or `reading-prose` (or `typesetClass`)
- Measure ~65ch — never exceed 80ch
- Streaming-stable copy (no layout jump)
- Hierarchy from size + tracking — not `font-bold` display
- Serif only for essays (`reading-prose`)
- Icons via `@/lib/icons`
- Pass `npm run validate` before done

### MUST NOT

- Full-bleed `text-sm` essays or dashboard card grids as help home
- Bionic Reading / sepia gimmicks / activity pastels in prose
- Harbor dense indexes or Atlas IDE chrome as default
- hex / rgb / hsl / lucide / twin kits
- Fork platform MCP tools or JSON keys for Vellum alone

## Material

| Intent | Treatment |
| --- | --- |
| Docs / help | `reading-ui` — 65ch, 16px, 1.6 |
| Essays | `reading-prose` — 65ch, 18px serif, 1.7 |
| Chat | `typesetClass("chat")` + provenance |
| Demo break | `reading-demo-break` below prose |
| Chrome | Quiet sans — never long-form |

## Compose path

1. Read this file + [`AGENTS.md`](./AGENTS.md)
2. Open `vellum-compose` / `vellum-reading`
3. Pick typeset preset before styling tags
4. Add shadcn atoms for chrome only
5. `npm run check:design && npm run check:contrast`
6. Optional: contract MCP `validate_ui`

## Machine endpoints

- `/vellum/design.md` · `/vellum/agents.md` · `/vellum/architecture.md` · `/vellum/llms.txt`
- Kit: `/r/vellum.contract.json`
