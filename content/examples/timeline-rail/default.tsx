import { TimelineRail } from "@/components/timeline-rail";

export default function Example() {
  return (
    <TimelineRail
      groups={[
        {
          label: "Today",
          items: [
            { title: "Signed up", meta: "2m" },
            { title: "Viewed pricing", meta: "1m" },
          ],
        },
      ]}
    />
  );
}
