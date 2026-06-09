"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan"
import { Button } from "@/components/ui/button"
import { useDemoState } from "@/lib/demo-viewport"

// ---------------------------------------------------------------------------
// Step data sets
// ---------------------------------------------------------------------------

const normalSteps = [
  {
    id: "scan",
    label: "Scan the registry for affected components",
    done: true,
  },
  {
    id: "edit",
    label: "Update token references to follow --brand",
    done: true,
  },
  { id: "test", label: "Re-run the component test suite", done: false },
  { id: "build", label: "Rebuild the registry manifest", done: false },
]

const successSteps = normalSteps.map((s) => ({ ...s, done: true }))

// ---------------------------------------------------------------------------
// Skeleton sub-component — mirrors the step list layout
// ---------------------------------------------------------------------------

function PlanStepsSkeleton() {
  return (
    <ol aria-hidden="true" className="grid gap-2">
      {[0, 1, 2, 3].map((i) => (
        <li key={i} className="flex items-center gap-3">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton
            className="h-3.5 rounded-full"
            style={{ width: `${60 + i * 8}%` }}
          />
        </li>
      ))}
    </ol>
  )
}

// ---------------------------------------------------------------------------
// Step list sub-component — shared between normal/success/streaming
// ---------------------------------------------------------------------------

function PlanStepList({ steps }: { steps: typeof normalSteps }) {
  return (
    <ol className="grid gap-2 text-sm">
      {steps.map((step, index) => (
        <li className="flex items-center gap-3" key={step.id}>
          <span
            className={
              step.done
                ? "flex size-5 items-center justify-center rounded-full bg-success/15 font-mono text-xs text-success"
                : "flex size-5 items-center justify-center rounded-full bg-muted font-mono text-xs text-muted-foreground"
            }
          >
            {index + 1}
          </span>
          <span
            className={
              step.done
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  )
}

// ---------------------------------------------------------------------------
// Example
// ---------------------------------------------------------------------------

export default function Example() {
  const state = useDemoState() ?? "default"

  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"
  const isSuccess = state === "success"

  // loading state: use isStreaming + partial steps
  if (isLoading) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <Plan className="w-96" defaultOpen isStreaming>
          <PlanHeader>
            <div className="grid gap-1">
              <PlanTitle>Re-skin the design system</PlanTitle>
              <PlanDescription>
                Generating a plan to migrate the accent…
              </PlanDescription>
            </div>
            <PlanAction>
              <PlanTrigger />
            </PlanAction>
          </PlanHeader>
          <PlanContent>
            <PlanStepsSkeleton />
          </PlanContent>
          <PlanFooter className="justify-between">
            <span className="font-mono text-xs text-muted-foreground">
              — / — done
            </span>
          </PlanFooter>
        </Plan>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-96">
          <DemoEmptyState>No plan yet</DemoEmptyState>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <div className="w-96">
          <DemoErrorState>Couldn&apos;t load plan</DemoErrorState>
        </div>
      </div>
    )
  }

  // success: all steps complete
  if (isSuccess) {
    const doneCount = successSteps.length
    return (
      <div className="flex min-h-0 items-center justify-center bg-background p-8">
        <Plan className="w-96" defaultOpen>
          <PlanHeader>
            <div className="grid gap-1">
              <PlanTitle>Re-skin the design system</PlanTitle>
              <PlanDescription>
                All steps complete — design system re-skinned.
              </PlanDescription>
            </div>
            <PlanAction>
              <PlanTrigger />
            </PlanAction>
          </PlanHeader>
          <PlanContent>
            <PlanStepList steps={successSteps} />
          </PlanContent>
          <PlanFooter className="justify-between">
            <span className="font-mono text-xs text-success">
              {doneCount} / {doneCount} done
            </span>
          </PlanFooter>
        </Plan>
      </div>
    )
  }

  // default: normal plan with 2 done / 4 total
  const doneCount = normalSteps.filter((s) => s.done).length
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <Plan className="w-96" defaultOpen>
        <PlanHeader>
          <div className="grid gap-1">
            <PlanTitle>Re-skin the design system</PlanTitle>
            <PlanDescription>
              A 4-step plan to migrate the accent to a new brand color.
            </PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent>
          <PlanStepList steps={normalSteps} />
        </PlanContent>
        <PlanFooter className="justify-between">
          <span className="font-mono text-xs text-muted-foreground">
            {doneCount} / {normalSteps.length} done
          </span>
          <Button size="sm" variant="outline">
            Approve plan
          </Button>
        </PlanFooter>
      </Plan>
    </div>
  )
}
