import * as React from "react"
import { render, screen, within, waitFor } from "@testing-library/react"
import { describe, it, expect, beforeAll } from "vitest"
import { axe } from "vitest-axe"
import { CustomerCard, type CustomerAddress } from "@/components/customer-card"

// AvatarImage (Base UI) renders null until the image fires a `load` event, which
// jsdom never does on its own. Override the `src` setter to dispatch it so the
// image branch actually mounts.
beforeAll(() => {
  Object.defineProperty(window.HTMLImageElement.prototype, "src", {
    configurable: true,
    set(value: string) {
      this.setAttribute("src", value)
      queueMicrotask(() => {
        this.dispatchEvent(new Event("load"))
      })
    },
  })
})

const fullAddress: CustomerAddress = {
  line1: "2417 Guadalupe St",
  line2: "Suite 210",
  city: "Austin",
  region: "TX",
  postalCode: "78705",
  country: "United States",
}

function getRoot(container: HTMLElement) {
  return container.querySelector("[data-slot='customer-card']") as HTMLElement
}

describe("CustomerCard – render", () => {
  it("renders without crashing and shows the name", () => {
    const { container } = render(<CustomerCard name="Maya Hernandez" />)
    expect(getRoot(container)).toBeInTheDocument()
    expect(screen.getByText("Maya Hernandez")).toBeInTheDocument()
  })

  it("merges a custom className onto the root card", () => {
    const { container } = render(
      <CustomerCard name="Maya Hernandez" className="custom-class" />,
    )
    expect(getRoot(container)).toHaveClass("custom-class")
  })

  it("forwards arbitrary props to the root card", () => {
    render(<CustomerCard name="Maya Hernandez" data-testid="cc" />)
    expect(screen.getByTestId("cc")).toHaveAttribute(
      "data-slot",
      "customer-card",
    )
  })
})

describe("CustomerCard – avatar", () => {
  it("renders initials fallback derived from the name when no image", () => {
    render(<CustomerCard name="Maya Hernandez" />)
    expect(screen.getByText("MH")).toBeInTheDocument()
  })

  it("derives initials from the first two words only", () => {
    render(<CustomerCard name="ana sofia del río" />)
    expect(screen.getByText("AS")).toBeInTheDocument()
  })

  it("derives a single initial for a one-word name", () => {
    render(<CustomerCard name="cher" />)
    expect(screen.getByText("C")).toBeInTheDocument()
  })

  it("renders the avatar image when an avatar url is provided", async () => {
    const { container } = render(
      <CustomerCard name="Maya Hernandez" avatar="https://img.test/maya.jpg" />,
    )
    await waitFor(() => {
      const img = container.querySelector(
        "[data-slot='avatar-image']",
      ) as HTMLImageElement | null
      expect(img).toBeInTheDocument()
      expect(img).toHaveAttribute("alt", "Maya Hernandez")
    })
  })

  it("renders no avatar image when no url is provided", () => {
    const { container } = render(<CustomerCard name="Maya Hernandez" />)
    expect(
      container.querySelector("[data-slot='avatar-image']"),
    ).not.toBeInTheDocument()
  })
})

describe("CustomerCard – email", () => {
  it("renders the email when present", () => {
    render(<CustomerCard name="Maya Hernandez" email="maya@example.com" />)
    expect(screen.getByText("maya@example.com")).toBeInTheDocument()
  })

  it("renders no email node when absent", () => {
    const { container } = render(<CustomerCard name="Maya Hernandez" />)
    expect(
      container.querySelector("[data-slot='customer-card-email']"),
    ).not.toBeInTheDocument()
  })
})

