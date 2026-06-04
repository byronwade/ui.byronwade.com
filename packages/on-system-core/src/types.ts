export type DetectorId =
  | "raw-color" | "arbitrary-value" | "hand-rolled" | "off-system-component" | "typography";
export type Severity = "error" | "warn";

export interface Fix { range: [number, number]; text: string; }

export interface Violation {
  detector: DetectorId;
  range: [number, number];   // absolute char offsets into the source
  message: string;
  severity: Severity;
  fix?: Fix;
}

export interface DetectOptions {
  /** Max OKLCH (oklab Euclidean) distance for nearest-token autofix. Above this, suggest only. */
  maxColorDistance?: number;             // default 0.1
  offSystemComponents?: "warn" | "error" | "off";  // default "warn"
}

export interface Manifest {
  /** Base color tokens with concrete oklch values, for nearest-token mapping. */
  colorValues: Record<string, { light: string; dark: string }>;
  /** All valid color token names (e.g. "brand","success","dock-active") for bg-/text- validity. */
  colorTokens: string[];
  /** House utility class names (no leading dot): "bg-grid","glow-brand",... */
  utilities: string[];
  /** Registry component slugs: "button","input",... */
  components: string[];
  /** Native element -> primitive component name. */
  nativeToComponent: Record<string, string>;
}
