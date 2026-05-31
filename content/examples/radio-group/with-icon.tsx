"use client";

import { useState } from "react";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const devices = [
  { value: "desktop", label: "Desktop", icon: Monitor },
  { value: "tablet", label: "Tablet", icon: Tablet },
  { value: "mobile", label: "Mobile", icon: Smartphone },
];

export default function Example() {
  const [device, setDevice] = useState("desktop");

  return (
    <div className="flex flex-col gap-4 p-6">
      <p className="text-sm font-medium">Preview on</p>
      <RadioGroup
        value={device}
        onValueChange={setDevice}
        className="flex flex-row gap-3 w-auto"
      >
        {devices.map(({ value, label, icon: Icon }) => (
          <label
            key={value}
            htmlFor={`dev-${value}`}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border px-5 py-4 hover:bg-muted/40 transition-colors has-[[data-checked]]:border-primary has-[[data-checked]]:bg-primary/5"
          >
            <RadioGroupItem value={value} id={`dev-${value}`} className="sr-only" />
            <Icon className={`size-5 ${device === value ? "text-primary" : "text-muted-foreground"}`} />
            <Label
              htmlFor={`dev-${value}`}
              className="cursor-pointer text-xs font-medium"
            >
              {label}
            </Label>
          </label>
        ))}
      </RadioGroup>
      <p className="text-sm text-muted-foreground">Previewing: {device}</p>
    </div>
  );
}
