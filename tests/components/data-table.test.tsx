import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  DataTable,
  type DataTableColumn,
} from "@/components/data-table"
import { DemoViewportProvider } from "@/lib/demo-viewport"

type Row = {
  id: string
  name: string
  qty: number
}

const rows: Row[] = [
  { id: "1", name: "Alpha", qty: 10 },
  { id: "2", name: "Beta", qty: 20 },
]

const columns: DataTableColumn<Row>[] = [
  { key: "name", header: "Name", sortable: true },
  {
    key: "qty",
    header: "Qty",
    align: "end",
    render: (row) => <span className="font-mono tabular-nums">{row.qty}</span>,
  },
]

describe("DataTable – render", () => {
  it("renders the admin shell root by default", () => {
    const { container } = render(<DataTable columns={columns} rows={rows} />)
    expect(container.querySelector("[data-slot='data-table']")).toBeInTheDocument()
    expect(
      container.querySelectorAll("[data-slot='data-table-row']"),
    ).toHaveLength(2)
  })

  it("uses the index-table slot in embedded mode", () => {
    const { container } = render(
      <DataTable columns={columns} rows={rows} embedded />,
    )
    expect(container.querySelector("[data-slot='index-table']")).toBeInTheDocument()
    expect(
      container.querySelectorAll("[data-slot='index-table-row']"),
    ).toHaveLength(2)
    expect(container.querySelector("[data-slot='data-table']")).toBeNull()
  })

  it("renders index filters when query control is provided", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        query=""
        onQueryChange={() => {}}
      />,
    )
    expect(
      container.querySelector("[data-slot='index-filters']"),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("searchbox", { name: "Search and filter" }),
    ).toBeInTheDocument()
  })

  it("renders a primary column with media and title", () => {
    const primaryColumns: DataTableColumn<Row>[] = [
      {
        key: "name",
        header: "Item",
        primary: {
          title: (row) => row.name,
          media: (row) => <span>{row.id}</span>,
        },
      },
    ]
    render(<DataTable columns={primaryColumns} rows={rows} embedded />)
    expect(screen.getByText("Alpha")).toBeInTheDocument()
    expect(screen.getByText("1")).toBeInTheDocument()
  })

  it("supports an inset frame with structural containment for admin surfaces", () => {
    const { container } = render(
      <DataTable columns={columns} rows={rows} frame="inset" />,
    )
    const root = container.querySelector("[data-slot='data-table']")
    const tableWrap = container.querySelector("[data-slot='data-table-table']")
    expect(root).toHaveAttribute("data-frame", "inset")
    expect(root).toHaveClass("edge")
    expect(root).toHaveClass("p-1.5", "ring-1", "ring-border/70")
    expect(root).not.toHaveClass("border")
    expect(tableWrap).toHaveClass("overflow-hidden", "rounded-lg", "bg-card")
  })

  it("inherits toolbar density, frame, and depth context for docs previews", () => {
    const { container } = render(
      <DemoViewportProvider
        viewport="desktop"
        density="compact"
        frame="inset"
        depth="raised"
      >
        <DataTable columns={columns} rows={rows} />
      </DemoViewportProvider>,
    )
    const root = container.querySelector("[data-slot='data-table']")
    const tableContainer = container.querySelector("[data-slot='table-container']")
    expect(root).toHaveAttribute("data-density", "condensed")
    expect(root).toHaveAttribute("data-frame", "inset")
    expect(root).toHaveAttribute("data-depth", "raised")
    expect(root).toHaveClass("edge")
    expect(root).toHaveClass("depth-raised")
    expect(tableContainer).toHaveAttribute("data-density", "condensed")
  })

  it("does not flatten density with hardcoded nested table sizing", () => {
    const { container } = render(
      <DataTable columns={columns} rows={rows} density="spacious" />,
    )
    const table = container.querySelector("table[data-slot='data-table-table']")
    expect(table).not.toHaveClass("[&_[data-slot=table-cell]]:py-1")
    expect(table).not.toHaveClass("[&_[data-slot=table-head]]:h-8")
  })

  it("applies density to primary cell rhythm beyond table color", () => {
    const primaryColumns: DataTableColumn<Row>[] = [
      {
        key: "name",
        header: "Item",
        primary: {
          title: (row) => row.name,
          media: (row) => <span>{row.id}</span>,
          description: (row) => `Quantity ${row.qty}`,
        },
      },
    ]
    const { container, rerender } = render(
      <DataTable columns={primaryColumns} rows={rows} density="condensed" />,
    )
    expect(
      container.querySelector("[data-slot='data-table-primary']"),
    ).toHaveClass("gap-2")
    expect(
      container.querySelector("[data-slot='data-table-primary-media']"),
    ).toHaveClass("size-7")
    expect(
      container.querySelector("[data-slot='data-table-primary-title']"),
    ).toHaveClass("text-xs")

    rerender(
      <DataTable columns={primaryColumns} rows={rows} density="spacious" />,
    )
    expect(
      container.querySelector("[data-slot='data-table-primary']"),
    ).toHaveClass("gap-3")
    expect(
      container.querySelector("[data-slot='data-table-primary-media']"),
    ).toHaveClass("size-10")
    expect(
      container.querySelector("[data-slot='data-table-primary-title']"),
    ).toHaveClass("text-sm")
  })
})

