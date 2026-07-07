"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  AlertCircle,
  ChevronRight,
  CircleDot,
  CircleHelp,
  FileText,
  FolderKanban,
  Globe,
  History,
  Inbox,
  Layers,
  LayoutGrid,
  Moon,
  Plus,
  Search,
  Settings,
  Sparkles,
  SquarePen,
  Star,
  Sun,
  UserPlus,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type WorkspaceNavItem = {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  badge?: string
}

type TeamSubNavItem = {
  id: string
  label: string
  icon: React.ReactNode
  href: string
}

type TeamNavItem = {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
  defaultExpanded?: boolean
  subItems?: TeamSubNavItem[]
}

const WORKSPACE_NAV: WorkspaceNavItem[] = [
  { id: "inbox", label: "Inbox", icon: <Inbox />, badge: "3" },
  { id: "my-issues", label: "My issues", icon: <CircleDot /> },
]

const WORKSPACE_GROUP: WorkspaceNavItem[] = [
  { id: "projects", label: "Projects", icon: <FolderKanban /> },
  { id: "views", label: "Views", icon: <LayoutGrid /> },
  { id: "more", label: "More", icon: <Layers /> },
]

const FAVORITES_NAV: WorkspaceNavItem[] = [
  {
    id: "fav-dashboard",
    label: "User Insight & Behavior Analytics Dashboard",
    icon: <Star />,
  },
]

const TEAM_NAV: TeamNavItem[] = [
  {
    id: "engineering",
    label: "Engineering",
    icon: <Users />,
    href: "/workspace",
  },
  {
    id: "as-mobbin",
    label: "AS Mobbin",
    icon: <Globe className="text-brand" />,
    defaultExpanded: true,
    subItems: [
      {
        id: "as-mobbin-issues",
        label: "Issues",
        icon: <CircleDot />,
        href: "/workspace/teams/as-mobbin/issues",
      },
      {
        id: "as-mobbin-projects",
        label: "Projects",
        icon: <FolderKanban />,
        href: "/workspace/teams/as-mobbin/projects",
      },
      {
        id: "as-mobbin-views",
        label: "Views",
        icon: <LayoutGrid />,
        href: "/workspace/teams/as-mobbin/views",
      },
    ],
  },
]

const TRY_NAV: WorkspaceNavItem[] = [
  { id: "import", label: "Import issues", icon: <Plus /> },
  { id: "invite", label: "Invite people", icon: <UserPlus /> },
  { id: "initiatives", label: "Initiatives", icon: <Layers /> },
  { id: "cycles", label: "Cycles", icon: <CircleDot /> },
  { id: "github", label: "Connect GitHub", icon: <Layers /> },
]

type WorkspaceBreadcrumb = {
  label: string
  href?: string
}

type WorkspaceViewTab = {
  id: string
  label: string
  href?: string
}

type WorkspaceIssueTab = {
  id: string
  label: string
  href?: string
}

type WorkspaceShellProps = {
  team?: string
  view?: string
  breadcrumbs?: WorkspaceBreadcrumb[]
  activeNavId?: string
  activeTab?: string
  onTabChange?: (value: string) => void
  issueTabs?: WorkspaceIssueTab[]
  viewTabs?: WorkspaceViewTab[]
  activeViewTab?: string
  showIssueTabs?: boolean
  workspaceLabel?: string
  onSearch?: () => void
  onNewIssue?: () => void
  onAskLinear?: () => void
  onHistory?: () => void
  showWhatsNew?: boolean
  children: React.ReactNode
  secondary?: React.ReactNode
  footer?: React.ReactNode
}

