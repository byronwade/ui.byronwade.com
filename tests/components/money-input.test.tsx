/**
 * Tests for <MoneyInput /> (components/ui/money-input.tsx) — a currency-formatted
 * price input composed from the Base UI number field. The focusable control is
 * labelled "Amount"; a leading symbol adornment is always present and a trailing
 * ISO-code adornment renders only when `showCurrencyCode` is set. We cover sizes,
 * symbol/code derivation, the symbol override, controlled value + change, the
 * disabled state, and a11y.
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "vitest-axe"

import { MoneyInput } from "@/components/ui/money-input"

const input = () => screen.getByLabelText("Amount")

describe("MoneyInput — render", () => {
  it("renders the root, symbol and control slots", () => {
    const { container } = render(<MoneyInput defaultValue={1234} />)
    expect(container.querySelector('[data-slot="money-input"]')).not.toBeNull()
    expect(
      container.querySelector('[data-slot="money-input-group"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="money-input-symbol"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('[data-slot="money-input-control"]'),
    ).not.toBeNull()
  })

  it("formats the value with two fraction digits", () => {
    render(<MoneyInput defaultValue={1234} />)
    expect(input()).toHaveDisplayValue("1,234.00")
  })

  it("uses token surfaces on the group", () => {
    const { container } = render(<MoneyInput defaultValue={1} />)
    expect(
      container.querySelector('[data-slot="money-input-group"]'),
    ).toHaveClass("border-input")
  })

  it("merges a passthrough className", () => {
    const { container } = render(
      <MoneyInput defaultValue={1} className="custom-money" />,
    )
    expect(
      container.querySelector('[data-slot="money-input-group"]'),
    ).toHaveClass("custom-money")
  })
})

describe("MoneyInput — sizes", () => {
  it("renders the sm size", () => {
    const { container } = render(<MoneyInput defaultValue={1} size="sm" />)
    expect(
      container.querySelector('[data-slot="money-input-group"]'),
    ).toHaveClass("h-7")
  })

  it("renders the default size", () => {
    const { container } = render(<MoneyInput defaultValue={1} size="default" />)
    expect(
      container.querySelector('[data-slot="money-input-group"]'),
    ).toHaveClass("h-8")
  })

  it("renders the lg size", () => {
    const { container } = render(<MoneyInput defaultValue={1} size="lg" />)
    expect(
      container.querySelector('[data-slot="money-input-group"]'),
    ).toHaveClass("h-9")
  })

  it("falls back to the default size when none is given", () => {
    const { container } = render(<MoneyInput defaultValue={1} />)
    expect(
      container.querySelector('[data-slot="money-input-group"]'),
    ).toHaveClass("h-8")
  })
})

describe("MoneyInput — currency derivation", () => {
  it("derives the USD symbol", () => {
    const { container } = render(<MoneyInput defaultValue={1} currency="USD" />)
    expect(
      container.querySelector('[data-slot="money-input-symbol"]'),
    ).toHaveTextContent("$")
  })

  it("derives the EUR symbol from currency + locale", () => {
    const { container } = render(
      <MoneyInput defaultValue={1} currency="EUR" locale="de-DE" />,
    )
    expect(
      container.querySelector('[data-slot="money-input-symbol"]'),
    ).toHaveTextContent("€")
  })

  it("honours the symbol override", () => {
    const { container } = render(
      <MoneyInput defaultValue={1} currency="USD" symbol="£" />,
    )
    expect(
      container.querySelector('[data-slot="money-input-symbol"]'),
    ).toHaveTextContent("£")
  })
})

describe("MoneyInput — currency code", () => {
  it("hides the ISO code by default", () => {
    const { container } = render(<MoneyInput defaultValue={1} currency="USD" />)
    expect(container.querySelector('[data-slot="money-input-code"]')).toBeNull()
  })

  it("shows the ISO code when showCurrencyCode is set", () => {
    const { container } = render(
      <MoneyInput defaultValue={1} currency="USD" showCurrencyCode />,
    )
    expect(
      container.querySelector('[data-slot="money-input-code"]'),
    ).toHaveTextContent("USD")
  })
})

describe("MoneyInput — interaction", () => {
  it("supports a controlled value", () => {
    render(<MoneyInput value={42} onValueChange={() => {}} />)
    expect(input()).toHaveDisplayValue("42.00")
  })

  it("fires onValueChange when the value changes", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<MoneyInput defaultValue={10} onValueChange={onValueChange} />)
    const el = input()
    await user.clear(el)
    await user.type(el, "55")
    await user.tab()
    expect(onValueChange).toHaveBeenCalled()
    expect(onValueChange).toHaveBeenCalledWith(
      expect.any(Number),
      expect.anything(),
    )
  })

  it("disables when disabled", () => {
    render(<MoneyInput defaultValue={1} disabled />)
    expect(input()).toBeDisabled()
  })
})

describe("MoneyInput — symbol derivation fallback", () => {
  it("falls back to the currency code when Intl yields no currency part", () => {
    // Valid currencies always emit a currency part, so stub formatToParts to
    // exercise the defensive `?? currency` fallback on the derived symbol.
    const spy = vi
      .spyOn(Intl.NumberFormat.prototype, "formatToParts")
      .mockReturnValue([{ type: "integer", value: "0" }])
    try {
      render(<MoneyInput defaultValue={1} currency="USD" />)
      expect(
        document.querySelector("[data-slot='money-input-symbol']")?.textContent,
      ).toBe("USD")
    } finally {
      spy.mockRestore()
    }
  })
})

describe("MoneyInput — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <MoneyInput defaultValue={1234} currency="USD" showCurrencyCode />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
