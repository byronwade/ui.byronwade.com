import { QRCode } from "@/components/ui/qr-code";

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="size-44 rounded-xl border border-border p-3">
        <QRCode data="https://ui.byronwade.com" />
      </div>
    </div>
  );
}
