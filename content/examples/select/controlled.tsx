"use client";

import { useState } from "react";
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

const COUNTRY_CURRENCIES: Record<string, string> = {
  usd: "US Dollar",
  eur: "Euro",
  gbp: "British Pound",
  jpy: "Japanese Yen",
  cad: "Canadian Dollar",
  aud: "Australian Dollar",
};

export default function Example() {
  const [currency, setCurrency] = useState<string>("");

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs text-muted-foreground">Currency</span>
        <Select value={currency} onValueChange={(v) => setCurrency(v ?? "")}>
          <SelectTrigger className="w-52">
            <SelectValue placeholder="Select currency…" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Americas</SelectLabel>
              <SelectItem value="usd">USD — US Dollar</SelectItem>
              <SelectItem value="cad">CAD — Canadian Dollar</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Europe</SelectLabel>
              <SelectItem value="eur">EUR — Euro</SelectItem>
              <SelectItem value="gbp">GBP — British Pound</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Asia-Pacific</SelectLabel>
              <SelectItem value="jpy">JPY — Japanese Yen</SelectItem>
              <SelectItem value="aud">AUD — Australian Dollar</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {currency && (
        <p className="text-sm text-muted-foreground">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {COUNTRY_CURRENCIES[currency]}
          </span>{" "}
          <span className="uppercase text-xs">({currency})</span>
        </p>
      )}

      {currency && (
        <button
          onClick={() => setCurrency("")}
          className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Clear selection
        </button>
      )}
    </div>
  );
}
