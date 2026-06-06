"use client"

import { AlertCreateForm } from "@/components/alert-create-form"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-16">
      <AlertCreateForm symbol="AAPL" defaultTarget={190.25} />
    </div>
  )
}
