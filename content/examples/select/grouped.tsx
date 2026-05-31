"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Example() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Select>
        <SelectTrigger className="w-56">
          <SelectValue placeholder="Select a timezone…" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Time (ET)</SelectItem>
            <SelectItem value="cst">Central Time (CT)</SelectItem>
            <SelectItem value="mst">Mountain Time (MT)</SelectItem>
            <SelectItem value="pst">Pacific Time (PT)</SelectItem>
            <SelectItem value="akst">Alaska Time (AKT)</SelectItem>
            <SelectItem value="hst">Hawaii Time (HST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Europe</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="eet">Eastern European Time (EET)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>Asia / Pacific</SelectLabel>
            <SelectItem value="ist">India Standard Time (IST)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
            <SelectItem value="aest">Australia Eastern Time (AEST)</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>UTC</SelectLabel>
            <SelectItem value="utc">UTC</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
