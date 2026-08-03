# Meridian — color.md

> Color system. Ranking: [`influences.md`](./influences.md).  
> **Primary absorb:** Fluent neutrals + brand sparingly + semantic status · Polaris assign meaning · Linear perceptual theme knobs · Meridian OKLCH-only + WCAG AA.

## 1. Laws

1. **OKLCH only** — tokens are `oklch(...)` or `var(--token)`; never hex/rgb/hsl in components.  
2. **One accent** — `--brand` drives primary, ring, selected, success.  
3. **Status ≠ brand** — `destructive` / `warning` keep fixed meaning ([Polaris](https://polaris-react.shopify.com/design/pro-design-language), [Fluent semantic](https://fluent2.microsoft.design/color)).  
4. **Soft neutrals** — never pure white/black.  
5. **Brand sparingly** — CTA + selected wash; not large fills ([Fluent brand](https://fluent2.microsoft.design/color)).  
6. **Theater lifts brand** — `data-tone="theater"` for AA on dock.  
7. **Activity pastels are semantic** — agent doing, not accent fashion.

## 2. Palettes (Fluent → Meridian)

| Fluent palette | Meridian |
| --- | --- |
| Neutral | `--background`, `--foreground`, `--muted`, `--card`, `--border`, `--dock*` |
| Brand | `--brand`, `--brand-foreground`, `--brand-muted` |
| Shared / semantic | `--destructive`, `--warning`, `--success`(=brand) |
| (Meridian fixed) | `--activity-*`, `--chart-2…5` |

## 3. Theme knobs (Linear-shaped, OKLCH-strict)

Minimum knobs an agent may re-skin:

```css
--brand
--brand-foreground
--brand-muted
--background
--foreground
--radius
```

Linear reduced theme definition to base + accent + contrast ([Linear redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)). Meridian keeps explicit roles but **one accent variable** owns brand-linked aliases.

## 4. Neutral hierarchy

Fluent: lighter neutrals highlight focus areas ([Color](https://fluent2.microsoft.design/color)).

| Layer | Token intent |
| --- | --- |
| Page | `bg-background` |
| Inset chrome | `bg-muted/15–30` |
| Card / raised content | `bg-card` |
| Floating / dock | `bg-dock` + `text-dock-foreground` |
| Selected | `bg-brand/10` |
| Hover | `bg-muted/30–40` |

Limit accent tint in chrome calculations (Linear lesson).

## 5. Contrast contract

Audited pairs live in `lib/design/contrast.ts`. Gate: `npm run check:contrast`.

| Surface | Foreground rules |
| --- | --- |
| Paper | `text-foreground` / `text-muted-foreground` |
| Theater / dock | `text-dock-foreground` / `text-dock-muted`; brand lifted |
| Never | `text-*/70` opacity cheats on body |

Body/UI ≥ **4.5:1**; large/display ≥ **3:1**.

## 6. Interaction coloring

| State | Color behavior |
| --- | --- |
| Hover | Neutral darken/lighten — not brand flood |
| Selected | Brand wash 10% |
| Focus | Ring = brand; stroke weight up |
| Destructive hover | Destructive wash |

## 7. Charts & activity

| Family | Rule |
| --- | --- |
| `--chart-1` | = brand |
| `--chart-2…5` | Fixed ramp — not brand-linked |
| `--activity-*` | thinking/search/read/edit only |

## 8. Anti-patterns

raw hex · arbitrary color utilities · second accent · neon · cream-terracotta cliché · pure white/black · status-as-decoration · influence brand labels

## 9. Implementation map

| File | Role |
| --- | --- |
| `app/globals.css` | Token values |
| `lib/design/grammar.ts` | `colorRoles` |
| `lib/design/contrast.ts` | Pairs |
| `scripts/check-contrast.mjs` | Gate |

## Sources

- [Fluent 2 Color](https://fluent2.microsoft.design/color)
- [Fluent 2 Design tokens](https://fluent2.microsoft.design/design-tokens)
- [Polaris Pro](https://polaris-react.shopify.com/design/pro-design-language)
- [Linear UI redesign](https://linear.app/now/how-we-redesigned-the-linear-ui)
