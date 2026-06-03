import { ChevronDownIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const DETAILS = [
  { label: "Plan", value: "Pro (annual)" },
  { label: "Seats", value: "12 of 20" },
  { label: "Renews", value: "Mar 1, 2026" },
  { label: "Owner", value: "ada@acme.com" },
];

const PERKS = ["Priority support", "Custom domains", "Audit log export"];

export default function Example() {
  return (
    <Collapsible defaultOpen className="w-80 space-y-2">
      <CollapsibleTrigger
        render={<Button variant="outline" className="w-full justify-between" />}
      >
        Subscription summary
        <ChevronDownIcon className="size-4 transition-transform group-aria-expanded/button:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 rounded-lg border p-3 text-sm">
        <dl className="divide-y divide-border">
          {DETAILS.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between py-1.5"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd className="font-medium">{row.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="space-y-1 text-muted-foreground">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand" aria-hidden />
              {perk}
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}
