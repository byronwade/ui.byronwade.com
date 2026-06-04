"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ToolUIPart } from "ai";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
} from "react";

type ToolUIPartApproval =
  | {
      id: string;
      approved?: never;
      reason?: never;
    }
  | {
      id: string;
      approved: boolean;
      reason?: string;
    }
  | {
      id: string;
      approved: true;
      reason?: string;
    }
  | {
      id: string;
      approved: false;
      reason?: string;
    }
  | undefined;

type ConfirmationContextValue = {
  approval: ToolUIPartApproval;
  state: ToolUIPart["state"];
};

const ConfirmationContext = createContext<ConfirmationContextValue | null>(
  null
);

const useConfirmation = () => {
  const context = useContext(ConfirmationContext);

  if (!context) {
    throw new Error("Confirmation components must be used within Confirmation");
  }

  return context;
};

export type ConfirmationProps = ComponentProps<typeof Alert> & {
  approval?: ToolUIPartApproval;
  state: ToolUIPart["state"];
};

export const Confirmation = ({
  className,
  approval,
  state,
  ...props
}: ConfirmationProps) => {
  if (!approval || state === "input-streaming" || state === "input-available") {
    return null;
  }

  return (
    <ConfirmationContext.Provider value={{ approval, state }}>
      <Alert
        data-slot="confirmation"
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </ConfirmationContext.Provider>
  );
};

export type ConfirmationTitleProps = ComponentProps<typeof AlertDescription>;

export const ConfirmationTitle = ({
  className,
  ...props
}: ConfirmationTitleProps) => (
  <AlertDescription
    data-slot="confirmation-title"
    className={cn("inline text-foreground", className)}
    {...props}
  />
);

export type ConfirmationRequestProps = {
  children?: ReactNode;
};

export const ConfirmationRequest = ({ children }: ConfirmationRequestProps) => {
  const { state } = useConfirmation();

  // Only show when approval is requested
  // @ts-ignore state only available in AI SDK v6 (type varies by installed @ai-sdk version)
  if (state !== "approval-requested") {
    return null;
  }

  return children;
};

export type ConfirmationAcceptedProps = {
  children?: ReactNode;
};

export const ConfirmationAccepted = ({
  children,
}: ConfirmationAcceptedProps) => {
  const { approval, state } = useConfirmation();

  // Only show when approved and in response states
  if (
    !approval?.approved ||
    // @ts-ignore state only available in AI SDK v6 (type varies by installed @ai-sdk version)
    (state !== "approval-responded" &&
      // @ts-ignore state only available in AI SDK v6 (type varies by installed @ai-sdk version)
      state !== "output-denied" &&
      state !== "output-available")
  ) {
    return null;
  }

  return children;
};

export type ConfirmationRejectedProps = {
  children?: ReactNode;
};

export const ConfirmationRejected = ({
  children,
}: ConfirmationRejectedProps) => {
  const { approval, state } = useConfirmation();

  // Only show when rejected and in response states
  if (
    approval?.approved !== false ||
    // @ts-ignore state only available in AI SDK v6 (type varies by installed @ai-sdk version)
    (state !== "approval-responded" &&
      // @ts-ignore state only available in AI SDK v6 (type varies by installed @ai-sdk version)
      state !== "output-denied" &&
      state !== "output-available")
  ) {
    return null;
  }

  return children;
};

export type ConfirmationActionsProps = ComponentProps<"div">;

export const ConfirmationActions = ({
  className,
  ...props
}: ConfirmationActionsProps) => {
  const { state } = useConfirmation();

  // Only show when approval is requested
  // @ts-ignore state only available in AI SDK v6 (type varies by installed @ai-sdk version)
  if (state !== "approval-requested") {
    return null;
  }

  return (
    <div
      data-slot="confirmation-actions"
      className={cn("flex items-center justify-end gap-2 self-end", className)}
      {...props}
    />
  );
};

export type ConfirmationActionProps = ComponentProps<typeof Button>;

export const ConfirmationAction = ({
  className,
  ...props
}: ConfirmationActionProps) => (
  <Button
    data-slot="confirmation-action"
    size="sm"
    type="button"
    className={cn(className)}
    {...props}
  />
);
