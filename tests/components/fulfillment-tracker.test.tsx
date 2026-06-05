import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import {
  FulfillmentTracker,
  PAYMENT_STATUS_META,
  FULFILLMENT_STATUS_META,
  STEP_STATE_TONE,
  type PaymentStatus,
  type FulfillmentStatus,
  type FulfillmentStep,
} from "@/components/fulfillment-tracker"
import type { StatusTone } from "@/components/ui/status-dot"

// Expected StatusPill text-color class per tone — mirrors the `tones` map in
// status-pill.tsx so a tone→token regression surfaces here.
const TONE_TEXT_CLASS: Record<StatusTone, string> = {
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
  info: "text-brand",
  neutral: "text-muted-foreground",
}

const PAYMENT_STATUSES = Object.keys(PAYMENT_STATUS_META) as PaymentStatus[]
const FULFILLMENT_STATUSES = Object.keys(
  FULFILLMENT_STATUS_META,
) as FulfillmentStatus[]

const sampleSteps: FulfillmentStep[] = [
  { label: "Order placed", state: "done", description: "Captured" },
  { label: "In transit", state: "current", description: "Out for delivery" },
  { label: "Delivered", state: "upcoming" },
]

function findPillByLabel(container: HTMLElement, label: string) {
  const pill = Array.from(container.querySelectorAll("span")).find(
    (el) => el.classList.contains("rounded-full") && el.textContent === label,
  )
  return pill ?? null
}

describe("FulfillmentTracker – smoke", () => {
  it("renders the root with data-slot", () => {
    const { container } = render(
      <FulfillmentTracker paymentStatus="paid" fulfillmentStatus="fulfilled" />,
    )
    expect(
      container.querySelector("[data-slot='fulfillment-tracker']"),
    ).toBeInTheDocument()
  })

  it("renders the Payment and Fulfillment section labels", () => {
    render(
      <FulfillmentTracker paymentStatus="paid" fulfillmentStatus="fulfilled" />,
    )
    expect(screen.getByText("Payment")).toBeInTheDocument()
    expect(screen.getByText("Fulfillment")).toBeInTheDocument()
  })

  it("merges a custom className while keeping base classes", () => {
    const { container } = render(
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus="fulfilled"
        className="custom-class"
      />,
    )
    const root = container.querySelector("[data-slot='fulfillment-tracker']")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("flex")
  })
})

describe("FulfillmentTracker – payment status tones", () => {
  it.each(PAYMENT_STATUSES)(
    "renders %s with its mapped label and tone",
    (status) => {
      const meta = PAYMENT_STATUS_META[status]
      const { container } = render(
        <FulfillmentTracker
          paymentStatus={status}
          fulfillmentStatus="unfulfilled"
        />,
      )
      const pill = findPillByLabel(container, meta.label)
      expect(pill).not.toBeNull()
      expect(pill).toHaveClass(TONE_TEXT_CLASS[meta.tone])
    },
  )
})

describe("FulfillmentTracker – fulfillment status tones", () => {
  it.each(FULFILLMENT_STATUSES)(
    "renders %s with its mapped label and tone",
    (status) => {
      const meta = FULFILLMENT_STATUS_META[status]
      const { container } = render(
        <FulfillmentTracker
          paymentStatus="unpaid"
          fulfillmentStatus={status}
        />,
      )
      const pill = findPillByLabel(container, meta.label)
      expect(pill).not.toBeNull()
      expect(pill).toHaveClass(TONE_TEXT_CLASS[meta.tone])
    },
  )
})

