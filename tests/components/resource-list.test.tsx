import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { Tag, Trash2 } from "lucide-react"

import { ResourceList, ResourceItem } from "@/components/resource-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/empty-state"
import { DemoViewportProvider } from "@/lib/demo-viewport"

function Media({ initials }: { initials: string }) {
  return (
    <Avatar>
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}

// ─── Default render ─────────────────────────────────────────────────────────

describe("ResourceList – default render", () => {
  it("renders the list shell and a header item count", () => {
    const { container } = render(
      <ResourceList>
        <ResourceItem id="a" title="Ariana Cole" />
        <ResourceItem id="b" title="Devin Park" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-list']"),
    ).toBeInTheDocument()
    expect(screen.getByText("2 items")).toBeInTheDocument()
  })

  it("pluralizes the count to the singular for one item", () => {
    render(
      <ResourceList>
        <ResourceItem id="a" title="Solo" />
      </ResourceList>,
    )
    expect(screen.getByText("1 item")).toBeInTheDocument()
  })

  it("honors an explicit totalCount over the child count", () => {
    render(
      <ResourceList totalCount={42}>
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(screen.getByText("42 items")).toBeInTheDocument()
  })

  it("renders an item title, subtitle and badges", () => {
    render(
      <ResourceList>
        <ResourceItem
          id="a"
          media={<Media initials="AC" />}
          title="Ariana Cole"
          subtitle="ariana@northwind.test"
          badges={[
            { label: "VIP", variant: "success" },
            { label: "New" },
          ]}
        />
      </ResourceList>,
    )
    expect(screen.getByText("Ariana Cole")).toBeInTheDocument()
    expect(screen.getByText("ariana@northwind.test")).toBeInTheDocument()
    expect(screen.getByText("VIP")).toBeInTheDocument()
    expect(screen.getByText("New")).toBeInTheDocument()
  })

  it("merges a custom className onto the root", () => {
    const { container } = render(
      <ResourceList className="custom-class">
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-list']"),
    ).toHaveClass("custom-class")
  })

  it("applies density and frame as structural row/layout changes", () => {
    const { container } = render(
      <ResourceList density="compact" frame="inset">
        <ResourceItem
          id="a"
          media={<Media initials="AC" />}
          title="Ariana"
          subtitle="ariana@example.com"
          badges={[{ label: "VIP" }]}
          actions={<Button aria-label="Open">Open</Button>}
        />
      </ResourceList>,
    )
    const root = container.querySelector("[data-slot='resource-list']")
    const header = container.querySelector("[data-slot='resource-list-header']")
    const items = container.querySelector("[data-slot='resource-list-items']")
    const row = container.querySelector("[data-slot='resource-item']")
    const media = container.querySelector("[data-slot='resource-item-media']")
    const titleLine = container.querySelector(
      "[data-slot='resource-item-title-line']",
    )
    const subtitle = container.querySelector(
      "[data-slot='resource-item-subtitle']",
    )
    const actions = container.querySelector("[data-slot='resource-item-actions']")

    expect(root).toHaveAttribute("data-density", "compact")
    expect(root).toHaveAttribute("data-frame", "inset")
    expect(root).toHaveClass("edge")
    expect(root).toHaveClass("ring-1", "ring-border/70", "p-1.5")
    expect(header).toHaveClass("px-2", "py-1.5")
    expect(items).toHaveClass("gap-0.5", "rounded-lg", "bg-card")
    expect(row).toHaveClass("min-h-9", "px-2", "py-1.5")
    expect(media).toHaveClass("size-7")
    expect(titleLine).toHaveClass("gap-1.5")
    expect(subtitle).toHaveClass("mt-0")
    expect(actions).toHaveClass("scale-95")
  })

  it("uses comfortable density for larger row rhythm and media scale", () => {
    const { container } = render(
      <ResourceList density="comfortable">
        <ResourceItem
          id="a"
          media={<Media initials="AC" />}
          title="Ariana"
          subtitle="ariana@example.com"
        />
      </ResourceList>,
    )
    expect(container.querySelector("[data-slot='resource-item']")).toHaveClass(
      "min-h-14",
      "px-3.5",
      "py-3",
    )
    expect(
      container.querySelector("[data-slot='resource-item-media']"),
    ).toHaveClass("size-10")
    expect(
      container.querySelector("[data-slot='resource-item-subtitle']"),
    ).toHaveClass("mt-1")
  })

  it("inherits demo toolbar density and frame when props are omitted", () => {
    const { container } = render(
      <DemoViewportProvider
        surface="app"
        viewport="desktop"
        density="compact"
        frame="inset"
        depth="soft"
      >
        <ResourceList>
          <ResourceItem
            id="a"
            media={<Media initials="AC" />}
            title="Ariana"
            subtitle="ariana@example.com"
          />
        </ResourceList>
      </DemoViewportProvider>,
    )

    expect(container.querySelector("[data-slot='resource-list']")).toHaveAttribute(
      "data-density",
      "compact",
    )
    expect(container.querySelector("[data-slot='resource-list']")).toHaveAttribute(
      "data-frame",
      "inset",
    )
    expect(container.querySelector("[data-slot='resource-item']")).toHaveClass(
      "min-h-9",
      "px-2",
      "py-1.5",
      "rounded-md",
    )
    expect(
      container.querySelector("[data-slot='resource-item-media']"),
    ).toHaveClass("size-7")
    expect(
      container.querySelector("[data-slot='resource-list-items']"),
    ).toHaveClass("gap-0.5", "bg-card")
    expect(container.querySelector("[data-slot='resource-list']")).toHaveClass(
      "edge",
      "depth-soft",
    )
  })

  it("lets explicit density, frame, and depth props override demo toolbar context", () => {
    const { container } = render(
      <DemoViewportProvider
        surface="app"
        viewport="desktop"
        density="compact"
        frame="inset"
        depth="raised"
      >
        <ResourceList density="comfortable" frame="default" depth="none">
          <ResourceItem
            id="a"
            media={<Media initials="AC" />}
            title="Ariana"
            subtitle="ariana@example.com"
          />
        </ResourceList>
      </DemoViewportProvider>,
    )

    expect(container.querySelector("[data-slot='resource-list']")).toHaveAttribute(
      "data-density",
      "comfortable",
    )
    expect(container.querySelector("[data-slot='resource-list']")).toHaveAttribute(
      "data-frame",
      "default",
    )
    expect(container.querySelector("[data-slot='resource-item']")).toHaveClass(
      "min-h-14",
      "px-3.5",
      "py-3",
    )
    expect(
      container.querySelector("[data-slot='resource-list-items']"),
    ).not.toHaveClass("bg-card")
    expect(container.querySelector("[data-slot='resource-list']")).toHaveClass(
      "shadow-none",
    )
  })
})

// ─── Media branch ───────────────────────────────────────────────────────────

describe("ResourceList – media branch", () => {
  it("renders a media slot when media is provided", () => {
    const { container } = render(
      <ResourceList>
        <ResourceItem id="a" media={<Media initials="AC" />} title="Ariana" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-item-media']"),
    ).toBeInTheDocument()
  })

  it("omits the media slot and the subtitle/badges slots when absent", () => {
    const { container } = render(
      <ResourceList>
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-item-media']"),
    ).toBeNull()
    expect(
      container.querySelector("[data-slot='resource-item-subtitle']"),
    ).toBeNull()
    expect(
      container.querySelector("[data-slot='resource-item-badges']"),
    ).toBeNull()
  })

  it("omits the badges slot when an empty badges array is passed", () => {
    const { container } = render(
      <ResourceList>
        <ResourceItem id="a" title="Ariana" badges={[]} />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-item-badges']"),
    ).toBeNull()
  })
})

// ─── Row interaction ────────────────────────────────────────────────────────

describe("ResourceList – row interaction", () => {
  it("fires onClick when the row is clicked", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ResourceList>
        <ResourceItem id="a" title="Ariana" onClick={onClick} />
      </ResourceList>,
    )
    await user.click(screen.getByRole("button", { name: /ariana/i }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("activates the row on Enter and Space, and ignores other keys", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <ResourceList>
        <ResourceItem id="a" title="Ariana" onClick={onClick} />
      </ResourceList>,
    )
    const row = screen.getByRole("button", { name: /ariana/i })
    row.focus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")
    expect(onClick).toHaveBeenCalledTimes(2)
    await user.keyboard("a")
    expect(onClick).toHaveBeenCalledTimes(2)
  })

  it("renders an anchor for an href row and fires onClick on click", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { container } = render(
      <ResourceList>
        <ResourceItem
          id="a"
          title="Ariana"
          href="#ariana"
          onClick={onClick}
        />
      </ResourceList>,
    )
    const anchor = container.querySelector("a[data-slot='resource-item-link']")
    expect(anchor).toHaveAttribute("href", "#ariana")
    // The anchor has no synthetic key handler — keyboard activation is native.
    await user.click(anchor as HTMLElement)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("is non-interactive (no role/tabindex) without href or onClick", () => {
    const { container } = render(
      <ResourceList>
        <ResourceItem id="a" title="Static" />
      </ResourceList>,
    )
    const row = container.querySelector("[data-slot='resource-item']")
    expect(row).not.toHaveAttribute("role", "button")
    expect(row).not.toHaveAttribute("tabindex")
  })
})

// ─── Actions ────────────────────────────────────────────────────────────────

describe("ResourceList – shortcut actions", () => {
  it("renders actions and fires them without triggering the row click", async () => {
    const user = userEvent.setup()
    const onRow = vi.fn()
    const onDelete = vi.fn()
    const { container } = render(
      <ResourceList>
        <ResourceItem
          id="a"
          title="Ariana"
          onClick={onRow}
          actions={
            <Button aria-label="Delete" onClick={onDelete}>
              <Trash2 />
            </Button>
          }
        />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-item-actions']"),
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Delete" }))
    expect(onDelete).toHaveBeenCalledTimes(1)
    expect(onRow).not.toHaveBeenCalled()
  })
})

// ─── Selection ──────────────────────────────────────────────────────────────

describe("ResourceList – selection", () => {
  it("renders a select-all checkbox only when selectable", () => {
    const { rerender, container } = render(
      <ResourceList>
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-list-select-all']"),
    ).toBeNull()
    rerender(
      <ResourceList selectable>
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-list-select-all']"),
    ).toBeInTheDocument()
  })

  it("selects all items via the header checkbox", async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <ResourceList
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      >
        <ResourceItem id="a" title="Ariana" />
        <ResourceItem id="b" title="Devin" />
      </ResourceList>,
    )
    await user.click(screen.getByLabelText("Select all"))
    expect(onSelectionChange).toHaveBeenCalledWith(["a", "b"])
  })

  it("clears selection when select-all is unchecked", async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <ResourceList
        selectable
        selectedIds={["a", "b"]}
        onSelectionChange={onSelectionChange}
      >
        <ResourceItem id="a" title="Ariana" />
        <ResourceItem id="b" title="Devin" />
      </ResourceList>,
    )
    // Both selected → header is checked → clicking clears.
    await user.click(screen.getByLabelText("Select all"))
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })

  it("shows an indeterminate header when only some are selected", () => {
    const { container } = render(
      <ResourceList selectable selectedIds={["a"]} onSelectionChange={vi.fn()}>
        <ResourceItem id="a" title="Ariana" />
        <ResourceItem id="b" title="Devin" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-list-select-all']"),
    ).toBeInTheDocument()
  })

  it("toggles a single item, adding then removing its id", async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    const { rerender } = render(
      <ResourceList
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      >
        <ResourceItem id="a" title="Ariana" />
        <ResourceItem id="b" title="Devin" />
      </ResourceList>,
    )
    await user.click(screen.getByLabelText("Select Ariana"))
    expect(onSelectionChange).toHaveBeenLastCalledWith(["a"])

    rerender(
      <ResourceList
        selectable
        selectedIds={["a"]}
        onSelectionChange={onSelectionChange}
      >
        <ResourceItem id="a" title="Ariana" />
        <ResourceItem id="b" title="Devin" />
      </ResourceList>,
    )
    await user.click(screen.getByLabelText("Select Ariana"))
    expect(onSelectionChange).toHaveBeenLastCalledWith([])
  })

  it("does not fire the row onClick when the checkbox is clicked", async () => {
    const user = userEvent.setup()
    const onRow = vi.fn()
    render(
      <ResourceList selectable selectedIds={[]} onSelectionChange={vi.fn()}>
        <ResourceItem id="a" title="Ariana" onClick={onRow} />
      </ResourceList>,
    )
    await user.click(screen.getByLabelText("Select Ariana"))
    expect(onRow).not.toHaveBeenCalled()
  })

  it("renders an unchecked select-all when the list is selectable but empty", () => {
    const { container } = render(
      <ResourceList
        selectable
        selectedIds={[]}
        onSelectionChange={vi.fn()}
        emptyState={<EmptyState title="No customers" />}
      >
        {[]}
      </ResourceList>,
    )
    const checkbox = container.querySelector(
      "[data-slot='resource-list-select-all']",
    )
    expect(checkbox).toHaveAttribute("aria-checked", "false")
  })

  it("reflects a selected row via data-selected", () => {
    const { container } = render(
      <ResourceList selectable selectedIds={["a"]} onSelectionChange={vi.fn()}>
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-item'][data-selected]"),
    ).toBeInTheDocument()
  })
})

