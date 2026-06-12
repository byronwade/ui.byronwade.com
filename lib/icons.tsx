import { forwardRef } from "react"
import * as Ssr from "@phosphor-icons/react/dist/ssr"
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

export const AppWindow = /*@__PURE__*/ duotone(Ssr.AppWindow, "AppWindow")
export const Archive = /*@__PURE__*/ duotone(Ssr.Archive, "Archive")
export const ArrowBendUpLeft = /*@__PURE__*/ duotone(
  Ssr.ArrowBendUpLeft,
  "ArrowBendUpLeft",
)
export const ArrowClockwise = /*@__PURE__*/ duotone(
  Ssr.ArrowClockwise,
  "ArrowClockwise",
)
export const ArrowCounterClockwise = /*@__PURE__*/ duotone(
  Ssr.ArrowCounterClockwise,
  "ArrowCounterClockwise",
)
export const ArrowDown = /*@__PURE__*/ duotone(Ssr.ArrowDown, "ArrowDown")
export const ArrowElbowDownLeft = /*@__PURE__*/ duotone(
  Ssr.ArrowElbowDownLeft,
  "ArrowElbowDownLeft",
)
export const ArrowLeft = /*@__PURE__*/ duotone(Ssr.ArrowLeft, "ArrowLeft")
export const ArrowRight = /*@__PURE__*/ duotone(Ssr.ArrowRight, "ArrowRight")
export const ArrowSquareOut = /*@__PURE__*/ duotone(
  Ssr.ArrowSquareOut,
  "ArrowSquareOut",
)
export const ArrowUUpLeft = /*@__PURE__*/ duotone(
  Ssr.ArrowUUpLeft,
  "ArrowUUpLeft",
)
export const ArrowUUpRight = /*@__PURE__*/ duotone(
  Ssr.ArrowUUpRight,
  "ArrowUUpRight",
)
export const ArrowUp = /*@__PURE__*/ duotone(Ssr.ArrowUp, "ArrowUp")
export const ArrowUpRight = /*@__PURE__*/ duotone(
  Ssr.ArrowUpRight,
  "ArrowUpRight",
)
export const ArrowsClockwise = /*@__PURE__*/ duotone(
  Ssr.ArrowsClockwise,
  "ArrowsClockwise",
)
export const ArrowsDownUp = /*@__PURE__*/ duotone(
  Ssr.ArrowsDownUp,
  "ArrowsDownUp",
)
export const ArrowsHorizontal = /*@__PURE__*/ duotone(
  Ssr.ArrowsHorizontal,
  "ArrowsHorizontal",
)
export const ArrowsOut = /*@__PURE__*/ duotone(Ssr.ArrowsOut, "ArrowsOut")
export const Backspace = /*@__PURE__*/ duotone(Ssr.Backspace, "Backspace")
export const Bell = /*@__PURE__*/ duotone(Ssr.Bell, "Bell")
export const BellRinging = /*@__PURE__*/ duotone(Ssr.BellRinging, "BellRinging")
export const BellSlash = /*@__PURE__*/ duotone(Ssr.BellSlash, "BellSlash")
export const Book = /*@__PURE__*/ duotone(Ssr.Book, "Book")
export const BookOpen = /*@__PURE__*/ duotone(Ssr.BookOpen, "BookOpen")
export const Bookmark = /*@__PURE__*/ duotone(Ssr.Bookmark, "Bookmark")
export const Brain = /*@__PURE__*/ duotone(Ssr.Brain, "Brain")
export const Broadcast = /*@__PURE__*/ duotone(Ssr.Broadcast, "Broadcast")
export const Bug = /*@__PURE__*/ duotone(Ssr.Bug, "Bug")
export const Calendar = /*@__PURE__*/ duotone(Ssr.Calendar, "Calendar")
export const CalendarDots = /*@__PURE__*/ duotone(
  Ssr.CalendarDots,
  "CalendarDots",
)
export const Camera = /*@__PURE__*/ duotone(Ssr.Camera, "Camera")
export const CaretDown = /*@__PURE__*/ duotone(Ssr.CaretDown, "CaretDown")
export const CaretLeft = /*@__PURE__*/ duotone(Ssr.CaretLeft, "CaretLeft")
export const CaretRight = /*@__PURE__*/ duotone(Ssr.CaretRight, "CaretRight")
export const CaretUp = /*@__PURE__*/ duotone(Ssr.CaretUp, "CaretUp")
export const CaretUpDown = /*@__PURE__*/ duotone(Ssr.CaretUpDown, "CaretUpDown")
export const ChartBar = /*@__PURE__*/ duotone(Ssr.ChartBar, "ChartBar")
export const ChartLine = /*@__PURE__*/ duotone(Ssr.ChartLine, "ChartLine")
export const Chat = /*@__PURE__*/ duotone(Ssr.Chat, "Chat")
export const ChatCircle = /*@__PURE__*/ duotone(Ssr.ChatCircle, "ChatCircle")
export const Check = /*@__PURE__*/ duotone(Ssr.Check, "Check")
export const CheckCircle = /*@__PURE__*/ duotone(Ssr.CheckCircle, "CheckCircle")
export const CheckSquare = /*@__PURE__*/ duotone(Ssr.CheckSquare, "CheckSquare")
export const Checks = /*@__PURE__*/ duotone(Ssr.Checks, "Checks")
export const Circle = /*@__PURE__*/ duotone(Ssr.Circle, "Circle")
export const CircleNotch = /*@__PURE__*/ duotone(Ssr.CircleNotch, "CircleNotch")
export const Clipboard = /*@__PURE__*/ duotone(Ssr.Clipboard, "Clipboard")
export const Clock = /*@__PURE__*/ duotone(Ssr.Clock, "Clock")
export const Cloud = /*@__PURE__*/ duotone(Ssr.Cloud, "Cloud")
export const Code = /*@__PURE__*/ duotone(Ssr.Code, "Code")
export const Columns = /*@__PURE__*/ duotone(Ssr.Columns, "Columns")
export const Command = /*@__PURE__*/ duotone(Ssr.Command, "Command")
export const Copy = /*@__PURE__*/ duotone(Ssr.Copy, "Copy")
export const Cpu = /*@__PURE__*/ duotone(Ssr.Cpu, "Cpu")
export const CreditCard = /*@__PURE__*/ duotone(Ssr.CreditCard, "CreditCard")
export const Crop = /*@__PURE__*/ duotone(Ssr.Crop, "Crop")
export const Crosshair = /*@__PURE__*/ duotone(Ssr.Crosshair, "Crosshair")
export const Cube = /*@__PURE__*/ duotone(Ssr.Cube, "Cube")
export const CurrencyDollar = /*@__PURE__*/ duotone(
  Ssr.CurrencyDollar,
  "CurrencyDollar",
)
export const Cursor = /*@__PURE__*/ duotone(Ssr.Cursor, "Cursor")
export const Database = /*@__PURE__*/ duotone(Ssr.Database, "Database")
export const DeviceMobile = /*@__PURE__*/ duotone(
  Ssr.DeviceMobile,
  "DeviceMobile",
)
export const DeviceTablet = /*@__PURE__*/ duotone(
  Ssr.DeviceTablet,
  "DeviceTablet",
)
export const DotsThree = /*@__PURE__*/ duotone(Ssr.DotsThree, "DotsThree")
export const DotsThreeVertical = /*@__PURE__*/ duotone(
  Ssr.DotsThreeVertical,
  "DotsThreeVertical",
)
export const DownloadSimple = /*@__PURE__*/ duotone(
  Ssr.DownloadSimple,
  "DownloadSimple",
)
export const Envelope = /*@__PURE__*/ duotone(Ssr.Envelope, "Envelope")
export const Eraser = /*@__PURE__*/ duotone(Ssr.Eraser, "Eraser")
export const Eye = /*@__PURE__*/ duotone(Ssr.Eye, "Eye")
export const EyeSlash = /*@__PURE__*/ duotone(Ssr.EyeSlash, "EyeSlash")
export const Eyedropper = /*@__PURE__*/ duotone(Ssr.Eyedropper, "Eyedropper")
export const Eyeglasses = /*@__PURE__*/ duotone(Ssr.Eyeglasses, "Eyeglasses")
export const File = /*@__PURE__*/ duotone(Ssr.File, "File")
export const FileMagnifyingGlass = /*@__PURE__*/ duotone(
  Ssr.FileMagnifyingGlass,
  "FileMagnifyingGlass",
)
export const FileText = /*@__PURE__*/ duotone(Ssr.FileText, "FileText")
export const Files = /*@__PURE__*/ duotone(Ssr.Files, "Files")
export const FilmStrip = /*@__PURE__*/ duotone(Ssr.FilmStrip, "FilmStrip")
export const Flag = /*@__PURE__*/ duotone(Ssr.Flag, "Flag")
export const Flame = /*@__PURE__*/ duotone(Ssr.Flame, "Flame")
export const FloppyDisk = /*@__PURE__*/ duotone(Ssr.FloppyDisk, "FloppyDisk")
export const Folder = /*@__PURE__*/ duotone(Ssr.Folder, "Folder")
export const FolderOpen = /*@__PURE__*/ duotone(Ssr.FolderOpen, "FolderOpen")
export const FolderPlus = /*@__PURE__*/ duotone(Ssr.FolderPlus, "FolderPlus")
export const Funnel = /*@__PURE__*/ duotone(Ssr.Funnel, "Funnel")
export const Gear = /*@__PURE__*/ duotone(Ssr.Gear, "Gear")
export const GearSix = /*@__PURE__*/ duotone(Ssr.GearSix, "GearSix")
export const GitBranch = /*@__PURE__*/ duotone(Ssr.GitBranch, "GitBranch")
export const GitCommit = /*@__PURE__*/ duotone(Ssr.GitCommit, "GitCommit")
export const GitFork = /*@__PURE__*/ duotone(Ssr.GitFork, "GitFork")
export const GitMerge = /*@__PURE__*/ duotone(Ssr.GitMerge, "GitMerge")
export const Globe = /*@__PURE__*/ duotone(Ssr.Globe, "Globe")
export const GlobeHemisphereWest = /*@__PURE__*/ duotone(
  Ssr.GlobeHemisphereWest,
  "GlobeHemisphereWest",
)
export const Graph = /*@__PURE__*/ duotone(Ssr.Graph, "Graph")
export const GridFour = /*@__PURE__*/ duotone(Ssr.GridFour, "GridFour")
export const HardDrives = /*@__PURE__*/ duotone(Ssr.HardDrives, "HardDrives")
export const Hash = /*@__PURE__*/ duotone(Ssr.Hash, "Hash")
export const Heart = /*@__PURE__*/ duotone(Ssr.Heart, "Heart")
export const House = /*@__PURE__*/ duotone(Ssr.House, "House")
export const Image = /*@__PURE__*/ duotone(Ssr.Image, "Image")
export const Info = /*@__PURE__*/ duotone(Ssr.Info, "Info")
export const Key = /*@__PURE__*/ duotone(Ssr.Key, "Key")
export const Keyboard = /*@__PURE__*/ duotone(Ssr.Keyboard, "Keyboard")
export const Layout = /*@__PURE__*/ duotone(Ssr.Layout, "Layout")
export const Lifebuoy = /*@__PURE__*/ duotone(Ssr.Lifebuoy, "Lifebuoy")
export const Lightning = /*@__PURE__*/ duotone(Ssr.Lightning, "Lightning")
export const LineSegment = /*@__PURE__*/ duotone(Ssr.LineSegment, "LineSegment")
export const LinkSimple = /*@__PURE__*/ duotone(Ssr.LinkSimple, "LinkSimple")
export const List = /*@__PURE__*/ duotone(Ssr.List, "List")
export const ListChecks = /*@__PURE__*/ duotone(Ssr.ListChecks, "ListChecks")
export const ListNumbers = /*@__PURE__*/ duotone(Ssr.ListNumbers, "ListNumbers")
export const ListPlus = /*@__PURE__*/ duotone(Ssr.ListPlus, "ListPlus")
export const Lock = /*@__PURE__*/ duotone(Ssr.Lock, "Lock")
export const Magnet = /*@__PURE__*/ duotone(Ssr.Magnet, "Magnet")
export const MagnifyingGlass = /*@__PURE__*/ duotone(
  Ssr.MagnifyingGlass,
  "MagnifyingGlass",
)
export const MapPin = /*@__PURE__*/ duotone(Ssr.MapPin, "MapPin")
export const Megaphone = /*@__PURE__*/ duotone(Ssr.Megaphone, "Megaphone")
export const Microphone = /*@__PURE__*/ duotone(Ssr.Microphone, "Microphone")
export const Minus = /*@__PURE__*/ duotone(Ssr.Minus, "Minus")
export const Monitor = /*@__PURE__*/ duotone(Ssr.Monitor, "Monitor")
export const Moon = /*@__PURE__*/ duotone(Ssr.Moon, "Moon")
export const MusicNote = /*@__PURE__*/ duotone(Ssr.MusicNote, "MusicNote")
export const MusicNotes = /*@__PURE__*/ duotone(Ssr.MusicNotes, "MusicNotes")
export const NavigationArrow = /*@__PURE__*/ duotone(
  Ssr.NavigationArrow,
  "NavigationArrow",
)
export const Newspaper = /*@__PURE__*/ duotone(Ssr.Newspaper, "Newspaper")
export const Note = /*@__PURE__*/ duotone(Ssr.Note, "Note")
export const Package = /*@__PURE__*/ duotone(Ssr.Package, "Package")
export const Palette = /*@__PURE__*/ duotone(Ssr.Palette, "Palette")
export const PaperPlaneRight = /*@__PURE__*/ duotone(
  Ssr.PaperPlaneRight,
  "PaperPlaneRight",
)
export const PaperPlaneTilt = /*@__PURE__*/ duotone(
  Ssr.PaperPlaneTilt,
  "PaperPlaneTilt",
)
export const Paperclip = /*@__PURE__*/ duotone(Ssr.Paperclip, "Paperclip")
export const Pause = /*@__PURE__*/ duotone(Ssr.Pause, "Pause")
export const PencilSimple = /*@__PURE__*/ duotone(
  Ssr.PencilSimple,
  "PencilSimple",
)
export const PencilSimpleLine = /*@__PURE__*/ duotone(
  Ssr.PencilSimpleLine,
  "PencilSimpleLine",
)
export const Percent = /*@__PURE__*/ duotone(Ssr.Percent, "Percent")
export const Phone = /*@__PURE__*/ duotone(Ssr.Phone, "Phone")
export const PhoneX = /*@__PURE__*/ duotone(Ssr.PhoneX, "PhoneX")
export const Play = /*@__PURE__*/ duotone(Ssr.Play, "Play")
export const Playlist = /*@__PURE__*/ duotone(Ssr.Playlist, "Playlist")
export const Plug = /*@__PURE__*/ duotone(Ssr.Plug, "Plug")
export const Plugs = /*@__PURE__*/ duotone(Ssr.Plugs, "Plugs")
export const Plus = /*@__PURE__*/ duotone(Ssr.Plus, "Plus")
export const PlusCircle = /*@__PURE__*/ duotone(Ssr.PlusCircle, "PlusCircle")
export const ProhibitInset = /*@__PURE__*/ duotone(
  Ssr.ProhibitInset,
  "ProhibitInset",
)
export const Pulse = /*@__PURE__*/ duotone(Ssr.Pulse, "Pulse")
export const PushPin = /*@__PURE__*/ duotone(Ssr.PushPin, "PushPin")
export const PuzzlePiece = /*@__PURE__*/ duotone(Ssr.PuzzlePiece, "PuzzlePiece")
export const Question = /*@__PURE__*/ duotone(Ssr.Question, "Question")
export const Quotes = /*@__PURE__*/ duotone(Ssr.Quotes, "Quotes")
export const Radio = /*@__PURE__*/ duotone(Ssr.Radio, "Radio")
export const Rectangle = /*@__PURE__*/ duotone(Ssr.Rectangle, "Rectangle")
export const Repeat = /*@__PURE__*/ duotone(Ssr.Repeat, "Repeat")
export const Robot = /*@__PURE__*/ duotone(Ssr.Robot, "Robot")
export const Rocket = /*@__PURE__*/ duotone(Ssr.Rocket, "Rocket")
export const Rows = /*@__PURE__*/ duotone(Ssr.Rows, "Rows")
export const Ruler = /*@__PURE__*/ duotone(Ssr.Ruler, "Ruler")
export const Scissors = /*@__PURE__*/ duotone(Ssr.Scissors, "Scissors")
export const SealCheck = /*@__PURE__*/ duotone(Ssr.SealCheck, "SealCheck")
export const ShareNetwork = /*@__PURE__*/ duotone(
  Ssr.ShareNetwork,
  "ShareNetwork",
)
export const Shield = /*@__PURE__*/ duotone(Ssr.Shield, "Shield")
export const ShieldCheck = /*@__PURE__*/ duotone(Ssr.ShieldCheck, "ShieldCheck")
export const ShieldWarning = /*@__PURE__*/ duotone(
  Ssr.ShieldWarning,
  "ShieldWarning",
)
export const ShoppingCart = /*@__PURE__*/ duotone(
  Ssr.ShoppingCart,
  "ShoppingCart",
)
export const Shuffle = /*@__PURE__*/ duotone(Ssr.Shuffle, "Shuffle")
export const Sidebar = /*@__PURE__*/ duotone(Ssr.Sidebar, "Sidebar")
export const SignOut = /*@__PURE__*/ duotone(Ssr.SignOut, "SignOut")
export const Siren = /*@__PURE__*/ duotone(Ssr.Siren, "Siren")
export const SkipBack = /*@__PURE__*/ duotone(Ssr.SkipBack, "SkipBack")
export const SkipForward = /*@__PURE__*/ duotone(Ssr.SkipForward, "SkipForward")
export const SlidersHorizontal = /*@__PURE__*/ duotone(
  Ssr.SlidersHorizontal,
  "SlidersHorizontal",
)
export const Smiley = /*@__PURE__*/ duotone(Ssr.Smiley, "Smiley")
export const Sparkle = /*@__PURE__*/ duotone(Ssr.Sparkle, "Sparkle")
export const SpeakerHigh = /*@__PURE__*/ duotone(Ssr.SpeakerHigh, "SpeakerHigh")
export const SpeakerX = /*@__PURE__*/ duotone(Ssr.SpeakerX, "SpeakerX")
export const Square = /*@__PURE__*/ duotone(Ssr.Square, "Square")
export const SquareHalf = /*@__PURE__*/ duotone(Ssr.SquareHalf, "SquareHalf")
export const SquaresFour = /*@__PURE__*/ duotone(Ssr.SquaresFour, "SquaresFour")
export const Stack = /*@__PURE__*/ duotone(Ssr.Stack, "Stack")
export const StackSimple = /*@__PURE__*/ duotone(Ssr.StackSimple, "StackSimple")
export const Star = /*@__PURE__*/ duotone(Ssr.Star, "Star")
export const Sun = /*@__PURE__*/ duotone(Ssr.Sun, "Sun")
export const Table = /*@__PURE__*/ duotone(Ssr.Table, "Table")
export const Tag = /*@__PURE__*/ duotone(Ssr.Tag, "Tag")
export const Terminal = /*@__PURE__*/ duotone(Ssr.Terminal, "Terminal")
export const TerminalWindow = /*@__PURE__*/ duotone(
  Ssr.TerminalWindow,
  "TerminalWindow",
)
export const TextAlignCenter = /*@__PURE__*/ duotone(
  Ssr.TextAlignCenter,
  "TextAlignCenter",
)
export const TextAlignLeft = /*@__PURE__*/ duotone(
  Ssr.TextAlignLeft,
  "TextAlignLeft",
)
export const TextAlignRight = /*@__PURE__*/ duotone(
  Ssr.TextAlignRight,
  "TextAlignRight",
)
export const TextB = /*@__PURE__*/ duotone(Ssr.TextB, "TextB")
export const TextHOne = /*@__PURE__*/ duotone(Ssr.TextHOne, "TextHOne")
export const TextHThree = /*@__PURE__*/ duotone(Ssr.TextHThree, "TextHThree")
export const TextHTwo = /*@__PURE__*/ duotone(Ssr.TextHTwo, "TextHTwo")
export const TextItalic = /*@__PURE__*/ duotone(Ssr.TextItalic, "TextItalic")
export const TextStrikethrough = /*@__PURE__*/ duotone(
  Ssr.TextStrikethrough,
  "TextStrikethrough",
)
export const TextSubscript = /*@__PURE__*/ duotone(
  Ssr.TextSubscript,
  "TextSubscript",
)
export const TextSuperscript = /*@__PURE__*/ duotone(
  Ssr.TextSuperscript,
  "TextSuperscript",
)
export const TextT = /*@__PURE__*/ duotone(Ssr.TextT, "TextT")
export const TextUnderline = /*@__PURE__*/ duotone(
  Ssr.TextUnderline,
  "TextUnderline",
)
export const ThumbsDown = /*@__PURE__*/ duotone(Ssr.ThumbsDown, "ThumbsDown")
export const ThumbsUp = /*@__PURE__*/ duotone(Ssr.ThumbsUp, "ThumbsUp")
export const Timer = /*@__PURE__*/ duotone(Ssr.Timer, "Timer")
export const Trash = /*@__PURE__*/ duotone(Ssr.Trash, "Trash")
export const Tray = /*@__PURE__*/ duotone(Ssr.Tray, "Tray")
export const TrendDown = /*@__PURE__*/ duotone(Ssr.TrendDown, "TrendDown")
export const TrendUp = /*@__PURE__*/ duotone(Ssr.TrendUp, "TrendUp")
export const UploadSimple = /*@__PURE__*/ duotone(
  Ssr.UploadSimple,
  "UploadSimple",
)
export const User = /*@__PURE__*/ duotone(Ssr.User, "User")
export const UserCircle = /*@__PURE__*/ duotone(Ssr.UserCircle, "UserCircle")
export const Users = /*@__PURE__*/ duotone(Ssr.Users, "Users")
export const VideoCamera = /*@__PURE__*/ duotone(Ssr.VideoCamera, "VideoCamera")
export const Warning = /*@__PURE__*/ duotone(Ssr.Warning, "Warning")
export const WarningCircle = /*@__PURE__*/ duotone(
  Ssr.WarningCircle,
  "WarningCircle",
)
export const Wheelchair = /*@__PURE__*/ duotone(Ssr.Wheelchair, "Wheelchair")
export const Wrench = /*@__PURE__*/ duotone(Ssr.Wrench, "Wrench")
export const X = /*@__PURE__*/ duotone(Ssr.X, "X")
export const XCircle = /*@__PURE__*/ duotone(Ssr.XCircle, "XCircle")
