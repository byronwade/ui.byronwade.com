import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function Example() {
  return (
    <div className="w-72">
      <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-xl border">
        <div className="size-full bg-gradient-to-br from-brand/30 to-muted" />
        <div className="absolute bottom-2 left-2 rounded-md bg-background/80 px-2 py-1 text-xs font-medium text-foreground backdrop-blur">
          4:3 thumbnail
        </div>
      </AspectRatio>
    </div>
  )
}
