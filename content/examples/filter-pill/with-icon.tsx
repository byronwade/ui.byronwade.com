import { FilterPill } from "@/components/ui/filter-pill"
import {
  CalendarDots,
  MapPin,
  SlidersHorizontal,
  Tag,
  Users,
} from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-2 p-6">
      <FilterPill
        icon={<CalendarDots className="size-3.5 text-muted-foreground" />}
      >
        Date range
      </FilterPill>
      <FilterPill icon={<Tag className="size-3.5 text-muted-foreground" />}>
        Category
      </FilterPill>
      <FilterPill icon={<MapPin className="size-3.5 text-muted-foreground" />}>
        Location
      </FilterPill>
      <FilterPill icon={<Users className="size-3.5 text-muted-foreground" />}>
        Assignee
      </FilterPill>
      <FilterPill
        icon={<SlidersHorizontal className="size-3.5 text-muted-foreground" />}
      >
        More filters
      </FilterPill>
    </div>
  )
}
