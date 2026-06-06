import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { WatchMetaBar } from "@/components/watch-meta-bar"

describe("WatchMetaBar", () => {
  it("renders channel and engagement clusters", () => {
    const { container } = render(
      <WatchMetaBar
        channel={<div data-testid="channel">Channel</div>}
        engagement={<div data-testid="engagement">Engagement</div>}
      />,
    )
    expect(screen.getByTestId("channel")).toBeInTheDocument()
    expect(screen.getByTestId("engagement")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='watch-meta-bar-channel']"),
    ).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='watch-meta-bar-engagement']"),
    ).toBeInTheDocument()
  })

  it("merges a custom className on the root", () => {
    const { container } = render(
      <WatchMetaBar
        channel={<div />}
        engagement={<div />}
        className="custom"
      />,
    )
    expect(
      container.querySelector("[data-slot='watch-meta-bar']"),
    ).toHaveClass("custom")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <WatchMetaBar
        channel={<span>byronwade/ui</span>}
        engagement={<button type="button">Like</button>}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
