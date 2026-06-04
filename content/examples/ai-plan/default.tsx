"use client";

import { Button } from "@/components/ui/button";
import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanFooter,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/ai-elements/plan";

const steps = [
  { id: "scan", label: "Scan the registry for affected components", done: true },
  { id: "edit", label: "Update token references to follow --brand", done: true },
  { id: "test", label: "Re-run the component test suite", done: false },
  { id: "build", label: "Rebuild the registry manifest", done: false },
];

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
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
                    step.done ? "text-muted-foreground line-through" : "text-foreground"
                  }
                >
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </PlanContent>
        <PlanFooter className="justify-between">
          <span className="font-mono text-xs text-muted-foreground">2 / 4 done</span>
          <Button size="sm" variant="outline">
            Approve plan
          </Button>
        </PlanFooter>
      </Plan>
    </div>
  );
}
