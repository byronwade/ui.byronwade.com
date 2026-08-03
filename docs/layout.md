# Meridian — layout.md

> Spatial system for application + cinema. Influences ranked in [`influences.md`](./influences.md).  
> **Primary absorb:** Fluent 2 layout (4px grid, proximity, breakpoints) + Cursor inverted-L chrome + Polaris task density.

## 1. Laws

1. **4px base unit** — all pads, gaps, and control heights snap to multiples of 4 ([Fluent spacing ramp](https://fluent2.microsoft.design/layout)).
2. **Proximity = meaning** — space groups related information; prefer space over extra dividers ([Fluent](https://fluent2.microsoft.design/layout), [Polaris](https://polaris-react.shopify.com/design/pro-design-language)).
3. **Density follows task** — indexes dense; detail/forms breathe; marketing stages use theater, not app density.
4. **Chrome is quiet** — inverted-L (sidebar + top bar) recedes; content owns hierarchy ([Linear](https://linear.app/now/how-we-redesigned-the-linear-ui), Cursor app).
5. **One layout vocabulary** — never fork components per surface; remap via `data-surface`.
6. **Stroke before shadow** — pane separation = 1px `border-border` / `edge` ([Fluent stroke](https://fluent2.microsoft.design/shapes)).
7. **Control ≠ layer radius** — controls `rounded-lg`; panels `rounded-2xl`; shells `rounded-3xl`.

## 2. Spacing ramp (Fluent → Meridian)

| Fluent token | px | Meridian use |
| --- | ---: | --- |
| size20 | 2 | Icon optical adjust only |
| size40 | 4 | Micro gap inside controls |
| size80 | 8 | Compact chrome padding (`px-2`) |
| size120 | 12 | Default control inline gap |
| size160 | 16 | Card compact pad step |
| size200 | 20 | Application `--surface-pad` default |
| size240 | 24 | Section rhythm |
| size320 | 32 | Pane gutters / control default height |
| size400 | 40 | Row height / marketing CTA |

CSS knobs (`app/globals.css`):

```
--surface-pad
--surface-gap
--control-h*
--row-h*
```

**Rule:** if you need a one-off `p-[13px]`, stop — pick the nearest ramp step.

## 3. Application shell (Cursor + Linear)

Canonical anatomy:

```
┌──────────────────────────────────────────────────────────┐
│ topbar h-8…h-11  search · filters · kbd                  │
├────────────┬─────────────────────────────┬───────────────┤
│ sidebar    │ main content                │ optional rail │
│ w-40…14rem │ index | detail | editor     │ AI / meta     │
│ quiet nav  │ scroll: one port            │ object-bound  │
├────────────┴─────────────────────────────┴───────────────┤
│ status h-6 mono                                          │
└──────────────────────────────────────────────────────────┘
```

| Region | Width / height | Surface | Notes |
| --- | --- | --- | --- |
| Sidebar | 10–14rem | `bg-muted/15–20` + `border-r` | Labels/icons aligned ([Linear](https://linear.app/now/how-we-redesigned-the-linear-ui)) |
| Topbar | h-8 app / h-11 site | hairline bottom | No brand fill |
| Main | `minmax(0,1fr)` | `bg-background` | Single scroll owner |
| Agent rail | 16–18rem | `bg-muted/10–15` | Only when object selected |
| Status | h-6 | mono 10px | Density proof |

**Proofs:** `components/surfaces/workbench.tsx`, `composer-shell.tsx`.

### Alignment checklist (Linear discipline)

- Icon + label share one vertical centerline in sidebar rows  
- Tab labels share baseline with toolbar controls  
- Table cells: ID mono left, title truncate, meta right  
- Avoid “icon soup” — one leading icon max per row  

## 4. Grid & breakpoints

Fluent size classes ([Layout](https://fluent2.microsoft.design/layout)):

| Class | Range | Meridian behavior |
| --- | --- | --- |
| small | &lt;479 | Stack; hide side rails; 44px touch |
| medium | &lt;639 | Compact stack |
| large | &lt;1023 | Optional sidebar collapse |
| x-large | ≥1024 | Full inverted-L |
| xx-large+ | ≥1366 | Wider main; keep measure for reading |

**Techniques (Fluent):** reposition · resize · reflow · show/hide · re-architect.  
Meridian default: **responsive** one layout (not adaptive forks), with progressive disclosure of rails.

### Column guidance

| Context | Columns | Gutter |
| --- | --- | --- |
| App workbench | Fluid 2–3 regions | 0 (stroke dividers) |
| Docs / reading | Manuscript (1 col) | — · max 65ch |
| Marketing film | Full-bleed stage | Edge-to-edge media |
| Theme showcase | 12-col mental model | 16–24px |

## 5. Surface matrix (layout implications)

| `data-surface` | Pad | Gap | Control | Row | Scroll |
| --- | --- | --- | --- | --- | --- |
| `application` | 20 | 12 | 32 | 40 | One main port |
| `desktop` | 12 | 8 | 28 | 32 | Instant; no nested ports |
| `marketing` | 24 | 20 | 36–40 | — | Stage `svh`; no nested demo scroll |
| `mobile` | 16 | 12 | 44 | 52 | Safe areas; bottom chrome |

## 6. Pane composition patterns

### Index + detail (Polaris density)

```
[ filters h-8 ]
[ table rows h-8…h-10 ]
     └ selected → opens rail OR navigates detail
```

### Composer (Cursor)

```
[ explorer | tabs + editor | agent ]
```

### Marketing stage

```
[ theater svh ]
  copy (one idea)
  ProductFrame → app proof (rounded-2xl edge)
```

## 7. Shape on layout edges

| Element | Radius | Source |
| --- | --- | --- |
| Nav item, input, button | `rounded-lg` | Fluent Large control |
| Card, workbench shell, popover | `rounded-2xl` | Fluent layer |
| Modal / hero shell | `rounded-3xl` | Marketing shell |
| Badge / pill / CTA pill | `rounded-full` | Fluent pill form |
| Screen-edge chrome | square OK | Fluent: skip radius at screen edge |

## 8. Dividers

Prefer **space** → then **1px stroke** → then elevation.  
Never double: thick border + heavy shadow + loud background.

| Separator | Token |
| --- | --- |
| Pane split | `border-border` |
| Inset card | `edge` |
| Floated overlay | `depth-soft` / `depth-raised` |

## 9. Reading layouts

| Lane | Measure | Type |
| --- | --- | --- |
| `reading-ui` | ≤65ch | Docs |
| `reading-prose` | ≤65ch | Essays |
| Never | &gt;80ch | — |

Demo bands under prose: `reading-demo-break` / `DocsDemoSection` — not full-bleed `text-sm` paragraphs.

## 10. Anti-patterns

| Ban | Why |
| --- | --- |
| Nested `overflow-auto` demos | Steal scroll ([cinema laws](../design.md)) |
| Inset hero media cards | Breaks full-bleed subject |
| Dashboard soup in first marketing viewport | Violates one-idea frame |
| Cards wrapping every label | Chrome noise (Linear) |
| Arbitrary `gap-[0.85rem]` | Off Fluent 4px ramp |
| `rounded-md` / `rounded-xl` in app chrome | Outside closed `radii` |

## 11. Implementation map

| Concern | Code |
| --- | --- |
| Surface density | `[data-surface]` in `globals.css` |
| Radius intent | `radiusFor` in `lib/design/grammar.ts` |
| Shells | `components/surfaces/*` |
| Cinema stages | `components/cinematic/*` |
| Site chrome | `components/site-header.tsx` |

## 12. Agent checklist

- [ ] Spacing on 4px ramp  
- [ ] Correct `data-surface`  
- [ ] Control vs layer radius  
- [ ] Single scroll owner in demos  
- [ ] Sidebar/topbar quiet; brand only on selected/CTA  
- [ ] `npm run check:design`

## Sources

- [Fluent 2 Layout](https://fluent2.microsoft.design/layout)
- [Fluent 2 Shapes](https://fluent2.microsoft.design/shapes)
- [Polaris Pro design language](https://polaris-react.shopify.com/design/pro-design-language)
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
