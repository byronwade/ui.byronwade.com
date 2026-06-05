import * as React from "react"
import { render, screen, within } from "@testing-library/react"
import { describe, it, expect, beforeAll } from "vitest"
import { axe } from "vitest-axe"
import {
  OrderSummary,
  type OrderLineItem,
  type OrderDiscount,
} from "@/components/order-summary"

// Intl currency formatting separates the amount and symbol with a non-breaking
// space (U+00A0). Testing Library normalizes the *node* text's NBSP to a regular
// space but not the search string, so we normalize it here to keep matches exact.
const money = (value: number, locale = "en-US", currency = "USD") =>
  new Intl.NumberFormat(locale, { style: "currency", currency })
    .format(value)
    .replace(/[\u00A0\u202F]/g, " ")

// Images never auto-load in jsdom, so Base UI's AvatarImage stays unmounted until
// a load event fires. Mirror avatar.test.tsx: override the src setter to dispatch
// load/error so the <img> mounts.
beforeAll(() => {
  Object.defineProperty(window.HTMLImageElement.prototype, "src", {
    configurable: true,
    set(value: string) {
      this.setAttribute("src", value)
      queueMicrotask(() => {
        this.dispatchEvent(
          new Event(String(value).includes("broken") ? "error" : "load"),
        )
      })
    },
  })
})

const items: OrderLineItem[] = [
  {
    id: "tee",
    title: "Cotton Tee",
    variant: "Black / M",
    quantity: 2,
    price: 30,
    image: "https://example.com/tee.png",
  },
  {
    title: "Cap",
    sku: "CAP-001",
    quantity: 1,
    price: 20,
  },
]

const discounts: OrderDiscount[] = [
  { label: "Welcome", code: "SAVE10", amount: 10 },
]

describe("OrderSummary – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<OrderSummary lineItems={items} />)
    expect(
      container.querySelector("[data-slot='order-summary']"),
    ).toBeInTheDocument()
  })

  it("renders an item row per line item with title, variant, sku and unit price", () => {
    const { container } = render(<OrderSummary lineItems={items} />)
    expect(container.querySelectorAll("[data-slot='order-item']")).toHaveLength(
      2,
    )
    expect(screen.getByText("Cotton Tee")).toBeInTheDocument()
    expect(screen.getByText("Black / M")).toBeInTheDocument()
    expect(screen.getByText("CAP-001")).toBeInTheDocument()
    expect(screen.getByText(`2 × ${money(30)}`)).toBeInTheDocument()
    expect(screen.getByText(`1 × ${money(20)}`)).toBeInTheDocument()
  })

  it("renders an item with neither variant nor sku", () => {
    render(
      <OrderSummary
        lineItems={[{ title: "Sticker", quantity: 3, price: 2 }]}
      />,
    )
    expect(screen.getByText("Sticker")).toBeInTheDocument()
    expect(screen.getByText(`3 × ${money(2)}`)).toBeInTheDocument()
  })

  it("merges a custom className and forwards arbitrary props to the root", () => {
    render(
      <OrderSummary lineItems={items} className="custom" data-testid="os" />,
    )
    const root = screen.getByTestId("os")
    expect(root).toHaveClass("custom")
    expect(root).toHaveClass("flex")
    expect(root).toHaveAttribute("data-slot", "order-summary")
  })
})

describe("OrderSummary – image vs fallback", () => {
  it("renders an avatar image when an item has an image", async () => {
    render(<OrderSummary lineItems={[items[0]]} />)
    // AvatarImage mounts only after the mocked load event fires (microtask).
    const img = await screen.findByRole("img", { name: "Cotton Tee" })
    expect(img).toHaveAttribute("src", "https://example.com/tee.png")
  })

  it("renders a token-bordered fallback box when an item has no image", () => {
    const { container } = render(<OrderSummary lineItems={[items[1]]} />)
    expect(
      container.querySelector("[data-slot='order-item-thumb']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='avatar-image']"),
    ).not.toBeInTheDocument()
  })
})

