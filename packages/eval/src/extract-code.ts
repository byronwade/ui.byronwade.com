const FENCE = /```(?:tsx|jsx|ts|js)?\s*\n([\s\S]*?)```/;

/** First fenced code block's inner text (trimmed), or null if none. */
export function extractCode(response: string): string | null {
  const m = response.match(FENCE);
  return m ? m[1].replace(/\s+$/, "").replace(/^\n+/, "") : null;
}
