"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Example() {
  const [value, setValue] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)

  const hasError = submitted && !value

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-64">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="role-select"
            className="text-sm font-medium leading-none"
          >
            Role <span className="text-destructive">*</span>
          </label>

          {/* aria-invalid drives the error ring via the trigger's className */}
          <Select
            value={value}
            onValueChange={(v) => {
              setValue(v ?? "")
              setSubmitted(false)
            }}
          >
            <SelectTrigger aria-invalid={hasError} id="role-select">
              <SelectValue placeholder="Select a role…" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Access level</SelectLabel>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {hasError && (
            <p className="text-xs text-destructive">
              Please select a role to continue.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background font-medium hover:opacity-90 transition-opacity"
        >
          Continue
        </button>
      </form>
    </div>
  )
}
