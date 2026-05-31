import { ActivityGrid } from "@/components/ui/activity-grid";

export default function Example() {
  return (
    <ActivityGrid data={Array.from({ length: 26 * 7 }, (_, i) => (i * 37) % 5)} />
  );
}
