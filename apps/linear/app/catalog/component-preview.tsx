import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export function CategorySection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-8", className)}>
      <div>
        <h2 className="text-lg font-medium tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-10">{children}</div>
    </section>
  )
}

export function ComponentPreview({
  slug,
  name,
  children,
}: {
  slug: string
  name: string
  children: ReactNode
}) {
  return (
    <article id={slug} className="scroll-mt-28 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-medium tracking-tight">{name}</h3>
        <Badge variant="outline" className="font-mono text-[10px]">
          {slug}
        </Badge>
      </div>
      <div className="rounded-lg border border-border bg-card p-4 shadow-none">{children}</div>
    </article>
  )
}
