# Meridian — agents.md

> **For AI agents.** Humans see a designed page at this URL; agents receive this markdown (`?raw=1` forces raw).

**Product:** cinematic theme system — not a custom component zoo.  
**Primitives:** shadcn/ui. **Icons:** Phosphor via `@/lib/icons`. **Color:** strict OKLCH. **Contrast:** WCAG AA (`npm run check:contrast`).

## Start here

1. [`design.md`](/design.md) — AI contract (MUST / MUST NOT, cinema laws, accessibility)
2. [`lib/design/`](/theme) — typed grammar, recipes, contrast pairs
3. This file — load order, skills, agents
4. [`architecture.md`](/architecture.md) — system layers
5. [`llms.txt`](/llms.txt) — discovery map

## Frozen vs creative

| Frozen | Creative |
| --- | --- |
| Color roles (OKLCH), radii, depths, surfaces | Copy / voice |
| Theme knobs, activity, provenance | Information architecture |
| Cinematic laws, contrast pairs, bans | Domain objects, frame sequence |
| | Which shadcn wholes to compose |

Agents invent **stories and compositions**. They do not invent **colors, shadows, or radii**.

## Load order

1. `design.md`
2. `lib/design/` (grammar · recipes · contrast · cx)
3. Matching skill under `.cursor/skills/`
4. Compose shadcn primitives into surface wholes
5. `npm run check:design && npm run check:contrast`

## Skills

| Skill | Use |
| --- | --- |
| `meridian-theme` | Re-skin knobs; keep one deep accent |
| `meridian-surface` | Pick `data-surface` + density |
| `meridian-compose` | Build product wholes from shadcn + grammar |
| `meridian-cinematic` | Full-bleed frames under cinematic laws |
| `meridian-a11y` | OKLCH + contrast audit on every UI change |

## Agents

| Agent | Use |
| --- | --- |
| `meridian-author` | Implement under design.md + lib/design |
| `meridian-reviewer` | Audit MUST / banned / cinema / contrast |

## Negotiated endpoints

| URL | Human | Agent |
| --- | --- | --- |
| `/design.md` | Designed contract | Raw markdown |
| `/agents.md` | Designed agents guide | Raw markdown |
| `/llms.txt` | Designed discovery | Raw text |
| `/architecture.md` | Designed architecture | Raw markdown |

Append `?raw=1` to force the machine representation in a browser.
