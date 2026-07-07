"use client"

import * as React from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import {
  Attachment,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
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
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import { Marker, MarkerContent } from "@/components/ui/marker"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Message, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { CommandShell, CyclePanel, IssueRow } from "@/components/linear"
import { toast } from "sonner"
import { Bar, BarChart, XAxis } from "recharts"
import { Folder, Home, Search, Settings } from "lucide-react"

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-4">
      <div>
        <h2 className="text-lg font-medium tracking-tight">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="rounded-lg border border-border bg-card p-5">{children}</div>
    </section>
  )
}

const chartData = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 9 },
  { label: "Thu", value: 22 },
]

const chartConfig = {
  value: { label: "Issues closed", color: "var(--chart-1)" },
}

export function CatalogSections() {
  const [comboValue, setComboValue] = React.useState<{ value: string; label: string } | null>({
    value: "eng-142",
    label: "ENG-142",
  })
  const [cmdOpen, setCmdOpen] = React.useState(false)
  const comboItems = [
    { value: "eng-142", label: "ENG-142" },
    { value: "eng-139", label: "ENG-139" },
    { value: "eng-128", label: "ENG-128" },
  ]

  return (
    <>
      <Section id="actions" title="Actions" description="Button, badge, toggle, kbd.">
        <div className="flex flex-wrap gap-2">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="icon" aria-label="Search">
            <Search className="size-4" />
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge>Label</Badge>
          <Badge variant="secondary">Backlog</Badge>
          <Badge variant="outline">In progress</Badge>
          <Badge variant="destructive">Blocked</Badge>
          <Toggle aria-label="Bold">Bold</Toggle>
          <ToggleGroup defaultValue={["list"]} variant="outline">
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="board">Board</ToggleGroupItem>
          </ToggleGroup>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </div>
        <ButtonGroup className="mt-4">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
        </ButtonGroup>
      </Section>

      <Section id="forms" title="Forms" description="Inputs, selects, fields, OTP.">
        <FieldSet className="max-w-lg">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="catalog-title">Issue title</FieldLabel>
              <Input id="catalog-title" placeholder="Fix sidebar regression" />
              <FieldDescription>Keep titles concise and actionable.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="catalog-notes">Notes</FieldLabel>
              <Textarea id="catalog-notes" rows={2} placeholder="Additional context…" />
            </Field>
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select defaultValue="progress">
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="progress">In progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Native select</FieldLabel>
              <NativeSelect defaultValue="medium">
                <NativeSelectOption value="low">Low</NativeSelectOption>
                <NativeSelectOption value="medium">Medium</NativeSelectOption>
                <NativeSelectOption value="high">High</NativeSelectOption>
              </NativeSelect>
            </Field>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Checkbox id="catalog-urgent" />
                <Label htmlFor="catalog-urgent">Urgent</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch id="catalog-notify" />
                <Label htmlFor="catalog-notify">Notify</Label>
              </div>
            </div>
            <RadioGroup defaultValue="team-a" className="flex gap-4">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="team-a" id="team-a" />
                <Label htmlFor="team-a">Engineering</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="team-b" id="team-b" />
                <Label htmlFor="team-b">Design</Label>
              </div>
            </RadioGroup>
            <Field>
              <FieldLabel>Verification code</FieldLabel>
              <InputOTP maxLength={6}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </Field>
            <Field>
              <FieldLabel>Search issues</FieldLabel>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>
                    <Search className="size-4" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupInput placeholder="ENG-142…" />
              </InputGroup>
            </Field>
            <Field>
              <FieldLabel>Combobox</FieldLabel>
              <Combobox items={comboItems} value={comboValue} onValueChange={setComboValue}>
                <ComboboxInput placeholder="Select issue…" />
                <ComboboxContent>
                  <ComboboxEmpty>No match.</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field>
              <FieldLabel>Priority</FieldLabel>
              <Slider defaultValue={[40]} max={100} step={1} />
            </Field>
          </FieldGroup>
        </FieldSet>
      </Section>

      <Section id="data" title="Data display" description="Table, item, card, chart, calendar.">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono text-xs">ENG-142</TableCell>
              <TableCell>Command palette nav</TableCell>
              <TableCell>
                <Badge variant="outline">Active</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <ItemGroup className="mt-4 max-w-lg">
          <Item variant="outline">
            <ItemMedia variant="icon">
              <Folder className="size-4" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Cycle 24</ItemTitle>
              <ItemDescription>12 issues · ends Mar 17</ItemDescription>
            </ItemContent>
            <ItemActions>
              <Badge variant="outline">68%</Badge>
            </ItemActions>
          </Item>
        </ItemGroup>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Project velocity</CardTitle>
              <CardDescription>Issues closed per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-48 w-full">
                <BarChart data={chartData}>
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <div className="w-fit rounded-lg border border-border p-3">
            <Calendar mode="single" selected={new Date()} />
          </div>
        </div>
      </Section>

      <Section id="feedback" title="Feedback" description="Alert, progress, skeleton, spinner, toast.">
        <div className="grid gap-4 md:grid-cols-2">
          <Alert>
            <AlertTitle>Integration paused</AlertTitle>
            <AlertDescription>GitHub sync requires re-authorization.</AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Progress value={72} className="h-1" />
            <div className="flex items-center gap-2">
              <Spinner />
              <span className="text-sm text-muted-foreground">Syncing…</span>
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => toast.success("Issue updated", { description: "ENG-142 saved." })}
        >
          Show toast
        </Button>
      </Section>

      <Section id="navigation" title="Navigation" description="Tabs, breadcrumb, pagination, menubar.">
        <Tabs defaultValue="issues">
          <TabsList>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="cycles">Cycles</TabsTrigger>
          </TabsList>
          <TabsContent value="issues" className="mt-3 text-sm text-muted-foreground">
            Active issues in workspace.
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
              <BreadcrumbPage>Cycle 24</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Menubar className="mt-4 w-fit">
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New issue</MenubarItem>
              <MenubarItem>Import</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <NavigationMenu className="mt-4 max-w-full justify-start">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Product</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="#" className="block p-3 text-sm">
                  Issues
                </NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Section>

      <Section id="overlays" title="Overlays" description="Dialog, sheet, drawer, menus, command.">
        <div className="flex flex-wrap gap-2">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Archive project</DialogTitle>
                <DialogDescription>Archived projects stay searchable.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Alert dialog
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete issue?</AlertDialogTitle>
                <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>Sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine the issue list.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>Drawer</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Mobile filters</DrawerTitle>
                <DrawerDescription>Swipe to dismiss.</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
            <PopoverContent className="w-56 text-sm">Quick filter presets.</PopoverContent>
          </Popover>
          <HoverCard>
            <HoverCardTrigger render={<Button variant="outline" />}>Hover</HoverCardTrigger>
            <HoverCardContent className="w-64 text-sm">Issue preview on hover.</HoverCardContent>
          </HoverCard>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ContextMenu>
            <ContextMenuTrigger
              render={
                <div className="flex h-16 w-40 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                  Right click
                </div>
              }
            />
            <ContextMenuContent>
              <ContextMenuItem>Open</ContextMenuItem>
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" />}>Tip</TooltipTrigger>
            <TooltipContent>Keyboard: ⌘K</TooltipContent>
          </Tooltip>
        </div>
        <Command className="mt-4 max-w-lg border border-border">
          <CommandInput placeholder="Search…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Issues">
              <CommandItem>ENG-142 · Command palette</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </Section>

      <Section id="layout" title="Layout" description="Accordion, collapsible, scroll, resizable, separator.">
        <Accordion defaultValue={["a1"]} className="max-w-lg">
          <AccordionItem value="a1">
            <AccordionTrigger>Activity</AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-muted-foreground">
              status → in progress
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Collapsible className="mt-4 max-w-lg">
          <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
            Show metadata
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
            Assignee, labels, cycle, project.
          </CollapsibleContent>
        </Collapsible>
        <ScrollArea className="mt-4 h-24 w-full max-w-lg rounded-lg border border-border p-3">
          <div className="space-y-2 text-sm text-muted-foreground">
            {Array.from({ length: 8 }).map((_, i) => (
              <p key={i}>Activity event {i + 1}</p>
            ))}
          </div>
        </ScrollArea>
        <ResizablePanelGroup orientation="horizontal" className="mt-4 min-h-28 max-w-lg rounded-lg border border-border">
          <ResizablePanel defaultSize={50} className="p-3 text-sm text-muted-foreground">
            List pane
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} className="p-3 text-sm text-muted-foreground">
            Detail pane
          </ResizablePanel>
        </ResizablePanelGroup>
      </Section>

      <Section id="media" title="Media & misc" description="Avatar, attachment, bubble, message, carousel, empty.">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <Marker variant="separator" className="max-w-md">
            <MarkerContent>Today</MarkerContent>
          </Marker>
          <AspectRatio ratio={16 / 9} className="w-48 overflow-hidden rounded-lg bg-muted">
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              16:9
            </div>
          </AspectRatio>
        </div>
        <Attachment className="mt-4 max-w-md">
          <AttachmentMedia />
          <AttachmentContent>
            <AttachmentTitle>spec.pdf</AttachmentTitle>
            <AttachmentDescription>248 KB · uploaded 2h ago</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <Button size="sm" variant="outline">
              Download
            </Button>
          </AttachmentActions>
        </Attachment>
        <Bubble className="mt-4 max-w-md">
          <BubbleContent>Ship the cycle sidebar this week.</BubbleContent>
          <p className="px-1 font-mono text-xs text-muted-foreground">@alex · 2m ago</p>
        </Bubble>
        <Message className="mt-4 max-w-md">
          <MessageContent>Agent completed code review on ENG-142.</MessageContent>
        </Message>
        <MessageScrollerProvider>
          <MessageScroller className="mt-4 max-w-md">
            <MessageScrollerViewport className="h-28">
              <MessageScrollerContent>
                <MessageScrollerItem>User created issue</MessageScrollerItem>
                <MessageScrollerItem>Status changed</MessageScrollerItem>
                <MessageScrollerItem>Comment added</MessageScrollerItem>
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
        <Carousel className="mt-4 max-w-md">
          <CarouselContent>
            {["Plan", "Build", "Review"].map((label) => (
              <CarouselItem key={label}>
                <Card>
                  <CardHeader>
                    <CardTitle>{label}</CardTitle>
                  </CardHeader>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
        <Empty className="mt-4 max-w-md border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Folder className="size-4" />
            </EmptyMedia>
            <EmptyTitle>No issues</EmptyTitle>
            <EmptyDescription>Create one to get started.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Create issue</Button>
          </EmptyContent>
        </Empty>
      </Section>

      <Section id="sidebar" title="Sidebar" description="Collapsible app chrome with inset layout.">
        <div className="h-[min(20rem,50vh)] w-full max-w-2xl overflow-hidden rounded-lg border border-border">
          <SidebarProvider className="relative h-full min-h-0">
            <Sidebar collapsible="icon">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip="Issues">
                          <Home className="size-4" />
                          Issues
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Settings">
                          <Settings className="size-4" />
                          Settings
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
            <SidebarInset className="min-h-0">
              <header className="flex h-10 shrink-0 items-center gap-2 border-b border-border px-3">
                <SidebarTrigger />
                <span className="text-sm">Active view</span>
              </header>
              <div className="p-3 text-sm text-muted-foreground">Sidebar inset content</div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </Section>

      <Section id="linear" title="Linear patterns" description="Issue row, cycle panel, command shell.">
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <CyclePanel
            name="Cycle 24"
            dateRange="Mar 3 – Mar 17"
            issueCount={12}
            progress={68}
          />
          <div className="overflow-hidden rounded-lg border border-border">
            <IssueRow
              id="ENG-142"
              title="Refactor command palette keyboard nav"
              statusLabel="In progress"
              priority="P2"
              assignee={{ name: "Alex", initials: "AC" }}
            />
            <IssueRow
              id="ENG-139"
              title="Ship cycle planning sidebar"
              statusLabel="Todo"
              priority="P1"
              assignee={{ name: "Sam", initials: "SR" }}
            />
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={() => setCmdOpen(true)}>
            Open command shell
          </Button>
          <CommandShell
            open={cmdOpen}
            onOpenChange={setCmdOpen}
            items={[
              { id: "eng-142", label: "ENG-142 · Command palette", group: "Issues" },
              { id: "eng-139", label: "ENG-139 · Cycle sidebar", group: "Issues" },
            ]}
          />
        </div>
      </Section>
    </>
  )
}
