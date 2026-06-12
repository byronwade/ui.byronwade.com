"use client"

import { Gear, House, Tray } from "@/lib/icons"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Example() {
  return (
    <div className="h-[min(28rem,70vh)] w-full min-w-0 overflow-hidden rounded-xl edge bg-background">
      <SidebarProvider contained className="h-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Home">
                      <House />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Inbox">
                      <Tray />
                      Inbox
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Gear />
                      Settings
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-h-0">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <span className="text-sm font-medium">Dashboard</span>
          </header>
          <div className="flex-1 overflow-auto p-4 text-sm text-muted-foreground">
            Main content area
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
