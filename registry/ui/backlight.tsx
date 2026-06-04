/**
 * Adapted for byronwade/ui from MagicUI.
 * Original code, concept, and design © MagicUI — https://magicui.design
 * Reworked to the byronwade/ui design system: `cn()` + `className` passthrough
 * and a `data-slot` hook. The glow is a saturated blur of the child's own
 * pixels (SVG filter), so it inherits whatever token colors the child uses —
 * no raw color, dark mode for free.
 */
import { useId, type ReactElement } from "react";

import { cn } from "@/lib/utils";

type BacklightProps = {
  children?: ReactElement;
  className?: string;
  /** Gaussian blur radius for the backlight glow. */
  blur?: number;
};

export function Backlight({ blur = 20, children, className }: BacklightProps) {
  const id = useId();

  return (
    <div data-slot="backlight" className={cn(className)}>
      <svg width="0" height="0" aria-hidden="true">
        <filter id={id} y="-50%" x="-50%" width="200%" height="200%">
          <feGaussianBlur
            in="SourceGraphic"
            stdDeviation={blur}
            result="blurred"
          />
          <feColorMatrix type="saturate" in="blurred" values="4" />
          <feComposite in="SourceGraphic" operator="over" />
        </filter>
      </svg>

      <div data-slot="backlight-content" style={{ filter: `url(#${id})` }}>
        {children}
      </div>
    </div>
  );
}