describe("DataTable – bulk bar", () => {
  it("uses the index bulk bar variant in non-embedded mode", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1"]}
        onSelectionChange={() => {}}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    const bar = container.querySelector("[data-slot='bulk-action-bar']")
    expect(bar).toHaveClass("bg-foreground")
  })

  it("uses the default bulk bar variant in embedded mode", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        embedded
        selectable
        selectedIds={["1"]}
        onSelectionChange={() => {}}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    const bar = container.querySelector("[data-slot='bulk-action-bar']")
    expect(bar).toHaveClass("bg-card")
  })

  it("keeps column headers mounted while bulk actions overlay them", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1"]}
        onSelectionChange={() => {}}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    expect(
      container.querySelector("[data-slot='data-table-head-row']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='data-table-bulk-row']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='data-table-sort']"),
    ).toBeInTheDocument()
  })
})

describe("DataTable – interactions", () => {
  it("fires onSortChange when a sortable header is clicked", async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        sort={{ key: "name", direction: "asc" }}
        onSortChange={onSortChange}
        embedded
      />,
    )
    await user.click(screen.getByRole("button", { name: "Sort by name" }))
    expect(onSortChange).toHaveBeenCalledWith({ key: "name", direction: "desc" })
  })

  it("renders filterActions in the toolbar", () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        query=""
        onQueryChange={() => {}}
        filterActions={<button type="button">Columns</button>}
      />,
    )
    expect(screen.getByRole("button", { name: "Columns" })).toBeInTheDocument()
  })
})

describe("DataTable – selection", () => {
  it("selects all rows when the header checkbox is toggled on", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2"])
  })

  it("clears all rows when the header checkbox is toggled off", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1", "2"]}
        onSelectionChange={onSelectionChange}
      />,
    )
    // With all rows selected the header is checked; clicking toggles it off.
    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })

  it("adds a single row to the selection via its row checkbox", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }))
    expect(onSelectionChange).toHaveBeenCalledWith(["1"])
  })

  it("removes a single row from the selection via its row checkbox", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1", "2"]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }))
    expect(onSelectionChange).toHaveBeenCalledWith(["2"])
  })

  it("clears the selection from the bulk action bar", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1"]}
        onSelectionChange={onSelectionChange}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    await user.click(
      screen.getByRole("button", { name: /clear selection|deselect/i }),
    )
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })

  it("selects all from the bulk bar select-all control", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1"]}
        onSelectionChange={onSelectionChange}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    const bulk = container.querySelector("[data-slot='data-table-bulk']")
    const selectAll = bulk?.querySelector(
      "input[type='checkbox'], [role='checkbox']",
    ) as HTMLElement
    await user.click(selectAll)
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2"])
  })
})

