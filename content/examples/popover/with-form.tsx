"use client"

import { useState } from "react"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function Example() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [saved, setSaved] = useState<{ name: string; email: string } | null>(
    null,
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setSaved({ name, email })
    setOpen(false)
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setName("")
      setEmail("")
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger className="inline-flex items-center gap-1.5 rounded-full edge bg-background px-3 py-1.5 text-sm font-medium edge hover:bg-muted transition-colors">
          Edit profile
        </PopoverTrigger>
        <PopoverContent side="bottom" align="center" className="w-80">
          <PopoverHeader>
            <PopoverTitle>Edit profile</PopoverTitle>
            <PopoverDescription>
              Update your display name and email address.
            </PopoverDescription>
          </PopoverHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-1">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="profile-name"
                className="text-xs font-medium text-foreground"
              >
                Display name
              </label>
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                className="rounded-md edge bg-background px-2.5 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="profile-email"
                className="text-xs font-medium text-foreground"
              >
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@example.com"
                className="rounded-md edge bg-background px-2.5 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center rounded-full edge bg-background px-3 py-1 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:bg-primary/80 transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </PopoverContent>
      </Popover>

      {saved && (
        <p className="text-sm text-muted-foreground">
          Saved:{" "}
          <span className="font-medium text-foreground">{saved.name}</span> &lt;
          {saved.email}&gt;
        </p>
      )}
    </div>
  )
}
