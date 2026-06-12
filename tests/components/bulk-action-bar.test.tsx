import * as React from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { Tag } from "@/lib/icons"
import { BulkActionBar, type BulkAction } from "@/components/ui/bulk-action-bar"

const baseActions: BulkAction[] = [
  { id: "tag", label: "Add tags", promoted: true, icon: Tag },
  { label: "Archive" },
  { label: "Delete", tone: "destructive" },
]

// ─── Empty state ──────────────────────────────────────────────────────────────

describe("BulkActionBar – empty state", () => {
  it("renders null when selectedCount is 0", () => {
    const { container } = render(
      <BulkActionBar selectedCount={0} actions={baseActions} />,
    )
    expect(container.querySelector("[data-slot='bulk-action-bar']")).toBeNull()
  })

  it("renders null when selectedCount is negative", () => {
    const { container } = render(
      <BulkActionBar selectedCount={-2} actions={baseActions} />,
    )
    expect(container.firstChild).toBeNull()
  })
})

// ─── Default render ───────────────────────────────────────────────────────────

describe("BulkActionBar – default render", () => {
  it("renders the bar when selectedCount is greater than 0", () => {
    const { container } = render(
      <BulkActionBar selectedCount={3} actions={baseActions} />,
    )
    expect(
      container.querySelector("[data-slot='bulk-action-bar']"),
    ).toBeInTheDocument()
  })

  it("renders the '<n> selected' label with the count in a mono span", () => {
    const { container } = render(
      <BulkActionBar selectedCount={3} actions={baseActions} />,
    )
    const label = container.querySelector("[data-slot='bulk-action-bar-label']")
    expect(label).toHaveTextContent("3 selected")
    const count = container.querySelector("[data-slot='bulk-action-bar-count']")
    expect(count).toHaveTextContent("3")
    expect(count?.className).toContain("font-mono")
    expect(count?.className).toContain("tabular-nums")
  })

  it("merges a custom className onto the root", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={1}
        actions={baseActions}
        className="custom-class"
      />,
    )
    const root = container.querySelector("[data-slot='bulk-action-bar']")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("bg-card")
  })

  it("applies dark index styling when variant is index", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={2}
        actions={baseActions}
        variant="index"
      />,
    )
    const root = container.querySelector("[data-slot='bulk-action-bar']")
    expect(root).toHaveClass("bg-foreground")
    expect(root).toHaveClass("text-background")
  })

  it("renders every action label", () => {
    render(<BulkActionBar selectedCount={3} actions={baseActions} />)
    expect(screen.getByText("Add tags")).toBeInTheDocument()
    expect(screen.getByText("Archive")).toBeInTheDocument()
    expect(screen.getByText("Delete")).toBeInTheDocument()
  })
})

// ─── Promoted vs grouped actions ──────────────────────────────────────────────

describe("BulkActionBar – action grouping", () => {
  it("renders promoted actions outside the button group", () => {
    render(
      <BulkActionBar
        selectedCount={2}
        actions={[{ label: "Publish", promoted: true }]}
      />,
    )
    const group = screen.queryByRole("group")
    expect(group).not.toBeInTheDocument()
    expect(screen.getByText("Publish")).toBeInTheDocument()
  })

  it("renders non-promoted actions inside a button group", () => {
    render(
      <BulkActionBar
        selectedCount={2}
        actions={[{ label: "Archive" }, { label: "Move" }]}
      />,
    )
    const group = screen.getByRole("group")
    expect(within(group).getByText("Archive")).toBeInTheDocument()
    expect(within(group).getByText("Move")).toBeInTheDocument()
  })

  it("does not render a button group when there are no grouped actions", () => {
    render(
      <BulkActionBar
        selectedCount={2}
        actions={[{ label: "Publish", promoted: true }]}
      />,
    )
    expect(screen.queryByRole("group")).not.toBeInTheDocument()
  })

  it("keys grouped actions by label when no id is given", () => {
    render(
      <BulkActionBar
        selectedCount={2}
        actions={[{ label: "One" }, { label: "Two" }]}
      />,
    )
    expect(screen.getByText("One")).toBeInTheDocument()
    expect(screen.getByText("Two")).toBeInTheDocument()
  })
})

// ─── Action tone / icon / disabled ────────────────────────────────────────────

