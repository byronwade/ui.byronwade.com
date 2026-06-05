"use client"

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool"

export default function Example() {
  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        <Tool defaultOpen>
          <ToolHeader
            state="output-available"
            title="Search the web"
            type="tool-web_search"
          />
          <ToolContent>
            <ToolInput
              input={{
                query: "byronwade ui design system",
                top_k: 5,
              }}
            />
            <ToolOutput
              errorText={undefined}
              output={{
                results: [
                  { title: "byronwade/ui", url: "https://ui.byronwade.com" },
                  { title: "Design DNA", url: "https://ui.byronwade.com/docs" },
                ],
                took_ms: 412,
              }}
            />
          </ToolContent>
        </Tool>
      </div>
    </div>
  )
}
