"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm font-medium text-muted-foreground mb-1">
        Using Label component
      </p>

      <div className="flex items-center gap-2">
        <Checkbox id="marketing" defaultChecked />
        <Label htmlFor="marketing">Marketing emails</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="security" />
        <Label htmlFor="security">Security alerts</Label>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="updates" defaultChecked />
        <Label htmlFor="updates">Product updates</Label>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox id="terms" className="mt-0.5" />
        <Label htmlFor="terms" className="leading-snug">
          I have read and agree to the{" "}
          <span className="underline underline-offset-2 cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-2 cursor-pointer">
            Privacy Policy
          </span>
          .
        </Label>
      </div>
    </div>
  )
}
