import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import {
  InventoryBar,
  type InventoryBarProps,
} from "@/components/inventory-bar"

function getRoot(container: HTMLElement) {
  return container.querySelector("[data-slot='inventory-bar']") as HTMLElement
}

function getProgress(container: HTMLElement) {
  return container.querySelector(
    "[data-slot='inventory-bar-progress']",
  ) as HTMLElement
}

describe("InventoryBar – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<InventoryBar available={50} total={100} />)
    expect(getRoot(container)).toBeInTheDocument()
  })

  it("composes the progress primitive (renders a progressbar)", () => {
    render(<InventoryBar available={50} total={100} />)
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("merges a custom className while keeping base classes", () => {
    const { container } = render(
      <InventoryBar available={50} total={100} className="custom-class" />,
    )
    const root = getRoot(container)
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("flex")
  })

  it("forwards arbitrary props to the root element", () => {
    render(<InventoryBar available={50} total={100} data-testid="ib" />)
    expect(screen.getByTestId("ib")).toHaveAttribute(
      "data-slot",
      "inventory-bar",
    )
  })
})

describe("InventoryBar – tone branches", () => {
  it("in-stock → success tone, In stock label", () => {
    const { container } = render(<InventoryBar available={120} total={200} />)
    expect(getRoot(container)).toHaveAttribute("data-tone", "ok")
    expect(getProgress(container)).toHaveClass(
      "[&_[data-slot=progress-indicator]]:bg-success",
    )
    expect(screen.getByText("In stock")).toBeInTheDocument()
  })

  it("low stock → warning tone, Low stock label (at threshold boundary)", () => {
    const { container } = render(<InventoryBar available={10} total={200} />)
    expect(getRoot(container)).toHaveAttribute("data-tone", "low")
    expect(getProgress(container)).toHaveClass(
      "[&_[data-slot=progress-indicator]]:bg-warning",
    )
    expect(screen.getByText("Low stock")).toBeInTheDocument()
  })

  it("just above threshold stays in-stock", () => {
    const { container } = render(<InventoryBar available={11} total={200} />)
    expect(getRoot(container)).toHaveAttribute("data-tone", "ok")
  })

  it("out of stock (available = 0) → destructive tone, Out of stock label", () => {
    const { container } = render(<InventoryBar available={0} total={200} />)
    expect(getRoot(container)).toHaveAttribute("data-tone", "out")
    expect(getProgress(container)).toHaveClass(
      "[&_[data-slot=progress-indicator]]:bg-destructive",
    )
    expect(screen.getByText("Out of stock")).toBeInTheDocument()
  })

  it("negative availability → out of stock", () => {
    const { container } = render(<InventoryBar available={-5} total={200} />)
    expect(getRoot(container)).toHaveAttribute("data-tone", "out")
  })

  it("honours a custom lowStockThreshold", () => {
    const { container } = render(
      <InventoryBar available={40} total={200} lowStockThreshold={50} />,
    )
    expect(getRoot(container)).toHaveAttribute("data-tone", "low")
  })
})

describe("InventoryBar – percentage and guards", () => {
  it("computes a proportional value (50 / 100 → 50%)", () => {
    render(<InventoryBar available={50} total={100} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50",
    )
  })

  it("guards a non-positive total (divide-by-zero) → 0%", () => {
    render(<InventoryBar available={5} total={0} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    )
  })

  it("guards a negative total → 0%", () => {
    render(<InventoryBar available={5} total={-10} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    )
  })

  it("clamps when available exceeds total → 100%", () => {
    render(<InventoryBar available={250} total={200} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    )
  })

  it("out of stock renders a 0% bar", () => {
    render(<InventoryBar available={0} total={200} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    )
  })
})

describe("InventoryBar – count label", () => {
  it("shows the count by default as mono '{available} / {total}'", () => {
    const { container } = render(<InventoryBar available={128} total={200} />)
    const count = container.querySelector(
      "[data-slot='inventory-bar-count']",
    ) as HTMLElement
    expect(count).toBeInTheDocument()
    expect(count.textContent).toBe("128 / 200")
    expect(count).toHaveClass("font-mono")
    expect(count).toHaveClass("tabular-nums")
  })

  it("hides the count when showCount is false", () => {
    const { container } = render(
      <InventoryBar available={128} total={200} showCount={false} />,
    )
    expect(
      container.querySelector("[data-slot='inventory-bar-count']"),
    ).not.toBeInTheDocument()
  })
})

describe("InventoryBar – status label", () => {
  it("shows the status by default", () => {
    const { container } = render(<InventoryBar available={128} total={200} />)
    const status = container.querySelector(
      "[data-slot='inventory-bar-status']",
    ) as HTMLElement
    expect(status).toBeInTheDocument()
    expect(status.textContent).toBe("In stock")
  })

  it("hides the status when showStatus is false", () => {
    const { container } = render(
      <InventoryBar available={128} total={200} showStatus={false} />,
    )
    expect(
      container.querySelector("[data-slot='inventory-bar-status']"),
    ).not.toBeInTheDocument()
  })

  it("omits the meta row entirely when both labels are hidden", () => {
    const { container } = render(
      <InventoryBar
        available={128}
        total={200}
        showCount={false}
        showStatus={false}
      />,
    )
    expect(
      container.querySelector("[data-slot='inventory-bar-meta']"),
    ).not.toBeInTheDocument()
  })
})

describe("InventoryBar – accessibility", () => {
  const cases: InventoryBarProps[] = [
    { available: 128, total: 200 },
    { available: 6, total: 200 },
    { available: 0, total: 200 },
  ]

  it.each(cases)(
    "has no axe violations (available=$available)",
    async (props) => {
      const { container } = render(<InventoryBar {...props} />)
      expect(await axe(container)).toHaveNoViolations()
    },
  )

  it("has no axe violations with labels hidden", async () => {
    const { container } = render(
      <InventoryBar
        available={50}
        total={100}
        showCount={false}
        showStatus={false}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
