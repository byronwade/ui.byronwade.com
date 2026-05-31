import { FilterPill } from "@/components/ui/filter-pill";

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <FilterPill>Today</FilterPill>
      <FilterPill>This week</FilterPill>
    </div>
  );
}
