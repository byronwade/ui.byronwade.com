import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { typesetClass } from "@/lib/design"
import { cn } from "@/lib/utils"

type MarkdownBodyProps = {
  source: string
  className?: string
  /** Frozen typeset preset — default docs. */
  preset?: "docs" | "chat" | "reading" | "compact"
}

/**
 * Rendered markdown under shadcn/typeset.
 * Do not restyle tags here — size / leading / flow live in app/typeset.css.
 * Only layout affordances (scroll-mt, wide table scroll) belong in components.
 */
const components: Components = {
  h2: ({ children }) => <h2 className="scroll-mt-24">{children}</h2>,
  table: ({ children }) => (
    <div className="typeset-scroll">
      <table>{children}</table>
    </div>
  ),
  input: () => null,
}

function MarkdownBody({
  source,
  className,
  preset = "docs",
}: MarkdownBodyProps) {
  return (
    <div
      data-slot="markdown-body"
      className={cn(typesetClass(preset), className)}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  )
}

export { MarkdownBody }
export type { MarkdownBodyProps }
