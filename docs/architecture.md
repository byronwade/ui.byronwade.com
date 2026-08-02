# Meridian — architecture for AIs

Meridian is a **cinematic, typed theme system**. The site showcases the theme; TypeScript + lint stop agents from drifting; creativity stays in composition and content.

## Research → system

| Finding | Our response |
| --- | --- |
| Agents fabricate tokens ([Superdesign](https://superdesign.dev/blog/ai-design-system-drift), [Hardik Pandya](https://hvpandya.com/llm-design-systems)) | Closed unions in `lib/design/grammar.ts` |
| Docs ≠ code ≠ components | One grammar imported by UI + audited by `check:design` |
| Creativity dies if everything is locked | Explicit **frozen vs creative** zones in `recipes.ts` |
| Cinematic product sites subordinate chrome to subject ([Apple DESIGN.md patterns](https://github.com/VoltAgent/awesome-design-md)) | `cinematicLaws` + `defineCinemaFrame` |
| Compose, don’t invent components ([Puck / schema UI gen](https://puckeditor.com/blog/top-5-ai-tools-for-ui-generation)) | shadcn atoms + surface wholes |

## North star

```
design.md  →  lib/design (typed)  →  tokens CSS  →  shadcn  →  cinema wholes
     ↑              ↑ check:design                    ↑
  contract      compile-time + CI                 /theme proof
```

## Frozen vs creative

```
FROZEN                          CREATIVE
─────────────────────────       ─────────────────────────────
colorRoles                      copy / voice
radii / depths                  information architecture
surfaces / themeKnobs           domain objects (issues, orders…)
activity / provenance           frame sequence (still ideas: 1 each)
cinematicLaws / banned          which shadcn wholes to compose
```

## Layers

| Layer | Path |
| --- | --- |
| Contract | `design.md` |
| Typed grammar | `lib/design/grammar.ts` |
| Recipes | `lib/design/recipes.ts` |
| Helpers | `lib/design/cx.ts` |
| Drift lint | `scripts/check-design.mjs` → `npm run check:design` |
| Tokens | `app/globals.css` |
| Primitives | `components/ui/*` (shadcn) |
| Wholes | `components/surfaces/*` |
| Skills / agents | `.cursor/skills` · `.cursor/agents` |

## Toolchain

| Kind | Role |
| --- | --- |
| Rule | Always-on short law |
| Skill | Task workflow (`meridian-theme`, `meridian-surface`, `meridian-compose`, `meridian-cinematic`) |
| Agent | `meridian-author` / `meridian-reviewer` |
| Lint | Fails CI / local on banned patterns |

## Website

| Route | Job |
| --- | --- |
| `/` | Cinematic positioning |
| `/design.md` · `/design` | Contract — HTML for humans, markdown for agents |
| `/agents.md` · `/for-agents` | Agents guide — negotiated |
| `/llms.txt` · `/llms` | Discovery — negotiated |
| `/architecture.md` · `/architecture` | Architecture — negotiated |
| `/theme` · `/surfaces` | Showcase |

## Extension

1. New token role → add to `grammar.ts` + CSS + `cx.ts` maps (same PR).
2. New ban → `banned` + `check-design.mjs` rule.
3. New skill when a workflow repeats three times.
4. Keep MUST list short — raise the floor, don’t write a novel.
