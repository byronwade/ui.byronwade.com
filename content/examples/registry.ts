import type { ComponentType } from "react";

import GaugeDefault from "./gauge/default";
import GaugeTones from "./gauge/tones";
import StatusDotTones from "./status-dot/tones";
import StatusDotPulse from "./status-dot/pulse";
import GradientAvatarSeeds from "./gradient-avatar/seeds";
import GradientAvatarSizes from "./gradient-avatar/sizes";
import ActivityGridDefault from "./activity-grid/default";
import FilterPillDefault from "./filter-pill/default";
import SegmentedControlDefault from "./segmented-control/default";
import TimelineRailDefault from "./timeline-rail/default";
import SplitWithRailDefault from "./split-with-rail/default";
import HeroSectionDefault from "./hero-section/default";
import MetricStatDefault from "./metric-stat/default";
import CenteredFocalDefault from "./centered-focal/default";
import IdentityNames from "./identity/names";
import FoundationTokens from "./foundation/tokens";
import ButtonDefault from "./button/default";
import BadgeDefault from "./badge/default";
import CardDefault from "./card/default";
import StatusPillDefault from "./status-pill/default";
import InputDefault from "./input/default";
import TextareaDefault from "./textarea/default";
import LabelDefault from "./label/default";
import SelectDefault from "./select/default";
import CheckboxDefault from "./checkbox/default";
import SwitchDefault from "./switch/default";
import RadioGroupDefault from "./radio-group/default";
import TooltipDefault from "./tooltip/default";
import PopoverDefault from "./popover/default";
import DropdownMenuDefault from "./dropdown-menu/default";
import DialogDefault from "./dialog/default";
import HoverCardDefault from "./hover-card/default";
import AlertDefault from "./alert/default";
import ProgressDefault from "./progress/default";
import SkeletonDefault from "./skeleton/default";
import SonnerDefault from "./sonner/default";
import TabsDefault from "./tabs/default";
import AccordionDefault from "./accordion/default";
import AvatarDefault from "./avatar/default";
import SeparatorDefault from "./separator/default";
import BreadcrumbDefault from "./breadcrumb/default";
import TableDefault from "./table/default";
import PageHeaderDefault from "./page-header/default";
import StatCardDefault from "./stat-card/default";
import EmptyStateDefault from "./empty-state/default";
import ChartDefault from "./chart/default";
import DetailHeaderDefault from "./detail-header/default";
import SectionDefault from "./section/default";
import EventTimelineDefault from "./event-timeline/default";

export type Example = { name: string; file: string; Component: ComponentType };

