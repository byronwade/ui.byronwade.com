# Meridian — ux.md

> Interaction, states, and operator ergonomics. Ranking: [`influences.md`](./influences.md).  
> **Primary absorb:** Polaris Pro (meaning, predictable, juicy) + Cursor (keyboard, object-bound) + Fluent (rest→hover→selected, focus stroke) + Linear (quiet chrome) + Vercel (every state).

## 1. North-star UX principles

| # | Principle | Source | Meridian rule |
| --- | --- | --- | --- |
| 1 | Obsess over usefulness | [Vercel DE](https://vercel.com/design/engineer) | Every control finishes a task |
| 2 | Assign meaning | [Polaris](https://polaris-react.shopify.com/design/pro-design-language) | Color/icon/depth = role |
| 3 | Predictable then juicy | Polaris | Same look → same behavior; press felt |
| 4 | Complexity available, not required | Vercel | Progressive disclosure |
| 5 | Quiet chrome, loud content | [Linear](https://linear.app/now/how-we-redesigned-the-linear-ui) | Brand tint limited in chrome |
| 6 | Object-bound AI | Cursor app | No floating chatbot |
| 7 | Focus ≠ fill | [Fluent color/interaction](https://fluent2.microsoft.design/color) | Ring/stroke for keyboard |

## 2. Interaction state model (Fluent + Polaris)

```
rest → hover → pressed → selected
                 ↘ focus-visible (parallel track)
```

| State | Visual | Notes |
| --- | --- | --- |
| Rest | Neutral surface | No brand border by default |
| Hover | `bg-muted/30–40` | Quiet ([Polaris](https://polaris-react.shopify.com/design/pro-design-language): unobtrusive) |
| Pressed | Slightly stronger muted / scale micro | Juicy but short |
| Selected | `bg-brand/10` | Not a thick brand border |
| Focus-visible | `ring-ring` / thicker stroke | Fluent: focus changes container stroke, not only fill |
| Disabled | Reduced opacity + `pointer-events-none` | Still contrast-safe where needed |
| Danger | `bg-destructive/10` + destructive text | Never brand |

### Rest → hover → selected (Fluent)

Controls generally get **darker** through interaction on paper; selected uses brand wash. Dark mode follows token aliases — never hardcode branches.

## 3. Control affordances

| Control | Afford | Anti |
| --- | --- | --- |
| Button primary | Brand fill, clear label | Neon, chevron garnish |
| Button ghost | Transparent + hover muted | Brand border chrome |
| Input | `rounded-lg`, thin border or edge | Shadow-md wells |
| Row / nav item | Full-row hit target, h-7–h-9 | Tiny icon-only without label (unless toolbar) |
| Checkbox / toggle | Instant check feedback | Novelty bounce loops |
| Menu item | `rounded-lg`, focus = accent wash | Nested hover traps |

## 4. Keyboard & command

Cursor / Linear operators expect:

| Shortcut pattern | UX |
| --- | --- |
| `⌘K` / command palette | Jump anywhere |
| Arrow + Enter in lists | Move selection |
| `⌘↵` in agent composer | Submit bound to object |
| Tab / Shift+Tab | Visible focus rings always |

Show `kbd` hints in mono near search — never as the only discoverability path.

## 5. Information architecture patterns

### Indexes (Polaris density + Linear rows)

1. Filter/search chrome (compact)  
2. Dense table/list  
3. Selection opens detail **or** agent rail  
4. Empty / error / loading owned ([Vercel](https://vercel.com/design/engineer))

### Detail

1. Object title + mono ID  
2. Primary actions  
3. Properties  
4. Optional AI rail bound to this ID  

### Marketing film

One idea per `svh` stage — see cinema laws. CTAs: one primary + optional secondary; **no chevrons**.

## 6. Feedback & messaging

| Kind | Treatment |
| --- | --- |
| Success | Brand-linked success token + short copy |
| Warning | `warning` semantic — not brand |
| Destructive | Confirm; `destructive` colors |
| Agent activity | `bg-activity-*` + mono tool name |
| Toast / inline | Prefer inline near object; avoid modal spam |

## 7. Progressive disclosure

| Default visible | Reveal when needed |
| --- | --- |
| Core nav + index | Agent rail |
| Primary CTA | Secondary tools |
| Paper application | Theater marketing |
| Summary meta | Full provenance timeline |

OpenAI-style lesson: product is hero; complexity waits ([influences](./influences.md) §9).

## 8. Empty, loading, error (mandatory)

Every index/detail must define:

| State | Minimum |
| --- | --- |
| Loading | Skeleton or quiet mono “Loading…” — no layout jump |
| Empty | One sentence + one action |
| Error | Specific message + retry |
| No permission | Clear next step |

## 9. Touch vs pointer

| Lane | Target | Notes |
| --- | --- | --- |
| `mobile` | ≥44×44 | Fluent / Apple HIG aligned |
| `application` | 32px controls | Dense but clickable |
| `desktop` | 28px chrome OK | Keyboard primary |

## 10. Accessibility UX

1. Never color-only meaning (Fluent + WCAG)  
2. Body text ≥ 4.5:1; large ≥ 3:1 (`check:contrast`)  
3. Theater stages lift `--brand` via `data-tone="theater"`  
4. `prefers-reduced-motion` honored (see [`animations.md`](./animations.md))  
5. Labels on icon buttons (`aria-label`)

## 11. Anti-patterns

| Ban | Why |
| --- | --- |
| Floating chatbot | Unbound AI |
| Brand borders on every selected thing | Noise |
| Hover-only critical actions | Pointer exclusive |
| Scroll-jacking tutorials | Cinema ban |
| Status color as decoration | Polaris meaning |
| Infinite onboarding modals | Usefulness fails |

## 12. Agent checklist

- [ ] States: rest/hover/focus/selected/disabled/empty/error  
- [ ] Selected = brand wash; focus = ring  
- [ ] AI attached to object ID + provenance  
- [ ] Keyboard path exists  
- [ ] `meridian-a11y` + contrast gate  

## Sources

- [Polaris Pro](https://polaris-react.shopify.com/design/pro-design-language)
- [Fluent 2 Color](https://fluent2.microsoft.design/color)
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
- [Vercel Design Engineer Principles](https://vercel.com/design/engineer)
