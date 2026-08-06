# Atlas — agents.md

> **Strict AI operating manual.** Humans get designed pages; agents get this markdown (`?raw=1`).

**Product:** developer-workbench design contract — mono metadata, keyboard-first scanning.  
**Platform:** one contract in a family. Structure shared; aesthetics may differ.  
**DNA:** [`docs/atlas.md`](../../docs/atlas.md) · **Design:** [`DESIGN.md`](./DESIGN.md)  
**Stack:** law book · skills · CI gates · optional MCP — [`docs/stack.md`](../../docs/stack.md)

---

## 0. Hard rules (fail closed)

| MUST | MUST NOT |
| --- | --- |
| Read DESIGN.md + this file first | Invent colors, radii, depths, shadows |
| OKLCH semantic tokens only | hex / rgb / hsl / arbitrary color utils |
| Mono for tooling data | Purple / warm-ops pastiche as default |
| Keyboard-first chrome | Hover-only critical actions |
| shadcn primitives + compose | Twin components / bespoke shells |
| Icons via `@/lib/icons` | `lucide-react` / direct Phosphor |
| `edge` / `depth-*` | Tailwind `shadow-*` |
| Object-bound AI + provenance | Floating chatbot chrome |
| Keep platform structure identical | Fork MCP tools / filenames / JSON keys |
| Pass gates below | Ship without design / contrast / platform audit |

**Frozen** = tokens, mono rules, keyboard chrome, bans, platform skeleton.  
**Creative** = tooling IA, command taxonomy, domain objects, copy.

---

## 1. Load order (mandatory)

1. [`docs/platform.md`](../../docs/platform.md)
2. [`docs/atlas.md`](../../docs/atlas.md)
3. [`DESIGN.md`](./DESIGN.md)
4. Skill `skills/atlas-*/SKILL.md`
5. Recipe (list-resource / agent-rail / settings-form)
6. Compose under `[data-contract="atlas"]`
7. Gates: `npm run check:platform && npm run check:design && npm run check:contrast`
8. Optional: contract MCP tools

Skip a step → drift.

---

## 2. Platform consistency (all contracts)

> **Design DNA may differ. Architecture must not.**  
> Edit structure in `lib/platform/skeleton.ts` for every contract — never Atlas alone.

**Agent stack:** law book + verified skills + CI gates required; contract MCP optional. [`/stack`](/stack).

| Concern | Edit here only |
| --- | --- |
| MCP / routes / machine files | `lib/platform/skeleton.ts` |
| Atlas OKLCH skin | `app/contract-skins.css` |
| Atlas aesthetic | `lib/contracts/dna/atlas.ts` + this law book |

### MUST NOT fork

- Atlas-only MCP tools or kit JSON shapes
- IDE-clone component zoos outside shadcn compose

---

## 3. Design influences → mapping

| Influence | Atlas mapping |
| --- | --- |
| Vercel tooling | Mono data, sparse craft |
| Linear | Keyboard scanning, selected wash |
| Cursor app | Object-bound AI, panel density |
| Meridian | Shared skeleton — **not** full cinema default |

---

## 4. Material laws (app chrome)

- Desktop density; command palette over mega-nav
- Mono paths / hashes / tool names
- Focus rings visible; shortcuts labeled
- Panels `rounded-2xl` + `edge`
- Subtle motion only — no theater heroes

---

## 5. Skills

| Skill | Use when |
| --- | --- |
| `atlas-theme` | Tokens, ink paper, closed prefs |
| `atlas-compose` | Screens from primitives |
| `atlas-workbench` | Palette, panels, tooling chrome |
| `atlas-surface` | Density lanes |
| `atlas-a11y` | Contrast + keyboard |

```bash
npx skills add byronwade/ui.byronwade.com --skill atlas-workbench
```

---

## 6. Agents

Author → reviewer:

1. Load DESIGN.md + `atlas-workbench`
2. Implement keyboard-first UI
3. Reviewer checks mono discipline + validate gates

---

## 7. Negotiated endpoints

- `/atlas/design.md` · `/atlas/agents.md` · `/atlas/architecture.md` · `/atlas/llms.txt`
- Kit: `/r/atlas.contract.json`
- Install: `/atlas/install`

---

## 8. Done gate

- [ ] DESIGN.md + this file loaded
- [ ] `atlas-*` skill followed
- [ ] Mono metadata + keyboard affordances present
- [ ] No cinema default / twin kits / raw color
- [ ] `check:design` + `check:contrast` + `check:platform` green
- [ ] Optional MCP `validate_ui` if tool-wired
