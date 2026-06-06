import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { axe } from "vitest-axe"

import { WatchLayout, WatchLayoutTitle } from "@/components/watch-layout"

describe("WatchLayout", () => {
  it("renders the main column slots", () => {
    const { container } = render(
      <WatchLayout
        player={<div data-testid="player" />}
        title={<WatchLayoutTitle>My video</WatchLayoutTitle>}
        meta={<div data-testid="meta" />}
        description={<div data-testid="description" />}
        below={<div data-testid="below" />}
      />,
    )
    expect(screen.getByTestId("player")).toBeInTheDocument()
    expect(screen.getByText("My video")).toBeInTheDocument()
    expect(screen.getByTestId("meta")).toBeInTheDocument()
    expect(screen.getByTestId("description")).toBeInTheDocument()
    expect(screen.getByTestId("below")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='watch-layout-main']"),
    ).toBeInTheDocument()
  })

  it("renders the sidebar when provided", () => {
    const { container } = render(
      <WatchLayout
        player={<div />}
        sidebar={<div data-testid="sidebar" />}
      />,
    )
    expect(screen.getByTestId("sidebar")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='watch-layout-sidebar']"),
    ).toBeInTheDocument()
  })

  it("omits the sidebar when not provided", () => {
    const { container } = render(
      <WatchLayout player={<div />} title="Only main" />,
    )
    expect(
      container.querySelector("[data-slot='watch-layout-sidebar']"),
    ).toBeNull()
  })

  it("merges a custom className on the root", () => {
    const { container } = render(
      <WatchLayout player={<div />} className="custom" />,
    )
    expect(
      container.querySelector("[data-slot='watch-layout']"),
    ).toHaveClass("custom")
  })

  it("has no axe violations", async () => {
    const { container } = render(
      <WatchLayout
        player={<div aria-label="player">Player</div>}
        title={<WatchLayoutTitle>Accessible title</WatchLayoutTitle>}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
