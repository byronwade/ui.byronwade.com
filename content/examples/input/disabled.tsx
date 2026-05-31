import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Example() {
  return (
    <div className="flex flex-col gap-5 p-6 max-w-sm w-full">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="disabled-text">Username</Label>
        <Input
          id="disabled-text"
          type="text"
          placeholder="account_name"
          disabled
        />
        <p className="text-xs text-muted-foreground">
          Username cannot be changed after signup.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="disabled-email">Email</Label>
        <Input
          id="disabled-email"
          type="email"
          value="jane@example.com"
          disabled
          readOnly
        />
        <p className="text-xs text-muted-foreground">
          Contact support to update your email address.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="readonly-token">API token</Label>
        <Input
          id="readonly-token"
          type="text"
          value="sk_live_••••••••••••••••4f3a"
          readOnly
        />
        <p className="text-xs text-muted-foreground">
          Read-only — copy and store this token securely.
        </p>
      </div>
    </div>
  );
}
