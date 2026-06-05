import * as React from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { VariantPicker, type VariantOption } from "@/components/variant-picker"

const options: VariantOption[] = [
  { name: "Size", values: ["S", "M", "L"], unavailable: ["L"] },
  { name: "Color", values: ["Sand", "Slate", "Olive"] },
]

const root = (container: HTMLElement) =>
  container.querySelector("[data-slot='variant-picker']")

const groupFor = (name: string) => screen.getByRole("toolbar", { name })

describe("VariantPicker – smoke", () => {
  it("renders without crashing", () => {
    const { container } = render(<VariantPicker options={options} />)
    expect(root(container)).toBeInTheDocument()
  })

  it("renders one labelled toolbar per option", () => {
    render(<VariantPicker options={options} />)
    expect(groupFor("Size")).toBeInTheDocument()
    expect(groupFor("Color")).toBeInTheDocument()
  })

  it("renders a chip for every value across all options", () => {
    render(<VariantPicker options={options} />)
    for (const item of ["S", "M", "L", "Sand", "Slate", "Olive"]) {
      expect(screen.getByRole("button", { name: item })).toBeInTheDocument()
    }
  })

  it("exposes a data-slot on each option row", () => {
    const { container } = render(<VariantPicker options={options} />)
    expect(
      container.querySelectorAll("[data-slot='variant-picker-option']"),
    ).toHaveLength(2)
  })

  it("merges a custom className onto the root while keeping base classes", () => {
    const { container } = render(
      <VariantPicker className="custom-class" options={options} />,
    )
    expect(root(container)).toHaveClass("custom-class")
    expect(root(container)).toHaveClass("flex")
  })

  it("forwards arbitrary props to the root element", () => {
    render(<VariantPicker data-testid="vp" options={options} />)
    expect(screen.getByTestId("vp")).toHaveAttribute(
      "data-slot",
      "variant-picker",
    )
  })
})

describe("VariantPicker – selection", () => {
  it("selecting a value fires onChange with the merged record", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <VariantPicker
        options={options}
        defaultValue={{ Color: "Sand" }}
        onChange={onChange}
      />,
    )
    await user.click(
      within(groupFor("Size")).getByRole("button", { name: "M" }),
    )
    expect(onChange).toHaveBeenCalledWith({ Color: "Sand", Size: "M" })
  })

  it("does not throw when onChange is omitted", async () => {
    const user = userEvent.setup()
    render(<VariantPicker options={options} />)
    await user.click(
      within(groupFor("Size")).getByRole("button", { name: "S" }),
    )
    expect(
      within(groupFor("Size")).getByRole("button", { name: "S" }),
    ).toHaveAttribute("aria-pressed", "true")
  })

  it("clicking the active chip (deselect) is a no-op and does not clear the value", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <VariantPicker
        options={options}
        defaultValue={{ Size: "M" }}
        onChange={onChange}
      />,
    )
    const chip = within(groupFor("Size")).getByRole("button", { name: "M" })
    expect(chip).toHaveAttribute("aria-pressed", "true")
    await user.click(chip)
    expect(onChange).not.toHaveBeenCalled()
    expect(chip).toHaveAttribute("aria-pressed", "true")
  })
})

describe("VariantPicker – controlled", () => {
  it("reflects the controlled value as the pressed chip", () => {
    render(<VariantPicker options={options} value={{ Color: "Slate" }} />)
    expect(
      within(groupFor("Color")).getByRole("button", { name: "Slate" }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      within(groupFor("Color")).getByRole("button", { name: "Sand" }),
    ).toHaveAttribute("aria-pressed", "false")
  })

  it("does not update its own state when controlled (parent owns value)", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <VariantPicker
        options={options}
        value={{ Color: "Sand" }}
        onChange={onChange}
      />,
    )
    await user.click(
      within(groupFor("Color")).getByRole("button", { name: "Slate" }),
    )
    expect(onChange).toHaveBeenCalledWith({ Color: "Slate" })
    // Value is fixed by the parent, so the original chip stays pressed.
    expect(
      within(groupFor("Color")).getByRole("button", { name: "Sand" }),
    ).toHaveAttribute("aria-pressed", "true")
  })
})

describe("VariantPicker – uncontrolled", () => {
  it("starts from defaultValue and updates internal state on selection", async () => {
    const user = userEvent.setup()
    render(<VariantPicker options={options} defaultValue={{ Color: "Sand" }} />)
    expect(
      within(groupFor("Color")).getByRole("button", { name: "Sand" }),
    ).toHaveAttribute("aria-pressed", "true")
    await user.click(
      within(groupFor("Color")).getByRole("button", { name: "Olive" }),
    )
    expect(
      within(groupFor("Color")).getByRole("button", { name: "Olive" }),
    ).toHaveAttribute("aria-pressed", "true")
    expect(
      within(groupFor("Color")).getByRole("button", { name: "Sand" }),
    ).toHaveAttribute("aria-pressed", "false")
  })

  it("renders with no selection when neither value nor defaultValue is given", () => {
    render(<VariantPicker options={options} />)
    within(groupFor("Size"))
      .getAllByRole("button")
      .forEach((btn) => expect(btn).toHaveAttribute("aria-pressed", "false"))
  })
})

describe("VariantPicker – unavailable values", () => {
  it("disables values listed in unavailable and renders them struck through", () => {
    render(<VariantPicker options={options} />)
    const l = within(groupFor("Size")).getByRole("button", { name: "L" })
    expect(l).toBeDisabled()
    expect(l).toHaveClass("line-through")
  })

  it("selecting an unavailable value is a no-op", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<VariantPicker options={options} onChange={onChange} />)
    const l = within(groupFor("Size")).getByRole("button", { name: "L" })
    await user.click(l)
    expect(onChange).not.toHaveBeenCalled()
    expect(l).toHaveAttribute("aria-pressed", "false")
  })

  it("leaves values enabled when the option has no unavailable list", () => {
    render(<VariantPicker options={options} />)
    within(groupFor("Color"))
      .getAllByRole("button")
      .forEach((btn) => expect(btn).not.toBeDisabled())
  })
})

describe("VariantPicker – selected-value beside label", () => {
  it("shows the selected value beside the label when one is selected", () => {
    const { container } = render(
      <VariantPicker options={options} value={{ Size: "S" }} />,
    )
    const beside = container.querySelector(
      "[data-slot='variant-picker-selected']",
    )
    expect(beside).toBeInTheDocument()
    expect(beside).toHaveTextContent("S")
    expect(beside).toHaveClass("text-muted-foreground")
  })

  it("omits the beside-label adornment for options with no selection", () => {
    const { container } = render(
      <VariantPicker options={options} value={{ Size: "S" }} />,
    )
    // Only the Size option has a selection; Color shows no adornment.
    expect(
      container.querySelectorAll("[data-slot='variant-picker-selected']"),
    ).toHaveLength(1)
  })
})

describe("VariantPicker – accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <VariantPicker options={options} defaultValue={{ Size: "M" }} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
