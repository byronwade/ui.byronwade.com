import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SiteFooter } from "@/app/_components/chrome/site-footer"

describe("SiteFooter", () => {
  it("links to docs, browse, skins, and GitHub", () => {
    render(<SiteFooter />)

    const nav = screen.getByRole("navigation", { name: "Footer" })
    expect(nav).toBeInTheDocument()

    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs",
    )
    expect(screen.getByRole("link", { name: "Browse" })).toHaveAttribute(
      "href",
      "/catalog",
    )
    expect(screen.getByRole("link", { name: "Linear" })).toHaveAttribute(
      "href",
      "/linear",
    )
    expect(screen.getByRole("link", { name: "Polaris" })).toHaveAttribute(
      "href",
      "/polaris",
    )
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/byronwade/ui.byronwade.com",
    )
  })
})
