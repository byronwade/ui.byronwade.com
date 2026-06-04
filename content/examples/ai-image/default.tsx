import { Image } from "@/components/ai-elements/image";

// A tiny 1x1 transparent PNG used as a stand-in for an AI-generated image.
const PIXEL =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export default function Example() {
  return (
    <div className="flex min-h-[260px] items-center justify-center bg-background p-8">
      <figure className="flex w-72 flex-col gap-3">
        <Image
          base64={PIXEL}
          uint8Array={new Uint8Array()}
          mediaType="image/png"
          alt="A neon city skyline at dusk, generated from a text prompt"
          className="aspect-video"
        />
        <figcaption className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Generated image</span>
          <span className="font-mono text-xs">1024×576</span>
        </figcaption>
      </figure>
    </div>
  );
}