function WorkspaceShell({
  team = "Engineering",
  view = "Cycle 24",
  breadcrumbs,
  activeNavId = "engineering",
  activeTab = "all",
  onTabChange,
  issueTabs,
  viewTabs,
  activeViewTab,
  showIssueTabs = true,
  workspaceLabel = "AS Mobbin",
  onSearch,
  onNewIssue,
  onAskLinear,
  onHistory,
  showWhatsNew = true,
  children,
  secondary,
  footer,
}: WorkspaceShellProps) {
  const { theme, setTheme } = useTheme()
  const [expandedTeams, setExpandedTeams] = React.useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        TEAM_NAV.map((item) => [item.id, item.defaultExpanded ?? false])
      )
  )

  const defaultIssueTabs: WorkspaceIssueTab[] = [
    { id: "all", label: "All issues" },
    { id: "active", label: "Active" },
    { id: "backlog", label: "Backlog" },
  ]
  const tabs = issueTabs ?? defaultIssueTabs

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="icon"
        className="border-r border-border"
        data-slot="linear-workspace-sidebar"
      >
        <SidebarHeader className="h-12 justify-center border-b border-border px-3">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 min-w-0 flex-1 justify-between px-2 font-medium"
            >
              <span className="truncate">{workspaceLabel}</span>
              <span className="text-xs text-muted-foreground">⌄</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 shrink-0 text-muted-foreground"
              aria-label="Search"
              onClick={onSearch}
            >
              <Search className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 shrink-0 text-muted-foreground"
              aria-label="New issue"
              onClick={onNewIssue}
            >
              <SquarePen className="size-4" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {WORKSPACE_NAV.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={item.id === activeNavId}
                      render={
                        item.href ? <Link href={item.href} /> : <button type="button" />
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.badge ? (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Workspace</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {WORKSPACE_GROUP.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={item.id === activeNavId}>
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Favorites</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {FAVORITES_NAV.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={item.id === activeNavId}>
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Your teams</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {TEAM_NAV.map((item) => {
                  const expanded = expandedTeams[item.id] ?? false
                  const hasSubItems = Boolean(item.subItems?.length)

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={
                          item.id === activeNavId ||
                          item.subItems?.some((sub) => sub.id === activeNavId)
                        }
                        render={
                          item.href && !hasSubItems ? (
                            <Link href={item.href} />
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                if (hasSubItems) {
                                  setExpandedTeams((prev) => ({
                                    ...prev,
                                    [item.id]: !expanded,
                                  }))
                                }
                              }}
                            />
                          )
                        }
                      >
                        {item.icon}
                        <span>{item.label}</span>
                        {hasSubItems ? (
                          <ChevronRight
                            className={cn(
                              "ml-auto size-3.5 text-muted-foreground transition-transform",
                              expanded && "rotate-90"
                            )}
                          />
                        ) : null}
                      </SidebarMenuButton>
                      {hasSubItems && expanded ? (
                        <SidebarMenuSub>
                          {item.subItems?.map((sub) => (
                            <SidebarMenuSubItem key={sub.id}>
                              <SidebarMenuSubButton
                                isActive={sub.id === activeNavId}
                                render={<Link href={sub.href} />}
                              >
                                {sub.icon}
                                <span>{sub.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      ) : null}
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator />

          <SidebarGroup>
            <SidebarGroupLabel>Try</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {TRY_NAV.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton isActive={item.id === activeNavId}>
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="gap-2 border-t border-border p-3">
          {showWhatsNew ? (
            <WorkspaceWhatsNewCard
              title="What's new"
              description="Web forms for Linear Asks"
            />
          ) : null}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-8 text-muted-foreground"
              aria-label="Help"
            >
              <CircleHelp className="size-4" />
            </Button>
            <SidebarMenu className="flex-1">
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link href="/settings" />}>
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
          <Badge variant="outline" className="w-full justify-start gap-2 py-1.5">
            <AlertCircle className="size-3.5" />
            Business trial ends 29d
          </Badge>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset data-slot="linear-workspace-shell">
        <header
          data-slot="linear-workspace-header"
          className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm"
        >
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex min-w-0 items-center gap-1.5 text-sm">
            {breadcrumbs?.length ? (
              breadcrumbs.map((crumb, index) => (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  {index > 0 ? (
                    <span className="text-muted-foreground">/</span>
                  ) : null}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className={cn(
                        "truncate",
                        index === breadcrumbs.length - 1
                          ? "font-medium text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={cn(
                        "truncate",
                        index === breadcrumbs.length - 1
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="truncate font-medium">{team}</span>
                <span className="text-muted-foreground">/</span>
                <span className="truncate text-muted-foreground">{view}</span>
              </>
            )}
          </div>

          {showIssueTabs ? (
            <WorkspaceIssueTabs
              tabs={tabs}
              activeId={activeTab}
              onTabChange={onTabChange}
              className="ml-4 hidden md:flex"
            />
          ) : null}

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:inline-flex"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={onSearch}>
              <Search className="size-4" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                ⌘K
              </kbd>
            </Button>
            <Button size="sm">
              <Plus className="size-4" />
              <span className="hidden sm:inline">New issue</span>
            </Button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          {secondary ? (
            <aside
              data-slot="linear-workspace-secondary"
              className="hidden w-60 shrink-0 overflow-auto border-r border-border bg-background p-4 lg:block"
            >
              {secondary}
            </aside>
          ) : null}

          <div className="flex min-w-0 flex-1 flex-col overflow-auto">
            {viewTabs?.length ? (
              <WorkspaceFilterTabs
                tabs={viewTabs}
                activeId={activeViewTab ?? viewTabs[0]?.id}
              />
            ) : null}
            {children}
          </div>
        </div>

        {footer ? (
          <footer
            data-slot="linear-workspace-footer"
            className="flex shrink-0 items-center justify-end gap-2 border-t border-border px-4 py-2"
          >
            {footer}
          </footer>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}

function WorkspaceIssueTabs({
  tabs,
  activeId,
  onTabChange,
  className,
}: {
  tabs: WorkspaceIssueTab[]
  activeId: string
  onTabChange?: (value: string) => void
  className?: string
}) {
  return (
    <div
      data-slot="linear-workspace-issue-tabs"
      className={cn("flex flex-wrap items-center gap-1", className)}
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId
        const tabClassName = cn(
          "rounded-full px-2.5 py-1 text-xs transition-colors",
          active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
        )

        if (tab.href) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              data-slot="linear-workspace-issue-tab"
              data-active={active ? "true" : undefined}
              className={tabClassName}
            >
              {tab.label}
            </Link>
          )
        }

        return (
          <button
            key={tab.id}
            type="button"
            data-slot="linear-workspace-issue-tab"
            data-active={active ? "true" : undefined}
            className={tabClassName}
            onClick={() => onTabChange?.(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
      <button
        type="button"
        className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/30"
        aria-label="Add view"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  )
}

function WorkspaceWhatsNewCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      data-slot="linear-workspace-whats-new"
      className="rounded-lg border border-border bg-card p-3"
    >
      <p className="text-xs font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

function WorkspaceFooterActions({
  onAsk,
  onHistory,
  className,
}: {
  onAsk?: () => void
  onHistory?: () => void
  className?: string
}) {
  return (
    <div
      data-slot="linear-workspace-footer-actions"
      className={cn("flex items-center gap-2", className)}
    >
      <WorkspaceAskTrigger onClick={onAsk} />
      <Button
        variant="ghost"
        size="icon-sm"
        className="size-8 text-muted-foreground"
        aria-label="Chat history"
        onClick={onHistory}
      >
        <History className="size-4" />
      </Button>
    </div>
  )
}

function WorkspaceFilterTabs({
  tabs,
  activeId,
}: {
  tabs: WorkspaceViewTab[]
  activeId: string
}) {
  return (
    <div
      data-slot="linear-workspace-filter-tabs"
      className="flex flex-wrap gap-1 border-b border-border px-4 py-2"
    >
      {tabs.map((tab) => {
        const active = tab.id === activeId
        const className = cn(
          "rounded-full px-2.5 py-1 text-xs transition-colors",
          active
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
        )

        if (tab.href) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              data-slot="linear-workspace-filter-tab"
              data-active={active ? "true" : undefined}
              className={className}
            >
              {tab.label}
            </Link>
          )
        }

        return (
          <button
            key={tab.id}
            type="button"
            data-slot="linear-workspace-filter-tab"
            data-active={active ? "true" : undefined}
            className={className}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

function WorkspaceDocumentRow({
  title,
  project,
  icon,
}: {
  title: string
  project: string
  icon?: React.ReactNode
}) {
  return (
    <div
      data-slot="linear-workspace-document-row"
      className="flex items-center gap-2 border-b border-border px-4 py-2.5 last:border-b-0"
    >
      <span className="shrink-0 text-muted-foreground">
        {icon ?? <FileText className="size-4" />}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {title}
      </span>
      <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
      <span className="inline-flex min-w-0 max-w-[40%] items-center gap-1.5 truncate text-sm text-muted-foreground">
        <FolderKanban className="size-3.5 shrink-0" />
        <span className="truncate">{project}</span>
      </span>
    </div>
  )
}

function WorkspaceListPanel({
  title,
  count,
  children,
  className,
}: {
  title: string
  count?: number
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      data-slot="linear-workspace-list"
      className={cn("flex min-h-0 flex-1 flex-col", className)}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <h2 className="text-sm font-medium tracking-tight">{title}</h2>
        {count != null ? (
          <span className="font-mono text-xs text-muted-foreground">{count} items</span>
        ) : null}
      </div>
      <div role="list" className="min-h-0 flex-1 overflow-auto">
        {children}
      </div>
    </section>
  )
}

function WorkspaceAskTrigger({
  onClick,
  className,
}: {
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      data-slot="linear-workspace-ask-trigger"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/30 hover:text-foreground",
        className
      )}
      onClick={onClick}
    >
      <Sparkles className="size-3.5" />
      Ask Linear
    </button>
  )
}

function WorkspaceAskBar({
  value,
  onChange,
  onSubmit,
  className,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit?: () => void
  className?: string
}) {
  return (
    <div
      data-slot="linear-workspace-ask-bar"
      className={cn("flex w-full max-w-md items-center gap-2", className)}
    >
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask Linear anything…"
        className="h-8"
        onKeyDown={(event) => {
          if (event.key === "Enter") onSubmit?.()
        }}
      />
      <Button size="sm" disabled={!value.trim()} onClick={onSubmit}>
        Send
      </Button>
    </div>
  )
}

export {
  WorkspaceAskBar,
  WorkspaceAskTrigger,
  WorkspaceDocumentRow,
  WorkspaceFilterTabs,
  WorkspaceFooterActions,
  WorkspaceIssueTabs,
  WorkspaceListPanel,
  WorkspaceShell,
  WorkspaceWhatsNewCard,
}
