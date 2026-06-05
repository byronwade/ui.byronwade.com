"use client"

import { useState } from "react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

const LINKS = ["Dashboard", "Projects", "Settings"] as const

export default function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" />}>
        Open menu
      </SheetTrigger>
      <SheetContent side="left" showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            The default close icon is hidden. Pick a destination or use the
            explicit close action below.
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2">
          {LINKS.map((label) => (
            <SheetClose
              key={label}
              render={<Button variant="ghost" className="justify-start" />}
            >
              {label}
            </SheetClose>
          ))}
        </nav>
        <SheetFooter>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
