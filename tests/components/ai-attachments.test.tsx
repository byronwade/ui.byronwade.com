/**
 * Exhaustive tests for the Attachments compound component (ai-elements).
 *
 * Component source: components/ai-elements/attachments.tsx
 *
 * Exports:
 *   Attachments               – container, data-slot="attachments", variant prop
 *   Attachment                – item wrapper, data-slot="attachment", data + onRemove
 *   AttachmentPreview         – media/icon preview, data-slot="attachment-preview"
 *   AttachmentInfo            – name + type, data-slot="attachment-info" (hidden in grid)
 *   AttachmentRemove          – remove button, data-slot="attachment-remove" (only when onRemove)
 *   AttachmentHoverCard       – hover-card root passthrough
 *   AttachmentHoverCardTrigger
 *   AttachmentHoverCardContent
 *   AttachmentEmpty           – empty state, data-slot="attachment-empty"
 *   getMediaCategory          – util: AttachmentData -> media category
 *   getAttachmentLabel        – util: AttachmentData -> display label
 *   useAttachmentsContext / useAttachmentContext – context hooks
 *
 * Variants: "grid" | "inline" | "list"
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  Attachments,
  Attachment,
  AttachmentPreview,
  AttachmentInfo,
  AttachmentRemove,
  AttachmentHoverCard,
  AttachmentHoverCardTrigger,
  AttachmentHoverCardContent,
  AttachmentEmpty,
  getMediaCategory,
  getAttachmentLabel,
  type AttachmentData,
  type AttachmentVariant,
} from "@/components/ai-elements/attachments";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const imageFile: AttachmentData = {
  id: "img-1",
  type: "file",
  filename: "photo.png",
  mediaType: "image/png",
  url: "https://example.com/photo.png",
};

const videoFile: AttachmentData = {
  id: "vid-1",
  type: "file",
  filename: "clip.mp4",
  mediaType: "video/mp4",
  url: "https://example.com/clip.mp4",
};

const audioFile: AttachmentData = {
  id: "aud-1",
  type: "file",
  filename: "song.mp3",
  mediaType: "audio/mpeg",
  url: "https://example.com/song.mp3",
};

const docFile: AttachmentData = {
  id: "doc-1",
  type: "file",
  filename: "spec.pdf",
  mediaType: "application/pdf",
  url: "https://example.com/spec.pdf",
};

const textFile: AttachmentData = {
  id: "txt-1",
  type: "file",
  filename: "notes.txt",
  mediaType: "text/plain",
  url: "https://example.com/notes.txt",
};

const unknownFile: AttachmentData = {
  id: "bin-1",
  type: "file",
  filename: "data.bin",
  mediaType: "x-custom/binary",
  url: "https://example.com/data.bin",
};

const sourceDoc: AttachmentData = {
  id: "src-1",
  type: "source-document",
  sourceId: "s-1",
  title: "Source Title",
  mediaType: "text/html",
};

function renderItem(
  data: AttachmentData,
  variant: AttachmentVariant,
  opts: { onRemove?: () => void; showMediaType?: boolean } = {}
) {
  return render(
    <Attachments variant={variant}>
      <Attachment data={data} onRemove={opts.onRemove}>
        <AttachmentPreview />
        <AttachmentInfo showMediaType={opts.showMediaType} />
        <AttachmentRemove />
      </Attachment>
    </Attachments>
  );
}

// ---------------------------------------------------------------------------
// 1. getMediaCategory util
// ---------------------------------------------------------------------------

describe("getMediaCategory", () => {
  it("returns 'source' for source-document type", () => {
    expect(getMediaCategory(sourceDoc)).toBe("source");
  });

  it("returns 'image' for image/* media", () => {
    expect(getMediaCategory(imageFile)).toBe("image");
  });

  it("returns 'video' for video/* media", () => {
    expect(getMediaCategory(videoFile)).toBe("video");
  });

  it("returns 'audio' for audio/* media", () => {
    expect(getMediaCategory(audioFile)).toBe("audio");
  });

  it("returns 'document' for application/* media", () => {
    expect(getMediaCategory(docFile)).toBe("document");
  });

  it("returns 'document' for text/* media", () => {
    expect(getMediaCategory(textFile)).toBe("document");
  });

  it("returns 'unknown' for unrecognized media", () => {
    expect(getMediaCategory(unknownFile)).toBe("unknown");
  });

  it("returns 'unknown' when mediaType is missing", () => {
    const noType = {
      id: "x",
      type: "file",
      filename: "x",
      url: "https://example.com/x",
    } as unknown as AttachmentData;
    expect(getMediaCategory(noType)).toBe("unknown");
  });
});

// ---------------------------------------------------------------------------
// 2. getAttachmentLabel util
// ---------------------------------------------------------------------------

describe("getAttachmentLabel", () => {
  it("returns title for source-document", () => {
    expect(getAttachmentLabel(sourceDoc)).toBe("Source Title");
  });

  it("falls back to filename for source-document with empty title", () => {
    const s = { ...sourceDoc, title: "", filename: "page.html" };
    expect(getAttachmentLabel(s)).toBe("page.html");
  });

  it("falls back to 'Source' for source-document with no title/filename", () => {
    const s = { ...sourceDoc, title: "", filename: undefined };
    expect(getAttachmentLabel(s)).toBe("Source");
  });

  it("returns filename for a file", () => {
    expect(getAttachmentLabel(imageFile)).toBe("photo.png");
  });

  it("falls back to 'Image' for an image file with no filename", () => {
    const i = { ...imageFile, filename: undefined };
    expect(getAttachmentLabel(i)).toBe("Image");
  });

  it("falls back to 'Attachment' for a non-image file with no filename", () => {
    const d = { ...docFile, filename: undefined };
    expect(getAttachmentLabel(d)).toBe("Attachment");
  });
});

// ---------------------------------------------------------------------------
// 3. Attachments container
// ---------------------------------------------------------------------------

describe("Attachments — container", () => {
  it("renders without crashing", () => {
    const { container } = render(<Attachments />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has data-slot='attachments'", () => {
    const { container } = render(<Attachments />);
    expect(container.firstChild).toHaveAttribute("data-slot", "attachments");
  });

  it("defaults to grid variant", () => {
    const { container } = render(<Attachments />);
    expect(container.firstChild).toHaveAttribute("data-variant", "grid");
  });

  it.each<AttachmentVariant>(["grid", "inline", "list"])(
    "sets data-variant='%s'",
    (variant) => {
      const { container } = render(<Attachments variant={variant} />);
      expect(container.firstChild).toHaveAttribute("data-variant", variant);
    }
  );

  it("grid variant uses ml-auto w-fit", () => {
    const { container } = render(<Attachments variant="grid" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "ml-auto"
    );
  });

  it("list variant uses flex-col", () => {
    const { container } = render(<Attachments variant="list" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "flex-col"
    );
  });

  it("forwards custom className", () => {
    const { container } = render(<Attachments className="custom-c" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "custom-c"
    );
  });

  it("forwards HTML attributes", () => {
    const { container } = render(<Attachments id="att" data-testid="att" />);
    expect(container.firstChild).toHaveAttribute("id", "att");
    expect(container.firstChild).toHaveAttribute("data-testid", "att");
  });

  it("renders children", () => {
    render(<Attachments>hi there</Attachments>);
    expect(screen.getByText("hi there")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. Attachment item
// ---------------------------------------------------------------------------

describe("Attachment — item", () => {
  it("has data-slot='attachment'", () => {
    const { container } = renderItem(docFile, "list");
    expect(
      container.querySelector("[data-slot='attachment']")
    ).toBeInTheDocument();
  });

  it.each<AttachmentVariant>(["grid", "inline", "list"])(
    "carries data-variant='%s'",
    (variant) => {
      const { container } = renderItem(docFile, variant);
      const item = container.querySelector("[data-slot='attachment']");
      expect(item).toHaveAttribute("data-variant", variant);
    }
  );

  it("grid variant item is square (size-24)", () => {
    const { container } = renderItem(imageFile, "grid");
    const item = container.querySelector(
      "[data-slot='attachment']"
    ) as HTMLElement;
    expect(item.className).toContain("size-24");
  });

  it("inline variant item uses border-border (token, not raw color)", () => {
    const { container } = renderItem(docFile, "inline");
    const item = container.querySelector(
      "[data-slot='attachment']"
    ) as HTMLElement;
    expect(item.className).toContain("border-border");
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Attachments variant="list">
        <Attachment className="item-c" data={docFile}>
          <AttachmentInfo />
        </Attachment>
      </Attachments>
    );
    const item = container.querySelector(
      "[data-slot='attachment']"
    ) as HTMLElement;
    expect(item.className).toContain("item-c");
  });

  it("forwards HTML attributes", () => {
    const { container } = render(
      <Attachments variant="list">
        <Attachment data={docFile} data-testid="it" id="it">
          <AttachmentInfo />
        </Attachment>
      </Attachments>
    );
    const item = container.querySelector("[data-slot='attachment']");
    expect(item).toHaveAttribute("id", "it");
    expect(item).toHaveAttribute("data-testid", "it");
  });
});

// ---------------------------------------------------------------------------
// 5. AttachmentPreview
// ---------------------------------------------------------------------------

describe("AttachmentPreview", () => {
  it("has data-slot='attachment-preview'", () => {
    const { container } = renderItem(docFile, "list");
    expect(
      container.querySelector("[data-slot='attachment-preview']")
    ).toBeInTheDocument();
  });

  it("renders an <img> for an image file", () => {
    const { container } = renderItem(imageFile, "list");
    const img = container.querySelector("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", imageFile.url);
  });

  it("uses filename as image alt text", () => {
    renderItem(imageFile, "grid");
    expect(screen.getByAltText("photo.png")).toBeInTheDocument();
  });

  it("falls back to 'Image' alt when filename missing", () => {
    const noName = { ...imageFile, filename: undefined };
    renderItem(noName, "grid");
    expect(screen.getByAltText("Image")).toBeInTheDocument();
  });

  it("renders a <video> for a video file", () => {
    const { container } = renderItem(videoFile, "list");
    const video = container.querySelector("video");
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute("src", videoFile.url);
  });

  it("renders an icon (svg) for a document", () => {
    const { container } = renderItem(docFile, "list");
    const preview = container.querySelector(
      "[data-slot='attachment-preview']"
    ) as HTMLElement;
    expect(preview.querySelector("svg")).toBeInTheDocument();
  });

  it("renders an icon for a source-document", () => {
    const { container } = renderItem(sourceDoc, "list");
    const preview = container.querySelector(
      "[data-slot='attachment-preview']"
    ) as HTMLElement;
    expect(preview.querySelector("svg")).toBeInTheDocument();
  });

  it("renders an icon for audio", () => {
    const { container } = renderItem(audioFile, "list");
    const preview = container.querySelector(
      "[data-slot='attachment-preview']"
    ) as HTMLElement;
    expect(preview.querySelector("svg")).toBeInTheDocument();
  });

  it("renders an icon for unknown media", () => {
    const { container } = renderItem(unknownFile, "list");
    const preview = container.querySelector(
      "[data-slot='attachment-preview']"
    ) as HTMLElement;
    expect(preview.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom fallbackIcon for non-media types", () => {
    render(
      <Attachments variant="list">
        <Attachment data={docFile}>
          <AttachmentPreview fallbackIcon={<span>FB</span>} />
        </Attachment>
      </Attachments>
    );
    expect(screen.getByText("FB")).toBeInTheDocument();
  });

  it("grid preview uses bg-muted token", () => {
    const { container } = renderItem(docFile, "grid");
    const preview = container.querySelector(
      "[data-slot='attachment-preview']"
    ) as HTMLElement;
    expect(preview.className).toContain("bg-muted");
  });

  it("inline preview carries data-variant='inline'", () => {
    const { container } = renderItem(docFile, "inline");
    const preview = container.querySelector(
      "[data-slot='attachment-preview']"
    ) as HTMLElement;
    expect(preview).toHaveAttribute("data-variant", "inline");
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Attachments variant="list">
        <Attachment data={docFile}>
          <AttachmentPreview className="prev-c" />
        </Attachment>
      </Attachments>
    );
    const preview = container.querySelector(
      "[data-slot='attachment-preview']"
    ) as HTMLElement;
    expect(preview.className).toContain("prev-c");
  });
});

// ---------------------------------------------------------------------------
// 6. AttachmentInfo
// ---------------------------------------------------------------------------

describe("AttachmentInfo", () => {
  it("has data-slot='attachment-info' in list variant", () => {
    const { container } = renderItem(docFile, "list");
    expect(
      container.querySelector("[data-slot='attachment-info']")
    ).toBeInTheDocument();
  });

  it("renders the attachment label", () => {
    renderItem(docFile, "list");
    expect(screen.getByText("spec.pdf")).toBeInTheDocument();
  });

  it("renders nothing in grid variant", () => {
    const { container } = renderItem(imageFile, "grid");
    expect(
      container.querySelector("[data-slot='attachment-info']")
    ).not.toBeInTheDocument();
  });

  it("shows media type when showMediaType is true", () => {
    renderItem(docFile, "list", { showMediaType: true });
    expect(screen.getByText("application/pdf")).toBeInTheDocument();
  });

  it("hides media type by default", () => {
    renderItem(docFile, "list");
    expect(screen.queryByText("application/pdf")).not.toBeInTheDocument();
  });

  it("uses text-muted-foreground token for the media type", () => {
    const { container } = renderItem(docFile, "list", { showMediaType: true });
    const mt = within(
      container.querySelector("[data-slot='attachment-info']") as HTMLElement
    ).getByText("application/pdf");
    expect(mt.className).toContain("text-muted-foreground");
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Attachments variant="list">
        <Attachment data={docFile}>
          <AttachmentInfo className="info-c" />
        </Attachment>
      </Attachments>
    );
    const info = container.querySelector(
      "[data-slot='attachment-info']"
    ) as HTMLElement;
    expect(info.className).toContain("info-c");
  });
});

// ---------------------------------------------------------------------------
// 7. AttachmentRemove
// ---------------------------------------------------------------------------

describe("AttachmentRemove", () => {
  it("renders nothing when no onRemove is provided", () => {
    const { container } = render(
      <Attachments variant="list">
        <Attachment data={docFile}>
          <AttachmentRemove />
        </Attachment>
      </Attachments>
    );
    expect(
      container.querySelector("[data-slot='attachment-remove']")
    ).not.toBeInTheDocument();
  });

  it("renders a button when onRemove is provided", () => {
    renderItem(docFile, "list", { onRemove: () => {} });
    expect(
      screen.getByRole("button", { name: "Remove" })
    ).toBeInTheDocument();
  });

  it("has data-slot='attachment-remove'", () => {
    const { container } = renderItem(docFile, "list", { onRemove: () => {} });
    expect(
      container.querySelector("[data-slot='attachment-remove']")
    ).toBeInTheDocument();
  });

  it("calls onRemove on click", async () => {
    const onRemove = vi.fn();
    renderItem(docFile, "list", { onRemove });
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("stops propagation so the parent item is not triggered", async () => {
    const onRemove = vi.fn();
    const onItemClick = vi.fn();
    render(
      <Attachments variant="list">
        <Attachment data={docFile} onClick={onItemClick} onRemove={onRemove}>
          <AttachmentRemove />
        </Attachment>
      </Attachments>
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onItemClick).not.toHaveBeenCalled();
  });

  it("supports a custom label (aria-label + sr text)", () => {
    render(
      <Attachments variant="list">
        <Attachment data={docFile} onRemove={() => {}}>
          <AttachmentRemove label="Delete file" />
        </Attachment>
      </Attachments>
    );
    expect(
      screen.getByRole("button", { name: "Delete file" })
    ).toBeInTheDocument();
  });

  it("renders custom children instead of the default X icon", () => {
    render(
      <Attachments variant="list">
        <Attachment data={docFile} onRemove={() => {}}>
          <AttachmentRemove>
            <span>x-mark</span>
          </AttachmentRemove>
        </Attachment>
      </Attachments>
    );
    expect(screen.getByText("x-mark")).toBeInTheDocument();
  });

  it.each<AttachmentVariant>(["grid", "inline", "list"])(
    "carries data-variant='%s'",
    (variant) => {
      const { container } = renderItem(docFile, variant, {
        onRemove: () => {},
      });
      const btn = container.querySelector("[data-slot='attachment-remove']");
      expect(btn).toHaveAttribute("data-variant", variant);
    }
  );

  it("grid remove button uses bg-background token", () => {
    const { container } = renderItem(imageFile, "grid", {
      onRemove: () => {},
    });
    const btn = container.querySelector(
      "[data-slot='attachment-remove']"
    ) as HTMLElement;
    expect(btn.className).toContain("bg-background");
  });

  it("forwards custom className", () => {
    const { container } = render(
      <Attachments variant="list">
        <Attachment data={docFile} onRemove={() => {}}>
          <AttachmentRemove className="rm-c" />
        </Attachment>
      </Attachments>
    );
    const btn = container.querySelector(
      "[data-slot='attachment-remove']"
    ) as HTMLElement;
    expect(btn.className).toContain("rm-c");
  });
});

// ---------------------------------------------------------------------------
// 8. AttachmentHoverCard family
// ---------------------------------------------------------------------------

describe("AttachmentHoverCard family", () => {
  it("renders the trigger content", () => {
    render(
      <AttachmentHoverCard>
        <AttachmentHoverCardTrigger render={<button>Trigger</button>} />
        <AttachmentHoverCardContent>Preview</AttachmentHoverCardContent>
      </AttachmentHoverCard>
    );
    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("trigger carries its data-slot", () => {
    render(
      <AttachmentHoverCard>
        <AttachmentHoverCardTrigger render={<button>T</button>} />
      </AttachmentHoverCard>
    );
    expect(
      document.querySelector("[data-slot='attachment-hover-card-trigger']")
    ).toBeInTheDocument();
  });

  it("reveals content on hover", async () => {
    render(
      <AttachmentHoverCard>
        <AttachmentHoverCardTrigger render={<button>Hover me</button>} />
        <AttachmentHoverCardContent>Hidden preview</AttachmentHoverCardContent>
      </AttachmentHoverCard>
    );
    await userEvent.hover(screen.getByText("Hover me"));
    expect(await screen.findByText("Hidden preview")).toBeInTheDocument();
  });

  it("content carries its data-slot when open", async () => {
    render(
      <AttachmentHoverCard>
        <AttachmentHoverCardTrigger render={<button>Hover</button>} />
        <AttachmentHoverCardContent>Body</AttachmentHoverCardContent>
      </AttachmentHoverCard>
    );
    await userEvent.hover(screen.getByText("Hover"));
    expect(
      await screen.findByText("Body")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='attachment-hover-card-content']")
    ).toBeInTheDocument();
  });

  it("content forwards custom className", async () => {
    render(
      <AttachmentHoverCard>
        <AttachmentHoverCardTrigger render={<button>Hover</button>} />
        <AttachmentHoverCardContent className="hc-c">
          Body
        </AttachmentHoverCardContent>
      </AttachmentHoverCard>
    );
    await userEvent.hover(screen.getByText("Hover"));
    await screen.findByText("Body");
    const content = document.querySelector(
      "[data-slot='attachment-hover-card-content']"
    ) as HTMLElement;
    expect(content.className).toContain("hc-c");
  });
});

// ---------------------------------------------------------------------------
// 9. AttachmentEmpty
// ---------------------------------------------------------------------------

describe("AttachmentEmpty", () => {
  it("has data-slot='attachment-empty'", () => {
    const { container } = render(<AttachmentEmpty />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "attachment-empty"
    );
  });

  it("renders default empty text", () => {
    render(<AttachmentEmpty />);
    expect(screen.getByText("No attachments")).toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(<AttachmentEmpty>Drop files here</AttachmentEmpty>);
    expect(screen.getByText("Drop files here")).toBeInTheDocument();
  });

  it("uses text-muted-foreground token", () => {
    const { container } = render(<AttachmentEmpty />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "text-muted-foreground"
    );
  });

  it("forwards custom className", () => {
    const { container } = render(<AttachmentEmpty className="empty-c" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "empty-c"
    );
  });

  it("forwards HTML attributes", () => {
    const { container } = render(<AttachmentEmpty data-testid="empty" />);
    expect(container.firstChild).toHaveAttribute("data-testid", "empty");
  });
});

// ---------------------------------------------------------------------------
// 10. Hook error guard
// ---------------------------------------------------------------------------

describe("useAttachmentContext guard", () => {
  it("throws when AttachmentInfo is used outside <Attachment>", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<AttachmentInfo />)).toThrow(
      "Attachment components must be used within <Attachment>"
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 11. Composition + accessibility (axe)
// ---------------------------------------------------------------------------

describe("Attachments — composition & accessibility (axe)", () => {
  const files: AttachmentData[] = [imageFile, docFile, sourceDoc];

  it("renders a full list of attachments", () => {
    render(
      <Attachments variant="list">
        {files.map((f) => (
          <Attachment data={f} key={f.id} onRemove={() => {}}>
            <AttachmentPreview />
            <AttachmentInfo showMediaType />
            <AttachmentRemove />
          </Attachment>
        ))}
      </Attachments>
    );
    expect(screen.getByText("photo.png")).toBeInTheDocument();
    expect(screen.getByText("spec.pdf")).toBeInTheDocument();
    expect(screen.getByText("Source Title")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Remove" })).toHaveLength(3);
  });

  it("list variant has no axe violations", async () => {
    const { container } = render(
      <main>
        <Attachments variant="list">
          {files.map((f) => (
            <Attachment data={f} key={f.id} onRemove={() => {}}>
              <AttachmentPreview />
              <AttachmentInfo showMediaType />
              <AttachmentRemove />
            </Attachment>
          ))}
        </Attachments>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("inline variant has no axe violations", async () => {
    const { container } = render(
      <main>
        <Attachments variant="inline">
          {files.map((f) => (
            <Attachment data={f} key={f.id} onRemove={() => {}}>
              <AttachmentPreview />
              <AttachmentInfo />
              <AttachmentRemove />
            </Attachment>
          ))}
        </Attachments>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("grid variant has no axe violations", async () => {
    const { container } = render(
      <main>
        <Attachments variant="grid">
          {[imageFile, videoFile].map((f) => (
            <Attachment data={f} key={f.id} onRemove={() => {}}>
              <AttachmentPreview />
              <AttachmentRemove />
            </Attachment>
          ))}
        </Attachments>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("empty state has no axe violations", async () => {
    const { container } = render(
      <main>
        <Attachments variant="list">
          <AttachmentEmpty />
        </Attachments>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
