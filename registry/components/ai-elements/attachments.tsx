"use client";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { FileUIPart, SourceDocumentUIPart } from "ai";
import {
  FileTextIcon,
  GlobeIcon,
  ImageIcon,
  Music2Icon,
  PaperclipIcon,
  VideoIcon,
  XIcon,
} from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { createContext, useCallback, useContext, useMemo } from "react";

// ============================================================================
// Types
// ============================================================================

export type AttachmentData =
  | (FileUIPart & { id: string })
  | (SourceDocumentUIPart & { id: string });

export type AttachmentMediaCategory =
  | "image"
  | "video"
  | "audio"
  | "document"
  | "source"
  | "unknown";

export type AttachmentVariant = "grid" | "inline" | "list";

const mediaCategoryIcons: Record<AttachmentMediaCategory, typeof ImageIcon> = {
  audio: Music2Icon,
  document: FileTextIcon,
  image: ImageIcon,
  source: GlobeIcon,
  unknown: PaperclipIcon,
  video: VideoIcon,
};

// ============================================================================
// Utility Functions
// ============================================================================

export const getMediaCategory = (
  data: AttachmentData
): AttachmentMediaCategory => {
  if (data.type === "source-document") {
    return "source";
  }

  const mediaType = data.mediaType ?? "";

  if (mediaType.startsWith("image/")) {
    return "image";
  }
  if (mediaType.startsWith("video/")) {
    return "video";
  }
  if (mediaType.startsWith("audio/")) {
    return "audio";
  }
  if (mediaType.startsWith("application/") || mediaType.startsWith("text/")) {
    return "document";
  }

  return "unknown";
};

export const getAttachmentLabel = (data: AttachmentData): string => {
  if (data.type === "source-document") {
    return data.title || data.filename || "Source";
  }

  const category = getMediaCategory(data);
  return data.filename || (category === "image" ? "Image" : "Attachment");
};

const renderAttachmentImage = (
  url: string,
  filename: string | undefined,
  isGrid: boolean
) =>
  isGrid ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={filename || "Image"}
      className="size-full object-cover"
      height={96}
      src={url}
      width={96}
    />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={filename || "Image"}
      className="size-full rounded-sm object-cover"
      height={20}
      src={url}
      width={20}
    />
  );

// ============================================================================
// Contexts
// ============================================================================

interface AttachmentsContextValue {
  variant: AttachmentVariant;
}

const AttachmentsContext = createContext<AttachmentsContextValue | null>(null);

interface AttachmentContextValue {
  data: AttachmentData;
  mediaCategory: AttachmentMediaCategory;
  onRemove?: () => void;
  variant: AttachmentVariant;
}

const AttachmentContext = createContext<AttachmentContextValue | null>(null);

// ============================================================================
// Hooks
// ============================================================================

export const useAttachmentsContext = () =>
  useContext(AttachmentsContext) ?? { variant: "grid" as const };

export const useAttachmentContext = () => {
  const ctx = useContext(AttachmentContext);
  if (!ctx) {
    throw new Error("Attachment components must be used within <Attachment>");
  }
  return ctx;
};

// ============================================================================
// Attachments - Container
// ============================================================================

const attachmentsVariants = cva("flex items-start", {
  variants: {
    variant: {
      grid: "ml-auto w-fit flex-wrap gap-2",
      inline: "flex-wrap gap-2",
      list: "flex-col gap-2",
    },
  },
  defaultVariants: {
    variant: "grid",
  },
});

export type AttachmentsProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof attachmentsVariants> & {
    variant?: AttachmentVariant;
  };

export const Attachments = ({
  variant = "grid",
  className,
  children,
  ...props
}: AttachmentsProps) => {
  const contextValue = useMemo(() => ({ variant }), [variant]);

  return (
    <AttachmentsContext.Provider value={contextValue}>
      <div
        className={cn(attachmentsVariants({ variant }), className)}
        data-slot="attachments"
        data-variant={variant}
        {...props}
      >
        {children}
      </div>
    </AttachmentsContext.Provider>
  );
};

// ============================================================================
// Attachment - Item
// ============================================================================

const attachmentVariants = cva("group/attachment relative", {
  variants: {
    variant: {
      grid: "size-24 overflow-hidden rounded-lg",
      inline: cn(
        "flex h-8 cursor-pointer select-none items-center gap-1.5",
        "rounded-md edge px-1.5",
        "text-sm font-medium transition-all",
        "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50"
      ),
      list: cn(
        "flex w-full items-center gap-3 rounded-lg edge p-3",
        "hover:bg-accent/50"
      ),
    },
  },
  defaultVariants: {
    variant: "grid",
  },
});

export type AttachmentProps = HTMLAttributes<HTMLDivElement> & {
  data: AttachmentData;
  onRemove?: () => void;
};

export const Attachment = ({
  data,
  onRemove,
  className,
  children,
  ...props
}: AttachmentProps) => {
  const { variant } = useAttachmentsContext();
  const mediaCategory = getMediaCategory(data);

  const contextValue = useMemo<AttachmentContextValue>(
    () => ({ data, mediaCategory, onRemove, variant }),
    [data, mediaCategory, onRemove, variant]
  );

  return (
    <AttachmentContext.Provider value={contextValue}>
      <div
        className={cn(attachmentVariants({ variant }), className)}
        data-slot="attachment"
        data-variant={variant}
        {...props}
      >
        {children}
      </div>
    </AttachmentContext.Provider>
  );
};

// ============================================================================
// AttachmentPreview - Media preview
// ============================================================================

