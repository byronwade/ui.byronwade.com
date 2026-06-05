import { detect } from "@byronwade/on-system-core"

function lineColOf(code: string, index: number): { line: number; col: number } {
  let line = 1,
    col = 1
  for (let i = 0; i < index && i < code.length; i++) {
    if (code[i] === "\n") {
      line++
      col = 1
    } else col++
  }
  return { line, col }
}

export function checkOnSystem(args: {
  code: string
  offSystemComponents?: "warn" | "error" | "off"
}): string {
  let violations
  try {
    violations = detect(args.code, {
      offSystemComponents: args.offSystemComponents ?? "error",
    })
  } catch {
    return "Could not parse the snippet as TSX/JSX."
  }
  if (violations.length === 0) return "✓ On-system: 0 violations."
  const lines = violations.map((v) => {
    const { line, col } = lineColOf(args.code, v.range[0])
    return `- [${v.detector}] line ${line}, col ${col}: ${v.message}`
  })
  return `${violations.length} violation(s):\n${lines.join("\n")}`
}
