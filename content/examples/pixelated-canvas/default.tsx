import { PixelatedCanvas } from "@/components/ui/pixelated-canvas"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <PixelatedCanvas
        src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=600&auto=format&fit=crop"
        width={300}
        height={375}
        cellSize={4}
        shape="circle"
        className="rounded-xl"
      />
    </div>
  )
}
