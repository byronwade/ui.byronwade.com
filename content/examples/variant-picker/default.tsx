"use client"

import * as React from "react"

import { VariantPicker } from "@/components/variant-picker"

export default function Example() {
  const [value, setValue] = React.useState<Record<string, string>>({
    Size: "M",
    Color: "Sand",
  })

  return (
    <VariantPicker
      value={value}
      onChange={setValue}
      options={[
        { name: "Size", values: ["S", "M", "L"], unavailable: ["L"] },
        { name: "Color", values: ["Sand", "Slate", "Olive"] },
      ]}
    />
  )
}
