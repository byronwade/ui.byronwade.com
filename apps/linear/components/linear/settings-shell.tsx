"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  ArrowUpRight,
  Bell,
  Bot,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Key,
  Layers,
  Moon,
  RefreshCw,
  Settings,
  Shield,
  Sparkles,
  Sun,
  Tag,
  Timer,
  Upload,
  Users,
  AlertCircle,
  AppWindow,
  Check,
  Circle,
  Columns3,
  Laptop,
  MessageSquare,
  Plug,
  Plus,
  SlidersHorizontal,
  Smile,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type SettingsNavItem = {
  id: string
  label: string
  icon: React.ReactNode
  href?: string
}

type SettingsNavGroup = {
  label: string
  items: SettingsNavItem[]
}

const NAV_GROUPS: SettingsNavGroup[] = [
  {
    label: "Preferences",
    items: [
      {
        id: "notifications",
        label: "Notifications",
        icon: <Bell />,
        href: "/settings/notifications",
      },
      {
        id: "agent",
        label: "Agent personalization",
        icon: <Bot />,
        href: "/settings/agent",
      },
      {
        id: "security",
        label: "Security & access",
        icon: <Shield />,
        href: "/settings/security",
      },
    ],
  },
  {
    label: "Issues",
    items: [
      {
        id: "issue-labels",
        label: "Labels",
        icon: <Tag />,
        href: "/settings/issues/labels",
      },
      {
        id: "issue-templates",
        label: "Templates",
        icon: <FileText />,
        href: "/settings/issues/templates",
      },
      {
        id: "issue-slas",
        label: "SLAs",
        icon: <Timer />,
        href: "/settings/issues/slas",
      },
    ],
  },
  {
    label: "Projects",
    items: [
      { id: "project-labels", label: "Labels", icon: <Tag /> },
      { id: "project-templates", label: "Templates", icon: <Settings /> },
      {
        id: "project-statuses",
        label: "Statuses",
        icon: <Columns3 />,
        href: "/settings/projects/statuses",
      },
      {
        id: "project-updates",
        label: "Updates",
        icon: <RefreshCw />,
        href: "/settings/projects/updates",
      },
    ],
  },
  {
    label: "Features",
    items: [
      {
        id: "ai-agents",
        label: "AI & Agents",
        icon: <Sparkles />,
        href: "/settings/features/ai-agents",
      },
      {
        id: "initiatives",
        label: "Initiatives",
        icon: <Columns3 />,
        href: "/settings/features/initiatives",
      },
      {
        id: "documents",
        label: "Documents",
        icon: <FileText />,
        href: "/settings/features/documents",
      },
      {
        id: "customer-requests",
        label: "Customer requests",
        icon: <Users />,
        href: "/settings/features/customer-requests",
      },
      {
        id: "pulse",
        label: "Pulse",
        icon: <Layers />,
        href: "/settings/features/pulse",
      },
      {
        id: "asks",
        label: "Asks",
        icon: <MessageSquare />,
        href: "/settings/features/asks",
      },
      { id: "emojis", label: "Emojis", icon: <Smile /> },
      { id: "integrations", label: "Integrations", icon: <Plug /> },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "workspace", label: "Workspace", icon: <Settings /> },
      {
        id: "teams",
        label: "Teams",
        icon: <Users />,
        href: "/settings/teams/engineering",
      },
      {
        id: "members",
        label: "Members",
        icon: <Users />,
        href: "/settings/members",
      },
      {
        id: "admin-security",
        label: "Security",
        icon: <Shield />,
        href: "/settings/security",
      },
      { id: "api", label: "API", icon: <Key />, href: "/settings/api" },
      {
        id: "applications",
        label: "Applications",
        icon: <AppWindow />,
        href: "/settings/applications",
      },
      {
        id: "billing",
        label: "Billing",
        icon: <CreditCard />,
        href: "/settings/billing",
      },
      {
        id: "import-export",
        label: "Import & export",
        icon: <Upload />,
        href: "/settings",
      },
    ],
  },
]

