# Linear visual audit

Cross-check of `apps/linear` against `design-research/LINEAR-DESIGN-SYSTEM.md` and Mobbin reference captures (Import & export, Security, Billing, Workspace settings, login, dark issue view).

## Reference surfaces (Mobbin captures)

| Surface | Key signatures | Demo route |
| ------- | -------------- | ---------- |
| **Settings sidebar** | `#F7F7F8` canvas, uppercase group labels, gray pill active state | `/linear/settings` |
| **Notifications** | Channel list + chevrons, status dots, toggle rows, purple switches | `/linear/settings/notifications` |
| **Email notifications** | Digest select, toggle rows in grouped card | `/linear/settings/notifications/email` |
| **Agent personalization** | Guidance textarea, skills empty state + list | `/linear/settings/agent` |
| **Create skill** | Back link, textarea form, Cancel/Create footer | `/linear/settings/agent/skills/new` |
| **Security & access** | API key entry points | `/linear/settings/security` |
| **Create API key** | Radio/checkbox permissions, team pills, form footer | `/linear/settings/api/create` |
| **API key detail** | Green mono key, copy toast | `/linear/settings/api` |
| **Issue labels** | Filter toolbar, hierarchical table, colored dots, context menu | `/linear/settings/issues/labels` |
| **SLAs** | Enable toggle, work week select, When/Then automation rules | `/linear/settings/issues/slas` |
| **Issue templates** | Template chooser dialog, property bar editor | `/linear/settings/issues/templates` |
| **Project updates** | Saved schedule row + Edit, Slack connect | `/linear/settings/projects/updates` |
| **Project statuses** | Grouped status board, inline create row | `/linear/settings/projects/statuses` |
| **AI & Agents** | Triage Intelligence toggle, Behavior rows, guidance textarea | `/linear/settings/features/ai-agents` |
| **Initiatives** | Enable toggle, schedule Edit row, Slack connect | `/linear/settings/features/initiatives` |
| **Documents** | Template list header + row, new template editor | `/linear/settings/features/documents` |
| **Customer requests** | Enable toggle, status swatches, tier create, display options | `/linear/settings/features/customer-requests` |
| **Pulse** | Enable toggle, workspace/personal schedule selects | `/linear/settings/features/pulse` |
| **Asks** | Email intake list, multi-step DNS wizard | `/linear/settings/features/asks` |
| **Create team** | Field rows, timezone select, Create CTA | `/linear/settings/teams/new` |
| **Team settings** | Meta rows with counts, grouped sections | `/linear/settings/teams/engineering` |
| **Recently deleted documents** | Breadcrumb header, filter tabs, document rows | `/linear/workspace/deleted/documents` |
| **SLA custom duration** | Custom duration dialog on rule editor | `/linear/settings/issues/slas` |
| **Workspace app shell** | Sidebar nav, cycle panel, issue list, ⌘K, Ask Linear | `/linear/workspace` |
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
| Settings edit/behavior rows | `SettingsEditRow`, `SettingsBehaviorRow`, `SettingsScheduleCard` |
| Features settings nav | `/settings/features/*` routes in sidebar |
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
2. Open `/linear/settings/notifications` and `/linear/settings/notifications/email` — channels, toggles, digest select.
3. Open `/linear/settings/agent` and `/linear/settings/agent/skills/new` — guidance card, skill form.
4. Open `/linear/settings/api/create` and `/linear/settings/api` — permissions form, green API key + copy toast.
5. Open `/linear/settings/issues/labels`, `/slas`, `/templates`, `/templates/new` — Issues settings from Mobbin.
6. Open `/linear/settings/features/ai-agents`, `/initiatives`, `/documents`, `/customer-requests`, `/pulse`, `/asks` — Features settings from Mobbin.
7. Open `/linear/settings/teams/new` and `/linear/settings/teams/engineering` — Administration team flows.
8. Open `/linear/workspace/deleted/documents` in **light** — deleted items tabs + document list.
9. Open `/linear/settings/import` — wizard stepper, radio workspace row, footer actions.
10. Open `/linear/catalog` — scan each category in dark, then toggle light.
11. Open `/linear/workspace` in **dark** — issue list density, cycle sidebar, ⌘K shell, help affordance.
12. Open `/linear/auth` in **light** — pill login flow.

## Regenerate main-site skin after CSS changes

```bash
npm run gen:linear-skin
```

Updates `app/linear-skin.generated.css` for the registry site's Linear skin toggle.
