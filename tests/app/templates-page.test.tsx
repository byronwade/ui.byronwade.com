import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import TemplatesPage from "@/app/templates/page"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

function renderPage() {
  return render(<TemplatesPage />)
}

describe("TemplatesPage", () => {
  it("renders the templates gallery with starter screens", () => {
    renderPage()

    expect(
      screen.getByRole("heading", { name: /starter templates/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /pricing/i })).toHaveAttribute(
      "href",
      "/templates/pricing",
    )
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/templates/dashboard",
    )
    expect(screen.getByRole("link", { name: /settings/i })).toHaveAttribute(
      "href",
      "/templates/settings",
    )
  })

  it("has no axe violations", async () => {
    const { container } = renderPage()

    expect(await axe(container)).toHaveNoViolations()
  })
})
