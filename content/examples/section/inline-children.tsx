import { Section, SettingsList, SettingRow } from "@/components/section"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      {/* SettingRow with children rendered below the description (left column) */}
      <Section
        title="Webhook endpoints"
        description="Configure URLs that receive event payloads when activity occurs."
      >
        <SettingsList>
          <SettingRow
            title="Production endpoint"
            description="Receives all events from your live environment."
            control={<Badge variant="success">Active</Badge>}
          >
            {/* Inline code block as a child, rendered below description */}
            <code className="mt-1 block rounded-md border bg-muted px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
              https://api.example.com/webhooks/prod
            </code>
          </SettingRow>

          <SettingRow
            title="Staging endpoint"
            description="Receives only test-mode events. Safe to point at an internal service."
            control={<Badge variant="outline">Paused</Badge>}
          >
            <code className="mt-1 block rounded-md border bg-muted px-2.5 py-1.5 font-mono text-xs text-muted-foreground">
              https://staging.example.com/webhooks
            </code>
          </SettingRow>
        </SettingsList>
      </Section>

      {/* SettingRow with an action link as a child */}
      <Section
        title="Connected accounts"
        description="Third-party services linked to your account for sign-in or data sync."
      >
        <SettingsList>
          <SettingRow
            title="GitHub"
            description="Used for single sign-on and repository access."
            control={
              <Button size="sm" variant="outline">
                Disconnect
              </Button>
            }
          >
            <p className="text-xs text-muted-foreground">
              Connected as{" "}
              <span className="font-medium text-foreground">@jsmith</span> · 42
              repositories accessible.
            </p>
          </SettingRow>

          <SettingRow
            title="Google Workspace"
            description="Enables calendar sync and single sign-on for your organisation."
          >
            <Button size="sm" variant="outline" className="mt-1">
              Connect Google
            </Button>
          </SettingRow>
        </SettingsList>
      </Section>
    </div>
  )
}
