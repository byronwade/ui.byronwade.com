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
] as const

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number]["id"]

export type CatalogComponent = {
  slug: string
  name: string
  category: ComponentCategory
}

/** Every shadcn primitive in apps/polaris/components/ui. */
export const CATALOG_COMPONENTS: CatalogComponent[] = [
  { slug: "badge", name: "Badge", category: "actions" },
  { slug: "button", name: "Button", category: "actions" },
  { slug: "button-group", name: "Button Group", category: "actions" },
  { slug: "kbd", name: "Kbd", category: "actions" },
  { slug: "toggle", name: "Toggle", category: "actions" },
  { slug: "toggle-group", name: "Toggle Group", category: "actions" },
  { slug: "checkbox", name: "Checkbox", category: "forms" },
  { slug: "combobox", name: "Combobox", category: "forms" },
  { slug: "field", name: "Field", category: "forms" },
  { slug: "input", name: "Input", category: "forms" },
  { slug: "input-group", name: "Input Group", category: "forms" },
  { slug: "input-otp", name: "Input OTP", category: "forms" },
  { slug: "label", name: "Label", category: "forms" },
  { slug: "native-select", name: "Native Select", category: "forms" },
  { slug: "radio-group", name: "Radio Group", category: "forms" },
  { slug: "select", name: "Select", category: "forms" },
  { slug: "slider", name: "Slider", category: "forms" },
  { slug: "switch", name: "Switch", category: "forms" },
  { slug: "textarea", name: "Textarea", category: "forms" },
  { slug: "calendar", name: "Calendar", category: "data" },
  { slug: "card", name: "Card", category: "data" },
  { slug: "chart", name: "Chart", category: "data" },
  { slug: "item", name: "Item", category: "data" },
  { slug: "table", name: "Table", category: "data" },
  { slug: "alert", name: "Alert", category: "feedback" },
  { slug: "progress", name: "Progress", category: "feedback" },
  { slug: "skeleton", name: "Skeleton", category: "feedback" },
  { slug: "sonner", name: "Sonner", category: "feedback" },
  { slug: "spinner", name: "Spinner", category: "feedback" },
  { slug: "breadcrumb", name: "Breadcrumb", category: "navigation" },
  { slug: "menubar", name: "Menubar", category: "navigation" },
  { slug: "navigation-menu", name: "Navigation Menu", category: "navigation" },
  { slug: "pagination", name: "Pagination", category: "navigation" },
  { slug: "sidebar", name: "Sidebar", category: "navigation" },
  { slug: "tabs", name: "Tabs", category: "navigation" },
  { slug: "alert-dialog", name: "Alert Dialog", category: "overlays" },
  { slug: "command", name: "Command", category: "overlays" },
  { slug: "context-menu", name: "Context Menu", category: "overlays" },
  { slug: "dialog", name: "Dialog", category: "overlays" },
  { slug: "drawer", name: "Drawer", category: "overlays" },
  { slug: "dropdown-menu", name: "Dropdown Menu", category: "overlays" },
  { slug: "hover-card", name: "Hover Card", category: "overlays" },
  { slug: "popover", name: "Popover", category: "overlays" },
  { slug: "sheet", name: "Sheet", category: "overlays" },
  { slug: "tooltip", name: "Tooltip", category: "overlays" },
  { slug: "accordion", name: "Accordion", category: "layout" },
  { slug: "collapsible", name: "Collapsible", category: "layout" },
  { slug: "resizable", name: "Resizable", category: "layout" },
  { slug: "scroll-area", name: "Scroll Area", category: "layout" },
  { slug: "separator", name: "Separator", category: "layout" },
  { slug: "aspect-ratio", name: "Aspect Ratio", category: "media" },
  { slug: "attachment", name: "Attachment", category: "media" },
  { slug: "avatar", name: "Avatar", category: "media" },
  { slug: "bubble", name: "Bubble", category: "media" },
  { slug: "carousel", name: "Carousel", category: "media" },
  { slug: "message", name: "Message", category: "media" },
  { slug: "message-scroller", name: "Message Scroller", category: "media" },
  { slug: "direction", name: "Direction", category: "utilities" },
  { slug: "empty", name: "Empty", category: "utilities" },
  { slug: "marker", name: "Marker", category: "utilities" },
]

export function getCatalogComponent(slug: string) {
  return CATALOG_COMPONENTS.find((c) => c.slug === slug)
}
