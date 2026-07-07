"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  ArrowUpRight,
  ChevronRight,
  CreditCard,
  Download,
  ExternalLink,
  Key,
  Moon,
  Settings,
  Shield,
  Sun,
  Tag,
  Upload,
  Users,
  AlertCircle,
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
    label: "Projects",
    items: [
      { id: "labels", label: "Labels", icon: <Tag /> },
      { id: "templates", label: "Templates", icon: <Settings /> },
    ],
  },
  {
    label: "Administration",
    items: [
      { id: "workspace", label: "Workspace", icon: <Settings /> },
      { id: "members", label: "Members", icon: <Users /> },
      { id: "security", label: "Security", icon: <Shield /> },
      { id: "api", label: "API", icon: <Key /> },
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
}

function SettingsShell({
  title,
  children,
  activeId = "import-export",
}: SettingsShellProps) {
  const { theme, setTheme } = useTheme()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" className="border-r border-border">
        <SidebarHeader className="h-12 justify-center border-b border-border px-3">
          <span className="truncate text-sm font-medium text-foreground">
            Settings
          </span>
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

        <div className="flex-1 overflow-auto bg-background p-6 md:p-8">
          <div className="mx-auto max-w-2xl space-y-10">{children}</div>
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
  description?: string
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
  SettingsList,
  SettingsRow,
  SettingsSection,
  SettingsShell,
}
