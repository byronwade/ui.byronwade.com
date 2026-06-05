import { EqualizerBars } from "@/components/ui/equalizer-bars"

export default function Example() {
  return (
    <div className="flex items-end gap-6 p-8">
      <EqualizerBars size="sm" aria-label="Now playing" />
      <EqualizerBars size="md" aria-label="Now playing" />
      <EqualizerBars size="lg" aria-label="Now playing" />
      <EqualizerBars playing={false} aria-label="Paused" />
    </div>
  )
}
