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
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Key,
  Moon,
  RefreshCw,
  Settings,
  Shield,
  Sun,
  Tag,
  Timer,
  Upload,
  Users,
  AlertCircle,
  Columns3,
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
    label: "Administration",
    items: [
      { id: "workspace", label: "Workspace", icon: <Settings /> },
      { id: "members", label: "Members", icon: <Users /> },
      { id: "api", label: "API", icon: <Key />, href: "/settings/api" },
      {
        id: "import-export",
        label: "Import & export",
        icon: <Upload />,
        href: "/settings",
      },
      { id: "billing", label: "Billing", icon: <CreditCard /> },
    ],
  },
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
          {NAV_GROUPS.map((group) => (
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
        <SidebarFooter className="border-t border-border p-3">
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
  SettingsFormCard,
  SettingsList,
  SettingsPageIntro,
  SettingsRow,
  SettingsSection,
  SettingsShell,
  SettingsStatusDot,
  SettingsSubheading,
  SettingsToggleRow,
}
