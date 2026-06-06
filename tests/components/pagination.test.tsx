/**
 * Tests for Pagination (components/ui/pagination.tsx).
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

function BasicPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

describe("Pagination — render", () => {
  it("renders a navigation landmark", () => {
    render(<BasicPagination />)
    expect(screen.getByRole("navigation", { name: "pagination" })).toBeInTheDocument()
  })

  it("has data-slot attributes on nav, content, items, and links", () => {
    const { container } = render(<BasicPagination />)
    expect(container.querySelector('[data-slot="pagination"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="pagination-content"]')).not.toBeNull()
    expect(container.querySelectorAll('[data-slot="pagination-item"]').length).toBe(6)
    expect(container.querySelector('[data-slot="pagination-ellipsis"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="pagination-link"]')).not.toBeNull()
  })

  it("renders previous and next controls with accessible labels", () => {
    render(<BasicPagination />)
    expect(
      screen.getByRole("button", { name: "Go to previous page" }),
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Go to next page" })).toBeInTheDocument()
  })
})

describe("Pagination — states", () => {
  it("marks the active page with aria-current='page'", () => {
    render(<BasicPagination />)
    const active = screen.getByRole("button", { name: "2" })
    expect(active).toHaveAttribute("aria-current", "page")
    expect(active).toHaveAttribute("data-active", "true")
  })

  it("inactive page links omit aria-current", () => {
    render(<BasicPagination />)
    expect(screen.getByRole("button", { name: "1" })).not.toHaveAttribute("aria-current")
    expect(screen.getByRole("button", { name: "3" })).not.toHaveAttribute("aria-current")
  })

  it("merges custom className on Pagination", () => {
    const { container } = render(
      <Pagination className="max-w-md">
        <PaginationContent />
      </Pagination>,
    )
    expect(container.querySelector('[data-slot="pagination"]')).toHaveClass("max-w-md")
  })
})

describe("Pagination — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<BasicPagination />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
