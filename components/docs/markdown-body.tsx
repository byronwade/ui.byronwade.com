import type { Components } from "react-markdown"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"

type MarkdownBodyProps = {
  source: string
  className?: string
}

const components: Components = {
  h1: ({ children }) => (
    <h1 className="text-[clamp(1.75rem,4vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.035em] text-foreground">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 scroll-mt-24 border-t border-border/80 pt-10 text-[clamp(1.35rem,2.5vw,1.75rem)] font-medium tracking-[-0.03em] text-foreground first:mt-0 first:border-t-0 first:pt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-lg font-medium tracking-tight text-foreground">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mt-4 text-[1.0625rem] leading-[1.65] tracking-tight text-foreground first:mt-0">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-brand underline-offset-4 transition-opacity hover:underline hover:opacity-80"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => (
    <strong className="font-medium text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="italic text-muted-foreground">{children}</em>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-brand/55 pl-4 text-muted-foreground">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-[1.0625rem] leading-relaxed text-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-[1.0625rem] leading-relaxed text-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  hr: () => <hr className="my-10 border-border/80" />,
  code: ({ className, children }) => {
    const isBlock = Boolean(className?.includes("language-"))
    if (isBlock) {
      return <code className={cn("font-mono text-[0.8125rem]", className)}>{children}</code>
    }
    return (
      <code className="rounded-lg bg-muted/60 px-1.5 py-0.5 font-mono text-[0.8125rem] text-foreground">
        {children}
      </code>
    )
  },
  pre: ({ children }) => (
    <pre className="mt-5 overflow-x-auto rounded-2xl bg-dock px-4 py-4 font-mono text-[0.8125rem] leading-relaxed text-dock-foreground edge md:px-5">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mt-6 -mx-1 overflow-x-auto px-1">
      <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border text-muted-foreground">{children}</thead>
  ),
  tbody: ({ children }) => <tbody className="divide-y divide-border/70">{children}</tbody>,
  tr: ({ children }) => <tr className="align-top">{children}</tr>,
  th: ({ children }) => (
    <th className="px-3 py-3 font-medium tracking-tight first:pl-0 last:pr-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-3 py-3 text-foreground first:pl-0 last:pr-0">{children}</td>
  ),
  input: () => null,
}

function MarkdownBody({ source, className }: MarkdownBodyProps) {
  return (
    <div data-slot="markdown-body" className={cn("reading-measure", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  )
}

export { MarkdownBody }
export type { MarkdownBodyProps }
