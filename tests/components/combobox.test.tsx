/**
 * Tests for Combobox (components/ui/combobox.tsx) — Base UI filterable select.
 */

import * as React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, afterAll, describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
]

function FrameworkCombobox({
  onValueChange,
}: {
  onValueChange?: (value: (typeof frameworks)[number] | null) => void
}) {
  return (
    <Combobox items={frameworks} onValueChange={onValueChange}>
      <ComboboxInput placeholder="Select framework…" aria-label="Framework" />
      <ComboboxContent>
        <ComboboxEmpty>No results.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub)
  Element.prototype.scrollIntoView = vi.fn()
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe("Combobox — render", () => {
  it("renders the input trigger", () => {
    render(<FrameworkCombobox />)
    expect(screen.getByPlaceholderText("Select framework…")).toBeInTheDocument()
  })

  it("popup content is not visible before opening", () => {
    render(<FrameworkCombobox />)
    expect(screen.queryByText("Next.js")).toBeNull()
  })
})

describe("Combobox — interaction", () => {
  it("opens the list when the input is clicked", async () => {
    const user = userEvent.setup()
    render(<FrameworkCombobox />)
    await user.click(screen.getByPlaceholderText("Select framework…"))
    expect(await screen.findByText("Next.js")).toBeInTheDocument()
    expect(screen.getByText("Remix")).toBeInTheDocument()
  })

  it("shows combobox content data-slots when open", async () => {
    const user = userEvent.setup()
    render(<FrameworkCombobox />)
    await user.click(screen.getByPlaceholderText("Select framework…"))
    await waitFor(() => {
      expect(document.querySelector('[data-slot="combobox-content"]')).not.toBeNull()
      expect(document.querySelector('[data-slot="combobox-list"]')).not.toBeNull()
      expect(document.querySelector('[data-slot="combobox-item"]')).not.toBeNull()
    })
  })

  it("selects an item on click", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<FrameworkCombobox onValueChange={onValueChange} />)
    await user.click(screen.getByPlaceholderText("Select framework…"))
    await user.click(await screen.findByText("Astro"))
    expect(onValueChange).toHaveBeenCalled()
  })
})

describe("Combobox — variants", () => {
  it("shows empty state when filter matches nothing", async () => {
    const user = userEvent.setup()
    render(<FrameworkCombobox />)
    const input = screen.getByPlaceholderText("Select framework…")
    await user.click(input)
    await user.type(input, "zzzznotfound")
    expect(await screen.findByText("No results.")).toBeInTheDocument()
  })

  it("renders grouped items with labels", async () => {
    const user = userEvent.setup()
    render(
      <Combobox items={frameworks}>
        <ComboboxInput placeholder="Grouped" aria-label="Grouped" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxGroup>
              <ComboboxLabel>Frameworks</ComboboxLabel>
              {(item) => (
                <ComboboxItem key={item.value} value={item}>
                  {item.label}
                </ComboboxItem>
              )}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    await user.click(screen.getByPlaceholderText("Grouped"))
    expect(await screen.findByText("Frameworks")).toBeInTheDocument()
    expect(document.querySelector('[data-slot="combobox-group"]')).not.toBeNull()
    expect(document.querySelector('[data-slot="combobox-label"]')).not.toBeNull()
  })

  it("renders clear affordance when enabled", () => {
    render(
      <Combobox items={frameworks} defaultValue={frameworks[0]}>
        <ComboboxInput
          placeholder="Clearable"
          aria-label="Clearable"
          showClear
        />
        <ComboboxContent>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    expect(document.querySelector('[data-slot="combobox-clear"]')).not.toBeNull()
  })

  it("renders chips multi-select affordance", () => {
    render(
      <Combobox items={frameworks} multiple>
        <ComboboxChips>
          <ComboboxChip value={frameworks[0]}>Next.js</ComboboxChip>
          <ComboboxChipsInput aria-label="Add framework" />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    expect(screen.getByText("Next.js")).toBeInTheDocument()
    expect(screen.getByLabelText("Add framework")).toBeInTheDocument()
  })

  it("uses a visible input fill on the chips surface", () => {
    const { container } = render(
      <Combobox items={frameworks} multiple>
        <ComboboxChips>
          <ComboboxChip value={frameworks[0]}>Next.js</ComboboxChip>
          <ComboboxChipsInput aria-label="Add framework" />
        </ComboboxChips>
        <ComboboxContent>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>,
    )
    const chips = container.querySelector('[data-slot="combobox-chips"]')
    expect(chips).toHaveClass("bg-input/30")
    expect(chips).not.toHaveClass("bg-transparent")
  })

  it("renders value, separator, and anchor helpers", async () => {
    const user = userEvent.setup()

    function AnchorProbe() {
      const anchorRef = useComboboxAnchor()
      return (
        <>
          <div ref={anchorRef} data-testid="combobox-anchor" />
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Filter" aria-label="Filter" />
            <ComboboxContent anchor={anchorRef}>
              <ComboboxList>
                <ComboboxGroup>
                  <ComboboxLabel>All</ComboboxLabel>
                  {(item) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxGroup>
                <ComboboxSeparator />
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </>
      )
    }

    render(
      <>
        <Combobox items={frameworks} defaultValue={frameworks[1]}>
          <ComboboxValue placeholder="Pick one" />
        </Combobox>
        <AnchorProbe />
      </>,
    )

    expect(screen.getByText("Remix")).toBeInTheDocument()
    expect(screen.getByTestId("combobox-anchor")).toBeInTheDocument()
    await user.click(screen.getByPlaceholderText("Filter"))
    await waitFor(() => {
      expect(document.querySelector('[data-slot="combobox-separator"]')).not.toBeNull()
    })
  })
})

describe("Combobox — accessibility", () => {
  it("closed combobox input has no axe violations", async () => {
    render(<FrameworkCombobox />)
    const input = screen.getByLabelText("Framework")
    expect(await axe(input)).toHaveNoViolations()
  })
})
