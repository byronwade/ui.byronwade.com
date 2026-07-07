"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { ChevronRight, ExternalLink } from "lucide-react"

import {
  SettingsEmptyRow,
  SettingsFormCard,
  SettingsList,
  SettingsPageIntro,
  SettingsRow,
  SettingsSection,
  SettingsShell,
  SettingsStatusSwatchList,
  SettingsToggleRow,
} from "@/components/linear/settings-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const CUSTOMER_STATUSES = [
  { id: "active", label: "Active", color: "blue" as const },
  { id: "prospect", label: "Prospect", color: "green" as const },
  { id: "churned", label: "Churned", color: "red" as const },
  { id: "lost", label: "Lost", color: "orange" as const },
]

export default function CustomerRequestsSettingsPage() {
  const { setTheme } = useTheme()
  const [enabled, setEnabled] = React.useState(true)
  const [creatingTier, setCreatingTier] = React.useState(false)
  const [tierName, setTierName] = React.useState("")
  const [tierDescription, setTierDescription] = React.useState("")

  React.useEffect(() => {
    setTheme("light")
  }, [setTheme])

  return (
    <SettingsShell title="Customer requests" activeId="customer-requests">
      <SettingsPageIntro
        title="Customer requests"
        description={
          <>
            Connect customer feedback to issues and track revenue context.{" "}
            <Link
              href="https://linear.app/docs/customer-requests"
              className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
            >
              Docs
              <ExternalLink className="size-3" />
            </Link>
          </>
        }
      />

      <SettingsSection title="">
        <SettingsList>
          <SettingsToggleRow
            title="Enable Customer requests"
            description="Allow teams to link issues to customers and track feedback."
            checked={enabled}
            onCheckedChange={setEnabled}
          />
        </SettingsList>
      </SettingsSection>

      {enabled ? (
        <>
          <SettingsSection title="Customers">
            <SettingsList>
              <SettingsRow
                title="Manage customers"
                description="View and edit customers linked to your workspace."
                action={
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    No customers
                    <ChevronRight className="size-3.5" />
                  </span>
                }
              />
            </SettingsList>
          </SettingsSection>

          <SettingsSection
            title="Issue routing"
            description="Choose where new customer requests should land."
          >
            <SettingsList>
              <div
                data-slot="linear-settings-select-row"
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Default team for customer requests</p>
                  <p className="text-xs text-muted-foreground">
                    New requests are routed to this team by default.
                  </p>
                </div>
                <Select defaultValue="">
                  <SelectTrigger className="h-8 w-[160px]">
                    <SelectValue placeholder="Select a team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </SettingsList>
          </SettingsSection>

          <SettingsSection title="Customer statuses">
            <SettingsStatusSwatchList
              count="4 customer statuses"
              items={CUSTOMER_STATUSES}
            />
          </SettingsSection>

          <SettingsSection title="Customer tiers">
            {creatingTier ? (
              <SettingsFormCard
                footer={
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCreatingTier(false)}
                    >
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setCreatingTier(false)}>
                      Create
                    </Button>
                  </>
                }
              >
                <div
                  data-slot="linear-customer-tier-row"
                  className="grid gap-3 sm:grid-cols-2"
                >
                  <Input
                    value={tierName}
                    onChange={(event) => setTierName(event.target.value)}
                    placeholder="Name"
                  />
                  <Input
                    value={tierDescription}
                    onChange={(event) => setTierDescription(event.target.value)}
                    placeholder="Description…"
                  />
                </div>
              </SettingsFormCard>
            ) : (
              <SettingsList>
                <SettingsEmptyRow
                  label="No customer tiers"
                  onAdd={() => setCreatingTier(true)}
                />
              </SettingsList>
            )}
          </SettingsSection>

          <SettingsSection
            title="Display options"
            description="Control how revenue is shown on customer records."
          >
            <SettingsList>
              <div
                data-slot="linear-settings-select-row"
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Revenue formatting</p>
                  <p className="text-xs text-muted-foreground">
                    Show annual or monthly recurring revenue.
                  </p>
                </div>
                <Select defaultValue="annual">
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div
                data-slot="linear-settings-select-row"
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Revenue currency</p>
                  <p className="text-xs text-muted-foreground">
                    Default currency for customer revenue.
                  </p>
                </div>
                <Select defaultValue="usd">
                  <SelectTrigger className="h-8 w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd">USD ($)</SelectItem>
                    <SelectItem value="eur">EUR (€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </SettingsList>
          </SettingsSection>

          <SettingsSection title="Customer attributes data source">
            <SettingsList>
              <div className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">External data source</p>
                  <p className="text-xs text-muted-foreground">
                    Sync customer attributes from a CRM or billing tool.
                  </p>
                </div>
                <span className="text-sm text-muted-foreground">None</span>
              </div>
              <SettingsToggleRow
                title="Enable manual edits"
                description="Allow editing customer attributes in Linear."
                defaultChecked
              />
            </SettingsList>
          </SettingsSection>

          <SettingsSection title="Excluded domains and emails">
            <SettingsList>
              <SettingsEmptyRow label="No excluded domains and emails" />
            </SettingsList>
            <p className="mt-2 text-xs text-muted-foreground">
              Generic domains are excluded automatically.{" "}
              <Link href="#" className="underline-offset-2 hover:underline">
                List of generic domains
              </Link>
              <ExternalLink className="ml-0.5 inline size-3" />
            </p>
          </SettingsSection>
        </>
      ) : null}
    </SettingsShell>
  )
}
