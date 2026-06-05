import * as React from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  IndexTable,
  type IndexTableColumn,
  type IndexTableSort,
} from "@/components/index-table"

type Order = {
  id: string
  order: string
  customer: string
  total: string
}

const rows: Order[] = [
  { id: "1", order: "#1001", customer: "Ada", total: "$10.00" },
  { id: "2", order: "#1002", customer: "Alan", total: "$20.00" },
  { id: "3", order: "#1003", customer: "Grace", total: "$30.00" },
]

const columns: IndexTableColumn<Order>[] = [
  { key: "order", header: "Order", sortable: true },
  { key: "customer", header: "Customer" },
  {
    key: "total",
    header: "Total",
    align: "end",
    render: (row) => <span className="font-mono tabular-nums">{row.total}</span>,
  },
]

// ─── Default render ───────────────────────────────────────────────────────────

describe("IndexTable – render", () => {
  it("renders the root and a row per item", () => {
    const { container } = render(<IndexTable columns={columns} rows={rows} />)
    expect(container.querySelector("[data-slot='index-table']")).toBeInTheDocument()
    expect(
      container.querySelectorAll("[data-slot='index-table-row']"),
    ).toHaveLength(3)
  })

  it("renders headers and rendered cell content", () => {
    render(<IndexTable columns={columns} rows={rows} />)
    expect(screen.getByText("Customer")).toBeInTheDocument()
    expect(screen.getByText("$10.00")).toBeInTheDocument()
  })

  it("merges a custom className onto the root", () => {
    const { container } = render(
      <IndexTable columns={columns} rows={rows} className="custom-class" />,
    )
    expect(container.querySelector("[data-slot='index-table']")).toHaveClass(
      "custom-class",
    )
  })

  it("renders a caption when provided", () => {
    render(<IndexTable columns={columns} rows={rows} caption="All orders" />)
    expect(screen.getByText("All orders")).toBeInTheDocument()
  })

  it("falls back to row[key] when a column has no render fn", () => {
    render(<IndexTable columns={columns} rows={rows} />)
    expect(screen.getByText("#1001")).toBeInTheDocument()
    expect(screen.getByText("Ada")).toBeInTheDocument()
  })

  it("renders nothing for a missing key (null fallback) without crashing", () => {
    const cols: IndexTableColumn<Order>[] = [
      { key: "order", header: "Order" },
      { key: "missing", header: "Missing" },
    ]
    const { container } = render(<IndexTable columns={cols} rows={rows} />)
    expect(
      container.querySelectorAll("[data-slot='index-table-row']"),
    ).toHaveLength(3)
  })

  it("applies a column width style when given", () => {
    const cols: IndexTableColumn<Order>[] = [
      { key: "order", header: "Order", width: 120 },
    ]
    const { container } = render(<IndexTable columns={cols} rows={rows} />)
    const head = container.querySelector("[data-slot='index-table-head']")
    expect(head).toHaveStyle({ width: "120px" })
  })
})

// ─── Alignment ────────────────────────────────────────────────────────────────

describe("IndexTable – alignment", () => {
  it("right-aligns end columns and left-aligns the rest", () => {
    const { container } = render(<IndexTable columns={columns} rows={rows} />)
    const cells = container.querySelectorAll("[data-slot='index-table-cell']")
    const totalCell = Array.from(cells).find((c) => c.textContent === "$10.00")
    expect(totalCell).toHaveClass("text-right")
    const orderCell = Array.from(cells).find((c) => c.textContent === "#1001")
    expect(orderCell).toHaveClass("text-left")
  })
})

// ─── Selection ────────────────────────────────────────────────────────────────

describe("IndexTable – selection", () => {
  it("renders no checkboxes when not selectable", () => {
    render(<IndexTable columns={columns} rows={rows} />)
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument()
  })

  it("renders a select-all and a checkbox per row when selectable", () => {
    render(
      <IndexTable columns={columns} rows={rows} selectable onSelectionChange={() => {}} />,
    )
    expect(screen.getByRole("checkbox", { name: "Select all" })).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: "Select row 1" })).toBeInTheDocument()
  })

  it("selects all rows when the header checkbox is checked", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2", "3"])
  })

  it("clears all rows when the header checkbox is unchecked", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1", "2", "3"]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })

  it("is indeterminate when some but not all rows are selected", () => {
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1"]}
        onSelectionChange={() => {}}
      />,
    )
    expect(screen.getByRole("checkbox", { name: "Select all" })).toHaveAttribute(
      "data-indeterminate",
    )
  })

  it("is checked when all rows are selected", () => {
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1", "2", "3"]}
        onSelectionChange={() => {}}
      />,
    )
    const cb = screen.getByRole("checkbox", { name: "Select all" })
    expect(cb).toBeChecked()
    expect(cb).not.toHaveAttribute("data-indeterminate")
  })

  it("adds a row id when a row checkbox is checked", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1"]}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select row 2" }))
    expect(onSelectionChange).toHaveBeenCalledWith(["1", "2"])
  })

  it("removes a row id when a checked row checkbox is unchecked", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
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

  it("does not throw when toggling without an onSelectionChange handler", async () => {
    const user = userEvent.setup()
    render(<IndexTable columns={columns} rows={rows} selectable />)
    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }))
    expect(screen.getByRole("checkbox", { name: "Select all" })).toBeInTheDocument()
  })

  it("marks selected rows with data-state='selected'", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["2"]}
        onSelectionChange={() => {}}
      />,
    )
    const selectedRows = container.querySelectorAll(
      "[data-slot='index-table-row'][data-state='selected']",
    )
    expect(selectedRows).toHaveLength(1)
  })
})

