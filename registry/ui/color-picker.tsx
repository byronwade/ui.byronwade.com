/**
 * Adapted for byronwade/ui from kibo-ui.
 * Original code, concept, and design © kibo-ui — https://www.kibo-ui.com
 * Reworked to the byronwade/ui design system (tokens, Base UI sliders, data-slot).
 */
"use client"

import Color from "color"
import { Eyedropper } from "@/lib/icons"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import {
  type ComponentProps,
  createContext,
  type HTMLAttributes,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Overall-scale presets: the saturation field's floor height, its drag handle,
// the hue/alpha rails (container + track + thumb), the eyedropper button, and
// the readout text all step together. `default` reproduces the original dims.
type ColorPickerSize = "sm" | "default" | "lg"

const cpSize: Record<
  ColorPickerSize,
  {
    field: string
    pointer: string
    rail: string
    track: string
    thumb: string
    button: string
    text: string
  }
> = {
  sm: {
    field: "min-h-32",
    pointer: "h-3 w-3",
    rail: "h-3",
    track: "h-2",
    thumb: "size-3",
    button: "size-7",
    text: "text-xs",
  },
  default: {
    field: "min-h-40",
    pointer: "h-4 w-4",
    rail: "h-4",
    track: "h-3",
    thumb: "size-4",
    button: "size-8",
    text: "text-sm",
  },
  lg: {
    field: "min-h-52",
    pointer: "h-5 w-5",
    rail: "h-5",
    track: "h-4",
    thumb: "size-5",
    button: "size-9",
    text: "text-base",
  },
}

type ColorPickerContextValue = {
  hue: number
  saturation: number
  lightness: number
  alpha: number
  mode: string
  setHue: (hue: number) => void
  setSaturation: (saturation: number) => void
  setLightness: (lightness: number) => void
  setAlpha: (alpha: number) => void
  setMode: (mode: string) => void
  size: ColorPickerSize
}

const ColorPickerContext = createContext<ColorPickerContextValue | undefined>(
  undefined,
)

export const useColorPicker = () => {
  const context = useContext(ColorPickerContext)

  if (!context) {
    throw new Error("useColorPicker must be used within a ColorPickerProvider")
  }

  return context
}

export type ColorPickerProps = HTMLAttributes<HTMLDivElement> & {
  value?: Parameters<typeof Color>[0]
  defaultValue?: Parameters<typeof Color>[0]
  onChange?: (value: Parameters<typeof Color.rgb>[0]) => void
  size?: ColorPickerSize
}

export const ColorPicker = ({
  value,
  defaultValue = "#000000",
  onChange,
  size = "default",
  className,
  ...props
}: ColorPickerProps) => {
  const selectedColor = Color(value)
  const defaultColor = Color(defaultValue)

  const [hue, setHue] = useState(selectedColor.hue() || defaultColor.hue() || 0)
  const [saturation, setSaturation] = useState(
    selectedColor.saturationl() || defaultColor.saturationl() || 100,
  )
  const [lightness, setLightness] = useState(
    selectedColor.lightness() || defaultColor.lightness() || 50,
  )
  const [alpha, setAlpha] = useState(
    selectedColor.alpha() * 100 || defaultColor.alpha() * 100,
  )
  const [mode, setMode] = useState("hex")

  // Update color when controlled value changes
  useEffect(() => {
    if (value) {
      const color = Color.rgb(value).rgb().object()

      setHue(color.r)
      setSaturation(color.g)
      setLightness(color.b)
      setAlpha(color.a)
    }
  }, [value])

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      const color = Color.hsl(hue, saturation, lightness).alpha(alpha / 100)
      const rgba = color.rgb().array()

      onChange([rgba[0], rgba[1], rgba[2], alpha / 100])
    }
  }, [hue, saturation, lightness, alpha, onChange])

  return (
    <ColorPickerContext.Provider
      value={{
        hue,
        saturation,
        lightness,
        alpha,
        mode,
        setHue,
        setSaturation,
        setLightness,
        setAlpha,
        setMode,
        size,
      }}
    >
      <div
        data-slot="color-picker"
        className={cn("flex size-full flex-col gap-4", className)}
        {...props}
      />
    </ColorPickerContext.Provider>
  )
}

export type ColorPickerSelectionProps = HTMLAttributes<HTMLDivElement>

