"use client"

import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"

function fakeUpload(): Promise<{ filename: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve({ filename: "report-2024.pdf" })
      } else {
        reject(new Error("Network timeout"))
      }
    }, 2000)
  })
}

function fakeSave(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1500))
}

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-3 p-8">
      <Toaster position="bottom-right" />

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.promise(fakeUpload, {
            loading: "Uploading file…",
            success: (data) => `"${data.filename}" uploaded successfully.`,
            error: "Upload failed. Please try again.",
          })
        }
      >
        Promise (may fail)
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() =>
          toast.promise(fakeSave, {
            loading: "Saving changes…",
            success: "All changes saved.",
            error: "Failed to save changes.",
            description: "Your progress is being persisted.",
          })
        }
      >
        Promise with description
      </button>

      <button
        className="rounded px-4 py-2 bg-primary text-primary-foreground"
        onClick={() => {
          const promise = new Promise<{ count: number }>((resolve) =>
            setTimeout(() => resolve({ count: 42 }), 2000),
          )
          toast.promise(promise, {
            loading: "Processing records…",
            success: (data) => ({
              message: `Processed ${data.count} records.`,
              description: "The batch job completed without errors.",
            }),
            error: "Batch job failed.",
          })
        }}
      >
        Promise with extended result
      </button>
    </div>
  )
}
