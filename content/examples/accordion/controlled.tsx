"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

const ITEMS = [
  {
    value: "step-1",
    label: "Step 1: Create an account",
    body: "Fill in your name, email address, and a strong password. You'll receive a verification link in your inbox.",
  },
  {
    value: "step-2",
    label: "Step 2: Verify your email",
    body: "Click the link we sent to your email. The link expires after 24 hours, request a new one if needed.",
  },
  {
    value: "step-3",
    label: "Step 3: Set up your profile",
    body: "Add an avatar, display name, and time zone so your teammates know who you are.",
  },
  {
    value: "step-4",
    label: "Step 4: Invite your team",
    body: "Send invitations by email. Invitees get a link to join your workspace directly.",
  },
]

export default function Example() {
  const [openItems, setOpenItems] = useState<string[]>(["step-1"])

  const expandAll = () => setOpenItems(ITEMS.map((i) => i.value))
  const collapseAll = () => setOpenItems([])

  return (
    <div className="mx-auto max-w-md py-10">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium">Onboarding guide</p>
        <div className="flex gap-2 text-xs">
          <button
            onClick={expandAll}
            className="rounded px-2 py-1 text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Expand all
          </button>
          <button
            onClick={collapseAll}
            className="rounded px-2 py-1 text-muted-foreground underline underline-offset-2 hover:text-foreground"
          >
            Collapse all
          </button>
        </div>
      </div>

      <Accordion
        multiple
        value={openItems}
        onValueChange={(val) => setOpenItems(val as string[])}
      >
        {ITEMS.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{item.label}</AccordionTrigger>
            <AccordionContent>
              <p>{item.body}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <p className="mt-4 text-xs text-muted-foreground">
        Currently open: {openItems.length > 0 ? openItems.join(", ") : "none"}
      </p>
    </div>
  )
}
