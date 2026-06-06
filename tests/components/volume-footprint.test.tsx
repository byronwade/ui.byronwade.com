import * as React from "react"
import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { VolumeFootprint } from "@/components/ui/volume-footprint"
import { makeFootprintRows } from "@/lib/market"

describe("VolumeFootprint", () => {
  it("renders bid and ask bars", () => {
    const { container } = render(
      <VolumeFootprint rows={makeFootprintRows(8, { seed: 1 })} width={160} height={200} />,
    )
    expect(container.querySelector('[data-slot="volume-footprint"]')).toBeInTheDocument()
    expect(container.querySelectorAll('[data-slot="volume-footprint-bid"]').length).toBe(8)
    expect(container.querySelectorAll('[data-slot="volume-footprint-ask"]').length).toBe(8)
  })

  it("shows the midline by default", () => {
    const { container } = render(<VolumeFootprint rows={makeFootprintRows(4, { seed: 1 })} />)
    expect(container.querySelector('[data-slot="volume-footprint-midline"]')).toBeInTheDocument()
  })

  it("hides the midline when showMidline is false", () => {
    const { container } = render(
      <VolumeFootprint rows={makeFootprintRows(4, { seed: 1 })} showMidline={false} />,
    )
    expect(container.querySelector('[data-slot="volume-footprint-midline"]')).not.toBeInTheDocument()
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<VolumeFootprint rows={makeFootprintRows(6, { seed: 2 })} />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
