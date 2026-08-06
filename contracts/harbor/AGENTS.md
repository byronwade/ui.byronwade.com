# Harbor — agents.md

> **Strict AI operating manual.** Humans get designed pages; agents get this markdown (`?raw=1`).

**Product:** ops-admin design contract — dense indexes, quiet chrome, semantic status.  
**Platform:** one contract in a family. Structure shared; aesthetics may differ.  
**DNA:** [`docs/harbor.md`](../../docs/harbor.md) · **Design:** [`DESIGN.md`](./DESIGN.md)  
**Stack:** law book · skills · CI gates · optional MCP — [`docs/stack.md`](../../docs/stack.md)

---

## 0. Hard rules (fail closed)

| MUST | MUST NOT |
| --- | --- |
| Read DESIGN.md + this file first | Invent colors, radii, depths, shadows |
| OKLCH semantic tokens only | hex / rgb / hsl / arbitrary color utils |
| One accent → `--brand` | Status-as-brand washes |
| Semantic status chips | Cinema / theater / overlay stickers |
| shadcn primitives + compose | Twin components / bespoke shells |
| Icons via `@/lib/icons` | `lucide-react` / direct Phosphor |
| `edge` / `depth-*` | Tailwind `shadow-*` |
| Own empty / loading / error | Demo-only happy paths |
| Keep platform structure identical | Fork MCP tools / filenames / JSON keys |
| Pass gates below | Ship without design / contrast / platform audit |

**Frozen** = tokens, radii, depths, status semantics, density, bans, platform skeleton.  
**Creative** = copy, IA, domain objects, which recipe to compose.

---

## 1. Load order (mandatory)

1. [`docs/platform.md`](../../docs/platform.md) — shared architecture
2. [`docs/harbor.md`](../../docs/harbor.md) — DNA
3. [`DESIGN.md`](./DESIGN.md) — this contract’s laws
4. Matching skill under `skills/harbor-*/SKILL.md`
5. Task recipe (`list-resource` first for indexes)
6. Compose shadcn under `[data-contract="harbor"]`
7. Gates: `npm run check:platform && npm run check:design && npm run check:contrast`
8. Optional: contract MCP `get_contract` / `validate_ui`

Skip a step → drift.

---

## 2. Platform consistency (all contracts)

> **Design DNA may differ. Architecture must not.**  
> Change filenames / MCP tools / JSON keys / route slots in `lib/platform/skeleton.ts` for **every** contract.

**Skins:** `/{id}/**` wraps in `ContractFrame` → `[data-contract="{id}"]` from `app/contract-skins.css`.  
**Agent stack:** law book + verified skills + CI gates required; contract MCP optional. See [`/stack`](/stack).

| Concern | Edit here only |
| --- | --- |
| MCP tool names / jobs | `lib/platform/skeleton.ts` |
| Machine filenames / route slots | skeleton `MACHINE_FILES` / `ROUTE_SLOTS` |
| Per-contract OKLCH | `app/contract-skins.css` |
| Harbor aesthetic | `lib/contracts/dna/harbor.ts` + this law book |

### MUST NOT fork

- Harbor-only MCP tools or JSON shapes
- Twin component kits “just for ops”
- Skipping `check:platform` because “preview”

---

## 3. Design influences → mapping

| Influence | Harbor mapping |
| --- | --- |
| Polaris | Dense indexes, calm paper, status honesty |
| Linear | Row density, selected `bg-brand/10` |
| Vercel | Mono metadata, sparse craft |
| Meridian | Shared skeleton + gates — **not** cinema |

Absorb; never label influence brands in UI.

---

## 4. Material laws (app chrome)

- Controls `rounded-lg` · pills `rounded-full` · panels `rounded-2xl`
- Hover `bg-muted/30` · selected `bg-brand/10`
- Status chips semantic only
- Depth: `edge` → `depth-soft` → `depth-raised`
- No full-bleed media heroes on ops routes

---

## 5. Skills

| Skill | Use when |
| --- | --- |
| `harbor-theme` | Tokens, brand, paper, closed prefs |
| `harbor-compose` | Product screens from primitives |
| `harbor-ops` | Indexes, status, detail workflows |
| `harbor-surface` | `data-surface` density lanes |
| `harbor-a11y` | Contrast + labels + keyboard |

```bash
npx skills add byronwade/ui.byronwade.com --skill harbor-compose
```

---

## 6. Agents

Prefer author → reviewer loop:

1. Author reads DESIGN.md + `harbor-compose` / `harbor-ops`
2. Implements recipe-first UI
3. Reviewer audits DNA bans + `npm run validate`

Cursor/Claude: install `harbor-*` skills; keep always-on platform rules.

---

## 7. Negotiated endpoints

- `/harbor/design.md` · `/harbor/agents.md` · `/harbor/architecture.md` · `/harbor/llms.txt`
- Kit: `/r/harbor.contract.json`
- Install UI: `/harbor/install`

---

## 8. Done gate

- [ ] DESIGN.md + this file loaded
- [ ] `harbor-*` skill followed (compose/ops)
- [ ] Recipe chosen (default `list-resource` for indexes)
- [ ] Tokens / radii / depth from kit only
- [ ] No cinema / twin kits / raw color
- [ ] `npm run check:design` + `check:contrast` + `check:platform` green
- [ ] Optional MCP `validate_ui` if tool-wired
