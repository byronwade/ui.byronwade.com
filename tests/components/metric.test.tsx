import { render, screen } from "@testing-library/react"
import { expect, describe, it } from "vitest"
import { axe } from "vitest-axe"
import { Activity } from "lucide-react"

import { DeltaPill, Metric } from "@/components/ui/metric"

describe("Metric", () => {
  it("renders label and value slots for the inline variant", () => {
    const { container } = render(<Metric label="Revenue" value="$48,295" />)

    const root = container.querySelector('[data-slot="metric"]') as HTMLElement
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute("data-variant", "inline")
    expect(root).toHaveClass("flex")
    expect(root).toHaveClass("flex-col")
    expect(root).toHaveClass("gap-1")

    expect(screen.getByText("Revenue")).toHaveAttribute(
      "data-slot",
      "metric-label",
    )
    expect(screen.getByText("$48,295")).toHaveAttribute(
      "data-slot",
      "metric-value",
    )
  })

  it("renders the card variant with hint, icon, and delta", () => {
    const { container } = render(
      <Metric
        variant="card"
        label="Active users"
        value="8,340"
        hint="vs. last 30 days"
        icon={Activity}
        delta={{ value: "+5.7%", direction: "up" }}
      />,
    )

    const root = container.querySelector('[data-slot="metric"]') as HTMLElement
    expect(root).toHaveAttribute("data-variant", "card")
    expect(root).toHaveClass("flex")
    expect(root).toHaveClass("flex-col")
    expect(root).toHaveClass("gap-1")
    expect(root).toHaveClass("rounded-2xl")
    expect(root).toHaveClass("bg-card")
    expect(root).toHaveClass("p-5")
    expect(root).toHaveClass("edge")

    const body = container.querySelector('[data-slot="metric-body"]')
    const hint = container.querySelector('[data-slot="metric-hint"]')
    const delta = container.querySelector('[data-slot="metric-delta"]')

    expect(body).toHaveClass("mt-2")
    expect(screen.getByText("Active users")).toBeInTheDocument()
    expect(screen.getByText("8,340")).toBeInTheDocument()
    expect(screen.getByText("vs. last 30 days")).toBeInTheDocument()
    expect(hint).toHaveClass("mt-1")
    expect(delta).toHaveClass("bg-success/10")
    expect(root.querySelector("svg")).toBeInTheDocument()
  })

  it("accepts ReactNode labels", () => {
    render(
      <Metric
        label={
          <>
            <span>Net</span>
            <span> revenue</span>
          </>
        }
        value="$12,400"
      />,
    )

    expect(screen.getByText("Net").closest('[data-slot="metric-label"]')).toHaveAttribute(
      "data-slot",
      "metric-label",
    )
    expect(screen.getByText("revenue")).toBeInTheDocument()
  })

  it("renders the compact variant with compact spacing and value scale", () => {
    const { container } = render(
      <Metric
        variant="compact"
        label="Errors"
        value="0"
        delta={{ value: "0.0%", direction: "flat" }}
      />,
    )

    const root = container.querySelector('[data-slot="metric"]') as HTMLElement
    expect(root).toHaveAttribute("data-variant", "compact")
    expect(root).toHaveClass("gap-0.5")
    expect(screen.getByText("Errors")).toHaveClass("text-xs")
    expect(screen.getByText("0")).toHaveClass("text-lg")
    expect(screen.getByText("0.0%")).toHaveAttribute(
      "data-slot",
      "metric-delta",
    )
  })

  it("renders DeltaPill tones for up, down, and flat directions", () => {
    const { container } = render(
      <div>
        <DeltaPill delta={{ value: "+12.4%", direction: "up" }} />
        <DeltaPill delta={{ value: "-2.1%", direction: "down" }} />
        <DeltaPill delta={{ value: "0.0%", direction: "flat" }} />
      </div>,
    )

    const up = screen.getByText("+12.4%")
    const down = screen.getByText("-2.1%")
    const flat = screen.getByText("0.0%")

    expect(up).toHaveClass("bg-success/10")
    expect(up).toHaveClass("text-success")
    expect(up.querySelector("svg")).toBeInTheDocument()

    expect(down).toHaveClass("bg-destructive/10")
    expect(down).toHaveClass("text-destructive")
    expect(down.querySelector("svg")).toBeInTheDocument()

    expect(flat).toHaveClass("bg-muted")
    expect(flat).toHaveClass("text-muted-foreground")
    expect(flat.querySelector("svg")).not.toBeInTheDocument()

    expect(container.querySelectorAll('[data-slot="metric-delta"]')).toHaveLength(
      3,
    )
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Metric
        variant="card"
        label="Conversion"
        value="3.8%"
        hint="rolling 7 day average"
        icon={Activity}
        delta={{ value: "+0.5%", direction: "up" }}
      />,
    )

    expect(await axe(container)).toHaveNoViolations()
  })
})