export const ColorPickerSelection = memo(
  ({ className, ...props }: ColorPickerSelectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [positionX, setPositionX] = useState(0)
    const [positionY, setPositionY] = useState(0)
    const { hue, setSaturation, setLightness, size } = useColorPicker()

    // The 2D field IS the saturation/lightness spectrum — these literal colors
    // are the thing being illustrated (the DNA color-exception), not chrome.
    const backgroundGradient = useMemo(() => {
      return `linear-gradient(0deg, rgba(0,0,0,1), rgba(0,0,0,0)),
            linear-gradient(90deg, rgba(255,255,255,1), rgba(255,255,255,0)),
            hsl(${hue}, 100%, 50%)`
    }, [hue])

    const handlePointerMove = useCallback(
      (event: PointerEvent) => {
        if (!(isDragging && containerRef.current)) {
          return
        }
        const rect = containerRef.current.getBoundingClientRect()
        const x = Math.max(
          0,
          Math.min(1, (event.clientX - rect.left) / rect.width),
        )
        const y = Math.max(
          0,
          Math.min(1, (event.clientY - rect.top) / rect.height),
        )
        setPositionX(x)
        setPositionY(y)
        setSaturation(x * 100)
        const topLightness = x < 0.01 ? 100 : 50 + 50 * (1 - x)
        const lightness = topLightness * (1 - y)

        setLightness(lightness)
      },
      [isDragging, setSaturation, setLightness],
    )

    useEffect(() => {
      const handlePointerUp = () => setIsDragging(false)

      if (isDragging) {
        window.addEventListener("pointermove", handlePointerMove)
        window.addEventListener("pointerup", handlePointerUp)
      }

      return () => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
      }
    }, [isDragging, handlePointerMove])

    return (
      <div
        data-slot="color-picker-selection"
        className={cn(
          "relative size-full cursor-crosshair rounded-sm",
          cpSize[size].field,
          className,
        )}
        onPointerDown={(e) => {
          e.preventDefault()
          setIsDragging(true)
          handlePointerMove(e.nativeEvent)
        }}
        ref={containerRef}
        style={{
          background: backgroundGradient,
        }}
        {...props}
      >
        {/* Pointer cursor: a background-colored ring with a foreground halo so it
            stays readable over any hue while resolving from tokens (dark-mode safe). */}
        <div
          data-slot="color-picker-selection-pointer"
          className={cn(
            "-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute rounded-full border-2 border-background ring-1 ring-foreground/50",
            cpSize[size].pointer,
          )}
          style={{
            left: `${positionX * 100}%`,
            top: `${positionY * 100}%`,
          }}
        />
      </div>
    )
  },
)

ColorPickerSelection.displayName = "ColorPickerSelection"

export type ColorPickerHueProps = ComponentProps<typeof SliderPrimitive.Root>

export const ColorPickerHue = ({
  className,
  ...props
}: ColorPickerHueProps) => {
  const { hue, setHue, size } = useColorPicker()

  return (
    <SliderPrimitive.Root
      data-slot="color-picker-hue"
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        cpSize[size].rail,
        className,
      )}
      max={360}
      onValueChange={(value) => setHue(Array.isArray(value) ? value[0] : value)}
      step={1}
      value={[hue]}
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="color-picker-hue-control"
        className="flex w-full items-center"
      >
        {/* The rainbow IS the hue spectrum — `color-picker-hue` is the foundation
            utility that holds the raw-color exception in one audited place. */}
        <SliderPrimitive.Track
          data-slot="color-picker-hue-track"
          className={cn(
            "color-picker-hue relative w-full grow rounded-full",
            cpSize[size].track,
          )}
        >
          <SliderPrimitive.Thumb
            aria-label="Hue"
            data-slot="color-picker-hue-thumb"
            className={cn(
              "rounded-full border border-primary/50 bg-background outline-none transition-[box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50",
              cpSize[size].thumb,
            )}
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export type ColorPickerAlphaProps = ComponentProps<typeof SliderPrimitive.Root>

