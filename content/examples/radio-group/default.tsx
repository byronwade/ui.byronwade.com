"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Example() {
  const [plan, setPlan] = useState("monthly")

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm font-medium">Billing cycle</p>
      <RadioGroup value={plan} onValueChange={setPlan}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="monthly" id="monthly" />
          <Label htmlFor="monthly">Monthly</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="yearly" id="yearly" />
          <Label htmlFor="yearly">Yearly</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="lifetime" id="lifetime" />
          <Label htmlFor="lifetime">Lifetime</Label>
        </div>
      </RadioGroup>
      <p className="text-sm text-muted-foreground">Selected: {plan}</p>
    </div>
  )
}
