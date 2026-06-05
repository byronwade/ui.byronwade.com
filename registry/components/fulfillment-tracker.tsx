import * as React from "react"
import { StatusPill } from "@/components/status-pill"
import {
  VerificationProgress,
  type VerificationStep,
} from "@/components/verification-progress"
import { type StatusTone } from "@/components/ui/status-dot"
import { cn } from "@/lib/utils"

type PaymentStatus =
  | "paid"
  | "pending"
  | "partially_paid"
  | "refunded"
  | "partially_refunded"
  | "voided"
  | "unpaid"

type FulfillmentStatus =
  | "fulfilled"
  | "unfulfilled"
  | "partially_fulfilled"
  | "in_progress"
  | "on_hold"
  | "scheduled"

interface FulfillmentStep {
  label: string
  state: "done" | "current" | "upcoming"
  description?: string
  timestamp?: React.ReactNode
}

interface FulfillmentTrackerProps {
  paymentStatus: PaymentStatus
  fulfillmentStatus: FulfillmentStatus
  steps?: FulfillmentStep[]
  className?: string
}

// Status → tone + human label maps. Tones use the system StatusPill vocabulary
// (`success | warning | danger | info | neutral`, where `info` resolves to
// `--brand`), so paid/fulfilled read green, in-flight states read amber/brand,
// terminal-negative states read destructive, and inert states stay neutral.
// Never pin a literal colour — a consumer overriding `--brand`/`--success`
// re-skins every pill here for free.
const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { tone: StatusTone; label: string }
> = {
  paid: { tone: "success", label: "Paid" },
  pending: { tone: "warning", label: "Pending" },
  partially_paid: { tone: "warning", label: "Partially paid" },
  refunded: { tone: "danger", label: "Refunded" },
  partially_refunded: { tone: "danger", label: "Partially refunded" },
  voided: { tone: "danger", label: "Voided" },
  unpaid: { tone: "neutral", label: "Unpaid" },
}

const FULFILLMENT_STATUS_META: Record<
  FulfillmentStatus,
  { tone: StatusTone; label: string }
> = {
  fulfilled: { tone: "success", label: "Fulfilled" },
  unfulfilled: { tone: "neutral", label: "Unfulfilled" },
  partially_fulfilled: { tone: "warning", label: "Partially fulfilled" },
  in_progress: { tone: "info", label: "In progress" },
  on_hold: { tone: "warning", label: "On hold" },
  scheduled: { tone: "info", label: "Scheduled" },
}

// Step lifecycle → VerificationStep tone: completed reads success, the active
// step reads brand (`info`), everything ahead stays neutral.
const STEP_STATE_TONE: Record<FulfillmentStep["state"], StatusTone> = {
  done: "success",
  current: "info",
  upcoming: "neutral",
}

const FALLBACK_META = { tone: "neutral" as StatusTone, label: "Unknown" }

function FulfillmentTracker({
  paymentStatus,
  fulfillmentStatus,
  steps,
  className,
}: FulfillmentTrackerProps) {
  const payment = PAYMENT_STATUS_META[paymentStatus] ?? FALLBACK_META
  const fulfillment =
    FULFILLMENT_STATUS_META[fulfillmentStatus] ?? FALLBACK_META

  // VerificationProgress renders `description` as a child node, so a step's
  // timestamp (data → `font-mono` per the DNA) is folded into that slot beneath
  // any text description. `description` is typed `string` upstream but accepts a
  // node at runtime; the cast keeps the timestamp live rather than dead API.
  const railSteps: VerificationStep[] | undefined = steps?.map((step) => ({
    tone: STEP_STATE_TONE[step.state] ?? FALLBACK_META.tone,
    label: step.label,
    description:
      step.description !== undefined || step.timestamp !== undefined
        ? ((
            <>
              {step.description}
              {step.timestamp !== undefined && (
                <span className="font-mono text-[11px] text-muted-foreground">
                  {step.timestamp}
                </span>
              )}
            </>
          ) as unknown as string)
        : undefined,
  }))

  return (
    <div
      data-slot="fulfillment-tracker"
      className={cn("flex flex-col gap-5", className)}
    >
      <div
        data-slot="fulfillment-tracker-statuses"
        className="flex flex-wrap items-center gap-x-6 gap-y-3"
      >
        <div
          data-slot="fulfillment-tracker-payment"
          className="flex flex-col gap-1.5"
        >
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Payment
          </span>
          <StatusPill tone={payment.tone}>{payment.label}</StatusPill>
        </div>
        <div
          data-slot="fulfillment-tracker-fulfillment"
          className="flex flex-col gap-1.5"
        >
          <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
            Fulfillment
          </span>
          <StatusPill tone={fulfillment.tone}>{fulfillment.label}</StatusPill>
        </div>
      </div>

      {railSteps && railSteps.length > 0 && (
        <VerificationProgress
          data-slot="fulfillment-tracker-rail"
          steps={railSteps}
        />
      )}
    </div>
  )
}

export {
  FulfillmentTracker,
  PAYMENT_STATUS_META,
  FULFILLMENT_STATUS_META,
  STEP_STATE_TONE,
}
export type {
  FulfillmentTrackerProps,
  PaymentStatus,
  FulfillmentStatus,
  FulfillmentStep,
}
