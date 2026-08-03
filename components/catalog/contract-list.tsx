import { ContractCard } from "@/components/catalog/contract-card"
import { designContracts } from "@/lib/contracts/catalog"

function ContractList() {
  return (
    <section
      id="contracts"
      data-slot="contract-list"
      data-site="platform"
      className="scroll-mt-14 px-4 py-14 md:px-6 md:py-20"
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border/70 pb-4">
          <div>
            <p className="font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
              Catalog
            </p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
              Systems — each with its own skin
            </h2>
          </div>
          <p className="max-w-xs font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-right">
            Preview panes use that contract&apos;s tokens. Open the page for the
            full experience.
          </p>
        </div>
        <ul className="flex flex-col gap-4">
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