// ─── Standalone item props ──────────────────────────────────────────────────

describe("ResourceItem – standalone props override the list", () => {
  it("respects item-level selectable + selected + onSelectedChange", async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    render(
      <ResourceList>
        <ResourceItem
          id="a"
          title="Ariana"
          selectable
          selected
          onSelectedChange={onSelectedChange}
        />
      </ResourceList>,
    )
    const checkbox = screen.getByLabelText("Select Ariana")
    expect(checkbox).toHaveAttribute("aria-checked", "true")
    await user.click(checkbox)
    expect(onSelectedChange).toHaveBeenCalledWith(false)
  })

  it("falls back to the id in the checkbox label for a non-string title", () => {
    render(
      <ResourceList>
        <ResourceItem id="row-42" title={<span>Rich</span>} selectable />
      </ResourceList>,
    )
    expect(screen.getByLabelText("Select row-42")).toBeInTheDocument()
  })

  it("works standalone outside a ResourceList", async () => {
    const user = userEvent.setup()
    const onSelectedChange = vi.fn()
    const { rerender } = render(<ResourceItem id="x" title="Solo" />)
    // No surrounding list context: selectable defaults to false and selection
    // resolves to false without a list to read from.
    expect(screen.getByText("Solo")).toBeInTheDocument()

    rerender(
      <ResourceItem
        id="x"
        title="Solo"
        selectable
        onSelectedChange={onSelectedChange}
      />,
    )
    // setSelected runs with a null list, so list?.toggle short-circuits.
    await user.click(screen.getByLabelText("Select Solo"))
    expect(onSelectedChange).toHaveBeenCalledWith(true)
  })
})

