import { ContractCard } from "@/components/catalog/contract-card"
import { designContracts } from "@/lib/contracts/catalog"

function ContractList() {
  return (
    <section
      id="contracts"
      data-slot="contract-list"
      data-surface="marketing"
      className="scroll-mt-16 px-5 pb-8 md:px-8 md:pb-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Catalog
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              Systems under contract
            </h2>
          </div>
          <p className="hidden max-w-xs text-right text-sm text-muted-foreground sm:block">
            Soft previews of each grammar. Click a live contract to enter its
            film, theme, and proofs.
          </p>
        </div>
        <ul className="flex flex-col gap-4 sm:gap-5">
          {designContracts.map((contract, index) => (
            <li key={contract.id}>
              <ContractCard contract={contract} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export { ContractList }
