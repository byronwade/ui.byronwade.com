import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { VolumeProfile } from "@/components/ui/volume-profile"
import { makeCandles } from "@/lib/market"

describe("VolumeProfile", () => {
  it("renders profile bars from candle data", () => {
    const { container } = render(
      <VolumeProfile data={makeCandles(12, { seed: 1 })} width={100} height={200} bins={8} />,
    )
    expect(container.querySelector('[data-slot="volume-profile"]')).toBeInTheDocument()
    expect(
      container.querySelectorAll('[data-slot="volume-profile-bar"]').length,
    ).toBeGreaterThan(0)
  })

  it("shows the point-of-control line by default", () => {
    const { container } = render(<VolumeProfile data={makeCandles(12, { seed: 1 })} />)
    expect(container.querySelector('[data-slot="volume-profile-poc"]')).toBeInTheDocument()
  })

  it("hides the point-of-control line when showPoc is false", () => {
    const { container } = render(
      <VolumeProfile data={makeCandles(12, { seed: 1 })} showPoc={false} />,
    )
    expect(container.querySelector('[data-slot="volume-profile-poc"]')).not.toBeInTheDocument()
  })

  it("renders an empty svg without crashing for no data", () => {
    const { container } = render(<VolumeProfile data={[]} />)
    expect(container.querySelector('[data-slot="volume-profile"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-slot="volume-profile-bar"]')).toHaveLength(0)
  })

  it("applies custom width and height", () => {
    const { container } = render(<VolumeProfile width={160} height={240} />)
    const svg = container.querySelector('[data-slot="volume-profile"]')
    expect(svg).toHaveAttribute("width", "160")
    expect(svg).toHaveAttribute("height", "240")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<VolumeProfile data={makeCandles(8, { seed: 2 })} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
