import * as React from "react"
import { useState } from "react"
import { render, screen, within, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  IndexFilters,
  type IndexFiltersView,
  type SortOption,
  type AppliedFilter,
} from "@/components/index-filters"

const VIEWS: IndexFiltersView[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
  { id: "archived", label: "Archived" },
]

const SORT_OPTIONS: SortOption[] = [
  { id: "title-asc", label: "Title A–Z" },
  { id: "title-desc", label: "Title Z–A" },
  { id: "created", label: "Created" },
]

// ─── Renders without crashing ──────────────────────────────────────────────
describe("IndexFilters – smoke", () => {
  it("renders the root with data-slot", () => {
    const { container } = render(<IndexFilters />)
    expect(
      container.querySelector("[data-slot='index-filters']"),
    ).toBeInTheDocument()
  })

  it("renders a full bar (views + search + sort + applied + add) without crashing", () => {
    expect(() =>
      render(
        <IndexFilters
          views={VIEWS}
          view="all"
          onViewChange={vi.fn()}
          query=""
          onQueryChange={vi.fn()}
          sortOptions={SORT_OPTIONS}
          sort="title-asc"
          onSortChange={vi.fn()}
          appliedFilters={[{ key: "a", label: "Status: Active" }]}
          onAddFilter={vi.fn()}
        />,
      ),
    ).not.toThrow()
  })

  it("merges a custom className onto the root and keeps base classes", () => {
    const { container } = render(<IndexFilters className="custom-x" />)
    const root = container.querySelector("[data-slot='index-filters']")
    expect(root).toHaveClass("custom-x")
    expect(root).toHaveClass("flex")
  })
})

// ─── Saved-view tabs ───────────────────────────────────────────────────────
describe("IndexFilters – view tabs", () => {
  it("renders a tab per view", () => {
    render(<IndexFilters views={VIEWS} view="all" onViewChange={vi.fn()} />)
    for (const v of VIEWS) {
      expect(screen.getByRole("tab", { name: v.label })).toBeInTheDocument()
    }
  })

  it("marks the active view as selected", () => {
    render(<IndexFilters views={VIEWS} view="draft" onViewChange={vi.fn()} />)
    expect(screen.getByRole("tab", { name: "Draft" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
  })

  it("falls back to the first view when `view` is omitted", () => {
    render(<IndexFilters views={VIEWS} onViewChange={vi.fn()} />)
    expect(screen.getByRole("tab", { name: "All" })).toHaveAttribute(
      "aria-selected",
      "true",
    )
  })

  it("switching a view fires onViewChange with the view id", async () => {
    const user = userEvent.setup()
    const onViewChange = vi.fn()
    render(<IndexFilters views={VIEWS} view="all" onViewChange={onViewChange} />)
    await user.click(screen.getByRole("tab", { name: "Active" }))
    expect(onViewChange).toHaveBeenCalledWith("active")
  })

  it("does not throw when onViewChange is omitted", async () => {
    const user = userEvent.setup()
    render(<IndexFilters views={VIEWS} view="all" />)
    await user.click(screen.getByRole("tab", { name: "Active" }))
    expect(screen.getByRole("tab", { name: "Active" })).toBeInTheDocument()
  })

  it("renders no tabs container when views is omitted", () => {
    const { container } = render(<IndexFilters query="" onQueryChange={vi.fn()} />)
    expect(
      container.querySelector("[data-slot='index-filters-tabs']"),
    ).toBeNull()
  })

  it("renders no tabs container when views is empty", () => {
    const { container } = render(
      <IndexFilters views={[]} query="" onQueryChange={vi.fn()} />,
    )
    expect(
      container.querySelector("[data-slot='index-filters-tabs']"),
    ).toBeNull()
  })
})

// ─── Search ────────────────────────────────────────────────────────────────
describe("IndexFilters – search", () => {
  it("renders the search input when onQueryChange is provided", () => {
    render(<IndexFilters query="" onQueryChange={vi.fn()} />)
    expect(
      screen.getByRole("searchbox", { name: "Search and filter" }),
    ).toBeInTheDocument()
  })

  it("uses a custom searchPlaceholder as the accessible label", () => {
    render(
      <IndexFilters
        query=""
        onQueryChange={vi.fn()}
        searchPlaceholder="Search products"
      />,
    )
    expect(
      screen.getByRole("searchbox", { name: "Search products" }),
    ).toBeInTheDocument()
  })

  it("typing fires onQueryChange with the new value", async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    render(<IndexFilters query="" onQueryChange={onQueryChange} />)
    await user.type(screen.getByRole("searchbox"), "a")
    expect(onQueryChange).toHaveBeenCalledWith("a")
  })

  it("renders no search when onQueryChange is omitted", () => {
    render(<IndexFilters views={VIEWS} view="all" onViewChange={vi.fn()} />)
    expect(screen.queryByRole("searchbox")).toBeNull()
  })

  it("shows a clear button only when the query is non-empty", () => {
    const { rerender } = render(
      <IndexFilters query="" onQueryChange={vi.fn()} />,
    )
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull()
    rerender(<IndexFilters query="abc" onQueryChange={vi.fn()} />)
    expect(
      screen.getByRole("button", { name: "Clear search" }),
    ).toBeInTheDocument()
  })

  it("clicking clear fires onQueryChange with an empty string", async () => {
    const user = userEvent.setup()
    const onQueryChange = vi.fn()
    render(<IndexFilters query="hello" onQueryChange={onQueryChange} />)
    await user.click(screen.getByRole("button", { name: "Clear search" }))
    expect(onQueryChange).toHaveBeenCalledWith("")
  })

  it("clears the query end-to-end in a controlled wrapper", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [q, setQ] = useState("seed")
      return <IndexFilters query={q} onQueryChange={setQ} />
    }
    render(<Controlled />)
    const box = screen.getByRole("searchbox")
    expect(box).toHaveValue("seed")
    await user.click(screen.getByRole("button", { name: "Clear search" }))
    expect(box).toHaveValue("")
    expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull()
  })

  it("renders an empty value when query is undefined", () => {
    render(<IndexFilters onQueryChange={vi.fn()} />)
    expect(screen.getByRole("searchbox")).toHaveValue("")
  })
})

