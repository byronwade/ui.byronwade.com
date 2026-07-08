"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  SearchShell,
  type SearchFilter,
  type SearchResult,
} from "@/components/linear/search-shell"
import {
  WorkspaceFooterActions,
  WorkspaceShell,
} from "@/components/linear/workspace-shell"

const DESIGN_RESULTS: SearchResult[] = [
  {
    id: "init-1",
    type: "initiative",
    title: "AI UX Research Assistant",
    time: "1d",
  },
  {
    id: "AS-6",
    type: "issue",
    title: "Design analytics dashboard layout",
    time: "17h",
  },
  {
    id: "proj-1",
    type: "project",
    title: "User Insight & Behavior Analytics Dashboard",
    time: "9d",
  },
  {
    id: "AS-13",
    type: "issue",
    title: "Review design system tokens for dashboard",
    time: "2d",
  },
  {
    id: "doc-1",
    type: "document",
    title: "Product Document - User Insight & Behavior Analytics Dashboard",
    breadcrumb: "AI UX Research Assistant",
    time: "5d",
  },
]

export default function WorkspaceSearchPage() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [filter, setFilter] = React.useState<SearchFilter>("all")

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const initial = params.get("q")
    if (initial) setQuery(initial)
  }, [])

  const normalized = query.trim().toLowerCase()
  const results =
    normalized.length >= 3 && normalized !== "designnn"
      ? DESIGN_RESULTS.filter((result) => {
          const haystack = `${result.title} ${result.breadcrumb ?? ""}`.toLowerCase()
          return haystack.includes(normalized.replace(/n+$/, ""))
        })
      : []

  return (
    <WorkspaceShell
      activeNavId="inbox"
      showIssueTabs={false}
      onSearch={() => router.push("/workspace/search")}
      footer={
        <WorkspaceFooterActions
          onAsk={() => router.push("/workspace/ask")}
          onHistory={() => router.push("/workspace/ask")}
        />
      }
    >
      <SearchShell
        query={query}
        onQueryChange={setQuery}
        filter={filter}
        onFilterChange={setFilter}
        results={results}
        onClose={() => router.push("/workspace/ask")}
      />
    </WorkspaceShell>
  )
}
