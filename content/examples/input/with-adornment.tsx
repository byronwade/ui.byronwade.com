import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Example() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-sm w-full">
      {/* Leading text prefix */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="adorn-domain">Domain</Label>
        <div className="flex h-8 items-center rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 transition-colors overflow-hidden">
          <span className="flex h-full items-center border-r border-input bg-muted px-2.5 text-sm text-muted-foreground select-none">
            https://
          </span>
          <Input
            id="adorn-domain"
            type="text"
            placeholder="example.com"
            className="border-0 ring-0 focus-visible:border-0 focus-visible:ring-0 rounded-none h-full"
          />
        </div>
      </div>

      {/* Trailing text suffix */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="adorn-price">Price</Label>
        <div className="flex h-8 items-center rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 transition-colors overflow-hidden">
          <span className="flex h-full items-center border-r border-input bg-muted px-2.5 text-sm text-muted-foreground select-none">
            $
          </span>
          <Input
            id="adorn-price"
            type="number"
            placeholder="0.00"
            className="border-0 ring-0 focus-visible:border-0 focus-visible:ring-0 rounded-none h-full"
          />
          <span className="flex h-full items-center border-l border-input bg-muted px-2.5 text-sm text-muted-foreground select-none">
            USD
          </span>
        </div>
      </div>

      {/* Trailing unit */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="adorn-size">Storage limit</Label>
        <div className="flex h-8 items-center rounded-lg border border-input focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 transition-colors overflow-hidden">
          <Input
            id="adorn-size"
            type="number"
            placeholder="100"
            className="border-0 ring-0 focus-visible:border-0 focus-visible:ring-0 rounded-none h-full"
          />
          <span className="flex h-full items-center border-l border-input bg-muted px-2.5 text-sm text-muted-foreground select-none">
            GB
          </span>
        </div>
      </div>
    </div>
  );
}
