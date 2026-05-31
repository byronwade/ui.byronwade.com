import { Gauge } from "@/components/ui/gauge";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <Gauge value={78} label="Performance" />
    </div>
  );
}
