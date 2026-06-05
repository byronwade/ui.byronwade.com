import type { Rule } from "eslint"
import { detect } from "@byronwade/on-system-core"

export const onSystem: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce byronwade/ui tokens, utilities, and primitives.",
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          maxColorDistance: { type: "number" },
          offSystemComponents: { enum: ["warn", "error", "off"] },
        },
        additionalProperties: false,
      },
    ],
    messages: { offSystem: "{{message}}" },
  },
  create(context) {
    const options = (context.options[0] ?? {}) as Record<string, unknown>
    // Report inside a Program handler so reports are flushed during traversal
    // (reporting directly in create() before returning visitors is not reliable).
    return {
      Program() {
        const sc = context.sourceCode
        for (const v of detect(sc.getText(), options)) {
          context.report({
            loc: {
              start: sc.getLocFromIndex(v.range[0]),
              end: sc.getLocFromIndex(v.range[1]),
            },
            messageId: "offSystem",
            data: { message: v.message },
            fix: v.fix
              ? (fixer) => fixer.replaceTextRange(v.fix!.range, v.fix!.text)
              : null,
          })
        }
      },
    }
  },
}
