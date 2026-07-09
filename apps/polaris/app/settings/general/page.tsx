import Link from "next/link"

import { AdminShell } from "@/components/polaris/admin-shell"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function GeneralSettingsPage() {
  return (
    <AdminShell
      activeId="settings-general"
      title="General"
      headerActions={
        <Button size="sm" type="button">
          Save
        </Button>
      }
    >
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/settings" />}>
                Settings
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>General</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <h2 className="text-sm font-medium text-foreground">Store details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Name, contact, and defaults shown across your admin and storefront.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Store identity</CardTitle>
            <CardDescription>
              How your store appears to customers and staff.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="store-name">Store name</FieldLabel>
                <Input id="store-name" defaultValue="Snowpeak Outfitters" />
              </Field>
              <Field>
                <FieldLabel htmlFor="contact-email">Contact email</FieldLabel>
                <Input
                  id="contact-email"
                  type="email"
                  defaultValue="hello@snowpeak.example"
                />
                <FieldDescription>
                  Used for order notifications and customer replies.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="store-address">Store address</FieldLabel>
                <Textarea
                  id="store-address"
                  rows={3}
                  defaultValue={"120 Cascade Ave\nPortland, OR 97209"}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Defaults</CardTitle>
            <CardDescription>
              Currency, unit system, and order numbering.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>Currency</FieldLabel>
              <Select defaultValue="usd">
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD — US dollar</SelectItem>
                  <SelectItem value="cad">CAD — Canadian dollar</SelectItem>
                  <SelectItem value="eur">EUR — Euro</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="unit-system">Use metric units</Label>
                <p className="text-xs text-muted-foreground">
                  Weights and dimensions default to kg and cm.
                </p>
              </div>
              <Switch id="unit-system" defaultChecked />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button variant="outline" size="sm" type="button">
              Discard
            </Button>
            <Button size="sm" type="button">
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </AdminShell>
  )
}
