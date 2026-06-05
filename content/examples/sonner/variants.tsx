"use client"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-3 p-8">
      <Toaster position="bottom-right" />

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast("New message received.")}
      >
        Default
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.success("Payment processed successfully.")}
      >
        Success
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.error("Unable to connect to the server.")}
      >
        Error
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.info("Your session will expire in 5 minutes.")}
      >
        Info
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.warning("Storage is nearly full (95%).")}
      >
        Warning
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => toast.loading("Syncing data…")}
      >
        Loading
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.message("Scheduled maintenance tonight at 11 PM.", {
            description: "Expect up to 30 minutes of downtime.",
          })
        }
      >
        Message
      </button>
    </div>
  )
}
