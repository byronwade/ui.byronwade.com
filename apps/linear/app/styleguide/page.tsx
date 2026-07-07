"use client"

import Link from "next/link"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
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
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-medium tracking-tight text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="rounded-lg border border-border bg-card p-5">{children}</div>
    </section>
  )
}

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-12 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Linear UI
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-foreground">Styleguide</span>
          </div>
          <Badge variant="outline">shadcn --all · 60 components</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            ui.byronwade.com/linear
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Component styleguide</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every primitive below uses Linear tokens from{" "}
            <code className="font-mono text-xs">design-research/LINEAR-DESIGN-SYSTEM.md</code> —
            dark surface ladder, indigo accent, Inter typography, hairline borders, and dense
            operational density.
          </p>
        </div>

        <Section title="Buttons" description="6px radius, 510 weight, indigo primary fill.">
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </Section>

        <Section title="Form controls">
          <div className="grid max-w-md gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue-title">Issue title</Label>
              <Input id="issue-title" placeholder="Fix navigation regression" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Steps to reproduce…" rows={3} />
            </div>
            <Select defaultValue="todo">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todo">Todo</SelectItem>
                <SelectItem value="progress">In progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="urgent" />
                <Label htmlFor="urgent">Urgent</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="notify" />
                <Label htmlFor="notify">Notify assignee</Label>
              </div>
            </div>
            <RadioGroup defaultValue="medium" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
            </RadioGroup>
          </div>
        </Section>

        <Section title="Issue table" description="Dense 36px rows, metadata in mono.">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">ENG-142</TableCell>
                <TableCell>Refactor command palette keyboard nav</TableCell>
                <TableCell>
                  <Badge variant="outline">In progress</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">P2</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">ENG-139</TableCell>
                <TableCell>Ship cycle planning sidebar</TableCell>
                <TableCell>
                  <Badge variant="outline">Todo</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">P1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">ENG-128</TableCell>
                <TableCell>Agent activity timeline polish</TableCell>
                <TableCell>
                  <Badge variant="outline">Done</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">P3</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section title="Cards & alerts">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cycle 24</CardTitle>
                <CardDescription>Mar 3 – Mar 17 · 12 issues</CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={68} className="h-1.5" />
                <p className="mt-2 font-mono text-xs text-muted-foreground">68% complete</p>
              </CardContent>
            </Card>
            <Alert>
              <AlertTitle>Sync required</AlertTitle>
              <AlertDescription>
                GitHub integration needs re-authorization before the next deploy.
              </AlertDescription>
            </Alert>
          </div>
        </Section>

        <Section title="Navigation patterns">
          <Tabs defaultValue="issues">
            <TabsList>
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="cycles">Cycles</TabsTrigger>
            </TabsList>
            <TabsContent value="issues" className="mt-4 text-sm text-muted-foreground">
              Active issues in the current workspace.
            </TabsContent>
            <TabsContent value="projects" className="mt-4 text-sm text-muted-foreground">
              Roadmap and project milestones.
            </TabsContent>
            <TabsContent value="cycles" className="mt-4 text-sm text-muted-foreground">
              Time-boxed sprint containers.
            </TabsContent>
          </Tabs>
          <Separator className="my-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Engineering</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Cycle 24</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>ENG-142</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Section>

        <Section title="Overlays">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Archive project?</DialogTitle>
                  <DialogDescription>
                    Archived projects remain searchable but cannot receive new issues.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Archive</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Popover>
              <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
              <PopoverContent className="w-64">
                <p className="text-sm">Quick filters for the current view.</p>
              </PopoverContent>
            </Popover>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}>
                Menu
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Issue actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Copy link</DropdownMenuItem>
                <DropdownMenuItem>Assign to me</DropdownMenuItem>
                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger render={<Button variant="ghost" />}>Tooltip</TooltipTrigger>
              <TooltipContent>Keyboard shortcut: ⌘K</TooltipContent>
            </Tooltip>
          </div>
        </Section>

        <Section title="Command palette">
          <Command className="max-w-lg border border-border">
            <CommandInput placeholder="Search issues, projects, people…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Issues">
                <CommandItem>ENG-142 · Command palette keyboard nav</CommandItem>
                <CommandItem>ENG-139 · Cycle planning sidebar</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Section>

        <Section title="Misc">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
              <AvatarFallback>BW</AvatarFallback>
            </Avatar>
            <Toggle aria-label="Toggle bold">Bold</Toggle>
            <Skeleton className="h-8 w-32" />
            <Badge>Label</Badge>
            <Badge variant="secondary">Backlog</Badge>
          </div>
          <Accordion defaultValue={["item-1"]} className="mt-4 max-w-lg">
            <AccordionItem value="item-1">
              <AccordionTrigger>Activity log</AccordionTrigger>
              <AccordionContent className="font-mono text-xs text-muted-foreground">
                status changed · priority set to P2 · assigned to @alex
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-4 w-fit rounded-lg border border-border p-3">
            <Calendar mode="single" selected={new Date()} />
          </div>
        </Section>
      </main>
    </div>
  )
}
