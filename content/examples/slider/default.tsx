import { Slider } from "@/components/ui/slider"

export default function Example() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 p-8">
      <Slider aria-label="Volume" defaultValue={40} />
      <Slider aria-label="Price range" defaultValue={[25, 75]} />
    </div>
  )
}
