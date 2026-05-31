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
};
