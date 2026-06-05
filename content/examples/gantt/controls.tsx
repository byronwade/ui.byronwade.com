"use client";

import { addDays, startOfMonth, subDays } from "date-fns";

import {
  GanttControls,
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
} from "@/components/ui/gantt";

const monthStart = startOfMonth(new Date());

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
];

// <GanttControls /> drives the timescale (Day/Month/Quarter) and zoom live. It
// reads/writes the provider through context, so it sits inside <GanttProvider />
// as a sticky, full-width toolbar.
export default function Example() {
  return (
    <div className="h-[420px] w-full">
      <GanttProvider range="monthly" zoom={100} className="h-full border">
        <div className="sticky top-0 left-0 z-30 col-[1/-1] flex items-center justify-between gap-2 border-border border-b bg-background/90 px-3 py-2 backdrop-blur">
          <span className="font-mono text-muted-foreground text-xs">Roadmap</span>
          <GanttControls />
        </div>
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
  );
}
