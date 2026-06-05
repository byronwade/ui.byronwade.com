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
    <div className="flex items-center justify-center min-h-[200px]">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tropical</SelectLabel>
            <SelectItem value="mango">Mango</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
            <SelectItem value="papaya">Papaya</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Berries</SelectLabel>
            <SelectItem value="strawberry">Strawberry</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="raspberry">Raspberry</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
