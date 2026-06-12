import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { House, Tray } from "@/lib/icons"
import { describe, it, expect, beforeEach, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

function SidebarStateProbe() {
  const { open, openMobile } = useSidebar()
  return (
    <span data-testid="sidebar-state">
      {open ? "open" : "closed"}:{openMobile ? "mobile-open" : "mobile-closed"}
    </span>
  )
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  )
  class ResizeObserverMock {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverMock)
  document.cookie = "sidebar_state=; max-age=0"
})

describe("Sidebar", () => {
  it("exposes sidebar state through useSidebar", () => {
    render(
      <SidebarProvider defaultOpen>
        <SidebarStateProbe />
      </SidebarProvider>,
    )
    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("open:mobile-closed")
  })

  it("renders menu items inside a provider", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive>
                      <House />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <Tray />
                      Inbox
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
          <span>Main content</span>
        </SidebarInset>
      </SidebarProvider>,
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(screen.getByText("Inbox")).toBeInTheDocument()
    expect(screen.getByText("Main content")).toBeInTheDocument()
    expect(document.querySelector('[data-slot="sidebar"]')).toBeInTheDocument()
  })

  it("lets a menu icon's explicit size win via the auto-size escape hatch", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <House />
                  Home
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    )
    const button = document.querySelector(
      '[data-slot="sidebar-menu-button"]',
    ) as HTMLElement
    expect(button.className).toContain("[&_svg:not([class*='size-'])]:size-4")
  })

  it("toggles collapsed state from the trigger", async () => {
    const user = userEvent.setup()
    render(
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <House />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>,
    )

    const sidebar = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(sidebar).toHaveAttribute("data-state", "expanded")
    await user.click(screen.getByRole("button", { name: /toggle sidebar/i }))
    expect(sidebar).toHaveAttribute("data-state", "collapsed")
  })

  it("renders extended sidebar parts", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarInput placeholder="Search" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Nav</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add item">+</SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Home">
                      <House />
                      Home
                    </SidebarMenuButton>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                    <SidebarMenuAction aria-label="More">…</SidebarMenuAction>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSkeleton showIcon />
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive>
                          <Tray />
                          Nested
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </SidebarContent>
          <SidebarFooter>Footer</SidebarFooter>
          <SidebarRail aria-label="Resize sidebar" />
        </Sidebar>
        <SidebarInset>Content</SidebarInset>
      </SidebarProvider>,
    )

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument()
    expect(screen.getByText("Footer")).toBeInTheDocument()
    expect(screen.getByText("Nested")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("toggles from the keyboard shortcut", async () => {
    render(
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <House />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>,
    )

    const sidebar = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(sidebar).toHaveAttribute("data-state", "expanded")
    fireEvent.keyDown(window, { key: "b", metaKey: true })
    expect(sidebar).toHaveAttribute("data-state", "collapsed")
  })

  it("renders a non-collapsible sidebar", () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>Static</SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    )
    expect(screen.getByText("Static")).toBeInTheDocument()
  })

  it("toggles from the rail control", async () => {
    const user = userEvent.setup()
    render(
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <House />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail aria-label="Toggle sidebar" />
        </Sidebar>
      </SidebarProvider>,
    )

    const sidebar = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    await user.click(screen.getByRole("button", { name: /toggle sidebar/i }))
    expect(sidebar).toHaveAttribute("data-state", "collapsed")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <House />
                      Home
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("keeps right-side gap spacing on the trailing edge", async () => {
    const user = userEvent.setup()
    render(
      <div className="relative h-64 w-full overflow-hidden">
        <SidebarProvider contained defaultOpen className="h-full">
          <Sidebar side="right" collapsible="icon">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <House />
                        Home
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <SidebarTrigger />
            Main
          </SidebarInset>
        </SidebarProvider>
      </div>,
    )

    const sidebar = document.querySelector('[data-slot="sidebar"]') as HTMLElement
    expect(sidebar).toHaveAttribute("data-side", "right")
    expect(sidebar.className).toContain("order-last")

    const gap = document.querySelector('[data-slot="sidebar-gap"]') as HTMLElement
    expect(gap).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /toggle sidebar/i }))
    expect(sidebar).toHaveAttribute("data-state", "collapsed")
    expect(gap).toBeInTheDocument()
  })

  it("renders inside a bounded container when contained", () => {
    render(
      <div className="relative h-64 w-full overflow-hidden">
        <SidebarProvider contained className="h-full">
          <Sidebar collapsible="icon">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton>
                        <House />
                        Home
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>Main</SidebarInset>
        </SidebarProvider>
      </div>,
    )

    const wrapper = document.querySelector('[data-slot="sidebar-wrapper"]')
    expect(wrapper).toHaveAttribute("data-contained", "true")
    expect(screen.getByText("Home")).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="sidebar-container"]'),
    ).toHaveClass("absolute")
  })

  it("throws when useSidebar is used outside a provider", () => {
    function Orphan() {
      useSidebar()
      return null
    }
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    expect(() => render(<Orphan />)).toThrow(
      "useSidebar must be used within a SidebarProvider.",
    )
    spy.mockRestore()
  })

  it("forwards open state to a controlled onOpenChange handler", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <SidebarProvider defaultOpen onOpenChange={onOpenChange}>
        <SidebarTrigger />
        <SidebarStateProbe />
      </SidebarProvider>,
    )
    await user.click(screen.getByRole("button"))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("renders the sidebar inside a Sheet on mobile viewports", async () => {
    const user = userEvent.setup()
    const original = window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 480,
    })
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar>
          <SidebarContent>
            <span>Mobile nav</span>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>,
    )
    // On a mobile viewport the sidebar takes the Sheet branch; opening it via the
    // trigger portals the SheetContent carrying data-mobile="true".
    await user.click(screen.getByRole("button"))
    const mobileSidebar = await screen.findByText("Mobile nav")
    expect(
      mobileSidebar.closest('[data-mobile="true"]'),
    ).not.toBeNull()
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: original,
    })
  })
})