describe("DataTable – row clicks & keyboard", () => {
  it("fires onRowClick when a row is clicked", async () => {
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <DataTable columns={columns} rows={rows} onRowClick={onRowClick} />,
    )
    const row = container.querySelector("[data-slot='data-table-row']") as HTMLElement
    await user.click(row)
    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })

  it("fires onRowClick on Enter and Space keydown", async () => {
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <DataTable columns={columns} rows={rows} onRowClick={onRowClick} />,
    )
    const row = container.querySelector("[data-slot='data-table-row']") as HTMLElement
    row.focus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")
    expect(onRowClick).toHaveBeenCalledTimes(2)
  })

  it("ignores other keys on a clickable row", async () => {
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <DataTable columns={columns} rows={rows} onRowClick={onRowClick} />,
    )
    const row = container.querySelector("[data-slot='data-table-row']") as HTMLElement
    row.focus()
    await user.keyboard("{Escape}")
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("does not fire onRowClick when a row's select checkbox is clicked", async () => {
    const onRowClick = vi.fn()
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        onRowClick={onRowClick}
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }))
    expect(onSelectionChange).toHaveBeenCalledWith(["1"])
    expect(onRowClick).not.toHaveBeenCalled()
  })
})

describe("DataTable – sorting", () => {
  it("sorts ascending when an unsorted header is clicked", async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable columns={columns} rows={rows} onSortChange={onSortChange} />,
    )
    await user.click(screen.getByRole("button", { name: "Sort by name" }))
    expect(onSortChange).toHaveBeenCalledWith({ key: "name", direction: "asc" })
  })

  it("shows the ascending indicator for the active column", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        sort={{ key: "name", direction: "asc" }}
        onSortChange={() => {}}
      />,
    )
    expect(
      container.querySelector("[data-slot='data-table-sort-asc']"),
    ).toBeInTheDocument()
  })

  it("shows the descending indicator for the active column", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        sort={{ key: "name", direction: "desc" }}
        onSortChange={() => {}}
      />,
    )
    expect(
      container.querySelector("[data-slot='data-table-sort-desc']"),
    ).toBeInTheDocument()
  })
})

describe("DataTable – density toggle", () => {
  it("toggles internal density when no density prop is provided", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <DataTable columns={columns} rows={rows} showDensityToggle />,
    )
    const root = container.querySelector("[data-slot='data-table']")
    expect(root).toHaveAttribute("data-density", "condensed")
    await user.click(
      screen.getByRole("button", { name: /comfortable row density/i }),
    )
    expect(root).toHaveAttribute("data-density", "comfortable")
  })

  it("notifies onDensityChange and keeps density controlled", async () => {
    const onDensityChange = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        showDensityToggle
        density="condensed"
        onDensityChange={onDensityChange}
      />,
    )
    await user.click(
      screen.getByRole("button", { name: /comfortable row density/i }),
    )
    expect(onDensityChange).toHaveBeenCalledWith("comfortable")
    // Controlled: density stays as the prop until the parent updates it.
    expect(
      container.querySelector("[data-slot='data-table']"),
    ).toHaveAttribute("data-density", "condensed")
  })
})

describe("DataTable – demo density mapping", () => {
  it("maps the comfortable demo density to spacious", () => {
    const { container } = render(
      <DemoViewportProvider viewport="desktop" density="comfortable">
        <DataTable columns={columns} rows={rows} />
      </DemoViewportProvider>,
    )
    expect(
      container.querySelector("[data-slot='data-table']"),
    ).toHaveAttribute("data-density", "spacious")
  })

  it("maps the default demo density to comfortable", () => {
    const { container } = render(
      <DemoViewportProvider viewport="desktop" density="default">
        <DataTable columns={columns} rows={rows} />
      </DemoViewportProvider>,
    )
    expect(
      container.querySelector("[data-slot='data-table']"),
    ).toHaveAttribute("data-density", "comfortable")
  })
})

