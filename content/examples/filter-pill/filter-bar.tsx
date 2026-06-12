"use client"

import * as React from "react"
import { FilterPill } from "@/components/ui/filter-pill"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ArrowCounterClockwise, CalendarDots, Tag, Users } from "@/lib/icons"

const STATUSES = ["Any status", "Active", "Draft", "Archived", "Paused"]
const ASSIGNEES = [
  "Anyone",
  "Alice Chen",
  "Bob Martinez",
  "Carol Kim",
  "David Lee",
]
const DATE_RANGES = [
  "All time",
  "Today",
  "This week",
  "This month",
  "Last quarter",
]

export default function Example() {
  const [status, setStatus] = React.useState("Any status")
  const [assignee, setAssignee] = React.useState("Anyone")
  const [range, setRange] = React.useState("This week")

  const isFiltered =
    status !== "Any status" || assignee !== "Anyone" || range !== "This week"

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <FilterPill
                icon={<Tag className="size-3.5 text-muted-foreground" />}
              >
                {status}
              </FilterPill>
            }
          />
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUSES.map((s) => (
              <DropdownMenuItem key={s} onClick={() => setStatus(s)}>
                {s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <FilterPill
                icon={<Users className="size-3.5 text-muted-foreground" />}
              >
                {assignee}
              </FilterPill>
            }
          />
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Assignee</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ASSIGNEES.map((a) => (
              <DropdownMenuItem key={a} onClick={() => setAssignee(a)}>
                {a}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <FilterPill
                icon={
                  <CalendarDots className="size-3.5 text-muted-foreground" />
                }
              >
                {range}
              </FilterPill>
            }
          />
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Date range</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {DATE_RANGES.map((r) => (
              <DropdownMenuItem key={r} onClick={() => setRange(r)}>
                {r}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isFiltered && (
          <button
            type="button"
            onClick={() => {
              setStatus("Any status")
              setAssignee("Anyone")
              setRange("This week")
            }}
            className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 outline-none"
          >
            <ArrowCounterClockwise className="size-3.5" />
            Reset
          </button>
        )}
      </div>

      {isFiltered && (
        <p className="text-xs text-muted-foreground">
          Filtering by: <span className="text-foreground">{status}</span> ·{" "}
          <span className="text-foreground">{assignee}</span> ·{" "}
          <span className="text-foreground">{range}</span>
        </p>
      )}
    </div>
  )
}
