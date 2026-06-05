import { GradientAvatar } from "@/components/ui/gradient-avatar"

export default function Example() {
  return (
    <div className="flex items-center gap-3 p-6">
      <GradientAvatar seed="alice" size="md" />
      <div>
        <p className="text-sm font-medium">Alice Chen</p>
        <p className="text-xs text-muted-foreground">Joined 3 days ago</p>
      </div>
    </div>
  )
}
