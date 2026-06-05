import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Example() {
  return (
    <div className="w-56">
      <AspectRatio
        ratio={1}
        className="overflow-hidden rounded-xl border bg-muted"
      >
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          1:1
        </div>
      </AspectRatio>
    </div>
  )
}
