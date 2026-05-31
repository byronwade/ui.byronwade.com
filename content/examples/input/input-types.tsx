import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fields: { id: string; label: string; type: string; placeholder?: string; defaultValue?: string }[] = [
  { id: "t-text",     label: "Text",     type: "text",     placeholder: "Plain text" },
  { id: "t-email",    label: "Email",    type: "email",    placeholder: "you@example.com" },
  { id: "t-password", label: "Password", type: "password", placeholder: "••••••••" },
  { id: "t-search",   label: "Search",   type: "search",   placeholder: "Search…" },
  { id: "t-url",      label: "URL",      type: "url",      placeholder: "https://example.com" },
  { id: "t-tel",      label: "Tel",      type: "tel",      placeholder: "+1 555 000 0000" },
  { id: "t-number",   label: "Number",   type: "number",   placeholder: "0" },
  { id: "t-date",     label: "Date",     type: "date",     defaultValue: "2026-01-15" },
  { id: "t-time",     label: "Time",     type: "time",     defaultValue: "09:30" },
  { id: "t-color",    label: "Color",    type: "color",    defaultValue: "#16a34a" },
];

export default function Example() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 max-w-lg w-full">
      {fields.map(({ id, label, type, placeholder, defaultValue }) => (
        <div key={id} className="flex flex-col gap-1.5">
          <Label htmlFor={id}>{label}</Label>
          <Input
            id={id}
            type={type}
            placeholder={placeholder}
            defaultValue={defaultValue}
          />
        </div>
      ))}
    </div>
  );
}
