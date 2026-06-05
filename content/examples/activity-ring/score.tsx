import { ActivityRing } from "@/components/ui/activity-ring"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <ActivityRing value={78} label="Performance" />
    </div>
  )
}
