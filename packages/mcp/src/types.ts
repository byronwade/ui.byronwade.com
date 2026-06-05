export interface ComponentEntry {
  name: string
  type: string
  description: string
  deps: string[]
  install: string
  source: string
}
export interface McpData {
  components: ComponentEntry[]
  rule: string
  tokens: Record<string, { light: string; dark: string }>
  utilities: string[]
}