// ─── Bulk action bar ──────────────────────────────────────────────────────────

describe("IndexTable – bulk action bar", () => {
  it("does not render the bulk bar when nothing is selected", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={[]}
        onSelectionChange={() => {}}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    expect(container.querySelector("[data-slot='bulk-action-bar']")).toBeNull()
  })

  it("renders the bulk bar when rows are selected", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1", "2"]}
        onSelectionChange={() => {}}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    const bar = container.querySelector("[data-slot='bulk-action-bar']")
    expect(bar).toBeInTheDocument()
    expect(within(bar as HTMLElement).getByText("Archive")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='bulk-action-bar-label']"),
    ).toHaveTextContent("2 selected")
  })

  it("clears selection when the bulk bar clear button is clicked", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1", "2"]}
        onSelectionChange={onSelectionChange}
        bulkActions={[{ label: "Archive" }]}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Clear selection" }))
    expect(onSelectionChange).toHaveBeenCalledWith([])
  })

  it("renders the bulk bar with no actions when bulkActions is omitted", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1"]}
        onSelectionChange={() => {}}
      />,
    )
    expect(
      container.querySelector("[data-slot='bulk-action-bar']"),
    ).toBeInTheDocument()
  })
})

// ─── Sorting ──────────────────────────────────────────────────────────────────

describe("IndexTable – sorting", () => {
  it("renders a sort button only for sortable columns", () => {
    const { container } = render(<IndexTable columns={columns} rows={rows} />)
    const sortButtons = container.querySelectorAll("[data-slot='index-table-sort']")
    expect(sortButtons).toHaveLength(1)
  })

  it("sorts ascending on first click of an unsorted column", async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(<IndexTable columns={columns} rows={rows} onSortChange={onSortChange} />)
    await user.click(screen.getByRole("button", { name: "Sort by order" }))
    expect(onSortChange).toHaveBeenCalledWith({ key: "order", direction: "asc" })
  })

  it("toggles asc → desc when the active asc column is clicked", async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        sort={{ key: "order", direction: "asc" }}
        onSortChange={onSortChange}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Sort by order" }))
    expect(onSortChange).toHaveBeenCalledWith({ key: "order", direction: "desc" })
  })

  it("toggles desc → asc when the active desc column is clicked", async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        sort={{ key: "order", direction: "desc" }}
        onSortChange={onSortChange}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Sort by order" }))
    expect(onSortChange).toHaveBeenCalledWith({ key: "order", direction: "asc" })
  })

  it("shows an ascending indicator on the active asc column", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        sort={{ key: "order", direction: "asc" }}
      />,
    )
    expect(
      container.querySelector("[data-slot='index-table-sort-asc']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='index-table-sort-desc']"),
    ).toBeNull()
  })

  it("shows a descending indicator on the active desc column", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        sort={{ key: "order", direction: "desc" }}
      />,
    )
    expect(
      container.querySelector("[data-slot='index-table-sort-desc']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='index-table-sort-asc']"),
    ).toBeNull()
  })

  it("shows no indicator on an inactive sortable column", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        sort={{ key: "customer", direction: "asc" }}
      />,
    )
    // "customer" is not sortable, so the active sort matches no header button.
    expect(
      container.querySelector("[data-slot='index-table-sort-asc']"),
    ).toBeNull()
  })

  it("does not throw when sorting without an onSortChange handler", async () => {
    const user = userEvent.setup()
    render(<IndexTable columns={columns} rows={rows} />)
    await user.click(screen.getByRole("button", { name: "Sort by order" }))
    expect(screen.getByRole("button", { name: "Sort by order" })).toBeInTheDocument()
  })

  it("applies ml-auto to a sort button in an end-aligned column", () => {
    const cols: IndexTableColumn<Order>[] = [
      { key: "total", header: "Total", sortable: true, align: "end" },
    ]
    const { container } = render(<IndexTable columns={cols} rows={rows} />)
    expect(container.querySelector("[data-slot='index-table-sort']")).toHaveClass(
      "ml-auto",
    )
  })
})

