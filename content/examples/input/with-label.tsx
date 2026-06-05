import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-sm w-full">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="first-name">First name</Label>
        <Input id="first-name" type="text" placeholder="Jane" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email-addr">Email</Label>
        <Input id="email-addr" type="email" placeholder="jane@example.com" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="website">Website</Label>
        <Input id="website" type="url" placeholder="https://example.com" />
      </div>
    </div>
  )
}
