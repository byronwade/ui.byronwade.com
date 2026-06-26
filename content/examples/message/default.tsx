"use client"

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageGroup,
  MessageHeader,
} from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { GradientAvatar } from "@/components/ui/gradient-avatar"

export default function Example() {
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <MessageGroup>
        <Message>
          <MessageAvatar>
            <GradientAvatar seed="sam" size="sm" />
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>Sam · 9:41 AM</MessageHeader>
            <Bubble variant="muted">
              <BubbleContent>
                Can you review the scroll behavior before we ship?
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message>
          <MessageAvatar>
            <GradientAvatar seed="sam" size="sm" />
          </MessageAvatar>
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                Especially when history prepends at the top.
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      </MessageGroup>

      <Message align="end">
        <MessageContent>
          <Bubble variant="tinted" align="end">
            <BubbleContent>
              On it — MessageScroller should keep the anchor stable.
            </BubbleContent>
          </Bubble>
          <MessageFooter>Delivered</MessageFooter>
        </MessageContent>
      </Message>
    </div>
  )
}
