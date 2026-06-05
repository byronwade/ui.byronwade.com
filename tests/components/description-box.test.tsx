import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { DescriptionBox } from "@/components/description-box"

const root = (container: HTMLElement) =>
  container.querySelector("[data-slot='description-box']") as HTMLElement
const header = (container: HTMLElement) =>
  container.querySelector("[data-slot='description-box-header']")
const body = (container: HTMLElement) =>
  container.querySelector("[data-slot='description-box-body']") as HTMLElement
const toggle = () => screen.getByRole("button")

describe("DescriptionBox – smoke", () => {
  it("renders without crashing and exposes the root data-slot", () => {
    const { container } = render(
      <DescriptionBox>A short description.</DescriptionBox>,
    )
    expect(root(container)).toBeInTheDocument()
    expect(root(container)).toHaveClass("bg-secondary")
  })

  it("renders the body content", () => {
    render(<DescriptionBox>Unique body text here</DescriptionBox>)
    expect(screen.getByText("Unique body text here")).toBeInTheDocument()
  })

  it("merges a custom className while keeping base classes", () => {
    const { container } = render(
      <DescriptionBox className="custom-class">body</DescriptionBox>,
    )
    expect(root(container)).toHaveClass("custom-class")
    expect(root(container)).toHaveClass("rounded-xl")
  })

  it("forwards arbitrary props to the root element", () => {
    const { container } = render(
      <DescriptionBox data-testid="db">body</DescriptionBox>,
    )
    expect(root(container)).toHaveAttribute("data-testid", "db")
  })
})

describe("DescriptionBox – header", () => {
  it("renders compact views and timestamp with a separator between them", () => {
    const { container } = render(
      <DescriptionBox views={2200000} timestamp="2 months ago">
        body
      </DescriptionBox>,
    )
    const h = header(container)
    expect(h).toBeInTheDocument()
    expect(h).toHaveTextContent("2.2M views")
    expect(h).toHaveTextContent("2 months ago")
    expect(h?.querySelector("[aria-hidden]")).toHaveTextContent("·")
  })

  it("applies font-mono tabular-nums to the views count", () => {
    const { container } = render(
      <DescriptionBox views={1500}>body</DescriptionBox>,
    )
    const count = screen.getByText("1.5K views")
    expect(count).toHaveClass("font-mono")
    expect(count).toHaveClass("tabular-nums")
    // No separator when only one part is present.
    expect(header(container)?.querySelector("[aria-hidden]")).toBeNull()
  })

  it("renders only the timestamp (no separator) when views are absent", () => {
    const { container } = render(
      <DescriptionBox timestamp="1 year ago">body</DescriptionBox>,
    )
    const h = header(container)
    expect(h).toHaveTextContent("1 year ago")
    expect(h?.querySelector("[aria-hidden]")).toBeNull()
  })

  it("omits the header entirely when neither views nor timestamp are given", () => {
    const { container } = render(<DescriptionBox>body</DescriptionBox>)
    expect(header(container)).toBeNull()
    // Without a header the body carries no top margin.
    expect(body(container)).not.toHaveClass("mt-1")
  })

  it("adds top margin to the body when a header is present", () => {
    const { container } = render(
      <DescriptionBox views={100}>body</DescriptionBox>,
    )
    expect(body(container)).toHaveClass("mt-1")
  })
})

describe("DescriptionBox – collapse styling", () => {
  it("clamps the body with the default of 3 lines when collapsed", () => {
    const { container } = render(<DescriptionBox>body</DescriptionBox>)
    expect(body(container).style.webkitLineClamp).toBe("3")
    expect(body(container).style.overflow).toBe("hidden")
  })

  it("honors a custom collapsedLines value", () => {
    const { container } = render(
      <DescriptionBox collapsedLines={5}>body</DescriptionBox>,
    )
    expect(body(container).style.webkitLineClamp).toBe("5")
  })

  it("removes the clamp style when expanded", () => {
    const { container } = render(
      <DescriptionBox defaultExpanded>body</DescriptionBox>,
    )
    expect(body(container).style.webkitLineClamp).toBe("")
    expect(body(container).style.overflow).toBe("")
  })
})

describe("DescriptionBox – uncontrolled toggle", () => {
  it("shows the more label when collapsed and the less label when expanded", async () => {
    const user = userEvent.setup()
    render(<DescriptionBox>body</DescriptionBox>)
    expect(toggle()).toHaveTextContent("...more")
    expect(toggle()).toHaveAttribute("aria-expanded", "false")
    await user.click(toggle())
    expect(toggle()).toHaveTextContent("Show less")
    expect(toggle()).toHaveAttribute("aria-expanded", "true")
  })

  it("collapses again when the less label is clicked", async () => {
    const user = userEvent.setup()
    const { container } = render(<DescriptionBox>body</DescriptionBox>)
    await user.click(toggle())
    expect(body(container).style.webkitLineClamp).toBe("")
    await user.click(toggle())
    expect(toggle()).toHaveTextContent("...more")
    expect(body(container).style.webkitLineClamp).toBe("3")
  })

  it("honors defaultExpanded and fires onExpandedChange on toggle", async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    render(
      <DescriptionBox defaultExpanded onExpandedChange={onExpandedChange}>
        body
      </DescriptionBox>,
    )
    expect(toggle()).toHaveTextContent("Show less")
    await user.click(toggle())
    expect(onExpandedChange).toHaveBeenCalledWith(false)
    expect(toggle()).toHaveTextContent("...more")
  })

  it("does not throw when onExpandedChange is omitted", async () => {
    const user = userEvent.setup()
    render(<DescriptionBox>body</DescriptionBox>)
    await user.click(toggle())
    expect(toggle()).toHaveTextContent("Show less")
  })

  it("supports custom more/less labels", async () => {
    const user = userEvent.setup()
    render(
      <DescriptionBox moreLabel="Expand" lessLabel="Collapse">
        body
      </DescriptionBox>,
    )
    expect(toggle()).toHaveTextContent("Expand")
    await user.click(toggle())
    expect(toggle()).toHaveTextContent("Collapse")
  })
})

describe("DescriptionBox – controlled", () => {
  it("reflects the controlled expanded prop", () => {
    const { container, rerender } = render(
      <DescriptionBox expanded={false}>body</DescriptionBox>,
    )
    expect(toggle()).toHaveTextContent("...more")
    expect(body(container).style.webkitLineClamp).toBe("3")
    rerender(<DescriptionBox expanded>body</DescriptionBox>)
    expect(toggle()).toHaveTextContent("Show less")
    expect(body(container).style.webkitLineClamp).toBe("")
  })

  it("fires onExpandedChange but does not change its own state when controlled", async () => {
    const user = userEvent.setup()
    const onExpandedChange = vi.fn()
    const { container } = render(
      <DescriptionBox expanded={false} onExpandedChange={onExpandedChange}>
        body
      </DescriptionBox>,
    )
    await user.click(toggle())
    expect(onExpandedChange).toHaveBeenCalledWith(true)
    // Parent owns the value, so the view stays collapsed until it updates.
    expect(toggle()).toHaveTextContent("...more")
    expect(body(container).style.webkitLineClamp).toBe("3")
  })
})

describe("DescriptionBox – accessibility", () => {
  it("has no axe violations (collapsed)", async () => {
    const { container } = render(
      <DescriptionBox views={2200000} timestamp="2 months ago">
        An accessible description body.
      </DescriptionBox>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (expanded)", async () => {
    const { container } = render(
      <DescriptionBox defaultExpanded>
        An accessible description body.
      </DescriptionBox>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
