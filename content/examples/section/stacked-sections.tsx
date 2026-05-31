import { Section, SettingsList, SettingRow } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

/**
 * Full settings page composed from multiple stacked Section + SettingsList blocks.
 * Demonstrates how Section fills a real settings layout.
 */
export default function Example() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-10">
      {/* ── Profile ──────────────────────────────────── */}
      <Section
        title="Profile"
        description="Public information shown to collaborators and in shared views."
        action={<Button size="sm">Save changes</Button>}
      >
        <SettingsList>
          <SettingRow
            title="Full name"
            description="Your real name or a preferred display name."
            control={<Input defaultValue="Alex Rivera" className="w-44" />}
          />
          <SettingRow
            title="Email address"
            description="Used for sign-in, notifications, and billing receipts."
            control={
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  alex@example.com
                </span>
                <Badge variant="success">Verified</Badge>
              </div>
            }
          />
        </SettingsList>
      </Section>

      {/* ── Security ─────────────────────────────────── */}
      <Section
        title="Security"
        description="Manage passwords, sessions, and authentication options."
      >
        <SettingsList>
          <SettingRow
            title="Two-factor authentication"
            description="Add a second factor so a stolen password alone cannot access your account."
            control={<Switch />}
          />
          <SettingRow
            title="Passkey login"
            description="Sign in with a device passkey — no password required."
            control={<Switch defaultChecked />}
          />
          <SettingRow
            title="Active sessions"
            description="You are signed in on 3 devices."
            control={
              <Button size="sm" variant="outline">
                Manage
              </Button>
            }
          />
        </SettingsList>
      </Section>

      {/* ── Billing ──────────────────────────────────── */}
      <Section
        title="Billing"
        description="Your plan, payment method, and invoice history."
        action={
          <Button size="sm" variant="outline">
            View invoices
          </Button>
        }
      >
        <SettingsList>
          <SettingRow
            title="Current plan"
            description="Renews on July 1, 2025."
            control={<Badge variant="default">Pro · $29 / mo</Badge>}
          />
          <SettingRow
            title="Payment method"
            description="Visa ending in 4242 · Expires 08 / 27."
            control={
              <Button size="sm" variant="outline">
                Update
              </Button>
            }
          />
        </SettingsList>
      </Section>

      {/* ── Danger zone ──────────────────────────────── */}
      <Section title="Danger zone">
        <SettingsList>
          <SettingRow
            title="Transfer ownership"
            description="Move this workspace to another account. You will lose owner privileges."
            control={
              <Button size="sm" variant="outline">
                Transfer
              </Button>
            }
          />
          <SettingRow
            title="Delete workspace"
            description="Permanently delete this workspace and all its data. This action cannot be undone."
            control={
              <Button size="sm" variant="destructive">
                Delete
              </Button>
            }
          />
        </SettingsList>
      </Section>
    </div>
  );
}
