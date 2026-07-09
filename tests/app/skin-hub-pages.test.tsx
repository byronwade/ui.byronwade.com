import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import LinearSkinHubPage from "@/app/linear/page"
import PolarisSkinHubPage from "@/app/polaris/page"

describe("skin hub pages", () => {
  it("explains Linear Skin toggle and points at monorepo docs", () => {
    render(<LinearSkinHubPage />)

    expect(
      screen.getByRole("heading", { name: "Linear skin" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Skin toggle/i)).toBeInTheDocument()
    expect(screen.getByText(/npm run dev:linear/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Read monorepo docs" }),
    ).toHaveAttribute("href", "/docs/monorepo")
  })

  it("explains Polaris Skin toggle and points at monorepo docs", () => {
    render(<PolarisSkinHubPage />)

    expect(
      screen.getByRole("heading", { name: "Polaris skin" }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Skin toggle/i)).toBeInTheDocument()
    expect(screen.getByText(/npm run dev:polaris/i)).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Read monorepo docs" }),
    ).toHaveAttribute("href", "/docs/monorepo")
  })
})
