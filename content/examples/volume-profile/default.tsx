import { VolumeProfile } from "@/components/ui/volume-profile"
import { makeCandles } from "@/lib/market"

export default function Example() {
  return (
    <div className="w-full max-w-md p-4">
      <VolumeProfile
        data={makeCandles(64, { seed: 3 })}
        width={140}
        height={320}
      />
    </div>
  )
}
