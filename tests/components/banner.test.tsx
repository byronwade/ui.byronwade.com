import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import { Banner, type BannerTone } from "@/components/banner"

const tones: BannerTone[] = ["info", "success", "warning", "critical"]

const toneSurface: Record<BannerTone, string> = {
  info: "bg-brand/10",
  success: "bg-success/10",
  warning: "bg-warning/10",
  critical: "bg-destructive/10",
}

const toneIconColor: Record<BannerTone, string> = {
  info: "text-brand",
  success: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
}

function getRoot(container: HTMLElement) {
  return container.querySelector("[data-slot='banner']") as HTMLElement
}

describe("Banner – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<Banner title="Hello">Body</Banner>)
    expect(getRoot(container)).toBeInTheDocument()
  })

  it("renders the title and body children", () => {
    render(<Banner title="A title">Some body copy</Banner>)
    expect(screen.getByText("A title")).toBeInTheDocument()
    expect(screen.getByText("Some body copy")).toBeInTheDocument()
  })

  it("renders without a title (body only)", () => {
    const { container } = render(<Banner>Just body</Banner>)
    expect(
      container.querySelector("[data-slot='banner-title']"),
    ).not.toBeInTheDocument()
    expect(screen.getByText("Just body")).toBeInTheDocument()
  })

  it("renders without a body (title only)", () => {
    const { container } = render(<Banner title="Title only" />)
    expect(screen.getByText("Title only")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='banner-body']"),
    ).not.toBeInTheDocument()
  })
})

describe("Banner – tones", () => {
  it("defaults to the info tone", () => {
    const { container } = render(<Banner title="Default" />)
    const root = getRoot(container)
    expect(root).toHaveAttribute("data-tone", "info")
    expect(root).toHaveClass("bg-brand/10")
    expect(root).toHaveAttribute("role", "status")
  })

  it.each(tones)("renders %s tone surface + icon color", (tone) => {
    const { container } = render(<Banner tone={tone} title={tone} />)
    const root = getRoot(container)
    expect(root).toHaveAttribute("data-tone", tone)
    expect(root).toHaveClass(toneSurface[tone])
    const icon = container.querySelector("[data-slot='banner-icon'] svg")
    expect(icon).toHaveClass(toneIconColor[tone])
  })
})

describe("Banner – role / a11y semantics", () => {
  it("uses role='alert' for the critical tone", () => {
    const { container } = render(<Banner tone="critical" title="Bad" />)
    expect(getRoot(container)).toHaveAttribute("role", "alert")
  })

  it.each(["info", "success", "warning"] as const)(
    "uses role='status' for the %s tone",
    (tone) => {
      const { container } = render(<Banner tone={tone} title={tone} />)
      expect(getRoot(container)).toHaveAttribute("role", "status")
    },
  )
})

describe("Banner – variant", () => {
  it("renders the prominent variant by default", () => {
    const { container } = render(<Banner title="Prominent" />)
    expect(getRoot(container)).toHaveClass("p-4")
  })

  it("renders the inline variant with lighter padding", () => {
    const { container } = render(<Banner variant="inline" title="Inline" />)
    const root = getRoot(container)
    expect(root).toHaveClass("py-2")
    expect(root).not.toHaveClass("p-4")
  })
})

describe("Banner – icon", () => {
  it("renders the default tonal icon", () => {
    const { container } = render(<Banner title="Has icon" />)
    expect(
      container.querySelector("[data-slot='banner-icon']"),
    ).toBeInTheDocument()
  })

  it("renders a custom icon override", () => {
    const { container } = render(
      <Banner title="Custom" icon={<span data-testid="custom-icon">!</span>} />,
    )
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='banner-icon'] svg"),
    ).not.toBeInTheDocument()
  })

  it("hides the icon when icon={false}", () => {
    const { container } = render(<Banner title="No icon" icon={false} />)
    expect(
      container.querySelector("[data-slot='banner-icon']"),
    ).not.toBeInTheDocument()
  })

  it("hides the icon when icon={null}", () => {
    const { container } = render(<Banner title="No icon" icon={null} />)
    expect(
      container.querySelector("[data-slot='banner-icon']"),
    ).not.toBeInTheDocument()
  })
})

describe("Banner – dismiss", () => {
  it("does not render a dismiss button by default", () => {
    const { container } = render(<Banner title="Static" />)
    expect(
      container.querySelector("[data-slot='banner-dismiss']"),
    ).not.toBeInTheDocument()
  })

  it("renders a dismiss button and fires onDismiss when clicked", async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Banner title="Closable" dismissible onDismiss={onDismiss} />)
    const button = screen.getByRole("button", { name: "Dismiss" })
    expect(button).toHaveAttribute("data-slot", "banner-dismiss")
    await user.click(button)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it("renders the dismiss button even without an onDismiss handler", async () => {
    const user = userEvent.setup()
    render(<Banner title="Closable" dismissible />)
    const button = screen.getByRole("button", { name: "Dismiss" })
    await user.click(button)
    expect(button).toBeInTheDocument()
  })
})

describe("Banner – actions", () => {
  it("renders an actions row and fires its handlers", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    const { container } = render(
      <Banner
        title="With actions"
        actions={
          <button type="button" onClick={onClick}>
            Do it
          </button>
        }
      />,
    )
    expect(
      container.querySelector("[data-slot='banner-actions']"),
    ).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: "Do it" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("does not render an actions row when no actions are passed", () => {
    const { container } = render(<Banner title="None" />)
    expect(
      container.querySelector("[data-slot='banner-actions']"),
    ).not.toBeInTheDocument()
  })
})

describe("Banner – passthrough", () => {
  it("merges a custom className while keeping base classes", () => {
    const { container } = render(
      <Banner className="custom-class" title="Merged" />,
    )
    const root = getRoot(container)
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("flex")
  })

  it("forwards arbitrary props to the root element", () => {
    render(<Banner data-testid="banner-root" title="Props" />)
    expect(screen.getByTestId("banner-root")).toHaveAttribute(
      "data-slot",
      "banner",
    )
  })
})

describe("Banner – accessibility", () => {
  it("has no axe violations (default)", async () => {
    const { container } = render(
      <Banner title="Accessible" dismissible onDismiss={() => {}}>
        Body copy here.
      </Banner>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it.each(tones)("has no axe violations for the %s tone", async (tone) => {
    const { container } = render(
      <Banner
        tone={tone}
        title={`${tone} title`}
        actions={
          <button type="button">Act</button>
        }
      >
        Body for {tone}.
      </Banner>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
