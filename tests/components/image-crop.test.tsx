/**
 * Tests for <ImageCrop /> parts (components/ui/image-crop.tsx). Wraps
 * react-image-crop; the real crop needs pointer drags + live geometry that
 * jsdom can't provide, so we mock react-image-crop to a harness that exposes
 * onChange/onComplete, and stub the canvas/blob pipeline. Covers file→imgSrc,
 * image load, crop+apply (incl. oversize recursion), reset, asChild, the guard,
 * and a11y.
 */

import * as React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";

// Harness replacement for react-image-crop: renders children + a button that
// fires onChange/onComplete with a fixed crop, so we can drive the crop flow.
vi.mock("react-image-crop", () => {
  const crop = { x: 0, y: 0, width: 50, height: 50, unit: "px" as const };
  const ReactCrop = ({
    children,
    onChange,
    onComplete,
    className,
  }: {
    children?: React.ReactNode;
    onChange?: (p: unknown, c: unknown) => void;
    onComplete?: (p: unknown, c: unknown) => void;
    className?: string;
  }) => (
    <div className={`ReactCrop ${className ?? ""}`}>
      <button
        data-testid="rc-complete"
        type="button"
        onClick={() => {
          onChange?.(crop, crop);
          onComplete?.(crop, crop);
        }}
      >
        do-crop
      </button>
      {children}
    </div>
  );
  return {
    default: ReactCrop,
    centerCrop: (c: unknown) => c,
    makeAspectCrop: (c: unknown) => c,
  };
});

import {
  ImageCrop,
  ImageCropContent,
  ImageCropApply,
  ImageCropReset,
  Cropper,
} from "@/components/ui/image-crop";

const file = new File(["dummy"], "photo.png", { type: "image/png" });

class MockFileReader {
  result = "data:image/png;base64,AAAA";
  private cb: (() => void) | null = null;
  addEventListener(event: string, cb: () => void) {
    if (event === "load") this.cb = cb;
  }
  readAsDataURL() {
    Promise.resolve().then(() => this.cb?.());
  }
}

beforeEach(() => {
  vi.stubGlobal("FileReader", MockFileReader);
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage: vi.fn(),
    imageSmoothingEnabled: false,
  } as unknown as CanvasRenderingContext2D);
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockReturnValue("data:image/png;base64,AAAA");
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({ blob: async () => ({ size: 10 }) as Blob })),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function setup(props: Record<string, unknown> = {}) {
  const result = render(
    <ImageCrop file={file} {...props}>
      <ImageCropContent />
      <ImageCropApply />
      <ImageCropReset />
    </ImageCrop>,
  );
  const img = await waitFor(() => {
    const el = result.container.querySelector('img[alt="crop"]');
    if (!el) throw new Error("no img yet");
    return el as HTMLImageElement;
  });
  // give the cropped image real geometry for the scale math
  for (const [k, v] of Object.entries({ naturalWidth: 400, naturalHeight: 400, width: 200, height: 200 })) {
    Object.defineProperty(img, k, { value: v, configurable: true });
  }
  return { ...result, img };
}

describe("ImageCrop — render + load", () => {
  it("reads the file and renders the crop image + apply/reset", async () => {
    const { container, img } = await setup();
    expect(container.querySelector('[data-slot="image-crop"]')).not.toBeNull();
    expect(img).toHaveAttribute("alt", "crop");
    expect(container.querySelector('[data-slot="image-crop-apply"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="image-crop-reset"]')).not.toBeNull();
  });

  it("initializes a centered crop on image load (aspect + free)", async () => {
    const { img } = await setup({ aspect: 1 });
    expect(() => fireEvent.load(img)).not.toThrow();
    const { img: img2 } = await setup();
    expect(() => fireEvent.load(img2)).not.toThrow();
  });
});

describe("ImageCrop — crop flow", () => {
  it("apply is a no-op until a crop is completed", async () => {
    const onCrop = vi.fn();
    const { container } = await setup({ onCrop });
    fireEvent.click(container.querySelector('[data-slot="image-crop-apply"]')!);
    await waitFor(() => expect(onCrop).not.toHaveBeenCalled());
  });

  it("crops to a PNG via canvas after a crop completes", async () => {
    const onCrop = vi.fn();
    const onComplete = vi.fn();
    const { container, img } = await setup({ onCrop, onComplete });
    fireEvent.load(img);
    fireEvent.click(screen.getByTestId("rc-complete"));
    expect(onComplete).toHaveBeenCalled();
    fireEvent.click(container.querySelector('[data-slot="image-crop-apply"]')!);
    await waitFor(() =>
      expect(onCrop).toHaveBeenCalledWith("data:image/png;base64,AAAA"),
    );
  });

  it("recurses when the cropped blob exceeds maxImageSize", async () => {
    const onCrop = vi.fn();
    let calls = 0;
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(async () => ({
      blob: async () => {
        calls += 1;
        return { size: calls === 1 ? 99999 : 10 } as Blob;
      },
    }));
    const { container, img } = await setup({ onCrop, maxImageSize: 100 });
    fireEvent.load(img);
    fireEvent.click(screen.getByTestId("rc-complete"));
    fireEvent.click(container.querySelector('[data-slot="image-crop-apply"]')!);
    await waitFor(() => expect(onCrop).toHaveBeenCalled());
    expect(calls).toBeGreaterThan(1);
  });

  it("resets the crop after a completion", async () => {
    const { container, img } = await setup();
    fireEvent.load(img);
    fireEvent.click(screen.getByTestId("rc-complete"));
    expect(() =>
      fireEvent.click(container.querySelector('[data-slot="image-crop-reset"]')!),
    ).not.toThrow();
  });
});

describe("ImageCrop — asChild + Cropper + guard", () => {
  it("renders apply/reset as custom children (asChild) and forwards the click", async () => {
    const onCrop = vi.fn();
    const r = render(
      <ImageCrop file={file} onCrop={onCrop}>
        <ImageCropContent />
        <ImageCropApply asChild>
          <button type="button">Save</button>
        </ImageCropApply>
        <ImageCropReset asChild>
          <button type="button">Undo</button>
        </ImageCropReset>
      </ImageCrop>,
    );
    await waitFor(() => expect(r.container.querySelector('img[alt="crop"]')).not.toBeNull());
    fireEvent.click(screen.getByTestId("rc-complete"));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    await waitFor(() => expect(onCrop).toHaveBeenCalled());
  });

  it("renders via the Cropper convenience wrapper", async () => {
    const { container } = render(<Cropper file={file} className="rounded" />);
    await waitFor(() => expect(container.querySelector(".ReactCrop")).not.toBeNull());
  });

  it("throws when a part is used outside ImageCrop", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ImageCropApply />)).toThrow(/within ImageCrop/);
    spy.mockRestore();
  });

  it("has no axe violations", async () => {
    const { container } = await setup();
    expect(await axe(container)).toHaveNoViolations();
  });
});
