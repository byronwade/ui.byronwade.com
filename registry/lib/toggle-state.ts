import { useControllableState } from "@/lib/controllable-state"

type ToggleState = {
  value?: boolean
  defaultValue?: boolean
  onValueChange?: (next: boolean) => void
}

type LegacyToggleProps = {
  value?: boolean
  defaultValue?: boolean
  onValueChange?: (next: boolean) => void
}

function useToggleState(
  grouped: ToggleState | undefined,
  legacy: LegacyToggleProps,
  fallbackDefault = false,
) {
  const source = grouped ?? legacy
  return useControllableState({
    prop: source.value,
    defaultProp: source.defaultValue ?? fallbackDefault,
    onChange: source.onValueChange,
  })
}

export { useToggleState }
export type { ToggleState, LegacyToggleProps }
