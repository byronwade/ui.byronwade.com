import { Section, SettingsList, SettingRow } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Example() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      {/* Section with a primary action */}
      <Section
        title="Custom domain"
        description="Send from your own domain instead of the shared sending pool."
        action={<Button size="sm">Add domain</Button>}
      >
        <SettingsList>
          <SettingRow
            title="docs.example.com"
            description="Added 3 days ago · All DNS records verified."
            control={<Badge variant="success">Active</Badge>}
          />
          <SettingRow
            title="mail.example.com"
            description="Added 7 days ago · One DNS record is still propagating."
            control={<Badge variant="warning">Pending</Badge>}
          />
        </SettingsList>
      </Section>

      {/* Section with a destructive action */}
      <Section
        title="API keys"
        description="Keys grant programmatic access to your account. Revoke unused keys promptly."
        action={
          <Button size="sm" variant="outline">
            Create key
          </Button>
        }
      >
        <SettingsList>
          <SettingRow
            title="Production key"
            description="Last used 2 hours ago · Created Jan 12, 2025."
            control={
              <Button size="sm" variant="destructive">
                Revoke
              </Button>
            }
          />
          <SettingRow
            title="Staging key"
            description="Last used 5 days ago · Created Dec 3, 2024."
            control={
              <Button size="sm" variant="outline">
                Revoke
              </Button>
            }
          />
        </SettingsList>
      </Section>

      {/* Section with an inline input action */}
      <Section
        title="Invite team members"
        description="Invite colleagues by email. They will receive an invite link."
        action={
          <div className="flex gap-2">
            <Input placeholder="colleague@example.com" className="w-56" />
            <Button size="sm">Invite</Button>
          </div>
        }
      >
        <SettingsList>
          <SettingRow
            title="alice@example.com"
            description="Member · Joined 14 days ago."
            control={<Badge variant="secondary">Admin</Badge>}
          />
          <SettingRow
            title="bob@example.com"
            description="Member · Joined 2 days ago."
            control={<Badge variant="outline">Viewer</Badge>}
          />
        </SettingsList>
      </Section>
    </div>
  )
}
