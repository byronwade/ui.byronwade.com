# Superpowers docs

Design specs and implementation plans for agent-driven work in this repo.

## Active

**Plans** (`plans/`) — in-progress or upcoming implementation work.

**Specs** (`specs/`) — approved designs not yet fully implemented.

Current focus areas:

- `2026-06-06-component-consolidation` — shared primitives (`metric`, `entity-row`, …)
- `2026-06-06-video-component-versatility` — video player/card API polish
- AI component catalog phases (`2026-06-04-ai-component-catalog-*`)
- TradingView / YouTube component families (`2026-06-05-*`)

## Archive

**`archive/plans/`** and **`archive/specs/`** — completed or merged work kept for history:

| Area                                | Archived                                                  |
| ----------------------------------- | --------------------------------------------------------- |
| Governance Phase C                  | `2026-06-04-governance-audit-report.md`                   |
| On-system lint + MCP + eval harness | `2026-06-03-*` plans/specs                                |
| Morph nav phases 1–2                | `2026-06-04-morph-nav-*`                                  |
| Component docs reference            | `2026-06-06-component-docs-reference*`                    |
| API cleanup phases 1–2              | `2026-06-06-component-api-cleanup-design.md`              |
| Activity ring, edge elevation       | `2026-06-03-activity-ring*`, `2026-06-03-edge-elevation*` |

When a plan lands on `main` and tests are green, move its plan + spec pair into `archive/`.
