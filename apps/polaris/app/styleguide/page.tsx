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
  id,
  title,
  description,
  children,
}: {
  id?: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-16 space-y-4">
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
              Polaris UI
            </Link>
            <span className="text-muted-foreground">/</span>
            <Link href="/catalog" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Catalog
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm text-foreground">Styleguide</span>
          </div>
          <Badge variant="outline">shadcn --all · catalog + specimens</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-12 px-6 py-10">
        <div>
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            ui.byronwade.com/polaris
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Component styleguide</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Every primitive below uses Polaris tokens from{" "}
            <code className="font-mono text-xs">design-research/SHOPIFY-DESIGN-SYSTEM.md</code> —
            gray canvas and white cards, teal success accent, Inter typography, hairline borders, and
            dense admin density.
          </p>
        </div>

        <Section
          id="button"
          title="Buttons"
          description="8px radius, 600 weight, dark-neutral primary fill."
        >
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
        </Section>

        <Section id="input" title="Form controls">
          <div className="grid max-w-md gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-title">Product title</Label>
              <Input id="product-title" placeholder="Organic cotton tote" />
            </div>
            <div id="textarea" className="scroll-mt-16 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Short product description…" rows={3} />
            </div>
            <div id="select" className="scroll-mt-16">
              <Select defaultValue="active">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-6">
              <div id="checkbox" className="flex scroll-mt-16 items-center gap-2">
                <Checkbox id="tracked" />
                <Label htmlFor="tracked">Track quantity</Label>
              </div>
              <div id="switch" className="flex scroll-mt-16 items-center gap-2">
                <Switch id="online" />
                <Label htmlFor="online">Online store</Label>
              </div>
            </div>
            <div id="radio-group" className="scroll-mt-16">
              <RadioGroup defaultValue="physical" className="flex gap-4">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="physical" id="physical" />
                  <Label htmlFor="physical">Physical</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="digital" id="digital" />
                  <Label htmlFor="digital">Digital</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="service" id="service" />
                  <Label htmlFor="service">Service</Label>
                </div>
              </RadioGroup>
            </div>
            <div id="label" className="scroll-mt-16 text-xs text-muted-foreground">
              Labels use the shared <code className="font-mono">label</code> primitive.
            </div>
          </div>
        </Section>

        <Section
          id="table"
          title="Orders table"
          description="Dense index rows, metadata in mono."
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">#1042</TableCell>
                <TableCell>Alex Rivera</TableCell>
                <TableCell>
                  <Badge variant="outline">Fulfilled</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">$128.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">#1041</TableCell>
                <TableCell>Jordan Lee</TableCell>
                <TableCell>
                  <Badge variant="outline">Unfulfilled</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">$64.50</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-xs text-muted-foreground">#1040</TableCell>
                <TableCell>Sam Chen</TableCell>
                <TableCell>
                  <Badge variant="outline">Paid</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs">$42.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Section>

        <Section id="card" title="Cards & alerts">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s sales</CardTitle>
                <CardDescription>Mar 3 · 12 orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div id="progress" className="scroll-mt-16">
                  <Progress value={68} className="h-1.5" />
                </div>
                <p className="mt-2 font-mono text-xs text-muted-foreground">68% of daily goal</p>
              </CardContent>
            </Card>
            <div id="alert" className="scroll-mt-16">
              <Alert>
                <AlertTitle>Payment gateway</AlertTitle>
                <AlertDescription>
                  Shopify Payments needs verification before the next payout.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </Section>

        <Section id="tabs" title="Navigation patterns">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="mt-4 text-sm text-muted-foreground">
              Open and fulfilled orders in the current store.
            </TabsContent>
            <TabsContent value="products" className="mt-4 text-sm text-muted-foreground">
              Catalog, inventory, and variants.
            </TabsContent>
            <TabsContent value="customers" className="mt-4 text-sm text-muted-foreground">
              Customer profiles and segments.
            </TabsContent>
          </Tabs>
          <div id="separator" className="scroll-mt-16">
            <Separator className="my-4" />
          </div>
          <div id="breadcrumb" className="scroll-mt-16">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Products</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Apparel</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Organic cotton tote</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </Section>

        <Section id="dialog" title="Overlays">
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Archive product?</DialogTitle>
                  <DialogDescription>
                    Archived products stay searchable but are hidden from the online store.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Archive</Button>
                </div>
              </DialogContent>
            </Dialog>

            <div id="popover" className="scroll-mt-16">
              <Popover>
                <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
                <PopoverContent className="w-64">
                  <p className="text-sm">Quick filters for the current index.</p>
                </PopoverContent>
              </Popover>
            </div>

            <div id="dropdown-menu" className="scroll-mt-16">
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="outline" />}>
                  Menu
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Product actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                  <DropdownMenuItem>View on store</DropdownMenuItem>
                  <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div id="tooltip" className="scroll-mt-16">
              <Tooltip>
                <TooltipTrigger render={<Button variant="ghost" />}>Tooltip</TooltipTrigger>
                <TooltipContent>Keyboard shortcut: ⌘K</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </Section>

        <Section id="command" title="Command palette">
          <Command className="max-w-lg border border-border">
            <CommandInput placeholder="Search products, orders, customers…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Products">
                <CommandItem>Organic cotton tote · Apparel</CommandItem>
                <CommandItem>Ceramic mug set · Home</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </Section>

        <Section id="badge" title="Misc">
          <div className="flex flex-wrap items-center gap-4">
            <div id="avatar" className="scroll-mt-16">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>BW</AvatarFallback>
              </Avatar>
            </div>
            <div id="toggle" className="scroll-mt-16">
              <Toggle aria-label="Toggle bold">Bold</Toggle>
            </div>
            <div id="skeleton" className="scroll-mt-16">
              <Skeleton className="h-8 w-32" />
            </div>
            <Badge>Label</Badge>
            <Badge variant="secondary">Draft</Badge>
          </div>
          <div id="accordion" className="scroll-mt-16">
            <Accordion defaultValue={["item-1"]} className="mt-4 max-w-lg">
              <AccordionItem value="item-1">
                <AccordionTrigger>Activity log</AccordionTrigger>
                <AccordionContent className="font-mono text-xs text-muted-foreground">
                  inventory adjusted · status set to Active · published to Online Store
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div id="calendar" className="mt-4 w-fit scroll-mt-16 rounded-lg border border-border p-3">
            <Calendar mode="single" selected={new Date()} />
          </div>
        </Section>
      </main>
    </div>
  )
}
