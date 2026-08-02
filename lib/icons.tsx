/**
 * Phosphor icon barrel — duotone by default.
 *
 * Import icons only from here. Never import `@phosphor-icons/react` or
 * `lucide-react` directly in components.
 *
 * Uses the Phosphor SSR entry so server components can render icons.
 * Names follow the Phosphor catalog (`CaretDown`, `MagnifyingGlass`, …).
 * A few Lucide-shaped aliases (`CheckIcon`, `ListTodo`, `Search`, …) are
 * kept so existing shadcn call sites stay readable.
 */
import {
  ArrowRight as PhosphorArrowRight,
  CaretDown as PhosphorCaretDown,
  CaretLeft as PhosphorCaretLeft,
  CaretRight as PhosphorCaretRight,
  CaretUp as PhosphorCaretUp,
  Check as PhosphorCheck,
  CheckCircle as PhosphorCheckCircle,
  Circle as PhosphorCircle,
  CircleNotch as PhosphorCircleNotch,
  Copy as PhosphorCopy,
  Desktop as PhosphorDesktop,
  DeviceMobile as PhosphorDeviceMobile,
  DotsThree as PhosphorDotsThree,
  FileText as PhosphorFileText,
  Gear as PhosphorGear,
  House as PhosphorHouse,
  Info as PhosphorInfo,
  List as PhosphorList,
  MagnifyingGlass as PhosphorMagnifyingGlass,
  Moon as PhosphorMoon,
  Plus as PhosphorPlus,
  SidebarSimple as PhosphorSidebarSimple,
  Sparkle as PhosphorSparkle,
  Sun as PhosphorSun,
  Terminal as PhosphorTerminal,
  User as PhosphorUser,
  Warning as PhosphorWarning,
  WarningOctagon as PhosphorWarningOctagon,
  X as PhosphorX,
} from "@phosphor-icons/react/ssr"
import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
  IconWeight,
} from "@phosphor-icons/react"
import * as React from "react"

type IconProps = Omit<PhosphorIconProps, "weight"> & {
  weight?: IconWeight
  size?: number | string
}

type IconComponent = React.ForwardRefExoticComponent<
  IconProps & React.RefAttributes<SVGSVGElement>
>

function withDuotone(
  Icon: PhosphorIcon,
  displayName: string
): IconComponent {
  const Wrapped = React.forwardRef<SVGSVGElement, IconProps>(
    function WrappedIcon({ weight = "duotone", ...props }, ref) {
      return <Icon ref={ref} weight={weight} {...props} />
    }
  )
  Wrapped.displayName = displayName
  return Wrapped
}

const ArrowRight = withDuotone(PhosphorArrowRight, "ArrowRight")
const CaretDown = withDuotone(PhosphorCaretDown, "CaretDown")
const CaretLeft = withDuotone(PhosphorCaretLeft, "CaretLeft")
const CaretRight = withDuotone(PhosphorCaretRight, "CaretRight")
const CaretUp = withDuotone(PhosphorCaretUp, "CaretUp")
const Check = withDuotone(PhosphorCheck, "Check")
const CheckCircle = withDuotone(PhosphorCheckCircle, "CheckCircle")
const Circle = withDuotone(PhosphorCircle, "Circle")
const CircleNotch = withDuotone(PhosphorCircleNotch, "CircleNotch")
const Copy = withDuotone(PhosphorCopy, "Copy")
const Desktop = withDuotone(PhosphorDesktop, "Desktop")
const DeviceMobile = withDuotone(PhosphorDeviceMobile, "DeviceMobile")
const DotsThree = withDuotone(PhosphorDotsThree, "DotsThree")
const FileText = withDuotone(PhosphorFileText, "FileText")
const Gear = withDuotone(PhosphorGear, "Gear")
const House = withDuotone(PhosphorHouse, "House")
const Info = withDuotone(PhosphorInfo, "Info")
const List = withDuotone(PhosphorList, "List")
const MagnifyingGlass = withDuotone(PhosphorMagnifyingGlass, "MagnifyingGlass")
const Moon = withDuotone(PhosphorMoon, "Moon")
const Plus = withDuotone(PhosphorPlus, "Plus")
const SidebarSimple = withDuotone(PhosphorSidebarSimple, "SidebarSimple")
const Sparkle = withDuotone(PhosphorSparkle, "Sparkle")
const Sun = withDuotone(PhosphorSun, "Sun")
const Terminal = withDuotone(PhosphorTerminal, "Terminal")
const User = withDuotone(PhosphorUser, "User")
const Warning = withDuotone(PhosphorWarning, "Warning")
const WarningOctagon = withDuotone(PhosphorWarningOctagon, "WarningOctagon")
const X = withDuotone(PhosphorX, "X")

/** Lucide-shaped aliases used by shadcn primitives + surface demos. */
const CheckIcon = Check
const ChevronDownIcon = CaretDown
const ChevronLeftIcon = CaretLeft
const ChevronRightIcon = CaretRight
const ChevronUpIcon = CaretUp
const CircleIcon = Circle
const CircleCheckIcon = CheckCircle
const InfoIcon = Info
const TriangleAlertIcon = Warning
const OctagonXIcon = WarningOctagon
const Loader2Icon = CircleNotch
const XIcon = X
const ListTodo = List
const Search = MagnifyingGlass
const Monitor = Desktop
const Smartphone = DeviceMobile
const Menu = List
const Settings = Gear
const PanelLeft = SidebarSimple

export {
  ArrowRight,
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  Check,
  CheckCircle,
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  Circle,
  CircleCheckIcon,
  CircleIcon,
  CircleNotch,
  Copy,
  Desktop,
  DeviceMobile,
  DotsThree,
  FileText,
  Gear,
  House,
  Info,
  InfoIcon,
  List,
  ListTodo,
  Loader2Icon,
  MagnifyingGlass,
  Menu,
  Monitor,
  Moon,
  OctagonXIcon,
  PanelLeft,
  Plus,
  Search,
  Settings,
  SidebarSimple,
  Smartphone,
  Sparkle,
  Sun,
  Terminal,
  TriangleAlertIcon,
  User,
  Warning,
  WarningOctagon,
  X,
  XIcon,
}

export type { IconComponent as Icon, IconProps, IconWeight }
