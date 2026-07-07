"use client"

import * as React from "react"
import { DirectionProvider } from "@/components/ui/direction"
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
import { CategorySection, ComponentPreview } from "./component-preview"
import { toast } from "sonner"
import { Bar, BarChart, XAxis } from "recharts"
import { Folder, Home, Search, Settings } from "lucide-react"

const chartData = [
  { label: "Mon", value: 12 },
  { label: "Tue", value: 18 },
  { label: "Wed", value: 9 },
  { label: "Thu", value: 22 },
]

const chartConfig = {
  value: { label: "Issues closed", color: "var(--chart-1)" },
}

const comboItems = [
  { value: "eng-142", label: "ENG-142" },
  { value: "eng-139", label: "ENG-139" },
  { value: "eng-128", label: "ENG-128" },
]

export function CatalogSections() {
  const [comboValue, setComboValue] = React.useState<{ value: string; label: string } | null>(
    comboItems[0] ?? null,
  )
  const [cmdOpen, setCmdOpen] = React.useState(false)
  const [direction, setDirection] = React.useState<"ltr" | "rtl">("ltr")

  return (
    <>
      <CategorySection id="actions" title="Actions">
        <ComponentPreview slug="button" name="Button">
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
        </ComponentPreview>

        <ComponentPreview slug="badge" name="Badge">
          <div className="flex flex-wrap gap-2">
            <Badge>Label</Badge>
            <Badge variant="secondary">Backlog</Badge>
            <Badge variant="outline">In progress</Badge>
            <Badge variant="destructive">Blocked</Badge>
          </div>
        </ComponentPreview>

        <ComponentPreview slug="toggle" name="Toggle">
          <Toggle aria-label="Bold">Bold</Toggle>
        </ComponentPreview>

        <ComponentPreview slug="toggle-group" name="Toggle group">
          <ToggleGroup defaultValue={["list"]} variant="outline">
            <ToggleGroupItem value="list">List</ToggleGroupItem>
            <ToggleGroupItem value="board">Board</ToggleGroupItem>
          </ToggleGroup>
        </ComponentPreview>

        <ComponentPreview slug="kbd" name="Kbd">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </ComponentPreview>

        <ComponentPreview slug="button-group" name="Button group">
          <ButtonGroup>
            <Button variant="outline">Previous</Button>
            <Button variant="outline">Next</Button>
          </ButtonGroup>
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="forms" title="Forms">
        <ComponentPreview slug="input" name="Input">
          <Input placeholder="Fix sidebar regression" className="max-w-sm" />
        </ComponentPreview>

        <ComponentPreview slug="textarea" name="Textarea">
          <Textarea rows={2} placeholder="Additional context…" className="max-w-sm" />
        </ComponentPreview>

        <ComponentPreview slug="label" name="Label">
          <div className="max-w-sm space-y-2">
            <Label htmlFor="catalog-label">Issue title</Label>
            <Input id="catalog-label" placeholder="ENG-142" />
          </div>
        </ComponentPreview>

        <ComponentPreview slug="field" name="Field">
          <FieldSet className="max-w-sm">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="catalog-field">Summary</FieldLabel>
                <Input id="catalog-field" placeholder="Ship cycle sidebar" />
                <FieldDescription>Keep titles concise and actionable.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
        </ComponentPreview>

        <ComponentPreview slug="select" name="Select">
          <Select defaultValue="progress">
            <SelectTrigger className="max-w-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="progress">In progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </ComponentPreview>

        <ComponentPreview slug="native-select" name="Native select">
          <NativeSelect defaultValue="medium" className="max-w-sm">
            <NativeSelectOption value="low">Low</NativeSelectOption>
            <NativeSelectOption value="medium">Medium</NativeSelectOption>
            <NativeSelectOption value="high">High</NativeSelectOption>
          </NativeSelect>
        </ComponentPreview>

        <ComponentPreview slug="checkbox" name="Checkbox">
          <div className="flex items-center gap-2">
            <Checkbox id="catalog-urgent" />
            <Label htmlFor="catalog-urgent">Urgent</Label>
          </div>
        </ComponentPreview>

        <ComponentPreview slug="switch" name="Switch">
          <div className="flex items-center gap-2">
            <Switch id="catalog-notify" />
            <Label htmlFor="catalog-notify">Notify</Label>
          </div>
        </ComponentPreview>

        <ComponentPreview slug="radio-group" name="Radio group">
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
        </ComponentPreview>

        <ComponentPreview slug="input-otp" name="Input OTP">
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
        </ComponentPreview>

        <ComponentPreview slug="input-group" name="Input group">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <InputGroupText>
                <Search className="size-4" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="ENG-142…" />
          </InputGroup>
        </ComponentPreview>

        <ComponentPreview slug="combobox" name="Combobox">
          <Combobox items={comboItems} value={comboValue} onValueChange={setComboValue}>
            <ComboboxInput placeholder="Select issue…" className="max-w-sm" />
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
        </ComponentPreview>

        <ComponentPreview slug="slider" name="Slider">
          <Slider defaultValue={[40]} max={100} step={1} className="max-w-sm" />
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="data" title="Data display">
        <ComponentPreview slug="table" name="Table">
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
        </ComponentPreview>

        <ComponentPreview slug="item" name="Item">
          <ItemGroup className="max-w-lg">
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
        </ComponentPreview>

        <ComponentPreview slug="card" name="Card">
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Project velocity</CardTitle>
              <CardDescription>Issues closed per day</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={72} className="h-1" />
            </CardContent>
          </Card>
        </ComponentPreview>

        <ComponentPreview slug="chart" name="Chart">
          <ChartContainer config={chartConfig} className="h-48 max-w-md w-full">
            <BarChart data={chartData}>
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={4} />
            </BarChart>
          </ChartContainer>
        </ComponentPreview>

        <ComponentPreview slug="calendar" name="Calendar">
          <div className="w-fit rounded-lg border border-border p-3">
            <Calendar mode="single" selected={new Date()} />
          </div>
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="feedback" title="Feedback">
        <ComponentPreview slug="alert" name="Alert">
          <Alert className="max-w-lg">
            <AlertTitle>Integration paused</AlertTitle>
            <AlertDescription>GitHub sync requires re-authorization.</AlertDescription>
          </Alert>
        </ComponentPreview>

        <ComponentPreview slug="progress" name="Progress">
          <Progress value={72} className="h-1 max-w-sm" />
        </ComponentPreview>

        <ComponentPreview slug="spinner" name="Spinner">
          <div className="flex items-center gap-2">
            <Spinner />
            <span className="text-sm text-muted-foreground">Syncing…</span>
          </div>
        </ComponentPreview>

        <ComponentPreview slug="skeleton" name="Skeleton">
          <Skeleton className="h-8 w-full max-w-sm" />
        </ComponentPreview>

        <ComponentPreview slug="sonner" name="Sonner">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Issue updated", { description: "ENG-142 saved." })}
            >
              Success
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.error("Sync failed", { description: "Retry in a moment." })}
            >
              Error
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Cycle ends tomorrow")}
            >
              Info
            </Button>
          </div>
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="navigation" title="Navigation">
        <ComponentPreview slug="tabs" name="Tabs">
          <Tabs defaultValue="issues">
            <TabsList variant="line">
              <TabsTrigger value="issues">Issues</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="cycles">Cycles</TabsTrigger>
            </TabsList>
            <TabsContent value="issues" className="mt-3 text-sm text-muted-foreground">
              Active issues in workspace.
            </TabsContent>
          </Tabs>
        </ComponentPreview>

        <ComponentPreview slug="breadcrumb" name="Breadcrumb">
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
        </ComponentPreview>

        <ComponentPreview slug="pagination" name="Pagination">
          <Pagination>
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
        </ComponentPreview>

        <ComponentPreview slug="menubar" name="Menubar">
          <Menubar className="w-fit">
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New issue</MenubarItem>
                <MenubarItem>Import</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </ComponentPreview>

        <ComponentPreview slug="navigation-menu" name="Navigation menu">
          <NavigationMenu className="max-w-full justify-start">
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
        </ComponentPreview>

        <ComponentPreview slug="sidebar" name="Sidebar">
          <div className="h-[min(16rem,40vh)] w-full max-w-xl overflow-hidden rounded-lg border border-border">
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
              </SidebarInset>
            </SidebarProvider>
          </div>
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="overlays" title="Overlays">
        <ComponentPreview slug="dialog" name="Dialog">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Archive project</DialogTitle>
                <DialogDescription>Archived projects stay searchable.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </ComponentPreview>

        <ComponentPreview slug="alert-dialog" name="Alert dialog">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Open alert dialog
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
        </ComponentPreview>

        <ComponentPreview slug="sheet" name="Sheet">
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>Open sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Refine the issue list.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </ComponentPreview>

        <ComponentPreview slug="drawer" name="Drawer">
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>Open drawer</DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Mobile filters</DrawerTitle>
                <DrawerDescription>Swipe to dismiss.</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </ComponentPreview>

        <ComponentPreview slug="popover" name="Popover">
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>Open popover</PopoverTrigger>
            <PopoverContent className="w-56 text-sm">Quick filter presets.</PopoverContent>
          </Popover>
        </ComponentPreview>

        <ComponentPreview slug="hover-card" name="Hover card">
          <HoverCard>
            <HoverCardTrigger render={<Button variant="outline" />}>Hover me</HoverCardTrigger>
            <HoverCardContent className="w-64 text-sm">Issue preview on hover.</HoverCardContent>
          </HoverCard>
        </ComponentPreview>

        <ComponentPreview slug="dropdown-menu" name="Dropdown menu">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>Open menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Copy link</DropdownMenuItem>
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ComponentPreview>

        <ComponentPreview slug="context-menu" name="Context menu">
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
        </ComponentPreview>

        <ComponentPreview slug="tooltip" name="Tooltip">
          <Tooltip>
            <TooltipTrigger render={<Button variant="ghost" />}>Hover for tip</TooltipTrigger>
            <TooltipContent>Keyboard: ⌘K</TooltipContent>
          </Tooltip>
        </ComponentPreview>

        <ComponentPreview slug="command" name="Command">
          <Command className="max-w-lg border border-border">
            <CommandInput placeholder="Search…" />
            <CommandList>
              <CommandEmpty>No results.</CommandEmpty>
              <CommandGroup heading="Issues">
                <CommandItem>ENG-142 · Command palette</CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="layout" title="Layout">
        <ComponentPreview slug="accordion" name="Accordion">
          <Accordion defaultValue={["a1"]} className="max-w-lg">
            <AccordionItem value="a1">
              <AccordionTrigger>Activity</AccordionTrigger>
              <AccordionContent className="font-mono text-xs text-muted-foreground">
                status → in progress
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ComponentPreview>

        <ComponentPreview slug="collapsible" name="Collapsible">
          <Collapsible className="max-w-lg">
            <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
              Show metadata
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 text-sm text-muted-foreground">
              Assignee, labels, cycle, project.
            </CollapsibleContent>
          </Collapsible>
        </ComponentPreview>

        <ComponentPreview slug="scroll-area" name="Scroll area">
          <ScrollArea className="h-24 w-full max-w-lg rounded-lg border border-border p-3">
            <div className="space-y-2 text-sm text-muted-foreground">
              {Array.from({ length: 8 }).map((_, i) => (
                <p key={i}>Activity event {i + 1}</p>
              ))}
            </div>
          </ScrollArea>
        </ComponentPreview>

        <ComponentPreview slug="resizable" name="Resizable">
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-28 max-w-lg rounded-lg border border-border"
          >
            <ResizablePanel defaultSize={50} className="p-3 text-sm text-muted-foreground">
              List pane
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50} className="p-3 text-sm text-muted-foreground">
              Detail pane
            </ResizablePanel>
          </ResizablePanelGroup>
        </ComponentPreview>

        <ComponentPreview slug="separator" name="Separator">
          <div className="max-w-sm space-y-2">
            <p className="text-sm">Section A</p>
            <Separator />
            <p className="text-sm text-muted-foreground">Section B</p>
          </div>
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="media" title="Media & messaging">
        <ComponentPreview slug="aspect-ratio" name="Aspect ratio">
          <AspectRatio ratio={16 / 9} className="max-w-xs overflow-hidden rounded-lg bg-muted">
            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
              16:9
            </div>
          </AspectRatio>
        </ComponentPreview>

        <ComponentPreview slug="avatar" name="Avatar">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
        </ComponentPreview>

        <ComponentPreview slug="attachment" name="Attachment">
          <Attachment className="max-w-md">
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
        </ComponentPreview>

        <ComponentPreview slug="bubble" name="Bubble">
          <Bubble className="max-w-md">
            <BubbleContent>Ship the cycle sidebar this week.</BubbleContent>
            <p className="px-1 font-mono text-xs text-muted-foreground">@alex · 2m ago</p>
          </Bubble>
        </ComponentPreview>

        <ComponentPreview slug="message" name="Message">
          <Message className="max-w-md">
            <MessageContent>Agent completed code review on ENG-142.</MessageContent>
          </Message>
        </ComponentPreview>

        <ComponentPreview slug="message-scroller" name="Message scroller">
          <MessageScrollerProvider>
            <MessageScroller className="max-w-md">
              <MessageScrollerViewport className="h-28">
                <MessageScrollerContent>
                  <MessageScrollerItem>User created issue</MessageScrollerItem>
                  <MessageScrollerItem>Status changed</MessageScrollerItem>
                  <MessageScrollerItem>Comment added</MessageScrollerItem>
                </MessageScrollerContent>
              </MessageScrollerViewport>
            </MessageScroller>
          </MessageScrollerProvider>
        </ComponentPreview>

        <ComponentPreview slug="carousel" name="Carousel">
          <Carousel className="max-w-md">
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
        </ComponentPreview>

        <ComponentPreview slug="empty" name="Empty">
          <Empty className="max-w-md border border-dashed">
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
        </ComponentPreview>

        <ComponentPreview slug="marker" name="Marker">
          <Marker variant="separator" className="max-w-md">
            <MarkerContent>Today</MarkerContent>
          </Marker>
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="utilities" title="Utilities">
        <ComponentPreview slug="direction" name="Direction">
          <DirectionProvider direction={direction}>
            <div className="flex max-w-sm flex-col gap-3">
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                onClick={() => setDirection((value) => (value === "ltr" ? "rtl" : "ltr"))}
              >
                Toggle direction ({direction})
              </Button>
              <Input placeholder="Text follows document direction" />
            </div>
          </DirectionProvider>
        </ComponentPreview>
      </CategorySection>

      <CategorySection id="linear" title="Linear patterns">
        <ComponentPreview slug="cycle-panel" name="Cycle panel">
          <CyclePanel
            name="Cycle 24"
            dateRange="Mar 3 – Mar 17"
            issueCount={12}
            progress={68}
          />
        </ComponentPreview>

        <ComponentPreview slug="issue-row" name="Issue row">
          <div className="max-w-xl overflow-hidden rounded-lg border border-border">
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
        </ComponentPreview>

        <ComponentPreview slug="command-shell" name="Command shell">
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
        </ComponentPreview>
      </CategorySection>
    </>
  )
}
