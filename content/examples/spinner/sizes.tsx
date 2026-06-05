import { Spinner } from "@/components/ui/spinner";

export default function Example() {
  return (
    <div className="flex flex-wrap items-end gap-8 p-6">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="font-mono text-xs text-muted-foreground">sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="default" />
        <span className="font-mono text-xs text-muted-foreground">default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Spinner size="lg" />
        <span className="font-mono text-xs text-muted-foreground">lg</span>
      </div>
    </div>
  );
}