// ─── Loading ──────────────────────────────────────────────────────────────────

describe("IndexTable – loading", () => {
  it("renders the default number of skeleton rows", () => {
    const { container } = render(<IndexTable columns={columns} rows={[]} loading />)
    expect(
      container.querySelectorAll("[data-slot='index-table-skeleton-row']"),
    ).toHaveLength(5)
  })

  it("renders loadingRowCount skeleton rows", () => {
    const { container } = render(
      <IndexTable columns={columns} rows={[]} loading loadingRowCount={3} />,
    )
    expect(
      container.querySelectorAll("[data-slot='index-table-skeleton-row']"),
    ).toHaveLength(3)
  })

  it("renders a skeleton checkbox cell when loading and selectable", () => {
    const { container } = render(
      <IndexTable columns={columns} rows={[]} loading selectable loadingRowCount={1} />,
    )
    expect(container.querySelectorAll("[data-slot='skeleton']").length).toBeGreaterThan(
      columns.length,
    )
  })

  it("does not render the empty state while loading", () => {
    const { container } = render(<IndexTable columns={columns} rows={[]} loading />)
    expect(
      container.querySelector("[data-slot='index-table-empty-row']"),
    ).toBeNull()
  })
})

// ─── Empty state ──────────────────────────────────────────────────────────────

describe("IndexTable – empty state", () => {
  it("renders the default empty state when there are no rows", () => {
    render(<IndexTable columns={columns} rows={[]} />)
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument()
  })

  it("renders a custom empty state node when provided", () => {
    render(
      <IndexTable
        columns={columns}
        rows={[]}
        emptyState={<div>No orders found</div>}
      />,
    )
    expect(screen.getByText("No orders found")).toBeInTheDocument()
    expect(screen.queryByText("Nothing here yet")).not.toBeInTheDocument()
  })

  it("spans every column including the selection column", () => {
    const { container } = render(
      <IndexTable columns={columns} rows={[]} selectable />,
    )
    const cell = container.querySelector(
      "[data-slot='index-table-empty-row'] td",
    )
    expect(cell).toHaveAttribute("colspan", String(columns.length + 1))
  })

  it("spans only data columns when not selectable", () => {
    const { container } = render(<IndexTable columns={columns} rows={[]} />)
    const cell = container.querySelector(
      "[data-slot='index-table-empty-row'] td",
    )
    expect(cell).toHaveAttribute("colspan", String(columns.length))
  })
})

// ─── Pagination ───────────────────────────────────────────────────────────────

describe("IndexTable – pagination (offset)", () => {
  it("renders a range label and prev/next controls", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{ page: 1, pageSize: 20, total: 240, onPageChange: () => {} }}
      />,
    )
    expect(
      container.querySelector("[data-slot='index-table-range']"),
    ).toHaveTextContent("1–20 of 240")
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("uses font-mono tabular-nums on the range label", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{ page: 1, pageSize: 20, total: 240, onPageChange: () => {} }}
      />,
    )
    const range = container.querySelector("[data-slot='index-table-range']")
    expect(range?.className).toContain("font-mono")
    expect(range?.className).toContain("tabular-nums")
  })

  it("disables Previous on the first page and Next on the last", () => {
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{ page: 1, pageSize: 20, total: 20, onPageChange: () => {} }}
      />,
    )
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
  })

  it("computes a 0–0 range when total is 0", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={[]}
        pagination={{ page: 1, pageSize: 20, total: 0, onPageChange: () => {} }}
      />,
    )
    expect(
      container.querySelector("[data-slot='index-table-range']"),
    ).toHaveTextContent("0–0 of 0")
  })

  it("fires onPageChange with the next page", async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{ page: 2, pageSize: 20, total: 240, onPageChange }}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Next" }))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it("fires onPageChange with the previous page", async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{ page: 2, pageSize: 20, total: 240, onPageChange }}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Previous" }))
    expect(onPageChange).toHaveBeenCalledWith(1)
  })
})

describe("IndexTable – pagination (cursor)", () => {
  it("renders a custom range label and respects hasPrev/hasNext", () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{
          hasPrev: false,
          hasNext: true,
          onPrev: () => {},
          onNext: () => {},
          rangeLabel: "Page 1",
        }}
      />,
    )
    expect(
      container.querySelector("[data-slot='index-table-range']"),
    ).toHaveTextContent("Page 1")
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Next" })).not.toBeDisabled()
  })

  it("fires onNext and onPrev callbacks", async () => {
    const onNext = vi.fn()
    const onPrev = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{ hasPrev: true, hasNext: true, onPrev, onNext }}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Next" }))
    await user.click(screen.getByRole("button", { name: "Previous" }))
    expect(onNext).toHaveBeenCalledTimes(1)
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it("defaults hasPrev/hasNext to false when an empty cursor object is given", () => {
    render(<IndexTable columns={columns} rows={rows} pagination={{}} />)
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled()
  })

  it("does not throw when enabled prev/next have no handlers", async () => {
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{ hasPrev: true, hasNext: true }}
      />,
    )
    await user.click(screen.getByRole("button", { name: "Next" }))
    await user.click(screen.getByRole("button", { name: "Previous" }))
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument()
  })

  it("renders no pagination footer when pagination is omitted", () => {
    const { container } = render(<IndexTable columns={columns} rows={rows} />)
    expect(
      container.querySelector("[data-slot='index-table-pagination']"),
    ).toBeNull()
  })
})