describe("OrderSummary – computed vs explicit totals", () => {
  it("computes subtotal from line items when subtotal is omitted", () => {
    const { container } = render(<OrderSummary lineItems={items} />)
    // 2*30 + 1*20 = 80
    const rows = container.querySelectorAll("[data-slot='order-row']")
    expect(
      within(rows[0] as HTMLElement).getByText(money(80)),
    ).toBeInTheDocument()
  })

  it("uses an explicit subtotal when provided", () => {
    const { container } = render(
      <OrderSummary lineItems={items} subtotal={100} />,
    )
    const rows = container.querySelectorAll("[data-slot='order-row']")
    expect(
      within(rows[0] as HTMLElement).getByText(money(100)),
    ).toBeInTheDocument()
  })

  it("computes total from subtotal, discounts, shipping and tax when total is omitted", () => {
    const { container } = render(
      <OrderSummary
        lineItems={items}
        discounts={discounts}
        shipping={5}
        tax={8}
      />,
    )
    // 80 - 10 + 5 + 8 = 83
    const totalRow = container.querySelector(
      "[data-slot='order-total']",
    ) as HTMLElement
    expect(within(totalRow).getByText(money(83))).toBeInTheDocument()
  })

  it("uses an explicit total when provided", () => {
    const { container } = render(<OrderSummary lineItems={items} total={999} />)
    const totalRow = container.querySelector(
      "[data-slot='order-total']",
    ) as HTMLElement
    expect(within(totalRow).getByText(money(999))).toBeInTheDocument()
  })

  it("computes total with no discounts/shipping/tax (defaults to subtotal)", () => {
    const { container } = render(<OrderSummary lineItems={items} />)
    const totalRow = container.querySelector(
      "[data-slot='order-total']",
    ) as HTMLElement
    expect(within(totalRow).getByText(money(80))).toBeInTheDocument()
  })
})

describe("OrderSummary – discounts", () => {
  it("renders each discount as a negative amount with a code badge", () => {
    const { container } = render(
      <OrderSummary lineItems={items} discounts={discounts} />,
    )
    const row = container.querySelector(
      "[data-slot='order-discount']",
    ) as HTMLElement
    expect(within(row).getByText("Welcome")).toBeInTheDocument()
    expect(within(row).getByText("SAVE10")).toBeInTheDocument()
    expect(within(row).getByText(money(-10))).toBeInTheDocument()
  })

  it("renders a discount without a code badge", () => {
    const { container } = render(
      <OrderSummary
        lineItems={items}
        discounts={[{ label: "Loyalty", amount: 5 }]}
      />,
    )
    const row = container.querySelector(
      "[data-slot='order-discount']",
    ) as HTMLElement
    expect(within(row).getByText("Loyalty")).toBeInTheDocument()
    expect(within(row).getByText(money(-5))).toBeInTheDocument()
    expect(within(row).queryByText("SAVE10")).not.toBeInTheDocument()
  })

  it("renders no discount rows when discounts is omitted", () => {
    const { container } = render(<OrderSummary lineItems={items} />)
    expect(
      container.querySelectorAll("[data-slot='order-discount']"),
    ).toHaveLength(0)
  })
})

describe("OrderSummary – shipping & tax branches", () => {
  it("renders shipping and tax rows when present", () => {
    render(<OrderSummary lineItems={items} shipping={5} tax={8} />)
    expect(screen.getByText("Shipping")).toBeInTheDocument()
    expect(screen.getByText("Tax")).toBeInTheDocument()
  })

  it("omits shipping and tax rows when absent", () => {
    render(<OrderSummary lineItems={items} />)
    expect(screen.queryByText("Shipping")).not.toBeInTheDocument()
    expect(screen.queryByText("Tax")).not.toBeInTheDocument()
  })

  it("renders shipping without tax, and tax without shipping", () => {
    const { rerender } = render(<OrderSummary lineItems={items} shipping={5} />)
    expect(screen.getByText("Shipping")).toBeInTheDocument()
    expect(screen.queryByText("Tax")).not.toBeInTheDocument()
    rerender(<OrderSummary lineItems={items} tax={8} />)
    expect(screen.getByText("Tax")).toBeInTheDocument()
    expect(screen.queryByText("Shipping")).not.toBeInTheDocument()
  })
})

describe("OrderSummary – empty state", () => {
  it("renders an empty hint and only the totals when lineItems is empty", () => {
    const { container } = render(<OrderSummary lineItems={[]} />)
    expect(
      container.querySelector("[data-slot='order-empty']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='order-items']"),
    ).not.toBeInTheDocument()
    const totalRow = container.querySelector(
      "[data-slot='order-total']",
    ) as HTMLElement
    expect(within(totalRow).getByText(money(0))).toBeInTheDocument()
  })
})

describe("OrderSummary – currency & locale", () => {
  it("formats amounts in USD / en-US by default", () => {
    const { container } = render(<OrderSummary lineItems={items} />)
    const totalRow = container.querySelector(
      "[data-slot='order-total']",
    ) as HTMLElement
    expect(
      within(totalRow).getByText(money(80, "en-US", "USD")),
    ).toBeInTheDocument()
  })

  it("formats amounts in a non-USD currency / locale", () => {
    const { container } = render(
      <OrderSummary lineItems={items} currency="EUR" locale="de-DE" />,
    )
    const totalRow = container.querySelector(
      "[data-slot='order-total']",
    ) as HTMLElement
    expect(
      within(totalRow).getByText(money(80, "de-DE", "EUR")),
    ).toBeInTheDocument()
  })
})

describe("OrderSummary – accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <OrderSummary
        lineItems={items}
        discounts={discounts}
        shipping={5}
        tax={8}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations in the empty state", async () => {
    const { container } = render(<OrderSummary lineItems={[]} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
