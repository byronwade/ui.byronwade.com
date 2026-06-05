"use client"

import { addDays, startOfMonth, subDays } from "date-fns"

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

export default function Example() {
  return (
    <div className="h-[420px] w-full">
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
