import { SplitWithRail } from "@/components/split-with-rail";

export default function Example() {
  return (
    <SplitWithRail
      summary={<div className="rounded-xl border border-border p-6">Summary</div>}
      rail={<div className="rounded-xl border border-border p-6">Rail</div>}
    />
  );
}
