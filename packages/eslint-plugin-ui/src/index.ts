import { onSystem } from "./rule.js"

const plugin = {
  meta: { name: "@byronwade/eslint-plugin-ui", version: "0.1.0" },
  rules: { "on-system": onSystem },
  configs: {} as Record<string, unknown>,
}

plugin.configs.recommended = {
  plugins: { "byronwade-ui": plugin },
  rules: { "byronwade-ui/on-system": "error" },
}

export default plugin
