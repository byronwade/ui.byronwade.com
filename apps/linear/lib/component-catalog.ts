export const COMPONENT_CATEGORIES = [
  { id: "actions", label: "Actions" },
  { id: "forms", label: "Forms" },
  { id: "data", label: "Data display" },
  { id: "feedback", label: "Feedback" },
  { id: "navigation", label: "Navigation" },
  { id: "overlays", label: "Overlays" },
  { id: "layout", label: "Layout" },
  { id: "media", label: "Media & messaging" },
  { id: "utilities", label: "Utilities" },
  { id: "linear", label: "Linear patterns" },
] as const

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number]["id"]

export type CatalogComponent = {
  slug: string
  name: string
  category: ComponentCategory
}

/** Every shadcn primitive in apps/linear/components/ui plus Linear composites. */
export const CATALOG_COMPONENTS: CatalogComponent[] = [
  { slug: "button", name: "Button", category: "actions" },
  { slug: "badge", name: "Badge", category: "actions" },
  { slug: "toggle", name: "Toggle", category: "actions" },
  { slug: "toggle-group", name: "Toggle group", category: "actions" },
  { slug: "kbd", name: "Kbd", category: "actions" },
  { slug: "button-group", name: "Button group", category: "actions" },
  { slug: "input", name: "Input", category: "forms" },
  { slug: "textarea", name: "Textarea", category: "forms" },
  { slug: "label", name: "Label", category: "forms" },
  { slug: "field", name: "Field", category: "forms" },
  { slug: "select", name: "Select", category: "forms" },
  { slug: "native-select", name: "Native select", category: "forms" },
  { slug: "checkbox", name: "Checkbox", category: "forms" },
  { slug: "switch", name: "Switch", category: "forms" },
  { slug: "radio-group", name: "Radio group", category: "forms" },
  { slug: "input-otp", name: "Input OTP", category: "forms" },
  { slug: "input-group", name: "Input group", category: "forms" },
  { slug: "combobox", name: "Combobox", category: "forms" },
  { slug: "slider", name: "Slider", category: "forms" },
  { slug: "table", name: "Table", category: "data" },
  { slug: "item", name: "Item", category: "data" },
  { slug: "card", name: "Card", category: "data" },
  { slug: "chart", name: "Chart", category: "data" },
  { slug: "calendar", name: "Calendar", category: "data" },
  { slug: "alert", name: "Alert", category: "feedback" },
  { slug: "progress", name: "Progress", category: "feedback" },
  { slug: "spinner", name: "Spinner", category: "feedback" },
  { slug: "skeleton", name: "Skeleton", category: "feedback" },
  { slug: "sonner", name: "Sonner", category: "feedback" },
  { slug: "tabs", name: "Tabs", category: "navigation" },
  { slug: "breadcrumb", name: "Breadcrumb", category: "navigation" },
  { slug: "pagination", name: "Pagination", category: "navigation" },
  { slug: "menubar", name: "Menubar", category: "navigation" },
  { slug: "navigation-menu", name: "Navigation menu", category: "navigation" },
  { slug: "sidebar", name: "Sidebar", category: "navigation" },
  { slug: "dialog", name: "Dialog", category: "overlays" },
  { slug: "alert-dialog", name: "Alert dialog", category: "overlays" },
  { slug: "sheet", name: "Sheet", category: "overlays" },
  { slug: "drawer", name: "Drawer", category: "overlays" },
  { slug: "popover", name: "Popover", category: "overlays" },
  { slug: "hover-card", name: "Hover card", category: "overlays" },
  { slug: "dropdown-menu", name: "Dropdown menu", category: "overlays" },
  { slug: "context-menu", name: "Context menu", category: "overlays" },
  { slug: "tooltip", name: "Tooltip", category: "overlays" },
  { slug: "command", name: "Command", category: "overlays" },
  { slug: "accordion", name: "Accordion", category: "layout" },
  { slug: "collapsible", name: "Collapsible", category: "layout" },
  { slug: "scroll-area", name: "Scroll area", category: "layout" },
  { slug: "resizable", name: "Resizable", category: "layout" },
  { slug: "separator", name: "Separator", category: "layout" },
  { slug: "aspect-ratio", name: "Aspect ratio", category: "media" },
  { slug: "avatar", name: "Avatar", category: "media" },
  { slug: "attachment", name: "Attachment", category: "media" },
  { slug: "bubble", name: "Bubble", category: "media" },
  { slug: "message", name: "Message", category: "media" },
  { slug: "message-scroller", name: "Message scroller", category: "media" },
  { slug: "carousel", name: "Carousel", category: "media" },
  { slug: "empty", name: "Empty", category: "media" },
  { slug: "marker", name: "Marker", category: "media" },
  { slug: "direction", name: "Direction", category: "utilities" },
  { slug: "issue-row", name: "Issue row", category: "linear" },
  { slug: "cycle-panel", name: "Cycle panel", category: "linear" },
  { slug: "command-shell", name: "Command shell", category: "linear" },
  { slug: "agent-timeline", name: "Agent timeline", category: "linear" },
  { slug: "ask-linear-panel", name: "Ask Linear panel", category: "linear" },
]

export function getCatalogComponent(slug: string) {
  return CATALOG_COMPONENTS.find((c) => c.slug === slug)
}
