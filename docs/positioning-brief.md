# byronwade/ui — positioning & naming brief

**Date:** 2026-06-03 · **Voice:** technical, proof-driven · **Subsystem:** 5 of 5
**Status:** Draft for the owner to pull from (naming is the owner's call; options below).

> This brief is a source to pull copy/names from — it intentionally touches no live site
> files. Everything it claims is shipped and verifiable in this repo (subsystems 1–3 on `main`).

---

## 1. The thesis (one paragraph)

shadcn made design systems **ownable** — copy the code, it's yours, not a dependency.
The next era's code is written _with_ an agent, and every agent drifts off-system the
moment it reaches for `bg-[#f7f7f4]` instead of your token. byronwade/ui is the first
design system that is **operated by agents and provably kept on-system** — not by
convention, but by a single detection engine wired into the three places an agent
touches: a **lint** that fails CI on off-system code, an **eval** that measures the
rule's effect as a number, and an **MCP server** that lets an agent query the system and
self-check before it emits. One source of truth (`registry.json`), one definition of
"on-system" (`detect()`), zero drift you can't catch in CI.

## 2. What is actually true (the proof points — lead with these)

Every claim here maps to shipped code. This is the moat; in a technical, proof-driven
voice, the proof _is_ the pitch.

- **One engine, three surfaces.** A single `@byronwade/on-system-core` `detect()` powers
  the consumer **lint** (`@byronwade/eslint-plugin-ui` + `byronwade-lint`), the **eval**
  grader, and the MCP `check_on_system` tool. "On-system" means the _same_ thing in your
  editor, your CI, your eval, and your agent — by construction, not by documentation.
- **The guidance cannot lie.** The shipped AI rule, the lint's knowledge, and the MCP's
  data are all _generated from `registry.json`_ and guarded by CI gates
  (`check:rule`, `check:lint-manifest`, `check:mcp-data`). A renamed token or a deleted
  component fails the build — the agent is never told to `add @byronwade/<ghost>`.
- **We grade ourselves.** The eval runs real prompts through Claude **with** the rule vs
  a **baseline**, scores each generation with the same detector at its strictest (zero
  violations = on-system), and reports the **lift**. It's a number you can put on the page
  and reproduce — not a vibe.
- **The system dogfoods its own law.** CI runs the lint over the registry's own source;
  the design system has to be on-system or it doesn't ship.
- **Five detectors, real coverage:** raw color, off-token arbitrary spacing/radius,
  hand-rolled gradients/grids, raw native elements where a primitive exists, and bold
  weight on headings — each with an on-system suggestion, aggressive OKLCH-nearest autofix
  with a safety net.
- **Live agent access:** an `npx @byronwade/mcp` stdio server, self-contained (bundles the
  registry it shipped with), exposing search, source, rule, tokens, utilities, and the
  live check — six tools, no hosting.

## 3. The aesthetic (what people see and screenshot)

The moat makes teams _standardize_; the look makes them _want to_. Two signatures:

- **Warm paper, not cold developer-tool.** The neutrals are warm by construction — OKLCH
  hue ~70–95 (`--background: oklch(0.994 0.002 95)`), the Cursor/editorial lineage of
  off-white paper and warm gray, deliberately rejecting the zinc/slate cliché. Editorial
  typography: hierarchy from size + tracking + typeface, never weight (headings stay
  `font-medium`). Warmth is a _structural_ choice, enforced by the typography detector.
- **Chrome that morphs.** `use-chrome-morph` + `morph-dock` — floating navigation that
  _blooms_ into panels. Almost no design system ships morphing chrome as a primitive;
  it's the thing people share.
- **One knob re-skins everything.** Override `--brand` and rings, charts, `success`,
  `glow-brand`, and active states all follow — light and dark, with zero JS (the theming
  page proves it across eight hues). Most "themeable" systems lie; this one doesn't, by
  construction. Two deliberate exceptions stay fixed because they carry meaning: the
  `--chart-2…5` ramp and the **agent-activity** palette (`--activity-thinking/search/
read/edit`).

## 4. Naming — directions to choose from (owner's call)

Naming is yours; here are three coherent directions, each with rationale and a sample
lockup. Don't mix metaphors — pick one lane.

### A. Name the guarantee — "On-System"

Lean into the moat. The system's promise _is_ its name.

- **Tagline:** _"On-system. By construction."_ or _"Agents can't go off-system here."_
- **Why:** ownable, technical, true, and unique to you. Maps 1:1 to the lint/eval/MCP.
- **Risk:** descriptive rather than evocative; less "brand," more "category."

### B. Name the motion — the morph/bloom lane

Own the living-chrome signature.

- **Candidates:** _Morph_, _Bloom_ (already your animation verb — could elevate to brand),
  _Living UI_.
- **Tagline:** _"A design system that moves."_ / _"Chrome that blooms."_
- **Why:** the most screenshot-able, differentiated visual. **Risk:** undersells the moat.

### C. Name the warmth — the paper/editorial lane

Own the aesthetic identity.

- **Candidates:** _Paper_, _Warm_, _Hearth_, _Ember_ (warm, editorial, human).
- **Tagline:** _"Warm by construction."_
- **Why:** memorable, human, differentiated from cold dev tools. **Risk:** aesthetics are
  easier to copy than the moat.

**Recommendation (proof-driven voice):** lead the _positioning_ with **A (the guarantee)**
and let **B/C** be the _aesthetic signature_ underneath it — "the agent-native design
system, warm and alive." The guarantee is what no one else can claim; the warmth+morph is
why people fall for it. Headline the unforgeable thing.

## 5. Tagline candidates (proof-forward)

1. _"The design system agents can't take off-system."_
2. _"One source of truth. One definition of on-system. Lint, eval, and MCP enforce it."_
3. _"Provably on-system — we ship the number."_
4. _"Warm, alive, and agent-native."_ (aesthetic + category, paired with a proof line)
5. _"Your tokens, enforced everywhere an agent touches your code."_

## 6. The narrative arc (for a landing page, in order)

1. **Hook (the guarantee):** agents drift; here they can't — and we prove it.
2. **The number (eval):** baseline → with-rule on-system lift, reproducible.
3. **The mechanism (one engine, three surfaces):** lint, eval, MCP, all one `detect()`.
4. **The proof it can't lie (generated + gated):** everything derives from `registry.json`.
5. **The look (warm + morph):** the eight-hue `--brand` re-skin, the morphing dock.
6. **Own it (shadcn lineage):** you own the code; now it also stays on-system.
7. **CTA:** `npx shadcn add @byronwade/all` · add the MCP server · run the eval.

## 7. Audience framing

- **Eng leaders / platform teams:** the moat — enforced consistency in the agent era,
  measurable, in CI. (Lead with §2.)
- **Designers:** warm/editorial identity + one-knob re-skin. (Lead with §3.)
- **Indie devs / agent users:** add the MCP server, your agent stays on-brand, free lint.
  (Lead with the MCP + lint DX.)

## 8. What NOT to claim

- Don't say "fully automatic" — the eval is a manual, owner-run measurement (by design).
- Don't quote a specific eval % until a real `npm run eval` has been run (the committed
  snapshot is a fixture placeholder).
- Don't pin the accent to "green" — the whole pitch is that `--brand` is yours to set.
- Don't call it "the only" anything you can't defend; "the first agent-native, provably-
  on-system design system" is defensible — keep claims tied to the shipped mechanisms.

---

### Appendix — the receipts (link targets for a "how it works" page)

- Lint: `packages/on-system-core`, `packages/eslint-plugin-ui`, `packages/lint-cli`
- Eval: `packages/eval` (with-rule vs baseline, `claude-sonnet-4-6`, all-5-strict grading)
- MCP: `packages/mcp` (six tools, `npx @byronwade/mcp`)
- Drift-proof gates: `scripts/check-rule.mjs`, `check-lint-manifest.mjs`, `check-mcp-data.mjs`
- Specs/plans: `docs/superpowers/specs/`, `docs/superpowers/plans/`
