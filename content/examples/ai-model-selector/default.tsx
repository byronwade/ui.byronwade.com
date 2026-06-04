"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorSeparator,
  ModelSelectorShortcut,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";

type Model = {
  id: string;
  name: string;
  provider: string;
  context: string;
  shortcut?: string;
};

const frontier: Model[] = [
  {
    id: "claude-opus",
    name: "Claude Opus 4.8",
    provider: "anthropic",
    context: "1M",
    shortcut: "⌘1",
  },
  {
    id: "gpt-5",
    name: "GPT-5",
    provider: "openai",
    context: "400K",
    shortcut: "⌘2",
  },
  {
    id: "gemini-pro",
    name: "Gemini 2.5 Pro",
    provider: "google",
    context: "2M",
    shortcut: "⌘3",
  },
];

const fast: Model[] = [
  { id: "haiku", name: "Claude Haiku 4", provider: "anthropic", context: "200K" },
  { id: "mistral-l", name: "Mistral Large", provider: "mistral", context: "128K" },
];

export default function Example() {
  const [selected, setSelected] = useState<Model>(frontier[0]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <ModelSelector>
        <ModelSelectorTrigger
          render={
            <Button className="gap-2" size="sm" variant="outline">
              <ModelSelectorLogoGroup>
                <ModelSelectorLogo provider={selected.provider} />
              </ModelSelectorLogoGroup>
              <ModelSelectorName>{selected.name}</ModelSelectorName>
              <span className="font-mono text-xs text-muted-foreground">
                {selected.context}
              </span>
            </Button>
          }
        />
        <ModelSelectorContent title="Choose a model">
          <ModelSelectorInput placeholder="Search models…" />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            <ModelSelectorGroup heading="Frontier">
              {frontier.map((model) => (
                <ModelSelectorItem
                  key={model.id}
                  onSelect={() => setSelected(model)}
                  value={model.name}
                >
                  <ModelSelectorLogo provider={model.provider} />
                  <ModelSelectorName>{model.name}</ModelSelectorName>
                  <span className="font-mono text-xs text-muted-foreground">
                    {model.context}
                  </span>
                  {model.shortcut ? (
                    <ModelSelectorShortcut>
                      {model.shortcut}
                    </ModelSelectorShortcut>
                  ) : null}
                </ModelSelectorItem>
              ))}
            </ModelSelectorGroup>
            <ModelSelectorSeparator />
            <ModelSelectorGroup heading="Fast">
              {fast.map((model) => (
                <ModelSelectorItem
                  key={model.id}
                  onSelect={() => setSelected(model)}
                  value={model.name}
                >
                  <ModelSelectorLogo provider={model.provider} />
                  <ModelSelectorName>{model.name}</ModelSelectorName>
                  <span className="font-mono text-xs text-muted-foreground">
                    {model.context}
                  </span>
                </ModelSelectorItem>
              ))}
            </ModelSelectorGroup>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    </div>
  );
}
