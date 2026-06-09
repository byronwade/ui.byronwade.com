"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface Article {
  title: string
  excerpt: string
  author: string
  date: string
  readTime: string
}

const ARTICLE: Article = {
  title: "How to build accessible data tables",
  excerpt:
    "A deep dive into ARIA roles, keyboard navigation, and focus management for complex grid UIs.",
  author: "Morgan Ellis",
  date: "May 28, 2026",
  readTime: "6 min read",
}

function ArticleSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="flex items-center gap-2 mt-1">
        <Skeleton className="h-7 w-7 rounded-full" />
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="h-3.5 w-16" />
      </div>
    </div>
  )
}

function ArticleContent({ article }: { article: Article }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-base leading-snug">{article.title}</p>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {article.excerpt}
      </p>
      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{article.author}</span>
        <span>·</span>
        <span>{article.date}</span>
        <span>·</span>
        <span>{article.readTime}</span>
      </div>
    </div>
  )
}

export default function Example() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-80 rounded-xl edge bg-card p-5 edge">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-foreground">
          Featured Article
        </span>
        <button
          onClick={() => setLoading((v) => !v)}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          {loading ? "Skip loading" : "Reset"}
        </button>
      </div>

      {loading ? <ArticleSkeleton /> : <ArticleContent article={ARTICLE} />}
    </div>
  )
}
