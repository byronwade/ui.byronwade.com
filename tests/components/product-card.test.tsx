import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { ProductCard, type ProductStatus } from "@/components/product-card"

describe("ProductCard – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <ProductCard title="Cedar Candle" price={24} />,
    )
    expect(
      container.querySelector("[data-slot='product-card']"),
    ).toBeInTheDocument()
  })

  it("renders the title and an optional vendor subtitle", () => {
    render(<ProductCard title="Cedar Candle" vendor="Hearth Co." price={24} />)
    expect(screen.getByText("Cedar Candle")).toBeInTheDocument()
    expect(screen.getByText("Hearth Co.")).toBeInTheDocument()
  })

  it("omits the vendor subtitle when none is provided", () => {
    const { container } = render(
      <ProductCard title="Cedar Candle" price={24} />,
    )
    expect(
      container.querySelector("[data-slot='product-card-vendor']"),
    ).not.toBeInTheDocument()
  })

  it("merges a custom className onto the root while keeping base classes", () => {
    const { container } = render(
      <ProductCard className="custom-class" title="Cedar Candle" price={24} />,
    )
    const root = container.querySelector("[data-slot='product-card']")
    expect(root).toHaveClass("custom-class")
  })
})

describe("ProductCard – media", () => {
  it("renders an image with alt text when image is provided", () => {
    render(<ProductCard title="Cedar Candle" image="/candle.jpg" price={24} />)
    const img = screen.getByRole("img", { name: "Cedar Candle" })
    expect(img).toHaveAttribute("src", "/candle.jpg")
  })

  it("renders a placeholder with the title initial when no image is provided", () => {
    const { container } = render(
      <ProductCard title="Cedar Candle" price={24} />,
    )
    expect(
      container.querySelector("[data-slot='product-card-placeholder']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='product-card-image']"),
    ).not.toBeInTheDocument()
    expect(screen.getByText("C")).toBeInTheDocument()
  })
})

describe("ProductCard – status", () => {
  it.each([
    ["active", "Active"],
    ["draft", "Draft"],
    ["archived", "Archived"],
  ] as const)("renders the %s status label", (status, label) => {
    const { container } = render(
      <ProductCard title="Cedar Candle" price={24} status={status} />,
    )
    expect(screen.getByText(label)).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='product-card-status']"),
    ).toBeInTheDocument()
  })

  it("omits the status row when status is undefined", () => {
    const { container } = render(
      <ProductCard title="Cedar Candle" price={24} />,
    )
    expect(
      container.querySelector("[data-slot='product-card-status']"),
    ).not.toBeInTheDocument()
  })
})

describe("ProductCard – price", () => {
  it("formats the price as currency", () => {
    render(<ProductCard title="Cedar Candle" price={24} />)
    expect(screen.getByText("$24.00")).toBeInTheDocument()
  })

  it("renders a struck-through compareAtPrice before the price when provided", () => {
    render(<ProductCard title="Cedar Candle" price={24} compareAtPrice={40} />)
    const compare = screen.getByText("$40.00")
    expect(compare).toHaveClass("line-through")
    expect(screen.getByText("$24.00")).toBeInTheDocument()
  })

  it("omits the compareAtPrice when none is provided", () => {
    render(<ProductCard title="Cedar Candle" price={24} />)
    expect(screen.queryByText("$40.00")).not.toBeInTheDocument()
  })

  it("respects currency and locale props", () => {
    render(
      <ProductCard
        title="Cedar Candle"
        price={24}
        currency="EUR"
        locale="de-DE"
      />,
    )
    expect(screen.getByText(/24,00/)).toBeInTheDocument()
  })
})

describe("ProductCard – inventory", () => {
  it("renders a normal in-stock count above the threshold", () => {
    render(<ProductCard title="Cedar Candle" price={24} inventory={42} />)
    expect(screen.getByText("42 in stock")).toBeInTheDocument()
  })

  it("renders an out-of-stock message when inventory is 0", () => {
    render(<ProductCard title="Cedar Candle" price={24} inventory={0} />)
    const line = screen.getByText("Out of stock")
    expect(line).toHaveClass("text-destructive")
  })

  it("renders a low-stock message at the threshold boundary", () => {
    render(
      <ProductCard
        title="Cedar Candle"
        price={24}
        inventory={5}
        lowStockThreshold={5}
      />,
    )
    const line = screen.getByText("Low stock · 5")
    expect(line).toHaveClass("text-warning")
  })

  it("renders a low-stock message below the threshold", () => {
    render(
      <ProductCard
        title="Cedar Candle"
        price={24}
        inventory={2}
        lowStockThreshold={5}
      />,
    )
    expect(screen.getByText("Low stock · 2")).toBeInTheDocument()
  })

  it("omits the inventory line when inventory is undefined", () => {
    const { container } = render(
      <ProductCard title="Cedar Candle" price={24} />,
    )
    expect(
      container.querySelector("[data-slot='product-card-inventory']"),
    ).not.toBeInTheDocument()
  })
})

describe("ProductCard – interaction", () => {
  it("exposes button semantics and fires onClick when clicked", () => {
    const onClick = vi.fn()
    render(<ProductCard title="Cedar Candle" price={24} onClick={onClick} />)
    const root = screen.getByRole("button", { name: /Cedar Candle/ })
    expect(root).toHaveAttribute("tabindex", "0")
    fireEvent.click(root)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick on Enter", () => {
    const onClick = vi.fn()
    render(<ProductCard title="Cedar Candle" price={24} onClick={onClick} />)
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("fires onClick on Space", () => {
    const onClick = vi.fn()
    render(<ProductCard title="Cedar Candle" price={24} onClick={onClick} />)
    fireEvent.keyDown(screen.getByRole("button"), { key: " " })
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not fire onClick on a non-activating key", () => {
    const onClick = vi.fn()
    render(<ProductCard title="Cedar Candle" price={24} onClick={onClick} />)
    fireEvent.keyDown(screen.getByRole("button"), { key: "Escape" })
    expect(onClick).not.toHaveBeenCalled()
  })

  it("is non-interactive when no onClick is provided", () => {
    const { container } = render(
      <ProductCard title="Cedar Candle" price={24} />,
    )
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
    const root = container.querySelector("[data-slot='product-card']")
    expect(root).not.toHaveAttribute("tabindex")
  })
})

describe("ProductCard – accessibility", () => {
  it("has no axe violations (image + interactive)", async () => {
    const { container } = render(
      <ProductCard
        title="Cedar Candle"
        vendor="Hearth Co."
        image="/candle.jpg"
        status="active"
        price={24}
        compareAtPrice={40}
        inventory={42}
        onClick={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (placeholder + non-interactive)", async () => {
    const statuses: ProductStatus[] = ["active", "draft", "archived"]
    const { container } = render(
      <div>
        {statuses.map((status) => (
          <ProductCard
            key={status}
            title={`Candle ${status}`}
            price={24}
            status={status}
            inventory={0}
          />
        ))}
      </div>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
