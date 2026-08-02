# Meridian — architecture for AIs

Meridian is an **AI-native theme system**. The website showcases the *theme and surfaces*, not a handmade component catalog. shadcn owns primitives; Meridian owns tokens, surface contracts, agents, and skills so models can author consistent UI.

## North star

```
design.md  →  tokens + surfaces  →  shadcn atoms  →  product wholes
     ↑                ↑                              ↑
  AI contract     theme knobs              workbench / frames
```

Humans browse `/theme` and `/surfaces`. Agents load `design.md`, then skills.

## Layers

| Layer | Path | Owner | AI rule |
| --- | --- | --- | --- |
| Contract | `design.md` | Hand | Obey MUST / MUST NOT |
| Deep DNA | `docs/meridian.md` | Hand | Read when unsure |
| Sources | `docs/sources.md` | Hand | Discipline citations |
| Tokens | `app/globals.css` | Hand | Reskin via CSS vars |
| Primitives | `components/ui/*` | shadcn CLI | Add, don’t fork |
| Wholes | `components/surfaces/*` | Hand | Compose, prove |
| Cinema | `components/cinematic/*` | Hand | Marketing staging only |
| Skills | `.cursor/skills/*` | Hand | Task workflows |
| Agents | `.cursor/agents/*` | Hand | Multi-step roles |
| Rules | `.cursor/rules/*` | Hand | Always-on short law |

## Toolchain (Cursor / Claude / Codex)

| Kind | Role | Loads when |
| --- | --- | --- |
| **Rule** `.cursor/rules/meridian.mdc` | Always-on constraints | Every chat in this repo |
| **Skill** `.cursor/skills/<name>/SKILL.md` | Procedural workflow | Task matches description |
| **Agent** `.cursor/agents/<name>.md` | Role + checklist | Invoked for author / review |
| **design.md** | Source of truth | First file for any UI task |

Compatible skill roots also work if mirrored: `.claude/skills/`, `.agents/skills/`.

## Skills shipped

| Skill | Use |
| --- | --- |
| `meridian-theme` | Re-skin / apply theme knobs; keep accent DNA |
| `meridian-surface` | Choose `data-surface` + density |
| `meridian-compose` | Build a product whole from shadcn + tokens |

## Agents shipped

| Agent | Use |
| --- | --- |
| `meridian-author` | Implement UI end-to-end under design.md |
| `meridian-reviewer` | Audit a diff against MUST / MUST NOT |

## Website map (showcase, not catalog)

| Route | Job |
| --- | --- |
| `/` | Positioning: theme for AIs |
| `/theme` | Live token + density + brand showcase |
| `/surfaces` | Four surface proofs |
| `/for-agents` | How to load contract, skills, agents |
| `/design.md` | Raw contract |
| `/llms.txt` | Discovery for AI crawlers |

## What we intentionally don’t do

- Maintain a parallel component library beside shadcn
- Showcase “200 custom components” as the product
- Encode other brands’ names into UI chrome
- Let marketing theater leak into application density

## Extension path

1. Change theme → tokens in `globals.css` (and document knobs in `design.md` if new).
2. Need a primitive → `npx shadcn@latest add`.
3. Need a pattern → compose in `components/surfaces/` + prove on `/theme` or `/surfaces`.
4. Teach agents a new workflow → add `.cursor/skills/<slug>/SKILL.md`.
5. Keep `design.md` MUST list short — raise the floor, don’t grow a novel.
