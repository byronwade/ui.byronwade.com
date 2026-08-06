# Vellum — agents.md

> **Strict AI operating manual.** Humans get designed pages; agents get this markdown (`?raw=1`).

**Product:** reading-first design contract — typeset lanes, measured prose.  
**Platform:** one contract in a family. Structure shared; aesthetics may differ.  
**DNA:** [`docs/vellum.md`](../../docs/vellum.md) · **Design:** [`DESIGN.md`](./DESIGN.md)  
**Stack:** law book · skills · CI gates · optional MCP — [`docs/stack.md`](../../docs/stack.md)

---

## 0. Hard rules (fail closed)

| MUST | MUST NOT |
| --- | --- |
| Read DESIGN.md + this file first | Invent colors, radii, depths, shadows |
| OKLCH semantic tokens only | hex / rgb / hsl / arbitrary color utils |
| Typeset / reading lanes for long-form | Full-bleed `text-sm` essays |
| ~65ch measure (≤80ch) | Dashboard card grids as help home |
| Streaming-stable copy | Layout jump on token stream |
| Icons via `@/lib/icons` | `lucide-react` / direct Phosphor |
| `edge` / `depth-*` on chrome | `shadow-*` |
| Keep platform structure identical | Fork MCP tools / filenames / JSON keys |
| Pass gates below | Ship without design / contrast / platform audit |

**Frozen** = measure, typeset presets, reading laws, bans, platform skeleton.  
**Creative** = editorial IA, essay structure, help taxonomy, copy.

---

## 1. Load order (mandatory)

1. [`docs/platform.md`](../../docs/platform.md)
2. [`docs/vellum.md`](../../docs/vellum.md)
3. [`DESIGN.md`](./DESIGN.md)
4. Skill `skills/vellum-*/SKILL.md`
5. Typeset preset (`docs` / `chat` / `reading` / `compact`)
6. Compose under `[data-contract="vellum"]`
7. Gates: `npm run check:platform && npm run check:design && npm run check:contrast`
8. Optional: contract MCP tools

Skip a step → drift.

---

## 2. Platform consistency (all contracts)

> **Design DNA may differ. Architecture must not.**  
> Edit structure in `lib/platform/skeleton.ts` for every contract — never Vellum alone.

**Agent stack:** law book + verified skills + CI gates required; contract MCP optional. [`/stack`](/stack).

| Concern | Edit here only |
| --- | --- |
| MCP / routes / machine files | `lib/platform/skeleton.ts` |
| Vellum OKLCH skin | `app/contract-skins.css` |
| Vellum aesthetic | `lib/contracts/dna/vellum.ts` + this law book |

### MUST NOT fork

- Vellum-only MCP tools or kit JSON shapes
- Parallel “blog kit” components outside typeset + shadcn

---

## 3. Design influences → mapping

| Influence | Vellum mapping |
| --- | --- |
| OpenAI | Provenance, approachable rhythm |
| Evidence-backed reading | 65ch, open leading, two lanes |
| Vercel type | Confidence without cold starkness |
| Meridian | Shared skeleton — **not** cinema default |

---

## 4. Material laws (app chrome)

- Prose in reading lanes; chrome stays compact sans
- `reading-muted` for secondary copy in prose (not `text-muted-foreground` on body)
- Brand for links/CTA — not paragraph color
- Soft panels `rounded-2xl` + `edge` for demo breaks
- No activity pastels inside essays

---

## 5. Skills

| Skill | Use when |
| --- | --- |
| `vellum-theme` | Tokens, mist paper, prefs |
| `vellum-compose` | Help/docs shells from primitives |
| `vellum-reading` | Typeset + measure + streaming |
| `vellum-surface` | Surface lanes |
| `vellum-a11y` | Contrast + readable type |

```bash
npx skills add byronwade/ui.byronwade.com --skill vellum-reading
```

---

## 6. Agents

Author → reviewer:

1. Load DESIGN.md + `vellum-reading`
2. Lock typeset preset before writing prose chrome
3. Reviewer checks measure + validate gates

---

## 7. Negotiated endpoints

- `/vellum/design.md` · `/vellum/agents.md` · `/vellum/architecture.md` · `/vellum/llms.txt`
- Kit: `/r/vellum.contract.json`
- Install: `/vellum/install`

---

## 8. Done gate

- [ ] DESIGN.md + this file loaded
- [ ] `vellum-*` skill followed
- [ ] Typeset preset + ≤80ch measure
- [ ] No ops/workbench defaults / raw color
- [ ] `check:design` + `check:contrast` + `check:platform` green
- [ ] Optional MCP `validate_ui` if tool-wired
