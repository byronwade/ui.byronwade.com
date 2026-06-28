import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { Marker, MarkerContent, MarkerIcon, markerVariants } from "@/components/ui/marker"

const VARIANTS = ["default", "separator", "border"] as const

describe("Marker – variants", () => {
  it.each(VARIANTS)("renders %s variant", (variant) => {
    const { container } = render(
      <Marker variant={variant}>
        <MarkerContent>Status</MarkerContent>
      </Marker>,
    )
    expect(container.querySelector("[data-slot='marker']")).toBeInTheDocument()
    expect(screen.getByText("Status")).toBeInTheDocument()
  })

  it("renders icon slot", () => {
    const { container } = render(
      <Marker>
        <MarkerIcon>
          <span data-testid="icon">*</span>
        </MarkerIcon>
        <MarkerContent className="shimmer">Thinking…</MarkerContent>
      </Marker>,
    )
    expect(
      container.querySelector("[data-slot='marker-icon']"),
    ).toBeInTheDocument()
    expect(screen.getByTestId("icon")).toBeInTheDocument()
  })

  it("exports markerVariants helper", () => {
    expect(markerVariants({ variant: "border" })).toContain("border-b")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
