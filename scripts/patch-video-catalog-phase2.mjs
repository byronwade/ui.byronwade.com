/**
 * One-shot catalog patch: Video tier tags, UI recategorization, props rows.
 * Run: node scripts/patch-video-catalog-phase2.mjs
 */
import fs from "node:fs"

const path = "content/components.ts"
let src = fs.readFileSync(path, "utf8")

const tierBySlug = {
  thumbnail: "tier:simple",
  "verified-badge": "tier:simple",
  "live-badge": "tier:simple",
  "subscribe-button": "tier:simple",
  "chip-bar": "tier:intermediate",
  "action-rail": "tier:simple",
  "video-card": "tier:intermediate",
  "video-shelf": "tier:intermediate",
  "channel-header": "tier:intermediate",
  "up-next-item": "tier:intermediate",
  "channel-byline": "tier:simple",
  "engagement-bar": "tier:intermediate",
  "description-box": "tier:simple",
  comment: "tier:intermediate",
  "comment-composer": "tier:intermediate",
  "shorts-player": "tier:advanced",
  "mini-player": "tier:simple",
  "chapter-list": "tier:advanced",
  "playback-menu": "tier:intermediate",
  "studio-video-row": "tier:advanced",
  "upload-row": "tier:advanced",
  "comment-moderation-row": "tier:advanced",
}

const categoryBySlug = {
  thumbnail: "UI",
  "chip-bar": "UI",
}

const propsBySlug = {
  thumbnail: [
    {
      name: "src",
      type: "string",
      description: "Thumbnail image URL.",
    },
    {
      name: "duration",
      type: "string",
      description: "Optional duration pill label (e.g. 12:34).",
    },
    {
      name: "progress",
      type: "number",
      description: "Watched progress 0–100 for the bottom bar.",
    },
    {
      name: "live",
      type: "boolean",
      description: "Show the LIVE chip overlay.",
    },
  ],
  "verified-badge": [
    {
      name: "variant",
      type: '"default" | "artist"',
      default: "default",
      description: "Check-seal vs music-artist seal.",
    },
    {
      name: "size",
      type: '"sm" | "md"',
      default: "sm",
      description: "Icon size.",
    },
  ],
  "live-badge": [
    {
      name: "viewers",
      type: "number",
      description: "Concurrent viewers; compact-formatted when set.",
    },
    {
      name: "pulse",
      type: "boolean",
      default: "true",
      description: "Animate the live dot.",
    },
  ],
  "subscribe-button": [
    {
      name: "subscribed",
      type: "boolean",
      description: "Controlled subscribed state.",
    },
    {
      name: "defaultSubscribed",
      type: "boolean",
      description: "Initial subscribed state when uncontrolled.",
    },
    {
      name: "onSubscribedChange",
      type: "(next: boolean) => void",
      description: "Fired when subscribe state toggles.",
    },
  ],
  "chip-bar": [
    {
      name: "options",
      type: "string[]",
      description: "Filter chip labels.",
    },
    {
      name: "value",
      type: "string",
      description: "Controlled selected chip.",
    },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Fired when selection changes.",
    },
  ],
  "action-rail": [
    {
      name: "actions",
      type: "ActionRailItem[]",
      description: "Icon buttons with optional counts.",
    },
    {
      name: "variant",
      type: '"default" | "overlay"',
      default: "default",
      description: "Surface style for Shorts overlay vs inline.",
    },
  ],
  "video-card": [
    { name: "title", type: "string", description: "Video title." },
    {
      name: "channelName",
      type: "string",
      description: "Channel display name.",
    },
    {
      name: "thumbnailSrc",
      type: "string",
      description: "Poster image URL.",
    },
    { name: "views", type: "number", description: "View count for meta line." },
    {
      name: "menuItems",
      type: "OverflowMenuItem[]",
      description: "Overflow ⋮ menu entries.",
    },
  ],
  "video-shelf": [
    {
      name: "title",
      type: "ReactNode",
      description: "Optional shelf heading.",
    },
    {
      name: "action",
      type: "ReactNode",
      description: "Trailing header action.",
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Horizontally-scrolling tiles.",
    },
  ],
  "channel-header": [
    { name: "name", type: "string", description: "Channel display name." },
    {
      name: "subscribed",
      type: "boolean",
      description: "Controlled subscribe state for SubscribeButton.",
    },
    {
      name: "tabs",
      type: "{ value: string; label: string }[]",
      description: "Optional section tabs under the header.",
    },
  ],
  "up-next-item": [
    { name: "title", type: "string", description: "Video title." },
    { name: "channelName", type: "string", description: "Channel name." },
    { name: "thumbnailSrc", type: "string", description: "Poster URL." },
  ],
  "channel-byline": [
    { name: "name", type: "string", description: "Channel name." },
    {
      name: "subscriberCount",
      type: "number",
      description: "Compact subscriber count.",
    },
    { name: "verified", type: "boolean", description: "Show verified badge." },
  ],
  "engagement-bar": [
    {
      name: "like",
      type: "ToggleState",
      description:
        "Grouped like toggle `{ value, defaultValue, onValueChange }`.",
    },
    {
      name: "dislike",
      type: "ToggleState",
      description: "Grouped dislike toggle.",
    },
    {
      name: "save",
      type: "ToggleState",
      description: "Grouped save/watch-later toggle.",
    },
    {
      name: "likeCount",
      type: "number",
      description: "Compact like count beside thumbs-up.",
    },
  ],
  "description-box": [
    { name: "views", type: "number", description: "View count in the header." },
    {
      name: "publishedAt",
      type: "string",
      description: "Relative or absolute date.",
    },
    {
      name: "children",
      type: "ReactNode",
      description: "Description body (collapsible).",
    },
  ],
  comment: [
    { name: "author", type: "string", description: "Commenter display name." },
    { name: "body", type: "string", description: "Comment text." },
    { name: "likes", type: "number", description: "Like count." },
    { name: "pinned", type: "boolean", description: "Show pinned badge." },
  ],
  "comment-composer": [
    { name: "value", type: "string", description: "Controlled comment text." },
    {
      name: "onValueChange",
      type: "(value: string) => void",
      description: "Fired as the user types.",
    },
    {
      name: "open",
      type: "boolean",
      description: "Controlled expanded state (action row visible).",
    },
    {
      name: "onOpenChange",
      type: "(open: boolean) => void",
      description: "Fired when expanded state changes.",
    },
  ],
  "shorts-player": [
    {
      name: "author",
      type: "ShortsAuthor",
      description: "Required author identity.",
    },
    { name: "src", type: "string", description: "Video source URL." },
    {
      name: "like",
      type: "ToggleState",
      description: "Grouped like toggle for the action rail.",
    },
    {
      name: "play",
      type: "ToggleState",
      description: "Grouped play/pause for built-in video.",
    },
    {
      name: "caption",
      type: "ReactNode",
      description: "Bottom caption overlay.",
    },
  ],
  "mini-player": [
    { name: "title", type: "string", description: "Now-playing title." },
    {
      name: "playing",
      type: "boolean",
      description: "Controlled play state.",
    },
    {
      name: "onPlayingChange",
      type: "(playing: boolean) => void",
      description: "Fired when play toggles.",
    },
  ],
  "chapter-list": [
    {
      name: "chapters",
      type: "Chapter[]",
      description: "Timestamped chapter entries.",
    },
    {
      name: "currentTime",
      type: "number",
      description: "Playhead seconds for active chapter.",
    },
  ],
  "playback-menu": [
    {
      name: "groups",
      type: "PlaybackMenuGroup[]",
      description: "Quality, speed, subtitles setting groups.",
    },
  ],
  "studio-video-row": [
    { name: "title", type: "string", description: "Video title." },
    {
      name: "visibility",
      type: '"public" | "unlisted" | "private" | "draft" | "scheduled"',
      description: "Studio visibility status.",
    },
    {
      name: "selected",
      type: "boolean",
      description: "Controlled row selection checkbox.",
    },
  ],
  "upload-row": [
    { name: "filename", type: "string", description: "Upload file name." },
    {
      name: "progress",
      type: "number",
      description: "Processing progress 0–100.",
    },
    {
      name: "status",
      type: "string",
      description: "Upload/processing status label.",
    },
  ],
  "comment-moderation-row": [
    { name: "author", type: "string", description: "Commenter name." },
    { name: "body", type: "string", description: "Comment text." },
    {
      name: "status",
      type: "string",
      description: "Moderation status tag.",
    },
  ],
}

