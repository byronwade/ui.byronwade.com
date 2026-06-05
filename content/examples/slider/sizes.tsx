import { Slider } from "@/components/ui/slider"

export default function Example() {
  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-8 p-8">
      <Slider aria-label="Small" size="sm" defaultValue={30} />
      <Slider aria-label="Default" defaultValue={50} />
      <Slider aria-label="Large" size="lg" defaultValue={70} />
    </div>
  )
}
