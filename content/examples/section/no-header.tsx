import { Section, SettingsList, SettingRow } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      {/* Section with no title or action — just a bordered card body */}
      <Section>
        <SettingsList>
          <SettingRow
            title="Compact mode"
            description="Reduce spacing in lists and tables to show more content at once."
            control={<Switch />}
          />
          <SettingRow
            title="High contrast"
            description="Increase text and border contrast for improved readability."
            control={<Switch defaultChecked />}
          />
          <SettingRow
            title="Reduce motion"
            description="Disable animated transitions for users who prefer reduced motion."
            control={<Switch />}
          />
        </SettingsList>
      </Section>

      {/* Section with description but no title */}
      <Section description="The following items are read-only and managed by your organisation's administrator.">
        <SettingsList>
          <SettingRow
            title="Single sign-on"
            description="SSO is enforced for all members of your organisation."
            control={<Badge variant="secondary">Enforced</Badge>}
          />
          <SettingRow
            title="Audit log retention"
            description="Logs are retained for 365 days per your organisation policy."
            control={<Badge variant="outline">365 days</Badge>}
          />
        </SettingsList>
      </Section>

      {/* Section with a plain body (no SettingsList) */}
      <Section title="Danger zone">
        <div className="px-5 py-5 text-sm text-muted-foreground">
          Destructive actions in this section are irreversible. Contact support if
          you need help recovering data.
        </div>
      </Section>
    </div>
  );
}
