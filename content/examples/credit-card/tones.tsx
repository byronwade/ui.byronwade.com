import {
  CreditCard,
  CreditCardFront,
  CreditCardChip,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from "@/components/ui/credit-card"

const tones = ["default", "brand", "muted"] as const

export default function Example() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 p-8">
      {tones.map((tone) => (
        <CreditCard key={tone} tone={tone} className="w-72">
          <CreditCardFront>
            <CreditCardChip className="top-0 translate-y-0" />
            <CreditCardServiceProvider
              type="Visa"
              className="top-0 bottom-auto"
            />
            <CreditCardName className="absolute bottom-8 text-sm">
              Byron Wade
            </CreditCardName>
            <CreditCardNumber className="absolute bottom-0">
              4242 4242 4242 4242
            </CreditCardNumber>
          </CreditCardFront>
        </CreditCard>
      ))}
    </div>
  )
}
