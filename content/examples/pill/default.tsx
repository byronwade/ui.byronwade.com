import {
  Pill,
  PillIndicator,
  PillDelta,
  PillStatus,
} from "@/components/ui/pill"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      <Pill>
        <PillIndicator variant="success" pulse />
        Operational
      </Pill>
      <Pill>
        <PillIndicator variant="warning" />
        Degraded
      </Pill>
      <Pill>
        <PillStatus>
          <PillDelta delta={2.4} />
          Revenue
        </PillStatus>
        +2.4%
      </Pill>
      <Pill>
        <PillIndicator variant="error" />
        Down
      </Pill>
    </div>
  )
}
