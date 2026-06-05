"use client"

import { useState } from "react"
import { CheckboxGroup } from "@base-ui/react/checkbox-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const PERMISSIONS = [
  { value: "read", label: "Read" },
  { value: "write", label: "Write" },
  { value: "delete", label: "Delete" },
  { value: "admin", label: "Admin" },
]

export default function Example() {
  const [permissions, setPermissions] = useState<string[]>(["read", "write"])

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm font-medium">User permissions</p>

      <CheckboxGroup
        value={permissions}
        onValueChange={setPermissions}
        className="flex flex-col gap-2"
      >
        {PERMISSIONS.map(({ value, label }) => (
          <div key={value} className="flex items-center gap-2">
            <Checkbox id={`perm-${value}`} value={value} />
            <Label htmlFor={`perm-${value}`}>{label}</Label>
          </div>
        ))}
      </CheckboxGroup>

      <p className="text-xs text-muted-foreground">
        Active: {permissions.length > 0 ? permissions.join(", ") : "none"}
      </p>
    </div>
  )
}
