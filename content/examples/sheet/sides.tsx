"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const SIDES = ["top", "right", "bottom", "left"] as const

type Side = (typeof SIDES)[number]

export default function Example() {
  const [open, setOpen] = useState(false)
  const [side, setSide] = useState<Side>("right")

  function openSide(value: Side) {
    setSide(value)
    setOpen(true)
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-16">
      {SIDES.map((value) => (
        <Button
          key={value}
          variant="outline"
          className="capitalize"
          onClick={() => openSide(value)}
        >
          {value}
        </Button>
      ))}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle className="capitalize">{side} sheet</SheetTitle>
            <SheetDescription>
              This panel slides in from the {side} edge. Pick a different button
              to open it from another side.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  )
}
