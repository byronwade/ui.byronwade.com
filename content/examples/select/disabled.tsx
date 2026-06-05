"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Example() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-6">
      {/* Entire select disabled */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">
          Entire select disabled
        </span>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Unavailable" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="a">Option A</SelectItem>
              <SelectItem value="b">Option B</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Individual items disabled */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">
          Individual items disabled
        </span>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select a plan…" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Plans</SelectLabel>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise" disabled>
                Enterprise (contact sales)
              </SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Legacy</SelectLabel>
              <SelectItem value="starter" disabled>
                Starter (discontinued)
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
