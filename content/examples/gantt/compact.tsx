"use client"

import { addDays, startOfMonth, subDays } from "date-fns"

import {
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  type GanttFeature,
} from "@/components/ui/gantt"

const monthStart = startOfMonth(new Date())

const features: GanttFeature[] = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i + 1),
  name: [
    "Design system",
    "API integration",
    "Beta launch",
    "Docs",
    "Audit",
    "GA",
  ][i],
  startAt: addDays(monthStart, i * 8 - 20),
  endAt: addDays(monthStart, i * 8 + 10),
  status: {
    id: "s",
    name: "Status",
    color: [
      "bg-brand",
      "bg-secondary",
      "bg-warning",
      "bg-success",
      "bg-chart-4",
      "bg-brand",
    ][i],
  },
}))

// `density="compact"` tightens row height for dense, many-row roadmaps.
export default function Example() {
  return (
    <div className="h-[420px] w-full">
      <GanttProvider
        range="monthly"
        density="compact"
        className="h-full border"
      >
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
          <GanttToday />
        </GanttTimeline>
      </GanttProvider>
    </div>
  )
}