describe("DataTable – loading & empty states", () => {
  it("renders skeleton rows while loading", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        loading
        loadingRowCount={3}
        selectable
      />,
    )
    expect(
      container.querySelectorAll("[data-slot='data-table-skeleton-row']"),
    ).toHaveLength(3)
    expect(
      container.querySelector("[data-slot='data-table-row']"),
    ).toBeNull()
  })

  it("renders the default empty state when there are no rows", () => {
    render(<DataTable columns={columns} rows={[]} />)
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument()
  })

  it("renders a custom empty state when provided", () => {
    render(
      <DataTable
        columns={columns}
        rows={[]}
        emptyState={<div>No widgets found</div>}
      />,
    )
    expect(screen.getByText("No widgets found")).toBeInTheDocument()
  })
})

describe("DataTable – cell rendering fallback", () => {
  it("falls back to the row value keyed by column when no render/primary is set", () => {
    const plainColumns: DataTableColumn<Row>[] = [
      { key: "name", header: "Name" },
    ]
    render(<DataTable columns={plainColumns} rows={rows} embedded />)
    expect(screen.getByText("Alpha")).toBeInTheDocument()
    expect(screen.getByText("Beta")).toBeInTheDocument()
  })

  it("uses a custom getRowId for selection", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => `row-${row.name}`}
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(
      screen.getByRole("checkbox", { name: "Select row row-Alpha" }),
    )
    expect(onSelectionChange).toHaveBeenCalledWith(["row-Alpha"])
  })
})

describe("DataTable – offset pagination", () => {
  it("renders the offset range label", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{
          page: 1,
          pageSize: 10,
          total: 42,
          onPageChange: () => {},
        }}
      />,
    )
    expect(
      container.querySelector("[data-slot='data-table-range']"),
    ).toHaveTextContent("1–10 of 42")
  })

  it("renders a zero range when total is 0", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={[]}
        pagination={{
          page: 1,
          pageSize: 10,
          total: 0,
          onPageChange: () => {},
        }}
      />,
    )
    expect(
      container.querySelector("[data-slot='data-table-range']"),
    ).toHaveTextContent("0–0 of 0")
  })

  it("navigates to the previous and next page", async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{
          page: 2,
          pageSize: 10,
          total: 42,
          onPageChange,
        }}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Previous page" }))
    expect(onPageChange).toHaveBeenCalledWith(1)
    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it("disables prev on the first page and next on the last page", () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{ page: 1, pageSize: 10, total: 42, onPageChange: () => {} }}
      />,
    )
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next page" })).not.toBeDisabled()

    rerender(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{ page: 5, pageSize: 10, total: 42, onPageChange: () => {} }}
      />,
    )
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()
  })
})

describe("DataTable – cursor pagination", () => {
  it("renders cursor controls and fires prev/next callbacks", async () => {
    const onPrev = vi.fn()
    const onNext = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{
          hasPrev: true,
          hasNext: true,
          onPrev,
          onNext,
          rangeLabel: "Page 2",
        }}
      />,
    )
    expect(
      container.querySelector("[data-slot='data-table-range']"),
    ).toHaveTextContent("Page 2")
    await user.click(screen.getByRole("button", { name: "Previous page" }))
    expect(onPrev).toHaveBeenCalledTimes(1)
    await user.click(screen.getByRole("button", { name: "Next page" }))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it("defaults cursor pagination to disabled controls", () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        pagination={{ rangeLabel: "Page 1" }}
      />,
    )
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled()
  })
})

describe("DataTable – filter chrome", () => {
  it("fires onAddFilter from the filter toolbar", async () => {
    const onAddFilter = vi.fn()
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        rows={rows}
        onAddFilter={onAddFilter}
      />,
    )
    await user.click(screen.getByRole("button", { name: /add filter|filter/i }))
    expect(onAddFilter).toHaveBeenCalled()
  })

  it("does not render filter chrome in embedded mode", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        embedded
        query=""
        onQueryChange={() => {}}
        showDensityToggle
      />,
    )
    expect(
      container.querySelector("[data-slot='data-table-filters']"),
    ).toBeNull()
  })
})

describe("DataTable – accessibility", () => {
  it("has no axe violations in the admin shell", async () => {
    const { container } = render(
      <DataTable
        columns={columns}
        rows={rows}
        query=""
        onQueryChange={() => {}}
        selectable
        selectedIds={["1"]}
        onSelectionChange={() => {}}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
