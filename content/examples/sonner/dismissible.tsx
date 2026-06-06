"use client"

import { useRef } from "react"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

export default function Example() {
  const toastIdRef = useRef<string | number | null>(null)

  return (
    <div className="flex flex-col items-start gap-3 p-8">
      <Toaster position="bottom-right" closeButton />

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast("Sticky notification, click × to close.", {
            duration: Infinity,
            dismissible: true,
          })
        }
      >
        Persistent (manual close)
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.info("This closes after 8 seconds.", {
            duration: 8000,
            closeButton: true,
          })
        }
      >
        Long duration (8s) with close button
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => {
          toastIdRef.current = toast.loading("Running background job…", {
            duration: Infinity,
          })
        }}
      >
        Start background job
      </button>

      <button
        className="rounded px-4 py-2 border border-border text-foreground"
        onClick={() => {
          if (toastIdRef.current !== null) {
            toast.success("Job completed!", { id: toastIdRef.current })
            toastIdRef.current = null
          }
        }}
      >
        Finish job (updates toast)
      </button>

      <button
        className="rounded px-4 py-2 border border-border text-foreground"
        onClick={() => toast.dismiss()}
      >
        Dismiss all
      </button>
    </div>
  )
}