export const ColorPickerAlpha = ({
  className,
  ...props
}: ColorPickerAlphaProps) => {
  const { alpha, setAlpha, size } = useColorPicker()

  return (
    <SliderPrimitive.Root
      data-slot="color-picker-alpha"
      className={cn(
        "relative flex w-full touch-none items-center select-none",
        cpSize[size].rail,
        className,
      )}
      max={100}
      onValueChange={(value) =>
        setAlpha(Array.isArray(value) ? value[0] : value)
      }
      step={1}
      value={[alpha]}
      {...props}
    >
      <SliderPrimitive.Control
        data-slot="color-picker-alpha-control"
        className="flex w-full items-center"
      >
        {/* The checkerboard IS the transparency illustration — DNA exception. */}
        <SliderPrimitive.Track
          data-slot="color-picker-alpha-track"
          className={cn(
            "relative w-full grow rounded-full bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAMUlEQVQ4T2NkYGAQYcAP3uCTZhw1gGGYhAGBZIA/nYDCgBDAm9BGDWAAJyRCgLaBCAAgXwixzAS0pgAAAABJRU5ErkJggg==')] bg-center bg-repeat-x dark:bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAALklEQVR4nGP8+vWrCAMewM3N/QafPBM+SWLAqAGDwQBGQgoIpZOB98KoAVQwAADxzQcSVIRCfQAAAABJRU5ErkJggg==')]",
            cpSize[size].track,
          )}
        >
          <div className="color-picker-alpha-fade absolute inset-0 rounded-full" />
          <SliderPrimitive.Thumb
            aria-label="Alpha"
            data-slot="color-picker-alpha-thumb"
            className={cn(
              "rounded-full border border-primary/50 bg-background outline-none transition-[box-shadow] focus-visible:ring-3 focus-visible:ring-ring/50",
              cpSize[size].thumb,
            )}
          />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export type ColorPickerEyeDropperProps = ComponentProps<typeof Button>

export const ColorPickerEyeDropper = ({
  className,
  ...props
}: ColorPickerEyeDropperProps) => {
  const { setHue, setSaturation, setLightness, setAlpha, size } =
    useColorPicker()

  const handleEyeDropper = async () => {
    try {
      // @ts-expect-error - EyeDropper API is experimental
      const eyeDropper = new EyeDropper()
      const result = await eyeDropper.open()
      const color = Color(result.sRGBHex)
      const [h, s, l] = color.hsl().array()

      setHue(h)
      setSaturation(s)
      setLightness(l)
      setAlpha(100)
    } catch (error) {
      console.error("EyeDropper failed:", error)
    }
  }

  return (
    <Button
      aria-label="Pick a color from the screen"
      className={cn(
        "shrink-0 text-muted-foreground",
        cpSize[size].button,
        className,
      )}
      onClick={handleEyeDropper}
      size="icon"
      type="button"
      variant="outline"
      {...props}
    >
      <Eyedropper size={16} />
    </Button>
  )
}

export type ColorPickerOutputProps = ComponentProps<typeof SelectTrigger>

const formats = ["hex", "rgb", "css", "hsl"]

export const ColorPickerOutput = ({
  className,
  ...props
}: ColorPickerOutputProps) => {
  const { mode, setMode, size } = useColorPicker()

  return (
    <Select onValueChange={(value) => setMode(value ?? "hex")} value={mode}>
      <SelectTrigger
        aria-label="Color format"
        data-slot="color-picker-output"
        className={cn("h-8 w-20 shrink-0", cpSize[size].text, className)}
        {...props}
      >
        <SelectValue placeholder="Mode" />
      </SelectTrigger>
      <SelectContent>
        {formats.map((format) => (
          <SelectItem className="text-xs" key={format} value={format}>
            {format.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type PercentageInputProps = ComponentProps<typeof Input>

const PercentageInput = ({ className, ...props }: PercentageInputProps) => {
  return (
    <div className="relative">
      <Input
        aria-label="Alpha percentage"
        readOnly
        type="text"
        {...props}
        className={cn(
          "h-8 w-[3.25rem] rounded-l-none bg-secondary px-2 font-mono text-xs shadow-none",
          className,
        )}
      />
      <span className="-translate-y-1/2 absolute top-1/2 right-2 font-mono text-xs text-muted-foreground">
        %
      </span>
    </div>
  )
}

export type ColorPickerFormatProps = HTMLAttributes<HTMLDivElement>

export const ColorPickerFormat = ({
  className,
  ...props
}: ColorPickerFormatProps) => {
  const { hue, saturation, lightness, alpha, mode } = useColorPicker()
  const color = Color.hsl(hue, saturation, lightness, alpha / 100)

  if (mode === "hex") {
    const hex = color.hex()

    return (
      <div
        data-slot="color-picker-format"
        className={cn(
          "-space-x-px relative flex w-full items-center rounded-md",
          className,
        )}
        {...props}
      >
        <Input
          aria-label="Hex value"
          className="h-8 rounded-r-none bg-secondary px-2 font-mono text-xs shadow-none"
          readOnly
          type="text"
          value={hex}
        />
        <PercentageInput value={alpha} />
      </div>
    )
  }

  if (mode === "rgb") {
    const rgb = color
      .rgb()
      .array()
      .map((value) => Math.round(value))

    return (
      <div
        data-slot="color-picker-format"
        className={cn("-space-x-px flex items-center rounded-md", className)}
        {...props}
      >
        {rgb.map((value, index) => (
          <Input
            aria-label={["Red", "Green", "Blue"][index]}
            className={cn(
              "h-8 rounded-r-none bg-secondary px-2 font-mono text-xs shadow-none",
              index && "rounded-l-none",
              className,
            )}
            key={index}
            readOnly
            type="text"
            value={value}
          />
        ))}
        <PercentageInput value={alpha} />
      </div>
    )
  }

  if (mode === "css") {
    const rgb = color
      .rgb()
      .array()
      .map((value) => Math.round(value))

    return (
      <div
        data-slot="color-picker-format"
        className={cn("w-full rounded-md", className)}
        {...props}
      >
        <Input
          aria-label="CSS color value"
          className="h-8 w-full bg-secondary px-2 font-mono text-xs shadow-none"
          readOnly
          type="text"
          value={`rgba(${rgb.join(", ")}, ${alpha}%)`}
          {...props}
        />
      </div>
    )
  }

  if (mode === "hsl") {
    const hsl = color
      .hsl()
      .array()
      .map((value) => Math.round(value))

    return (
      <div
        data-slot="color-picker-format"
        className={cn("-space-x-px flex items-center rounded-md", className)}
        {...props}
      >
        {hsl.map((value, index) => (
          <Input
            aria-label={["Hue", "Saturation", "Lightness"][index]}
            className={cn(
              "h-8 rounded-r-none bg-secondary px-2 font-mono text-xs shadow-none",
              index && "rounded-l-none",
              className,
            )}
            key={index}
            readOnly
            type="text"
            value={value}
          />
        ))}
        <PercentageInput value={alpha} />
      </div>
    )
  }

  return null
}
