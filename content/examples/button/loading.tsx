"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Send, Upload } from "lucide-react"

export default function Example() {
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  function handleSave() {
    setSaving(true)
    setTimeout(() => setSaving(false), 2000)
  }

  function handleUpload() {
    setUploading(true)
    setTimeout(() => setUploading(false), 2500)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Simulated async actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Send />
              Save
            </>
          )}
        </Button>

        <Button variant="outline" onClick={handleUpload} disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <Upload />
              Upload file
            </>
          )}
        </Button>
      </div>

      {/* Always-loading states (for static demo) */}
      <div className="flex flex-wrap items-center gap-3">
        <Button disabled>
          <Loader2 className="animate-spin" />
          Processing
        </Button>
        <Button variant="secondary" disabled>
          <Loader2 className="animate-spin" />
          Loading
        </Button>
        <Button size="icon" variant="outline" aria-label="Loading" disabled>
          <Loader2 className="animate-spin" />
        </Button>
      </div>

      <p className="text-muted-foreground text-sm">
        Loading state is composed with a spinner icon +{" "}
        <code className="text-xs bg-muted px-1 py-0.5 rounded">disabled</code>{" "}
        prop. Click the buttons above to trigger a 2-second simulated action.
      </p>
    </div>
  )
}