// ─── Sort ──────────────────────────────────────────────────────────────────
describe("IndexFilters – sort", () => {
  it("renders no sort trigger when sortOptions is omitted", () => {
    const { container } = render(
      <IndexFilters query="" onQueryChange={vi.fn()} />,
    )
    expect(
      container.querySelector("[data-slot='index-filters-sort']"),
    ).toBeNull()
  })

  it("renders no sort trigger when sortOptions is empty", () => {
    const { container } = render(
      <IndexFilters sortOptions={[]} query="" onQueryChange={vi.fn()} />,
    )
    expect(
      container.querySelector("[data-slot='index-filters-sort']"),
    ).toBeNull()
  })

  it("shows the active sort label on the trigger", () => {
    render(<IndexFilters sortOptions={SORT_OPTIONS} sort="created" />)
    expect(screen.getByRole("button", { name: /Created/ })).toBeInTheDocument()
  })

  it("falls back to 'Sort' when no sort id matches", () => {
    render(<IndexFilters sortOptions={SORT_OPTIONS} />)
    expect(screen.getByRole("button", { name: /Sort/ })).toBeInTheDocument()
  })

  it("opening the dropdown reveals every sort option", async () => {
    const user = userEvent.setup()
    render(<IndexFilters sortOptions={SORT_OPTIONS} sort="title-asc" />)
    await user.click(screen.getByRole("button", { name: /Title A–Z/ }))
    const menu = await screen.findByRole("menu")
    for (const option of SORT_OPTIONS) {
      expect(
        within(menu).getByRole("menuitem", { name: option.label }),
      ).toBeInTheDocument()
    }
  })

  it("selecting a sort option fires onSortChange with its id", async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(
      <IndexFilters
        sortOptions={SORT_OPTIONS}
        sort="title-asc"
        onSortChange={onSortChange}
      />,
    )
    await user.click(screen.getByRole("button", { name: /Title A–Z/ }))
    const menu = await screen.findByRole("menu")
    await user.click(within(menu).getByRole("menuitem", { name: "Created" }))
    expect(onSortChange).toHaveBeenCalledWith("created")
  })

  it("does not throw when onSortChange is omitted", async () => {
    const user = userEvent.setup()
    render(<IndexFilters sortOptions={SORT_OPTIONS} sort="title-asc" />)
    await user.click(screen.getByRole("button", { name: /Title A–Z/ }))
    const menu = await screen.findByRole("menu")
    await user.click(within(menu).getByRole("menuitem", { name: "Created" }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})

// ─── Applied filters ───────────────────────────────────────────────────────
describe("IndexFilters – applied filters", () => {
  it("renders no applied container when appliedFilters is omitted", () => {
    const { container } = render(
      <IndexFilters query="" onQueryChange={vi.fn()} />,
    )
    expect(
      container.querySelector("[data-slot='index-filters-applied']"),
    ).toBeNull()
  })

  it("renders no applied container when appliedFilters is empty", () => {
    const { container } = render(
      <IndexFilters appliedFilters={[]} query="" onQueryChange={vi.fn()} />,
    )
    expect(
      container.querySelector("[data-slot='index-filters-applied']"),
    ).toBeNull()
  })

  it("renders a pill per applied filter", () => {
    const filters: AppliedFilter[] = [
      { key: "status", label: "Status: Active" },
      { key: "vendor", label: "Vendor: Acme" },
    ]
    const { container } = render(<IndexFilters appliedFilters={filters} />)
    expect(
      container.querySelectorAll("[data-slot='index-filters-applied-filter']"),
    ).toHaveLength(2)
    expect(screen.getByText("Status: Active")).toBeInTheDocument()
    expect(screen.getByText("Vendor: Acme")).toBeInTheDocument()
  })

  it("removing a filter fires its onRemove", async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(
      <IndexFilters
        appliedFilters={[{ key: "status", label: "Status: Active", onRemove }]}
      />,
    )
    await user.click(
      screen.getByRole("button", { name: "Remove Status: Active" }),
    )
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it("does not throw when an applied filter has no onRemove", async () => {
    const user = userEvent.setup()
    render(
      <IndexFilters appliedFilters={[{ key: "k", label: "Tag: VIP" }]} />,
    )
    await user.click(screen.getByRole("button", { name: "Remove Tag: VIP" }))
    expect(screen.getByText("Tag: VIP")).toBeInTheDocument()
  })

  it("removes a pill end-to-end in a controlled wrapper", async () => {
    const user = userEvent.setup()
    function Controlled() {
      const [filters, setFilters] = useState([
        { key: "a", label: "A" },
        { key: "b", label: "B" },
      ])
      return (
        <IndexFilters
          appliedFilters={filters.map((f) => ({
            ...f,
            onRemove: () =>
              setFilters((prev) => prev.filter((x) => x.key !== f.key)),
          }))}
        />
      )
    }
    render(<Controlled />)
    expect(screen.getByText("A")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Remove A" }))
    expect(screen.queryByText("A")).toBeNull()
    expect(screen.getByText("B")).toBeInTheDocument()
  })
})

// ─── Add filter ────────────────────────────────────────────────────────────
describe("IndexFilters – add filter", () => {
  it("renders the add-filter button only when onAddFilter is provided", () => {
    const { rerender, container } = render(
      <IndexFilters query="" onQueryChange={vi.fn()} />,
    )
    expect(
      container.querySelector("[data-slot='index-filters-add']"),
    ).toBeNull()
    rerender(
      <IndexFilters query="" onQueryChange={vi.fn()} onAddFilter={vi.fn()} />,
    )
    expect(
      screen.getByRole("button", { name: /Add filter/ }),
    ).toBeInTheDocument()
  })

  it("clicking add-filter fires onAddFilter", async () => {
    const user = userEvent.setup()
    const onAddFilter = vi.fn()
    render(<IndexFilters onAddFilter={onAddFilter} />)
    await user.click(screen.getByRole("button", { name: /Add filter/ }))
    expect(onAddFilter).toHaveBeenCalledTimes(1)
  })
})

// ─── Accessibility ─────────────────────────────────────────────────────────
describe("IndexFilters – accessibility", () => {
  it("has no axe violations with a full bar", async () => {
    const { container } = render(
      <IndexFilters
        views={VIEWS}
        view="all"
        onViewChange={vi.fn()}
        query="shirt"
        onQueryChange={vi.fn()}
        searchPlaceholder="Search products"
        sortOptions={SORT_OPTIONS}
        sort="title-asc"
        onSortChange={vi.fn()}
        appliedFilters={[
          { key: "status", label: "Status: Active", onRemove: vi.fn() },
        ]}
        onAddFilter={vi.fn()}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations search-only", async () => {
    const { container } = render(
      <IndexFilters query="" onQueryChange={vi.fn()} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
