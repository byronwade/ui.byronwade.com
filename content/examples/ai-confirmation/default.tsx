"use client";

import { useState } from "react";
import {
  Confirmation,
  ConfirmationTitle,
  ConfirmationRequest,
  ConfirmationAccepted,
  ConfirmationRejected,
  ConfirmationActions,
  ConfirmationAction,
} from "@/components/ai-elements/confirmation";

type Phase = "approval-requested" | "approval-responded";

export default function Example() {
  const [phase, setPhase] = useState<Phase>("approval-requested");
  const [approved, setApproved] = useState<boolean | undefined>(undefined);

  const approval = { id: "deploy-1", approved };

  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <div className="w-full max-w-md">
        <Confirmation
          approval={approval}
          state={phase as never}
        >
          <ConfirmationTitle>
            The agent wants to deploy{" "}
            <span className="font-mono text-foreground">api-gateway</span> to
            production.
          </ConfirmationTitle>

          <ConfirmationRequest>
            <ConfirmationActions>
              <ConfirmationAction
                variant="outline"
                onClick={() => {
                  setApproved(false);
                  setPhase("approval-responded");
                }}
              >
                Reject
              </ConfirmationAction>
              <ConfirmationAction
                onClick={() => {
                  setApproved(true);
                  setPhase("approval-responded");
                }}
              >
                Approve
              </ConfirmationAction>
            </ConfirmationActions>
          </ConfirmationRequest>

          <ConfirmationAccepted>
            <p className="text-sm text-success">
              Approved — deployment started.
            </p>
          </ConfirmationAccepted>

          <ConfirmationRejected>
            <p className="text-sm text-destructive">
              Rejected — no changes were made.
            </p>
          </ConfirmationRejected>
        </Confirmation>
      </div>
    </div>
  );
}
