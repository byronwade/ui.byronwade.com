import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { axe } from "vitest-axe"

import TemplatesPage from "@/app/templates/page"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}))

async function renderPage() {
  return render(await TemplatesPage())
}

describe("TemplatesPage", () => {
  it("renders a coming soon page instead of the templates gallery", async () => {
    await renderPage()

    expect(
      screen.getByRole("heading", { name: /templates coming soon/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /read the docs/i }),
    ).toHaveAttribute("href", "/docs")
    expect(
      screen.getByRole("link", { name: /browse components/i }),
    ).toHaveAttribute("href", "/catalog")

    expect(screen.queryByText(/starter templates/i)).not.toBeInTheDocument()
    expect(
      screen.queryByText(/full website templates/i),
    ).not.toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = await renderPage()

    expect(await axe(container)).toHaveNoViolations()
  })

  it("uses a fixed viewport shell so the route does not need page scroll", async () => {
    const { container } = await renderPage()
    const main = container.querySelector("main")
    const section = container.querySelector("section")

    expect(main).toHaveClass("fixed", "inset-0", "h-dvh", "overflow-hidden")
    expect(main).not.toHaveClass("min-h-dvh")
    expect(section).toHaveClass("h-dvh")
    expect(section).not.toHaveClass("min-h-dvh")
    expect(screen.getByRole("complementary")).toHaveClass(
      "[@media(max-height:760px)]:hidden",
    )
    expect(screen.getByRole("list")).toHaveClass(
      "[@media(max-height:760px)]:hidden",
    )
  })
})
