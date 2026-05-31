import { TimelineRail } from "@/components/timeline-rail";

export default function Example() {
  return (
    <div className="max-w-xs p-6">
      <TimelineRail
        groups={[
          {
            label: "Today",
            items: [
              { title: "Account created", meta: "2m" },
              { title: "Profile completed", meta: "1m" },
              { title: "First project added", meta: "30s" },
            ],
          },
          {
            label: "Yesterday",
            items: [
              { title: "Invited a team member", meta: "4m" },
              { title: "Uploaded logo", meta: "2m" },
            ],
          },
        ]}
      />
    </div>
  );
}
