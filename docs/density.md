# Meridian — density.md

> Density, spacing & shell rhythm. Ranking: [`influences.md`](./influences.md).  
> **Primary absorb:** Polaris task density + Fluent 4px / density multipliers + Cursor compact chrome + Linear content-over-chrome.  
> **Typed source of truth:** `lib/design/shell.ts` → `shellRhythm` (mirrored in `app/globals.css`).

## 1. Laws

1. **Density follows the task** — not a global aesthetic ([Polaris](https://polaris-react.shopify.com/design/pro-design-language)).  
2. **One component, many densities** — `data-surface` remaps CSS vars; no forked Button.  
3. **4px grid** — heights and pads on Fluent ramp ([Layout](https://fluent2.microsoft.design/layout)).  
4. **Indexes dense; detail breathes** — space groups related fields.  
5. **Touch floor 44px** on `mobile`.  
6. **Desktop chrome may go 28px** — keyboard-first.  
7. **No off-scale pixels** — use `h-control` / `h-row` / `shell-pad` / `shell-gap` / `type-*`.

## 2. Control height scale

| Token | px | Use |
| --- | ---: | --- |
| `--control-h-xs` | 24 | Desktop icon buttons |
| `--control-h-sm` | 28 | Compact chrome |
| `--control-h` | 32 | Application default (remapped per surface) |
| `--control-h-md` | 36 | Marketing secondary |
| `--control-h-lg` | 40 | Marketing primary CTA |
| `--control-h-touch` | 44 | Mobile targets |
| `--row-h` | surface | Index / list rows |
| `--surface-pad` / `--surface-gap` | surface | Shell interior rhythm |

## 3. Surface remaps (`shellRhythm`)

| Surface | control | row | pad | gap | type ui |
| --- | ---: | ---: | ---: | ---: | ---: |
| application | 32 | 40 | 20 | 12 | 14 |
| desktop | 28 | 32 | 12 | 8 | 13 |
| marketing | 36 | 44 | 24 | 20 | 16 |
| mobile | 44 | 52 | 16 | 12 | 16 |

Utilities: `.h-control` · `.h-row` · `.shell-pad` · `.shell-gap` · `.shell-stack` · `.type-ui` · `.type-row` · `.type-meta` · `.type-label`.

## 4. When to go denser / looser

| Denser | Looser |
| --- | --- |
| Tables, triage, file trees | Forms, onboarding, empty states |
| Command palette results | Marketing stages |
| Agent event lists | Reading prose |

## 5. Optical density tips (Linear)

- Align icons and labels — perceived density drops when misaligned  
- Soften borders before removing information  
- Prefer selected wash over heavy separators  

## 6. Agent checklist

- [ ] Correct `data-surface` on the shell root  
- [ ] Heights via `h-control` / `h-row` / `--control-h*`  
- [ ] Type via `type-ui` / `type-row` / `type-meta` / `type-label`  
- [ ] Touch targets on mobile (44px floor)  
- [ ] No `h-[NNpx]` / off-scale `text-[NNpx]` / `p-[NNpx]`  
- [ ] `npm run check:shell` + `check:design`

## 7. Proof

Live matrix: `/theme#shell-rhythm` → `ShellRhythmProof`.

## Sources

- [Polaris Pro — Increase density](https://polaris-react.shopify.com/design/pro-design-language)
- [Fluent 2 Layout](https://fluent2.microsoft.design/layout)
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
