<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ui.byronwade.com — Meridian (AI-native)

**Before any UI work, read [`design.md`](./design.md).**  
Architecture: [`docs/architecture.md`](./docs/architecture.md). Deep DNA: [`docs/meridian.md`](./docs/meridian.md).

This site is a **theme showcase for AIs** — not a custom component catalog. shadcn owns primitives; Meridian owns theme, surfaces, skills, and agents.

## Stack

- Next.js 16 + React 19 + React Compiler
- **shadcn/ui** in `components/ui/`
- Tokens in `app/globals.css`
- Surfaces via `data-surface`

## AI toolchain

| Kind | Path |
| --- | --- |
| Contract | `design.md` |
| Rule | `.cursor/rules/meridian.mdc` |
| Skills | `.cursor/skills/*/SKILL.md` |
| Agents | `.cursor/agents/*.md` |

### Skills

- `meridian-theme` — re-skin / theme knobs
- `meridian-surface` — pick surface + density
- `meridian-compose` — build product wholes

### Agents

- `meridian-author` — implement under design.md
- `meridian-reviewer` — audit MUST / MUST NOT

## Laws (short)

1. Obey `design.md`
2. Tokens only; one `--brand`
3. shadcn only — never fork a parallel kit
4. `data-surface` for density
5. Compose wholes; prove on `/theme` + `/surfaces`
6. Object-bound AI; cinema = styling not spectacle

## Where things go

| Path | Role |
| --- | --- |
| `design.md` | AI contract |
| `docs/architecture.md` | Layer map |
| `app/globals.css` | Theme tokens |
| `components/ui/` | shadcn primitives |
| `components/surfaces/` | Wholes / proofs |
| `.cursor/skills/` | Agent skills |
| `.cursor/agents/` | Agent roles |
| `app/theme/` | Theme showcase |
| `app/for-agents/` | Agent onboarding |
