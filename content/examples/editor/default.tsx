"use client"

import {
  EditorBubbleMenu,
  EditorCharacterCount,
  EditorClearFormatting,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorNodeBulletList,
  EditorNodeCode,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeText,
  EditorProvider,
} from "@/components/ui/editor"

const content = `
<h2>byronwade/ui editor</h2>
<p>This is a <strong>Tiptap</strong> rich-text editor adapted to the byronwade design system. Select some text to reveal the bubble menu, or type <code>/</code> for the slash command menu.</p>
<ul>
  <li>Tokenized colors — re-skins for free in dark mode</li>
  <li>House primitives — Button, Command, Popover, Tooltip</li>
</ul>
<blockquote>Hierarchy comes from size and tracking, not weight.</blockquote>
`

export default function Example() {
  return (
    <div className="relative w-full max-w-2xl rounded-xl border border-border bg-card p-6">
      <EditorProvider
        className="prose prose-sm max-w-none focus:outline-none dark:prose-invert"
        content={content}
        limit={2000}
        placeholder="Write something, or press / for commands…"
      >
        <EditorBubbleMenu>
          <EditorNodeText />
          <EditorNodeHeading1 />
          <EditorNodeHeading2 />
          <EditorNodeBulletList />
          <EditorNodeOrderedList />
          <EditorNodeQuote />
          <EditorNodeCode />
          <EditorFormatBold hideName />
          <EditorFormatItalic hideName />
          <EditorFormatStrike hideName />
          <EditorFormatCode hideName />
          <EditorClearFormatting hideName />
        </EditorBubbleMenu>
        <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
      </EditorProvider>
    </div>
  )
}
