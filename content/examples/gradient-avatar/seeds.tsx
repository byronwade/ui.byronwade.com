import { GradientAvatar } from "@/components/ui/gradient-avatar";

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      {["ada", "grace", "linus", "margaret"].map((s) => (
        <GradientAvatar key={s} seed={s} size="lg" />
      ))}
    </div>
  );
}
