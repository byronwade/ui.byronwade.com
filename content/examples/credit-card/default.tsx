import {
  CreditCard,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardBack,
  CreditCardChip,
  CreditCardName,
  CreditCardNumber,
  CreditCardExpiry,
  CreditCardCvv,
  CreditCardServiceProvider,
  CreditCardMagStripe,
} from "@/components/ui/credit-card"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <CreditCard>
        <CreditCardFlipper>
          <CreditCardFront>
            <CreditCardChip />
            <CreditCardName className="absolute bottom-7 text-sm">
              Byron Wade
            </CreditCardName>
            <CreditCardNumber className="absolute bottom-0">
              4242 4242 4242 4242
            </CreditCardNumber>
            <CreditCardServiceProvider type="Visa" />
          </CreditCardFront>
          <CreditCardBack>
            <CreditCardMagStripe />
            <CreditCardCvv className="absolute right-0 bottom-1/3 text-sm">
              123
            </CreditCardCvv>
            <CreditCardExpiry className="absolute bottom-0 text-xs">
              12 / 28
            </CreditCardExpiry>
          </CreditCardBack>
        </CreditCardFlipper>
      </CreditCard>
    </div>
  )
}
