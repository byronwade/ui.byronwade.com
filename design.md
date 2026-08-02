# Meridian — design.md

> **This is the AI contract.** Load this before writing UI for ui.byronwade.com or any product that adopts Meridian. Humans read `docs/meridian.md` for prose; agents obey this file.

**Product:** theme + surface system for AIs — not a custom component zoo.  
**Primitives:** shadcn/ui. **Theme:** tokens in `app/globals.css`. **Proof:** surfaces + workbench.

## Identity

| Key | Value |
| --- | --- |
| Name | Meridian |
| Accent | `--brand` (steel-teal / “arc”) |
| Paper | Cool paper (`oklch` blue-gray), never warm cream |
| Type | Geist Sans + Geist Mono |
| Depth | `edge` first; `depth-soft` / `depth-raised` sparingly |
| Default surface | `application` |

## MUST

1. Use **tokens only** — no raw hex / `rgb()` / arbitrary color utilities in components.
2. Keep **one accent** — primary, ring, selected, and success resolve to `--brand`.
3. Keep **status semantic** — `destructive` and `warning` never become brand tint.
4. Build on **shadcn** in `components/ui/` — add with `npx shadcn@latest add …`; never fork a parallel kit.
5. Set surface with **`data-surface`** — `application` | `marketing` | `mobile` | `desktop`.
6. Prefer **composition** — prove UI in wholes (`components/surfaces/workbench.tsx`), not isolated atom grids.
7. Use **mono for data** — IDs, counts, timestamps, prices, model/tool names, hashes, filenames.
8. Derive hierarchy from **size + tracking**, not bold display weight.
9. Bind AI UI to a **product object** — provenance + activity tokens; no floating chatbot cliché.
10. Keep motion **micro and optional** — honor `prefers-reduced-motion`; no scroll choreography.

## MUST NOT

1. Name other brands (Polaris, Linear, Vercel, …) in product chrome or marketing headlines.
2. Invent per-surface component forks.
3. Use `min-h-dvh` for heroes — use `min-h-svh` (stable). Nested demo scrollports: `overflow-hidden`.
4. Use Tailwind `shadow-*` or custom box-shadows — only `edge` / `depth-*`.
5. Decorate with color — if removing a color doesn’t hurt meaning, remove it.
6. Ship marketing theater inside application chrome.

## Surfaces (density by task)

| `data-surface` | Job | Controls | Rows |
| --- | --- | --- | --- |
| `application` | Operate | 32px | 40px |
| `marketing` | Present | 36–40px CTAs | comfortable |
| `mobile` | Thumb-first | 44px | 52px |
| `desktop` | Keyboard + pointer | 28–32px chrome | compact |

Shape vocabulary: controls `rounded-lg` · panels `rounded-2xl` · marketing CTAs may `rounded-full` · shells `rounded-3xl`.

## Theme knobs (what AIs re-skin)

Override these — not component source — to theme a product:

```css
--brand
--brand-foreground
--brand-muted
--background
--foreground
--radius
```

Everything accented (ring, selected `bg-brand/10`, chart-1, success) follows `--brand`.

## Agent activity (fixed meaning — not brand)

| Token | Meaning |
| --- | --- |
| `bg-activity-thinking` | Model thinking |
| `bg-activity-search` | Search / retrieve |
| `bg-activity-read` | Read file / context |
| `bg-activity-edit` | Edit / write |

## Decision tree

```
Building UI?
├─ Need a primitive? → shadcn add → components/ui
├─ Need a product frame? → compose surfaces/workbench patterns
├─ Which surface?
│  ├─ App / admin / tool → data-surface="application"
│  ├─ Landing / docs hero → marketing (+ theater only if product is subject)
│  ├─ Phone product → mobile
│  └─ Desktop shell → desktop
├─ Color?
│  ├─ Accent / selected / go → brand
│  ├─ Danger → destructive
│  ├─ Caution → warning
│  └─ Agent step → activity-*
└─ Unsure → application + edge + text-sm + mono for data
```

## Load order for agents

1. This file (`design.md`)
2. `docs/architecture.md` — repo map + AI toolchain
3. Skill matching the task (`.cursor/skills/…`)
4. Canonical whole: `components/surfaces/workbench.tsx`
5. Tokens: `app/globals.css`

## Machine endpoints

| URL | Content |
| --- | --- |
| `/design.md` | This contract (raw markdown) |
| `/llms.txt` | Site map for AI crawlers |
| `/theme` | Live theme showcase |
| `/for-agents` | Human + agent onboarding |
| `/surfaces` | Four surface proofs |

## Done checklist

- [ ] Tokens only; one `--brand`
- [ ] Correct `data-surface`
- [ ] shadcn primitive (no bespoke twin)
- [ ] Mono on data; quiet chrome
- [ ] AI (if any) object-bound with provenance
- [ ] No influence-name labels in UI
- [ ] Matches a whole on `/theme` or `/surfaces`
