# Linear UI — byronwade/ui

Linear-inspired shadcn component library at **ui.byronwade.com/linear**.

- **60 shadcn components** (`npx shadcn add --all`)
- Tokens from [`design-research/LINEAR-DESIGN-SYSTEM.md`](../../design-research/LINEAR-DESIGN-SYSTEM.md)
- Reskin via `app/linear-tokens.css` + `app/linear-components.css`

## Dev

From the monorepo root:

```bash
npm run dev:linear
```

Open [http://localhost:3000/linear](http://localhost:3000/linear) (basePath is `/linear`).

## Pages

| Route | Description |
| ----- | ----------- |
| `/` | Landing |
| `/catalog` | Searchable catalog of all shadcn primitives + Linear composites |
| `/styleguide` | Token and component styleguide |
| `/auth` | Auth / sign-in shell |
| `/workspace` | Engineering cycle view — issue list + cycle panels + ⌘K |
| `/workspace/inbox` | Inbox — notifications and mentions |
| `/workspace/my-issues` | Issues assigned to the current user |
| `/workspace/search` | Workspace search |
| `/workspace/ask` | Ask Linear welcome |
| `/workspace/ask/chat` | Ask Linear chat panel |
| `/workspace/deleted/documents` | Deleted documents list |
| `/workspace/teams/as-mobbin/issues` | AS Mobbin team issues / backlog |
| `/workspace/teams/as-mobbin/projects` | AS Mobbin projects list |
| `/workspace/teams/as-mobbin/projects/user-insight` | Project detail |
| `/workspace/teams/as-mobbin/views` | Custom views list |
| `/settings` | Redirects to workspace settings hub |
| `/settings/workspace` | Workspace general settings |
| `/settings/preferences` | Preferences — coding tools |
| `/settings/notifications` | Notification preferences |
| `/settings/notifications/email` | Email notification settings |
| `/settings/security` | Security & access |
| `/settings/api` | Personal API keys |
| `/settings/api/create` | Create API key |
| `/settings/applications` | OAuth apps & connected integrations |
| `/settings/members` | Members table + invite |
| `/settings/billing` | Billing |
| `/settings/import-export` | Import & export |
| `/settings/import` | Linear → Linear import |
| `/settings/teams` | Teams list |
| `/settings/teams/new` | Create team |
| `/settings/teams/as-mobbin` | AS Mobbin team hub |
| `/settings/teams/as-mobbin/general` | Team general settings |
| `/settings/teams/as-mobbin/access` | Access & permissions |
| `/settings/teams/as-mobbin/cycles` | Cycles |
| `/settings/teams/as-mobbin/parent` | Parent team |
| `/settings/teams/as-mobbin/retire` | Retire team |
| `/settings/teams/engineering` | Engineering team hub |
| `/settings/issues/labels` | Issue labels |
| `/settings/issues/templates` | Issue templates |
| `/settings/issues/templates/new` | New issue template |
| `/settings/issues/slas` | SLAs / recurring |
| `/settings/projects/statuses` | Project statuses |
| `/settings/projects/updates` | Project updates |
| `/settings/features/*` | Feature flags (asks, documents, initiatives, pulse, …) |
| `/settings/agent` | Agent personalization |

## Composites

| Component | File |
| --------- | ---- |
| `WorkspaceShell` | `components/linear/workspace-shell.tsx` |
| `SettingsShell` | `components/linear/settings-shell.tsx` |
| `IssueRow` | `components/linear/issue-row.tsx` |
| `BacklogIssueRow` | `components/linear/backlog-issue-row.tsx` |
| `CyclePanel` | `components/linear/cycle-panel.tsx` |
| `CommandShell` | `components/linear/command-shell.tsx` |
| `SearchShell` | `components/linear/search-shell.tsx` |
| `AskLinearPanel` | `components/linear/ask-linear-panel.tsx` |
| `AskLinearWelcome` | `components/linear/ask-linear-welcome.tsx` |
| `AskLinearChatPanel` | `components/linear/ask-linear-chat-panel.tsx` |
| `ChatHistoryPopover` | `components/linear/chat-history-popover.tsx` |
| `AgentTimeline` | `components/linear/agent-timeline.tsx` |
| `ProjectDetail` helpers | `components/linear/project-detail.tsx` |

## Deploy

Vercel project with **Root Directory** = `apps/linear`. See [`docs/monorepo.md`](../../docs/monorepo.md).
