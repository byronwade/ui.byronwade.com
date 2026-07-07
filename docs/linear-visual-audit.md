# Linear visual audit

Cross-check of `apps/linear` against `design-research/LINEAR-DESIGN-SYSTEM.md` (June 2026 capture). Reference screenshots were not available in-repo; this audit uses the teardown tokens and product patterns documented there.

## Confirmed alignments

| Linear signature | Implementation |
| ---------------- | -------------- |
| Dark surface ladder `#08090a` → `#191a1b` | `apps/linear/app/linear-tokens.css` |
| Indigo brand `#5e6ad2`, accent `#828fff` | `--linear-brand`, `--primary`, selection/focus |
| Hairline borders `0.5px`, translucent white | `--linear-hairline`, `--linear-border-translucent*` |
| Inter + JetBrains Mono, `"cv01","ss03"` | `layout.tsx` fonts + `linear-tokens.css` base |
| Weight 510 for controls/headings | CSS `--linear-font-medium`, component reskin |
| Control radius 6px, panels 8–12px | `linear-components.css` + tuned primitives |
| Dense 36px list rows | `table-row`, `item`, `linear-issue-row` |
| Command palette dark overlay 85% | `dialog`/`alert-dialog` overlays + CSS |
| Status pills = outline/subtle, not loud fills | `badge` variants + CSS |
| Tabs = underline (line variant) | Catalog + CSS for `tabs-list[data-variant=line]` |
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

When updating components or adding reference images:

1. Open `/linear/catalog` — scan each category in dark mode (default).
2. Toggle light mode — Mercury White `#f4f5f8` canvas should hold.
3. Open `/linear/workspace` — issue list density, cycle sidebar, ⌘K shell.
4. Compare overlays (dialog, sheet, command) — dark scrim, level-2 panel, no white glow rings.
5. Compare form controls — 32px height, level-2 fill, 1px indigo focus ring.
6. Compare badges — small, muted; primary indigo reserved for buttons.

## Regenerate main-site skin after CSS changes

```bash
npm run gen:linear-skin
```

Updates `app/linear-skin.generated.css` for the registry site's Linear skin toggle.