export const examples: Record<string, Example[]> = {
  gauge: [
    { name: "Default", file: "gauge/default.tsx", Component: GaugeDefault },
    { name: "Tones", file: "gauge/tones.tsx", Component: GaugeTones },
  ],
  "status-dot": [
    { name: "Tones", file: "status-dot/tones.tsx", Component: StatusDotTones },
    { name: "Pulse", file: "status-dot/pulse.tsx", Component: StatusDotPulse },
  ],
  "gradient-avatar": [
    { name: "Seeds", file: "gradient-avatar/seeds.tsx", Component: GradientAvatarSeeds },
    { name: "Sizes", file: "gradient-avatar/sizes.tsx", Component: GradientAvatarSizes },
  ],
  "activity-grid": [{ name: "Default", file: "activity-grid/default.tsx", Component: ActivityGridDefault }],
  "filter-pill": [{ name: "Default", file: "filter-pill/default.tsx", Component: FilterPillDefault }],
  "segmented-control": [{ name: "Default", file: "segmented-control/default.tsx", Component: SegmentedControlDefault }],
  "timeline-rail": [{ name: "Default", file: "timeline-rail/default.tsx", Component: TimelineRailDefault }],
  "split-with-rail": [{ name: "Default", file: "split-with-rail/default.tsx", Component: SplitWithRailDefault }],
  "hero-section": [{ name: "Default", file: "hero-section/default.tsx", Component: HeroSectionDefault }],
  "metric-stat": [{ name: "Default", file: "metric-stat/default.tsx", Component: MetricStatDefault }],
  "centered-focal": [{ name: "Default", file: "centered-focal/default.tsx", Component: CenteredFocalDefault }],
  identity: [{ name: "Names", file: "identity/names.tsx", Component: IdentityNames }],
  foundation: [{ name: "Tokens", file: "foundation/tokens.tsx", Component: FoundationTokens }],
  button: [{ name: "Default", file: "button/default.tsx", Component: ButtonDefault }],
  badge: [{ name: "Default", file: "badge/default.tsx", Component: BadgeDefault }],
  card: [{ name: "Default", file: "card/default.tsx", Component: CardDefault }],
  "status-pill": [{ name: "Default", file: "status-pill/default.tsx", Component: StatusPillDefault }],
  input: [{ name: "Default", file: "input/default.tsx", Component: InputDefault }],
  textarea: [{ name: "Default", file: "textarea/default.tsx", Component: TextareaDefault }],
  label: [{ name: "Default", file: "label/default.tsx", Component: LabelDefault }],
  select: [{ name: "Default", file: "select/default.tsx", Component: SelectDefault }],
  checkbox: [{ name: "Default", file: "checkbox/default.tsx", Component: CheckboxDefault }],
  switch: [{ name: "Default", file: "switch/default.tsx", Component: SwitchDefault }],
  "radio-group": [{ name: "Default", file: "radio-group/default.tsx", Component: RadioGroupDefault }],
  tooltip: [{ name: "Default", file: "tooltip/default.tsx", Component: TooltipDefault }],
  popover: [{ name: "Default", file: "popover/default.tsx", Component: PopoverDefault }],
  "dropdown-menu": [{ name: "Default", file: "dropdown-menu/default.tsx", Component: DropdownMenuDefault }],
  dialog: [{ name: "Default", file: "dialog/default.tsx", Component: DialogDefault }],
  "hover-card": [{ name: "Default", file: "hover-card/default.tsx", Component: HoverCardDefault }],
  alert: [{ name: "Default", file: "alert/default.tsx", Component: AlertDefault }],
  progress: [{ name: "Default", file: "progress/default.tsx", Component: ProgressDefault }],
  skeleton: [{ name: "Default", file: "skeleton/default.tsx", Component: SkeletonDefault }],
  sonner: [{ name: "Default", file: "sonner/default.tsx", Component: SonnerDefault }],
  tabs: [{ name: "Default", file: "tabs/default.tsx", Component: TabsDefault }],
  accordion: [{ name: "Default", file: "accordion/default.tsx", Component: AccordionDefault }],
  avatar: [{ name: "Default", file: "avatar/default.tsx", Component: AvatarDefault }],
  separator: [{ name: "Default", file: "separator/default.tsx", Component: SeparatorDefault }],
  breadcrumb: [{ name: "Default", file: "breadcrumb/default.tsx", Component: BreadcrumbDefault }],
  table: [{ name: "Default", file: "table/default.tsx", Component: TableDefault }],
  "page-header": [{ name: "Default", file: "page-header/default.tsx", Component: PageHeaderDefault }],
  "stat-card": [{ name: "Default", file: "stat-card/default.tsx", Component: StatCardDefault }],
  "empty-state": [{ name: "Default", file: "empty-state/default.tsx", Component: EmptyStateDefault }],
  chart: [{ name: "Default", file: "chart/default.tsx", Component: ChartDefault }],
  "detail-header": [{ name: "Default", file: "detail-header/default.tsx", Component: DetailHeaderDefault }],
  section: [{ name: "Default", file: "section/default.tsx", Component: SectionDefault }],
  "event-timeline": [{ name: "Default", file: "event-timeline/default.tsx", Component: EventTimelineDefault }],
};
