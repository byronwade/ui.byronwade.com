import { render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TemplatesShell } from "@/app/templates/templates-shell"

const pathname = vi.hoisted(() => ({ value: "/templates" }))

vi.mock("next/navigation", () => ({
  usePathname: () => pathname.value,
}))

describe("TemplatesShell", () => {
  it("does not wrap the templates index in a scrolling route shell", () => {
    render(
      <TemplatesShell>
        <main>Templates index</main>
      </TemplatesShell>,
    )

    expect(screen.getByText("Templates index")).toBeInTheDocument()
    expect(
      screen.queryByTestId("templates-route-shell"),
    ).not.toBeInTheDocument()
  })

  it("keeps the preview shell for template detail routes", () => {
    pathname.value = "/templates/dashboard"

    render(
      <TemplatesShell>
        <div>Template detail</div>
      </TemplatesShell>,
    )

    expect(screen.getByTestId("templates-route-shell")).toHaveClass(
      "overflow-auto",
      "pt-16",
    )
  })
})
