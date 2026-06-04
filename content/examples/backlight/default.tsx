import { Backlight } from "@/components/ui/backlight";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-12">
      <Backlight blur={16}>
        <div className="rounded-2xl bg-brand px-6 py-4 text-xl font-medium text-brand-foreground">
          byronwade/ui
        </div>
      </Backlight>
    </div>
  );
}