describe("BulkActionBar – action variants", () => {
  it("applies the destructive variant to a destructive-toned action", () => {
    render(
      <BulkActionBar
        selectedCount={1}
        actions={[{ label: "Delete", tone: "destructive" }]}
      />,
    )
    const action = screen
      .getByText("Delete")
      .closest("[data-slot='bulk-action-bar-action']")
    expect(action).toHaveAttribute("data-tone", "destructive")
    expect(action?.className).toContain("bg-destructive/10")
  })

  it("defaults the tone attribute to 'default'", () => {
    render(<BulkActionBar selectedCount={1} actions={[{ label: "Archive" }]} />)
    const action = screen
      .getByText("Archive")
      .closest("[data-slot='bulk-action-bar-action']")
    expect(action).toHaveAttribute("data-tone", "default")
  })

  it("renders an action icon when provided", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={1}
        actions={[{ label: "Add tags", icon: Tag }]}
      />,
    )
    const action = screen
      .getByText("Add tags")
      .closest("[data-slot='bulk-action-bar-action']")
    expect(action?.querySelector("svg")).toBeInTheDocument()
    expect(container).toBeTruthy()
  })

  it("renders no icon when none is provided", () => {
    render(<BulkActionBar selectedCount={1} actions={[{ label: "Plain" }]} />)
    const action = screen
      .getByText("Plain")
      .closest("[data-slot='bulk-action-bar-action']")
    expect(action?.querySelector("svg")).toBeNull()
  })

  it("disables an action flagged disabled", () => {
    render(
      <BulkActionBar
        selectedCount={1}
        actions={[{ label: "Archive", disabled: true }]}
      />,
    )
    expect(screen.getByText("Archive").closest("button")).toBeDisabled()
  })

  it("does not disable an action by default", () => {
    render(<BulkActionBar selectedCount={1} actions={[{ label: "Archive" }]} />)
    expect(screen.getByText("Archive").closest("button")).not.toBeDisabled()
  })
})

// ─── Action onClick ───────────────────────────────────────────────────────────

describe("BulkActionBar – action callbacks", () => {
  it("fires onClick when a promoted action is clicked", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <BulkActionBar
        selectedCount={2}
        actions={[{ label: "Publish", promoted: true, onClick }]}
      />,
    )
    await user.click(screen.getByText("Publish"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick when a grouped action is clicked", async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <BulkActionBar
        selectedCount={2}
        actions={[{ label: "Archive", onClick }]}
      />,
    )
    await user.click(screen.getByText("Archive"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not throw when an action without onClick is clicked", async () => {
    const user = userEvent.setup()
    render(
      <BulkActionBar selectedCount={2} actions={[{ label: "NoHandler" }]} />,
    )
    await user.click(screen.getByText("NoHandler"))
    expect(screen.getByText("NoHandler")).toBeInTheDocument()
  })
})

// ─── Clear selection ──────────────────────────────────────────────────────────

describe("BulkActionBar – clear selection", () => {
  it("renders a clear button when onClearSelection is provided", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={2}
        actions={baseActions}
        onClearSelection={() => {}}
      />,
    )
    expect(
      container.querySelector("[data-slot='bulk-action-bar-clear']"),
    ).toBeInTheDocument()
  })

  it("does not render a clear button when onClearSelection is omitted", () => {
    const { container } = render(
      <BulkActionBar selectedCount={2} actions={baseActions} />,
    )
    expect(
      container.querySelector("[data-slot='bulk-action-bar-clear']"),
    ).toBeNull()
  })

  it("fires onClearSelection when the clear button is clicked", async () => {
    const onClearSelection = vi.fn()
    const user = userEvent.setup()
    render(
      <BulkActionBar
        selectedCount={2}
        actions={baseActions}
        onClearSelection={onClearSelection}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Clear selection" }))
    expect(onClearSelection).toHaveBeenCalledTimes(1)
  })
})

// ─── Select-all checkbox ──────────────────────────────────────────────────────

