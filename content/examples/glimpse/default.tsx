import {
  Glimpse,
  GlimpseContent,
  GlimpseTrigger,
  GlimpseTitle,
  GlimpseDescription,
  GlimpseImage,
} from "@/components/ui/glimpse"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-10 text-sm">
      Read about{" "}
      <Glimpse>
        <GlimpseTrigger
          render={
            <a
              href="#"
              className="ml-1 text-brand underline-offset-4 hover:underline"
            >
              design tokens
            </a>
          }
        />
        <GlimpseContent className="w-72">
          <GlimpseImage src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=480&auto=format&fit=crop" />
          <GlimpseTitle>One variable re-skins everything</GlimpseTitle>
          <GlimpseDescription>
            Override --brand and rings, charts, and success states all follow.
          </GlimpseDescription>
        </GlimpseContent>
      </Glimpse>
    </div>
  )
}
