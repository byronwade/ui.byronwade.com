"use client"

import {
  InlineCitation,
  InlineCitationCard,
  InlineCitationCardBody,
  InlineCitationCardTrigger,
  InlineCitationCarousel,
  InlineCitationCarouselContent,
  InlineCitationCarouselHeader,
  InlineCitationCarouselIndex,
  InlineCitationCarouselItem,
  InlineCitationCarouselNext,
  InlineCitationCarouselPrev,
  InlineCitationQuote,
  InlineCitationSource,
  InlineCitationText,
} from "@/components/ai-elements/inline-citation"

const sources = [
  {
    url: "https://platform.openai.com/docs/models",
    title: "Model overview, OpenAI Platform",
    description:
      "A reference of the available models, their context windows, and recommended use cases for production workloads.",
    quote:
      "Larger context windows let the model reason over more of your documents in a single request.",
  },
  {
    url: "https://www.anthropic.com/research",
    title: "Research, Anthropic",
    description:
      "Publications on interpretability, alignment, and the behavior of large language models under real-world load.",
    quote:
      "Citations let an assistant ground each claim in a verifiable source rather than asserting it outright.",
  },
]

export default function Example() {
  return (
    <div className="flex min-h-[200px] items-center justify-center bg-background p-8">
      <p className="max-w-md text-sm leading-relaxed text-foreground">
        Modern assistants pair generated prose with grounded references, so a
        reader can hover a claim and inspect the underlying source{" "}
        <InlineCitation>
          <InlineCitationText>directly in the flow of text</InlineCitationText>
          <InlineCitationCard>
            <InlineCitationCardTrigger
              sources={sources.map((source) => source.url)}
            />
            <InlineCitationCardBody>
              <InlineCitationCarousel>
                <InlineCitationCarouselHeader>
                  <InlineCitationCarouselPrev />
                  <InlineCitationCarouselNext />
                  <InlineCitationCarouselIndex />
                </InlineCitationCarouselHeader>
                <InlineCitationCarouselContent>
                  {sources.map((source) => (
                    <InlineCitationCarouselItem key={source.url}>
                      <InlineCitationSource
                        title={source.title}
                        url={source.url}
                        description={source.description}
                      />
                      <InlineCitationQuote>{source.quote}</InlineCitationQuote>
                    </InlineCitationCarouselItem>
                  ))}
                </InlineCitationCarouselContent>
              </InlineCitationCarousel>
            </InlineCitationCardBody>
          </InlineCitationCard>
        </InlineCitation>
        .
      </p>
    </div>
  )
}
