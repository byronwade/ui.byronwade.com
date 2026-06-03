import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Example() {
  return (
    <div className="w-48">
      <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-xl border bg-muted">
        <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
          3:4
        </div>
      </AspectRatio>
    </div>
  );
}
