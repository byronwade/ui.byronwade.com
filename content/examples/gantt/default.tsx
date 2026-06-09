"use client"

import { addDays, startOfMonth, subDays } from "date-fns"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import {
  GanttCreateMarkerTrigger,
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMarker,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  type GanttFeature,
} from "@/components/ui/gantt"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const today = new Date()
const monthStart = startOfMonth(today)

const features: GanttFeature[] = [
  {
    id: "1",
    name: "Design system",
    startAt: subDays(monthStart, 20),
    endAt: addDays(monthStart, 10),
    status: { id: "in-progress", name: "In Progress", color: "bg-brand" },
  },
  {
    id: "2",
    name: "API integration",
    startAt: addDays(monthStart, 5),
    endAt: addDays(monthStart, 35),
    status: { id: "planned", name: "Planned", color: "bg-secondary" },
  },
  {
    id: "3",
    name: "Beta launch",
    startAt: addDays(monthStart, 25),
    endAt: addDays(monthStart, 55),
    status: { id: "at-risk", name: "At Risk", color: "bg-warning" },
  },
]

const skeletonRows = 3

function GanttSkeleton() {
  return (
    <div aria-hidden="true" className="h-[420px] w-full">
      <div className="flex h-full overflow-hidden rounded-sm border bg-secondary">
        {/* sidebar skeleton */}
        <div className="w-[300px] shrink-0 border-r border-border/50 bg-background/90">
          {/* sidebar header */}
          <div
            className="flex items-end justify-between border-b border-border/50 px-2.5 py-2.5"
            style={{ height: 60 }}
          >
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
          </div>
          {/* sidebar group label */}
          <div className="px-2.5 py-2.5" style={{ height: 40 }}>
            <Skeleton className="h-3 w-20" />
          </div>
          {/* sidebar rows */}
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 border-t border-border/50 px-2.5"
              style={{ height: 40 }}
            >
              <Skeleton className="size-2 shrink-0 rounded-full" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-16 shrink-0" />
            </div>
          ))}
        </div>
        {/* timeline skeleton */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* header row */}
          <div
            className="flex items-center gap-px border-b border-border/50 px-4"
            style={{ height: 60 }}
          >
            <Skeleton className="h-3 w-24" />
          </div>
          {/* bar rows */}
          {Array.from({ length: skeletonRows }).map((_, i) => (
            <div
              key={i}
              className="flex items-center border-t border-border/50 px-4"
              style={{ height: 40 }}
            >
              <Skeleton
                className={cn(
                  "h-7 rounded-md",
                  i === 0 && "ml-0 w-[38%]",
                  i === 1 && "ml-[16%] w-[44%]",
                  i === 2 && "ml-[48%] w-[44%]",
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isLoading) {
    return <GanttSkeleton />
  }

  if (isEmpty) {
    return (
      <div className="h-[420px] w-full">
        <DemoEmptyState className="h-full">No tasks scheduled</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-[420px] w-full">
        <DemoErrorState className="h-full">
          Couldn&apos;t load schedule
        </DemoErrorState>
      </div>
    )
  }

  // default + success: render the real gantt
  return (
    <div
      aria-busy={false}
      data-state={state}
      className={cn(
        "h-[420px] w-full",
        state === "success" && "ring-1 ring-success/30 rounded-sm",
      )}
    >
      <GanttProvider range="monthly" zoom={100} className="h-full border">
        <GanttSidebar>
          <GanttSidebarGroup name="Roadmap">
            {features.map((feature) => (
              <GanttSidebarItem feature={feature} key={feature.id} />
            ))}
          </GanttSidebarGroup>
        </GanttSidebar>
        <GanttTimeline>
          <GanttHeader />
          <GanttFeatureList>
            <GanttFeatureListGroup>
              {features.map((feature) => (
                <GanttFeatureItem {...feature} key={feature.id} />
              ))}
            </GanttFeatureListGroup>
          </GanttFeatureList>
          <GanttMarker
            id="m1"
            date={addDays(monthStart, 15)}
            label="Milestone"
          />
          <GanttToday />
          <GanttCreateMarkerTrigger onCreateMarker={() => {}} />
        </GanttTimeline>
      </GanttProvider>
    </div>
  )
}
