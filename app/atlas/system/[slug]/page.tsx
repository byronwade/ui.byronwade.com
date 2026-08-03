import { ContractSystemDocLabPage } from "@/components/contracts/pages/system-doc-lab-page"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <ContractSystemDocLabPage contractId="atlas" slug={slug} />
}
