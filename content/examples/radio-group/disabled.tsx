"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function Example() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Entire group disabled */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Entire group disabled</p>
        <RadioGroup defaultValue="standard" disabled>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="standard" id="dis-standard" />
            <Label htmlFor="dis-standard" className="cursor-not-allowed opacity-50">
              Standard
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="express" id="dis-express" />
            <Label htmlFor="dis-express" className="cursor-not-allowed opacity-50">
              Express
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="overnight" id="dis-overnight" />
            <Label htmlFor="dis-overnight" className="cursor-not-allowed opacity-50">
              Overnight
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Individual item disabled */}
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Single item disabled</p>
        <RadioGroup defaultValue="personal">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="personal" id="acc-personal" />
            <Label htmlFor="acc-personal">Personal</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="team" id="acc-team" />
            <Label htmlFor="acc-team">Team</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="enterprise" id="acc-enterprise" disabled />
            <Label htmlFor="acc-enterprise" className="cursor-not-allowed opacity-50">
              Enterprise (contact sales)
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
