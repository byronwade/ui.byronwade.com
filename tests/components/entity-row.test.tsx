import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import { EntityRow } from "@/components/ui/entity-row"

function slot(container: HTMLElement, name: string) {
  return container.querySelector(`[data-slot="entity-row-${name}"]`)
}

describe("EntityRow", () => {
  it("renders all named slots", () => {
    const { container } = render(
      <EntityRow
        leading={<span data-testid="leading">A</span>}
        title="Ariana Cole"
        description="ariana@northwind.test"
        meta="2m ago"
        status={<span>Active</span>}
        actions={<button type="button">Open</button>}
      />,
    )

    expect(
      container.querySelector('[data-slot="entity-row"]'),
    ).toBeInTheDocument()
    expect(slot(container, "leading")).toContainElement(
      screen.getByTestId("leading"),
    )
    expect(slot(container, "title")).toHaveTextContent("Ariana Cole")
    expect(slot(container, "description")).toHaveTextContent(
      "ariana@northwind.test",
    )
    expect(slot(container, "meta")).toHaveTextContent("2m ago")
    expect(slot(container, "status")).toHaveTextContent("Active")
    expect(slot(container, "actions")).toContainElement(
      screen.getByRole("button", { name: "Open" }),
    )
  })

  it("omits optional slots when props are not provided", () => {
    const { container } = render(<EntityRow title="Bare row" />)

    expect(slot(container, "leading")).toBeNull()
    expect(slot(container, "description")).toBeNull()
    expect(slot(container, "meta")).toBeNull()
    expect(slot(container, "status")).toBeNull()
    expect(slot(container, "actions")).toBeNull()
  })

  it("applies each variant and merges className on the root", () => {
    const { container, rerender } = render(
      <EntityRow title="Default" className="custom-row" />,
    )
    const root = container.querySelector('[data-slot="entity-row"]')
    expect(root).toHaveClass("custom-row", "rounded-lg", "px-3", "py-2.5")

    rerender(<EntityRow title="Card" variant="card" />)
    expect(root).toHaveClass("rounded-2xl", "edge", "bg-card")

    rerender(<EntityRow title="Compact" variant="compact" />)
    expect(root).toHaveClass("gap-2", "px-2", "py-1.5")
  })

  it("activates through an accessible overlay button", async () => {
    const user = userEvent.setup()
    const onActivate = vi.fn()
    const { container } = render(
      <EntityRow title="Open workspace" onActivate={onActivate} />,
    )

    const activator = screen.getByRole("button", { name: "Open workspace" })
    expect(activator).toHaveAttribute("data-slot", "entity-row-activator")

    await user.click(activator)
    activator.focus()
    await user.keyboard("{Enter}")
    await user.keyboard(" ")

    expect(onActivate).toHaveBeenCalledTimes(3)
    expect(
      container.querySelector('[data-slot="entity-row"]'),
    ).not.toHaveAttribute("role", "button")
  })

  it("keeps action controls outside the activation control", async () => {
    const user = userEvent.setup()
    const onActivate = vi.fn()
    const onAction = vi.fn()

    render(
      <EntityRow
        title="Invoice"
        onActivate={onActivate}
        actions={
          <button type="button" onClick={onAction}>
            Delete
          </button>
        }
      />,
    )

    await user.click(screen.getByRole("button", { name: "Delete" }))

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(onActivate).not.toHaveBeenCalled()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <EntityRow
        leading={<span aria-hidden>AC</span>}
        title="Ariana Cole"
        description="Customer"
        meta="12 orders"
        status={<span>Active</span>}
        actions={<button type="button">Archive</button>}
        onActivate={() => {}}
      />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
