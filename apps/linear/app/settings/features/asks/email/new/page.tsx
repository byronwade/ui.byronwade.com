"use client"

import * as React from "react"
import Link from "next/link"
import { Copy, Download, ExternalLink } from "lucide-react"

import {
  SettingsBackLink,
  SettingsFieldRow,
  SettingsFormGroup,
  SettingsPageIntro,
  SettingsShell,
  SettingsStep,
  SettingsStepper,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const DNS_RECORDS = [
  { type: "CNAME", name: "linear._domainkey", content: "dkim.linear.app", status: "Unverified" },
  { type: "CNAME", name: "linear2._domainkey", content: "dkim2.linear.app", status: "Unverified" },
  { type: "TXT", name: "@", content: "linear-domain-verification=abc123", status: "Unverified" },
]

export default function NewEmailIntakePage() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1)

  return (
    <SettingsShell title="Add email intake" activeId="asks" wide>
      <SettingsBackLink href="/settings/features/asks">Asks</SettingsBackLink>

      <SettingsPageIntro
        title="Add email intake"
        description={
          <>
            Create issues by emailing a custom email address.{" "}
            <Link
              href="https://linear.app/docs/asks-email"
              className="inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
            >
              Docs
              <ExternalLink className="size-3" />
            </Link>
          </>
        }
      />

      <SettingsStepper className="mt-8">
        <SettingsStep
          title="Connect to Linear team"
          description="Each intake email is connected to a single Linear team."
          status={step > 1 ? "complete" : "active"}
        >
          {step === 1 ? (
            <>
              <SettingsFormGroup>
                <SettingsFieldRow label="Team">
                  <Select defaultValue="as-mobbin">
                    <SelectTrigger className="h-8 w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="as-mobbin">AS Mobbin</SelectItem>
                      <SelectItem value="engineering">Engineering Team</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsFieldRow>
                <SettingsFieldRow
                  label="Apply template"
                  description="Optionally use a template to fill issue properties."
                >
                  <Select defaultValue="none">
                    <SelectTrigger className="h-8 w-[160px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No template</SelectItem>
                    </SelectContent>
                  </Select>
                </SettingsFieldRow>
              </SettingsFormGroup>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </div>
            </>
          ) : null}
        </SettingsStep>

        <SettingsStep
          title="Configure email address"
          description={
            <>
              Specify your custom address, then forward emails to the intake
              address below.{" "}
              <Link href="#" className="underline-offset-2 hover:underline">
                Docs
              </Link>
              <ExternalLink className="ml-0.5 inline size-3" />
            </>
          }
          status={step > 2 ? "complete" : step === 2 ? "active" : "pending"}
        >
          {step === 2 ? (
            <>
              <SettingsFormGroup>
                <SettingsFieldRow label="Intake address">
                  <span className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground">
                    0db01098b285@intake.linear.app
                    <Button variant="ghost" size="icon-sm" aria-label="Copy">
                      <Copy className="size-3.5" />
                    </Button>
                  </span>
                </SettingsFieldRow>
                <SettingsFieldRow label="Sender name">
                  <Input defaultValue="AS Mobbin" className="h-8 w-[180px]" />
                </SettingsFieldRow>
                <SettingsFieldRow label="Custom address (optional)">
                  <Input
                    defaultValue="helpdesk@asmobbin.com"
                    className="h-8 w-[220px]"
                  />
                </SettingsFieldRow>
              </SettingsFormGroup>
              <div className="flex justify-end">
                <Button size="sm" onClick={() => setStep(3)}>
                  Continue
                </Button>
              </div>
            </>
          ) : null}
        </SettingsStep>

        <SettingsStep
          title="Configure email domain (optional)"
          description="Add DNS records to authenticate your domain for outgoing emails."
          status={step === 3 ? "active" : "pending"}
        >
          {step === 3 ? (
            <>
              <div
                data-slot="linear-asks-dns-table"
                className="overflow-hidden rounded-lg border border-border"
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Content</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {DNS_RECORDS.map((record) => (
                      <TableRow key={`${record.type}-${record.name}`}>
                        <TableCell className="font-mono text-xs">{record.type}</TableCell>
                        <TableCell className="font-mono text-xs">{record.name}</TableCell>
                        <TableCell className="max-w-[220px] truncate font-mono text-xs">
                          {record.content}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="size-1.5 rounded-full bg-destructive" />
                            {record.status}
                            <Button variant="ghost" size="sm" className="h-7 px-2">
                              Verify
                            </Button>
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button variant="ghost" size="sm" className="mt-2 gap-1.5">
                <Download className="size-3.5" />
                Download all records
              </Button>
              <div className="flex justify-end pt-4">
                <Button size="sm" render={<Link href="/settings/features/asks" />}>
                  Done
                </Button>
              </div>
            </>
          ) : null}
        </SettingsStep>
      </SettingsStepper>
    </SettingsShell>
  )
}
