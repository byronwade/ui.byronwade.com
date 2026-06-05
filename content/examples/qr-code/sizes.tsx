import { QRCode } from "@/components/ui/qr-code"

export default function Example() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-6 p-8">
      <QRCode data="https://ui.byronwade.com" size="sm" />
      <QRCode data="https://ui.byronwade.com" size="md" />
      <QRCode data="https://ui.byronwade.com" size="lg" />
    </div>
  )
}
