"use client"

import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card"

const articles = [
  {
    id: 1,
    title: "Understanding React Server Components",
    author: "Maya Patel",
    initials: "MP",
    date: "May 12, 2025",
    readTime: "8 min read",
    tags: ["React", "Next.js"],
    excerpt:
      "A deep dive into how RSCs change the mental model for building web applications at scale.",
  },
  {
    id: 2,
    title: "Type-Safe APIs with tRPC",
    author: "Jordan Lee",
    initials: "JL",
    date: "Apr 30, 2025",
    readTime: "5 min read",
    tags: ["TypeScript", "API"],
    excerpt:
      "End-to-end type safety from your database schema to your frontend components without code generation.",
  },
  {
    id: 3,
    title: "CSS Container Queries in 2025",
    author: "Sam Rivera",
    initials: "SR",
    date: "Mar 18, 2025",
    readTime: "4 min read",
    tags: ["CSS", "Design"],
    excerpt:
      "Container queries have landed everywhere. Here's how to actually use them in production.",
  },
]

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-2 p-12 w-full max-w-md mx-auto">
      <p className="self-start text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
        Recent articles
      </p>
      {articles.map((article) => (
        <HoverCard key={article.id}>
          <HoverCardTrigger className="w-full rounded-lg border border-border bg-background px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-muted cursor-pointer block">
            <span className="line-clamp-1">{article.title}</span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {article.author} &middot; {article.readTime}
            </span>
          </HoverCardTrigger>
          <HoverCardContent side="right" align="start" className="w-72">
            <div className="space-y-2.5">
              {/* Author row */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                  {article.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold leading-none">
                    {article.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {article.date}
                  </p>
                </div>
              </div>
              {/* Title & excerpt */}
              <div>
                <p className="text-sm font-semibold leading-snug">
                  {article.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
              {/* Tags */}
              <div className="flex gap-1.5 flex-wrap">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {article.readTime}
                </span>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}
