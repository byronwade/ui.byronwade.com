export type PropRow = {
  name: string
  type: string
  default?: string
  description: string
}
export type Variant = {
  /** Stable, unique within a type; kebab-case. Becomes the #anchor + search id. */
  id: string
  /** Human label, e.g. "Ghost · small". */
  name: string
  /** Facet tags: "variant:ghost", "size:sm", "content:icon-only", "state:loading", … */
  tags: string[]
  /** Example file base under content/examples/<slug>/ that renders this variant. */
  example: string
  /** Optional per-variant install ref; falls back to the type install when absent. */
  install?: string
}
export type ComponentDoc = {
  slug: string
  name: string
  category:
    | "Foundation"
    | "Libraries"
    | "UI"
    | "Composites"
    | "Primitives"
    | "Forms"
    | "Overlays"
    | "Feedback"
    | "Data display"
    | "Patterns"
    | "Charts"
    | "House components"
    | "Morph"
    | "Media"
    | "Commerce"
    | "AI"
  description: string
  npmDeps?: string[]
  registryDeps?: string[]
  props?: PropRow[]
  examples: string[]
  /** Type-level facet tags (drive catalog filters + AI match). */
  tags?: string[]
  /** Authored variants. Absent ⇒ getVariants() synthesizes a single default. */
  variants?: Variant[]
}

