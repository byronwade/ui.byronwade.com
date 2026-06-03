import { ActivityRing } from "@/components/ui/activity-ring";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <ActivityRing
        verdict
        segments={[
          { value: 820, label: "Delivered", tone: "success" },
          { value: 140, label: "Pending", tone: "warning" },
          { value: 60, label: "Failed", tone: "danger" },
        ]}
        centerLabel="messages"
      />
    </div>
  );
}
