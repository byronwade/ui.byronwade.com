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
import {
  Bell,
  BellRinging,
  BellSlash,
  GlobeHemisphereWest,
  GridFour,
  Layout,
  Monitor,
  Moon,
  Rows,
  Sun,
} from "@/lib/icons"

export default function Example() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[260px] gap-6">
      {/* Icon in trigger value */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Theme preference</span>
        <Select defaultValue="system">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Appearance</SelectLabel>
              <SelectItem value="light">
                <Sun className="size-4" />
                Light
              </SelectItem>
              <SelectItem value="dark">
                <Moon className="size-4" />
                Dark
              </SelectItem>
              <SelectItem value="system">
                <Monitor className="size-4" />
                System
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Icon in trigger with placeholder */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">
          Notification style
        </span>
        <Select>
          <SelectTrigger>
            <Bell className="size-4 text-muted-foreground" />
            <SelectValue placeholder="Notification style…" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Alerts</SelectLabel>
              <SelectItem value="all">
                <BellRinging className="size-4" />
                All notifications
              </SelectItem>
              <SelectItem value="important">
                <Bell className="size-4" />
                Important only
              </SelectItem>
              <SelectItem value="none">
                <BellSlash className="size-4" />
                None
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Icon-labeled groups */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Layout view</span>
        <Select defaultValue="grid">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>View mode</SelectLabel>
              <SelectItem value="grid">
                <GridFour className="size-4" />
                Grid
              </SelectItem>
              <SelectItem value="list">
                <Rows className="size-4" />
                List
              </SelectItem>
              <SelectItem value="compact">
                <Layout className="size-4" />
                Compact
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
