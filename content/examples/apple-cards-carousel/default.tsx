import { Carousel, Card } from "@/components/ui/apple-cards-carousel"

const DATA = [
  {
    category: "Product",
    title: "Ship faster with a design system.",
    src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
    content: (
      <p className="text-muted-foreground">Compose primitives, not pixels.</p>
    ),
  },
  {
    category: "Engineering",
    title: "Tokens that re-skin in one variable.",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    content: (
      <p className="text-muted-foreground">
        Override --brand and the system follows.
      </p>
    ),
  },
  {
    category: "Design",
    title: "Editorial typography by default.",
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
    content: (
      <p className="text-muted-foreground">Hierarchy from size and tracking.</p>
    ),
  },
]

export default function Example() {
  return (
    <Carousel
      items={DATA.map((card, index) => (
        <Card key={card.title} card={card} index={index} />
      ))}
    />
  )
}
