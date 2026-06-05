"use client"

import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <div className="flex flex-col gap-6 p-6 max-w-sm w-full">
      {/* peer-disabled: label dims when its paired input is disabled */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="active-field">Active field</Label>
        <input
          id="active-field"
          type="text"
          defaultValue="Editable value"
          className="peer rounded-md border px-3 py-2 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="disabled-field">Disabled field</Label>
        <input
          id="disabled-field"
          type="text"
          defaultValue="Cannot edit this"
          disabled
          className="peer rounded-md border px-3 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* group-data-[disabled=true]: label dims via group wrapper */}
      <fieldset disabled className="group" data-disabled="true">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="group-disabled">Group-disabled field</Label>
          <input
            id="group-disabled"
            type="text"
            defaultValue="Whole group is off"
            className="rounded-md border px-3 py-2 text-sm opacity-50 cursor-not-allowed"
          />
        </div>
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="readonly-field">Read-only field</Label>
        <input
          id="readonly-field"
          type="text"
          defaultValue="You can read but not change this"
          readOnly
          className="rounded-md border px-3 py-2 text-sm bg-muted/40 cursor-default"
        />
      </div>
    </div>
  )
}