// ─── Bulk actions ───────────────────────────────────────────────────────────

describe("ResourceList – bulk actions", () => {
  const bulkActions = [
    { id: "tag", label: "Add tags", icon: Tag, promoted: true },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      tone: "destructive" as const,
    },
  ]

  it("renders the bulk bar (and hides the header) once items are selected", () => {
    const { container } = render(
      <ResourceList
        selectable
        selectedIds={["a"]}
        onSelectionChange={vi.fn()}
        bulkActions={bulkActions}
      >
        <ResourceItem id="a" title="Ariana" />
        <ResourceItem id="b" title="Devin" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='bulk-action-bar']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='resource-list-header']"),
    ).toBeNull()
    expect(screen.getByText("Add tags")).toBeInTheDocument()
  })

  it("keeps the header (no bulk bar) when nothing is selected", () => {
    const { container } = render(
      <ResourceList
        selectable
        selectedIds={[]}
        onSelectionChange={vi.fn()}
        bulkActions={bulkActions}
      >
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='bulk-action-bar']"),
    ).toBeNull()
    expect(
      container.querySelector("[data-slot='resource-list-header']"),
    ).toBeInTheDocument()
  })

  it("clears selection from the bulk bar", async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <ResourceList
        selectable
        selectedIds={["a"]}
        onSelectionChange={onSelectionChange}
        bulkActions={bulkActions}
      >
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    await user.click(screen.getByLabelText("Clear selection"))
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })

  it("selects all from the bulk bar select-all checkbox", async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <ResourceList
        selectable
        selectedIds={["a"]}
        onSelectionChange={onSelectionChange}
        bulkActions={bulkActions}
      >
        <ResourceItem id="a" title="Ariana" />
        <ResourceItem id="b" title="Devin" />
      </ResourceList>,
    )
    await user.click(screen.getByLabelText("Select all"))
    expect(onSelectionChange).toHaveBeenCalledWith(["a", "b"])
  })
})