export const components: ComponentDoc[] = [
  {
    slug: "foundation",
    name: "Foundation",
    category: "Foundation",
    description:
      "Complete token base — neutrals + brand-derived accent, status/dock/chart/sidebar tokens, radius scale. Install via `shadcn init`.",
    examples: ["tokens"],
  },
  {
    slug: "utils",
    name: "cn()",
    category: "Libraries",
    description: "clsx + tailwind-merge class combiner.",
    npmDeps: ["clsx", "tailwind-merge"],
    examples: [],
  },
  {
    slug: "identity",
    name: "Anonymous identity",
    category: "Libraries",
    description:
      "Deterministic animal-name + OKLCH gradient from a seed string.",
    examples: ["names"],
  },
  {
    slug: "status-dot",
    name: "Status dot",
    category: "UI",
    description: "Atomic status indicator dot with tone + optional pulse.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      {
        name: "tone",
        type: '"success" | "warning" | "danger" | "info" | "neutral"',
        default: '"neutral"',
        description: "Color tone.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg"',
        default: '"sm"',
        description: "Dot size.",
      },
      {
        name: "pulse",
        type: "boolean",
        default: "false",
        description: "Animated ping ring.",
      },
    ],
    examples: [
      "default",
      "tones",
      "pulse",
      "inline-text",
      "sizes",
      "table-rows",
    ],
  },
  {
    slug: "activity-ring",
    name: "Activity ring",
    category: "UI",
    description:
      "Ring visualisation with two modes: a single-value score gauge (value) or an interactive segmented donut (segments) with hover/pin, tooltip, legend, and draw-in.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/status-dot",
      "@byronwade/utils",
    ],
    props: [
      {
        name: "segments",
        type: "RingSegment[]",
        description:
          "Segmented mode: { value, label, tone?, href? } per segment.",
      },
      {
        name: "value",
        type: "number",
        description: "Score mode: a single value (0–max) rendered as one arc.",
      },
      {
        name: "max",
        type: "number",
        default: "100",
        description: "Score mode denominator for value.",
      },
      {
        name: "tone",
        type: "StatusTone",
        description:
          "Score mode: override the threshold-derived tone (scoreTone).",
      },
      {
        name: "label",
        type: "string",
        description: "Score mode: caption under the number.",
      },
      {
        name: "size",
        type: "number",
        default: "168 / 160",
        description: "Diameter in px (segments / score).",
      },
      {
        name: "thickness",
        type: "number",
        default: "12 / 10",
        description: "Ring stroke width (segments / score).",
      },
      {
        name: "gap",
        type: "number",
        default: "18",
        description: "Segments: visual gap between segments.",
      },
      {
        name: "centerLabel",
        type: "string",
        default: '"total"',
        description: "Segments: caption under the idle centre total.",
      },
      {
        name: "formatValue",
        type: "(n: number) => string",
        description: "Segments: format the centre + tooltip values.",
      },
      {
        name: "onSegmentClick",
        type: "(segment, index) => void",
        description: "Segments: make segments actionable (drill-down).",
      },
      {
        name: "verdict",
        type: "boolean",
        default: "false",
        description: "Segments: show a derived headline below the ring.",
      },
      {
        name: "caption",
        type: "string",
        description: "Segments: optional description line below the ring.",
      },
    ],
    examples: ["default", "tones", "with-verdict", "score", "score-tones"],
  },
  {
    slug: "gradient-avatar",
    name: "Gradient avatar",
    category: "UI",
    description:
      "Radial-gradient avatar disc derived deterministically from a seed.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/identity",
    ],
    props: [
      {
        name: "seed",
        type: "string",
        description: "Any string; same seed → same gradient.",
      },
      {
        name: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "Disc size.",
      },
    ],
    examples: [
      "default",
      "seeds",
      "sizes",
      "grouped-stack",
      "list-rows",
      "with-name-badge",
    ],
  },
  {
    slug: "activity-grid",
    name: "Activity grid",
    category: "UI",
    description:
      "GitHub-style grid of small circles, filled in brand where active.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      {
        name: "data",
        type: "number[]",
        description: "Activity counts per cell.",
      },
      {
        name: "columns",
        type: "number",
        default: "26",
        description: "Columns in the grid.",
      },
    ],
    examples: [
      "default",
      "columns",
      "empty",
      "in-card",
      "intensity-levels",
      "interactive",
    ],
  },
  {
    slug: "filter-pill",
    name: "Filter pill",
    category: "UI",
    description: "Pill-with-chevron filter / range selector control.",
    npmDeps: ["lucide-react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: [
      "default",
      "active-state",
      "as-select-trigger",
      "disabled",
      "filter-bar",
      "with-icon",
    ],
  },
  {
    slug: "segmented-control",
    name: "Segmented control",
    category: "UI",
    description: "Inline segmented toggle (Referrer · Links · Campaign style).",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: [
      "default",
      "controlled-display",
      "disabled",
      "many-options",
      "sizes",
      "two-options",
    ],
  },
  {
    slug: "timeline-rail",
    name: "Timeline rail",
    category: "Composites",
    description:
      "Vertical event/timeline rail with connectors and terminal marker.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/status-dot",
    ],
    examples: [
      "default",
      "custom-terminal",
      "mixed-glyphs",
      "multi-group",
      "with-icons",
      "with-tones",
    ],
  },
  {
    slug: "split-with-rail",
    name: "Split with rail",
    category: "Composites",
    description: "Summary column + vertical rail archetype shell.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: [
      "default",
      "custom-layout",
      "metrics-summary",
      "with-event-timeline",
      "with-timeline-rail",
    ],
  },
  {
    slug: "hero-section",
    name: "Hero section",
    category: "Composites",
    description: "Full-bleed hero composition shell.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: [
      "default",
      "no-header",
      "with-action-header",
      "with-chart",
      "with-custom-classname",
      "with-metrics-header",
    ],
  },
  {
    slug: "metric-stat",
    name: "Metric stat",
    category: "Composites",
    description: "Label + large value + delta badge metric row.",
    npmDeps: ["lucide-react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: [
      "default",
      "custom-value",
      "delta-directions",
      "grid-layout",
      "loading",
      "no-delta",
      "with-icon",
    ],
  },
  {
    slug: "centered-focal",
    name: "Centered focal",
    category: "Composites",
    description:
      "One centerpiece + floating card; first-run & single-action tools.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: [
      "default",
      "custom-classname",
      "loading-state",
      "no-backdrop",
      "with-form",
      "with-illustration-backdrop",
    ],
  },
  {
    slug: "button",
    name: "Button",
    category: "Primitives",
    description:
      "A polymorphic button component built on Base UI with CVA-powered variant and size styles, supporting icon-only sizes and custom render targets.",
    props: [
      {
        name: "variant",
        type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
        default: '"default"',
        description: "Visual style of the button.",
      },
      {
        name: "size",
        type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
        default: '"default"',
        description: "Controls height, padding, and icon sizing.",
      },
      {
        name: "render",
        type: "React.ReactElement | ((props: object) => React.ReactElement)",
        description:
          "Swap the underlying element (e.g. a Next.js Link); nativeButton is inferred automatically.",
      },
      {
        name: "nativeButton",
        type: "boolean",
        description:
          "Override Base UI's native-button semantics inference when using a custom render target.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional Tailwind classes merged onto the variant styles.",
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "Disables pointer events and reduces opacity via the disabled: utilities.",
      },
    ],
    examples: [
      "default",
      "count",
      "destructive",
      "disabled",
      "error",
      "ghost",
      "icon",
      "icon-sm",
      "leading-icon",
      "link",
      "loading",
      "outline",
      "secondary",
      "size-lg",
      "size-sm",
      "size-xs",
      "sizes",
      "solid",
      "stateful",
      "trailing-icon",
      "variants",
      "with-icon",
    ],
    tags: ["interactive", "action", "form", "cta"],
    variants: [
      {
        id: "overview",
        name: "All variants (overview)",
        tags: ["meta:overview"],
        example: "default",
      },
      {
        id: "solid",
        name: "Solid",
        tags: [
          "variant:default",
          "size:default",
          "emphasis:high",
          "content:text",
        ],
        example: "solid",
      },
      {
        id: "outline",
        name: "Outline",
        tags: ["variant:outline", "emphasis:medium", "content:text"],
        example: "outline",
      },
      {
        id: "secondary",
        name: "Secondary",
        tags: ["variant:secondary", "emphasis:medium", "content:text"],
        example: "secondary",
      },
      {
        id: "ghost",
        name: "Ghost",
        tags: ["variant:ghost", "emphasis:low", "content:text"],
        example: "ghost",
      },
      {
        id: "destructive",
        name: "Destructive",
        tags: ["variant:destructive", "emphasis:high", "content:leading-icon"],
        example: "destructive",
      },
      {
        id: "link",
        name: "Link",
        tags: ["variant:link", "emphasis:low", "content:text"],
        example: "link",
      },
      {
        id: "size-xs",
        name: "Extra small",
        tags: ["size:xs", "variant:default", "content:text"],
        example: "size-xs",
      },
      {
        id: "size-sm",
        name: "Small",
        tags: ["size:sm", "variant:default", "content:text"],
        example: "size-sm",
      },
      {
        id: "size-lg",
        name: "Large",
        tags: ["size:lg", "variant:default", "content:text"],
        example: "size-lg",
      },
      {
        id: "icon",
        name: "Icon only",
        tags: ["shape:icon", "content:icon-only", "size:default"],
        example: "icon",
      },
      {
        id: "icon-sm",
        name: "Icon only, small",
        tags: ["shape:icon", "content:icon-only", "size:icon-sm"],
        example: "icon-sm",
      },
      {
        id: "leading-icon",
        name: "Leading icon",
        tags: ["content:leading-icon", "variant:default"],
        example: "leading-icon",
      },
      {
        id: "trailing-icon",
        name: "Trailing icon",
        tags: ["content:trailing-icon", "variant:outline"],
        example: "trailing-icon",
      },
      {
        id: "loading",
        name: "Loading",
        tags: ["state:loading", "variant:default"],
        example: "loading",
      },
      {
        id: "disabled",
        name: "Disabled",
        tags: ["state:disabled", "variant:default"],
        example: "disabled",
      },
      {
        id: "count",
        name: "With count",
        tags: ["content:badge", "variant:default"],
        example: "count",
      },
      {
        id: "stateful",
        name: "Stateful",
        tags: ["state:interactive", "variant:default"],
        example: "stateful",
      },
    ],
  },
  {
    slug: "calendar",
    name: "Calendar",
    category: "Forms",
    description:
      "Date picker built on react-day-picker, dressed in byronwade/ui tokens — selection follows --brand, the range bar uses bg-accent, and nav + day cells reuse buttonVariants. Supports single, multiple, and range modes.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
    ],
    npmDeps: ["react-day-picker", "date-fns", "lucide-react"],
    examples: ["default", "range-presets", "appointment", "pricing"],
  },
  {
    slug: "kbd",
    name: "Kbd",
    category: "Data display",
    description:
      "Keyboard-key indicator with sm/default/lg sizes; KbdGroup joins keys into a shortcut sequence. Mono, token-driven.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default", "sizes"],
  },
  {
    slug: "spinner",
    name: "Spinner",
    category: "Feedback",
    description:
      "Pure-CSS loading spinner in currentColor (sm/default/lg) with role=status and an accessible label.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default", "sizes"],
  },
  {
    slug: "button-group",
    name: "Button group",
    category: "Primitives",
    description:
      "Joins related buttons into one segmented control with shared, overlapped edges — horizontal or vertical.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default", "vertical"],
  },
  {
    slug: "native-select",
    name: "Native select",
    category: "Forms",
    description:
      "A styled native <select> with an inline chevron and the standard input edge + focus ring — token-driven, no icon dependency.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "badge",
    name: "Badge",
    category: "Primitives",
    description:
      "A small inline label component with multiple semantic variants (default, secondary, destructive, success, warning, outline, ghost, link) built on Base UI's useRender for polymorphic rendering.",
    props: [
      {
        name: "variant",
        type: '"default" | "secondary" | "destructive" | "success" | "warning" | "outline" | "ghost" | "link"',
        default: '"default"',
        description:
          "Visual style variant controlling color and appearance of the badge.",
      },
      {
        name: "render",
        type: 'useRender.RenderProp<"span">',
        description:
          "Base UI render prop for polymorphic rendering — override the default span element.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS class names merged with the variant styles.",
      },
    ],
    examples: [
      "default",
      "as-link",
      "inline-content",
      "invalid",
      "status",
      "with-icon",
    ],
  },
  {
    slug: "card",
    name: "Card",
    category: "Primitives",
    description:
      'A composable card container with header, title, description, action, content, and footer sub-components, supporting a compact "sm" size variant.',
    props: [
      {
        name: "size",
        type: '"default" | "sm"',
        default: '"default"',
        description:
          'Controls padding and text size across all child slots; "sm" produces a more compact layout.',
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes merged onto the root div.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "Slot content — typically CardHeader, CardContent, CardFooter, and related sub-components.",
      },
    ],
    examples: [
      "default",
      "content-only",
      "frame-empty",
      "frame-footer",
      "frame-header",
      "frame-header-footer",
      "grid-layout",
      "login-form",
      "sizes",
      "with-action",
      "with-image",
    ],
  },
  {
    slug: "status-pill",
    name: "Status Pill",
    category: "Primitives",
    description:
      "A colored-dot-plus-label chip that communicates status at a glance using a soft tinted background and a matching StatusDot.",
    props: [
      {
        name: "tone",
        type: '"success" | "warning" | "danger" | "info" | "neutral"',
        default: '"neutral"',
        description:
          "Color tone that controls the dot color, text color, and background tint.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Label text or content rendered inside the pill.",
      },
      {
        name: "pulse",
        type: "boolean",
        default: "false",
        description:
          "When true, the status dot animates with a ping effect to indicate live activity.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to merge onto the pill element.",
      },
    ],
    examples: [
      "default",
      "custom-class",
      "inline-text",
      "pulse",
      "table-rows",
      "tones",
    ],
  },
  {
    slug: "input",
    name: "Input",
    category: "Forms",
    description:
      "A styled text input field that wraps Base UI's Input primitive, supporting all native HTML input attributes with consistent focus, disabled, and validation states.",
    props: [
      {
        name: "type",
        type: "React.HTMLInputTypeAttribute",
        default: '"text"',
        description:
          'The type of the input element (e.g. "text", "email", "password").',
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes merged onto the input element.",
      },
      {
        name: "placeholder",
        type: "string",
        description: "Placeholder text shown when the input is empty.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description:
          "Disables the input, preventing interaction and applying reduced-opacity styling.",
      },
      {
        name: "aria-invalid",
        type: 'boolean | "true" | "false"',
        description:
          "Marks the input as invalid, applying destructive border and ring styles.",
      },
      {
        name: "value",
        type: "string | number | readonly string[]",
        description: "Controlled value of the input.",
      },
      {
        name: "onChange",
        type: "React.ChangeEventHandler<HTMLInputElement>",
        description:
          "Change event handler called when the input value changes.",
      },
    ],
    examples: [
      "default",
      "disabled",
      "error",
      "file-upload",
      "input-types",
      "with-adornment",
      "with-button",
      "with-icon",
      "with-label",
    ],
  },
  {
    slug: "textarea",
    name: "Textarea",
    category: "Forms",
    description:
      "A styled textarea element that auto-sizes to its content and supports focus, disabled, and invalid states via standard HTML textarea props.",
    props: [
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes to merge with the default textarea styles.",
      },
      {
        name: "...props",
        type: 'React.ComponentProps<"textarea">',
        description:
          "All standard HTML textarea attributes (value, placeholder, onChange, rows, disabled, aria-invalid, etc.).",
      },
    ],
    examples: [
      "default",
      "auto-resize",
      "character-count",
      "disabled",
      "error-state",
      "readonly",
      "with-label-and-hint",
    ],
  },
  {
    slug: "label",
    name: "Label",
    category: "Forms",
    description:
      "A styled wrapper around the native HTML label element with consistent typography and disabled-state handling.",
    props: [
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes to merge with the default label styles.",
      },
      {
        name: "htmlFor",
        type: "string",
        description: "Associates the label with a form control by its id.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "The label text or content.",
      },
    ],
    examples: [
      "default",
      "disabled",
      "error-state",
      "form-layout",
      "required",
      "with-checkbox",
      "with-icon",
    ],
  },
  {
    slug: "select",
    name: "Select",
    category: "Forms",
    description:
      "An accessible dropdown select built on Base UI's Select primitive, composed of compound parts (trigger, content, items, groups, labels, separators) with animated popover positioning and keyboard navigation.",
    props: [
      {
        name: "size",
        type: '"sm" | "default"',
        default: '"default"',
        description:
          "Controls the height of the trigger button (h-7 for sm, h-8 for default).",
      },
      {
        name: "side",
        type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"',
        default: '"bottom"',
        description:
          "Which side of the trigger the dropdown content opens on (passed to SelectContent).",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "4",
        description:
          "Gap in pixels between the trigger and the dropdown content (passed to SelectContent).",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description:
          "Alignment of the dropdown content relative to the trigger (passed to SelectContent).",
      },
      {
        name: "alignOffset",
        type: "number",
        default: "0",
        description:
          "Pixel offset applied along the alignment axis (passed to SelectContent).",
      },
      {
        name: "alignItemWithTrigger",
        type: "boolean",
        default: "true",
        description:
          "When true, the selected item inside the popup aligns with the trigger position (passed to SelectContent).",
      },
    ],
    examples: [
      "default",
      "controlled",
      "disabled",
      "grouped",
      "sizes",
      "with-error",
      "with-icon",
    ],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    category: "Forms",
    description:
      "A styled checkbox input built on Base UI's headless Checkbox primitive, rendering a checkmark indicator with focus, disabled, and validation states.",
    props: [
      {
        name: "checked",
        type: "boolean",
        description: "Controlled checked state of the checkbox.",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        default: "false",
        description: "Initial checked state for uncontrolled usage.",
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean, eventDetails: CheckboxRootChangeEventDetails) => void",
        description: "Callback fired when the checkbox is ticked or unticked.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Prevents user interaction and applies disabled styling.",
      },
      {
        name: "readOnly",
        type: "boolean",
        default: "false",
        description:
          "Prevents the user from ticking or unticking the checkbox.",
      },
      {
        name: "required",
        type: "boolean",
        default: "false",
        description: "Marks the checkbox as required for form submission.",
      },
      {
        name: "indeterminate",
        type: "boolean",
        default: "false",
        description:
          "Puts the checkbox in a mixed state, neither checked nor unchecked.",
      },
      {
        name: "name",
        type: "string",
        description: "Field name submitted with the form.",
      },
      {
        name: "value",
        type: "string",
        description:
          "Value submitted with the form when the checkbox is checked.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes merged onto the root element.",
      },
    ],
    examples: ["default"],
  },
  {
    slug: "switch",
    name: "Switch",
    category: "Forms",
    description:
      "A toggle switch component built on Base UI's Switch primitive that supports two sizes and accessible checked/disabled states.",
    props: [
      {
        name: "size",
        type: '"sm" | "default"',
        default: '"default"',
        description: "Controls the dimensions of the switch track and thumb.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes merged onto the root element.",
      },
      {
        name: "defaultChecked",
        type: "boolean",
        description:
          "Uncontrolled initial checked state (from Base UI Root props).",
      },
      {
        name: "checked",
        type: "boolean",
        description: "Controlled checked state (from Base UI Root props).",
      },
      {
        name: "onCheckedChange",
        type: "(checked: boolean) => void",
        description:
          "Callback fired when the checked state changes (from Base UI Root props).",
      },
      {
        name: "disabled",
        type: "boolean",
        description:
          "Disables the switch and applies reduced-opacity styling (from Base UI Root props).",
      },
    ],
    examples: [
      "default",
      "controlled",
      "disabled",
      "invalid",
      "sizes",
      "with-label",
    ],
  },
  {
    slug: "radio-group",
    name: "Radio Group",
    category: "Forms",
    description:
      "A radio group component built on Base UI primitives that renders a group of mutually exclusive radio buttons in a vertical grid layout.",
    props: [
      {
        name: "value",
        type: "Value",
        description:
          "The controlled value of the currently selected radio item.",
      },
      {
        name: "defaultValue",
        type: "Value",
        description:
          "The uncontrolled default selected value on initial render.",
      },
      {
        name: "onValueChange",
        type: "(value: Value, eventDetails: RadioGroup.ChangeEventDetails) => void",
        description: "Callback fired when the selected value changes.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Whether the component should ignore user interaction.",
      },
      {
        name: "readOnly",
        type: "boolean",
        default: "false",
        description:
          "Whether the user should be unable to select a different radio button in the group.",
      },
      {
        name: "required",
        type: "boolean",
        default: "false",
        description:
          "Whether the user must choose a value before submitting a form.",
      },
      {
        name: "name",
        type: "string",
        description: "Identifies the field when a form is submitted.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS class names to apply to the group container.",
      },
    ],
    examples: [
      "default",
      "disabled",
      "form-validation",
      "horizontal",
      "with-description",
      "with-icon",
    ],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    category: "Overlays",
    description:
      "A compound tooltip component built on Base UI that shows a floating label near a trigger element with animated entry/exit transitions.",
    props: [
      {
        name: "side",
        type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"',
        default: '"top"',
        description: "Which side of the trigger the tooltip popup appears on.",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "4",
        description:
          "Distance in pixels between the trigger and the tooltip popup.",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description:
          "Alignment of the tooltip relative to the trigger along the cross axis.",
      },
      {
        name: "alignOffset",
        type: "number",
        default: "0",
        description: "Offset in pixels along the alignment axis.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS class names applied to the tooltip popup element.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Content rendered inside the tooltip popup.",
      },
    ],
    examples: [
      "default",
      "alignment",
      "rich-content",
      "sides",
      "with-delay",
      "with-icon",
    ],
  },
  {
    slug: "popover",
    name: "Popover",
    category: "Overlays",
    description:
      "A floating popover panel built on Base UI that renders anchored content next to a trigger element with configurable side and alignment positioning.",
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state of the popover.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the open state changes.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        description: "Initial open state for uncontrolled usage.",
      },
    ],
    examples: [
      "default",
      "controlled",
      "menu-like",
      "placement",
      "rich-content",
      "with-form",
    ],
  },
  {
    slug: "dropdown-menu",
    name: "Dropdown Menu",
    category: "Overlays",
    description:
      "A composable dropdown menu built on Base UI's Menu primitive, providing a trigger-controlled popup with support for items, checkboxes, radio groups, submenus, separators, and keyboard shortcuts.",
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controls the open state of the menu (controlled mode).",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        description: "The initial open state when uncontrolled.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the open state changes.",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description: "Whether the menu should behave as a modal (trap focus).",
      },
    ],
    examples: [
      "default",
      "disabled",
      "with-checkboxes",
      "with-icons",
      "with-radio",
      "with-shortcuts",
      "with-submenu",
    ],
  },
  {
    slug: "dialog",
    name: "Dialog",
    category: "Overlays",
    description:
      "A modal dialog compound component built on Base UI's Dialog primitive, with overlay, content popup, header, footer, title, description, and close button sub-components.",
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state of the dialog.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        description: "Uncontrolled initial open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Callback fired when the open state changes.",
      },
      {
        name: "modal",
        type: "boolean",
        default: "true",
        description:
          "Whether the dialog blocks interaction with the rest of the page.",
      },
    ],
    examples: [
      "default",
      "destructive",
      "loading",
      "no-close-button",
      "scrollable",
      "with-form",
      "with-icon",
    ],
  },
  {
    slug: "hover-card",
    name: "Hover Card",
    category: "Overlays",
    description:
      "A compound component that displays a floating preview card when hovering over a trigger element, built on Base UI's PreviewCard primitive.",
    props: [
      {
        name: "side",
        type: '"top" | "bottom" | "left" | "right" | "inline-start" | "inline-end"',
        default: '"bottom"',
        description:
          "Which side of the trigger the card appears on (HoverCardContent only).",
      },
      {
        name: "sideOffset",
        type: "number",
        default: "4",
        description:
          "Distance in pixels between the trigger and the card (HoverCardContent only).",
      },
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description:
          "Alignment of the card relative to the trigger (HoverCardContent only).",
      },
      {
        name: "alignOffset",
        type: "number",
        default: "4",
        description:
          "Offset in pixels along the alignment axis (HoverCardContent only).",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS class names to apply to the popup element (HoverCardContent only).",
      },
    ],
    examples: [
      "default",
      "alignment",
      "controlled",
      "placement",
      "rich-content",
      "with-delay",
    ],
  },
  {
    slug: "alert",
    name: "Alert",
    category: "Feedback",
    description:
      "A compound alert component for surfacing inline feedback messages with an optional title, description, icon slot, and action button. Intent tones (success, warning, destructive) follow the semantic tokens.",
    props: [
      {
        name: "variant",
        type: '"default" | "success" | "warning" | "destructive"',
        default: '"default"',
        description:
          "Intent tone of the alert — colors the title, icon, and description via semantic tokens (text on the card surface).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS class names merged onto the root element.",
      },
    ],
    examples: [
      "default",
      "variants",
      "with-icon",
      "with-action",
      "with-link",
      "no-icon",
    ],
  },
  {
    slug: "progress",
    name: "Progress",
    category: "Feedback",
    description:
      "A linear progress bar built on Base UI that displays a labeled, accessible indicator of completion with optional label and numeric value display, plus token-driven intent tones (brand, success, warning, destructive).",
    props: [
      {
        name: "value",
        type: "number | null",
        description:
          "The current progress value (typically 0–100). Pass null for indeterminate state.",
      },
      {
        name: "tone",
        type: '"default" | "brand" | "success" | "warning" | "destructive"',
        default: '"default"',
        description:
          "Colors the indicator bar via semantic tokens — e.g. success for complete, warning/destructive for at-risk.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS class names applied to the root wrapper element.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "Optional children rendered inside the root before the built-in track (e.g. ProgressLabel, ProgressValue).",
      },
    ],
    examples: [
      "default",
      "tones",
      "controlled",
      "indeterminate",
      "sizes",
      "with-format",
    ],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    category: "Feedback",
    description:
      "A pulsing placeholder div used to indicate loading state before content is available.",
    props: [
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes to merge onto the skeleton div.",
      },
    ],
    examples: [
      "default",
      "card",
      "list",
      "media-grid",
      "profile",
      "table",
      "with-loaded-state",
    ],
  },
  {
    slug: "sonner",
    name: "Sonner",
    category: "Feedback",
    description:
      "A themed toast notification provider that wraps the Sonner Toaster with next-themes integration and custom Lucide icons for success, info, warning, error, and loading states.",
    props: [
      {
        name: "...props",
        type: "ToasterProps",
        description:
          "All props from Sonner's ToasterProps are forwarded directly to the underlying Toaster (e.g. position, richColors, expand, duration, closeButton, offset).",
      },
    ],
    examples: [
      "default",
      "custom",
      "dismissible",
      "positions",
      "promise",
      "rich-colors",
      "variants",
      "with-action",
      "with-description",
    ],
  },
  {
    slug: "tabs",
    name: "Tabs",
    category: "Data display",
    description:
      "A compound tabs component built on Base UI that renders a tabbed interface with optional horizontal or vertical orientation and two list variants (default pill or underline line).",
    props: [
      {
        name: "value",
        type: "TabsTab.Value | undefined",
        description: "Controlled active tab value.",
      },
      {
        name: "defaultValue",
        type: "TabsTab.Value | undefined",
        default: "0",
        description: "Default active tab value for uncontrolled usage.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description:
          "Layout flow direction; vertical stacks the tab list and panels side by side.",
      },
      {
        name: "onValueChange",
        type: "(value: TabsTab.Value, eventDetails: TabsRoot.ChangeEventDetails) => void",
        description: "Callback fired when the active tab changes.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS class names applied to the root element.",
      },
    ],
    examples: [
      "default",
      "controlled",
      "disabled",
      "keep-mounted",
      "vertical",
      "vertical-with-icons",
      "with-icons",
    ],
  },
  {
    slug: "accordion",
    name: "Accordion",
    category: "Data display",
    description:
      "A vertically stacked set of collapsible sections, each with a trigger header that toggles its content panel open or closed.",
    props: [
      {
        name: "value",
        type: "any[]",
        description: "Controlled array of expanded item values.",
      },
      {
        name: "defaultValue",
        type: "any[]",
        description: "Uncontrolled initial array of expanded item values.",
      },
      {
        name: "multiple",
        type: "boolean",
        default: "false",
        description: "Whether multiple items can be open at the same time.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Whether the accordion ignores user interaction.",
      },
      {
        name: "onValueChange",
        type: "(value: any[], eventDetails: AccordionRootChangeEventDetails) => void",
        description: "Called when an item is expanded or collapsed.",
      },
      {
        name: "loopFocus",
        type: "boolean",
        default: "true",
        description:
          "Whether keyboard focus loops back to the first item when the end is reached.",
      },
      {
        name: "keepMounted",
        type: "boolean",
        default: "false",
        description: "Whether to keep panel content in the DOM while closed.",
      },
      {
        name: "hiddenUntilFound",
        type: "boolean",
        default: "false",
        description:
          'Uses hidden="until-found" so browser page search can find and expand panels.',
      },
      {
        name: "orientation",
        type: "'horizontal' | 'vertical'",
        default: "'vertical'",
        description:
          "Visual orientation that controls which arrow keys move focus.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS class names applied to the root element.",
      },
    ],
    examples: ["default"],
  },
  {
    slug: "avatar",
    name: "Avatar",
    category: "Data display",
    description:
      "A compound avatar component built on Base UI primitives, supporting image display with fallback text, an optional badge indicator, and grouped avatar stacks.",
    props: [
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        default: '"default"',
        description:
          "Controls the overall size of the avatar (sm=24px, default=32px, lg=40px).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes merged onto the root element.",
      },
    ],
    examples: [
      "default",
      "fallback",
      "group",
      "sizes",
      "user-list",
      "with-badge",
    ],
  },
  {
    slug: "separator",
    name: "Separator",
    category: "Data display",
    description:
      "A thin horizontal or vertical dividing line built on Base UI's Separator primitive for visually separating content sections.",
    props: [
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description:
          "Controls whether the separator renders as a horizontal line or a vertical rule.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS class names to apply to the separator element.",
      },
    ],
    examples: [
      "default",
      "custom-styling",
      "in-card",
      "in-nav",
      "vertical",
      "with-label",
    ],
  },
  {
    slug: "breadcrumb",
    name: "Breadcrumb",
    category: "Data display",
    description:
      "A compound navigation component that renders an accessible breadcrumb trail with support for links, the current page, separators, and an ellipsis for collapsed items.",
    props: [
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes applied to the root <nav> element.",
      },
      {
        name: "...props",
        type: 'React.ComponentProps<"nav">',
        description:
          "All standard HTML nav attributes are forwarded to the root element.",
      },
    ],
    examples: [
      "default",
      "custom-separator",
      "long-path",
      "responsive",
      "with-ellipsis",
      "with-icons",
      "with-render-prop",
    ],
  },
  {
    slug: "table",
    name: "Table",
    category: "Data display",
    description:
      "A styled, accessible HTML table compound component with scrollable container, header, body, footer, rows, cells, and caption parts.",
    props: [
      {
        name: "className",
        type: "string",
        description:
          "Additional CSS classes merged onto the root table element.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "Table content — typically TableHeader, TableBody, and TableFooter compound parts.",
      },
    ],
    examples: [
      "default",
      "empty-state",
      "loading-skeleton",
      "selectable-rows",
      "sortable-columns",
      "with-actions",
      "with-status-badges",
    ],
  },
  {
    slug: "page-header",
    name: "Page Header",
    category: "Patterns",
    description:
      "A dashboard page heading that renders a title, optional subtitle, and optional action slot in either a left-aligned (start) or centered layout.",
    props: [
      {
        name: "title",
        type: "string",
        description: "The main heading text rendered as an h1.",
      },
      {
        name: "description",
        type: "string",
        description: "Optional muted subtitle rendered below the title.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description:
          "Optional action elements (e.g. buttons) placed to the right of the heading (start) or below it (center).",
      },
      {
        name: "align",
        type: '"start" | "center"',
        default: '"start"',
        description:
          "Controls layout alignment: start puts actions on the right; center stacks everything and centers it.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional Tailwind classes merged onto the root wrapper element.",
      },
    ],
    examples: [
      "default",
      "align",
      "breadcrumb-context",
      "description-only",
      "with-actions",
      "with-badge",
    ],
  },
  {
    slug: "stat-card",
    name: "Stat Card",
    category: "Patterns",
    description:
      "A compact metric tile displaying a labeled value with an optional icon, delta trend pill, and muted hint line.",
    props: [
      {
        name: "label",
        type: "string",
        description: "Short text label shown above the value.",
      },
      {
        name: "value",
        type: "React.ReactNode",
        description: "The primary metric value displayed prominently.",
      },
      {
        name: "hint",
        type: "React.ReactNode",
        default: "undefined",
        description: "Optional muted helper text shown below the value.",
      },
      {
        name: "delta",
        type: "{ value: string; direction: 'up' | 'down' | 'flat' }",
        default: "undefined",
        description:
          "Optional trend pill showing directional change alongside the value.",
      },
      {
        name: "icon",
        type: "LucideIcon",
        default: "undefined",
        description:
          "Optional Lucide icon rendered in the top-right corner of the card.",
      },
      {
        name: "className",
        type: "string",
        default: "undefined",
        description:
          "Additional CSS classes merged onto the card root element.",
      },
    ],
    examples: [
      "default",
      "delta-directions",
      "grid-dashboard",
      "no-delta",
      "rich-value",
      "with-icons",
    ],
  },
  {
    slug: "empty-state",
    name: "Empty State",
    category: "Patterns",
    description:
      "A centered empty-state panel with a dashed border, optional icon chip, title, description, and an optional action slot.",
    props: [
      {
        name: "title",
        type: "string",
        description: "Primary heading text displayed in the empty state.",
      },
      {
        name: "icon",
        type: "LucideIcon",
        default: "undefined",
        description:
          "Optional Lucide icon component rendered in a small rounded chip above the title.",
      },
      {
        name: "description",
        type: "string",
        default: "undefined",
        description: "Optional muted helper text rendered below the title.",
      },
      {
        name: "action",
        type: "React.ReactNode",
        default: "undefined",
        description:
          "Optional action element (e.g. a button) rendered below the description.",
      },
      {
        name: "className",
        type: "string",
        default: "undefined",
        description: "Additional class names merged onto the root container.",
      },
    ],
    examples: [
      "default",
      "compact",
      "error-state",
      "minimal",
      "no-icon",
      "search-no-results",
      "with-multiple-actions",
    ],
  },
  {
    slug: "chart",
    name: "Chart",
    category: "Charts",
    description:
      "A Recharts wrapper that injects CSS color variables from a config map and provides tooltip and legend sub-components styled to match the design system.",
    props: [
      {
        name: "config",
        type: "ChartConfig",
        description:
          "Map of data-key names to label, icon, and color/theme values; drives CSS variable injection for all chart series.",
      },
      {
        name: "children",
        type: "React.ComponentProps<typeof ResponsiveContainer>['children']",
        description:
          "A Recharts chart element (e.g. AreaChart, BarChart) rendered inside a ResponsiveContainer.",
      },
      {
        name: "id",
        type: "string",
        description:
          "Optional stable ID used to scope the injected CSS variables; auto-generated when omitted.",
      },
      {
        name: "initialDimension",
        type: "{ width: number; height: number }",
        default: "{ width: 320, height: 200 }",
        description:
          "Fallback dimensions passed to ResponsiveContainer before the first layout measurement.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Additional Tailwind / CSS classes merged onto the outer div.",
      },
    ],
    examples: [
      "default",
      "bar-chart",
      "custom-tooltip",
      "donut-chart",
      "legend-variants",
      "line-chart",
      "pie-chart",
      "radial-bar",
      "stacked-bar",
      "theme-colors",
      "tooltip-variants",
    ],
  },
  {
    slug: "detail-header",
    name: "Detail Header",
    category: "House components",
    description:
      "A resource detail page header that renders a title row with an optional badge and action buttons, followed by a responsive grid of label-over-value metadata columns.",
    props: [
      {
        name: "title",
        type: "React.ReactNode",
        description:
          "The primary heading displayed in monospace font at the top of the header.",
      },
      {
        name: "badge",
        type: "React.ReactNode",
        default: "undefined",
        description:
          "Optional badge element rendered inline next to the title.",
      },
      {
        name: "actions",
        type: "React.ReactNode",
        default: "undefined",
        description:
          "Optional action buttons or controls rendered on the right side of the title row.",
      },
      {
        name: "meta",
        type: "{ label: string; value: React.ReactNode }[]",
        default: "undefined",
        description:
          "Array of label/value pairs rendered as a responsive metadata grid below the title.",
      },
      {
        name: "className",
        type: "string",
        default: "undefined",
        description:
          "Additional CSS classes applied to the root wrapper element.",
      },
    ],
    examples: [
      "default",
      "custom-title-node",
      "many-actions",
      "meta-grid-standalone",
      "no-meta",
      "rich-meta-values",
      "with-status-badges",
    ],
  },
  {
    slug: "section",
    name: "Section",
    category: "House components",
    description:
      "A titled settings-style content block with an optional header action, rendering a labelled section heading above a bordered card body; ships with companion SettingsList and SettingRow compound components for building explain-everything config panels.",
    props: [
      {
        name: "title",
        type: "string",
        description:
          "Section heading rendered as a small semibold label above the card.",
      },
      {
        name: "description",
        type: "string",
        description: "Muted helper text displayed beneath the title.",
      },
      {
        name: "action",
        type: "React.ReactNode",
        description:
          "Optional element (e.g. a button) right-aligned beside the title row.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "Content rendered inside the bordered card body.",
      },
      {
        name: "className",
        type: "string",
        description:
          "Extra Tailwind classes merged onto the outer <section> element.",
      },
    ],
    examples: [
      "default",
      "inline-children",
      "no-header",
      "setting-row-controls",
      "stacked-sections",
      "with-action",
    ],
  },
  {
    slug: "event-timeline",
    name: "Event Timeline",
    category: "House components",
    description:
      'A vertical "domain events" style timeline that renders a list of labeled events with toned status dots, optional descriptions, and monospaced timestamps connected by a vertical rule.',
    props: [
      {
        name: "events",
        type: "TimelineEvent[]",
        description:
          "Array of timeline event objects to render, each with a title, optional description, optional timestamp, and optional tone.",
      },
      {
        name: "className",
        type: "string",
        description: "Additional CSS classes applied to the root <ol> element.",
      },
    ],
    examples: [
      "default",
      "live-feed",
      "rich-content",
      "single-event",
      "timestamps",
      "title-only",
      "tones",
    ],
  },
  {
    slug: "use-chrome-morph",
    name: "useChromeMorph",
    category: "Morph",
    description:
      "The shared morph hook for floating chrome — a toolbar pill, launcher, or nav dock. It animates a container's width/height/border-radius between its collapsed box and an open panel on a tuned curve, cross-fading rest↔panel, then shrinks cleanly back. Position-agnostic and reduced-motion aware.",
    props: [
      {
        name: "morphRef",
        type: "RefObject<HTMLDivElement | null>",
        description:
          "The morphing container; its CSS anchoring sets the grow direction (the hook only sizes).",
      },
      {
        name: "open",
        type: "boolean",
        description: "Whether a panel is currently open.",
      },
      {
        name: "growHeight",
        type: "boolean",
        description:
          "Bloom width + height (panels) or width-only (menus that swap their own content).",
      },
      {
        name: "width",
        type: "() => number",
        description: "Open width target in px, read at morph time.",
      },
      {
        name: "restRef",
        type: "RefObject<HTMLDivElement | null>",
        description: "Resting content faded out as the panel blooms in.",
      },
      {
        name: "panelRef",
        type: "RefObject<HTMLDivElement | null>",
        description: "Active panel faded in and measured for the open height.",
      },
      {
        name: "height",
        type: "() => number",
        description:
          "Explicit open height; falls back to the panel's measured height.",
      },
      {
        name: "collapsedFrom",
        type: "() => { w: number; h: number } | null",
        description:
          "Override the collapsed start/end box — e.g. bloom out of a sibling pill.",
      },
      {
        name: "durationMs",
        type: "number",
        default: "220",
        description: "Bloom-down duration in ms.",
      },
      {
        name: "deps",
        type: "React.DependencyList",
        description:
          "Extra triggers that change the open target (which panel, its size…).",
      },
    ],
    examples: [],
  },
  {
    slug: "morph-dock",
    name: "MorphDock",
    category: "Morph",
    description:
      "A config-driven morphing navigation dock. The item row morphs compact ↔ full, and the whole pill blooms in place into a consumer-provided panel via useChromeMorph — items, badges, core/pinned flags, a trailing cluster, and a contextual action. Pure --dock tokens, reduced-motion + Esc + click-away.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/use-chrome-morph",
    ],
    props: [
      {
        name: "items",
        type: "MorphDockItem[]",
        description:
          "Nav items: id, label, icon, optional onSelect/href, active, core, pinned, badge, group (a seam is drawn between adjacent items of differing groups).",
      },
      {
        name: "expandable",
        type: "boolean",
        default: "true",
        description: "Allow compact ↔ full toggling via a chevron button.",
      },
      {
        name: "cluster",
        type: "React.ReactNode",
        description:
          "Custom trailing slot (count + badge, env tag, search button…).",
      },
      {
        name: "action",
        type: "{ label; icon; onSelect? }",
        description:
          "Contextual action pill — blooms the panel when children are present, else runs onSelect.",
      },
      {
        name: "tools",
        type: "MorphDockAction[]",
        description:
          "Trailing two-tone tool zone (bg-dock-tool) — a combined nav + toolbar pill. Actions: id, label, icon, onSelect?/href?, primary (brand fill), group (seam between groups).",
      },
      {
        name: "breadcrumb",
        type: "{ label: string; href?: string }[]",
        description:
          "Leading crumb trail; the last crumb is the current page (aria-current).",
      },
      {
        name: "status",
        type: "MorphDockStatus | null",
        description:
          "A save/validation outcome the panel blooms into (success/error/info). Success/info auto-dismiss; errors persist.",
      },
      {
        name: "onStatusDismiss",
        type: "() => void",
        description:
          "Called when the status is dismissed — auto for success/info, or via its close button.",
      },
      {
        name: "statusDismissMs",
        type: "number",
        default: "4000",
        description:
          "Auto-dismiss delay (ms) for success/info status. Errors never auto-dismiss.",
      },
      {
        name: "tone",
        type: '"dock" | "surface"',
        default: '"dock"',
        description: "Dark dock pill (default) or light surface.",
      },
      {
        name: "navLabel",
        type: "string",
        default: '"Primary"',
        description: "Accessible name for the nav landmark.",
      },
      {
        name: "open",
        type: "boolean",
        description: "Controlled morph open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Open-state change callback.",
      },
      {
        name: "children",
        type: "React.ReactNode",
        description: "The panel the dock morphs into.",
      },
      {
        name: "panelTitle",
        type: "React.ReactNode",
        description:
          "Title shown in the panel header (alongside the drag handle / close / save chrome).",
      },
      {
        name: "onSave",
        type: "() => void",
        description: "Renders a Save button in the panel header when provided.",
      },
      {
        name: "panelWidth",
        type: "number",
        default: "360",
        description: "Open-panel width in px.",
      },
      {
        name: "panelHeight",
        type: "number",
        description:
          "Open-panel height in px. Omit to size to content (bloom-down).",
      },
      {
        name: "growHeight",
        type: "boolean",
        default: "true",
        description: "Bloom width + height (default) or width-only.",
      },
      {
        name: "placement",
        type: '"top" | "bottom" | "left" | "right"',
        default: '"bottom"',
        description: "Which way the panel blooms from the bar.",
      },
      {
        name: "origin",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description:
          'Where along the dock the panel grows from — a centered dock blooms symmetrically with "center".',
      },
      {
        name: "draggable",
        type: "boolean",
        default: "false",
        description:
          "Detach the open panel and drag it free by its handle (flies home on close).",
      },
      {
        name: "resizable",
        type: "boolean",
        default: "false",
        description:
          "Show a corner grip to resize the open panel; the morph box follows live.",
      },
      {
        name: "bare",
        type: "boolean",
        default: "false",
        description:
          "Drop the resting pill background/shadow — items float free until a panel blooms (the panel keeps its surface).",
      },
    ],
    examples: [
      "default",
      "app-bar",
      "app-bar-panels",
      "ghost",
      "split-toolbar",
      "tools-primary",
      "breadcrumb",
      "separators",
      "save-status",
      "expand",
      "tones",
      "origins",
      "orientations",
      "command",
      "help",
      "launcher",
      "notifications",
      "dialer",
      "draggable",
      "resizable",
    ],
  },
  {
    slug: "aspect-ratio",
    name: "Aspect Ratio",
    category: "Data display",
    description:
      "Container that locks child content to a fixed width-to-height ratio via CSS custom property.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      {
        name: "ratio",
        type: "number",
        description: "Width divided by height (e.g. 16/9, 1, 4/3).",
      },
      {
        name: "className",
        type: "string",
        description: "Additional classes merged onto the root.",
      },
    ],
    examples: ["default", "square", "portrait", "cinematic", "thumbnail"],
  },
  {
    slug: "scroll-area",
    name: "Scroll Area",
    category: "Data display",
    description:
      "Custom-styled scrollable viewport with optional scrollbars built on Base UI.",
    npmDeps: ["@base-ui/react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      {
        name: "children",
        type: "React.ReactNode",
        description: "Content rendered inside the scroll viewport.",
      },
      {
        name: "className",
        type: "string",
        description: "Classes merged onto the scroll root.",
      },
      {
        name: "orientation",
        type: '"vertical" | "horizontal"',
        default: '"vertical"',
        description: "Axis for the exported ScrollBar part.",
      },
    ],
    examples: ["default", "card-list", "compact", "prose", "with-header"],
  },
  {
    slug: "collapsible",
    name: "Collapsible",
    category: "Data display",
    description: "Expand/collapse region with trigger and animated panel.",
    npmDeps: ["@base-ui/react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      {
        name: "open",
        type: "boolean",
        description: "Controlled open state of the panel.",
      },
      {
        name: "defaultOpen",
        type: "boolean",
        default: "false",
        description: "Uncontrolled initial open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "Fires when the open state changes.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the trigger.",
      },
    ],
    examples: [
      "default",
      "uncontrolled",
      "disabled",
      "faq",
      "with-rich-content",
    ],
  },
  {
    slug: "toggle",
    name: "Toggle",
    category: "Forms",
    description:
      "Two-state pressable toggle button with variant and size styles.",
    npmDeps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      {
        name: "variant",
        type: '"default" | "outline"',
        default: '"default"',
        description: "Visual style.",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        default: '"default"',
        description: "Button dimensions.",
      },
      {
        name: "pressed",
        type: "boolean",
        description: "Controlled pressed state.",
      },
      {
        name: "defaultPressed",
        type: "boolean",
        description: "Initial pressed state.",
      },
    ],
    examples: [
      "default",
      "variants",
      "sizes",
      "with-text",
      "disabled",
      "controlled",
    ],
  },
  {
    slug: "toggle-group",
    name: "Toggle Group",
    category: "Forms",
    description:
      "Single- or multi-select group of toggle buttons sharing variant/size context.",
    npmDeps: ["@base-ui/react", "class-variance-authority"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/toggle",
    ],
    props: [
      {
        name: "value",
        type: "string[]",
        description: "Controlled array of pressed item values.",
      },
      {
        name: "defaultValue",
        type: "string[]",
        description: "Uncontrolled initial pressed values.",
      },
      {
        name: "onValueChange",
        type: "(value: string[]) => void",
        description: "Fires when the pressed items change.",
      },
      {
        name: "multiple",
        type: "boolean",
        default: "false",
        description: "Allow more than one item pressed at once.",
      },
      {
        name: "variant",
        type: '"default" | "outline"',
        default: '"default"',
        description: "Visual style shared by all items.",
      },
      {
        name: "size",
        type: '"default" | "sm" | "lg"',
        default: '"default"',
        description: "Item size shared by all items.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout axis of the group.",
      },
      {
        name: "disabled",
        type: "boolean",
        default: "false",
        description: "Disable the entire group.",
      },
    ],
    examples: [
      "default",
      "multiple",
      "variants",
      "sizes",
      "vertical",
      "disabled",
    ],
  },
  {
    slug: "input-group",
    name: "Input Group",
    category: "Forms",
    description:
      "Grouped input shell with aligned addons, buttons, and embedded controls.",
    npmDeps: ["class-variance-authority"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/input",
      "@byronwade/textarea",
    ],
    props: [
      {
        name: "align",
        type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
        default: '"inline-start"',
        description: "InputGroupAddon: where the addon sits within the group.",
      },
      {
        name: "size",
        type: '"xs" | "sm" | "icon-xs" | "icon-sm"',
        default: '"xs"',
        description: "InputGroupButton: size of an embedded button.",
      },
      {
        name: "className",
        type: "string",
        description: "Classes merged onto the group shell.",
      },
    ],
    examples: [
      "default",
      "with-button",
      "with-text",
      "textarea",
      "with-kbd",
      "validation",
    ],
  },
  {
    slug: "sheet",
    name: "Sheet",
    category: "Overlays",
    description: "Slide-over panel dialog anchored to any screen edge.",
    npmDeps: ["@base-ui/react", "lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
    ],
    props: [
      {
        name: "side",
        type: '"top" | "right" | "bottom" | "left"',
        default: '"right"',
        description: "Edge the sheet slides in from.",
      },
      {
        name: "showCloseButton",
        type: "boolean",
        default: "true",
        description: "Render the corner close button.",
      },
    ],
    examples: [
      "default",
      "sides",
      "with-form",
      "scrollable",
      "no-close-button",
      "inset-nested",
      "nested-steps",
    ],
  },
  {
    slug: "command",
    name: "Command",
    category: "Overlays",
    description:
      "Command palette built on cmdk with dialog and input-group integration.",
    npmDeps: ["cmdk", "lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/dialog",
      "@byronwade/input-group",
    ],
    props: [
      {
        name: "open",
        type: "boolean",
        description: "CommandDialog: controlled open state.",
      },
      {
        name: "onOpenChange",
        type: "(open: boolean) => void",
        description: "CommandDialog: fires when the dialog opens or closes.",
      },
      {
        name: "title",
        type: "string",
        default: '"Command Palette"',
        description: "CommandDialog: visually-hidden accessible title.",
      },
      {
        name: "description",
        type: "string",
        description: "CommandDialog: visually-hidden accessible description.",
      },
      {
        name: "onSelect",
        type: "(value: string) => void",
        description:
          "CommandItem: fires when the item is chosen via click or Enter.",
      },
    ],
    examples: [
      "default",
      "inline",
      "with-icons",
      "grouped",
      "empty-state",
      "actions",
      "cards",
      "files",
      "people",
    ],
  },
  {
    slug: "navigation-menu",
    name: "Navigation Menu",
    category: "Overlays",
    description: "Accessible site navigation with animated dropdown panels.",
    npmDeps: ["@base-ui/react", "class-variance-authority", "lucide-react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      {
        name: "align",
        type: '"start" | "center" | "end"',
        default: '"start"',
        description: "Alignment of the dropdown panel under its trigger.",
      },
      {
        name: "value",
        type: "string | null",
        description: "Controlled value of the item whose panel is open.",
      },
      {
        name: "defaultValue",
        type: "string | null",
        default: "null",
        description: "Uncontrolled initial open item.",
      },
      {
        name: "onValueChange",
        type: "(value: string | null) => void",
        description: "Fires when the open item changes.",
      },
      {
        name: "delay",
        type: "number",
        default: "50",
        description: "Delay in ms before opening on hover.",
      },
      {
        name: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout axis of the menu.",
      },
    ],
    examples: ["default", "simple-links", "with-descriptions", "with-icons"],
  },
  {
    slug: "verification-progress",
    name: "Verification Progress",
    category: "House components",
    description:
      "Multi-step verification status tracker with tone-colored steps, optional counts, and connecting rails.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    props: [
      {
        name: "steps",
        type: "VerificationStep[]",
        description:
          "Ordered steps with tone, label, optional count and description.",
      },
    ],
    examples: [
      "default",
      "with-counts",
      "statuses",
      "all-tones",
      "two-steps",
      "many-steps",
    ],
  },
  {
    slug: "safari",
    name: "Safari",
    category: "UI",
    description:
      "Safari browser device mockup frame (SVG) wrapping a screenshot, image, or video — token-driven chrome, automatic dark mode. Adapted from MagicUI.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "iphone",
    name: "iPhone",
    category: "UI",
    description:
      "iPhone device mockup frame (SVG) wrapping a screenshot, image, or video — token-driven chrome, automatic dark mode. Adapted from MagicUI.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "android",
    name: "Android",
    category: "UI",
    description:
      "Android phone device mockup frame (SVG) wrapping a screenshot, image, or video — token-driven chrome, automatic dark mode. Adapted from MagicUI.",
    registryDeps: ["@byronwade/foundation"],
    examples: ["default"],
  },
  {
    slug: "world-map",
    name: "World map",
    category: "UI",
    description:
      "Dotted SVG world map with animated great-circle connection arcs. Arcs + points derive from --brand; dotted base resolves from --muted-foreground. Adapted from Aceternity UI.",
    npmDeps: ["motion", "dotted-map", "next-themes"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "floating-dock",
    name: "Floating dock",
    category: "UI",
    description:
      "macOS-style magnify-on-hover dock (desktop) + collapsible mobile dock, token surfaces and lucide icons. Adapted from Aceternity UI.",
    npmDeps: ["motion", "lucide-react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "kinetic-text",
    name: "Kinetic text",
    category: "UI",
    description:
      "Per-letter kinetic typography: letters thicken (weight + text-stroke) and breathe on hover, with neighbours easing in sympathy. currentColor only, dark-mode safe. Adapted from MagicUI.",
    registryDeps: ["@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "backlight",
    name: "Backlight",
    category: "UI",
    description:
      "Wraps a child in a saturated, blurred glow of its own pixels via an SVG filter — an RGB backlight that inherits the child’s token colors. Adapted from MagicUI.",
    registryDeps: ["@byronwade/utils"],
    examples: ["default", "with-video"],
  },
  {
    slug: "apple-cards-carousel",
    name: "Apple cards carousel",
    category: "UI",
    description:
      "Horizontal card carousel where cards expand into a full modal. Token surfaces, lucide controls, no next/image. Adapted from Aceternity UI.",
    npmDeps: ["motion", "lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/use-outside-click",
    ],
    examples: ["default"],
  },
  {
    slug: "use-outside-click",
    name: "useOutsideClick",
    category: "Libraries",
    description:
      "Hook that fires a callback on pointer/touch interactions outside a ref. Adapted from Aceternity UI.",
    examples: ["default"],
  },
  {
    slug: "pixelated-canvas",
    name: "Pixelated canvas",
    category: "UI",
    description:
      "Renders an image as an interactive grid of dots that distort around the pointer. Token-friendly defaults. Adapted from Aceternity UI.",
    registryDeps: ["@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "slider",
    name: "Slider",
    category: "Forms",
    description:
      "Single or range slider built on Base UI — one thumb per value, token track/indicator, keyboard + a11y.",
    npmDeps: ["@base-ui/react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "number-field",
    name: "Number field",
    category: "Forms",
    description:
      "Numeric input with increment/decrement, clamping, scrub, and formatting — built on Base UI. Token surfaces, lucide steppers.",
    npmDeps: ["@base-ui/react", "lucide-react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "price-range-filter",
    name: "Price range filter",
    category: "Composites",
    description:
      "Histogram + range slider + min/max number inputs + apply button. Composes slider, number-field, button. Adapted from a coss.com UI block.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/slider",
      "@byronwade/number-field",
      "@byronwade/button",
    ],
    examples: ["default"],
  },
  {
    slug: "file-tree",
    name: "File tree",
    category: "Data display",
    description:
      "Collapsible file/folder tree with selection, sorting, and expand-all, plus a panel variant (chevron disclosure, guide lines, count badges) and multi-select with cascading checkboxes — rebuilt on Base UI. Base from MagicUI; panel/multi-select inspired by Untitled UI.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/badge",
      "@byronwade/checkbox",
      "@byronwade/scroll-area",
      "@byronwade/collapsible",
    ],
    examples: ["default", "panel", "multi-select"],
  },
  {
    slug: "ai-loader",
    name: "Loader",
    category: "AI",
    description:
      "Spinning multi-opacity loader for AI/agent surfaces (adapted from AI Elements).",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "ai-shimmer",
    name: "Shimmer",
    category: "AI",
    description:
      "Animated text-shimmer that sweeps a token-driven light gradient across muted text for AI thinking/streaming states.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["motion"],
    examples: ["default", "tones"],
  },
  {
    slug: "ai-suggestion",
    name: "Suggestion",
    category: "AI",
    description:
      "A horizontally-scrolling row of clickable prompt pills that surface suggested actions for an AI chat or agent surface.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/scroll-area",
    ],
    examples: ["default"],
  },
  {
    slug: "ai-image",
    name: "Image",
    category: "AI",
    description:
      "Renders an AI-generated image from the Experimental_GeneratedImage shape as an edge-framed, radius-clipped data URI (adapted from AI Elements).",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["ai"],
    examples: ["default"],
  },
  {
    slug: "ai-open-in-chat",
    name: "Open in Chat",
    category: "AI",
    description:
      "A dropdown menu that opens the current prompt or query in external AI chat providers (ChatGPT, Claude, Cursor, Scira, T3, v0).",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/dropdown-menu",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-inline-citation",
    name: "Inline Citation",
    category: "AI",
    description:
      "Inline text citations that reveal a hover card carousel of grounded sources with titles, URLs, and quotes (adapted from Vercel AI Elements).",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/badge",
      "@byronwade/hover-card",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-context",
    name: "Context",
    category: "AI",
    description:
      "Hover-card token/cost usage meter for AI model context windows (adapted from Vercel AI Elements).",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/hover-card",
      "@byronwade/progress",
    ],
    npmDeps: ["ai", "tokenlens"],
    examples: ["default"],
  },
  {
    slug: "ai-code-block",
    name: "Code Block",
    category: "AI",
    description:
      "Syntax-highlighted code surface with light/dark Shiki rendering, optional line numbers, and a copy-to-clipboard button (adapted from Vercel AI Elements).",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
    ],
    npmDeps: ["shiki", "lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-task",
    name: "Task",
    category: "AI",
    description:
      "A collapsible task log showing an AI agent's step-by-step actions with inline file chips, ported from Vercel AI Elements.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/collapsible",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-sources",
    name: "Sources",
    category: "AI",
    description:
      "A collapsible citation list that reveals the sources an AI response was grounded in, built on the Base UI collapsible primitive.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/collapsible",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-model-selector",
    name: "Model Selector",
    category: "AI",
    description:
      "A searchable command-palette dialog for choosing an AI model, with provider logos, grouped items, and keyboard shortcuts.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/command",
      "@byronwade/dialog",
    ],
    examples: ["default"],
  },
  {
    slug: "ai-confirmation",
    name: "Confirmation",
    category: "AI",
    description:
      "A tool-call approval prompt that requests, then reflects, an accepted or rejected agent action using AI SDK approval state.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/alert",
      "@byronwade/button",
    ],
    npmDeps: ["ai"],
    examples: ["default"],
  },
  {
    slug: "ai-checkpoint",
    name: "Checkpoint",
    category: "AI",
    description:
      "A conversation checkpoint marker that pairs a bookmark icon with a tooltip-enabled restore trigger and a trailing separator.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/separator",
      "@byronwade/tooltip",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-plan",
    name: "Plan",
    category: "AI",
    description:
      "Collapsible plan card for AI/agent surfaces with a streaming-aware title and description (adapted from AI Elements).",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/card",
      "@byronwade/collapsible",
      "@byronwade/ai-shimmer",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-queue",
    name: "Queue",
    category: "AI",
    description:
      "A collapsible task-queue surface for AI agents, with pending/completed status indicators, descriptions, hover action buttons, and image/file attachments.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/collapsible",
      "@byronwade/scroll-area",
      "@byronwade/button",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-conversation",
    name: "Conversation",
    category: "AI",
    description:
      "An auto-scrolling chat transcript that sticks to the bottom as messages stream, with content, empty-state, and scroll-to-bottom affordances.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
    ],
    npmDeps: ["lucide-react", "use-stick-to-bottom"],
    examples: ["default"],
  },
  {
    slug: "ai-reasoning",
    name: "Reasoning",
    category: "AI",
    description:
      'A collapsible "thinking" trace for AI responses that auto-opens while streaming, records elapsed seconds, and renders its markdown reasoning through Streamdown.',
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/collapsible",
      "@byronwade/ai-shimmer",
    ],
    npmDeps: ["streamdown", "lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-tool",
    name: "Tool",
    category: "AI",
    description:
      "Collapsible tool-call card that shows a tool's status, JSON parameters, and result or error output for agent chat UIs.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/badge",
      "@byronwade/collapsible",
      "@byronwade/ai-code-block",
    ],
    npmDeps: ["ai", "lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-message",
    name: "Message",
    category: "AI",
    description:
      "Chat message primitives for AI conversations — bubbles, actions, branch navigation, attachments, and a streaming markdown response.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/button-group",
      "@byronwade/tooltip",
    ],
    npmDeps: ["ai", "streamdown", "lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-chain-of-thought",
    name: "Chain of Thought",
    category: "AI",
    description:
      "A collapsible, step-by-step reasoning trace for AI responses with status-coded steps, search-result chips, and captioned image wells.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/badge",
      "@byronwade/collapsible",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-artifact",
    name: "Artifact",
    category: "AI",
    description:
      "A framed surface for presenting generated artifacts (code, files, canvases) in a chat with a titled header, tooltip actions, a close button, and scrollable content.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/tooltip",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "ai-node",
    name: "Node",
    category: "AI",
    description:
      "A React Flow node rendered as a Card with editorial header/footer and token-styled source/target connection handles.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/card",
    ],
    npmDeps: ["@xyflow/react"],
    examples: ["default"],
  },
  {
    slug: "ai-edge",
    name: "Edge",
    category: "AI",
    description:
      "React Flow custom edges: a dashed temporary connector and an animated edge with a brand dot traveling along the path.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["@xyflow/react"],
    examples: ["default"],
  },
  {
    slug: "ai-panel",
    name: "Panel",
    category: "AI",
    description:
      "A React Flow overlay panel that floats over the flow canvas, pinned to a configurable corner.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["@xyflow/react"],
    examples: ["default"],
  },
  {
    slug: "ai-canvas",
    name: "Canvas",
    category: "AI",
    description:
      "A React Flow node-graph surface with opinionated interaction defaults and a token-driven, pattern-configurable background for agent/workflow UIs.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["@xyflow/react"],
    examples: ["default"],
  },
  {
    slug: "ai-controls",
    name: "Controls",
    category: "AI",
    description:
      "Token-styled React Flow zoom / fit-view / interactivity control panel for AI canvas surfaces (adapted from AI Elements).",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["@xyflow/react"],
    examples: ["default"],
  },
  {
    slug: "ai-prompt-input",
    name: "Prompt Input",
    category: "AI",
    description:
      "A composable AI chat prompt input with textarea, file attachments, action menu, model select, speech-to-text, and slash-command primitives built on byronwade/ui input-group, select, dropdown-menu, hover-card, and command.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/command",
      "@byronwade/dropdown-menu",
      "@byronwade/hover-card",
      "@byronwade/input-group",
      "@byronwade/select",
    ],
    npmDeps: ["ai", "lucide-react", "nanoid"],
    examples: ["default"],
  },
  {
    slug: "ai-toolbar",
    name: "Toolbar",
    category: "AI",
    description:
      "A token-driven floating action toolbar that attaches to a React Flow custom node, with horizontal/vertical orientation variants.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["@xyflow/react"],
    examples: ["default"],
  },
  {
    slug: "ai-attachments",
    name: "Attachments",
    category: "AI",
    description:
      "A compound component for displaying file, media, and source-document attachments in grid, inline, or list layouts with previews, remove buttons, and hover-card details.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/hover-card",
    ],
    npmDeps: ["ai", "lucide-react"],
    examples: ["default", "variants"],
  },
  {
    slug: "ai-connection",
    name: "Connection",
    category: "AI",
    description:
      "Token-styled React Flow connection line for AI canvas/workflow surfaces (adapted from AI Elements).",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["@xyflow/react"],
    examples: ["default"],
  },
  {
    slug: "ai-web-preview",
    name: "Web Preview",
    category: "AI",
    description:
      "An embedded browser-style web preview with URL bar, navigation, and a console log for AI-generated sites (adapted from AI Elements).",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/collapsible",
      "@byronwade/input",
      "@byronwade/tooltip",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "cursor",
    name: "Cursor",
    category: "UI",
    description:
      "Live collaboration cursor — pointer + name/message body, tinted via currentColor. Adapted from kibo-ui.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "pill",
    name: "Pill",
    category: "UI",
    description:
      "Rounded pill with avatar/status/indicator/delta parts; tones map to semantic tokens. Adapted from kibo-ui.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/avatar",
      "@byronwade/badge",
      "@byronwade/button",
    ],
    examples: ["default"],
  },
  {
    slug: "glimpse",
    name: "Glimpse",
    category: "Overlays",
    description:
      "Link/preview hover card (title, description, image) on the house hover-card. Adapted from kibo-ui.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/hover-card",
    ],
    examples: ["default"],
  },
  {
    slug: "ticker",
    name: "Ticker",
    category: "UI",
    description:
      "Stock/crypto ticker — icon, symbol, formatted price, up/down change. Adapted from kibo-ui.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/avatar",
    ],
    examples: ["default"],
  },
  {
    slug: "relative-time",
    name: "Relative time",
    category: "UI",
    description:
      "Multi-timezone live clock — per-zone time/date with mono labels, ticking each second. Adapted from kibo-ui.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "qr-code",
    name: "QR code",
    category: "UI",
    description:
      "Token-colored QR code (modules use --foreground/--background, re-skins with the theme). Adapted from kibo-ui.",
    npmDeps: ["qrcode", "culori"],
    registryDeps: ["@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "rating",
    name: "Rating",
    category: "Forms",
    description:
      "Interactive star rating (keyboard + hover) + a read-only RatingBadge (score + star). Adapted from kibo-ui.",
    npmDeps: ["lucide-react"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "credit-card",
    name: "Credit card",
    category: "UI",
    description:
      "Flippable credit-card display (chip, number, expiry, CVV, mag stripe, payment icon). Adapted from kibo-ui.",
    npmDeps: ["react-svg-credit-card-payment-icons"],
    registryDeps: ["@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "image-crop",
    name: "Image crop",
    category: "UI",
    description:
      "Crop a File to a PNG (react-image-crop + canvas); apply/reset controls. Adapted from kibo-ui.",
    npmDeps: ["lucide-react", "react-image-crop"],
    registryDeps: ["@byronwade/utils", "@byronwade/button"],
    examples: ["default"],
  },
  {
    slug: "color-picker",
    name: "Color picker",
    category: "Forms",
    description:
      "HSL color picker — 2D field + hue/alpha sliders, eyedropper, hex/rgb/css/hsl output. Adapted from kibo-ui.",
    npmDeps: ["color", "@base-ui/react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/input",
      "@byronwade/select",
    ],
    examples: ["default"],
  },
  {
    slug: "video-player",
    name: "Video player",
    category: "UI",
    description:
      "media-chrome player with default/minimal/theater/poster variants. Adapted from kibo-ui.",
    npmDeps: ["media-chrome"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default", "variants"],
  },
  {
    slug: "kanban",
    name: "Kanban",
    category: "Data display",
    description:
      "Drag-and-drop kanban board with columns + sortable cards. Adapted from kibo-ui.",
    npmDeps: [
      "@dnd-kit/core",
      "@dnd-kit/sortable",
      "@dnd-kit/utilities",
      "tunnel-rat",
    ],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/card",
      "@byronwade/scroll-area",
    ],
    examples: ["default"],
  },
  {
    slug: "gantt",
    name: "Gantt",
    category: "Data display",
    description:
      "Draggable timeline / roadmap chart — sidebar, multi-range header, status-tinted feature bars, milestone diamonds, today line. Auto-centers on today; a GanttControls toolbar drives timescale + zoom, with density and read-only presentation variants. Adapted from kibo-ui.",
    npmDeps: [
      "@dnd-kit/core",
      "@dnd-kit/modifiers",
      "@uidotdev/usehooks",
      "date-fns",
      "jotai",
      "lodash.throttle",
      "lucide-react",
    ],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/card",
    ],
    examples: ["default", "controls", "compact", "read-only"],
  },
  {
    slug: "editor",
    name: "Editor",
    category: "Forms",
    description:
      "Tiptap rich-text editor — bubble toolbar, slash menu, tables, task lists, code blocks. Adapted from kibo-ui.",
    npmDeps: ["@tiptap/react", "@tiptap/starter-kit", "lowlight", "tippy.js"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/button",
      "@byronwade/command",
      "@byronwade/dropdown-menu",
      "@byronwade/popover",
      "@byronwade/separator",
      "@byronwade/tooltip",
    ],
    examples: ["default"],
  },
  {
    slug: "morph-surface",
    name: "Morph Surface",
    category: "Morph",
    description:
      "Agnostic morph primitive — open-state orchestration (refs, cross-fade, Esc/outside-close, box sizing) with no visual style. Navigation styles compose it.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/use-chrome-morph",
    ],
    examples: ["default"],
  },
  {
    slug: "morph-bar",
    name: "Morph Bar",
    category: "Morph",
    description:
      "Full-width top navigation bar that blooms a panel down via the morph technique.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/morph-surface",
    ],
    examples: ["default"],
  },
  {
    slug: "morph-sidebar",
    name: "Morph Sidebar",
    category: "Morph",
    description:
      "Left icon rail that morphs wider into a labeled sidebar via the morph technique.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/morph-surface",
    ],
    examples: ["default"],
  },
  {
    slug: "morph-tabs",
    name: "Morph Tabs",
    category: "Morph",
    description:
      "Bottom tab bar that blooms a sheet up via the morph technique.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/morph-surface",
    ],
    examples: ["default"],
  },
  {
    slug: "morph-menubar",
    name: "Morph Menubar",
    category: "Morph",
    description:
      "Slim menubar that blooms the active menu's dropdown in place via the morph technique.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/morph-surface",
    ],
    examples: ["default"],
  },
  {
    slug: "morph-rail",
    name: "Morph Rail",
    category: "Morph",
    description:
      "Right icon rail that blooms a wide labeled panel to the side via the morph technique.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/morph-surface",
    ],
    examples: ["default"],
  },
  {
    slug: "command-result",
    name: "Command Result",
    category: "Composites",
    description:
      "Compact rich result row for a command palette: media, title, description, meta, and an action slot.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/command",
    ],
    examples: ["default"],
  },
  {
    slug: "conversation-list",
    name: "Conversation list",
    category: "Composites",
    description:
      "Messaging conversation list — live search, All/Unread/Pinned filters with counts, a pinned section, bulk select + bulk actions, and rows with hover actions. Reads/acts through comms-store.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/utils",
      "@byronwade/comms-store",
      "@byronwade/gradient-avatar",
    ],
    examples: ["default"],
  },
  {
    slug: "equalizer-bars",
    name: "Equalizer bars",
    category: "Media",
    description:
      "Animated now-playing equalizer bars. Accent follows --brand; freezes under prefers-reduced-motion. The shared playing-state primitive for album-cover, track-row, and now-playing-bar.",
    npmDeps: ["motion"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "album-cover",
    name: "Album cover",
    category: "Media",
    description:
      "Square album/playlist artwork with an optional hover-reveal brand play button and an equalizer overlay for the active state. Accent follows --brand.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/equalizer-bars",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "audio-waveform",
    name: "Audio waveform",
    category: "Media",
    description:
      "Bar-style waveform scrubber. Played bars follow --brand; click and arrow keys report a 0–1 seek ratio. Exposes role=slider with aria-value*.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "track-list",
    name: "Track list",
    category: "Media",
    description:
      "Numbered song rows (TrackList + TrackRow). The index swaps to a play glyph on hover and to equalizer-bars when active. Active title and like follow --brand.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/badge",
      "@byronwade/equalizer-bars",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "lyrics",
    name: "Lyrics",
    category: "Media",
    description:
      "Synced, scrolling lyric lines. The active line is emphasised and scrolls into view (instant under prefers-reduced-motion). Lines become seek-to-line buttons when onLineClick is set.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "now-playing-bar",
    name: "Now playing bar",
    category: "Media",
    description:
      "Sticky transport bar composed from album-cover + slider. Controlled parts: NowPlayingBarTrack, NowPlayingBarControls, NowPlayingBarProgress, NowPlayingBarExtras. Active controls follow --brand.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/album-cover",
      "@byronwade/slider",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "audio-player",
    name: "Audio player",
    category: "Media",
    description:
      "Token-mapped media-chrome <audio> player with a composable control bar and default/minimal/card variants. Audio sibling of video-player; accent follows --brand.",
    npmDeps: ["media-chrome"],
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "playlist-card",
    name: "Playlist card",
    category: "Media",
    description:
      "Browse-grid tile composing album-cover + title + description. Surfaces the cover's hover play button and active equalizer; lifts on hover.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/album-cover",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "artist-header",
    name: "Artist header",
    category: "Media",
    description:
      "Artist hero composing album-cover + verified badge + monthly-listeners stat (font-mono) + Play/Follow buttons. Editorial name typography; Play follows --brand.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/album-cover",
      "@byronwade/badge",
      "@byronwade/button",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "money-input",
    name: "Money input",
    category: "Commerce",
    description:
      "Currency-formatted price input built on the number-field primitive, with a leading symbol and optional ISO-code adornment.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/number-field",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "bulk-action-bar",
    name: "Bulk action bar",
    category: "Commerce",
    description:
      "Selection action bar for tables and resource lists — a selected-count label, promoted and grouped actions, and a clear-selection control. Renders nothing when nothing is selected.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/button",
      "@byronwade/button-group",
      "@byronwade/checkbox",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "order-summary",
    name: "Order summary",
    category: "Commerce",
    description:
      "Order line-items list with a subtotal, discount, shipping, tax, and total cost breakdown. The signature Shopify order/checkout card.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/avatar",
      "@byronwade/badge",
      "@byronwade/separator",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "product-card",
    name: "Product card",
    category: "Commerce",
    description:
      "Products-index product tile — image, title, status badge with status dot, price with optional compare-at, and inventory state.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/aspect-ratio",
      "@byronwade/badge",
      "@byronwade/card",
      "@byronwade/status-dot",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "variant-picker",
    name: "Variant picker",
    category: "Commerce",
    description:
      "Product option/variant selector — one labelled toggle-group row per option with unavailable values disabled.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/label",
      "@byronwade/toggle-group",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "inventory-bar",
    name: "Inventory bar",
    category: "Commerce",
    description:
      "Stock-level indicator composing the progress primitive — a count plus a tonal bar for in-stock, low-stock, and out-of-stock states.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/progress",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "customer-card",
    name: "Customer card",
    category: "Commerce",
    description:
      "Customer summary card — avatar, name and email, orders and lifetime-spend stats, and a default address.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/avatar",
      "@byronwade/card",
      "@byronwade/metric-stat",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "fulfillment-tracker",
    name: "Fulfillment tracker",
    category: "Commerce",
    description:
      "Order status header — payment and fulfillment status pills plus an optional fulfillment step rail. Models Shopify's dual payment/fulfillment status.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/status-pill",
      "@byronwade/status-dot",
      "@byronwade/verification-progress",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "index-table",
    name: "Index table",
    category: "Data display",
    description:
      "Sortable, row-selectable data table with an integrated bulk-action bar, sticky header, loading and empty states, and pagination. The signature Shopify-admin index.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/table",
      "@byronwade/checkbox",
      "@byronwade/bulk-action-bar",
      "@byronwade/skeleton",
      "@byronwade/button",
      "@byronwade/empty-state",
      "@byronwade/utils",
    ],
    examples: [
      "default",
      "condensed",
      "empty",
      "loading",
      "selection",
      "with-pagination",
    ],
  },
  {
    slug: "resource-list",
    name: "Resource list",
    category: "Data display",
    description:
      "List-view of selectable rich rows (ResourceList + ResourceItem) — media, title, metadata, badges, hover actions, bulk selection. The list counterpart of index-table.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/badge",
      "@byronwade/bulk-action-bar",
      "@byronwade/checkbox",
      "@byronwade/utils",
    ],
    examples: [
      "default",
      "empty",
      "loading",
      "no-media",
      "selectable",
      "with-actions",
    ],
  },
  {
    slug: "index-filters",
    name: "Index filters",
    category: "Composites",
    description:
      "Filter bar for an index: saved-view tabs, search, sort dropdown, and removable applied-filter pills. Pairs with index-table / resource-list.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/segmented-control",
      "@byronwade/input",
      "@byronwade/filter-pill",
      "@byronwade/dropdown-menu",
      "@byronwade/button",
      "@byronwade/utils",
    ],
    examples: ["default", "no-tabs", "search-only", "with-applied-filters"],
  },
  {
    slug: "tag-input",
    name: "Tag input",
    category: "Forms",
    description:
      "Tags field — type to add chips (Enter/comma), remove with × or Backspace, optional autocomplete suggestions, sizes, and error state.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/badge",
      "@byronwade/utils",
    ],
    examples: [
      "default",
      "disabled",
      "error",
      "max-tags",
      "sizes",
      "with-suggestions",
    ],
  },
  {
    slug: "drop-zone",
    name: "Drop zone",
    category: "Forms",
    description:
      "Drag-and-drop file/media upload with drag-over and rejected-file states, image preview thumbnails or a file list, and size variants.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/button",
      "@byronwade/utils",
    ],
    examples: ["default", "disabled", "error", "file-list", "single", "sizes"],
  },
  {
    slug: "banner",
    name: "Banner",
    category: "Feedback",
    description:
      "Prominent inline status message with tone (info/success/warning/critical), title, body, actions, and dismiss. Distinct from the compact alert.",
    npmDeps: ["lucide-react"],
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/button",
      "@byronwade/utils",
    ],
    examples: ["default", "dismissible", "inline", "tones", "with-actions"],
  },
  // Video / YouTube — YouTube-modeled video UI
  {
    slug: "thumbnail",
    name: "Thumbnail",
    category: "Video",
    description:
      "Video thumbnail tile with optional duration pill, watched-progress bar, and live chip.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/aspect-ratio",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "verified-badge",
    name: "Verified badge",
    category: "Video",
    description:
      "Inline verified check shown next to channel or author names, with default check-seal and artist music-seal variants.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "live-badge",
    name: "Live badge",
    category: "Video",
    description:
      "A YouTube-style LIVE indicator pill with an optional pulsing dot and compact-formatted concurrent-viewer count.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "subscribe-button",
    name: "Subscribe button",
    category: "Video",
    description:
      "YouTube-style subscribe control with a two-state toggle and a notification-level dropdown menu.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/button",
      "@byronwade/dropdown-menu",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "chip-bar",
    name: "Chip bar",
    category: "Video",
    description:
      "YouTube-style single-select horizontal filter chip bar with edge fade and scroll affordance.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "action-rail",
    name: "Action rail",
    category: "Video",
    description:
      "Vertical or horizontal stack of icon and compact-count action buttons — a YouTube Shorts-style like/comment/share rail.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "video-card",
    name: "Video card",
    category: "Video",
    description:
      "YouTube-style vertical video tile composing a thumbnail, channel byline, compact view/timestamp meta, and an overflow menu.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/thumbnail",
      "@byronwade/verified-badge",
      "@byronwade/avatar",
      "@byronwade/dropdown-menu",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "video-shelf",
    name: "Video shelf",
    category: "Video",
    description:
      "Titled, horizontally-scrolling content row with edge-fade, chevron controls, and an optional action — the YouTube home/category shelf.",
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "channel-header",
    name: "Channel header",
    category: "Video",
    description:
      "YouTube-style channel page header with banner, avatar, verified handle and counts, subscribe/join actions, and section tabs.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/avatar",
      "@byronwade/verified-badge",
      "@byronwade/subscribe-button",
      "@byronwade/button",
      "@byronwade/tabs",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "up-next-item",
    name: "Up next item",
    category: "Video",
    description:
      "Compact horizontal video row for watch-page up-next lists and search results, composing a thumbnail with title, channel, view/timestamp meta, and an overflow menu.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/thumbnail",
      "@byronwade/verified-badge",
      "@byronwade/dropdown-menu",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "channel-byline",
    name: "Channel byline",
    category: "Video",
    description:
      "Watch-page channel identity row: avatar, name with verified badge and subscriber count, plus a SubscribeButton and optional action slot.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/avatar",
      "@byronwade/verified-badge",
      "@byronwade/subscribe-button",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "engagement-bar",
    name: "Engagement bar",
    category: "Video",
    description:
      "YouTube-style watch-page action row: connected like/dislike segmented pill, plus share, save, custom action, and overflow-menu pills.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/separator",
      "@byronwade/dropdown-menu",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "description-box",
    name: "Description box",
    category: "Video",
    description:
      'YouTube watch-page description panel with a views/date header and collapsible body text that expands via "...more" / "Show less".',
    registryDeps: ["@byronwade/foundation", "@byronwade/utils"],
    examples: ["default"],
  },
  {
    slug: "comment",
    name: "Comment",
    category: "Video",
    description:
      "A YouTube-style threaded comment with author, like/dislike, reply, pinned/creator-heart tags, and a replies disclosure.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/avatar",
      "@byronwade/verified-badge",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "comment-composer",
    name: "Comment composer",
    category: "Video",
    description:
      "YouTube-style comment composer: an avatar plus an underline text input that reveals Cancel/Comment actions on focus or input.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/avatar",
      "@byronwade/button",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "shorts-player",
    name: "Shorts player",
    category: "Video",
    description:
      "A YouTube Shorts-style vertical 9:16 player with a right-side engagement rail and a bottom-left author, caption, and sound overlay.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/action-rail",
      "@byronwade/avatar",
      "@byronwade/verified-badge",
      "@byronwade/button",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "mini-player",
    name: "Mini player",
    category: "Video",
    description:
      "Picture-in-picture mini player card with a play/pause poster overlay, progress, and close/expand controls.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/thumbnail",
      "@byronwade/button",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "chapter-list",
    name: "Chapter list",
    category: "Video",
    description:
      "A YouTube-style chapter list with timestamps, thumbnails, and an active chapter derived from the playhead.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/thumbnail",
      "@byronwade/utils",
    ],
    examples: ["default"],
  },
  {
    slug: "playback-menu",
    name: "Playback menu",
    category: "Video",
    description:
      "YouTube-style player settings menu: gear-triggered dropdown of setting groups (quality, speed, subtitles), each opening a single-select radio submenu.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/dropdown-menu",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "studio-video-row",
    name: "Studio video row",
    category: "Video",
    description:
      "A YouTube Studio content-table row composing a selection checkbox, thumbnail, title/description, visibility status, date, and compact mono view/comment/like metrics with an overflow menu.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/thumbnail",
      "@byronwade/checkbox",
      "@byronwade/status-dot",
      "@byronwade/badge",
      "@byronwade/dropdown-menu",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "upload-row",
    name: "Upload row",
    category: "Video",
    description:
      "YouTube Studio-style upload/processing row: preview, filename, progress bar, status badge, and a cancel/retry action.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/progress",
      "@byronwade/thumbnail",
      "@byronwade/status-dot",
      "@byronwade/badge",
      "@byronwade/button",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
  {
    slug: "comment-moderation-row",
    name: "Comment moderation row",
    category: "Video",
    description:
      "A YouTube Studio comment-moderation row with approve/remove/heart/reply actions, a status tag, and optional video context.",
    registryDeps: [
      "@byronwade/foundation",
      "@byronwade/avatar",
      "@byronwade/button",
      "@byronwade/badge",
      "@byronwade/verified-badge",
      "@byronwade/utils",
    ],
    npmDeps: ["lucide-react"],
    examples: ["default"],
  },
]

export const categories = [
  "Foundation",
  "Libraries",
  "UI",
  "Composites",
  "Primitives",
  "Forms",
  "Overlays",
  "Feedback",
  "Data display",
  "Patterns",
  "Charts",
  "House components",
  "Morph",
  "Media",
  "Commerce",
  "AI",
] as const
export const byCategory = (cat: string) =>
  components.filter((c) => c.category === cat)
export const bySlug = (slug: string) => components.find((c) => c.slug === slug)

/**
 * Variants for a component. Authored `variants` win; otherwise synthesize one
 * "default" variant from the type itself so every component exposes at least one
 * addressable variant during the Phase 2 migration.
 */
export const getVariants = (doc: ComponentDoc): Variant[] =>
  doc.variants && doc.variants.length > 0
    ? doc.variants
    : [
        {
          id: "default",
          name: doc.name,
          tags: doc.tags ?? [],
          example: "default",
        },
      ]
