// Settings template — a personal account settings page.
// uses: Section, SettingRow, SettingsList, Switch, Select, Input, Label, GradientAvatar, Button, Badge
//
// Design: a calm settings *document* (not the split-rail admin console) — a sticky
// in-page table of contents on the left, explain-everything rows on the right, and a
// fenced destructive "danger zone" at the end. Every control is a registry primitive,
// every surface a token, so the whole page re-skins from --brand.
import {
  Bell,
  CreditCard,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";

import { Section, SettingRow, SettingsList } from "@/components/section";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const toc = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "danger", label: "Danger zone", icon: Trash2 },
];

const invoices = [
  { id: "INV-0042", date: "Jun 1, 2026", amount: "$19.00" },
  { id: "INV-0041", date: "May 1, 2026", amount: "$19.00" },
  { id: "INV-0040", date: "Apr 1, 2026", amount: "$19.00" },
];

// Passed to <Select items> so the trigger renders the label, not the raw value.
const timezones: Record<string, string> = {
  pt: "Pacific (US & Canada)",
  et: "Eastern (US & Canada)",
  gmt: "London (GMT)",
  cet: "Central European",
};

export function SettingsTemplate() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-14">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b border-border pb-6">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Account settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your profile, notifications, and billing.
            </p>
          </div>
          <Button>Save changes</Button>
        </header>

        <div className="mt-8 grid gap-10 lg:grid-cols-[200px_1fr]">
          {/* ── Sticky table of contents ───────────────────────────── */}
          <aside className="hidden lg:block">
            <nav className="sticky top-20 space-y-0.5" aria-label="Settings sections">
              {toc.map((t) => (
                <a
                  key={t.id}
                  href={`#${t.id}`}
                  className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <t.icon className="size-4" />
                  {t.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* ── Content ────────────────────────────────────────────── */}
          <div className="max-w-2xl space-y-10">
            <section id="profile" className="scroll-mt-20">
              <Section title="Profile" description="This information appears on your public profile.">
                <div className="space-y-5 p-5">
                  <div className="flex items-center gap-4">
                    <GradientAvatar seed="ana reyes" size="xl" className="rounded-2xl" />
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Upload</Button>
                        <Button variant="ghost" size="sm">Remove</Button>
                      </div>
                      <p className="text-xs text-muted-foreground">PNG or JPG, up to 2 MB.</p>
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Full name</Label>
                      <Input id="name" defaultValue="Ana Reyes" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="ana@helio.app" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Timezone</Label>
                    <Select items={timezones} defaultValue="pt">
                      <SelectTrigger className="w-full sm:w-72">
                        <SelectValue placeholder="Select a timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(timezones).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Section>
            </section>

            <section id="notifications" className="scroll-mt-20">
              <Section title="Notifications" description="Choose what lands in your inbox.">
                <SettingsList>
                  <SettingRow title="Product updates" description="New features and improvements." control={<Switch defaultChecked />} />
                  <SettingRow title="Mentions" description="When someone @mentions you." control={<Switch defaultChecked />} />
                  <SettingRow title="Weekly digest" description="A Monday summary of your activity." control={<Switch />} />
                  <SettingRow title="Marketing" description="Tips, offers, and company news." control={<Switch />} />
                </SettingsList>
              </Section>
            </section>

            <section id="security" className="scroll-mt-20">
              <Section title="Security" description="Keep your account protected.">
                <SettingsList>
                  <SettingRow
                    title="Two-factor authentication"
                    description="Require a one-time code at sign-in."
                    control={<Switch defaultChecked />}
                  />
                  <SettingRow
                    title="Password"
                    description="Last changed 3 months ago."
                    control={<Button variant="outline" size="sm">Change</Button>}
                  />
                  <SettingRow
                    title="Active sessions"
                    description="You're signed in on 2 devices."
                    control={<Button variant="ghost" size="sm">Manage</Button>}
                  />
                </SettingsList>
              </Section>
            </section>

            <section id="billing" className="scroll-mt-20">
              <Section
                title="Billing"
                description="You're on the Pro plan, billed annually."
                action={<Badge>Pro</Badge>}
              >
                <div className="space-y-5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 place-items-center rounded-lg bg-brand/10 text-brand">
                      <CreditCard className="size-4" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Pro · $19 / mo</div>
                      <div className="text-xs text-muted-foreground">Visa ending 4242 · renews Jun 1, 2027</div>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>
                  <div className="divide-y divide-border rounded-xl border border-border">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                        <span className="font-mono text-muted-foreground">{inv.id}</span>
                        <span className="text-muted-foreground">{inv.date}</span>
                        <span className="font-medium tabular-nums">{inv.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            </section>

            {/* ── Danger zone ──────────────────────────────────────── */}
            <section id="danger" className="scroll-mt-20">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold tracking-tight text-destructive">Danger zone</h2>
                  <p className="text-sm text-muted-foreground">Irreversible actions for this account.</p>
                </div>
                <div className="flex flex-col gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Delete account</div>
                    <p className="text-sm text-muted-foreground">
                      Permanently remove your account and all of its data.
                    </p>
                  </div>
                  <Button variant="destructive" size="sm" className="shrink-0">
                    <Trash2 data-icon="inline-start" />
                    Delete account
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
