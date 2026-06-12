import { forwardRef } from "react"
import {
  AmazonLogo as SsrAmazonLogo,
  AndroidLogo as SsrAndroidLogo,
  AngularLogo as SsrAngularLogo,
  AppStoreLogo as SsrAppStoreLogo,
  AppWindow as SsrAppWindow,
  AppleLogo as SsrAppleLogo,
  ApplePodcastsLogo as SsrApplePodcastsLogo,
  Archive as SsrArchive,
  ArrowBendUpLeft as SsrArrowBendUpLeft,
  ArrowClockwise as SsrArrowClockwise,
  ArrowCounterClockwise as SsrArrowCounterClockwise,
  ArrowDown as SsrArrowDown,
  ArrowElbowDownLeft as SsrArrowElbowDownLeft,
  ArrowLeft as SsrArrowLeft,
  ArrowRight as SsrArrowRight,
  ArrowSquareOut as SsrArrowSquareOut,
  ArrowUUpLeft as SsrArrowUUpLeft,
  ArrowUUpRight as SsrArrowUUpRight,
  ArrowUp as SsrArrowUp,
  ArrowUpRight as SsrArrowUpRight,
  ArrowsClockwise as SsrArrowsClockwise,
  ArrowsDownUp as SsrArrowsDownUp,
  ArrowsHorizontal as SsrArrowsHorizontal,
  ArrowsOut as SsrArrowsOut,
  Backspace as SsrBackspace,
  BehanceLogo as SsrBehanceLogo,
  Bell as SsrBell,
  BellRinging as SsrBellRinging,
  BellSlash as SsrBellSlash,
  Book as SsrBook,
  BookOpen as SsrBookOpen,
  Bookmark as SsrBookmark,
  Brain as SsrBrain,
  Broadcast as SsrBroadcast,
  Bug as SsrBug,
  Calendar as SsrCalendar,
  CalendarDots as SsrCalendarDots,
  Camera as SsrCamera,
  CaretDown as SsrCaretDown,
  CaretLeft as SsrCaretLeft,
  CaretRight as SsrCaretRight,
  CaretUp as SsrCaretUp,
  CaretUpDown as SsrCaretUpDown,
  ChartBar as SsrChartBar,
  ChartLine as SsrChartLine,
  Chat as SsrChat,
  ChatCircle as SsrChatCircle,
  Check as SsrCheck,
  CheckCircle as SsrCheckCircle,
  CheckSquare as SsrCheckSquare,
  Checks as SsrChecks,
  Circle as SsrCircle,
  CircleNotch as SsrCircleNotch,
  Clipboard as SsrClipboard,
  Clock as SsrClock,
  Cloud as SsrCloud,
  CodaLogo as SsrCodaLogo,
  Code as SsrCode,
  CodepenLogo as SsrCodepenLogo,
  CodesandboxLogo as SsrCodesandboxLogo,
  Columns as SsrColumns,
  Command as SsrCommand,
  Copy as SsrCopy,
  Cpu as SsrCpu,
  CreditCard as SsrCreditCard,
  Crop as SsrCrop,
  Crosshair as SsrCrosshair,
  Cube as SsrCube,
  CurrencyDollar as SsrCurrencyDollar,
  Cursor as SsrCursor,
  Database as SsrDatabase,
  DevToLogo as SsrDevToLogo,
  DeviceMobile as SsrDeviceMobile,
  DeviceTablet as SsrDeviceTablet,
  DiscordLogo as SsrDiscordLogo,
  DotsThree as SsrDotsThree,
  DotsThreeVertical as SsrDotsThreeVertical,
  DownloadSimple as SsrDownloadSimple,
  DribbbleLogo as SsrDribbbleLogo,
  DropboxLogo as SsrDropboxLogo,
  Envelope as SsrEnvelope,
  Eraser as SsrEraser,
  Eye as SsrEye,
  EyeSlash as SsrEyeSlash,
  Eyedropper as SsrEyedropper,
  Eyeglasses as SsrEyeglasses,
  FacebookLogo as SsrFacebookLogo,
  FediverseLogo as SsrFediverseLogo,
  FigmaLogo as SsrFigmaLogo,
  File as SsrFile,
  FileMagnifyingGlass as SsrFileMagnifyingGlass,
  FileText as SsrFileText,
  Files as SsrFiles,
  FilmStrip as SsrFilmStrip,
  Flag as SsrFlag,
  Flame as SsrFlame,
  FloppyDisk as SsrFloppyDisk,
  Folder as SsrFolder,
  FolderOpen as SsrFolderOpen,
  FolderPlus as SsrFolderPlus,
  FramerLogo as SsrFramerLogo,
  Funnel as SsrFunnel,
  Gear as SsrGear,
  GearSix as SsrGearSix,
  GitBranch as SsrGitBranch,
  GitCommit as SsrGitCommit,
  GitFork as SsrGitFork,
  GitMerge as SsrGitMerge,
  GithubLogo as SsrGithubLogo,
  GitlabLogo as SsrGitlabLogo,
  Globe as SsrGlobe,
  GlobeHemisphereWest as SsrGlobeHemisphereWest,
  GoodreadsLogo as SsrGoodreadsLogo,
  GoogleCardboardLogo as SsrGoogleCardboardLogo,
  GoogleChromeLogo as SsrGoogleChromeLogo,
  GoogleDriveLogo as SsrGoogleDriveLogo,
  GoogleLogo as SsrGoogleLogo,
  GooglePhotosLogo as SsrGooglePhotosLogo,
  GooglePlayLogo as SsrGooglePlayLogo,
  GooglePodcastsLogo as SsrGooglePodcastsLogo,
  Graph as SsrGraph,
  GridFour as SsrGridFour,
  HardDrives as SsrHardDrives,
  Hash as SsrHash,
  Heart as SsrHeart,
  House as SsrHouse,
  Image as SsrImage,
  Info as SsrInfo,
  InstagramLogo as SsrInstagramLogo,
  Key as SsrKey,
  Keyboard as SsrKeyboard,
  LastfmLogo as SsrLastfmLogo,
  Layout as SsrLayout,
  Lifebuoy as SsrLifebuoy,
  Lightning as SsrLightning,
  LineSegment as SsrLineSegment,
  LinkSimple as SsrLinkSimple,
  LinkedinLogo as SsrLinkedinLogo,
  LinktreeLogo as SsrLinktreeLogo,
  LinuxLogo as SsrLinuxLogo,
  List as SsrList,
  ListChecks as SsrListChecks,
  ListNumbers as SsrListNumbers,
  ListPlus as SsrListPlus,
  Lock as SsrLock,
  Magnet as SsrMagnet,
  MagnifyingGlass as SsrMagnifyingGlass,
  MapPin as SsrMapPin,
  MarkdownLogo as SsrMarkdownLogo,
  MastodonLogo as SsrMastodonLogo,
  MatrixLogo as SsrMatrixLogo,
  MediumLogo as SsrMediumLogo,
  Megaphone as SsrMegaphone,
  MessengerLogo as SsrMessengerLogo,
  MetaLogo as SsrMetaLogo,
  Microphone as SsrMicrophone,
  MicrosoftExcelLogo as SsrMicrosoftExcelLogo,
  MicrosoftOutlookLogo as SsrMicrosoftOutlookLogo,
  MicrosoftPowerpointLogo as SsrMicrosoftPowerpointLogo,
  MicrosoftTeamsLogo as SsrMicrosoftTeamsLogo,
  MicrosoftWordLogo as SsrMicrosoftWordLogo,
  Minus as SsrMinus,
  Monitor as SsrMonitor,
  Moon as SsrMoon,
  MusicNote as SsrMusicNote,
  MusicNotes as SsrMusicNotes,
  NavigationArrow as SsrNavigationArrow,
  Newspaper as SsrNewspaper,
  Note as SsrNote,
  NotionLogo as SsrNotionLogo,
  NyTimesLogo as SsrNyTimesLogo,
  OpenAiLogo as SsrOpenAiLogo,
  Package as SsrPackage,
  Palette as SsrPalette,
  PaperPlaneRight as SsrPaperPlaneRight,
  PaperPlaneTilt as SsrPaperPlaneTilt,
  Paperclip as SsrPaperclip,
  PatreonLogo as SsrPatreonLogo,
  Pause as SsrPause,
  PaypalLogo as SsrPaypalLogo,
  PencilSimple as SsrPencilSimple,
  PencilSimpleLine as SsrPencilSimpleLine,
  Percent as SsrPercent,
  Phone as SsrPhone,
  PhoneX as SsrPhoneX,
  PhosphorLogo as SsrPhosphorLogo,
  PinterestLogo as SsrPinterestLogo,
  PixLogo as SsrPixLogo,
  Play as SsrPlay,
  Playlist as SsrPlaylist,
  Plug as SsrPlug,
  Plugs as SsrPlugs,
  Plus as SsrPlus,
  PlusCircle as SsrPlusCircle,
  ProhibitInset as SsrProhibitInset,
  Pulse as SsrPulse,
  PushPin as SsrPushPin,
  PuzzlePiece as SsrPuzzlePiece,
  Question as SsrQuestion,
  Quotes as SsrQuotes,
  Radio as SsrRadio,
  ReadCvLogo as SsrReadCvLogo,
  Rectangle as SsrRectangle,
  RedditLogo as SsrRedditLogo,
  Repeat as SsrRepeat,
  ReplitLogo as SsrReplitLogo,
  Robot as SsrRobot,
  Rocket as SsrRocket,
  Rows as SsrRows,
  Ruler as SsrRuler,
  Scissors as SsrScissors,
  SealCheck as SsrSealCheck,
  ShareNetwork as SsrShareNetwork,
  Shield as SsrShield,
  ShieldCheck as SsrShieldCheck,
  ShieldWarning as SsrShieldWarning,
  ShoppingCart as SsrShoppingCart,
  Shuffle as SsrShuffle,
  Sidebar as SsrSidebar,
  SignOut as SsrSignOut,
  Siren as SsrSiren,
  SketchLogo as SsrSketchLogo,
  SkipBack as SsrSkipBack,
  SkipForward as SsrSkipForward,
  SkypeLogo as SsrSkypeLogo,
  SlackLogo as SsrSlackLogo,
  SlidersHorizontal as SsrSlidersHorizontal,
  Smiley as SsrSmiley,
  SnapchatLogo as SsrSnapchatLogo,
  SoundcloudLogo as SsrSoundcloudLogo,
  Sparkle as SsrSparkle,
  SpeakerHigh as SsrSpeakerHigh,
  SpeakerX as SsrSpeakerX,
  SpotifyLogo as SsrSpotifyLogo,
  Square as SsrSquare,
  SquareHalf as SsrSquareHalf,
  SquareLogo as SsrSquareLogo,
  SquaresFour as SsrSquaresFour,
  Stack as SsrStack,
  StackOverflowLogo as SsrStackOverflowLogo,
  StackSimple as SsrStackSimple,
  Star as SsrStar,
  SteamLogo as SsrSteamLogo,
  StripeLogo as SsrStripeLogo,
  Sun as SsrSun,
  Table as SsrTable,
  Tag as SsrTag,
  TelegramLogo as SsrTelegramLogo,
  Terminal as SsrTerminal,
  TerminalWindow as SsrTerminalWindow,
  TextAlignCenter as SsrTextAlignCenter,
  TextAlignLeft as SsrTextAlignLeft,
  TextAlignRight as SsrTextAlignRight,
  TextB as SsrTextB,
  TextHOne as SsrTextHOne,
  TextHThree as SsrTextHThree,
  TextHTwo as SsrTextHTwo,
  TextItalic as SsrTextItalic,
  TextStrikethrough as SsrTextStrikethrough,
  TextSubscript as SsrTextSubscript,
  TextSuperscript as SsrTextSuperscript,
  TextT as SsrTextT,
  TextUnderline as SsrTextUnderline,
  ThreadsLogo as SsrThreadsLogo,
  ThumbsDown as SsrThumbsDown,
  ThumbsUp as SsrThumbsUp,
  TidalLogo as SsrTidalLogo,
  TiktokLogo as SsrTiktokLogo,
  Timer as SsrTimer,
  Trash as SsrTrash,
  Tray as SsrTray,
  TrendDown as SsrTrendDown,
  TrendUp as SsrTrendUp,
  TumblrLogo as SsrTumblrLogo,
  TwitchLogo as SsrTwitchLogo,
  TwitterLogo as SsrTwitterLogo,
  UploadSimple as SsrUploadSimple,
  User as SsrUser,
  UserCircle as SsrUserCircle,
  Users as SsrUsers,
  VideoCamera as SsrVideoCamera,
  Warning as SsrWarning,
  WarningCircle as SsrWarningCircle,
  WebhooksLogo as SsrWebhooksLogo,
  WechatLogo as SsrWechatLogo,
  WhatsappLogo as SsrWhatsappLogo,
  Wheelchair as SsrWheelchair,
  WindowsLogo as SsrWindowsLogo,
  Wrench as SsrWrench,
  X as SsrX,
  XCircle as SsrXCircle,
  XLogo as SsrXLogo,
  YoutubeLogo as SsrYoutubeLogo,
} from "@phosphor-icons/react/dist/ssr"
import type { Icon, IconProps, IconWeight } from "@phosphor-icons/react"

