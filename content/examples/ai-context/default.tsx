"use client";

import {
  Context,
  ContextCacheUsage,
  ContextContent,
  ContextContentBody,
  ContextContentFooter,
  ContextContentHeader,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextTrigger,
} from "@/components/ai-elements/context";

export default function Example() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <Context
        maxTokens={1_000_000}
        modelId="anthropic:claude-sonnet-4"
        usage={{
          inputTokens: 32_500,
          outputTokens: 8_200,
          reasoningTokens: 1_400,
          cachedInputTokens: 12_000,
          totalTokens: 54_100,
          inputTokenDetails: {
            noCacheTokens: 20_500,
            cacheReadTokens: 12_000,
            cacheWriteTokens: 0,
          },
          outputTokenDetails: {
            textTokens: 6_800,
            reasoningTokens: 1_400,
          },
        }}
        usedTokens={54_100}
      >
        <ContextTrigger />
        <ContextContent>
          <ContextContentHeader />
          <ContextContentBody>
            <div className="space-y-2">
              <ContextInputUsage />
              <ContextOutputUsage />
              <ContextReasoningUsage />
              <ContextCacheUsage />
            </div>
          </ContextContentBody>
          <ContextContentFooter />
        </ContextContent>
      </Context>
    </div>
  );
}
