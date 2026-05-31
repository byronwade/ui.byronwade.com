import { Section, SettingsList, SettingRow } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function Example() {
  return (
    <div className="max-w-2xl mx-auto p-8 space-y-8">
      <Section
        title="Notifications"
        description="Choose which events trigger an email or push alert."
        action={<Button variant="outline" size="sm">Save</Button>}
      >
        <SettingsList>
          <SettingRow
            title="Email digest"
            description="Receive a daily summary of activity in your account."
            control={<Switch defaultChecked />}
          />
          <SettingRow
            title="Security alerts"
            description="Get notified immediately when a new device signs in."
            control={<Switch />}
          />
          <SettingRow
            title="Product updates"
            description="Hear about new features and improvements."
            control={<Switch />}
          />
        </SettingsList>
      </Section>
    </div>
  );
}
