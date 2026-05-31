"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const plans = [
  {
    value: "starter",
    label: "Starter",
    description: "Up to 5 users. Good for small teams just getting started.",
    price: "Free",
  },
  {
    value: "pro",
    label: "Pro",
    description: "Up to 50 users. Includes analytics and priority support.",
    price: "$12 / mo",
  },
  {
    value: "business",
    label: "Business",
    description: "Unlimited users, SSO, audit logs, and SLA.",
    price: "$49 / mo",
  },
];

export default function Example() {
  const [selected, setSelected] = useState("pro");

  return (
    <div className="flex flex-col gap-4 p-6 max-w-sm">
      <p className="text-sm font-medium">Choose a plan</p>
      <RadioGroup value={selected} onValueChange={setSelected} className="gap-3">
        {plans.map((plan) => (
          <label
            key={plan.value}
            htmlFor={`plan-${plan.value}`}
            className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 hover:bg-muted/40 transition-colors has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/5"
          >
            <RadioGroupItem value={plan.value} id={`plan-${plan.value}`} className="mt-0.5 shrink-0" />
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor={`plan-${plan.value}`} className="cursor-pointer font-medium leading-none">
                  {plan.label}
                </Label>
                <span className="text-sm font-semibold">{plan.price}</span>
              </div>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
