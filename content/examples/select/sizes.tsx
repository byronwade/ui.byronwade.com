"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Example() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-16">Default</span>
        <Select>
          <SelectTrigger size="default">
            <SelectValue placeholder="Select size…" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Options</SelectLabel>
              <SelectItem value="xs">Extra small</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground w-16">Small</span>
        <Select>
          <SelectTrigger size="sm">
            <SelectValue placeholder="Select size…" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Options</SelectLabel>
              <SelectItem value="xs">Extra small</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
