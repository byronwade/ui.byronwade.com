"use client"

import { addDays, startOfMonth, subDays } from "date-fns"

import {
  GanttFeatureItem,
  GanttFeatureList,
  GanttFeatureListGroup,
  GanttHeader,
  GanttMilestone,
  GanttProvider,
  GanttSidebar,
  GanttSidebarGroup,
  GanttSidebarItem,
  GanttTimeline,
  GanttToday,
  type GanttFeature,
} from "@/components/ui/gantt"

const monthStart = startOfMonth(new Date())

const features: GanttFeature[] = [
  {
    id: "1",
    name: "Design system",
    startAt: subDays(monthStart, 20),
    endAt: addDays(monthStart, 10),
    status: { id: "done", name: "Done", color: "bg-success" },
  },
  {
    id: "2",
    name: "API integration",
    startAt: addDays(monthStart, 5),
    endAt: addDays(monthStart, 35),
    status: { id: "in-progress", name: "In Progress", color: "bg-brand" },
  },
  {
    id: "3",
    name: "Beta launch",
    startAt: addDays(monthStart, 25),
    endAt: addDays(monthStart, 55),
    status: { id: "at-risk", name: "At Risk", color: "bg-warning" },
  },
]

// `readOnly` drops the drag handles for a clean presentation/dashboard view;
// bars are tinted by status and a milestone diamond marks a key date.
export default function Example() {
  return (
    <div className="h-[420px] w-full">
      <GanttProvider range="monthly" readOnly className="h-full border">
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
          <GanttMilestone
            date={addDays(monthStart, 35)}
            label="Public launch"
          />
          <GanttToday />
        </GanttTimeline>
      </GanttProvider>
    </div>
  )
}
