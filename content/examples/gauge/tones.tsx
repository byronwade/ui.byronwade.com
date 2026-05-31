import { Gauge } from "@/components/ui/gauge";

export default function Example() {
  return (
    <div className="flex gap-6">
      <Gauge value={42} label="Poor" />
      <Gauge value={72} label="OK" />
      <Gauge value={95} label="Great" />
    </div>
  );
}