// ─── Density ──────────────────────────────────────────────────────────────────

describe("IndexTable – density", () => {
  it("uses comfortable padding by default", () => {
    const { container } = render(<IndexTable columns={columns} rows={rows} />)
    expect(container.querySelector("[data-slot='index-table-row']")).toHaveClass(
      "[&>td]:py-3",
    )
  })

  it("uses condensed padding when density='condensed'", () => {
    const { container } = render(
      <IndexTable columns={columns} rows={rows} density="condensed" />,
    )
    expect(container.querySelector("[data-slot='index-table-row']")).toHaveClass(
      "[&>td]:py-1.5",
    )
  })
})

// ─── Row interaction ──────────────────────────────────────────────────────────

describe("IndexTable – row interaction", () => {
  it("fires onRowClick when a data cell is clicked", async () => {
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    render(<IndexTable columns={columns} rows={rows} onRowClick={onRowClick} />)
    await user.click(screen.getByText("Ada"))
    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })

  it("makes clickable rows keyboard focusable and activatable with Enter", async () => {
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <IndexTable columns={columns} rows={rows} onRowClick={onRowClick} />,
    )
    const row = container.querySelector(
      "[data-slot='index-table-row']",
    ) as HTMLElement
    expect(row).toHaveAttribute("tabindex", "0")
    row.focus()
    await user.keyboard("{Enter}")
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })

  it("activates a clickable row with the Space key", async () => {
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <IndexTable columns={columns} rows={rows} onRowClick={onRowClick} />,
    )
    const row = container.querySelector(
      "[data-slot='index-table-row']",
    ) as HTMLElement
    row.focus()
    await user.keyboard(" ")
    expect(onRowClick).toHaveBeenCalledTimes(1)
  })

  it("ignores other keys on a clickable row", async () => {
    const onRowClick = vi.fn()
    const user = userEvent.setup()
    const { container } = render(
      <IndexTable columns={columns} rows={rows} onRowClick={onRowClick} />,
    )
    const row = container.querySelector(
      "[data-slot='index-table-row']",
    ) as HTMLElement
    row.focus()
    await user.keyboard("{ArrowDown}")
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("does not fire onRowClick when the row checkbox is clicked", async () => {
    const onRowClick = vi.fn()
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={[]}
        onSelectionChange={onSelectionChange}
        onRowClick={onRowClick}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select row 1" }))
    expect(onSelectionChange).toHaveBeenCalled()
    expect(onRowClick).not.toHaveBeenCalled()
  })

  it("is not focusable when onRowClick is omitted", () => {
    const { container } = render(<IndexTable columns={columns} rows={rows} />)
    expect(
      container.querySelector("[data-slot='index-table-row']"),
    ).not.toHaveAttribute("tabindex")
  })
})

// ─── Custom getRowId ──────────────────────────────────────────────────────────

describe("IndexTable – getRowId", () => {
  it("uses a custom getRowId for selection ids", async () => {
    const onSelectionChange = vi.fn()
    const user = userEvent.setup()
    render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={[]}
        getRowId={(row) => `order-${row.order}`}
        onSelectionChange={onSelectionChange}
      />,
    )
    await user.click(screen.getByRole("checkbox", { name: "Select all" }))
    expect(onSelectionChange).toHaveBeenCalledWith([
      "order-#1001",
      "order-#1002",
      "order-#1003",
    ])
  })
})

// ─── Accessibility ────────────────────────────────────────────────────────────

describe("IndexTable – accessibility", () => {
  it("has no axe violations in a selectable, sortable table", async () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        selectable
        selectedIds={["1"]}
        onSelectionChange={() => {}}
        sort={{ key: "order", direction: "asc" }}
        onSortChange={() => {}}
        bulkActions={[{ label: "Archive" }]}
        caption="Orders"
        onRowClick={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations in the empty state", async () => {
    const { container } = render(<IndexTable columns={columns} rows={[]} selectable />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations with pagination", async () => {
    const { container } = render(
      <IndexTable
        columns={columns}
        rows={rows}
        pagination={{ page: 1, pageSize: 20, total: 240, onPageChange: () => {} }}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
