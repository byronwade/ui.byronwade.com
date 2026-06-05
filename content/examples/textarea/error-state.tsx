"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"

const MAX_CHARS = 120

export default function Example() {
  const [value, setValue] = useState(
    "This is a very long piece of text that exceeds the allowed character limit for this field. Please shorten it before submitting your form to the server.",
  )

  const isInvalid = value.length > MAX_CHARS

  return (
    <div className="flex flex-col gap-2 p-6 max-w-md">
      <label htmlFor="bio" className="text-sm font-medium">
        Short bio
      </label>
      <Textarea
        id="bio"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-invalid={isInvalid}
        aria-describedby="bio-error"
        placeholder="Tell us about yourself…"
      />
      <div className="flex items-center justify-between">
        {isInvalid ? (
          <p id="bio-error" className="text-xs text-destructive">
            Bio must be {MAX_CHARS} characters or fewer.
          </p>
        ) : (
          <span />
        )}
        <p
          className={`text-xs ml-auto ${isInvalid ? "text-destructive" : "text-muted-foreground"}`}
        >
          {value.length} / {MAX_CHARS}
        </p>
      </div>
    </div>
  )
}
