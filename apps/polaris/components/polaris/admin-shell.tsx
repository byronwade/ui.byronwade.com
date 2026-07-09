"use client"

import * as React from "react"
import Link from "next/link"
import {
  BookOpen,
  CreditCard,
  Home,
  LayoutGrid,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Truck,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"

type AdminNavItem = {
  id: string
  label: string
  href: string
  icon: React.ReactNode
}

const PRIMARY_NAV: AdminNavItem[] = [
  { id: "home", label: "Home", href: "/", icon: <Home /> },
  { id: "products", label: "Products", href: "/products", icon: <Package /> },
  { id: "orders", label: "Orders", href: "/orders", icon: <ShoppingCart /> },
  { id: "customers", label: "Customers", href: "/customers", icon: <Users /> },
  { id: "settings", label: "Settings", href: "/settings", icon: <Settings /> },
]

const SETTINGS_NAV: AdminNavItem[] = [
  {
    id: "settings-general",
    label: "General",
    href: "/settings/general",
    icon: <Store />,
  },
  {
    id: "settings-payments",
    label: "Payments",
    href: "/settings/payments",
    icon: <CreditCard />,
  },
  {
    id: "settings-shipping",
    label: "Shipping",
    href: "/settings/shipping",
    icon: <Truck />,
  },
]

const DEV_NAV: AdminNavItem[] = [
  { id: "catalog", label: "Catalog", href: "/catalog", icon: <LayoutGrid /> },
  {
    id: "styleguide",
    label: "Styleguide",
    href: "/styleguide",
    icon: <BookOpen />,
  },
]

type AdminShellProps = {
  activeId: string
  title: string
  children: React.ReactNode
  headerActions?: React.ReactNode
}

function AdminShell({
  activeId,
  title,
  children,
  headerActions,
}: AdminShellProps) {
  const showSettingsNav =
    activeId === "settings" || activeId.startsWith("settings-")

  return (
    <SidebarProvider defaultOpen>
      <Sidebar
        collapsible="icon"
        className="border-r border-border"
        data-slot="polaris-admin-sidebar"
      >
        <SidebarHeader className="h-12 justify-center border-b border-border px-3">
          <div className="flex items-center gap-2 px-1">
            <span className="truncate text-sm font-semibold text-foreground">
              Snowpeak Outfitters
            </span>
            <Badge variant="outline" className="font-mono text-[10px]">
              polaris
            </Badge>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {PRIMARY_NAV.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={
                        item.id === activeId ||
                        (item.id === "settings" && showSettingsNav)
                      }
                      render={<Link href={item.href} />}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {showSettingsNav ? (
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {SETTINGS_NAV.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={item.id === activeId}
                        render={<Link href={item.href} />}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : null}

          <SidebarGroup>
            <SidebarGroupLabel>Design system</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {DEV_NAV.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={item.id === activeId}
                      render={<Link href={item.href} />}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-3">
          <p className="px-1 text-xs text-muted-foreground">
            Shopify admin demo · byronwade/ui
          </p>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset data-slot="polaris-admin-shell">
        <header
          data-slot="polaris-admin-header"
          className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm"
        >
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="truncate text-sm font-medium text-foreground">{title}</h1>
          {headerActions ? (
            <div className="ml-auto flex items-center gap-2">{headerActions}</div>
          ) : null}
        </header>

        <div
          data-slot="polaris-admin-content"
          className="flex min-h-0 flex-1 flex-col overflow-auto bg-background p-4 md:p-6"
        >
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { AdminShell }
export type { AdminShellProps }
