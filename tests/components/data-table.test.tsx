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
