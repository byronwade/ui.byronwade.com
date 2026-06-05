import type { ComponentType } from "react";

import AccordionDefault from "./accordion/default";
import AccordionControlled from "./accordion/controlled";
import AccordionDisabled from "./accordion/disabled";
import AccordionKeepMounted from "./accordion/keep-mounted";
import AccordionMultiple from "./accordion/multiple";
import AccordionNestedContent from "./accordion/nested-content";
import AccordionWithIcon from "./accordion/with-icon";
import ActivityGridDefault from "./activity-grid/default";
import ActivityGridColumns from "./activity-grid/columns";
import ActivityGridEmpty from "./activity-grid/empty";
import ActivityGridInCard from "./activity-grid/in-card";
import ActivityGridIntensityLevels from "./activity-grid/intensity-levels";
import ActivityGridInteractive from "./activity-grid/interactive";
import ActivityRingDefault from "./activity-ring/default";
import ActivityRingScore from "./activity-ring/score";
import ActivityRingScoreTones from "./activity-ring/score-tones";
import ActivityRingTones from "./activity-ring/tones";
import ActivityRingWithVerdict from "./activity-ring/with-verdict";
import AiArtifactDefault from "./ai-artifact/default";
import AiAttachmentsDefault from "./ai-attachments/default";
import AiAttachmentsVariants from "./ai-attachments/variants";
import AiCanvasDefault from "./ai-canvas/default";
import AiChainOfThoughtDefault from "./ai-chain-of-thought/default";
import AiCheckpointDefault from "./ai-checkpoint/default";
import AiCodeBlockDefault from "./ai-code-block/default";
import AiConfirmationDefault from "./ai-confirmation/default";
import AiConnectionDefault from "./ai-connection/default";
import AiContextDefault from "./ai-context/default";
import AiControlsDefault from "./ai-controls/default";
import AiConversationDefault from "./ai-conversation/default";
import AiEdgeDefault from "./ai-edge/default";
import AiImageDefault from "./ai-image/default";
import AiInlineCitationDefault from "./ai-inline-citation/default";
import AiLoaderDefault from "./ai-loader/default";
import AiMessageDefault from "./ai-message/default";
import AiModelSelectorDefault from "./ai-model-selector/default";
import AiNodeDefault from "./ai-node/default";
import AiOpenInChatDefault from "./ai-open-in-chat/default";
import AiPanelDefault from "./ai-panel/default";
import AiPlanDefault from "./ai-plan/default";
import AiPromptInputDefault from "./ai-prompt-input/default";
import AiQueueDefault from "./ai-queue/default";
import AiReasoningDefault from "./ai-reasoning/default";
import AiShimmerDefault from "./ai-shimmer/default";
import AiShimmerTones from "./ai-shimmer/tones";
import AiSourcesDefault from "./ai-sources/default";
import AiSuggestionDefault from "./ai-suggestion/default";
import AiTaskDefault from "./ai-task/default";
import AiToolDefault from "./ai-tool/default";
import AiToolbarDefault from "./ai-toolbar/default";
import AiWebPreviewDefault from "./ai-web-preview/default";
import AlbumCoverDefault from "./album-cover/default";
import AlbumCoverPlaying from "./album-cover/playing";
import AlbumCoverShapes from "./album-cover/shapes";
import AlbumCoverSizes from "./album-cover/sizes";
import AlertDefault from "./alert/default";
import AlertNoIcon from "./alert/no-icon";
import AlertVariants from "./alert/variants";
import AlertWithAction from "./alert/with-action";
import AlertWithIcon from "./alert/with-icon";
import AlertWithLink from "./alert/with-link";
import AndroidDefault from "./android/default";
import AppShellDefault from "./app-shell/default";
import AppleCardsCarouselDefault from "./apple-cards-carousel/default";
import ArtistHeaderDefault from "./artist-header/default";
import AspectRatioDefault from "./aspect-ratio/default";
import AspectRatioCinematic from "./aspect-ratio/cinematic";
import AspectRatioPortrait from "./aspect-ratio/portrait";
import AspectRatioSquare from "./aspect-ratio/square";
import AspectRatioThumbnail from "./aspect-ratio/thumbnail";
import AudioPlayerDefault from "./audio-player/default";
import AudioWaveformDefault from "./audio-waveform/default";
import AvatarDefault from "./avatar/default";
import AvatarFallback from "./avatar/fallback";
import AvatarGroup from "./avatar/group";
import AvatarSizes from "./avatar/sizes";
import AvatarUserList from "./avatar/user-list";
import AvatarWithBadge from "./avatar/with-badge";
import BacklightDefault from "./backlight/default";
import BacklightWithVideo from "./backlight/with-video";
import BadgeDefault from "./badge/default";
import BadgeAsLink from "./badge/as-link";
import BadgeInlineContent from "./badge/inline-content";
import BadgeInvalid from "./badge/invalid";
import BadgeStatus from "./badge/status";
import BadgeWithIcon from "./badge/with-icon";
import BannerDefault from "./banner/default";
import BannerDismissible from "./banner/dismissible";
import BannerInline from "./banner/inline";
import BannerTones from "./banner/tones";
import BannerWithActions from "./banner/with-actions";
import BreadcrumbDefault from "./breadcrumb/default";
import BreadcrumbCustomSeparator from "./breadcrumb/custom-separator";
import BreadcrumbLongPath from "./breadcrumb/long-path";
import BreadcrumbResponsive from "./breadcrumb/responsive";
import BreadcrumbWithEllipsis from "./breadcrumb/with-ellipsis";
import BreadcrumbWithIcons from "./breadcrumb/with-icons";
import BreadcrumbWithRenderProp from "./breadcrumb/with-render-prop";
import BulkActionBarDefault from "./bulk-action-bar/default";
import ButtonDefault from "./button/default";
import ButtonCount from "./button/count";
import ButtonDestructive from "./button/destructive";
import ButtonDisabled from "./button/disabled";
import ButtonError from "./button/error";
import ButtonGhost from "./button/ghost";
import ButtonIcon from "./button/icon";
import ButtonIconSm from "./button/icon-sm";
import ButtonLeadingIcon from "./button/leading-icon";
import ButtonLink from "./button/link";
import ButtonLoading from "./button/loading";
import ButtonOutline from "./button/outline";
import ButtonSecondary from "./button/secondary";
import ButtonSizeLg from "./button/size-lg";
import ButtonSizeSm from "./button/size-sm";
import ButtonSizeXs from "./button/size-xs";
import ButtonSizes from "./button/sizes";
import ButtonSolid from "./button/solid";
import ButtonStateful from "./button/stateful";
import ButtonTrailingIcon from "./button/trailing-icon";
import ButtonVariants from "./button/variants";
import ButtonWithIcon from "./button/with-icon";
import ButtonGroupDefault from "./button-group/default";
import ButtonGroupVertical from "./button-group/vertical";
import CalendarDefault from "./calendar/default";
import CalendarAppointment from "./calendar/appointment";
import CalendarPricing from "./calendar/pricing";
import CalendarRangePresets from "./calendar/range-presets";
import CandlestickChartDefault from "./candlestick-chart/default";
import CardDefault from "./card/default";
import CardContentOnly from "./card/content-only";
import CardFrameEmpty from "./card/frame-empty";
import CardFrameFooter from "./card/frame-footer";
import CardFrameHeader from "./card/frame-header";
import CardFrameHeaderFooter from "./card/frame-header-footer";
import CardGridLayout from "./card/grid-layout";
import CardLoginForm from "./card/login-form";
import CardSizes from "./card/sizes";
import CardWithAction from "./card/with-action";
import CardWithImage from "./card/with-image";
import CenteredFocalDefault from "./centered-focal/default";
import CenteredFocalCustomClassname from "./centered-focal/custom-classname";
import CenteredFocalLoadingState from "./centered-focal/loading-state";
import CenteredFocalNoBackdrop from "./centered-focal/no-backdrop";
import CenteredFocalWithForm from "./centered-focal/with-form";
import CenteredFocalWithIllustrationBackdrop from "./centered-focal/with-illustration-backdrop";
import ChartDefault from "./chart/default";
import ChartBarChart from "./chart/bar-chart";
import ChartCustomTooltip from "./chart/custom-tooltip";
import ChartDonutChart from "./chart/donut-chart";
import ChartLegendVariants from "./chart/legend-variants";
import ChartLineChart from "./chart/line-chart";
import ChartPieChart from "./chart/pie-chart";
import ChartRadialBar from "./chart/radial-bar";
import ChartStackedBar from "./chart/stacked-bar";
import ChartThemeColors from "./chart/theme-colors";
import ChartTooltipVariants from "./chart/tooltip-variants";
import CheckboxDefault from "./checkbox/default";
import CheckboxCheckboxGroup from "./checkbox/checkbox-group";
import CheckboxDisabled from "./checkbox/disabled";
import CheckboxIndeterminate from "./checkbox/indeterminate";
import CheckboxReadonly from "./checkbox/readonly";
import CheckboxWithLabel from "./checkbox/with-label";
import CollapsibleDefault from "./collapsible/default";
import CollapsibleDisabled from "./collapsible/disabled";
import CollapsibleFaq from "./collapsible/faq";
import CollapsibleUncontrolled from "./collapsible/uncontrolled";
import CollapsibleWithRichContent from "./collapsible/with-rich-content";
import ColorPickerDefault from "./color-picker/default";
import ColorPickerInline from "./color-picker/inline";
import ColorPickerSizes from "./color-picker/sizes";
import CommandDefault from "./command/default";
import CommandActions from "./command/actions";
import CommandCards from "./command/cards";
import CommandEmptyState from "./command/empty-state";
import CommandFiles from "./command/files";
import CommandGrouped from "./command/grouped";
import CommandInline from "./command/inline";
import CommandPeople from "./command/people";
import CommandWithIcons from "./command/with-icons";
import CommandResultDefault from "./command-result/default";
import ConversationListDefault from "./conversation-list/default";
import CreditCardDefault from "./credit-card/default";
import CreditCardTones from "./credit-card/tones";
import CursorDefault from "./cursor/default";
import CursorTones from "./cursor/tones";
import CustomerCardDefault from "./customer-card/default";
import DepthChartDefault from "./depth-chart/default";
import DetailHeaderDefault from "./detail-header/default";
import DetailHeaderCustomTitleNode from "./detail-header/custom-title-node";
import DetailHeaderManyActions from "./detail-header/many-actions";
import DetailHeaderMetaGridStandalone from "./detail-header/meta-grid-standalone";
import DetailHeaderNoMeta from "./detail-header/no-meta";
import DetailHeaderRichMetaValues from "./detail-header/rich-meta-values";
import DetailHeaderWithStatusBadges from "./detail-header/with-status-badges";
import DialogDefault from "./dialog/default";
import DialogDestructive from "./dialog/destructive";
import DialogLoading from "./dialog/loading";
import DialogNoCloseButton from "./dialog/no-close-button";
import DialogScrollable from "./dialog/scrollable";
import DialogWithForm from "./dialog/with-form";
import DialogWithIcon from "./dialog/with-icon";
import DropZoneDefault from "./drop-zone/default";
import DropZoneDisabled from "./drop-zone/disabled";
import DropZoneError from "./drop-zone/error";
import DropZoneFileList from "./drop-zone/file-list";
import DropZoneSingle from "./drop-zone/single";
import DropZoneSizes from "./drop-zone/sizes";
import DropdownMenuDefault from "./dropdown-menu/default";
import DropdownMenuDisabled from "./dropdown-menu/disabled";
import DropdownMenuWithCheckboxes from "./dropdown-menu/with-checkboxes";
import DropdownMenuWithIcons from "./dropdown-menu/with-icons";
import DropdownMenuWithRadio from "./dropdown-menu/with-radio";
import DropdownMenuWithShortcuts from "./dropdown-menu/with-shortcuts";
import DropdownMenuWithSubmenu from "./dropdown-menu/with-submenu";
import EditorDefault from "./editor/default";
import EmptyStateDefault from "./empty-state/default";
import EmptyStateCompact from "./empty-state/compact";
import EmptyStateErrorState from "./empty-state/error-state";
import EmptyStateMinimal from "./empty-state/minimal";
import EmptyStateNoIcon from "./empty-state/no-icon";
import EmptyStateSearchNoResults from "./empty-state/search-no-results";
import EmptyStateWithMultipleActions from "./empty-state/with-multiple-actions";
import EqualizerBarsDefault from "./equalizer-bars/default";
import EventTimelineDefault from "./event-timeline/default";
import EventTimelineLiveFeed from "./event-timeline/live-feed";
import EventTimelineRichContent from "./event-timeline/rich-content";
import EventTimelineSingleEvent from "./event-timeline/single-event";
import EventTimelineTimestamps from "./event-timeline/timestamps";
import EventTimelineTitleOnly from "./event-timeline/title-only";
import EventTimelineTones from "./event-timeline/tones";
import FileTreeDefault from "./file-tree/default";
import FileTreeMultiSelect from "./file-tree/multi-select";
import FileTreePanel from "./file-tree/panel";
import FilterPillDefault from "./filter-pill/default";
import FilterPillActiveState from "./filter-pill/active-state";
import FilterPillAsSelectTrigger from "./filter-pill/as-select-trigger";
import FilterPillDisabled from "./filter-pill/disabled";
import FilterPillFilterBar from "./filter-pill/filter-bar";
import FilterPillWithIcon from "./filter-pill/with-icon";
import FloatingDockDefault from "./floating-dock/default";
import FoundationTokens from "./foundation/tokens";
import FulfillmentTrackerDefault from "./fulfillment-tracker/default";
import GanttDefault from "./gantt/default";
import GanttCompact from "./gantt/compact";
import GanttControls from "./gantt/controls";
import GanttReadOnly from "./gantt/read-only";
import GlimpseDefault from "./glimpse/default";
import GradientAvatarDefault from "./gradient-avatar/default";
import GradientAvatarGroupedStack from "./gradient-avatar/grouped-stack";
import GradientAvatarListRows from "./gradient-avatar/list-rows";
import GradientAvatarSeeds from "./gradient-avatar/seeds";
import GradientAvatarSizes from "./gradient-avatar/sizes";
import GradientAvatarWithNameBadge from "./gradient-avatar/with-name-badge";
import HeatmapGridDefault from "./heatmap-grid/default";
import HeroSectionDefault from "./hero-section/default";
import HeroSectionNoHeader from "./hero-section/no-header";
import HeroSectionWithActionHeader from "./hero-section/with-action-header";
import HeroSectionWithChart from "./hero-section/with-chart";
import HeroSectionWithCustomClassname from "./hero-section/with-custom-classname";
import HeroSectionWithMetricsHeader from "./hero-section/with-metrics-header";
import HoverCardDefault from "./hover-card/default";
import HoverCardAlignment from "./hover-card/alignment";
import HoverCardControlled from "./hover-card/controlled";
import HoverCardPlacement from "./hover-card/placement";
import HoverCardRichContent from "./hover-card/rich-content";
import HoverCardWithDelay from "./hover-card/with-delay";
import IdentityNames from "./identity/names";
import ImageCropDefault from "./image-crop/default";
import IndexFiltersDefault from "./index-filters/default";
import IndexFiltersNoTabs from "./index-filters/no-tabs";
import IndexFiltersSearchOnly from "./index-filters/search-only";
import IndexFiltersWithAppliedFilters from "./index-filters/with-applied-filters";
import IndexTableDefault from "./index-table/default";
import IndexTableCondensed from "./index-table/condensed";
import IndexTableEmpty from "./index-table/empty";
import IndexTableLoading from "./index-table/loading";
import IndexTableSelection from "./index-table/selection";
import IndexTableWithPagination from "./index-table/with-pagination";
import InputDefault from "./input/default";
import InputDisabled from "./input/disabled";
import InputError from "./input/error";
import InputFileUpload from "./input/file-upload";
import InputInputTypes from "./input/input-types";
import InputWithAdornment from "./input/with-adornment";
import InputWithButton from "./input/with-button";
import InputWithIcon from "./input/with-icon";
import InputWithLabel from "./input/with-label";
import InputGroupDefault from "./input-group/default";
import InputGroupTextarea from "./input-group/textarea";
import InputGroupValidation from "./input-group/validation";
import InputGroupWithButton from "./input-group/with-button";
import InputGroupWithKbd from "./input-group/with-kbd";
import InputGroupWithText from "./input-group/with-text";
import InventoryBarDefault from "./inventory-bar/default";
import IphoneDefault from "./iphone/default";
import KanbanDefault from "./kanban/default";
import KbdDefault from "./kbd/default";
import KbdSizes from "./kbd/sizes";
import KineticTextDefault from "./kinetic-text/default";
import LabelDefault from "./label/default";
import LabelDisabled from "./label/disabled";
import LabelErrorState from "./label/error-state";
import LabelFormLayout from "./label/form-layout";
import LabelRequired from "./label/required";
import LabelWithCheckbox from "./label/with-checkbox";
import LabelWithIcon from "./label/with-icon";
import LyricsDefault from "./lyrics/default";
import MarketingLayoutDefault from "./marketing-layout/default";
import MetricStatDefault from "./metric-stat/default";
import MetricStatCustomValue from "./metric-stat/custom-value";
import MetricStatDeltaDirections from "./metric-stat/delta-directions";
import MetricStatGridLayout from "./metric-stat/grid-layout";
import MetricStatLoading from "./metric-stat/loading";
import MetricStatNoDelta from "./metric-stat/no-delta";
import MetricStatWithIcon from "./metric-stat/with-icon";
import MoneyInputDefault from "./money-input/default";
import MoneyInputCurrencies from "./money-input/currencies";
import MoneyInputSizes from "./money-input/sizes";
import MoneyInputStates from "./money-input/states";
import MorphBarDefault from "./morph-bar/default";
import MorphDockDefault from "./morph-dock/default";
import MorphDockAppBar from "./morph-dock/app-bar";
import MorphDockAppBarPanels from "./morph-dock/app-bar-panels";
import MorphDockBreadcrumb from "./morph-dock/breadcrumb";
import MorphDockCommand from "./morph-dock/command";
import MorphDockDialer from "./morph-dock/dialer";
import MorphDockDraggable from "./morph-dock/draggable";
import MorphDockExpand from "./morph-dock/expand";
import MorphDockGhost from "./morph-dock/ghost";
import MorphDockHelp from "./morph-dock/help";
import MorphDockLauncher from "./morph-dock/launcher";
import MorphDockNotifications from "./morph-dock/notifications";
import MorphDockOrientations from "./morph-dock/orientations";
import MorphDockOrigins from "./morph-dock/origins";
import MorphDockResizable from "./morph-dock/resizable";
import MorphDockSaveStatus from "./morph-dock/save-status";
import MorphDockSeparators from "./morph-dock/separators";
import MorphDockSplitToolbar from "./morph-dock/split-toolbar";
import MorphDockTones from "./morph-dock/tones";
import MorphDockToolsPrimary from "./morph-dock/tools-primary";
import MorphMenubarDefault from "./morph-menubar/default";
import MorphRailDefault from "./morph-rail/default";
import MorphSidebarDefault from "./morph-sidebar/default";
import MorphSurfaceDefault from "./morph-surface/default";
import MorphTabsDefault from "./morph-tabs/default";
import NativeSelectDefault from "./native-select/default";
import NativeSelectSizes from "./native-select/sizes";
import NavigationMenuDefault from "./navigation-menu/default";
import NavigationMenuSimpleLinks from "./navigation-menu/simple-links";
import NavigationMenuWithDescriptions from "./navigation-menu/with-descriptions";
import NavigationMenuWithIcons from "./navigation-menu/with-icons";
import NowPlayingBarDefault from "./now-playing-bar/default";
import NumberFieldDefault from "./number-field/default";
import NumberFieldSizes from "./number-field/sizes";
import OrderBookDefault from "./order-book/default";
import OrderSummaryDefault from "./order-summary/default";
import PageHeaderDefault from "./page-header/default";
import PageHeaderAlign from "./page-header/align";
import PageHeaderBreadcrumbContext from "./page-header/breadcrumb-context";
import PageHeaderDescriptionOnly from "./page-header/description-only";
import PageHeaderWithActions from "./page-header/with-actions";
import PageHeaderWithBadge from "./page-header/with-badge";
import PillDefault from "./pill/default";
import PillSizes from "./pill/sizes";
import PixelatedCanvasDefault from "./pixelated-canvas/default";
import PlaylistCardDefault from "./playlist-card/default";
import PopoverDefault from "./popover/default";
import PopoverControlled from "./popover/controlled";
import PopoverMenuLike from "./popover/menu-like";
import PopoverPlacement from "./popover/placement";
import PopoverRichContent from "./popover/rich-content";
import PopoverWithForm from "./popover/with-form";
import PriceChangeDefault from "./price-change/default";
import PriceRangeFilterDefault from "./price-range-filter/default";
import ProductCardDefault from "./product-card/default";
import ProgressDefault from "./progress/default";
import ProgressControlled from "./progress/controlled";
import ProgressIndeterminate from "./progress/indeterminate";
import ProgressSizes from "./progress/sizes";
import ProgressTones from "./progress/tones";
import ProgressWithFormat from "./progress/with-format";
import QrCodeDefault from "./qr-code/default";
import QrCodeSizes from "./qr-code/sizes";
import RadioGroupDefault from "./radio-group/default";
import RadioGroupDisabled from "./radio-group/disabled";
import RadioGroupFormValidation from "./radio-group/form-validation";
import RadioGroupHorizontal from "./radio-group/horizontal";
import RadioGroupWithDescription from "./radio-group/with-description";
import RadioGroupWithIcon from "./radio-group/with-icon";
import RatingDefault from "./rating/default";
import RatingCustomColor from "./rating/custom-color";
import RatingCustomIcon from "./rating/custom-icon";
import RatingCustomSize from "./rating/custom-size";
import RatingFractional from "./rating/fractional";
import RatingHalf from "./rating/half";
import RatingReadOnly from "./rating/read-only";
import RatingScoreBadge from "./rating/score-badge";
import RatingWithForm from "./rating/with-form";
import RelativeTimeDefault from "./relative-time/default";
import RelativeTimeSizes from "./relative-time/sizes";
import RelativeTimeWorldClock from "./relative-time/world-clock";
import ResourceListDefault from "./resource-list/default";
import ResourceListEmpty from "./resource-list/empty";
import ResourceListLoading from "./resource-list/loading";
import ResourceListNoMedia from "./resource-list/no-media";
import ResourceListSelectable from "./resource-list/selectable";
import ResourceListWithActions from "./resource-list/with-actions";
import SafariDefault from "./safari/default";
import ScrollAreaDefault from "./scroll-area/default";
import ScrollAreaCardList from "./scroll-area/card-list";
import ScrollAreaCompact from "./scroll-area/compact";
import ScrollAreaProse from "./scroll-area/prose";
import ScrollAreaWithHeader from "./scroll-area/with-header";
import SectionDefault from "./section/default";
import SectionInlineChildren from "./section/inline-children";
import SectionNoHeader from "./section/no-header";
import SectionSettingRowControls from "./section/setting-row-controls";
import SectionStackedSections from "./section/stacked-sections";
import SectionWithAction from "./section/with-action";
import SegmentedControlDefault from "./segmented-control/default";
import SegmentedControlControlledDisplay from "./segmented-control/controlled-display";
import SegmentedControlDisabled from "./segmented-control/disabled";
import SegmentedControlManyOptions from "./segmented-control/many-options";
import SegmentedControlSizes from "./segmented-control/sizes";
import SegmentedControlTwoOptions from "./segmented-control/two-options";
import SelectDefault from "./select/default";
import SelectControlled from "./select/controlled";
import SelectDisabled from "./select/disabled";
import SelectGrouped from "./select/grouped";
import SelectSizes from "./select/sizes";
import SelectWithError from "./select/with-error";
import SelectWithIcon from "./select/with-icon";
import SeparatorDefault from "./separator/default";
import SeparatorCustomStyling from "./separator/custom-styling";
import SeparatorInCard from "./separator/in-card";
import SeparatorInNav from "./separator/in-nav";
import SeparatorVertical from "./separator/vertical";
import SeparatorWithLabel from "./separator/with-label";
import SheetDefault from "./sheet/default";
import SheetInsetNested from "./sheet/inset-nested";
import SheetNestedSteps from "./sheet/nested-steps";
import SheetNoCloseButton from "./sheet/no-close-button";
import SheetScrollable from "./sheet/scrollable";
import SheetSides from "./sheet/sides";
import SheetWithForm from "./sheet/with-form";
import SkeletonDefault from "./skeleton/default";
import SkeletonCard from "./skeleton/card";
import SkeletonList from "./skeleton/list";
import SkeletonMediaGrid from "./skeleton/media-grid";
import SkeletonProfile from "./skeleton/profile";
import SkeletonTable from "./skeleton/table";
import SkeletonWithLoadedState from "./skeleton/with-loaded-state";
import SliderDefault from "./slider/default";
import SliderSizes from "./slider/sizes";
import SonnerDefault from "./sonner/default";
import SonnerCustom from "./sonner/custom";
import SonnerDismissible from "./sonner/dismissible";
import SonnerPositions from "./sonner/positions";
import SonnerPromise from "./sonner/promise";
import SonnerRichColors from "./sonner/rich-colors";
import SonnerVariants from "./sonner/variants";
import SonnerWithAction from "./sonner/with-action";
import SonnerWithDescription from "./sonner/with-description";
import SparklineDefault from "./sparkline/default";
import SpinnerDefault from "./spinner/default";
import SpinnerSizes from "./spinner/sizes";
import SplitWithRailDefault from "./split-with-rail/default";
import SplitWithRailCustomLayout from "./split-with-rail/custom-layout";
import SplitWithRailMetricsSummary from "./split-with-rail/metrics-summary";
import SplitWithRailWithEventTimeline from "./split-with-rail/with-event-timeline";
import SplitWithRailWithTimelineRail from "./split-with-rail/with-timeline-rail";
import StatCardDefault from "./stat-card/default";
import StatCardDeltaDirections from "./stat-card/delta-directions";
import StatCardGridDashboard from "./stat-card/grid-dashboard";
import StatCardNoDelta from "./stat-card/no-delta";
import StatCardRichValue from "./stat-card/rich-value";
import StatCardWithIcons from "./stat-card/with-icons";
import StatusDotDefault from "./status-dot/default";
import StatusDotInlineText from "./status-dot/inline-text";
import StatusDotPulse from "./status-dot/pulse";
import StatusDotSizes from "./status-dot/sizes";
import StatusDotTableRows from "./status-dot/table-rows";
import StatusDotTones from "./status-dot/tones";
import StatusPillDefault from "./status-pill/default";
import StatusPillCustomClass from "./status-pill/custom-class";
import StatusPillInlineText from "./status-pill/inline-text";
import StatusPillPulse from "./status-pill/pulse";
import StatusPillTableRows from "./status-pill/table-rows";
import StatusPillTones from "./status-pill/tones";
import SwitchDefault from "./switch/default";
import SwitchControlled from "./switch/controlled";
import SwitchDisabled from "./switch/disabled";
import SwitchInvalid from "./switch/invalid";
import SwitchSizes from "./switch/sizes";
import SwitchWithLabel from "./switch/with-label";
import TableDefault from "./table/default";
import TableEmptyState from "./table/empty-state";
import TableLoadingSkeleton from "./table/loading-skeleton";
import TableSelectableRows from "./table/selectable-rows";
import TableSortableColumns from "./table/sortable-columns";
import TableWithActions from "./table/with-actions";
import TableWithStatusBadges from "./table/with-status-badges";
import TabsDefault from "./tabs/default";
import TabsControlled from "./tabs/controlled";
import TabsDisabled from "./tabs/disabled";
import TabsKeepMounted from "./tabs/keep-mounted";
import TabsVertical from "./tabs/vertical";
import TabsVerticalWithIcons from "./tabs/vertical-with-icons";
import TabsWithIcons from "./tabs/with-icons";
import TagInputDefault from "./tag-input/default";
import TagInputDisabled from "./tag-input/disabled";
import TagInputError from "./tag-input/error";
import TagInputMaxTags from "./tag-input/max-tags";
import TagInputSizes from "./tag-input/sizes";
import TagInputWithSuggestions from "./tag-input/with-suggestions";
import TextareaDefault from "./textarea/default";
import TextareaAutoResize from "./textarea/auto-resize";
import TextareaCharacterCount from "./textarea/character-count";
import TextareaDisabled from "./textarea/disabled";
import TextareaErrorState from "./textarea/error-state";
import TextareaReadonly from "./textarea/readonly";
import TextareaWithLabelAndHint from "./textarea/with-label-and-hint";
import TickerDefault from "./ticker/default";
import TickerSizes from "./ticker/sizes";
import TimelineRailDefault from "./timeline-rail/default";
import TimelineRailCustomTerminal from "./timeline-rail/custom-terminal";
import TimelineRailMixedGlyphs from "./timeline-rail/mixed-glyphs";
import TimelineRailMultiGroup from "./timeline-rail/multi-group";
import TimelineRailWithIcons from "./timeline-rail/with-icons";
import TimelineRailWithTones from "./timeline-rail/with-tones";
import ToggleDefault from "./toggle/default";
import ToggleControlled from "./toggle/controlled";
import ToggleDisabled from "./toggle/disabled";
import ToggleSizes from "./toggle/sizes";
import ToggleVariants from "./toggle/variants";
import ToggleWithText from "./toggle/with-text";
import ToggleGroupDefault from "./toggle-group/default";
import ToggleGroupDisabled from "./toggle-group/disabled";
import ToggleGroupMultiple from "./toggle-group/multiple";
import ToggleGroupSizes from "./toggle-group/sizes";
import ToggleGroupVariants from "./toggle-group/variants";
import ToggleGroupVertical from "./toggle-group/vertical";
import TooltipDefault from "./tooltip/default";
import TooltipAlignment from "./tooltip/alignment";
import TooltipRichContent from "./tooltip/rich-content";
import TooltipSides from "./tooltip/sides";
import TooltipWithDelay from "./tooltip/with-delay";
import TooltipWithIcon from "./tooltip/with-icon";
import TrackListDefault from "./track-list/default";
import VariantPickerDefault from "./variant-picker/default";
import VerificationProgressDefault from "./verification-progress/default";
import VerificationProgressAllTones from "./verification-progress/all-tones";
import VerificationProgressManySteps from "./verification-progress/many-steps";
import VerificationProgressStatuses from "./verification-progress/statuses";
import VerificationProgressTwoSteps from "./verification-progress/two-steps";
import VerificationProgressWithCounts from "./verification-progress/with-counts";
import VideoPlayerDefault from "./video-player/default";
import VideoPlayerComposable from "./video-player/composable";
import VideoPlayerVariants from "./video-player/variants";
import VideoPlayerYoutube from "./video-player/youtube";
import WorldMapDefault from "./world-map/default";

