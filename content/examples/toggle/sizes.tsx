import { StarIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

export default function Example() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2">
        <Toggle aria-label="Favorite" variant="outline" size="sm">
          <StarIcon />
        </Toggle>
        <span className="text-xs text-muted-foreground">sm</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Toggle aria-label="Favorite" variant="outline" size="default">
          <StarIcon />
        </Toggle>
        <span className="text-xs text-muted-foreground">default</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Toggle aria-label="Favorite" variant="outline" size="lg">
          <StarIcon />
        </Toggle>
        <span className="text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  );
}