describe("BulkActionBar – select-all checkbox", () => {
  it("renders no select-all checkbox when totalCount is omitted", () => {
    const { container } = render(
      <BulkActionBar selectedCount={2} actions={baseActions} />,
    )
    expect(
      container.querySelector("[data-slot='bulk-action-bar-select-all']"),
    ).toBeNull()
  })

  it("renders a select-all checkbox when totalCount is given", () => {
    render(
      <BulkActionBar selectedCount={2} totalCount={5} actions={baseActions} />,
    )
    expect(
      screen.getByRole("checkbox", { name: "Select all" }),
    ).toBeInTheDocument()
  })

  it("is indeterminate when some but not all rows are selected", () => {
    render(
      <BulkActionBar selectedCount={2} totalCount={5} actions={baseActions} />,
    )
    expect(
      screen.getByRole("checkbox", { name: "Select all" }),
    ).toHaveAttribute("data-indeterminate")
  })

  it("is checked when all rows are selected (derived from counts)", () => {
    render(
      <BulkActionBar selectedCount={5} totalCount={5} actions={baseActions} />,
    )
    const cb = screen.getByRole("checkbox", { name: "Select all" })
    expect(cb).toBeChecked()
    expect(cb).not.toHaveAttribute("data-indeterminate")
  })

  it("respects an explicit selectAllChecked override", () => {
    render(
      <BulkActionBar
        selectedCount={2}
        totalCount={5}
        actions={baseActions}
        selectAllChecked
        onSelectAllChange={() => {}}
      />,
    )
    const cb = screen.getByRole("checkbox", { name: "Select all" })
    expect(cb).toBeChecked()
    expect(cb).not.toHaveAttribute("data-indeterminate")
  })

  it("fires onSelectAllChange when the checkbox is toggled", async () => {
    const onSelectAllChange = vi.fn()
    const user = userEvent.setup()
    render(
      <BulkActionBar
        selectedCount={2}
        totalCount={5}
        actions={baseActions}
        onSelectAllChange={onSelectAllChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    expect(onSelectAllChange).toHaveBeenCalledTimes(1)
    expect(onSelectAllChange).toHaveBeenCalledWith(true)
  })

  it("does not throw when toggled without an onSelectAllChange handler", async () => {
    const user = userEvent.setup()
    render(
      <BulkActionBar selectedCount={2} totalCount={5} actions={baseActions} />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    expect(
      screen.getByRole("checkbox", { name: "Select all" }),
    ).toBeInTheDocument()
  })
})

// ─── Custom label ─────────────────────────────────────────────────────────────

describe("BulkActionBar – custom label", () => {
  it("renders a custom label() when provided", () => {
    render(
      <BulkActionBar
        selectedCount={4}
        actions={baseActions}
        label={(count) => <span>{count} items chosen</span>}
      />,
    )
    expect(screen.getByText("4 items chosen")).toBeInTheDocument()
  })

  it("falls back to the default label when label is omitted", () => {
    const { container } = render(
      <BulkActionBar selectedCount={7} actions={baseActions} />,
    )
    expect(
      container.querySelector("[data-slot='bulk-action-bar-label']"),
    ).toHaveTextContent("7 selected")
  })
})

// ─── Sticky / position ────────────────────────────────────────────────────────

describe("BulkActionBar – sticky and position", () => {
  it("is static (not sticky) by default", () => {
    const { container } = render(
      <BulkActionBar selectedCount={2} actions={baseActions} />,
    )
    const root = container.querySelector("[data-slot='bulk-action-bar']")
    expect(root).not.toHaveClass("sticky")
  })

  it("is sticky and pinned to the top when sticky and position='top'", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={2}
        actions={baseActions}
        sticky
        position="top"
      />,
    )
    const root = container.querySelector("[data-slot='bulk-action-bar']")
    expect(root).toHaveClass("sticky")
    expect(root).toHaveClass("top-0")
  })

  it("is sticky and pinned to the bottom when sticky and position='bottom'", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={2}
        actions={baseActions}
        sticky
        position="bottom"
      />,
    )
    const root = container.querySelector("[data-slot='bulk-action-bar']")
    expect(root).toHaveClass("sticky")
    expect(root).toHaveClass("bottom-0")
  })

  it("does not pin when position is set but sticky is false", () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={2}
        actions={baseActions}
        position="bottom"
      />,
    )
    const root = container.querySelector("[data-slot='bulk-action-bar']")
    expect(root).not.toHaveClass("sticky")
    expect(root).not.toHaveClass("bottom-0")
  })
})

// ─── Accessibility ────────────────────────────────────────────────────────────

describe("BulkActionBar – accessibility", () => {
  it("has no axe violations in the full configuration", async () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={3}
        totalCount={8}
        actions={baseActions}
        onClearSelection={() => {}}
        onSelectAllChange={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations without the select-all checkbox", async () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={3}
        actions={baseActions}
        onClearSelection={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
