import Link from "next/link"
import {
  Droplets,
  Zap,
  Wrench,
  PaintBucket,
  SprayCan,
  GraduationCap,
  Sparkles,
  HardHat,
  TreeDeciduous,
  ChefHat,
  Truck,
  Monitor,
  type LucideIcon,
} from "lucide-react"
import type { Category } from "@/lib/data"

const iconMap: Record<string, LucideIcon> = {
  Droplets,
  Zap,
  Wrench,
  PaintBucket,
  SprayCan,
  GraduationCap,
  Sparkles,
  HardHat,
  TreeDeciduous,
  ChefHat,
  Truck,
  Monitor,
}

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Wrench

  return (
    <Link
      href={`/search?category=${category.id}`}
      className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-7 w-7 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="font-semibold text-foreground">{category.name}</h3>
        <p className="text-sm text-muted-foreground">{category.count} providers</p>
      </div>
    </Link>
  )
}
