import { CenteredFocal } from "@/components/centered-focal";

export default function Example() {
  return (
    <CenteredFocal
      backdrop={
        <div className="size-64 rounded-full bg-brand/10" />
      }
    >
      <div className="text-center text-muted-foreground">Centerpiece content</div>
    </CenteredFocal>
  );
}
