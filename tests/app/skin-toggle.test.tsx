import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it } from "vitest"

import { SkinToggle } from "@/app/_components/chrome/skin-toggle"

async function openSkinMenu(
  user: ReturnType<typeof userEvent.setup>,
): Promise<HTMLElement> {
  await user.click(screen.getByRole("button", { name: "Change skin" }))
  return waitFor(() => {
    const menu = document.querySelector(
      "[data-slot='dropdown-menu-content']",
    ) as HTMLElement | null
    expect(menu).not.toBeNull()
    return menu!
  })
}

describe("SkinToggle", () => {
  afterEach(() => {
    delete document.documentElement.dataset.skin
    localStorage.removeItem("skin")
  })

  it("renders the Change skin trigger", () => {
    render(<SkinToggle />)
    expect(
      screen.getByRole("button", { name: "Change skin" }),
    ).toBeInTheDocument()
  })

  it("lists Warm, Linear, and Polaris options", async () => {
    const user = userEvent.setup()
    render(<SkinToggle />)

    const menu = await openSkinMenu(user)

    expect(within(menu).getByText("Warm")).toBeInTheDocument()
    expect(within(menu).getByText("Linear")).toBeInTheDocument()
    expect(within(menu).getByText("Polaris")).toBeInTheDocument()
    expect(
      within(menu).getByText("byronwade — warm paper, one accent"),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText("Dark product OS — indigo accent, dense rows"),
    ).toBeInTheDocument()
    expect(
      within(menu).getByText("Shopify-inspired admin skin"),
    ).toBeInTheDocument()
  })

  it("applies Linear skin to documentElement and localStorage", async () => {
    const user = userEvent.setup()
    render(<SkinToggle />)

    const menu = await openSkinMenu(user)
    await user.click(within(menu).getByText("Linear"))

    expect(document.documentElement.dataset.skin).toBe("linear")
    expect(localStorage.getItem("skin")).toBe("linear")
  })

  it("clears skin when Warm is selected", async () => {
    document.documentElement.dataset.skin = "polaris"
    localStorage.setItem("skin", "polaris")

    const user = userEvent.setup()
    render(<SkinToggle />)

    const menu = await openSkinMenu(user)
    await user.click(within(menu).getByText("Warm"))

    expect(document.documentElement.dataset.skin).toBeUndefined()
    expect(localStorage.getItem("skin")).toBeNull()
  })
})
