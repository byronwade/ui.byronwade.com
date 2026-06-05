"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

export default function Example() {
  const [size, setSize] = useState("md")
  const [color, setColor] = useState("slate")

  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Horizontal inline layout */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Size</p>
        <RadioGroup
          value={size}
          onValueChange={setSize}
          className="flex flex-row flex-wrap gap-4 w-auto"
        >
          {["xs", "sm", "md", "lg", "xl"].map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <RadioGroupItem value={s} id={`size-${s}`} />
              <Label
                htmlFor={`size-${s}`}
                className="uppercase text-xs tracking-widest"
              >
                {s}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Color swatch layout */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Color</p>
        <RadioGroup
          value={color}
          onValueChange={setColor}
          className="flex flex-row gap-3 w-auto"
        >
          {[
            { value: "slate", bg: "bg-chart-1" },
            { value: "red", bg: "bg-chart-2" },
            { value: "amber", bg: "bg-chart-3" },
            { value: "emerald", bg: "bg-chart-4" },
            { value: "sky", bg: "bg-chart-5" },
          ].map(({ value, bg }) => (
            <label
              key={value}
              htmlFor={`color-${value}`}
              className="cursor-pointer"
            >
              <RadioGroupItem
                value={value}
                id={`color-${value}`}
                className="sr-only"
              />
              <span
                className={`block size-7 rounded-full ring-offset-2 transition-all ${bg} ${
                  color === value ? "ring-2 ring-foreground" : "ring-0"
                }`}
              />
            </label>
          ))}
        </RadioGroup>
        <p className="text-sm text-muted-foreground capitalize">
          Selected: {color}
        </p>
      </div>
    </div>
  )
}