// ─── Header slot ────────────────────────────────────────────────────────────

describe("ResourceList – header slot", () => {
  it("renders a custom header (e.g. a sort control)", () => {
    render(
      <ResourceList header={<button type="button">Sort</button>}>
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument()
  })

  it("ignores non-element children when computing select-all ids", async () => {
    const user = userEvent.setup()
    const onSelectionChange = vi.fn()
    render(
      <ResourceList
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      >
        {"a stray text node"}
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    await user.click(screen.getByLabelText("Select all"))
    expect(onSelectionChange).toHaveBeenCalledWith(["a"])
  })
})

// ─── Loading ────────────────────────────────────────────────────────────────

describe("ResourceList – loading", () => {
  it("renders skeleton rows and no items while loading", () => {
    const { container } = render(
      <ResourceList loading>
        <ResourceItem id="a" title="Ariana" />
      </ResourceList>,
    )
    expect(
      container.querySelectorAll("[data-slot='resource-item-skeleton']").length,
    ).toBeGreaterThan(0)
    expect(screen.queryByText("Ariana")).not.toBeInTheDocument()
  })
})

// ─── Empty ──────────────────────────────────────────────────────────────────

describe("ResourceList – empty", () => {
  it("renders the empty state when there are no children", () => {
    const { container } = render(
      <ResourceList
        emptyState={
          <EmptyState title="No customers" description="Add one to begin." />
        }
      >
        {[]}
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-list-empty']"),
    ).toBeInTheDocument()
    expect(screen.getByText("No customers")).toBeInTheDocument()
  })

  it("does not show the empty state while loading", () => {
    const { container } = render(
      <ResourceList loading emptyState={<EmptyState title="No customers" />}>
        {[]}
      </ResourceList>,
    )
    expect(
      container.querySelector("[data-slot='resource-list-empty']"),
    ).toBeNull()
    expect(screen.queryByText("No customers")).not.toBeInTheDocument()
  })
})

// ─── Accessibility ──────────────────────────────────────────────────────────

describe("ResourceList – accessibility", () => {
  it("has no axe violations for a rich, interactive list", async () => {
    const { container } = render(
      <ResourceList>
        <ResourceItem
          id="a"
          media={<Media initials="AC" />}
          title="Ariana Cole"
          subtitle="ariana@northwind.test"
          badges={[{ label: "VIP", variant: "success" }]}
          onClick={() => {}}
          actions={
            <Button aria-label="Delete">
              <Trash2 />
            </Button>
          }
        />
      </ResourceList>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations when selectable with bulk actions", async () => {
    const { container } = render(
      <ResourceList
        selectable
        selectedIds={["a"]}
        onSelectionChange={vi.fn()}
        bulkActions={[{ id: "tag", label: "Add tags", icon: Tag }]}
      >
        <ResourceItem id="a" title="Ariana" />
        <ResourceItem id="b" title="Devin" />
      </ResourceList>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations for the empty state", async () => {
    const { container } = render(
      <ResourceList emptyState={<EmptyState title="No customers" />}>
        {[]}
      </ResourceList>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
