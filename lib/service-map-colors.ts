const SERVICE_TOKENS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const

export function getServiceLegendColor(
  serviceName: string,
  services: string[],
): string {
  const serviceIndex = services.indexOf(serviceName)
  return SERVICE_TOKENS[
    (serviceIndex >= 0 ? serviceIndex : 0) % SERVICE_TOKENS.length
  ]
}
