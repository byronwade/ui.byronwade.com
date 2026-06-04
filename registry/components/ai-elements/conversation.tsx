"use client";

import type { ComponentProps } from "react";
import { useCallback } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowDownIcon } from "lucide-react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const conversationVariants = cva("relative flex-1 overflow-y-hidden");

export type ConversationProps = ComponentProps<typeof StickToBottom> &
  VariantProps<typeof conversationVariants>;

export const Conversation = ({ className, ...props }: ConversationProps) => (
  <StickToBottom
    className={cn(conversationVariants(), className)}
    data-slot="conversation"
    initial="smooth"
    resize="smooth"
    role="log"
    {...props}
  />
);

const conversationContentVariants = cva("flex flex-col gap-8 p-4");

export type ConversationContentProps = ComponentProps<
  typeof StickToBottom.Content
> &
  VariantProps<typeof conversationContentVariants>;

export const ConversationContent = ({
  className,
  ...props
}: ConversationContentProps) => (
  <StickToBottom.Content
    className={cn(conversationContentVariants(), className)}
    data-slot="conversation-content"
    {...props}
  />
);

const conversationEmptyStateVariants = cva(
  "flex size-full flex-col items-center justify-center gap-3 p-8 text-center",
);

export type ConversationEmptyStateProps = ComponentProps<"div"> &
  VariantProps<typeof conversationEmptyStateVariants> & {
    title?: string;
    description?: string;
    icon?: React.ReactNode;
  };

export const ConversationEmptyState = ({
  className,
  title = "No messages yet",
  description = "Start a conversation to see messages here",
  icon,
  children,
  ...props
}: ConversationEmptyStateProps) => (
  <div
    className={cn(conversationEmptyStateVariants(), className)}
    data-slot="conversation-empty-state"
    {...props}
  >
    {children ?? (
      <>
        {icon && (
          <div className="text-muted-foreground" data-slot="conversation-empty-state-icon">
            {icon}
          </div>
        )}
        <div className="space-y-1" data-slot="conversation-empty-state-text">
          <h3
            className="text-sm font-medium"
            data-slot="conversation-empty-state-title"
          >
            {title}
          </h3>
          {description && (
            <p
              className="text-sm text-muted-foreground"
              data-slot="conversation-empty-state-description"
            >
              {description}
            </p>
          )}
        </div>
      </>
    )}
  </div>
);

export type ConversationScrollButtonProps = ComponentProps<typeof Button>;

export const ConversationScrollButton = ({
  className,
  ...props
}: ConversationScrollButtonProps) => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  return (
    !isAtBottom && (
      <Button
        className={cn(
          "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full",
          className,
        )}
        data-slot="conversation-scroll-button"
        onClick={handleScrollToBottom}
        size="icon"
        type="button"
        variant="outline"
        {...props}
      >
        <ArrowDownIcon className="size-4" />
      </Button>
    )
  );
};