describe("CustomerCard – stats", () => {
  it("renders the orders count when provided", () => {
    const { container } = render(
      <CustomerCard name="Maya Hernandez" ordersCount={27} />,
    )
    const stats = container.querySelector(
      "[data-slot='customer-card-stats']",
    ) as HTMLElement
    expect(stats).toBeInTheDocument()
    expect(within(stats).getByText("Orders")).toBeInTheDocument()
    expect(within(stats).getByText("27")).toBeInTheDocument()
  })

  it("formats a large orders count with grouping for the locale", () => {
    render(<CustomerCard name="Maya Hernandez" ordersCount={12345} />)
    expect(screen.getByText("12,345")).toBeInTheDocument()
  })

  it("renders the lifetime spend formatted as currency when provided", () => {
    render(<CustomerCard name="Maya Hernandez" totalSpent={4821.5} />)
    expect(screen.getByText("Lifetime spend")).toBeInTheDocument()
    expect(screen.getByText("$4,821.50")).toBeInTheDocument()
  })

  it("respects a custom currency and locale", () => {
    render(
      <CustomerCard
        name="Maya Hernandez"
        totalSpent={1999.99}
        currency="EUR"
        locale="de-DE"
      />,
    )
    // de-DE EUR uses a non-breaking space + trailing symbol; match on the digits.
    expect(screen.getByText(/1\.999,99/)).toBeInTheDocument()
  })

  it("renders both stats side by side when both are provided", () => {
    render(
      <CustomerCard
        name="Maya Hernandez"
        ordersCount={27}
        totalSpent={4821.5}
      />,
    )
    expect(screen.getByText("Orders")).toBeInTheDocument()
    expect(screen.getByText("Lifetime spend")).toBeInTheDocument()
  })

  it("renders the orders stat for a zero count (defined, not absent)", () => {
    render(<CustomerCard name="Maya Hernandez" ordersCount={0} />)
    expect(screen.getByText("Orders")).toBeInTheDocument()
    expect(screen.getByText("0")).toBeInTheDocument()
  })

  it("renders no stats block when neither stat is provided", () => {
    const { container } = render(<CustomerCard name="Maya Hernandez" />)
    expect(
      container.querySelector("[data-slot='customer-card-stats']"),
    ).not.toBeInTheDocument()
  })

  it("renders the spend stat alone when only spend is provided", () => {
    render(<CustomerCard name="Maya Hernandez" totalSpent={10} />)
    expect(screen.queryByText("Orders")).not.toBeInTheDocument()
    expect(screen.getByText("Lifetime spend")).toBeInTheDocument()
  })
})

describe("CustomerCard – address", () => {
  it("renders every populated address line when a full address is provided", () => {
    const { container } = render(
      <CustomerCard name="Maya Hernandez" address={fullAddress} />,
    )
    const block = container.querySelector(
      "[data-slot='customer-card-address']",
    ) as HTMLElement
    expect(block).toBeInTheDocument()
    expect(within(block).getByText("2417 Guadalupe St")).toBeInTheDocument()
    expect(within(block).getByText("Suite 210")).toBeInTheDocument()
    expect(within(block).getByText("Austin, TX 78705")).toBeInTheDocument()
    expect(within(block).getByText("United States")).toBeInTheDocument()
  })

  it("drops blank parts and joins only what is present (partial address)", () => {
    const { container } = render(
      <CustomerCard
        name="Maya Hernandez"
        address={{ city: "Austin", country: "United States" }}
      />,
    )
    const block = container.querySelector(
      "[data-slot='customer-card-address']",
    ) as HTMLElement
    expect(within(block).getByText("Austin")).toBeInTheDocument()
    expect(within(block).getByText("United States")).toBeInTheDocument()
    expect(block.textContent).not.toContain(",")
  })

  it("joins city and region with a comma and appends the postal code", () => {
    const { container } = render(
      <CustomerCard
        name="Maya Hernandez"
        address={{ city: "Austin", region: "TX", postalCode: "78705" }}
      />,
    )
    const block = container.querySelector(
      "[data-slot='customer-card-address']",
    ) as HTMLElement
    expect(within(block).getByText("Austin, TX 78705")).toBeInTheDocument()
  })

  it("renders no address block when address is absent", () => {
    const { container } = render(<CustomerCard name="Maya Hernandez" />)
    expect(
      container.querySelector("[data-slot='customer-card-address']"),
    ).not.toBeInTheDocument()
  })

  it("renders no address block when address is an empty object", () => {
    const { container } = render(
      <CustomerCard name="Maya Hernandez" address={{}} />,
    )
    expect(
      container.querySelector("[data-slot='customer-card-address']"),
    ).not.toBeInTheDocument()
  })
})

describe("CustomerCard – location", () => {
  it("renders the location meta line when provided", () => {
    const { container } = render(
      <CustomerCard name="Maya Hernandez" location="Austin, United States" />,
    )
    const loc = container.querySelector(
      "[data-slot='customer-card-location']",
    ) as HTMLElement
    expect(loc).toBeInTheDocument()
    expect(loc).toHaveTextContent("Austin, United States")
  })

  it("renders no location meta line when absent", () => {
    const { container } = render(<CustomerCard name="Maya Hernandez" />)
    expect(
      container.querySelector("[data-slot='customer-card-location']"),
    ).not.toBeInTheDocument()
  })

  it("renders location even when no address is provided", () => {
    const { container } = render(
      <CustomerCard name="Maya Hernandez" location="Remote" />,
    )
    expect(
      container.querySelector("[data-slot='customer-card-address']"),
    ).not.toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='customer-card-location']"),
    ).toBeInTheDocument()
  })
})

describe("CustomerCard – accessibility", () => {
  it("has no axe violations in the minimal case", async () => {
    const { container } = render(<CustomerCard name="Maya Hernandez" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations with every section populated", async () => {
    const { container } = render(
      <CustomerCard
        name="Maya Hernandez"
        email="maya@example.com"
        ordersCount={27}
        totalSpent={4821.5}
        address={fullAddress}
        location="Austin, United States"
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
