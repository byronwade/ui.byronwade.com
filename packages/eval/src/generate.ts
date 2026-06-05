import Anthropic from "@anthropic-ai/sdk"
import type { Condition } from "./types.js"

export interface CompleteRequest {
  system: string
  user: string
  cacheSystem: boolean
}
export interface AnthropicClient {
  complete(req: CompleteRequest): Promise<string>
}

const BASELINE_SYSTEM =
  "You are an expert React + Tailwind CSS engineer. Build production-quality UI as a single self-contained .tsx component. Return the component in one ```tsx code block."

/** Build the system prompt + cache flag for a condition. `ruleText` is the shipped rule. */
export function buildSystem(
  condition: Condition,
  ruleText: string,
): { system: string; cacheSystem: boolean } {
  if (condition === "with-rule") {
    return {
      system: `${ruleText}\n\n---\nBuild the requested UI as a single self-contained .tsx component, following the rules above. Return it in one \`\`\`tsx code block.`,
      cacheSystem: true,
    }
  }
  return { system: BASELINE_SYSTEM, cacheSystem: false }
}

/** Real Anthropic-backed client. Only used by the live CLI path. */
export function makeAnthropicClient(
  apiKey: string,
  model: string,
): AnthropicClient {
  const sdk = new Anthropic({ apiKey })
  return {
    async complete({ system, user, cacheSystem }) {
      const systemBlocks = [
        cacheSystem
          ? {
              type: "text" as const,
              text: system,
              cache_control: { type: "ephemeral" as const },
            }
          : { type: "text" as const, text: system },
      ]
      const msg = await sdk.messages.create({
        model,
        max_tokens: 4096,
        temperature: 0,
        system: systemBlocks,
        messages: [{ role: "user", content: user }],
      })
      return msg.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n")
    },
  }
}
