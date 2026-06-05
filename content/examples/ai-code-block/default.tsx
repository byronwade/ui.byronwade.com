"use client"

import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@/components/ai-elements/code-block"

const code = `import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function summarize(input: string) {
  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: \`Summarize: \${input}\`,
  });

  return text;
}`

export default function Example() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <CodeBlock code={code} language="ts" showLineNumbers>
          <CodeBlockCopyButton
            onCopy={() => console.log("Copied to clipboard")}
            onError={() => console.error("Failed to copy")}
          />
        </CodeBlock>
      </div>
    </div>
  )
}
