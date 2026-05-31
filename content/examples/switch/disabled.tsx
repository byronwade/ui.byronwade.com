import { Switch } from "@/components/ui/switch";

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center gap-3">
        <Switch disabled />
        <span className="text-sm text-muted-foreground">
          Disabled (off)
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Switch disabled defaultChecked />
        <span className="text-sm text-muted-foreground">
          Disabled (on)
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Switch disabled size="sm" />
        <span className="text-sm text-muted-foreground">
          Small — disabled (off)
        </span>
      </div>
    </div>
  );
}
