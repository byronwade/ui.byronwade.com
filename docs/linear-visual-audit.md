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
| **Ask Linear welcome** | Centered hero, large ask input, Skills row | `/linear/workspace/ask` |
| **Ask Linear chat** | Floating panel, reply box, worked indicator | `/linear/workspace/ask/chat` |
| **Global search** | Filter chips, result rows, empty state | `/linear/workspace/search` |
| **Backlog issues (AS Mobbin)** | Collapsible section, dashed status, grip handle | `/linear/workspace/teams/as-mobbin/issues` |
| **Team settings hub (AS Mobbin)** | Owned by you, workflow/AI/hierarchy sections, danger zone + delete dialog | `/linear/settings/teams/as-mobbin` |
| **Team general (AS Mobbin)** | Icon/name, identifier, timezone, estimate toggles | `/linear/settings/teams/as-mobbin/general` |
| **Teams list** | Filter toolbar, table (visibility/members/issues/created), delete toast | `/linear/settings/teams` |
| **Access and permissions** | Visibility row, membership select, permission selects | `/linear/settings/teams/as-mobbin/access` |
| **Cycles** | Enable toggle, duration/cooldown selects, start-date dialog, automation toggles | `/linear/settings/teams/as-mobbin/cycles` |
| **Set parent team** | Inherit statuses/labels/members icon rows | `/linear/settings/teams/as-mobbin/parent` |
| **Retire team** | Icon rows, cancel-issues select, destructive footer | `/linear/settings/teams/as-mobbin/retire` |
| **Preferences — Coding tools** | Tool rows (icon/name/desc/Learn more) + toggles | `/linear/settings/preferences` |
| **Project overview** | Breadcrumb+star header, tabs, inline props, comment thread, logo, properties/milestones/activity panel | `/linear/workspace/teams/as-mobbin/projects/user-insight` |
| **Project comment** | Avatar, resolve, emoji picker, context menu, edit/reactions, reply composer | project overview |
| **Project progress** | Scope/Completed, Assignees/Labels tabs, assignee row | project overview panel |
| **Document outline** | Floating TOC popover (Brief/Background/Goal/Users/Features) | project overview → Description ▾ |
| **Rich Project Brief** | Headings, nested bullets, dividers, file attachment, + Milestone, Markdown toggle | project overview |
| **Rich text toolbar** | Aa dropdown + B/I/S/U, link, quote, code, image, list, mention | project overview |
| **GIF picker** | Search + tile grid popover | project overview composer |
| **Create issue from comment** | Quoted comment, property chips, Save as draft, Create issue → toast | project overview comment menu |
| **SLA custom duration** | Custom duration dialog on rule editor | `/linear/settings/issues/slas` |
| **Workspace app shell** | Sidebar nav, cycle panel, issue list, ⌘K, Ask Linear | `/linear/workspace` |
| **Inbox** | Mentions / assigned / subscribed feed in workspace shell | `/linear/workspace/inbox` |
| **My issues** | Active + backlog tabs scoped to current user | `/linear/workspace/my-issues` |
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
| Workspace shell (list fragment) | `components/linear/workspace-shell.tsx` + catalog preview |
| Settings shell fragments | `SettingsPageIntro`, `SettingsSubheading`, `SettingsToggleRow` |
| Search shell | `components/linear/search-shell.tsx` |
| Backlog section / row | `components/linear/backlog-issue-row.tsx` |
| Ask Linear welcome | `components/linear/ask-linear-welcome.tsx` |
| Project detail (logo + properties) | `components/linear/project-detail.tsx` |

## Automated gates

```bash
npm run check:linear-slots    # every data-slot styled
npm run check:linear-catalog  # every component has catalog preview
npm run check:linear-visual   # no off-brand Tailwind in ui/ + linear/
npm run build:linear          # all of the above + production build
```

## Manual review checklist

| # | Route / surface | Status |
| - | --------------- | ------ |
| 1 | `/linear/settings` light — sidebar, grouped import list, export row, toast | done |
| 2 | `/linear/settings/notifications` + `/email` — channels, toggles, digest | done |
| 3 | `/linear/settings/agent` + `/skills/new` — guidance card, skill form | done |
| 4 | `/linear/settings/api/create` + `/api` — permissions, green key + copy toast | done |
| 5 | `/linear/settings/issues/labels`, `/slas`, `/templates` — Issues settings | done |
| 6 | `/linear/settings/features/*` — AI, initiatives, documents, customers, pulse, asks | done |
| 7 | `/linear/settings/teams/new` + `/engineering` — Administration team flows | done |
| 8 | `/linear/workspace/deleted/documents` light — deleted items tabs + list | done |
| 9 | `/linear/settings/import` — wizard stepper, radio workspace row, footer | done |
| 10 | `/linear/catalog` — scan categories dark + light (incl. new Linear composites) | done |
| 11 | `/linear/workspace` dark — issue density, cycle sidebar, ⌘K, help | done |
| 12 | `/linear/workspace/inbox` — inbox feed in workspace shell | done |
| 13 | `/linear/workspace/my-issues` — active/backlog my-issues tabs | done |
| 14 | `/linear/auth` light — pill login flow | done |

## Regenerate main-site skin after CSS changes

```bash
npm run gen:linear-skin
```

Updates `app/linear-skin.generated.css` for the registry site's Linear skin toggle.
