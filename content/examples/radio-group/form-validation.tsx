"use client"

import { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notification" },
]

export default function Example() {
  const [contact, setContact] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const hasError = submitted && !contact

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    if (contact) {
      // success — reset for demo
      setContact("")
      setSubmitted(false)
      alert(`Preference saved: ${contact}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6 max-w-xs">
      <div className="flex flex-col gap-2">
        <Label className={hasError ? "text-destructive" : ""}>
          Preferred contact method
        </Label>
        <RadioGroup
          value={contact}
          onValueChange={(v) => {
            setContact(v)
            if (submitted) setSubmitted(false)
          }}
          aria-invalid={hasError || undefined}
          className="gap-2"
        >
          {options.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem
                value={opt.value}
                id={`contact-${opt.value}`}
                aria-invalid={hasError || undefined}
              />
              <Label htmlFor={`contact-${opt.value}`}>{opt.label}</Label>
            </div>
          ))}
        </RadioGroup>
        {hasError && (
          <p className="text-sm text-destructive">
            Please select a contact method.
          </p>
        )}
      </div>

      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        Save preference
      </button>
    </form>
  )
}