const YOUR_TEAMS_GROUP: SettingsNavGroup = {
  label: "Your teams",
  items: [
    {
      id: "engineering-team",
      label: "Engineering Team",
      icon: <Laptop />,
      href: "/settings/teams/engineering",
    },
    {
      id: "as-mobbin",
      label: "AS Mobbin",
      icon: <Users />,
      href: "/settings/teams/as-mobbin",
    },
    {
      id: "join-team",
      label: "Join or create a team",
      icon: <Plus />,
      href: "/settings/teams/new",
    },
  ],
}

const NAV_GROUPS_WITH_TEAMS: SettingsNavGroup[] = [
  ...NAV_GROUPS,
  YOUR_TEAMS_GROUP,
]

type SettingsShellProps = {
  title: string
  children: React.ReactNode
  activeId?: string
  wide?: boolean
}

function SettingsShell({
  title,
  children,
  activeId = "import-export",
  wide = false,
}: SettingsShellProps) {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-border">
        <SidebarHeader className="h-12 justify-center border-b border-border px-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-full justify-start gap-1.5 px-2 text-muted-foreground"
            render={<Link href="/workspace" />}
          >
            <ChevronLeft className="size-3.5" />
            Back to app
          </Button>
        </SidebarHeader>
        <SidebarContent>
          {NAV_GROUPS_WITH_TEAMS.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={item.id === activeId}
                        render={
                          item.href ? (
                            <Link href={item.href} />
                          ) : (
                            <button type="button" />
                          )
                        }
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="gap-2 border-t border-border p-3">
          <SettingsWhatsNewCard
            title="What's new"
            description="Web forms for Linear Asks"
          />
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-8 text-muted-foreground"
            aria-label="Help"
          >
            <CircleHelp className="size-4" />
          </Button>
          <Badge variant="outline" className="w-full justify-start gap-2 py-1.5">
            <AlertCircle className="size-3.5" />
            Business trial ends 29d
          </Badge>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-border px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-muted-foreground sm:inline-flex"
              render={<Link href="/" />}
            >
              Linear UI
            </Button>
            <span className="hidden text-muted-foreground sm:inline">/</span>
            <h1 className="truncate text-sm font-medium">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
            <Button variant="outline" size="sm" render={<Link href="/catalog" />}>
              Catalog
            </Button>
          </div>
        </header>

        <div
          data-slot="linear-settings-shell"
          className="flex-1 overflow-auto bg-background p-6 md:p-8"
        >
          <div
            className={cn(
              "mx-auto space-y-10",
              wide ? "max-w-4xl" : "max-w-2xl"
            )}
          >
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function SettingsSection({
  title: sectionTitle,
  description,
  children,
  className,
}: {
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <div className="space-y-1">
        <h2
          data-slot="linear-settings-section-label"
          className="text-sm font-medium"
        >
          {sectionTitle}
        </h2>
        {description ? (
          <p data-slot="linear-settings-section-desc">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function SettingsList({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <ItemGroup
      data-slot="linear-settings-list"
      className={cn("gap-0", className)}
    >
      {children}
    </ItemGroup>
  )
}

function SettingsBackLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      data-slot="linear-settings-back-link"
      className="inline-flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ChevronLeft className="size-3.5" />
      {children}
    </Link>
  )
}

function SettingsPageIntro({
  title,
  description,
}: {
  title: string
  description?: React.ReactNode
}) {
  return (
    <div className="space-y-1">
      <h1
        data-slot="linear-settings-page-title"
        className="text-xl font-medium tracking-tight text-foreground"
      >
        {title}
      </h1>
      {description ? (
        <p data-slot="linear-settings-page-desc" className="text-sm text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

function SettingsToggleRow({
  title,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
}: {
  title: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <div
      data-slot="linear-settings-toggle-row"
      className="flex items-center justify-between gap-4 px-4 py-3"
    >
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <Switch
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  )
}

function SettingsFormCard({
  children,
  footer,
  className,
}: {
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="linear-settings-form-card"
      className={cn("overflow-hidden rounded-lg border border-border bg-card", className)}
    >
      <div className="p-5">{children}</div>
      {footer ? (
        <div
          data-slot="linear-settings-form-footer"
          className="flex items-center justify-end gap-2 border-t border-border px-5 py-3"
        >
          {footer}
        </div>
      ) : null}
    </div>
  )
}

function SettingsStatusDot({
  status,
  children,
}: {
  status: "enabled" | "disabled"
  children: React.ReactNode
}) {
  return (
    <span
      data-slot="linear-status-dot"
      data-status={status}
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {children}
    </span>
  )
}

function SettingsSubheading({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      data-slot="linear-settings-subheading"
      className={cn("text-xs font-medium text-foreground", className)}
    >
      {children}
    </p>
  )
}

function SettingsRow({
  icon,
  title,
  description,
  action,
  href,
  onClick,
}: {
  icon?: React.ReactNode
  title: string
  description?: React.ReactNode
  action?: React.ReactNode
  href?: string
  onClick?: () => void
}) {
  const content = (
    <>
      {icon ? <ItemMedia variant="icon">{icon}</ItemMedia> : null}
      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {description ? <ItemDescription>{description}</ItemDescription> : null}
      </ItemContent>
      <ItemActions>
        {action ?? <ChevronRight className="size-4 text-muted-foreground" />}
      </ItemActions>
    </>
  )

  if (href) {
    return (
      <Item
        size="default"
        variant="default"
        className="cursor-pointer rounded-none border-0 px-4 py-3"
        render={<Link href={href} />}
      >
        {content}
      </Item>
    )
  }

  return (
    <Item
      size="default"
      variant="default"
      className={cn(
        "rounded-none border-0 px-4 py-3",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      {content}
    </Item>
  )
}

function SettingsEditRow({
  summary,
  onEdit,
  editLabel = "Edit",
}: {
  summary: string
  onEdit?: () => void
  editLabel?: string
}) {
  return (
    <div
      data-slot="linear-settings-edit-row"
      className="flex items-center justify-between gap-4 px-4 py-3"
    >
      <p className="text-sm text-foreground">{summary}</p>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        {editLabel}
      </Button>
    </div>
  )
}

function SettingsIntegrationRow({
  icon,
  title,
  description,
  actionLabel = "Connect",
  onAction,
}: {
  icon?: React.ReactNode
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}) {
  return (
    <div
      data-slot="linear-settings-integration-row"
      className="flex items-start justify-between gap-4 px-4 py-3"
    >
      <div className="flex min-w-0 items-start gap-3">
        {icon ? (
          <span className="mt-0.5 shrink-0 text-muted-foreground">{icon}</span>
        ) : null}
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-foreground">{title}</p>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </div>
      <Button variant="ghost" size="sm" className="shrink-0 gap-1" onClick={onAction}>
        {actionLabel}
        <ExternalLink className="size-3" />
      </Button>
    </div>
  )
}

function SettingsEmptyRow({
  label,
  onAdd,
}: {
  label: string
  onAdd?: () => void
}) {
  return (
    <div
      data-slot="linear-settings-empty-row"
      className="flex items-center justify-between gap-4 px-4 py-3"
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <Button variant="ghost" size="icon-sm" aria-label="Add" onClick={onAdd}>
        <Plus className="size-4" />
      </Button>
    </div>
  )
}

function SettingsListHeader({
  count,
  onAdd,
  addLabel = "Add",
}: {
  count: string
  onAdd?: () => void
  addLabel?: string
}) {
  return (
    <div
      data-slot="linear-settings-list-header"
      className="flex items-center justify-between gap-3 rounded-t-lg border border-b-0 border-border bg-muted/30 px-4 py-2"
    >
      <span className="text-xs text-muted-foreground">{count}</span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={addLabel}
        onClick={onAdd}
      >
        <Plus className="size-4" />
      </Button>
    </div>
  )
}

type SettingsStatusSwatch = {
  id: string
  label: string
  color: "blue" | "green" | "red" | "orange" | "purple" | "gray"
}

function SettingsStatusSwatchList({
  count,
  items,
  onAdd,
}: {
  count: string
  items: SettingsStatusSwatch[]
  onAdd?: () => void
}) {
  return (
    <div data-slot="linear-settings-status-list">
      <SettingsListHeader count={count} onAdd={onAdd} />
      <SettingsList className="rounded-t-none border-t-0">
        {items.map((item) => (
          <div
            key={item.id}
            data-slot="linear-settings-status-row"
            className="flex items-center gap-3 px-4 py-2.5"
          >
            <span
              data-slot="linear-status-swatch"
              data-color={item.color}
              className="size-3 shrink-0 rounded-sm"
            />
            <span className="text-sm text-foreground">{item.label}</span>
          </div>
        ))}
      </SettingsList>
    </div>
  )
}

function SettingsBehaviorRow({
  icon,
  label,
  value,
  defaultValue = "show",
  onValueChange,
  onFilter,
}: {
  icon?: React.ReactNode
  label: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onFilter?: () => void
}) {
  return (
    <div
      data-slot="linear-behavior-row"
      className="flex items-center justify-between gap-3 px-4 py-2.5"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        {icon ? (
          <span className="shrink-0 text-muted-foreground [&>svg]:size-4">
            {icon}
          </span>
        ) : null}
        <span className="text-sm text-foreground">{label}</span>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={(next) => {
            if (next) onValueChange?.(next)
          }}
        >
          <SelectTrigger
            data-slot="linear-behavior-select"
            className="h-7 w-[88px] border-0 bg-transparent px-2 text-xs shadow-none"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="show">Show</SelectItem>
            <SelectItem value="hide">Hide</SelectItem>
            <SelectItem value="auto">Auto-apply</SelectItem>
          </SelectContent>
        </Select>
        {onFilter ? (
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-7 text-muted-foreground"
            aria-label="Filter"
            onClick={onFilter}
          >
            <SlidersHorizontal className="size-3.5" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

function SettingsScheduleCard({
  cadence,
  day = "Friday",
  window = "2PM – 3PM",
  onSave,
}: {
  cadence: "none" | "weekly" | "biweekly" | "monthly"
  day?: string
  window?: string
  onSave?: (value: {
    cadence: "none" | "weekly" | "biweekly" | "monthly"
    day: string
    window: string
  }) => void
}) {
  const [editing, setEditing] = React.useState(false)
  const [draftCadence, setDraftCadence] = React.useState(cadence)
  const [draftDay, setDraftDay] = React.useState(day)
  const [draftWindow, setDraftWindow] = React.useState(window)
  const [saved, setSaved] = React.useState({ cadence, day, window })

  const summary =
    saved.cadence === "none"
      ? "No expectation for updates"
      : saved.cadence === "biweekly"
        ? `Every 2 weeks on ${saved.day} between ${saved.window}`
        : saved.cadence === "weekly"
          ? `Every week on ${saved.day} between ${saved.window}`
          : "Every month"

  const handleSave = () => {
    setSaved({
      cadence: draftCadence,
      day: draftDay,
      window: draftWindow,
    })
    onSave?.({
      cadence: draftCadence,
      day: draftDay,
      window: draftWindow,
    })
    setEditing(false)
  }

  const handleCancel = () => {
    setDraftCadence(saved.cadence)
    setDraftDay(saved.day)
    setDraftWindow(saved.window)
    setEditing(false)
  }

  if (!editing) {
    return (
      <SettingsList>
        <SettingsEditRow
          summary={summary}
          onEdit={() => {
            setDraftCadence(saved.cadence)
            setDraftDay(saved.day)
            setDraftWindow(saved.window)
            setEditing(true)
          }}
        />
      </SettingsList>
    )
  }

  return (
    <SettingsFormCard
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </>
      }
    >
      <div
        data-slot="linear-update-schedule"
        className="flex flex-wrap items-center gap-2 text-sm"
      >
        <Select
          value={draftCadence}
          onValueChange={(value) => {
            if (!value) return
            setDraftCadence(value as typeof draftCadence)
          }}
        >
          <SelectTrigger className="h-8 w-auto min-w-[220px]">
            <SelectValue placeholder="Cadence" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No expectation for updates</SelectItem>
            <SelectItem value="weekly">Every week</SelectItem>
            <SelectItem value="biweekly">Every 2 weeks</SelectItem>
            <SelectItem value="monthly">Every month</SelectItem>
          </SelectContent>
        </Select>

        {draftCadence !== "none" && draftCadence !== "monthly" ? (
          <>
            <span className="text-muted-foreground">on</span>
            <Select
              value={draftDay.toLowerCase()}
              onValueChange={(value) => {
                if (!value) return
                setDraftDay(value.charAt(0).toUpperCase() + value.slice(1))
              }}
            >
              <SelectTrigger className="h-8 w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friday">Friday</SelectItem>
                <SelectItem value="monday">Monday</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">between</span>
            <Select
              value={draftWindow === "2PM – 3PM" ? "2-3" : "9-10"}
              onValueChange={(value) => {
                if (!value) return
                setDraftWindow(value === "2-3" ? "2PM – 3PM" : "9AM – 10AM")
              }}
            >
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-3">2PM – 3PM</SelectItem>
                <SelectItem value="9-10">9AM – 10AM</SelectItem>
              </SelectContent>
            </Select>
          </>
        ) : null}
      </div>
    </SettingsFormCard>
  )
}

function SettingsWhatsNewCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div
      data-slot="linear-settings-whats-new"
      className="rounded-lg border border-border bg-card p-3"
    >
      <p className="text-xs font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
    </div>
  )
}

function SettingsFormGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="linear-settings-form-group"
      className={cn(
        "overflow-hidden rounded-lg border border-border bg-card",
        className
      )}
    >
      {children}
    </div>
  )
}

function SettingsFieldRow({
  label,
  description,
  children,
  trailing,
  className,
}: {
  label: string
  description?: string
  children?: React.ReactNode
  trailing?: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="linear-settings-field-row"
      className={cn(
        "flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0",
        className
      )}
    >
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ?? trailing}
    </div>
  )
}

function SettingsMetaRow({
  icon,
  title,
  description,
  meta,
  href,
}: {
  icon?: React.ReactNode
  title: string
  description?: React.ReactNode
  meta?: string
  href?: string
}) {
  return (
    <SettingsRow
      icon={icon}
      title={title}
      description={description}
      href={href}
      action={
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          {meta}
          <ChevronRight className="size-3.5" />
        </span>
      }
    />
  )
}

function SettingsTierList({
  count,
  items,
  onAdd,
}: {
  count: string
  items: Array<{ id: string; name: string; description: string }>
  onAdd?: () => void
}) {
  return (
    <div data-slot="linear-settings-tier-list">
      <SettingsListHeader count={count} onAdd={onAdd} />
      <SettingsList className="rounded-t-none border-t-0">
        {items.map((item) => (
          <div
            key={item.id}
            data-slot="linear-settings-tier-row"
            className="px-4 py-3"
          >
            <p className="text-sm text-foreground">
              <span className="font-medium">{item.name}</span>
              <span className="text-muted-foreground"> · {item.description}</span>
            </p>
          </div>
        ))}
      </SettingsList>
    </div>
  )
}

function SettingsTeamHeader({
  icon,
  title,
}: {
  icon?: React.ReactNode
  title: string
}) {
  return (
    <div
      data-slot="linear-settings-team-header"
      className="flex items-center gap-3"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-muted/30 text-muted-foreground">
        {icon ?? <Laptop className="size-5" />}
      </span>
      <h1 className="text-xl font-medium tracking-tight text-foreground">
        {title}
      </h1>
    </div>
  )
}

function SettingsStepper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      data-slot="linear-settings-stepper"
      className={cn("space-y-8", className)}
    >
      {children}
    </div>
  )
}

function SettingsStep({
  title,
  description,
  status = "pending",
  children,
  action,
}: {
  title: string
  description?: React.ReactNode
  status?: "pending" | "active" | "complete"
  children?: React.ReactNode
  action?: React.ReactNode
}) {
  return (
    <div
      data-slot="linear-settings-step"
      data-status={status}
      className="relative pl-8"
    >
      <span
        data-slot="linear-settings-step-indicator"
        className="absolute left-0 top-0.5 flex size-5 items-center justify-center"
      >
        {status === "complete" ? (
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" />
          </span>
        ) : status === "active" ? (
          <span className="inline-flex size-5 items-center justify-center rounded-full border-2 border-primary">
            <span className="size-2 rounded-full bg-primary" />
          </span>
        ) : (
          <Circle className="size-5 text-muted-foreground/40" />
        )}
      </span>
      <div className="space-y-3">
        <div className="space-y-1">
          <p
            className={cn(
              "text-sm font-medium",
              status === "pending" ? "text-muted-foreground" : "text-foreground"
            )}
          >
            {title}
          </p>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children}
        {action ? <div className="flex justify-end">{action}</div> : null}
      </div>
    </div>
  )
}

function ImportExportSettings() {
  return (
    <>
      <SettingsSection
        title="Import assistant"
        description={
          <>
            Import issues and projects from other tools.{" "}
            <Link
              href="https://linear.app/docs/import-issues"
              className="inline-flex items-center gap-0.5 text-[inherit] underline-offset-2 hover:underline"
            >
              Docs
              <ExternalLink className="size-3" />
            </Link>
          </>
        }
      >
        <SettingsList>
          <SettingsRow title="Asana" icon={<Upload />} />
          <SettingsRow title="Shortcut" icon={<Upload />} />
          <SettingsRow title="GitHub" icon={<Upload />} />
          <SettingsRow title="Jira" icon={<Upload />} />
          <SettingsRow title="Linear" icon={<Upload />} href="/settings/import" />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="CLI import"
        description="Import data from the command line for advanced workflows."
      >
        <SettingsList>
          <SettingsRow
            title="CLI Importer"
            action={
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                Open
                <ArrowUpRight className="size-3" />
              </span>
            }
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection title="Previous imports">
        <SettingsList>
          <SettingsRow
            title="linear.app/demo-workspace"
            description="15 issues and 0 users imported · Completed"
            icon={<Download />}
            action={
              <span className="text-xs text-muted-foreground">Details</span>
            }
          />
        </SettingsList>
      </SettingsSection>

      <SettingsSection
        title="Export"
        description="Download a copy of your workspace data."
      >
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
          <div>
            <p className="text-sm font-medium">Include private teams</p>
            <p className="text-xs text-muted-foreground">None selected</p>
          </div>
          <Button variant="outline" size="sm">
            <Upload className="size-4" />
            Export…
          </Button>
        </div>
      </SettingsSection>
    </>
  )
}

export {
  ImportExportSettings,
  SettingsBackLink,
  SettingsBehaviorRow,
  SettingsEditRow,
  SettingsEmptyRow,
  SettingsFieldRow,
  SettingsFormCard,
  SettingsFormGroup,
  SettingsIntegrationRow,
  SettingsList,
  SettingsListHeader,
  SettingsMetaRow,
  SettingsPageIntro,
  SettingsRow,
  SettingsScheduleCard,
  SettingsSection,
  SettingsShell,
  SettingsStatusDot,
  SettingsStatusSwatchList,
  SettingsStep,
  SettingsStepper,
  SettingsSubheading,
  SettingsTeamHeader,
  SettingsTierList,
  SettingsToggleRow,
  SettingsWhatsNewCard,
}
