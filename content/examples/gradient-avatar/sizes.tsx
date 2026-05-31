import { GradientAvatar } from "@/components/ui/gradient-avatar";

export default function Example() {
  return (
    <div className="flex items-end gap-3">
      <GradientAvatar seed="ada" size="sm" />
      <GradientAvatar seed="ada" size="md" />
      <GradientAvatar seed="ada" size="lg" />
      <GradientAvatar seed="ada" size="xl" />
    </div>
  );
}
