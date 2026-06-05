import { ActivityRing } from "@/components/ui/activity-ring"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <ActivityRing
        segments={[
          { value: 1280, label: "Inbound" },
          { value: 740, label: "Outbound" },
        ]}
        centerLabel="interactions"
      />
    </div>
  )
}