export type Example = { name: string; file: string; Component: ComponentType };

export const examples: Record<string, Example[]> = {
  "accordion": [
    { name: "Default", file: "accordion/default.tsx", Component: AccordionDefault },
    { name: "Controlled", file: "accordion/controlled.tsx", Component: AccordionControlled },
    { name: "Disabled", file: "accordion/disabled.tsx", Component: AccordionDisabled },
    { name: "Keep Mounted", file: "accordion/keep-mounted.tsx", Component: AccordionKeepMounted },
    { name: "Multiple", file: "accordion/multiple.tsx", Component: AccordionMultiple },
    { name: "Nested Content", file: "accordion/nested-content.tsx", Component: AccordionNestedContent },
    { name: "With Icon", file: "accordion/with-icon.tsx", Component: AccordionWithIcon },
  ],
  "activity-grid": [
    { name: "Default", file: "activity-grid/default.tsx", Component: ActivityGridDefault },
    { name: "Columns", file: "activity-grid/columns.tsx", Component: ActivityGridColumns },
    { name: "Empty", file: "activity-grid/empty.tsx", Component: ActivityGridEmpty },
    { name: "In Card", file: "activity-grid/in-card.tsx", Component: ActivityGridInCard },
    { name: "Intensity Levels", file: "activity-grid/intensity-levels.tsx", Component: ActivityGridIntensityLevels },
    { name: "Interactive", file: "activity-grid/interactive.tsx", Component: ActivityGridInteractive },
  ],
  "activity-ring": [
    { name: "Default", file: "activity-ring/default.tsx", Component: ActivityRingDefault },
    { name: "Score", file: "activity-ring/score.tsx", Component: ActivityRingScore },
    { name: "Score Tones", file: "activity-ring/score-tones.tsx", Component: ActivityRingScoreTones },
    { name: "Tones", file: "activity-ring/tones.tsx", Component: ActivityRingTones },
    { name: "With Verdict", file: "activity-ring/with-verdict.tsx", Component: ActivityRingWithVerdict },
  ],
  "ai-artifact": [
    { name: "Default", file: "ai-artifact/default.tsx", Component: AiArtifactDefault },
  ],
  "ai-attachments": [
    { name: "Default", file: "ai-attachments/default.tsx", Component: AiAttachmentsDefault },
    { name: "Variants", file: "ai-attachments/variants.tsx", Component: AiAttachmentsVariants },
  ],
  "ai-canvas": [
    { name: "Default", file: "ai-canvas/default.tsx", Component: AiCanvasDefault },
  ],
  "ai-chain-of-thought": [
    { name: "Default", file: "ai-chain-of-thought/default.tsx", Component: AiChainOfThoughtDefault },
  ],
  "ai-checkpoint": [
    { name: "Default", file: "ai-checkpoint/default.tsx", Component: AiCheckpointDefault },
  ],
  "ai-code-block": [
    { name: "Default", file: "ai-code-block/default.tsx", Component: AiCodeBlockDefault },
  ],
  "ai-confirmation": [
    { name: "Default", file: "ai-confirmation/default.tsx", Component: AiConfirmationDefault },
  ],
  "ai-connection": [
    { name: "Default", file: "ai-connection/default.tsx", Component: AiConnectionDefault },
  ],
  "ai-context": [
    { name: "Default", file: "ai-context/default.tsx", Component: AiContextDefault },
  ],
  "ai-controls": [
    { name: "Default", file: "ai-controls/default.tsx", Component: AiControlsDefault },
  ],
  "ai-conversation": [
    { name: "Default", file: "ai-conversation/default.tsx", Component: AiConversationDefault },
  ],
  "ai-edge": [
    { name: "Default", file: "ai-edge/default.tsx", Component: AiEdgeDefault },
  ],
  "ai-image": [
    { name: "Default", file: "ai-image/default.tsx", Component: AiImageDefault },
  ],
  "ai-inline-citation": [
    { name: "Default", file: "ai-inline-citation/default.tsx", Component: AiInlineCitationDefault },
  ],
  "ai-loader": [
    { name: "Default", file: "ai-loader/default.tsx", Component: AiLoaderDefault },
  ],
  "ai-message": [
    { name: "Default", file: "ai-message/default.tsx", Component: AiMessageDefault },
  ],
  "ai-model-selector": [
    { name: "Default", file: "ai-model-selector/default.tsx", Component: AiModelSelectorDefault },
  ],
  "ai-node": [
    { name: "Default", file: "ai-node/default.tsx", Component: AiNodeDefault },
  ],
  "ai-open-in-chat": [
    { name: "Default", file: "ai-open-in-chat/default.tsx", Component: AiOpenInChatDefault },
  ],
  "ai-panel": [
    { name: "Default", file: "ai-panel/default.tsx", Component: AiPanelDefault },
  ],
  "ai-plan": [
    { name: "Default", file: "ai-plan/default.tsx", Component: AiPlanDefault },
  ],
  "ai-prompt-input": [
    { name: "Default", file: "ai-prompt-input/default.tsx", Component: AiPromptInputDefault },
  ],
  "ai-queue": [
    { name: "Default", file: "ai-queue/default.tsx", Component: AiQueueDefault },
  ],
  "ai-reasoning": [
    { name: "Default", file: "ai-reasoning/default.tsx", Component: AiReasoningDefault },
  ],
  "ai-shimmer": [
    { name: "Default", file: "ai-shimmer/default.tsx", Component: AiShimmerDefault },
    { name: "Tones", file: "ai-shimmer/tones.tsx", Component: AiShimmerTones },
  ],
  "ai-sources": [
    { name: "Default", file: "ai-sources/default.tsx", Component: AiSourcesDefault },
  ],
  "ai-suggestion": [
    { name: "Default", file: "ai-suggestion/default.tsx", Component: AiSuggestionDefault },
  ],
  "ai-task": [
    { name: "Default", file: "ai-task/default.tsx", Component: AiTaskDefault },
  ],
  "ai-tool": [
    { name: "Default", file: "ai-tool/default.tsx", Component: AiToolDefault },
  ],
  "ai-toolbar": [
    { name: "Default", file: "ai-toolbar/default.tsx", Component: AiToolbarDefault },
  ],
  "ai-web-preview": [
    { name: "Default", file: "ai-web-preview/default.tsx", Component: AiWebPreviewDefault },
  ],
  "album-cover": [
    { name: "Default", file: "album-cover/default.tsx", Component: AlbumCoverDefault },
    { name: "Playing", file: "album-cover/playing.tsx", Component: AlbumCoverPlaying },
    { name: "Shapes", file: "album-cover/shapes.tsx", Component: AlbumCoverShapes },
    { name: "Sizes", file: "album-cover/sizes.tsx", Component: AlbumCoverSizes },
  ],
  "alert": [
    { name: "Default", file: "alert/default.tsx", Component: AlertDefault },
    { name: "No Icon", file: "alert/no-icon.tsx", Component: AlertNoIcon },
    { name: "Variants", file: "alert/variants.tsx", Component: AlertVariants },
    { name: "With Action", file: "alert/with-action.tsx", Component: AlertWithAction },
    { name: "With Icon", file: "alert/with-icon.tsx", Component: AlertWithIcon },
    { name: "With Link", file: "alert/with-link.tsx", Component: AlertWithLink },
  ],
  "android": [
    { name: "Default", file: "android/default.tsx", Component: AndroidDefault },
  ],
  "app-shell": [
    { name: "Default", file: "app-shell/default.tsx", Component: AppShellDefault },
  ],
  "apple-cards-carousel": [
    { name: "Default", file: "apple-cards-carousel/default.tsx", Component: AppleCardsCarouselDefault },
  ],
  "artist-header": [
    { name: "Default", file: "artist-header/default.tsx", Component: ArtistHeaderDefault },
  ],
  "aspect-ratio": [
    { name: "Default", file: "aspect-ratio/default.tsx", Component: AspectRatioDefault },
    { name: "Cinematic", file: "aspect-ratio/cinematic.tsx", Component: AspectRatioCinematic },
    { name: "Portrait", file: "aspect-ratio/portrait.tsx", Component: AspectRatioPortrait },
    { name: "Square", file: "aspect-ratio/square.tsx", Component: AspectRatioSquare },
    { name: "Thumbnail", file: "aspect-ratio/thumbnail.tsx", Component: AspectRatioThumbnail },
  ],
  "audio-player": [
    { name: "Default", file: "audio-player/default.tsx", Component: AudioPlayerDefault },
  ],
  "audio-waveform": [
    { name: "Default", file: "audio-waveform/default.tsx", Component: AudioWaveformDefault },
  ],
  "avatar": [
    { name: "Default", file: "avatar/default.tsx", Component: AvatarDefault },
    { name: "Fallback", file: "avatar/fallback.tsx", Component: AvatarFallback },
    { name: "Group", file: "avatar/group.tsx", Component: AvatarGroup },
    { name: "Sizes", file: "avatar/sizes.tsx", Component: AvatarSizes },
    { name: "User List", file: "avatar/user-list.tsx", Component: AvatarUserList },
    { name: "With Badge", file: "avatar/with-badge.tsx", Component: AvatarWithBadge },
  ],
  "backlight": [
    { name: "Default", file: "backlight/default.tsx", Component: BacklightDefault },
    { name: "With Video", file: "backlight/with-video.tsx", Component: BacklightWithVideo },
  ],
  "badge": [
    { name: "Default", file: "badge/default.tsx", Component: BadgeDefault },
    { name: "As Link", file: "badge/as-link.tsx", Component: BadgeAsLink },
    { name: "Inline Content", file: "badge/inline-content.tsx", Component: BadgeInlineContent },
    { name: "Invalid", file: "badge/invalid.tsx", Component: BadgeInvalid },
    { name: "Status", file: "badge/status.tsx", Component: BadgeStatus },
    { name: "With Icon", file: "badge/with-icon.tsx", Component: BadgeWithIcon },
  ],
  "banner": [
    { name: "Default", file: "banner/default.tsx", Component: BannerDefault },
    { name: "Dismissible", file: "banner/dismissible.tsx", Component: BannerDismissible },
    { name: "Inline", file: "banner/inline.tsx", Component: BannerInline },
    { name: "Tones", file: "banner/tones.tsx", Component: BannerTones },
    { name: "With Actions", file: "banner/with-actions.tsx", Component: BannerWithActions },
  ],
  "breadcrumb": [
    { name: "Default", file: "breadcrumb/default.tsx", Component: BreadcrumbDefault },
    { name: "Custom Separator", file: "breadcrumb/custom-separator.tsx", Component: BreadcrumbCustomSeparator },
    { name: "Long Path", file: "breadcrumb/long-path.tsx", Component: BreadcrumbLongPath },
    { name: "Responsive", file: "breadcrumb/responsive.tsx", Component: BreadcrumbResponsive },
    { name: "With Ellipsis", file: "breadcrumb/with-ellipsis.tsx", Component: BreadcrumbWithEllipsis },
    { name: "With Icons", file: "breadcrumb/with-icons.tsx", Component: BreadcrumbWithIcons },
    { name: "With Render Prop", file: "breadcrumb/with-render-prop.tsx", Component: BreadcrumbWithRenderProp },
  ],
  "bulk-action-bar": [
    { name: "Default", file: "bulk-action-bar/default.tsx", Component: BulkActionBarDefault },
  ],
  "button": [
    { name: "Default", file: "button/default.tsx", Component: ButtonDefault },
    { name: "Count", file: "button/count.tsx", Component: ButtonCount },
    { name: "Destructive", file: "button/destructive.tsx", Component: ButtonDestructive },
    { name: "Disabled", file: "button/disabled.tsx", Component: ButtonDisabled },
    { name: "Error", file: "button/error.tsx", Component: ButtonError },
    { name: "Ghost", file: "button/ghost.tsx", Component: ButtonGhost },
    { name: "Icon", file: "button/icon.tsx", Component: ButtonIcon },
    { name: "Icon Sm", file: "button/icon-sm.tsx", Component: ButtonIconSm },
    { name: "Leading Icon", file: "button/leading-icon.tsx", Component: ButtonLeadingIcon },
    { name: "Link", file: "button/link.tsx", Component: ButtonLink },
    { name: "Loading", file: "button/loading.tsx", Component: ButtonLoading },
    { name: "Outline", file: "button/outline.tsx", Component: ButtonOutline },
    { name: "Secondary", file: "button/secondary.tsx", Component: ButtonSecondary },
    { name: "Size Lg", file: "button/size-lg.tsx", Component: ButtonSizeLg },
    { name: "Size Sm", file: "button/size-sm.tsx", Component: ButtonSizeSm },
    { name: "Size Xs", file: "button/size-xs.tsx", Component: ButtonSizeXs },
    { name: "Sizes", file: "button/sizes.tsx", Component: ButtonSizes },
    { name: "Solid", file: "button/solid.tsx", Component: ButtonSolid },
    { name: "Stateful", file: "button/stateful.tsx", Component: ButtonStateful },
    { name: "Trailing Icon", file: "button/trailing-icon.tsx", Component: ButtonTrailingIcon },
    { name: "Variants", file: "button/variants.tsx", Component: ButtonVariants },
    { name: "With Icon", file: "button/with-icon.tsx", Component: ButtonWithIcon },
  ],
  "button-group": [
    { name: "Default", file: "button-group/default.tsx", Component: ButtonGroupDefault },
    { name: "Vertical", file: "button-group/vertical.tsx", Component: ButtonGroupVertical },
  ],
  "calendar": [
    { name: "Default", file: "calendar/default.tsx", Component: CalendarDefault },
    { name: "Appointment", file: "calendar/appointment.tsx", Component: CalendarAppointment },
    { name: "Pricing", file: "calendar/pricing.tsx", Component: CalendarPricing },
    { name: "Range Presets", file: "calendar/range-presets.tsx", Component: CalendarRangePresets },
  ],
  "candlestick-chart": [
    { name: "Default", file: "candlestick-chart/default.tsx", Component: CandlestickChartDefault },
  ],
  "card": [
    { name: "Default", file: "card/default.tsx", Component: CardDefault },
    { name: "Content Only", file: "card/content-only.tsx", Component: CardContentOnly },
    { name: "Frame Empty", file: "card/frame-empty.tsx", Component: CardFrameEmpty },
    { name: "Frame Footer", file: "card/frame-footer.tsx", Component: CardFrameFooter },
    { name: "Frame Header", file: "card/frame-header.tsx", Component: CardFrameHeader },
    { name: "Frame Header Footer", file: "card/frame-header-footer.tsx", Component: CardFrameHeaderFooter },
    { name: "Grid Layout", file: "card/grid-layout.tsx", Component: CardGridLayout },
    { name: "Login Form", file: "card/login-form.tsx", Component: CardLoginForm },
    { name: "Sizes", file: "card/sizes.tsx", Component: CardSizes },
    { name: "With Action", file: "card/with-action.tsx", Component: CardWithAction },
    { name: "With Image", file: "card/with-image.tsx", Component: CardWithImage },
  ],
  "centered-focal": [
    { name: "Default", file: "centered-focal/default.tsx", Component: CenteredFocalDefault },
    { name: "Custom Classname", file: "centered-focal/custom-classname.tsx", Component: CenteredFocalCustomClassname },
    { name: "Loading State", file: "centered-focal/loading-state.tsx", Component: CenteredFocalLoadingState },
    { name: "No Backdrop", file: "centered-focal/no-backdrop.tsx", Component: CenteredFocalNoBackdrop },
    { name: "With Form", file: "centered-focal/with-form.tsx", Component: CenteredFocalWithForm },
    { name: "With Illustration Backdrop", file: "centered-focal/with-illustration-backdrop.tsx", Component: CenteredFocalWithIllustrationBackdrop },
  ],
  "chart": [
    { name: "Default", file: "chart/default.tsx", Component: ChartDefault },
    { name: "Bar Chart", file: "chart/bar-chart.tsx", Component: ChartBarChart },
    { name: "Custom Tooltip", file: "chart/custom-tooltip.tsx", Component: ChartCustomTooltip },
    { name: "Donut Chart", file: "chart/donut-chart.tsx", Component: ChartDonutChart },
    { name: "Legend Variants", file: "chart/legend-variants.tsx", Component: ChartLegendVariants },
    { name: "Line Chart", file: "chart/line-chart.tsx", Component: ChartLineChart },
    { name: "Pie Chart", file: "chart/pie-chart.tsx", Component: ChartPieChart },
    { name: "Radial Bar", file: "chart/radial-bar.tsx", Component: ChartRadialBar },
    { name: "Stacked Bar", file: "chart/stacked-bar.tsx", Component: ChartStackedBar },
    { name: "Theme Colors", file: "chart/theme-colors.tsx", Component: ChartThemeColors },
    { name: "Tooltip Variants", file: "chart/tooltip-variants.tsx", Component: ChartTooltipVariants },
  ],
  "checkbox": [
    { name: "Default", file: "checkbox/default.tsx", Component: CheckboxDefault },
    { name: "Checkbox Group", file: "checkbox/checkbox-group.tsx", Component: CheckboxCheckboxGroup },
    { name: "Disabled", file: "checkbox/disabled.tsx", Component: CheckboxDisabled },
    { name: "Indeterminate", file: "checkbox/indeterminate.tsx", Component: CheckboxIndeterminate },
    { name: "Readonly", file: "checkbox/readonly.tsx", Component: CheckboxReadonly },
    { name: "With Label", file: "checkbox/with-label.tsx", Component: CheckboxWithLabel },
  ],
  "collapsible": [
    { name: "Default", file: "collapsible/default.tsx", Component: CollapsibleDefault },
    { name: "Disabled", file: "collapsible/disabled.tsx", Component: CollapsibleDisabled },
    { name: "Faq", file: "collapsible/faq.tsx", Component: CollapsibleFaq },
    { name: "Uncontrolled", file: "collapsible/uncontrolled.tsx", Component: CollapsibleUncontrolled },
    { name: "With Rich Content", file: "collapsible/with-rich-content.tsx", Component: CollapsibleWithRichContent },
  ],
  "color-picker": [
    { name: "Default", file: "color-picker/default.tsx", Component: ColorPickerDefault },
    { name: "Inline", file: "color-picker/inline.tsx", Component: ColorPickerInline },
    { name: "Sizes", file: "color-picker/sizes.tsx", Component: ColorPickerSizes },
  ],
  "command": [
    { name: "Default", file: "command/default.tsx", Component: CommandDefault },
    { name: "Actions", file: "command/actions.tsx", Component: CommandActions },
    { name: "Cards", file: "command/cards.tsx", Component: CommandCards },
    { name: "Empty State", file: "command/empty-state.tsx", Component: CommandEmptyState },
    { name: "Files", file: "command/files.tsx", Component: CommandFiles },
    { name: "Grouped", file: "command/grouped.tsx", Component: CommandGrouped },
    { name: "Inline", file: "command/inline.tsx", Component: CommandInline },
    { name: "People", file: "command/people.tsx", Component: CommandPeople },
    { name: "With Icons", file: "command/with-icons.tsx", Component: CommandWithIcons },
  ],
  "command-result": [
    { name: "Default", file: "command-result/default.tsx", Component: CommandResultDefault },
  ],
  "conversation-list": [
    { name: "Default", file: "conversation-list/default.tsx", Component: ConversationListDefault },
  ],
  "credit-card": [
    { name: "Default", file: "credit-card/default.tsx", Component: CreditCardDefault },
    { name: "Tones", file: "credit-card/tones.tsx", Component: CreditCardTones },
  ],
  "cursor": [
    { name: "Default", file: "cursor/default.tsx", Component: CursorDefault },
    { name: "Tones", file: "cursor/tones.tsx", Component: CursorTones },
  ],
  "customer-card": [
    { name: "Default", file: "customer-card/default.tsx", Component: CustomerCardDefault },
  ],
  "depth-chart": [
    { name: "Default", file: "depth-chart/default.tsx", Component: DepthChartDefault },
  ],
  "detail-header": [
    { name: "Default", file: "detail-header/default.tsx", Component: DetailHeaderDefault },
    { name: "Custom Title Node", file: "detail-header/custom-title-node.tsx", Component: DetailHeaderCustomTitleNode },
    { name: "Many Actions", file: "detail-header/many-actions.tsx", Component: DetailHeaderManyActions },
    { name: "Meta Grid Standalone", file: "detail-header/meta-grid-standalone.tsx", Component: DetailHeaderMetaGridStandalone },
    { name: "No Meta", file: "detail-header/no-meta.tsx", Component: DetailHeaderNoMeta },
    { name: "Rich Meta Values", file: "detail-header/rich-meta-values.tsx", Component: DetailHeaderRichMetaValues },
    { name: "With Status Badges", file: "detail-header/with-status-badges.tsx", Component: DetailHeaderWithStatusBadges },
  ],
  "dialog": [
    { name: "Default", file: "dialog/default.tsx", Component: DialogDefault },
    { name: "Destructive", file: "dialog/destructive.tsx", Component: DialogDestructive },
    { name: "Loading", file: "dialog/loading.tsx", Component: DialogLoading },
    { name: "No Close Button", file: "dialog/no-close-button.tsx", Component: DialogNoCloseButton },
    { name: "Scrollable", file: "dialog/scrollable.tsx", Component: DialogScrollable },
    { name: "With Form", file: "dialog/with-form.tsx", Component: DialogWithForm },
    { name: "With Icon", file: "dialog/with-icon.tsx", Component: DialogWithIcon },
  ],
  "drop-zone": [
    { name: "Default", file: "drop-zone/default.tsx", Component: DropZoneDefault },
    { name: "Disabled", file: "drop-zone/disabled.tsx", Component: DropZoneDisabled },
    { name: "Error", file: "drop-zone/error.tsx", Component: DropZoneError },
    { name: "File List", file: "drop-zone/file-list.tsx", Component: DropZoneFileList },
    { name: "Single", file: "drop-zone/single.tsx", Component: DropZoneSingle },
    { name: "Sizes", file: "drop-zone/sizes.tsx", Component: DropZoneSizes },
  ],
  "dropdown-menu": [
    { name: "Default", file: "dropdown-menu/default.tsx", Component: DropdownMenuDefault },
    { name: "Disabled", file: "dropdown-menu/disabled.tsx", Component: DropdownMenuDisabled },
    { name: "With Checkboxes", file: "dropdown-menu/with-checkboxes.tsx", Component: DropdownMenuWithCheckboxes },
    { name: "With Icons", file: "dropdown-menu/with-icons.tsx", Component: DropdownMenuWithIcons },
    { name: "With Radio", file: "dropdown-menu/with-radio.tsx", Component: DropdownMenuWithRadio },
    { name: "With Shortcuts", file: "dropdown-menu/with-shortcuts.tsx", Component: DropdownMenuWithShortcuts },
    { name: "With Submenu", file: "dropdown-menu/with-submenu.tsx", Component: DropdownMenuWithSubmenu },
  ],
  "editor": [
    { name: "Default", file: "editor/default.tsx", Component: EditorDefault },
  ],
  "empty-state": [
    { name: "Default", file: "empty-state/default.tsx", Component: EmptyStateDefault },
    { name: "Compact", file: "empty-state/compact.tsx", Component: EmptyStateCompact },
    { name: "Error State", file: "empty-state/error-state.tsx", Component: EmptyStateErrorState },
    { name: "Minimal", file: "empty-state/minimal.tsx", Component: EmptyStateMinimal },
    { name: "No Icon", file: "empty-state/no-icon.tsx", Component: EmptyStateNoIcon },
    { name: "Search No Results", file: "empty-state/search-no-results.tsx", Component: EmptyStateSearchNoResults },
    { name: "With Multiple Actions", file: "empty-state/with-multiple-actions.tsx", Component: EmptyStateWithMultipleActions },
  ],
  "equalizer-bars": [
    { name: "Default", file: "equalizer-bars/default.tsx", Component: EqualizerBarsDefault },
  ],
  "event-timeline": [
    { name: "Default", file: "event-timeline/default.tsx", Component: EventTimelineDefault },
    { name: "Live Feed", file: "event-timeline/live-feed.tsx", Component: EventTimelineLiveFeed },
    { name: "Rich Content", file: "event-timeline/rich-content.tsx", Component: EventTimelineRichContent },
    { name: "Single Event", file: "event-timeline/single-event.tsx", Component: EventTimelineSingleEvent },
    { name: "Timestamps", file: "event-timeline/timestamps.tsx", Component: EventTimelineTimestamps },
    { name: "Title Only", file: "event-timeline/title-only.tsx", Component: EventTimelineTitleOnly },
    { name: "Tones", file: "event-timeline/tones.tsx", Component: EventTimelineTones },
  ],
  "file-tree": [
    { name: "Default", file: "file-tree/default.tsx", Component: FileTreeDefault },
    { name: "Multi Select", file: "file-tree/multi-select.tsx", Component: FileTreeMultiSelect },
    { name: "Panel", file: "file-tree/panel.tsx", Component: FileTreePanel },
  ],
  "filter-pill": [
    { name: "Default", file: "filter-pill/default.tsx", Component: FilterPillDefault },
    { name: "Active State", file: "filter-pill/active-state.tsx", Component: FilterPillActiveState },
    { name: "As Select Trigger", file: "filter-pill/as-select-trigger.tsx", Component: FilterPillAsSelectTrigger },
    { name: "Disabled", file: "filter-pill/disabled.tsx", Component: FilterPillDisabled },
    { name: "Filter Bar", file: "filter-pill/filter-bar.tsx", Component: FilterPillFilterBar },
    { name: "With Icon", file: "filter-pill/with-icon.tsx", Component: FilterPillWithIcon },
  ],
  "floating-dock": [
    { name: "Default", file: "floating-dock/default.tsx", Component: FloatingDockDefault },
  ],
  "foundation": [
    { name: "Tokens", file: "foundation/tokens.tsx", Component: FoundationTokens },
  ],
  "fulfillment-tracker": [
    { name: "Default", file: "fulfillment-tracker/default.tsx", Component: FulfillmentTrackerDefault },
  ],
  "gantt": [
    { name: "Default", file: "gantt/default.tsx", Component: GanttDefault },
    { name: "Compact", file: "gantt/compact.tsx", Component: GanttCompact },
    { name: "Controls", file: "gantt/controls.tsx", Component: GanttControls },
    { name: "Read Only", file: "gantt/read-only.tsx", Component: GanttReadOnly },
  ],
  "glimpse": [
    { name: "Default", file: "glimpse/default.tsx", Component: GlimpseDefault },
  ],
  "gradient-avatar": [
    { name: "Default", file: "gradient-avatar/default.tsx", Component: GradientAvatarDefault },
    { name: "Grouped Stack", file: "gradient-avatar/grouped-stack.tsx", Component: GradientAvatarGroupedStack },
    { name: "List Rows", file: "gradient-avatar/list-rows.tsx", Component: GradientAvatarListRows },
    { name: "Seeds", file: "gradient-avatar/seeds.tsx", Component: GradientAvatarSeeds },
    { name: "Sizes", file: "gradient-avatar/sizes.tsx", Component: GradientAvatarSizes },
    { name: "With Name Badge", file: "gradient-avatar/with-name-badge.tsx", Component: GradientAvatarWithNameBadge },
  ],
  "heatmap-grid": [
    { name: "Default", file: "heatmap-grid/default.tsx", Component: HeatmapGridDefault },
  ],
  "hero-section": [
    { name: "Default", file: "hero-section/default.tsx", Component: HeroSectionDefault },
    { name: "No Header", file: "hero-section/no-header.tsx", Component: HeroSectionNoHeader },
    { name: "With Action Header", file: "hero-section/with-action-header.tsx", Component: HeroSectionWithActionHeader },
    { name: "With Chart", file: "hero-section/with-chart.tsx", Component: HeroSectionWithChart },
    { name: "With Custom Classname", file: "hero-section/with-custom-classname.tsx", Component: HeroSectionWithCustomClassname },
    { name: "With Metrics Header", file: "hero-section/with-metrics-header.tsx", Component: HeroSectionWithMetricsHeader },
  ],
  "hover-card": [
    { name: "Default", file: "hover-card/default.tsx", Component: HoverCardDefault },
    { name: "Alignment", file: "hover-card/alignment.tsx", Component: HoverCardAlignment },
    { name: "Controlled", file: "hover-card/controlled.tsx", Component: HoverCardControlled },
    { name: "Placement", file: "hover-card/placement.tsx", Component: HoverCardPlacement },
    { name: "Rich Content", file: "hover-card/rich-content.tsx", Component: HoverCardRichContent },
    { name: "With Delay", file: "hover-card/with-delay.tsx", Component: HoverCardWithDelay },
  ],
  "identity": [
    { name: "Names", file: "identity/names.tsx", Component: IdentityNames },
  ],
  "image-crop": [
    { name: "Default", file: "image-crop/default.tsx", Component: ImageCropDefault },
  ],
  "index-filters": [
    { name: "Default", file: "index-filters/default.tsx", Component: IndexFiltersDefault },
    { name: "No Tabs", file: "index-filters/no-tabs.tsx", Component: IndexFiltersNoTabs },
    { name: "Search Only", file: "index-filters/search-only.tsx", Component: IndexFiltersSearchOnly },
    { name: "With Applied Filters", file: "index-filters/with-applied-filters.tsx", Component: IndexFiltersWithAppliedFilters },
  ],
  "index-table": [
    { name: "Default", file: "index-table/default.tsx", Component: IndexTableDefault },
    { name: "Condensed", file: "index-table/condensed.tsx", Component: IndexTableCondensed },
    { name: "Empty", file: "index-table/empty.tsx", Component: IndexTableEmpty },
    { name: "Loading", file: "index-table/loading.tsx", Component: IndexTableLoading },
    { name: "Selection", file: "index-table/selection.tsx", Component: IndexTableSelection },
    { name: "With Pagination", file: "index-table/with-pagination.tsx", Component: IndexTableWithPagination },
  ],
  "input": [
    { name: "Default", file: "input/default.tsx", Component: InputDefault },
    { name: "Disabled", file: "input/disabled.tsx", Component: InputDisabled },
    { name: "Error", file: "input/error.tsx", Component: InputError },
    { name: "File Upload", file: "input/file-upload.tsx", Component: InputFileUpload },
    { name: "Input Types", file: "input/input-types.tsx", Component: InputInputTypes },
    { name: "With Adornment", file: "input/with-adornment.tsx", Component: InputWithAdornment },
    { name: "With Button", file: "input/with-button.tsx", Component: InputWithButton },
    { name: "With Icon", file: "input/with-icon.tsx", Component: InputWithIcon },
    { name: "With Label", file: "input/with-label.tsx", Component: InputWithLabel },
  ],
  "input-group": [
    { name: "Default", file: "input-group/default.tsx", Component: InputGroupDefault },
    { name: "Textarea", file: "input-group/textarea.tsx", Component: InputGroupTextarea },
    { name: "Validation", file: "input-group/validation.tsx", Component: InputGroupValidation },
    { name: "With Button", file: "input-group/with-button.tsx", Component: InputGroupWithButton },
    { name: "With Kbd", file: "input-group/with-kbd.tsx", Component: InputGroupWithKbd },
    { name: "With Text", file: "input-group/with-text.tsx", Component: InputGroupWithText },
  ],
  "inventory-bar": [
    { name: "Default", file: "inventory-bar/default.tsx", Component: InventoryBarDefault },
  ],
  "iphone": [
    { name: "Default", file: "iphone/default.tsx", Component: IphoneDefault },
  ],
  "kanban": [
    { name: "Default", file: "kanban/default.tsx", Component: KanbanDefault },
  ],
  "kbd": [
    { name: "Default", file: "kbd/default.tsx", Component: KbdDefault },
    { name: "Sizes", file: "kbd/sizes.tsx", Component: KbdSizes },
  ],
  "kinetic-text": [
    { name: "Default", file: "kinetic-text/default.tsx", Component: KineticTextDefault },
  ],
  "label": [
    { name: "Default", file: "label/default.tsx", Component: LabelDefault },
    { name: "Disabled", file: "label/disabled.tsx", Component: LabelDisabled },
    { name: "Error State", file: "label/error-state.tsx", Component: LabelErrorState },
    { name: "Form Layout", file: "label/form-layout.tsx", Component: LabelFormLayout },
    { name: "Required", file: "label/required.tsx", Component: LabelRequired },
    { name: "With Checkbox", file: "label/with-checkbox.tsx", Component: LabelWithCheckbox },
    { name: "With Icon", file: "label/with-icon.tsx", Component: LabelWithIcon },
  ],
  "lyrics": [
    { name: "Default", file: "lyrics/default.tsx", Component: LyricsDefault },
  ],
  "marketing-layout": [
    { name: "Default", file: "marketing-layout/default.tsx", Component: MarketingLayoutDefault },
  ],
  "metric-stat": [
    { name: "Default", file: "metric-stat/default.tsx", Component: MetricStatDefault },
    { name: "Custom Value", file: "metric-stat/custom-value.tsx", Component: MetricStatCustomValue },
    { name: "Delta Directions", file: "metric-stat/delta-directions.tsx", Component: MetricStatDeltaDirections },
    { name: "Grid Layout", file: "metric-stat/grid-layout.tsx", Component: MetricStatGridLayout },
    { name: "Loading", file: "metric-stat/loading.tsx", Component: MetricStatLoading },
    { name: "No Delta", file: "metric-stat/no-delta.tsx", Component: MetricStatNoDelta },
    { name: "With Icon", file: "metric-stat/with-icon.tsx", Component: MetricStatWithIcon },
  ],
  "money-input": [
    { name: "Default", file: "money-input/default.tsx", Component: MoneyInputDefault },
    { name: "Currencies", file: "money-input/currencies.tsx", Component: MoneyInputCurrencies },
    { name: "Sizes", file: "money-input/sizes.tsx", Component: MoneyInputSizes },
    { name: "States", file: "money-input/states.tsx", Component: MoneyInputStates },
  ],
  "morph-bar": [
    { name: "Default", file: "morph-bar/default.tsx", Component: MorphBarDefault },
  ],
  "morph-dock": [
    { name: "Default", file: "morph-dock/default.tsx", Component: MorphDockDefault },
    { name: "App Bar", file: "morph-dock/app-bar.tsx", Component: MorphDockAppBar },
    { name: "App Bar Panels", file: "morph-dock/app-bar-panels.tsx", Component: MorphDockAppBarPanels },
    { name: "Breadcrumb", file: "morph-dock/breadcrumb.tsx", Component: MorphDockBreadcrumb },
    { name: "Command", file: "morph-dock/command.tsx", Component: MorphDockCommand },
    { name: "Dialer", file: "morph-dock/dialer.tsx", Component: MorphDockDialer },
    { name: "Draggable", file: "morph-dock/draggable.tsx", Component: MorphDockDraggable },
    { name: "Expand", file: "morph-dock/expand.tsx", Component: MorphDockExpand },
    { name: "Ghost", file: "morph-dock/ghost.tsx", Component: MorphDockGhost },
    { name: "Help", file: "morph-dock/help.tsx", Component: MorphDockHelp },
    { name: "Launcher", file: "morph-dock/launcher.tsx", Component: MorphDockLauncher },
    { name: "Notifications", file: "morph-dock/notifications.tsx", Component: MorphDockNotifications },
    { name: "Orientations", file: "morph-dock/orientations.tsx", Component: MorphDockOrientations },
    { name: "Origins", file: "morph-dock/origins.tsx", Component: MorphDockOrigins },
    { name: "Resizable", file: "morph-dock/resizable.tsx", Component: MorphDockResizable },
    { name: "Save Status", file: "morph-dock/save-status.tsx", Component: MorphDockSaveStatus },
    { name: "Separators", file: "morph-dock/separators.tsx", Component: MorphDockSeparators },
    { name: "Split Toolbar", file: "morph-dock/split-toolbar.tsx", Component: MorphDockSplitToolbar },
    { name: "Tones", file: "morph-dock/tones.tsx", Component: MorphDockTones },
    { name: "Tools Primary", file: "morph-dock/tools-primary.tsx", Component: MorphDockToolsPrimary },
  ],
  "morph-menubar": [
    { name: "Default", file: "morph-menubar/default.tsx", Component: MorphMenubarDefault },
  ],
  "morph-rail": [
    { name: "Default", file: "morph-rail/default.tsx", Component: MorphRailDefault },
  ],
  "morph-sidebar": [
    { name: "Default", file: "morph-sidebar/default.tsx", Component: MorphSidebarDefault },
  ],
  "morph-surface": [
    { name: "Default", file: "morph-surface/default.tsx", Component: MorphSurfaceDefault },
  ],
  "morph-tabs": [
    { name: "Default", file: "morph-tabs/default.tsx", Component: MorphTabsDefault },
  ],
  "native-select": [
    { name: "Default", file: "native-select/default.tsx", Component: NativeSelectDefault },
    { name: "Sizes", file: "native-select/sizes.tsx", Component: NativeSelectSizes },
  ],
  "navigation-menu": [
    { name: "Default", file: "navigation-menu/default.tsx", Component: NavigationMenuDefault },
    { name: "Simple Links", file: "navigation-menu/simple-links.tsx", Component: NavigationMenuSimpleLinks },
    { name: "With Descriptions", file: "navigation-menu/with-descriptions.tsx", Component: NavigationMenuWithDescriptions },
    { name: "With Icons", file: "navigation-menu/with-icons.tsx", Component: NavigationMenuWithIcons },
  ],
  "now-playing-bar": [
    { name: "Default", file: "now-playing-bar/default.tsx", Component: NowPlayingBarDefault },
  ],
  "number-field": [
    { name: "Default", file: "number-field/default.tsx", Component: NumberFieldDefault },
    { name: "Sizes", file: "number-field/sizes.tsx", Component: NumberFieldSizes },
  ],
  "order-book": [
    { name: "Default", file: "order-book/default.tsx", Component: OrderBookDefault },
  ],
  "order-summary": [
    { name: "Default", file: "order-summary/default.tsx", Component: OrderSummaryDefault },
  ],
  "page-header": [
    { name: "Default", file: "page-header/default.tsx", Component: PageHeaderDefault },
    { name: "Align", file: "page-header/align.tsx", Component: PageHeaderAlign },
    { name: "Breadcrumb Context", file: "page-header/breadcrumb-context.tsx", Component: PageHeaderBreadcrumbContext },
    { name: "Description Only", file: "page-header/description-only.tsx", Component: PageHeaderDescriptionOnly },
    { name: "With Actions", file: "page-header/with-actions.tsx", Component: PageHeaderWithActions },
    { name: "With Badge", file: "page-header/with-badge.tsx", Component: PageHeaderWithBadge },
  ],
  "pill": [
    { name: "Default", file: "pill/default.tsx", Component: PillDefault },
    { name: "Sizes", file: "pill/sizes.tsx", Component: PillSizes },
  ],
  "pixelated-canvas": [
    { name: "Default", file: "pixelated-canvas/default.tsx", Component: PixelatedCanvasDefault },
  ],
  "playlist-card": [
    { name: "Default", file: "playlist-card/default.tsx", Component: PlaylistCardDefault },
  ],
  "popover": [
    { name: "Default", file: "popover/default.tsx", Component: PopoverDefault },
    { name: "Controlled", file: "popover/controlled.tsx", Component: PopoverControlled },
    { name: "Menu Like", file: "popover/menu-like.tsx", Component: PopoverMenuLike },
    { name: "Placement", file: "popover/placement.tsx", Component: PopoverPlacement },
    { name: "Rich Content", file: "popover/rich-content.tsx", Component: PopoverRichContent },
    { name: "With Form", file: "popover/with-form.tsx", Component: PopoverWithForm },
  ],
  "price-change": [
    { name: "Default", file: "price-change/default.tsx", Component: PriceChangeDefault },
  ],
  "price-range-filter": [
    { name: "Default", file: "price-range-filter/default.tsx", Component: PriceRangeFilterDefault },
  ],
  "product-card": [
    { name: "Default", file: "product-card/default.tsx", Component: ProductCardDefault },
  ],
  "progress": [
    { name: "Default", file: "progress/default.tsx", Component: ProgressDefault },
    { name: "Controlled", file: "progress/controlled.tsx", Component: ProgressControlled },
    { name: "Indeterminate", file: "progress/indeterminate.tsx", Component: ProgressIndeterminate },
    { name: "Sizes", file: "progress/sizes.tsx", Component: ProgressSizes },
    { name: "Tones", file: "progress/tones.tsx", Component: ProgressTones },
    { name: "With Format", file: "progress/with-format.tsx", Component: ProgressWithFormat },
  ],
  "qr-code": [
    { name: "Default", file: "qr-code/default.tsx", Component: QrCodeDefault },
    { name: "Sizes", file: "qr-code/sizes.tsx", Component: QrCodeSizes },
  ],
  "radio-group": [
    { name: "Default", file: "radio-group/default.tsx", Component: RadioGroupDefault },
    { name: "Disabled", file: "radio-group/disabled.tsx", Component: RadioGroupDisabled },
    { name: "Form Validation", file: "radio-group/form-validation.tsx", Component: RadioGroupFormValidation },
    { name: "Horizontal", file: "radio-group/horizontal.tsx", Component: RadioGroupHorizontal },
    { name: "With Description", file: "radio-group/with-description.tsx", Component: RadioGroupWithDescription },
    { name: "With Icon", file: "radio-group/with-icon.tsx", Component: RadioGroupWithIcon },
  ],
  "rating": [
    { name: "Default", file: "rating/default.tsx", Component: RatingDefault },
    { name: "Custom Color", file: "rating/custom-color.tsx", Component: RatingCustomColor },
    { name: "Custom Icon", file: "rating/custom-icon.tsx", Component: RatingCustomIcon },
    { name: "Custom Size", file: "rating/custom-size.tsx", Component: RatingCustomSize },
    { name: "Fractional", file: "rating/fractional.tsx", Component: RatingFractional },
    { name: "Half", file: "rating/half.tsx", Component: RatingHalf },
    { name: "Read Only", file: "rating/read-only.tsx", Component: RatingReadOnly },
    { name: "Score Badge", file: "rating/score-badge.tsx", Component: RatingScoreBadge },
    { name: "With Form", file: "rating/with-form.tsx", Component: RatingWithForm },
  ],
  "relative-time": [
    { name: "Default", file: "relative-time/default.tsx", Component: RelativeTimeDefault },
    { name: "Sizes", file: "relative-time/sizes.tsx", Component: RelativeTimeSizes },
    { name: "World Clock", file: "relative-time/world-clock.tsx", Component: RelativeTimeWorldClock },
  ],
  "resource-list": [
    { name: "Default", file: "resource-list/default.tsx", Component: ResourceListDefault },
    { name: "Empty", file: "resource-list/empty.tsx", Component: ResourceListEmpty },
    { name: "Loading", file: "resource-list/loading.tsx", Component: ResourceListLoading },
    { name: "No Media", file: "resource-list/no-media.tsx", Component: ResourceListNoMedia },
    { name: "Selectable", file: "resource-list/selectable.tsx", Component: ResourceListSelectable },
    { name: "With Actions", file: "resource-list/with-actions.tsx", Component: ResourceListWithActions },
  ],
  "safari": [
    { name: "Default", file: "safari/default.tsx", Component: SafariDefault },
  ],
  "scroll-area": [
    { name: "Default", file: "scroll-area/default.tsx", Component: ScrollAreaDefault },
    { name: "Card List", file: "scroll-area/card-list.tsx", Component: ScrollAreaCardList },
    { name: "Compact", file: "scroll-area/compact.tsx", Component: ScrollAreaCompact },
    { name: "Prose", file: "scroll-area/prose.tsx", Component: ScrollAreaProse },
    { name: "With Header", file: "scroll-area/with-header.tsx", Component: ScrollAreaWithHeader },
  ],
  "section": [
    { name: "Default", file: "section/default.tsx", Component: SectionDefault },
    { name: "Inline Children", file: "section/inline-children.tsx", Component: SectionInlineChildren },
    { name: "No Header", file: "section/no-header.tsx", Component: SectionNoHeader },
    { name: "Setting Row Controls", file: "section/setting-row-controls.tsx", Component: SectionSettingRowControls },
    { name: "Stacked Sections", file: "section/stacked-sections.tsx", Component: SectionStackedSections },
    { name: "With Action", file: "section/with-action.tsx", Component: SectionWithAction },
  ],
  "segmented-control": [
    { name: "Default", file: "segmented-control/default.tsx", Component: SegmentedControlDefault },
    { name: "Controlled Display", file: "segmented-control/controlled-display.tsx", Component: SegmentedControlControlledDisplay },
    { name: "Disabled", file: "segmented-control/disabled.tsx", Component: SegmentedControlDisabled },
    { name: "Many Options", file: "segmented-control/many-options.tsx", Component: SegmentedControlManyOptions },
    { name: "Sizes", file: "segmented-control/sizes.tsx", Component: SegmentedControlSizes },
    { name: "Two Options", file: "segmented-control/two-options.tsx", Component: SegmentedControlTwoOptions },
  ],
  "select": [
    { name: "Default", file: "select/default.tsx", Component: SelectDefault },
    { name: "Controlled", file: "select/controlled.tsx", Component: SelectControlled },
    { name: "Disabled", file: "select/disabled.tsx", Component: SelectDisabled },
    { name: "Grouped", file: "select/grouped.tsx", Component: SelectGrouped },
    { name: "Sizes", file: "select/sizes.tsx", Component: SelectSizes },
    { name: "With Error", file: "select/with-error.tsx", Component: SelectWithError },
    { name: "With Icon", file: "select/with-icon.tsx", Component: SelectWithIcon },
  ],
  "separator": [
    { name: "Default", file: "separator/default.tsx", Component: SeparatorDefault },
    { name: "Custom Styling", file: "separator/custom-styling.tsx", Component: SeparatorCustomStyling },
    { name: "In Card", file: "separator/in-card.tsx", Component: SeparatorInCard },
    { name: "In Nav", file: "separator/in-nav.tsx", Component: SeparatorInNav },
    { name: "Vertical", file: "separator/vertical.tsx", Component: SeparatorVertical },
    { name: "With Label", file: "separator/with-label.tsx", Component: SeparatorWithLabel },
  ],
  "sheet": [
    { name: "Default", file: "sheet/default.tsx", Component: SheetDefault },
    { name: "Inset Nested", file: "sheet/inset-nested.tsx", Component: SheetInsetNested },
    { name: "Nested Steps", file: "sheet/nested-steps.tsx", Component: SheetNestedSteps },
    { name: "No Close Button", file: "sheet/no-close-button.tsx", Component: SheetNoCloseButton },
    { name: "Scrollable", file: "sheet/scrollable.tsx", Component: SheetScrollable },
    { name: "Sides", file: "sheet/sides.tsx", Component: SheetSides },
    { name: "With Form", file: "sheet/with-form.tsx", Component: SheetWithForm },
  ],
  "skeleton": [
    { name: "Default", file: "skeleton/default.tsx", Component: SkeletonDefault },
    { name: "Card", file: "skeleton/card.tsx", Component: SkeletonCard },
    { name: "List", file: "skeleton/list.tsx", Component: SkeletonList },
    { name: "Media Grid", file: "skeleton/media-grid.tsx", Component: SkeletonMediaGrid },
    { name: "Profile", file: "skeleton/profile.tsx", Component: SkeletonProfile },
    { name: "Table", file: "skeleton/table.tsx", Component: SkeletonTable },
    { name: "With Loaded State", file: "skeleton/with-loaded-state.tsx", Component: SkeletonWithLoadedState },
  ],
  "slider": [
    { name: "Default", file: "slider/default.tsx", Component: SliderDefault },
    { name: "Sizes", file: "slider/sizes.tsx", Component: SliderSizes },
  ],
  "sonner": [
    { name: "Default", file: "sonner/default.tsx", Component: SonnerDefault },
    { name: "Custom", file: "sonner/custom.tsx", Component: SonnerCustom },
    { name: "Dismissible", file: "sonner/dismissible.tsx", Component: SonnerDismissible },
    { name: "Positions", file: "sonner/positions.tsx", Component: SonnerPositions },
    { name: "Promise", file: "sonner/promise.tsx", Component: SonnerPromise },
    { name: "Rich Colors", file: "sonner/rich-colors.tsx", Component: SonnerRichColors },
    { name: "Variants", file: "sonner/variants.tsx", Component: SonnerVariants },
    { name: "With Action", file: "sonner/with-action.tsx", Component: SonnerWithAction },
    { name: "With Description", file: "sonner/with-description.tsx", Component: SonnerWithDescription },
  ],
  "sparkline": [
    { name: "Default", file: "sparkline/default.tsx", Component: SparklineDefault },
  ],
  "spinner": [
    { name: "Default", file: "spinner/default.tsx", Component: SpinnerDefault },
    { name: "Sizes", file: "spinner/sizes.tsx", Component: SpinnerSizes },
  ],
  "split-with-rail": [
    { name: "Default", file: "split-with-rail/default.tsx", Component: SplitWithRailDefault },
    { name: "Custom Layout", file: "split-with-rail/custom-layout.tsx", Component: SplitWithRailCustomLayout },
    { name: "Metrics Summary", file: "split-with-rail/metrics-summary.tsx", Component: SplitWithRailMetricsSummary },
    { name: "With Event Timeline", file: "split-with-rail/with-event-timeline.tsx", Component: SplitWithRailWithEventTimeline },
    { name: "With Timeline Rail", file: "split-with-rail/with-timeline-rail.tsx", Component: SplitWithRailWithTimelineRail },
  ],
  "stat-card": [
    { name: "Default", file: "stat-card/default.tsx", Component: StatCardDefault },
    { name: "Delta Directions", file: "stat-card/delta-directions.tsx", Component: StatCardDeltaDirections },
    { name: "Grid Dashboard", file: "stat-card/grid-dashboard.tsx", Component: StatCardGridDashboard },
    { name: "No Delta", file: "stat-card/no-delta.tsx", Component: StatCardNoDelta },
    { name: "Rich Value", file: "stat-card/rich-value.tsx", Component: StatCardRichValue },
    { name: "With Icons", file: "stat-card/with-icons.tsx", Component: StatCardWithIcons },
  ],
  "status-dot": [
    { name: "Default", file: "status-dot/default.tsx", Component: StatusDotDefault },
    { name: "Inline Text", file: "status-dot/inline-text.tsx", Component: StatusDotInlineText },
    { name: "Pulse", file: "status-dot/pulse.tsx", Component: StatusDotPulse },
    { name: "Sizes", file: "status-dot/sizes.tsx", Component: StatusDotSizes },
    { name: "Table Rows", file: "status-dot/table-rows.tsx", Component: StatusDotTableRows },
    { name: "Tones", file: "status-dot/tones.tsx", Component: StatusDotTones },
  ],
  "status-pill": [
    { name: "Default", file: "status-pill/default.tsx", Component: StatusPillDefault },
    { name: "Custom Class", file: "status-pill/custom-class.tsx", Component: StatusPillCustomClass },
    { name: "Inline Text", file: "status-pill/inline-text.tsx", Component: StatusPillInlineText },
    { name: "Pulse", file: "status-pill/pulse.tsx", Component: StatusPillPulse },
    { name: "Table Rows", file: "status-pill/table-rows.tsx", Component: StatusPillTableRows },
    { name: "Tones", file: "status-pill/tones.tsx", Component: StatusPillTones },
  ],
  "switch": [
    { name: "Default", file: "switch/default.tsx", Component: SwitchDefault },
    { name: "Controlled", file: "switch/controlled.tsx", Component: SwitchControlled },
    { name: "Disabled", file: "switch/disabled.tsx", Component: SwitchDisabled },
    { name: "Invalid", file: "switch/invalid.tsx", Component: SwitchInvalid },
    { name: "Sizes", file: "switch/sizes.tsx", Component: SwitchSizes },
    { name: "With Label", file: "switch/with-label.tsx", Component: SwitchWithLabel },
  ],
  "table": [
    { name: "Default", file: "table/default.tsx", Component: TableDefault },
    { name: "Empty State", file: "table/empty-state.tsx", Component: TableEmptyState },
    { name: "Loading Skeleton", file: "table/loading-skeleton.tsx", Component: TableLoadingSkeleton },
    { name: "Selectable Rows", file: "table/selectable-rows.tsx", Component: TableSelectableRows },
    { name: "Sortable Columns", file: "table/sortable-columns.tsx", Component: TableSortableColumns },
    { name: "With Actions", file: "table/with-actions.tsx", Component: TableWithActions },
    { name: "With Status Badges", file: "table/with-status-badges.tsx", Component: TableWithStatusBadges },
  ],
  "tabs": [
    { name: "Default", file: "tabs/default.tsx", Component: TabsDefault },
    { name: "Controlled", file: "tabs/controlled.tsx", Component: TabsControlled },
    { name: "Disabled", file: "tabs/disabled.tsx", Component: TabsDisabled },
    { name: "Keep Mounted", file: "tabs/keep-mounted.tsx", Component: TabsKeepMounted },
    { name: "Vertical", file: "tabs/vertical.tsx", Component: TabsVertical },
    { name: "Vertical With Icons", file: "tabs/vertical-with-icons.tsx", Component: TabsVerticalWithIcons },
    { name: "With Icons", file: "tabs/with-icons.tsx", Component: TabsWithIcons },
  ],
  "tag-input": [
    { name: "Default", file: "tag-input/default.tsx", Component: TagInputDefault },
    { name: "Disabled", file: "tag-input/disabled.tsx", Component: TagInputDisabled },
    { name: "Error", file: "tag-input/error.tsx", Component: TagInputError },
    { name: "Max Tags", file: "tag-input/max-tags.tsx", Component: TagInputMaxTags },
    { name: "Sizes", file: "tag-input/sizes.tsx", Component: TagInputSizes },
    { name: "With Suggestions", file: "tag-input/with-suggestions.tsx", Component: TagInputWithSuggestions },
  ],
  "textarea": [
    { name: "Default", file: "textarea/default.tsx", Component: TextareaDefault },
    { name: "Auto Resize", file: "textarea/auto-resize.tsx", Component: TextareaAutoResize },
    { name: "Character Count", file: "textarea/character-count.tsx", Component: TextareaCharacterCount },
    { name: "Disabled", file: "textarea/disabled.tsx", Component: TextareaDisabled },
    { name: "Error State", file: "textarea/error-state.tsx", Component: TextareaErrorState },
    { name: "Readonly", file: "textarea/readonly.tsx", Component: TextareaReadonly },
    { name: "With Label And Hint", file: "textarea/with-label-and-hint.tsx", Component: TextareaWithLabelAndHint },
  ],
  "ticker": [
    { name: "Default", file: "ticker/default.tsx", Component: TickerDefault },
    { name: "Sizes", file: "ticker/sizes.tsx", Component: TickerSizes },
  ],
  "timeline-rail": [
    { name: "Default", file: "timeline-rail/default.tsx", Component: TimelineRailDefault },
    { name: "Custom Terminal", file: "timeline-rail/custom-terminal.tsx", Component: TimelineRailCustomTerminal },
    { name: "Mixed Glyphs", file: "timeline-rail/mixed-glyphs.tsx", Component: TimelineRailMixedGlyphs },
    { name: "Multi Group", file: "timeline-rail/multi-group.tsx", Component: TimelineRailMultiGroup },
    { name: "With Icons", file: "timeline-rail/with-icons.tsx", Component: TimelineRailWithIcons },
    { name: "With Tones", file: "timeline-rail/with-tones.tsx", Component: TimelineRailWithTones },
  ],
  "toggle": [
    { name: "Default", file: "toggle/default.tsx", Component: ToggleDefault },
    { name: "Controlled", file: "toggle/controlled.tsx", Component: ToggleControlled },
    { name: "Disabled", file: "toggle/disabled.tsx", Component: ToggleDisabled },
    { name: "Sizes", file: "toggle/sizes.tsx", Component: ToggleSizes },
    { name: "Variants", file: "toggle/variants.tsx", Component: ToggleVariants },
    { name: "With Text", file: "toggle/with-text.tsx", Component: ToggleWithText },
  ],
  "toggle-group": [
    { name: "Default", file: "toggle-group/default.tsx", Component: ToggleGroupDefault },
    { name: "Disabled", file: "toggle-group/disabled.tsx", Component: ToggleGroupDisabled },
    { name: "Multiple", file: "toggle-group/multiple.tsx", Component: ToggleGroupMultiple },
    { name: "Sizes", file: "toggle-group/sizes.tsx", Component: ToggleGroupSizes },
    { name: "Variants", file: "toggle-group/variants.tsx", Component: ToggleGroupVariants },
    { name: "Vertical", file: "toggle-group/vertical.tsx", Component: ToggleGroupVertical },
  ],
  "tooltip": [
    { name: "Default", file: "tooltip/default.tsx", Component: TooltipDefault },
    { name: "Alignment", file: "tooltip/alignment.tsx", Component: TooltipAlignment },
    { name: "Rich Content", file: "tooltip/rich-content.tsx", Component: TooltipRichContent },
    { name: "Sides", file: "tooltip/sides.tsx", Component: TooltipSides },
    { name: "With Delay", file: "tooltip/with-delay.tsx", Component: TooltipWithDelay },
    { name: "With Icon", file: "tooltip/with-icon.tsx", Component: TooltipWithIcon },
  ],
  "track-list": [
    { name: "Default", file: "track-list/default.tsx", Component: TrackListDefault },
  ],
  "variant-picker": [
    { name: "Default", file: "variant-picker/default.tsx", Component: VariantPickerDefault },
  ],
  "verification-progress": [
    { name: "Default", file: "verification-progress/default.tsx", Component: VerificationProgressDefault },
    { name: "All Tones", file: "verification-progress/all-tones.tsx", Component: VerificationProgressAllTones },
    { name: "Many Steps", file: "verification-progress/many-steps.tsx", Component: VerificationProgressManySteps },
    { name: "Statuses", file: "verification-progress/statuses.tsx", Component: VerificationProgressStatuses },
    { name: "Two Steps", file: "verification-progress/two-steps.tsx", Component: VerificationProgressTwoSteps },
    { name: "With Counts", file: "verification-progress/with-counts.tsx", Component: VerificationProgressWithCounts },
  ],
  "video-player": [
    { name: "Default", file: "video-player/default.tsx", Component: VideoPlayerDefault },
    { name: "Composable", file: "video-player/composable.tsx", Component: VideoPlayerComposable },
    { name: "Variants", file: "video-player/variants.tsx", Component: VideoPlayerVariants },
    { name: "Youtube", file: "video-player/youtube.tsx", Component: VideoPlayerYoutube },
  ],
  "world-map": [
    { name: "Default", file: "world-map/default.tsx", Component: WorldMapDefault },
  ],
};
