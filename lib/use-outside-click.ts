import { useEffect, type RefObject } from "react";

/**
 * Calls `callback` when a pointer/touch interaction lands outside `ref`.
 * Adapted for byronwade/ui from Aceternity UI (https://ui.aceternity.com),
 * typed without `Function`/`any`.
 */
export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  callback: (event: MouseEvent | TouchEvent) => void,
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      // Do nothing if the click is on the ref element or its descendants.
      if (!el || el.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
}
