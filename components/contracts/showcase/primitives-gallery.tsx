"use client"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/**
 * One shared primitives gallery — inherits [data-contract] tokens from ancestors.
 * Never fork Buttons/Cards per contract; reskin via CSS variables only.
 */
function PrimitivesGallery({ className }: { className?: string }) {
  const [notify, setNotify] = useState(true)

  return (
    <div
      data-slot="primitives-gallery"
      className={cn("space-y-6", className)}
    >
      <Tabs defaultValue="actions">
        {/* w-fit, not w-full: TabsTrigger is flex-1, so a full-width list
            stretches four tabs across the page and reads as a nav bar. */}
        <TabsList className="flex h-auto w-fit max-w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="actions" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buttons & badges</CardTitle>
              <CardDescription>
                Primary, outline, ghost, destructive — brand comes from this
                contract&apos;s --brand.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-2">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form controls</CardTitle>
              <CardDescription>
                Inputs, selects, switches — radius and borders follow the skin.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="gallery-name">Name</Label>
                <Input id="gallery-name" placeholder="Resource name" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pick status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="gallery-notes">Notes</Label>
                <Textarea
                  id="gallery-notes"
                  placeholder="Agent-visible notes…"
                  rows={3}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="gallery-ack" defaultChecked />
                <Label htmlFor="gallery-ack">Require review</Label>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/30 px-3 py-2 edge">
                <Label htmlFor="gallery-notify">Notify on change</Label>
                <Switch
                  id="gallery-notify"
                  checked={notify}
                  onCheckedChange={setNotify}
                />
              </div>
            </CardContent>
            <CardFooter className="justify-end gap-2">
              <Button variant="ghost">Cancel</Button>
              <Button>Save</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Index table</CardTitle>
              <CardDescription>
                Dense scanning chrome — mono ids, semantic status chips.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">Id</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead className="pr-6 text-right">State</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["res_01", "Inbox triage", "maya", "Open"],
                    ["res_02", "Deploy checklist", "jon", "Review"],
                    ["res_03", "Token audit", "agent", "Healthy"],
                  ].map(([id, title, owner, state]) => (
                    <TableRow key={id}>
                      <TableCell className="pl-6 font-mono text-xs text-muted-foreground">
                        {id}
                      </TableCell>
                      <TableCell className="font-medium tracking-tight">
                        {title}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {owner}
                      </TableCell>
                      <TableCell className="pr-6 text-right">
                        <Badge variant="secondary" className="font-mono text-[10px]">
                          {state}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Selected state</CardTitle>
                <CardDescription>
                  Active rows use brand mute — never a second accent.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="rounded-lg bg-brand/10 px-3 py-2 text-sm tracking-tight edge">
                  Selected resource · bg-brand/10
                </div>
                <div className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted/30">
                  Hover row · bg-muted/30
                </div>
                <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  Danger · bg-destructive/10
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Composition note</CardTitle>
                <CardDescription>
                  These are the same shadcn files under{" "}
                  <span className="font-mono">components/ui</span>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  Do not copy this gallery per contract. Mount it inside{" "}
                  <span className="font-mono text-foreground">
                    data-contract=&quot;…&quot;
                  </span>{" "}
                  and let OKLCH tokens restyle every control.
                </p>
                <Separator />
                <p className="font-mono text-[11px]">
                  button · card · input · table · tabs · dialog · badge · switch
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export { PrimitivesGallery }
