import type { Metadata } from "next"

import { ContractSkillDetailPage } from "@/components/contracts/pages/skill-detail-page"
import { contractSkillSlugs } from "@/lib/contracts/routes"
import { getSkill } from "@/lib/skills/catalog"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return contractSkillSlugs("vellum").map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const skill = await getSkill(slug)
  if (!skill) return { title: "Skill" }
  return { title: skill.name, description: skill.description }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  return <ContractSkillDetailPage contractId="vellum" slug={slug} />
}
