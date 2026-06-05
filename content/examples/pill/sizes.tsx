import { Pill, PillIndicator } from "@/components/ui/pill"

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-8">
      <Pill size="sm">
        <PillIndicator variant="success" />
        Small
      </Pill>
      <Pill>
        <PillIndicator variant="success" />
        Default
      </Pill>
      <Pill size="lg">
        <PillIndicator variant="success" />
        Large
      </Pill>
    </div>
  )
}
