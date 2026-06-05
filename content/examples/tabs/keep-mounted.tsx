"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Example() {
  const [inputValue, setInputValue] = useState("")

  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-2">
        <p className="text-xs text-muted-foreground">
          Switch tabs and come back — the input value is preserved because{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
            keepMounted
          </code>{" "}
          keeps the DOM node alive.
        </p>

        <Tabs defaultValue={0}>
          <TabsList>
            <TabsTrigger value={0}>Editor</TabsTrigger>
            <TabsTrigger value={1}>Preview</TabsTrigger>
            <TabsTrigger value={2}>History</TabsTrigger>
          </TabsList>

          {/* keepMounted — DOM node stays mounted while hidden */}
          <TabsContent
            value={0}
            keepMounted
            className="rounded-xl border p-4 space-y-2"
          >
            <label className="text-sm font-medium" htmlFor="editor-input">
              Draft content
            </label>
            <textarea
              id="editor-input"
              rows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Start typing…"
              className="w-full resize-none rounded-lg border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring/50"
            />
          </TabsContent>

          <TabsContent value={1} keepMounted className="rounded-xl border p-4">
            <p className="text-sm font-medium">Preview</p>
            <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
              {inputValue || "Nothing to preview yet."}
            </p>
          </TabsContent>

          <TabsContent value={2} keepMounted className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">
              No revision history yet.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