function formatProps(props) {
  const lines = props.map((p) => {
    const typeLiteral = p.type.includes('"') ? `'${p.type}'` : `"${p.type}"`
    const parts = [`      name: "${p.name}"`, `      type: ${typeLiteral}`]
    if (p.default) parts.push(`      default: "${p.default}"`)
    parts.push(`      description: "${p.description}"`)
    return `    {\n${parts.join(",\n")},\n    }`
  })
  return `    props: [\n${lines.join(",\n")},\n    ],`
}

for (const [slug, tier] of Object.entries(tierBySlug)) {
  const slugPattern = new RegExp(
    `(\\{\\s*\\n\\s*slug: "${slug}",[\\s\\S]*?tags: \\[)([^\\]]*)(\\],)`,
  )
  src = src.replace(slugPattern, (match, head, tags, tail) => {
    const tagList = tags
      .split(",")
      .map((t) => t.trim().replace(/"/g, ""))
      .filter(Boolean)
    if (!tagList.includes(tier)) tagList.push(tier)
    const nextTags = tagList.map((t) => `"${t}"`).join(", ")
    return `${head}${nextTags}${tail}`
  })

  if (categoryBySlug[slug]) {
    src = src.replace(
      new RegExp(`(slug: "${slug}",[\\s\\S]*?category: )"Video"`),
      `$1"${categoryBySlug[slug]}"`,
    )
  }

  if (propsBySlug[slug]) {
    const hasProps = new RegExp(`slug: "${slug}",[\\s\\S]*?props:`).test(src)
    if (!hasProps) {
      const propsBlock = formatProps(propsBySlug[slug])
      src = src.replace(
        new RegExp(
          `(slug: "${slug}",[\\s\\S]*?tags: \\[[^\\]]+\\],\\n)(    registryDeps:|    npmDeps:|    examples:)`,
        ),
        `$1${propsBlock}\n$2`,
      )
    }
  }
}

fs.writeFileSync(path, src)
console.log("✓ patched video catalog metadata (tiers, categories, props)")
