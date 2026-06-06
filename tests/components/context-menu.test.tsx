/**
 * Tests for ContextMenu (components/ui/context-menu.tsx) — right-click menu.
 */

import * as React from "react"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuPortal,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

function BasicContextMenu() {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex h-24 items-center justify-center rounded-lg border">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>Forward</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

describe("ContextMenu — render", () => {
  it("renders the trigger without crashing", () => {
    render(<BasicContextMenu />)
    expect(screen.getByText("Right click here")).toBeInTheDocument()
  })

  it("trigger has data-slot='context-menu-trigger'", () => {
    render(<BasicContextMenu />)
    expect(screen.getByText("Right click here")).toHaveAttribute(
      "data-slot",
      "context-menu-trigger",
    )
  })

  it("menu content is not in the DOM before opening", () => {
    render(<BasicContextMenu />)
    expect(screen.queryByRole("menu")).toBeNull()
  })
})

describe("ContextMenu — interaction", () => {
  it("opens on contextmenu event", async () => {
    render(<BasicContextMenu />)
    fireEvent.contextMenu(screen.getByText("Right click here"))
    expect(await screen.findByRole("menu")).toBeInTheDocument()
  })

  it("shows menu items after opening", async () => {
    render(<BasicContextMenu />)
    fireEvent.contextMenu(screen.getByText("Right click here"))
    const menu = await screen.findByRole("menu")
    expect(within(menu).getByRole("menuitem", { name: /Back/ })).toBeInTheDocument()
    expect(within(menu).getByRole("menuitem", { name: "Delete" })).toBeInTheDocument()
  })

  it("content has data-slot attributes when open", async () => {
    render(<BasicContextMenu />)
    fireEvent.contextMenu(screen.getByText("Right click here"))
    await waitFor(() => {
      expect(document.querySelector('[data-slot="context-menu-content"]')).not.toBeNull()
      expect(document.querySelector('[data-slot="context-menu-item"]')).not.toBeNull()
      expect(document.querySelector('[data-slot="context-menu-separator"]')).not.toBeNull()
      expect(document.querySelector('[data-slot="context-menu-shortcut"]')).not.toBeNull()
    })
  })

  it("destructive item has data-variant='destructive'", async () => {
    render(<BasicContextMenu />)
    fireEvent.contextMenu(screen.getByText("Right click here"))
    await waitFor(() => {
      const item = Array.from(
        document.querySelectorAll('[data-slot="context-menu-item"]'),
      ).find((el) => el.textContent?.includes("Delete"))
      expect(item).toHaveAttribute("data-variant", "destructive")
    })
  })

  it("fires onClick when an item is selected", async () => {
    const user = userEvent.setup()
    const handler = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>Target</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={handler}>Action</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>,
    )
    fireEvent.contextMenu(screen.getByText("Target"))
    const menu = await screen.findByRole("menu")
    await user.click(within(menu).getByRole("menuitem", { name: "Action" }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it("closes on Escape", async () => {
    const user = userEvent.setup()
    render(<BasicContextMenu />)
    fireEvent.contextMenu(screen.getByText("Right click here"))
    await screen.findByRole("menu")
    await user.keyboard("{Escape}")
    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull()
    })
  })

  it("renders submenus, checkbox, and radio items", async () => {
    const user = userEvent.setup()
    render(
      <ContextMenu>
        <ContextMenuTrigger>Target</ContextMenuTrigger>
        <ContextMenuPortal>
          <ContextMenuContent>
            <ContextMenuGroup>
              <ContextMenuLabel inset>View</ContextMenuLabel>
              <ContextMenuCheckboxItem checked>Show grid</ContextMenuCheckboxItem>
              <ContextMenuSub>
                <ContextMenuSubTrigger inset>More</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuItem>Nested action</ContextMenuItem>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuRadioGroup value="list">
                <ContextMenuRadioItem value="list">List</ContextMenuRadioItem>
                <ContextMenuRadioItem value="board">Board</ContextMenuRadioItem>
              </ContextMenuRadioGroup>
            </ContextMenuGroup>
          </ContextMenuContent>
        </ContextMenuPortal>
      </ContextMenu>,
    )

    fireEvent.contextMenu(screen.getByText("Target"))
    const menu = await screen.findByRole("menu")
    expect(within(menu).getByText("View")).toBeInTheDocument()
    expect(within(menu).getByRole("menuitemcheckbox")).toBeInTheDocument()
    await user.hover(within(menu).getByRole("menuitem", { name: "More" }))
    expect(await screen.findByRole("menuitem", { name: "Nested action" })).toBeInTheDocument()
    expect(within(menu).getByRole("menuitemradio", { name: "List" })).toBeInTheDocument()
  })
})

describe("ContextMenu — accessibility", () => {
  it("closed trigger has no axe violations", async () => {
    const { container } = render(<BasicContextMenu />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
