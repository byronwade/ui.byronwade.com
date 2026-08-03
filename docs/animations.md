# Meridian — animations.md

> Motion contract. Ranking: [`influences.md`](./influences.md).  
> **Primary absorb:** [Fluent 2 Motion](https://fluent2.microsoft.design/motion) (functional, natural, short) + Polaris “juicy but predictable” press + Meridian ban on scroll choreography.

## 1. Laws

1. **Motion is functional** — identify next step, inform change, confirm action ([Fluent](https://fluent2.microsoft.design/motion)).  
2. **Micro only on application** — no page-length choreography, scroll-jacking, or SVG grain.  
3. **Hover quiet, press felt** ([Polaris](https://polaris-react.shopify.com/design/pro-design-language)).  
4. **Top-level navigation fades** — don’t slide entire app shells ([Fluent top-level](https://fluent2.microsoft.design/motion)).  
5. **Honor `prefers-reduced-motion`** — WCAG / Fluent accessible motion.  
6. **Constraint to focused element** — no peripheral thrash.  
7. **Cinema stages are still** — optional enter fade ≤200ms; product is the subject.

## 2. Duration ramp (Fluent-shaped)

Aim fast and smooth; larger travel ⇒ slightly longer ([Fluent duration](https://fluent2.microsoft.design/motion)).

| Token | ms | Use |
| --- | ---: | --- |
| `motion-instant` | 0–50 | Keyboard selection, toggles |
| `motion-fast` | 120–150 | Hover bg, focus ring settle |
| `motion-normal` | 180–220 | Popover enter/exit, tabs |
| `motion-gentle` | 240–280 | Dialog / sheet (rare) |
| `motion-slow` | ≥300 | **Avoid** in app chrome |

Encoded preference in CSS: short `transition-colors` / `transition-opacity`; no spring theater on lists.

## 3. Easing

| Curve | When |
| --- | --- |
| Ease-out | Enters / opens (start fast) |
| Ease-in | Exits |
| Ease-in-out | Moves within layout |
| Linear | Spinners / continuous rotate only |

Fluent warns: linear feels unnatural for UI travel — reserve for loops ([Motion](https://fluent2.microsoft.design/motion)).

Suggested cubic (Fluent easy-ease family): `cubic-bezier(0.33, 0, 0.67, 1)`.

## 4. Allowed patterns

| Pattern | Fluent name | Meridian |
| --- | --- | --- |
| Fade in/out | Enter/Exit, Top level | Dialogs, toasts, stage enter |
| Soft elevation change | Elevation | Button press depth / shadow token swap |
| Container resize | Container transform | Responsive reflow — prefer CSS, not JS film |
| Local press | — (Polaris juicy) | `active:scale-[0.98]` or bg flash ≤150ms |
| Spinner | — | `CircleNotch` animate-spin on agent “working” |

## 5. Banned patterns

| Ban | Why |
| --- | --- |
| Scroll-linked storytelling | Cinema law / vestibular risk |
| Parallax hero stacks | Marketing anti-pattern here |
| Staggered list of 50+ rows | Fluent: stagger only when short |
| Layout thrash on hover | Predictability |
| Autoplaying decorative Lottie | Noise |
| `mix-blend` on fixed chrome | Paint jank (`check:design`) |
| `content-visibility: auto` size placeholders | Scroll jump ban |

## 6. Choreography rules

From Fluent choreography:

- Prefer short stagger offsets; end related items together when possible  
- Emphasize important elements with slightly longer duration — not larger travel distance across the viewport  
- Large groups: sync, don’t stagger into multi-second intros  

Meridian app default: **no list stagger**. Marketing may fade a single stage subject.

## 7. Reduced motion

`globals.css` already collapses transitions when `prefers-reduced-motion: reduce`.

Agent rules:

- Provide non-motion equivalent (state text, ARIA live for agent updates)  
- Spinners may become static “Working…”  
- Never convey meaning by motion alone  

## 8. Surface-specific motion

| `data-surface` | Budget |
| --- | --- |
| `application` / `desktop` | Instant–fast only |
| `mobile` | System-like; respect reduce |
| `marketing` | Still cinema; optional opacity enter |

## 9. Component recipes

| Component | Motion |
| --- | --- |
| Button | Color 150ms; optional press scale |
| Tabs | Underline/bg instant–fast |
| Dialog | Fade + subtle zoom ≤200ms |
| Sheet | Short ease-out translate **or** fade (prefer fade on large) |
| Agent activity badge | No bounce; color/token change |
| Site header theater dock | Color 200ms only |

## 10. Implementation map

| Concern | Where |
| --- | --- |
| Reduced motion | `app/globals.css` `@media (prefers-reduced-motion)` |
| Cinema ban | `cinematicLaws.motion = "micro-only"` |
| Drift lint | `scroll-choreography`, `mix-blend`, `content-visibility` |

## 11. Agent checklist

- [ ] Purpose stated (feedback / enter / exit)  
- [ ] Duration ≤ 220ms for chrome  
- [ ] Reduced-motion path  
- [ ] No scroll choreography  
- [ ] Meaning not motion-only  

## Sources

- [Fluent 2 Motion](https://fluent2.microsoft.design/motion)
- [Polaris Pro — juicy interactions](https://polaris-react.shopify.com/design/pro-design-language)
