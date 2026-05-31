import { FilterPill } from "@/components/ui/filter-pill";
import { CalendarDays } from "lucide-react";

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Enabled</p>
        <div className="flex flex-wrap gap-2">
          <FilterPill>Status</FilterPill>
          <FilterPill icon={<CalendarDays className="size-3.5 text-muted-foreground" />}>
            Date range
          </FilterPill>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Disabled</p>
        <div className="flex flex-wrap gap-2">
          <FilterPill disabled className="cursor-not-allowed opacity-50">
            Status
          </FilterPill>
          <FilterPill
            disabled
            className="cursor-not-allowed opacity-50"
            icon={<CalendarDays className="size-3.5 text-muted-foreground" />}
          >
            Date range
          </FilterPill>
        </div>
      </div>
    </div>
  );
}
