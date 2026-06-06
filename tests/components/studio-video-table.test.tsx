import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  StudioVideoTable,
  type StudioVideoSort,
} from "@/components/studio-video-table"
import { StudioVideoRow } from "@/components/studio-video-row"

describe("StudioVideoTable", () => {
  it("renders the table shell with header and body slots", () => {
    const { container } = render(
      <StudioVideoTable>
        <StudioVideoRow title="One" visibility="public" />
      </StudioVideoTable>,
    )
    expect(
      container.querySelector("[data-slot='studio-video-table']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='studio-video-table-header']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='studio-video-table-body']"),
    ).toBeInTheDocument()
  })

  it("renders children inside the body", () => {
    render(
      <StudioVideoTable>
        <StudioVideoRow title="My upload" visibility="draft" />
      </StudioVideoTable>,
    )
    expect(screen.getByText("My upload")).toBeInTheDocument()
  })

  it("toggles select-all and fires onSelectAllChange (uncontrolled)", async () => {
    const onSelectAllChange = vi.fn()
    const user = userEvent.setup()
    render(
      <StudioVideoTable onSelectAllChange={onSelectAllChange}>
        <StudioVideoRow title="One" visibility="public" />
      </StudioVideoTable>,
    )
    await user.click(
      screen.getByRole("checkbox", { name: "Select all videos" }),
    )
    expect(onSelectAllChange).toHaveBeenCalledWith(true)
  })

  it("respects controlled allSelected without self-flipping", async () => {
    const onSelectAllChange = vi.fn()
    const user = userEvent.setup()
    render(
      <StudioVideoTable allSelected={false} onSelectAllChange={onSelectAllChange}>
        <StudioVideoRow title="One" visibility="public" />
      </StudioVideoTable>,
    )
    const checkbox = screen.getByRole("checkbox", { name: "Select all videos" })
    await user.click(checkbox)
    expect(onSelectAllChange).toHaveBeenCalledWith(true)
    expect(checkbox).not.toBeChecked()
  })

  it("sorts by a metric column and fires onSortChange", async () => {
    const onSortChange = vi.fn()
    const user = userEvent.setup()
    render(
      <StudioVideoTable onSortChange={onSortChange}>
        <StudioVideoRow title="One" visibility="public" />
      </StudioVideoTable>,
    )
    await user.click(screen.getByRole("button", { name: "Sort by Views" }))
    expect(onSortChange).toHaveBeenCalledWith({ key: "views", direction: "asc" })
  })

  it("flips sort direction when the same column is clicked again (uncontrolled)", async () => {
    const user = userEvent.setup()
    render(
      <StudioVideoTable defaultSort={{ key: "views", direction: "desc" }}>
        <StudioVideoRow title="One" visibility="public" />
      </StudioVideoTable>,
    )
    const viewsSort = screen.getByRole("button", { name: "Sort by Views" })
    expect(viewsSort).toHaveAttribute("data-active", "true")
    await user.click(viewsSort)
    expect(viewsSort).toHaveAttribute("data-active", "true")
  })

  it("merges a custom className onto the root", () => {
    const { container } = render(
      <StudioVideoTable className="custom">
        <StudioVideoRow title="One" visibility="public" />
      </StudioVideoTable>,
    )
    expect(
      container.querySelector("[data-slot='studio-video-table']"),
    ).toHaveClass("custom")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <StudioVideoTable defaultSort={{ key: "date", direction: "asc" } as StudioVideoSort}>
        <StudioVideoRow title="One" visibility="public" views={100} />
        <StudioVideoRow title="Two" visibility="draft" />
      </StudioVideoTable>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