const attachmentPreviewVariants = cva(
  "flex shrink-0 items-center justify-center overflow-hidden",
  {
    variants: {
      variant: {
        grid: "size-full bg-muted",
        inline: "size-5 rounded-sm bg-background",
        list: "size-12 rounded-sm bg-muted",
      },
    },
    defaultVariants: {
      variant: "grid",
    },
  }
);

export type AttachmentPreviewProps = HTMLAttributes<HTMLDivElement> & {
  fallbackIcon?: ReactNode;
};

export const AttachmentPreview = ({
  fallbackIcon,
  className,
  ...props
}: AttachmentPreviewProps) => {
  const { data, mediaCategory, variant } = useAttachmentContext();

  const iconSize = variant === "inline" ? "size-3" : "size-4";

  const renderIcon = (Icon: typeof ImageIcon) => (
    <Icon className={cn(iconSize, "text-muted-foreground")} />
  );

  const renderContent = () => {
    if (mediaCategory === "image" && data.type === "file" && data.url) {
      return renderAttachmentImage(data.url, data.filename, variant === "grid");
    }

    if (mediaCategory === "video" && data.type === "file" && data.url) {
      // biome-ignore lint/a11y/useMediaCaption: attachment preview thumbnail
      return <video className="size-full object-cover" muted src={data.url} />;
    }

    const Icon = mediaCategoryIcons[mediaCategory];
    return fallbackIcon ?? renderIcon(Icon);
  };

  return (
    <div
      className={cn(attachmentPreviewVariants({ variant }), className)}
      data-slot="attachment-preview"
      data-variant={variant}
      {...props}
    >
      {renderContent()}
    </div>
  );
};

// ============================================================================
// AttachmentInfo - Name and type display
// ============================================================================

export type AttachmentInfoProps = HTMLAttributes<HTMLDivElement> & {
  showMediaType?: boolean;
};

export const AttachmentInfo = ({
  showMediaType = false,
  className,
  ...props
}: AttachmentInfoProps) => {
  const { data, variant } = useAttachmentContext();
  const label = getAttachmentLabel(data);

  if (variant === "grid") {
    return null;
  }

  return (
    <div
      className={cn("min-w-0 flex-1", className)}
      data-slot="attachment-info"
      {...props}
    >
      <span className="block truncate">{label}</span>
      {showMediaType && data.mediaType && (
        <span className="block truncate text-xs text-muted-foreground">
          {data.mediaType}
        </span>
      )}
    </div>
  );
};

// ============================================================================
// AttachmentRemove - Remove button
// ============================================================================

const attachmentRemoveVariants = cva("", {
  variants: {
    variant: {
      grid: cn(
        "absolute top-2 right-2 size-6 rounded-full p-0",
        "bg-background/80 backdrop-blur-sm",
        "opacity-0 transition-opacity group-hover/attachment:opacity-100",
        "hover:bg-background",
        "[&>svg]:size-3"
      ),
      inline: cn(
        "size-5 rounded-sm p-0",
        "opacity-0 transition-opacity group-hover/attachment:opacity-100",
        "[&>svg]:size-2.5"
      ),
      list: "size-8 shrink-0 rounded-sm p-0 [&>svg]:size-4",
    },
  },
  defaultVariants: {
    variant: "grid",
  },
});

export type AttachmentRemoveProps = ComponentProps<typeof Button> & {
  label?: string;
};

export const AttachmentRemove = ({
  label = "Remove",
  className,
  children,
  ...props
}: AttachmentRemoveProps) => {
  const { onRemove, variant } = useAttachmentContext();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    },
    [onRemove]
  );

  if (!onRemove) {
    return null;
  }

  return (
    <Button
      aria-label={label}
      className={cn(attachmentRemoveVariants({ variant }), className)}
      data-slot="attachment-remove"
      data-variant={variant}
      onClick={handleClick}
      size="icon-xs"
      type="button"
      variant="ghost"
      {...props}
    >
      {children ?? <XIcon />}
      <span className="sr-only">{label}</span>
    </Button>
  );
};

// ============================================================================
// AttachmentHoverCard - Hover preview
// ============================================================================

export type AttachmentHoverCardProps = ComponentProps<typeof HoverCard>;

export const AttachmentHoverCard = (props: AttachmentHoverCardProps) => (
  <HoverCard {...props} />
);

export type AttachmentHoverCardTriggerProps = ComponentProps<
  typeof HoverCardTrigger
>;

/**
 * Base UI configures hover open/close timing on the trigger (not the root, as
 * Radix does), so the zero-delay defaults that make attachment previews feel
 * instant live here.
 */
export const AttachmentHoverCardTrigger = ({
  delay = 0,
  closeDelay = 0,
  ...props
}: AttachmentHoverCardTriggerProps) => (
  <HoverCardTrigger
    closeDelay={closeDelay}
    data-slot="attachment-hover-card-trigger"
    delay={delay}
    {...props}
  />
);

export type AttachmentHoverCardContentProps = ComponentProps<
  typeof HoverCardContent
>;

export const AttachmentHoverCardContent = ({
  align = "start",
  className,
  ...props
}: AttachmentHoverCardContentProps) => (
  <HoverCardContent
    align={align}
    className={cn("w-auto p-2", className)}
    data-slot="attachment-hover-card-content"
    {...props}
  />
);

// ============================================================================
// AttachmentEmpty - Empty state
// ============================================================================

export type AttachmentEmptyProps = HTMLAttributes<HTMLDivElement>;

export const AttachmentEmpty = ({
  className,
  children,
  ...props
}: AttachmentEmptyProps) => (
  <div
    className={cn(
      "flex items-center justify-center p-4 text-sm text-muted-foreground",
      className
    )}
    data-slot="attachment-empty"
    {...props}
  >
    {children ?? "No attachments"}
  </div>
);
