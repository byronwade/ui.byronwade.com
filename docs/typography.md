# Meridian — typography.md

> Type system. Ranking: [`influences.md`](./influences.md).  
> **Primary absorb:** Vercel craft (authority + mono data) + Linear hierarchy clarity + Meridian editorial rules (no bold display) + reading-lane science.

## 1. Laws

1. **Hierarchy from size + tracking**, not bold display weight (`font-medium` max on display).  
2. **Geist Sans + Geist Mono** — not Inter Display mandate (Linear leave-behind).  
3. **Mono for data** — IDs, counts, times, prices, filenames, model/tool names, kbd.  
4. **Two reading lanes** — UI chrome ≠ long-form prose.  
5. **Left-align body**; measure ≤65ch (hard cap 80ch).  
6. **Quiet chrome labels** — small caps / tracking on section meta, not loud color.

## 2. Roles

| Role | Typical size | Weight | Tracking | Use |
| --- | --- | --- | --- | --- |
| Display | clamp / 3xl+ | normal–medium | tight (−0.03em) | Marketing stage titles |
| Title | xl–2xl | medium | tight | Section heads |
| Body | sm–base | normal | slight negative UI | App copy |
| Label | xs–sm | medium | normal | Form labels |
| Data | 10–12px mono | normal | tight | IDs, meta |
| `reading-ui` | 16px sans | normal | 0 | Docs |
| `reading-prose` | 18px serif | normal | 0 | Essays |

## 3. Surface type (shell rhythm)

Remapped by `data-surface` via `--type-ui` / `--type-row` / `--type-meta` / `--type-label`  
(see `lib/design/shell.ts` + `.type-*` utilities).

| Surface | UI | Row | Meta | Notes |
| --- | ---: | ---: | ---: | --- |
| `application` | 14 | 13 | 11 | Dense operate |
| `desktop` | 13 | 12 | 10 | Compact chrome |
| `mobile` | 16 | 15 | 12 | Touch floor |
| `marketing` | 16 | 14 | 12 | Present + cinema |

Prefer `typeClass("body"|"label"|"data")` or `shellType("ui"|"row"|"meta"|"label")` over raw `text-[NNpx]`.

## 4. Reading lanes

| Class | Job |
| --- | --- |
| `reading-ui` | Docs/help — 65ch, 1.6 lh |
| `reading-prose` | Essays — serif, 1.7 lh, paragraph gap |
| `reading-measure` | Width only |
| `reading-lead` | Lead paragraph |
| `reading-muted` | Secondary in prose (not `text-muted-foreground` on body) |
| `reading-demo-break` | Demo band under prose |

## 5. Chrome type patterns (Linear + Cursor)

- Sidebar section: `font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground`  
- Table headers: 11px muted  
- Row titles: 13px tracking-tight  
- Status bar: 10px mono  

## 6. Anti-patterns

| Ban | Why |
| --- | --- |
| `font-bold` on display clamps | Editorial law |
| Full-bleed `text-sm` paragraphs | Readability |
| Inter/Roboto as required stack | Theme identity |
| Body copy in pure mono | Exhausting |
| All-caps long sentences | Scan fail |

## 7. Implementation

| Concern | Where |
| --- | --- |
| Fonts | Geist via Next font pipeline |
| Roles | `typeRoles` / `typeClass` in `lib/design` |
| Reading utilities | `globals.css` |

## Sources

- [Vercel Design Engineer Principles](https://vercel.com/design/engineer)
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- Meridian `design.md` readability lanes