export type { Icon, IconProps, IconWeight }

/**
 * Phosphor, duotone by default — the system's single icon voice.
 *
 * Built on Phosphor's SSR-safe icons (no React context) so every icon renders
 * identically in server and client components, and re-exported through one
 * `duotone()` wrapper that owns the default weight the way `--brand` owns the
 * accent. Pass `weight="bold" | "fill" | "regular" | "thin" | "light"` at any
 * call site to override. Import names match Phosphor's catalog exactly.
 *
 * Icons are imported by name (never `import * as`) so bundlers tree-shake the
 * set down to exactly what's used.
 */
function duotone(Base: Icon, displayName: string): Icon {
  const Wrapped = forwardRef<SVGSVGElement, IconProps>(function PhosphorIcon(
    { weight = "duotone", ...props },
    ref,
  ) {
    return <Base ref={ref} weight={weight} {...props} />
  })
  Wrapped.displayName = displayName
  return Wrapped as unknown as Icon
}

export const AmazonLogo = /*@__PURE__*/ duotone(SsrAmazonLogo, "AmazonLogo")
export const AndroidLogo = /*@__PURE__*/ duotone(SsrAndroidLogo, "AndroidLogo")
export const AngularLogo = /*@__PURE__*/ duotone(SsrAngularLogo, "AngularLogo")
export const AppStoreLogo = /*@__PURE__*/ duotone(
  SsrAppStoreLogo,
  "AppStoreLogo",
)
export const AppWindow = /*@__PURE__*/ duotone(SsrAppWindow, "AppWindow")
export const AppleLogo = /*@__PURE__*/ duotone(SsrAppleLogo, "AppleLogo")
export const ApplePodcastsLogo = /*@__PURE__*/ duotone(
  SsrApplePodcastsLogo,
  "ApplePodcastsLogo",
)
export const Archive = /*@__PURE__*/ duotone(SsrArchive, "Archive")
export const ArrowBendUpLeft = /*@__PURE__*/ duotone(
  SsrArrowBendUpLeft,
  "ArrowBendUpLeft",
)
export const ArrowClockwise = /*@__PURE__*/ duotone(
  SsrArrowClockwise,
  "ArrowClockwise",
)
export const ArrowCounterClockwise = /*@__PURE__*/ duotone(
  SsrArrowCounterClockwise,
  "ArrowCounterClockwise",
)
export const ArrowDown = /*@__PURE__*/ duotone(SsrArrowDown, "ArrowDown")
export const ArrowElbowDownLeft = /*@__PURE__*/ duotone(
  SsrArrowElbowDownLeft,
  "ArrowElbowDownLeft",
)
export const ArrowLeft = /*@__PURE__*/ duotone(SsrArrowLeft, "ArrowLeft")
export const ArrowRight = /*@__PURE__*/ duotone(SsrArrowRight, "ArrowRight")
export const ArrowSquareOut = /*@__PURE__*/ duotone(
  SsrArrowSquareOut,
  "ArrowSquareOut",
)
export const ArrowUUpLeft = /*@__PURE__*/ duotone(
  SsrArrowUUpLeft,
  "ArrowUUpLeft",
)
export const ArrowUUpRight = /*@__PURE__*/ duotone(
  SsrArrowUUpRight,
  "ArrowUUpRight",
)
export const ArrowUp = /*@__PURE__*/ duotone(SsrArrowUp, "ArrowUp")
export const ArrowUpRight = /*@__PURE__*/ duotone(
  SsrArrowUpRight,
  "ArrowUpRight",
)
export const ArrowsClockwise = /*@__PURE__*/ duotone(
  SsrArrowsClockwise,
  "ArrowsClockwise",
)
export const ArrowsDownUp = /*@__PURE__*/ duotone(
  SsrArrowsDownUp,
  "ArrowsDownUp",
)
export const ArrowsHorizontal = /*@__PURE__*/ duotone(
  SsrArrowsHorizontal,
  "ArrowsHorizontal",
)
export const ArrowsOut = /*@__PURE__*/ duotone(SsrArrowsOut, "ArrowsOut")
export const Backspace = /*@__PURE__*/ duotone(SsrBackspace, "Backspace")
export const BehanceLogo = /*@__PURE__*/ duotone(SsrBehanceLogo, "BehanceLogo")
export const Bell = /*@__PURE__*/ duotone(SsrBell, "Bell")
export const BellRinging = /*@__PURE__*/ duotone(SsrBellRinging, "BellRinging")
export const BellSlash = /*@__PURE__*/ duotone(SsrBellSlash, "BellSlash")
export const Book = /*@__PURE__*/ duotone(SsrBook, "Book")
export const BookOpen = /*@__PURE__*/ duotone(SsrBookOpen, "BookOpen")
export const Bookmark = /*@__PURE__*/ duotone(SsrBookmark, "Bookmark")
export const Brain = /*@__PURE__*/ duotone(SsrBrain, "Brain")
export const Broadcast = /*@__PURE__*/ duotone(SsrBroadcast, "Broadcast")
export const Bug = /*@__PURE__*/ duotone(SsrBug, "Bug")
export const Calendar = /*@__PURE__*/ duotone(SsrCalendar, "Calendar")
export const CalendarDots = /*@__PURE__*/ duotone(
  SsrCalendarDots,
  "CalendarDots",
)
export const Camera = /*@__PURE__*/ duotone(SsrCamera, "Camera")
export const CaretDown = /*@__PURE__*/ duotone(SsrCaretDown, "CaretDown")
export const CaretLeft = /*@__PURE__*/ duotone(SsrCaretLeft, "CaretLeft")
export const CaretRight = /*@__PURE__*/ duotone(SsrCaretRight, "CaretRight")
export const CaretUp = /*@__PURE__*/ duotone(SsrCaretUp, "CaretUp")
export const CaretUpDown = /*@__PURE__*/ duotone(SsrCaretUpDown, "CaretUpDown")
export const ChartBar = /*@__PURE__*/ duotone(SsrChartBar, "ChartBar")
export const ChartLine = /*@__PURE__*/ duotone(SsrChartLine, "ChartLine")
export const Chat = /*@__PURE__*/ duotone(SsrChat, "Chat")
export const ChatCircle = /*@__PURE__*/ duotone(SsrChatCircle, "ChatCircle")
export const Check = /*@__PURE__*/ duotone(SsrCheck, "Check")
export const CheckCircle = /*@__PURE__*/ duotone(SsrCheckCircle, "CheckCircle")
export const CheckSquare = /*@__PURE__*/ duotone(SsrCheckSquare, "CheckSquare")
export const Checks = /*@__PURE__*/ duotone(SsrChecks, "Checks")
export const Circle = /*@__PURE__*/ duotone(SsrCircle, "Circle")
export const CircleNotch = /*@__PURE__*/ duotone(SsrCircleNotch, "CircleNotch")
export const Clipboard = /*@__PURE__*/ duotone(SsrClipboard, "Clipboard")
export const Clock = /*@__PURE__*/ duotone(SsrClock, "Clock")
export const Cloud = /*@__PURE__*/ duotone(SsrCloud, "Cloud")
export const CodaLogo = /*@__PURE__*/ duotone(SsrCodaLogo, "CodaLogo")
export const Code = /*@__PURE__*/ duotone(SsrCode, "Code")
export const CodepenLogo = /*@__PURE__*/ duotone(SsrCodepenLogo, "CodepenLogo")
export const CodesandboxLogo = /*@__PURE__*/ duotone(
  SsrCodesandboxLogo,
  "CodesandboxLogo",
)
export const Columns = /*@__PURE__*/ duotone(SsrColumns, "Columns")
export const Command = /*@__PURE__*/ duotone(SsrCommand, "Command")
export const Copy = /*@__PURE__*/ duotone(SsrCopy, "Copy")
export const Cpu = /*@__PURE__*/ duotone(SsrCpu, "Cpu")
export const CreditCard = /*@__PURE__*/ duotone(SsrCreditCard, "CreditCard")
export const Crop = /*@__PURE__*/ duotone(SsrCrop, "Crop")
export const Crosshair = /*@__PURE__*/ duotone(SsrCrosshair, "Crosshair")
export const Cube = /*@__PURE__*/ duotone(SsrCube, "Cube")
export const CurrencyDollar = /*@__PURE__*/ duotone(
  SsrCurrencyDollar,
  "CurrencyDollar",
)
export const Cursor = /*@__PURE__*/ duotone(SsrCursor, "Cursor")
export const Database = /*@__PURE__*/ duotone(SsrDatabase, "Database")
export const DevToLogo = /*@__PURE__*/ duotone(SsrDevToLogo, "DevToLogo")
export const DeviceMobile = /*@__PURE__*/ duotone(
  SsrDeviceMobile,
  "DeviceMobile",
)
export const DeviceTablet = /*@__PURE__*/ duotone(
  SsrDeviceTablet,
  "DeviceTablet",
)
export const DiscordLogo = /*@__PURE__*/ duotone(SsrDiscordLogo, "DiscordLogo")
export const DotsThree = /*@__PURE__*/ duotone(SsrDotsThree, "DotsThree")
export const DotsThreeVertical = /*@__PURE__*/ duotone(
  SsrDotsThreeVertical,
  "DotsThreeVertical",
)
export const DownloadSimple = /*@__PURE__*/ duotone(
  SsrDownloadSimple,
  "DownloadSimple",
)
export const DribbbleLogo = /*@__PURE__*/ duotone(
  SsrDribbbleLogo,
  "DribbbleLogo",
)
export const DropboxLogo = /*@__PURE__*/ duotone(SsrDropboxLogo, "DropboxLogo")
export const Envelope = /*@__PURE__*/ duotone(SsrEnvelope, "Envelope")
export const Eraser = /*@__PURE__*/ duotone(SsrEraser, "Eraser")
export const Eye = /*@__PURE__*/ duotone(SsrEye, "Eye")
export const EyeSlash = /*@__PURE__*/ duotone(SsrEyeSlash, "EyeSlash")
export const Eyedropper = /*@__PURE__*/ duotone(SsrEyedropper, "Eyedropper")
export const Eyeglasses = /*@__PURE__*/ duotone(SsrEyeglasses, "Eyeglasses")
export const FacebookLogo = /*@__PURE__*/ duotone(
  SsrFacebookLogo,
  "FacebookLogo",
)
export const FediverseLogo = /*@__PURE__*/ duotone(
  SsrFediverseLogo,
  "FediverseLogo",
)
export const FigmaLogo = /*@__PURE__*/ duotone(SsrFigmaLogo, "FigmaLogo")
export const File = /*@__PURE__*/ duotone(SsrFile, "File")
export const FileMagnifyingGlass = /*@__PURE__*/ duotone(
  SsrFileMagnifyingGlass,
  "FileMagnifyingGlass",
)
export const FileText = /*@__PURE__*/ duotone(SsrFileText, "FileText")
export const Files = /*@__PURE__*/ duotone(SsrFiles, "Files")
export const FilmStrip = /*@__PURE__*/ duotone(SsrFilmStrip, "FilmStrip")
export const Flag = /*@__PURE__*/ duotone(SsrFlag, "Flag")
export const Flame = /*@__PURE__*/ duotone(SsrFlame, "Flame")
export const FloppyDisk = /*@__PURE__*/ duotone(SsrFloppyDisk, "FloppyDisk")
export const Folder = /*@__PURE__*/ duotone(SsrFolder, "Folder")
export const FolderOpen = /*@__PURE__*/ duotone(SsrFolderOpen, "FolderOpen")
export const FolderPlus = /*@__PURE__*/ duotone(SsrFolderPlus, "FolderPlus")
export const FramerLogo = /*@__PURE__*/ duotone(SsrFramerLogo, "FramerLogo")
export const Funnel = /*@__PURE__*/ duotone(SsrFunnel, "Funnel")
export const Gear = /*@__PURE__*/ duotone(SsrGear, "Gear")
export const GearSix = /*@__PURE__*/ duotone(SsrGearSix, "GearSix")
export const GitBranch = /*@__PURE__*/ duotone(SsrGitBranch, "GitBranch")
export const GitCommit = /*@__PURE__*/ duotone(SsrGitCommit, "GitCommit")
export const GitFork = /*@__PURE__*/ duotone(SsrGitFork, "GitFork")
export const GitMerge = /*@__PURE__*/ duotone(SsrGitMerge, "GitMerge")
export const GithubLogo = /*@__PURE__*/ duotone(SsrGithubLogo, "GithubLogo")
export const GitlabLogo = /*@__PURE__*/ duotone(SsrGitlabLogo, "GitlabLogo")
export const Globe = /*@__PURE__*/ duotone(SsrGlobe, "Globe")
export const GlobeHemisphereWest = /*@__PURE__*/ duotone(
  SsrGlobeHemisphereWest,
  "GlobeHemisphereWest",
)
export const GoodreadsLogo = /*@__PURE__*/ duotone(
  SsrGoodreadsLogo,
  "GoodreadsLogo",
)
export const GoogleCardboardLogo = /*@__PURE__*/ duotone(
  SsrGoogleCardboardLogo,
  "GoogleCardboardLogo",
)
export const GoogleChromeLogo = /*@__PURE__*/ duotone(
  SsrGoogleChromeLogo,
  "GoogleChromeLogo",
)
export const GoogleDriveLogo = /*@__PURE__*/ duotone(
  SsrGoogleDriveLogo,
  "GoogleDriveLogo",
)
export const GoogleLogo = /*@__PURE__*/ duotone(SsrGoogleLogo, "GoogleLogo")
export const GooglePhotosLogo = /*@__PURE__*/ duotone(
  SsrGooglePhotosLogo,
  "GooglePhotosLogo",
)
export const GooglePlayLogo = /*@__PURE__*/ duotone(
  SsrGooglePlayLogo,
  "GooglePlayLogo",
)
export const GooglePodcastsLogo = /*@__PURE__*/ duotone(
  SsrGooglePodcastsLogo,
  "GooglePodcastsLogo",
)
export const Graph = /*@__PURE__*/ duotone(SsrGraph, "Graph")
export const GridFour = /*@__PURE__*/ duotone(SsrGridFour, "GridFour")
export const HardDrives = /*@__PURE__*/ duotone(SsrHardDrives, "HardDrives")
export const Hash = /*@__PURE__*/ duotone(SsrHash, "Hash")
export const Heart = /*@__PURE__*/ duotone(SsrHeart, "Heart")
export const House = /*@__PURE__*/ duotone(SsrHouse, "House")
export const Image = /*@__PURE__*/ duotone(SsrImage, "Image")
export const Info = /*@__PURE__*/ duotone(SsrInfo, "Info")
export const InstagramLogo = /*@__PURE__*/ duotone(
  SsrInstagramLogo,
  "InstagramLogo",
)
export const Key = /*@__PURE__*/ duotone(SsrKey, "Key")
export const Keyboard = /*@__PURE__*/ duotone(SsrKeyboard, "Keyboard")
export const LastfmLogo = /*@__PURE__*/ duotone(SsrLastfmLogo, "LastfmLogo")
export const Layout = /*@__PURE__*/ duotone(SsrLayout, "Layout")
export const Lifebuoy = /*@__PURE__*/ duotone(SsrLifebuoy, "Lifebuoy")
export const Lightning = /*@__PURE__*/ duotone(SsrLightning, "Lightning")
export const LineSegment = /*@__PURE__*/ duotone(SsrLineSegment, "LineSegment")
export const LinkSimple = /*@__PURE__*/ duotone(SsrLinkSimple, "LinkSimple")
export const LinkedinLogo = /*@__PURE__*/ duotone(
  SsrLinkedinLogo,
  "LinkedinLogo",
)
export const LinktreeLogo = /*@__PURE__*/ duotone(
  SsrLinktreeLogo,
  "LinktreeLogo",
)
export const LinuxLogo = /*@__PURE__*/ duotone(SsrLinuxLogo, "LinuxLogo")
export const List = /*@__PURE__*/ duotone(SsrList, "List")
export const ListChecks = /*@__PURE__*/ duotone(SsrListChecks, "ListChecks")
export const ListNumbers = /*@__PURE__*/ duotone(SsrListNumbers, "ListNumbers")
export const ListPlus = /*@__PURE__*/ duotone(SsrListPlus, "ListPlus")
export const Lock = /*@__PURE__*/ duotone(SsrLock, "Lock")
export const Magnet = /*@__PURE__*/ duotone(SsrMagnet, "Magnet")
export const MagnifyingGlass = /*@__PURE__*/ duotone(
  SsrMagnifyingGlass,
  "MagnifyingGlass",
)
export const MapPin = /*@__PURE__*/ duotone(SsrMapPin, "MapPin")
export const MarkdownLogo = /*@__PURE__*/ duotone(
  SsrMarkdownLogo,
  "MarkdownLogo",
)
export const MastodonLogo = /*@__PURE__*/ duotone(
  SsrMastodonLogo,
  "MastodonLogo",
)
export const MatrixLogo = /*@__PURE__*/ duotone(SsrMatrixLogo, "MatrixLogo")
export const MediumLogo = /*@__PURE__*/ duotone(SsrMediumLogo, "MediumLogo")
export const Megaphone = /*@__PURE__*/ duotone(SsrMegaphone, "Megaphone")
export const MessengerLogo = /*@__PURE__*/ duotone(
  SsrMessengerLogo,
  "MessengerLogo",
)
export const MetaLogo = /*@__PURE__*/ duotone(SsrMetaLogo, "MetaLogo")
export const Microphone = /*@__PURE__*/ duotone(SsrMicrophone, "Microphone")
export const MicrosoftExcelLogo = /*@__PURE__*/ duotone(
  SsrMicrosoftExcelLogo,
  "MicrosoftExcelLogo",
)
export const MicrosoftOutlookLogo = /*@__PURE__*/ duotone(
  SsrMicrosoftOutlookLogo,
  "MicrosoftOutlookLogo",
)
export const MicrosoftPowerpointLogo = /*@__PURE__*/ duotone(
  SsrMicrosoftPowerpointLogo,
  "MicrosoftPowerpointLogo",
)
export const MicrosoftTeamsLogo = /*@__PURE__*/ duotone(
  SsrMicrosoftTeamsLogo,
  "MicrosoftTeamsLogo",
)
export const MicrosoftWordLogo = /*@__PURE__*/ duotone(
  SsrMicrosoftWordLogo,
  "MicrosoftWordLogo",
)
export const Minus = /*@__PURE__*/ duotone(SsrMinus, "Minus")
export const Monitor = /*@__PURE__*/ duotone(SsrMonitor, "Monitor")
export const Moon = /*@__PURE__*/ duotone(SsrMoon, "Moon")
export const MusicNote = /*@__PURE__*/ duotone(SsrMusicNote, "MusicNote")
export const MusicNotes = /*@__PURE__*/ duotone(SsrMusicNotes, "MusicNotes")
export const NavigationArrow = /*@__PURE__*/ duotone(
  SsrNavigationArrow,
  "NavigationArrow",
)
export const Newspaper = /*@__PURE__*/ duotone(SsrNewspaper, "Newspaper")
export const Note = /*@__PURE__*/ duotone(SsrNote, "Note")
export const NotionLogo = /*@__PURE__*/ duotone(SsrNotionLogo, "NotionLogo")
export const NyTimesLogo = /*@__PURE__*/ duotone(SsrNyTimesLogo, "NyTimesLogo")
export const OpenAiLogo = /*@__PURE__*/ duotone(SsrOpenAiLogo, "OpenAiLogo")
export const Package = /*@__PURE__*/ duotone(SsrPackage, "Package")
export const Palette = /*@__PURE__*/ duotone(SsrPalette, "Palette")
export const PaperPlaneRight = /*@__PURE__*/ duotone(
  SsrPaperPlaneRight,
  "PaperPlaneRight",
)
export const PaperPlaneTilt = /*@__PURE__*/ duotone(
  SsrPaperPlaneTilt,
  "PaperPlaneTilt",
)
export const Paperclip = /*@__PURE__*/ duotone(SsrPaperclip, "Paperclip")
export const PatreonLogo = /*@__PURE__*/ duotone(SsrPatreonLogo, "PatreonLogo")
export const Pause = /*@__PURE__*/ duotone(SsrPause, "Pause")
export const PaypalLogo = /*@__PURE__*/ duotone(SsrPaypalLogo, "PaypalLogo")
export const PencilSimple = /*@__PURE__*/ duotone(
  SsrPencilSimple,
  "PencilSimple",
)
export const PencilSimpleLine = /*@__PURE__*/ duotone(
  SsrPencilSimpleLine,
  "PencilSimpleLine",
)
export const Percent = /*@__PURE__*/ duotone(SsrPercent, "Percent")
export const Phone = /*@__PURE__*/ duotone(SsrPhone, "Phone")
export const PhoneX = /*@__PURE__*/ duotone(SsrPhoneX, "PhoneX")
export const PhosphorLogo = /*@__PURE__*/ duotone(
  SsrPhosphorLogo,
  "PhosphorLogo",
)
export const PinterestLogo = /*@__PURE__*/ duotone(
  SsrPinterestLogo,
  "PinterestLogo",
)
export const PixLogo = /*@__PURE__*/ duotone(SsrPixLogo, "PixLogo")
export const Play = /*@__PURE__*/ duotone(SsrPlay, "Play")
export const Playlist = /*@__PURE__*/ duotone(SsrPlaylist, "Playlist")
export const Plug = /*@__PURE__*/ duotone(SsrPlug, "Plug")
export const Plugs = /*@__PURE__*/ duotone(SsrPlugs, "Plugs")
export const Plus = /*@__PURE__*/ duotone(SsrPlus, "Plus")
export const PlusCircle = /*@__PURE__*/ duotone(SsrPlusCircle, "PlusCircle")
export const ProhibitInset = /*@__PURE__*/ duotone(
  SsrProhibitInset,
  "ProhibitInset",
)
export const Pulse = /*@__PURE__*/ duotone(SsrPulse, "Pulse")
export const PushPin = /*@__PURE__*/ duotone(SsrPushPin, "PushPin")
export const PuzzlePiece = /*@__PURE__*/ duotone(SsrPuzzlePiece, "PuzzlePiece")
export const Question = /*@__PURE__*/ duotone(SsrQuestion, "Question")
export const Quotes = /*@__PURE__*/ duotone(SsrQuotes, "Quotes")
export const Radio = /*@__PURE__*/ duotone(SsrRadio, "Radio")
export const ReadCvLogo = /*@__PURE__*/ duotone(SsrReadCvLogo, "ReadCvLogo")
export const Rectangle = /*@__PURE__*/ duotone(SsrRectangle, "Rectangle")
export const RedditLogo = /*@__PURE__*/ duotone(SsrRedditLogo, "RedditLogo")
export const Repeat = /*@__PURE__*/ duotone(SsrRepeat, "Repeat")
export const ReplitLogo = /*@__PURE__*/ duotone(SsrReplitLogo, "ReplitLogo")
export const Robot = /*@__PURE__*/ duotone(SsrRobot, "Robot")
export const Rocket = /*@__PURE__*/ duotone(SsrRocket, "Rocket")
export const Rows = /*@__PURE__*/ duotone(SsrRows, "Rows")
export const Ruler = /*@__PURE__*/ duotone(SsrRuler, "Ruler")
export const Scissors = /*@__PURE__*/ duotone(SsrScissors, "Scissors")
export const SealCheck = /*@__PURE__*/ duotone(SsrSealCheck, "SealCheck")
export const ShareNetwork = /*@__PURE__*/ duotone(
  SsrShareNetwork,
  "ShareNetwork",
)
export const Shield = /*@__PURE__*/ duotone(SsrShield, "Shield")
export const ShieldCheck = /*@__PURE__*/ duotone(SsrShieldCheck, "ShieldCheck")
export const ShieldWarning = /*@__PURE__*/ duotone(
  SsrShieldWarning,
  "ShieldWarning",
)
export const ShoppingCart = /*@__PURE__*/ duotone(
  SsrShoppingCart,
  "ShoppingCart",
)
export const Shuffle = /*@__PURE__*/ duotone(SsrShuffle, "Shuffle")
export const Sidebar = /*@__PURE__*/ duotone(SsrSidebar, "Sidebar")
export const SignOut = /*@__PURE__*/ duotone(SsrSignOut, "SignOut")
export const Siren = /*@__PURE__*/ duotone(SsrSiren, "Siren")
export const SketchLogo = /*@__PURE__*/ duotone(SsrSketchLogo, "SketchLogo")
export const SkipBack = /*@__PURE__*/ duotone(SsrSkipBack, "SkipBack")
export const SkipForward = /*@__PURE__*/ duotone(SsrSkipForward, "SkipForward")
export const SkypeLogo = /*@__PURE__*/ duotone(SsrSkypeLogo, "SkypeLogo")
export const SlackLogo = /*@__PURE__*/ duotone(SsrSlackLogo, "SlackLogo")
export const SlidersHorizontal = /*@__PURE__*/ duotone(
  SsrSlidersHorizontal,
  "SlidersHorizontal",
)
export const Smiley = /*@__PURE__*/ duotone(SsrSmiley, "Smiley")
export const SnapchatLogo = /*@__PURE__*/ duotone(
  SsrSnapchatLogo,
  "SnapchatLogo",
)
export const SoundcloudLogo = /*@__PURE__*/ duotone(
  SsrSoundcloudLogo,
  "SoundcloudLogo",
)
export const Sparkle = /*@__PURE__*/ duotone(SsrSparkle, "Sparkle")
export const SpeakerHigh = /*@__PURE__*/ duotone(SsrSpeakerHigh, "SpeakerHigh")
export const SpeakerX = /*@__PURE__*/ duotone(SsrSpeakerX, "SpeakerX")
export const SpotifyLogo = /*@__PURE__*/ duotone(SsrSpotifyLogo, "SpotifyLogo")
export const Square = /*@__PURE__*/ duotone(SsrSquare, "Square")
export const SquareHalf = /*@__PURE__*/ duotone(SsrSquareHalf, "SquareHalf")
export const SquareLogo = /*@__PURE__*/ duotone(SsrSquareLogo, "SquareLogo")
export const SquaresFour = /*@__PURE__*/ duotone(SsrSquaresFour, "SquaresFour")
export const Stack = /*@__PURE__*/ duotone(SsrStack, "Stack")
export const StackOverflowLogo = /*@__PURE__*/ duotone(
  SsrStackOverflowLogo,
  "StackOverflowLogo",
)
export const StackSimple = /*@__PURE__*/ duotone(SsrStackSimple, "StackSimple")
export const Star = /*@__PURE__*/ duotone(SsrStar, "Star")
export const SteamLogo = /*@__PURE__*/ duotone(SsrSteamLogo, "SteamLogo")
export const StripeLogo = /*@__PURE__*/ duotone(SsrStripeLogo, "StripeLogo")
export const Sun = /*@__PURE__*/ duotone(SsrSun, "Sun")
export const Table = /*@__PURE__*/ duotone(SsrTable, "Table")
export const Tag = /*@__PURE__*/ duotone(SsrTag, "Tag")
export const TelegramLogo = /*@__PURE__*/ duotone(
  SsrTelegramLogo,
  "TelegramLogo",
)
export const Terminal = /*@__PURE__*/ duotone(SsrTerminal, "Terminal")
export const TerminalWindow = /*@__PURE__*/ duotone(
  SsrTerminalWindow,
  "TerminalWindow",
)
export const TextAlignCenter = /*@__PURE__*/ duotone(
  SsrTextAlignCenter,
  "TextAlignCenter",
)
export const TextAlignLeft = /*@__PURE__*/ duotone(
  SsrTextAlignLeft,
  "TextAlignLeft",
)
export const TextAlignRight = /*@__PURE__*/ duotone(
  SsrTextAlignRight,
  "TextAlignRight",
)
export const TextB = /*@__PURE__*/ duotone(SsrTextB, "TextB")
export const TextHOne = /*@__PURE__*/ duotone(SsrTextHOne, "TextHOne")
export const TextHThree = /*@__PURE__*/ duotone(SsrTextHThree, "TextHThree")
export const TextHTwo = /*@__PURE__*/ duotone(SsrTextHTwo, "TextHTwo")
export const TextItalic = /*@__PURE__*/ duotone(SsrTextItalic, "TextItalic")
export const TextStrikethrough = /*@__PURE__*/ duotone(
  SsrTextStrikethrough,
  "TextStrikethrough",
)
export const TextSubscript = /*@__PURE__*/ duotone(
  SsrTextSubscript,
  "TextSubscript",
)
export const TextSuperscript = /*@__PURE__*/ duotone(
  SsrTextSuperscript,
  "TextSuperscript",
)
export const TextT = /*@__PURE__*/ duotone(SsrTextT, "TextT")
export const TextUnderline = /*@__PURE__*/ duotone(
  SsrTextUnderline,
  "TextUnderline",
)
export const ThreadsLogo = /*@__PURE__*/ duotone(SsrThreadsLogo, "ThreadsLogo")
export const ThumbsDown = /*@__PURE__*/ duotone(SsrThumbsDown, "ThumbsDown")
export const ThumbsUp = /*@__PURE__*/ duotone(SsrThumbsUp, "ThumbsUp")
export const TidalLogo = /*@__PURE__*/ duotone(SsrTidalLogo, "TidalLogo")
export const TiktokLogo = /*@__PURE__*/ duotone(SsrTiktokLogo, "TiktokLogo")
export const Timer = /*@__PURE__*/ duotone(SsrTimer, "Timer")
export const Trash = /*@__PURE__*/ duotone(SsrTrash, "Trash")
export const Tray = /*@__PURE__*/ duotone(SsrTray, "Tray")
export const TrendDown = /*@__PURE__*/ duotone(SsrTrendDown, "TrendDown")
export const TrendUp = /*@__PURE__*/ duotone(SsrTrendUp, "TrendUp")
export const TumblrLogo = /*@__PURE__*/ duotone(SsrTumblrLogo, "TumblrLogo")
export const TwitchLogo = /*@__PURE__*/ duotone(SsrTwitchLogo, "TwitchLogo")
export const TwitterLogo = /*@__PURE__*/ duotone(SsrTwitterLogo, "TwitterLogo")
export const UploadSimple = /*@__PURE__*/ duotone(
  SsrUploadSimple,
  "UploadSimple",
)
export const User = /*@__PURE__*/ duotone(SsrUser, "User")
export const UserCircle = /*@__PURE__*/ duotone(SsrUserCircle, "UserCircle")
export const Users = /*@__PURE__*/ duotone(SsrUsers, "Users")
export const VideoCamera = /*@__PURE__*/ duotone(SsrVideoCamera, "VideoCamera")
export const Warning = /*@__PURE__*/ duotone(SsrWarning, "Warning")
export const WarningCircle = /*@__PURE__*/ duotone(
  SsrWarningCircle,
  "WarningCircle",
)
export const WebhooksLogo = /*@__PURE__*/ duotone(
  SsrWebhooksLogo,
  "WebhooksLogo",
)
export const WechatLogo = /*@__PURE__*/ duotone(SsrWechatLogo, "WechatLogo")
export const WhatsappLogo = /*@__PURE__*/ duotone(
  SsrWhatsappLogo,
  "WhatsappLogo",
)
export const Wheelchair = /*@__PURE__*/ duotone(SsrWheelchair, "Wheelchair")
export const WindowsLogo = /*@__PURE__*/ duotone(SsrWindowsLogo, "WindowsLogo")
export const Wrench = /*@__PURE__*/ duotone(SsrWrench, "Wrench")
export const X = /*@__PURE__*/ duotone(SsrX, "X")
export const XCircle = /*@__PURE__*/ duotone(SsrXCircle, "XCircle")
export const XLogo = /*@__PURE__*/ duotone(SsrXLogo, "XLogo")
export const YoutubeLogo = /*@__PURE__*/ duotone(SsrYoutubeLogo, "YoutubeLogo")
