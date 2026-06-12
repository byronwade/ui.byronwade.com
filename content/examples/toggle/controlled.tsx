"use client"

import { useState } from "react"
import { Eye, EyeSlash } from "@/lib/icons"
import { Toggle } from "@/components/ui/toggle"

export default function Example() {
  const [pressed, setPressed] = useState(false)

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Toggle
        aria-label="Toggle visibility"
        variant="outline"
        pressed={pressed}
        onPressedChange={setPressed}
      >
        {pressed ? <Eye /> : <EyeSlash />}
        {pressed ? "Visible" : "Hidden"}
      </Toggle>

      <p className="text-sm text-muted-foreground">
        State:{" "}
        <span className="font-medium text-foreground">
          {pressed ? "on" : "off"}
        </span>
      </p>
    </div>
  )
}
