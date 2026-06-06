/**
 * Tests for InputOTP (components/ui/input-otp.tsx).
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeAll, afterAll, describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub)
  document.elementFromPoint = vi.fn(() => null)
})

afterAll(() => {
  vi.unstubAllGlobals()
})

function SixDigitOtp(props: React.ComponentProps<typeof InputOTP>) {
  return (
    <InputOTP maxLength={6} {...props}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  )
}

describe("InputOTP — render", () => {
  it("renders the OTP root and six slots", () => {
    const { container } = render(<SixDigitOtp />)
    expect(container.querySelector('[data-slot="input-otp"]')).not.toBeNull()
    expect(container.querySelectorAll('[data-slot="input-otp-slot"]')).toHaveLength(6)
  })

  it("renders two groups and a separator", () => {
    const { container } = render(<SixDigitOtp />)
    expect(container.querySelectorAll('[data-slot="input-otp-group"]')).toHaveLength(2)
    expect(container.querySelector('[data-slot="input-otp-separator"]')).not.toBeNull()
    expect(screen.getByRole("separator")).toBeInTheDocument()
  })
})

describe("InputOTP — interaction", () => {
  it("calls onChange when value is set", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SixDigitOtp onChange={onChange} />)
    const input = document.querySelector('[data-slot="input-otp"]') as HTMLElement
    await user.click(input)
    await user.keyboard("1")
    expect(onChange).toHaveBeenCalled()
  })
})

describe("InputOTP — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<SixDigitOtp aria-label="One-time code" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