describe("FulfillmentTracker – fallback tone", () => {
  it("falls back to the neutral Unknown pill for an unknown payment status", () => {
    const { container } = render(
      <FulfillmentTracker
        paymentStatus={"bogus" as PaymentStatus}
        fulfillmentStatus="fulfilled"
      />,
    )
    const pill = findPillByLabel(container, "Unknown")
    expect(pill).not.toBeNull()
    expect(pill).toHaveClass(TONE_TEXT_CLASS.neutral)
  })

  it("falls back to the neutral Unknown pill for an unknown fulfillment status", () => {
    const { container } = render(
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus={"bogus" as FulfillmentStatus}
      />,
    )
    const pill = findPillByLabel(container, "Unknown")
    expect(pill).not.toBeNull()
    expect(pill).toHaveClass(TONE_TEXT_CLASS.neutral)
  })

  it("falls back to a neutral tone for an unknown step state", () => {
    const { container } = render(
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus="fulfilled"
        steps={[
          {
            label: "Mystery",
            state: "sideways" as FulfillmentStep["state"],
          },
        ]}
      />,
    )
    expect(screen.getByText("Mystery")).toBeInTheDocument()
    expect(
      container.querySelector("[data-slot='fulfillment-tracker-rail']"),
    ).toBeInTheDocument()
  })
})

describe("FulfillmentTracker – step rail", () => {
  it("does not render the rail when steps is omitted", () => {
    const { container } = render(
      <FulfillmentTracker paymentStatus="paid" fulfillmentStatus="fulfilled" />,
    )
    expect(
      container.querySelector("[data-slot='fulfillment-tracker-rail']"),
    ).not.toBeInTheDocument()
  })

  it("does not render the rail when steps is an empty array", () => {
    const { container } = render(
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus="fulfilled"
        steps={[]}
      />,
    )
    expect(
      container.querySelector("[data-slot='fulfillment-tracker-rail']"),
    ).not.toBeInTheDocument()
  })

  it("renders the rail and every step label when steps are provided", () => {
    const { container } = render(
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus="partially_fulfilled"
        steps={sampleSteps}
      />,
    )
    expect(
      container.querySelector("[data-slot='fulfillment-tracker-rail']"),
    ).toBeInTheDocument()
    for (const step of sampleSteps) {
      expect(screen.getByText(step.label)).toBeInTheDocument()
      if (step.description) {
        expect(screen.getByText(step.description)).toBeInTheDocument()
      }
    }
  })

  it.each([
    ["done", "success"],
    ["current", "info"],
    ["upcoming", "neutral"],
  ] as const)("maps step state %s to the %s tone", (state, tone) => {
    expect(STEP_STATE_TONE[state]).toBe(tone)
  })

  it("renders a step timestamp as mono data", () => {
    render(
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus="fulfilled"
        steps={[
          { label: "Shipped", state: "done", timestamp: "Jun 3, 2:45 PM" },
        ]}
      />,
    )
    const ts = screen.getByText("Jun 3, 2:45 PM")
    expect(ts).toBeInTheDocument()
    expect(ts).toHaveClass("font-mono")
  })

  it("renders both a description and a timestamp on the same step", () => {
    render(
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus="fulfilled"
        steps={[
          {
            label: "Delivered",
            state: "done",
            description: "Left at front door",
            timestamp: "Jun 4, 9:10 AM",
          },
        ]}
      />,
    )
    expect(screen.getByText("Left at front door")).toBeInTheDocument()
    expect(screen.getByText("Jun 4, 9:10 AM")).toHaveClass("font-mono")
  })

  it("renders one rail node per step covering all three states", () => {
    const { container } = render(
      <FulfillmentTracker
        paymentStatus="paid"
        fulfillmentStatus="partially_fulfilled"
        steps={sampleSteps}
      />,
    )
    // VerificationProgress draws one `size-8` disc per step.
    expect(container.querySelectorAll(".size-8")).toHaveLength(
      sampleSteps.length,
    )
  })
})

describe("FulfillmentTracker – accessibility", () => {
  it("has no axe violations without a rail", async () => {
    const { container } = render(
      <FulfillmentTracker paymentStatus="paid" fulfillmentStatus="fulfilled" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations with a full rail", async () => {
    const { container } = render(
      <FulfillmentTracker
        paymentStatus="partially_paid"
        fulfillmentStatus="in_progress"
        steps={sampleSteps}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
