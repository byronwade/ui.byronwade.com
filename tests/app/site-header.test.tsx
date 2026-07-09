import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { SiteHeader } from "@/app/_components/chrome/site-header"

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}))

vi.mock("@wrksz/themes/client", () => ({
  useTheme: () => ({
    theme: "light",
    resolvedTheme: "light",
    setTheme: vi.fn(),
  }),
}))

describe("SiteHeader", () => {
  it("includes Styleguide and Templates in primary nav", () => {
    render(<SiteHeader />)

    const nav = screen.getByRole("navigation", { name: "Primary" })
    expect(nav).toBeInTheDocument()

    expect(screen.getByRole("link", { name: "Styleguide" })).toHaveAttribute(
      "href",
      "/styleguide",
    )
    expect(screen.getByRole("link", { name: "Templates" })).toHaveAttribute(
      "href",
      "/templates",
    )
  })

  it("renders Home, Docs, and Browse destinations", () => {
    render(<SiteHeader />)

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/",
    )
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs",
    )
    expect(screen.getByRole("link", { name: "Browse" })).toHaveAttribute(
      "href",
      "/catalog",
    )
  })

  it("renders the skin toggle trigger", () => {
    render(<SiteHeader />)

    expect(
      screen.getByRole("button", { name: "Change skin" }),
    ).toBeInTheDocument()
  })

  it("renders search and theme controls", () => {
    render(<SiteHeader />)

    expect(screen.getByRole("button", { name: "Search" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Toggle theme" }),
    ).toBeInTheDocument()
  })
})
