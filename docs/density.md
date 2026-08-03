# Meridian — density.md

> Density & control scale. Ranking: [`influences.md`](./influences.md).  
> **Primary absorb:** Polaris task density + Fluent 4px / density multipliers + Cursor compact chrome + Linear content-over-chrome.

## 1. Laws

1. **Density follows the task** — not a global aesthetic ([Polaris](https://polaris-react.shopify.com/design/pro-design-language)).  
2. **One component, many densities** — `data-surface` remaps CSS vars; no forked Button.  
3. **4px grid** — heights and pads on Fluent ramp ([Layout](https://fluent2.microsoft.design/layout)).  
4. **Indexes dense; detail breathes** — space groups related fields.  
5. **Touch floor 44px** on `mobile`.  
6. **Desktop chrome may go 28px** — keyboard-first.

## 2. Control height scale

| Token | px | Use |
| --- | ---: | --- |
| `--control-h-xs` | 24 | Desktop icon buttons |
| `--control-h-sm` | 28 | Compact chrome |
| `--control-h` | 32 | Application default |
| `--control-h-md` | 36 | Marketing secondary |
| `--control-h-lg` | 40 | Marketing primary CTA |
| `--control-h-touch` | 44 | Mobile targets |
| `--row-h` | 40 | App rows (may render h-8 visually in dense proofs) |
| `--row-h-touch` | 52 | Mobile rows |

## 3. Surface remaps

Set in `app/globals.css`:

| Surface | control-h | row-h | pad | gap | font |
| --- | --- | --- | --- | --- | --- |
| application | 32 | 40 | 20 | 12 | 14 |
| desktop | 28 | 32 | 12 | 8 | 13 |
| marketing | 36 | 44 | 24 | 20 | default |
| mobile | 44 | 52 | 16 | 12 | 16 |

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

- [ ] Correct `data-surface`  
- [ ] Heights on scale  
- [ ] Touch targets on mobile  
- [ ] No one-off `h-[37px]`  

## Sources

- [Polaris Pro — Increase density](https://polaris-react.shopify.com/design/pro-design-language)
- [Fluent 2 Layout](https://fluent2.microsoft.design/layout)
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
