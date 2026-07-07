# Linear visual audit

Cross-check of `apps/linear` against `design-research/LINEAR-DESIGN-SYSTEM.md` and Mobbin reference captures (Import & export, Security, Billing, Workspace settings, login, dark issue view).

## Reference surfaces (Mobbin captures)

| Surface | Key signatures | Demo route |
| ------- | -------------- | ---------- |
| **Settings sidebar** | `#F7F7F8` canvas, uppercase group labels, gray pill active state | `/linear/settings` |
| **Import & export** | Grouped list card, hairline row dividers, chevron rows, Docs ↗ links | `/linear/settings` |
| **Import wizard** | Stepper circles, white card, Back/Next footer, purple primary CTA | `/linear/settings/import` |
| **Security / toggles** | White settings card, purple `#5E6AD2` switch when on | `/linear/catalog` → Switch |
| **Billing** | Pricing columns, comparison table, purple upgrade buttons | Catalog → Table, Button |
| **Login** | Pill CTAs on white (marketing lane — secondary) | — |
| **Ask Linear** | White card, skills row, send affordance | `/linear/catalog` → Ask Linear panel |
| **Auth login** | Pill inputs/buttons on white canvas | `/linear/auth` |
| **Agent activity** | Message + bubble + scroller timeline | `/linear/catalog` → Message scroller |

Toggle **Light** on settings pages to compare against reference captures. Workspace defaults to **Dark**.

## Confirmed alignments

| Linear signature | Implementation |
| ---------------- | -------------- |
| Dark surface ladder `#08090a` → `#191a1b` | `apps/linear/app/linear-tokens.css` `:root` |
| Light settings canvas `#F7F7F8`, white cards | `.light` remaps full `--linear-*` ladder |
| Indigo brand `#5e6ad2`, accent `#828fff` | `--linear-brand`, `--primary`, selection/focus |
| Hairline borders `#E1E1E3` (light) / translucent (dark) | Cards, lists, inputs |
| Inter + JetBrains Mono, `"cv01","ss03"` | `layout.tsx` fonts + `linear-tokens.css` base |
| Weight 510 for controls/headings | CSS `--linear-font-medium`, component reskin |
| Control radius 6px, panels 8–12px | `linear-components.css` + tuned primitives |
| Dense 36px list rows | `table-row`, `item`, `linear-issue-row` |
| Command palette dark overlay 85% | `dialog`/`alert-dialog` overlays + CSS |
| Status pills = outline/subtle, not loud fills | `badge` variants + CSS |
| Tabs = underline (line variant) | Catalog + CSS for `tabs-list[data-variant=line]` |
| Sidebar active = gray pill, not purple fill | `sidebar-menu-button[data-active]` |
| Settings grouped list | `linear-settings-list` slot + `/settings` demo |
| Issue row composite | `components/linear/issue-row.tsx` |
| Cycle panel | `components/linear/cycle-panel.tsx` |
| ⌘K command shell | `components/linear/command-shell.tsx` |

## Automated gates

```bash
npm run check:linear-slots    # every data-slot styled
npm run check:linear-catalog  # every component has catalog preview
npm run check:linear-visual   # no off-brand Tailwind in ui/
npm run build:linear          # all of the above + production build
```

## Manual review checklist

1. Open `/linear/settings` in **light** — sidebar, grouped import list, export row, toast.
2. Open `/linear/settings/import` — wizard stepper, radio workspace row, footer actions.
3. Open `/linear/catalog` — scan each category in dark, then toggle light.
4. Open `/linear/workspace` in **dark** — issue list density, cycle sidebar, ⌘K shell.
5. Compare overlays (dialog, sheet, command) — scrim + level-2 panel, no white glow rings.
6. Compare form controls — 32px height, 1px border, indigo focus ring.
7. Compare switches in light mode — purple track when checked.

## Regenerate main-site skin after CSS changes

```bash
npm run gen:linear-skin
```

Updates `app/linear-skin.generated.css` for the registry site's Linear skin toggle.
