import { FilterPill } from "@/components/ui/filter-pill";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2 p-6">
      <FilterPill>All time</FilterPill>
      <FilterPill>Today</FilterPill>
      <FilterPill>This week</FilterPill>
      <FilterPill>Last 7 days</FilterPill>
      <FilterPill>Last 30 days</FilterPill>
    </div>
  );
}
