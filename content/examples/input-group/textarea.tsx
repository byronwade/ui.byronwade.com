"use client";

import { useState } from "react";
import { SendIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

export default function Example() {
  const [value, setValue] = useState("");
  const max = 280;

  return (
    <InputGroup className="max-w-sm">
      <InputGroupTextarea
        aria-label="Message"
        placeholder="Write a message…"
        maxLength={max}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <InputGroupAddon align="block-end" className="border-t">
        <InputGroupText className="tabular-nums">
          {value.length}/{max}
        </InputGroupText>
        <InputGroupButton
          size="icon-xs"
          aria-label="Send message"
          className="ml-auto"
        >
          <SendIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
